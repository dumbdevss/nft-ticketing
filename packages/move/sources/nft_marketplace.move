module ticket_nft::ticketing {
       use std::error;
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use std::option;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;


    // Collection constants
    const COLLECTION_NAME: vector<u8> = b"Event Tickets";
    const COLLECTION_DESCRIPTION: vector<u8> = b"NFT tickets for events, soulbound or transferable.";
    const COLLECTION_URI: vector<u8> = b"https://example.com/ticket_collection.jpg";
    const SEED: vector<u8> = b"ticket_nft_resource";
    const TICKET_PRICE: u64 = 100000000;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_TICKET_USED: u64 = 2;
    const E_TICKET_NOT_FOUND: u64 = 3;
    const E_TICKET_LIMIT_REACHED: u64 = 4;
    const E_ACCOUNT_DOES_NOT_EXIST: u64 = 5;
    const E_INSUFFICIENT_FUNDS: u64 = 6;

    // Struct to store the Signercapability for the resource account
    struct ResourceAccountCap has key {
        signer_cap: account::SignerCapability,
    }

    // Struct to track ticket collection state
    struct TicketState has key {
        admin: address,
        ticket_counter: u64,
        max_tickets: u64, // Added to limit total tickets
        tickets: Table<u64, TicketInfo>,
        ticket_vec: vector<TicketInfo>,
        mint_events: EventHandle<TicketMintEvent>,
        transfer_events: EventHandle<TicketTransferEvent>,
        validation_events: EventHandle<TicketValidationEvent>,
    }

    // Struct for ticket info
    struct TicketInfo has store, copy {
        metadata_hash: vector<u8>, // Hash of off-chain metadata (e.g., IPFS CID)
        event_id: u64,             // Unique event identifier
        is_used: bool,             // Whether the ticket has been validated
        owner: address,            // Current owner
        is_soulbound: bool,        // Whether the ticket is soulbound
        purchase_time: u64,
        usage_time: u64,
    }

    // Events
    #[event]
    struct TicketMintEvent has drop, store {
        ticket_id: u64,
        owner: address,
        event_id: u64,
        is_soulbound: bool,
    }

    #[event]
    struct TicketTransferEvent has drop, store {
        ticket_id: u64,
        from: address,
        to: address,
    }

    #[event]
    struct TicketValidationEvent has drop, store {
        ticket_id: u64,
        owner: address,
    }

    // Initialize the module and create a resource account
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);

        // Create resource account
        let (resource_signer, signer_cap) = account::create_resource_account(admin, SEED);

        // Register the resource account to receive APT
        if (!coin::is_account_registered<AptosCoin>(admin_addr)) {
            coin::register<AptosCoin>(admin);
        };

        // Create the collection under the resource account
        collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_NAME),
            option::none(),
            string::utf8(COLLECTION_URI),
        );

        // Initialize TicketState under the resource account
        move_to(&resource_signer, TicketState {
            admin: admin_addr,
            ticket_counter: 0,
            max_tickets: 1000, // Example limit, adjust as needed
            tickets: table::new(),
            ticket_vec: vector::empty(),
            mint_events: account::new_event_handle<TicketMintEvent>(&resource_signer),
            transfer_events: account::new_event_handle<TicketTransferEvent>(&resource_signer),
            validation_events: account::new_event_handle<TicketValidationEvent>(&resource_signer),
        });

        // Store the Signercapability under the admin's address
        move_to(admin, ResourceAccountCap {
            signer_cap,
        });
    }

    // Mint a soulbound ticket (called by user)
    public entry fun mint_soulbound_ticket(
        user: &signer,
        event_id: u64,
        metadata_hash: vector<u8>,
        token_name: String,
        token_uri: String
    ) acquires TicketState, ResourceAccountCap {
        let user_addr = signer::address_of(user);
        let resources_address = get_resource_address(@ticket_nft);
        let state = borrow_global_mut<TicketState>(resources_address);
        assert_ticket_limit_not_reached(state);

        // Handle payment
        assert_user_has_enough_apt(user_addr, TICKET_PRICE);
        let payment = coin::withdraw<AptosCoin>(user, TICKET_PRICE);
        coin::deposit<AptosCoin>(@ticket_nft, payment);

        let ticket_id = state.ticket_counter;

        // Create account if it doesnt exist
        if (!account::exists_at(user_addr)) {
            abort E_ACCOUNT_DOES_NOT_EXIST;
        };

        // Mint the NFT under the resource account (assuming admin deploys, user triggers)
        let resource_signer = get_resource_signer();
        let constructor_ref = token::create(
            &resource_signer,
            string::utf8(COLLECTION_NAME),
            string::utf8(b"Soulbound Event Ticket"),
            token_name,
            option::none(),
            token_uri,
        );

        // Make it soulbound
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, user_addr);
        object::disable_ungated_transfer(&transfer_ref);

        let ticket_info = TicketInfo {
            metadata_hash,
            event_id,
            is_used: false,
            owner: user_addr,
            is_soulbound: true,
            purchase_time: timestamp::now_seconds(),
            usage_time: 0
        };

        // Store ticket info
        table::add(&mut state.tickets, ticket_id, ticket_info);
        vector::push_back(&mut state.ticket_vec, ticket_info);

        // Emit mint event
        event::emit_event(&mut state.mint_events, TicketMintEvent {
            ticket_id,
            owner: user_addr,
            event_id,
            is_soulbound: true,
        });

        state.ticket_counter = state.ticket_counter + 1;
    }

    // Mint a transferable ticket (called by user)
    public entry fun mint_transferable_ticket(
        user: &signer,
        event_id: u64,
        metadata_hash: vector<u8>,
        token_name: String,
        token_uri: String
    ) acquires TicketState, ResourceAccountCap {
        let user_addr = signer::address_of(user);
        let resources_address = get_resource_address(@ticket_nft);
        let state = borrow_global_mut<TicketState>(resources_address);
        assert_ticket_limit_not_reached(state);

        // Handle payment
        assert_user_has_enough_apt(user_addr, TICKET_PRICE);
        let payment = coin::withdraw<AptosCoin>(user, TICKET_PRICE);
        coin::deposit<AptosCoin>(@ticket_nft, payment);

        let ticket_id = state.ticket_counter;

        // Create account if it doesnt exist
        if (!account::exists_at(user_addr)) {
            abort E_ACCOUNT_DOES_NOT_EXIST;
        };

        // Mint the NFT under the resource account
        let resource_signer = get_resource_signer();
        let constructor_ref = token::create(
            &resource_signer,
            string::utf8(COLLECTION_NAME),
            string::utf8(b"Transferable Event Ticket"),
            token_name,
            option::none(),
            token_uri,
        );

        // Keep it transferable
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, user_addr);

        let ticket_info = TicketInfo {
            metadata_hash,
            event_id,
            is_used: false,
            owner: user_addr,
            is_soulbound: false,
            purchase_time: timestamp::now_seconds(),
            usage_time: 0
        };

        // Store ticket info
        table::add(&mut state.tickets, ticket_id, ticket_info);

        vector::push_back(&mut state.ticket_vec, ticket_info);

        // Emit mint event
        event::emit_event(&mut state.mint_events, TicketMintEvent {
            ticket_id,
            owner: user_addr,
            event_id,
            is_soulbound: false,
        });

        state.ticket_counter = state.ticket_counter + 1;
    }

    // Transfer a ticket
    public entry fun transfer_ticket(
        owner: &signer,
        receiver: address,
        ticket_id: u64
    ) acquires TicketState {
        let owner_addr = signer::address_of(owner);
        let resources_address = get_resource_address(@ticket_nft);
        let state = borrow_global_mut<TicketState>(resources_address);
        assert_ticket_exists(state, ticket_id);

        let ticket = table::borrow_mut(&mut state.tickets, ticket_id);
        assert_ticket_owner(ticket, owner_addr);
        assert_ticket_not_used(ticket);
        assert_ticket_transferable(ticket);

        ticket.owner = receiver;

        // Emit transfer event
        event::emit_event(&mut state.transfer_events, TicketTransferEvent {
            ticket_id,
            from: owner_addr,
            to: receiver,
        });
    }

    // Validate a ticket
    public entry fun validate_ticket(
        user: &signer,
        ticket_id: u64
    ) acquires ResourceAccountCap, TicketState {
        let user_addr = signer::address_of(user);

        let resource_signer = get_resource_signer();
        let resource_address = get_resource_address(@ticket_nft);

        let state = borrow_global_mut<TicketState>(resource_address);
        assert_ticket_exists(state, ticket_id);

        let ticket = table::borrow_mut(&mut state.tickets, ticket_id);
        assert_ticket_not_used(ticket);

        ticket.is_used = true;
        ticket.usage_time = timestamp::now_seconds();

        // Emit validation event
        event::emit_event(&mut state.validation_events, TicketValidationEvent {
            ticket_id,
            owner: ticket.owner,
        });
    }

    // Helper Functions
    inline fun get_resource_address(account: address): address {
        account::create_resource_address(&account, SEED)
    }

    inline fun get_resource_signer(): signer acquires ResourceAccountCap {
        let cap = borrow_global<ResourceAccountCap>(@ticket_nft); // Assuming admin is module deployer
        account::create_signer_with_capability(&cap.signer_cap)
    }
    fun assert_ticket_limit_not_reached(state: &TicketState) {
        assert!(state.ticket_counter < state.max_tickets, error::invalid_state(E_TICKET_LIMIT_REACHED));
    }

    fun assert_ticket_exists(state: &TicketState, ticket_id: u64) {
        assert!(table::contains(&state.tickets, ticket_id), error::not_found(E_TICKET_NOT_FOUND));
    }

    fun assert_user_has_enough_apt(user_addr: address, amount: u64) {
        assert!(coin::balance<AptosCoin>(user_addr) >= amount, error::invalid_state(E_INSUFFICIENT_FUNDS));
    }

    fun assert_ticket_owner(ticket: &TicketInfo, owner_addr: address) {
        assert!(ticket.owner == owner_addr, error::permission_denied(E_NOT_AUTHORIZED));
    }

    fun assert_ticket_not_used(ticket: &TicketInfo) {
        assert!(!ticket.is_used, error::invalid_state(E_TICKET_USED));
    }

    fun assert_ticket_transferable(ticket: &TicketInfo) {
        assert!(!ticket.is_soulbound, error::invalid_state(E_NOT_AUTHORIZED));
    }

    // View Functions
    #[view]
    public fun get_ticket_status(ticket_id: u64): (bool, address, u64, vector<u8>, bool) acquires TicketState {
        let state = borrow_global<TicketState>(@ticket_nft);
        assert_ticket_exists(state, ticket_id);

        let ticket = table::borrow(&state.tickets, ticket_id);
        (ticket.is_used, ticket.owner, ticket.event_id, ticket.metadata_hash, ticket.is_soulbound)
    }

    #[view]
    public fun get_ticket_count(): u64 acquires TicketState {
        let state = borrow_global<TicketState>(@ticket_nft);
        state.ticket_counter
    }


    #[view]
    public fun get_tickets_by_user(user_addr: address): vector<TicketInfo> acquires TicketState {
        let resource_address = get_resource_address(@ticket_nft);
        let state = borrow_global<TicketState>(resource_address);
        let tickets = &state.ticket_vec;

        let user_tickets = vector[];

        let i = 0;
        while (i < vector::length(tickets)) {
            let ticket = vector::borrow(tickets, i);
            if (ticket.owner == user_addr) {
                vector::push_back(&mut user_tickets, *ticket);
            };
            i = i + 1;
        };

        user_tickets
    }

}