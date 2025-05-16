module ticket_nft::ticketing {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use std::option;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;

    // TODOs 1: set collection name, description, URI, SEED to create the resource account and TICKET_PRICE constants
    const COLLECTION_NAME: vector<u8> = b"";
    const COLLECTION_DESCRIPTION: vector<u8> = b"";
    const COLLECTION_URI: vector<u8> = b"";
    const SEED: vector<u8> = b"";
    const TICKET_PRICE: u64 = 0;

    // TODOs 2: set the error codes. change the zero to the correct error codes you want to use
    const E_NOT_AUTHORIZED: u64 = 0;
    const E_TICKET_USED: u64 = 0;
    const E_TICKET_NOT_FOUND: u64 = 0;
    const E_TICKET_LIMIT_REACHED: u64 = 0;
    const E_ACCOUNT_DOES_NOT_EXIST: u64 = 0;
    const E_INSUFFICIENT_FUNDS: u64 = 0;

    // Struct to store the SignerCapability for the resource account
    struct ResourceAccountCap has key {
        signer_cap: SignerCapability,
    }

    // TODOs 3: define the TicketState struct to store information about all ticket minted by this contract, It should include:
    // admin
    // ticket_counter: number of tickets minted
    // max_tickets: maximum number of tickets
    // token_addresses: mapping of ticket_id to token address
    // mint_events: event handle for mint events
    // transfer_events: event handle for transfer events
    // validation_events: event handle for validation events
    struct TicketState has key {
    }

    // TODOs 4: define the TicketInfo struct to store information about each ticket. It should include:
    // ticket_id: unique identifier for the ticket
    // metadata_hash: hash of the off-chain metadata (e.g., IPFS CID)
    // event_id: unique event identifier
    // is_used: whether the ticket has been validated
    // owner: current owner
    // is_soulbound: whether the ticket is soulbound
    // purchase_time: time of purchase
    // usage_time: time of usage
    struct TicketInfo has store, copy, drop,key {
    }

    // Events
    #[event]
    // TODOs 5: define the TicketMintEvent struct to store information about mint events. It should include:
    // ticket_id: unique identifier for the ticket
    // owner: address of the ticket owner
    // event_id: unique event identifier
    // is_soulbound: whether the ticket is soulbound
    struct TicketMintEvent has drop, store {
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

    // TODOs 6: create the init_module function to initialize the module. It should:
    // - Create a resource account
    // - Register the resource account to receive APT
    // - Create the collection under the resource account
    // - Initialize TicketState under the resource account
    // - Store the SignerCapability under the admin's address
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);

        // Create resource account

        // Register the resource account to receive APT

        // Create the collection under the resource account

        // Initialize TicketState under the resource account

        // Store the SignerCapability under the admin's address
    }

    // TODOs 7: create a function to mint a soulbound ticket. It should:
    // - Check if the user has enough APT
    // - Create the ticket under the resource account
    // - Store the TicketInfo under the token's address
    // - Store the token address in the TicketState
    // - Transfer the token to the user
    // - Emit a mint event
    // - Increment the ticket counter
    public entry fun mint_soulbound_ticket(
        user: &signer,
        event_id: u64,
        metadata_hash: String,
        token_name: String,
        token_uri: String
    ) acquires TicketState, ResourceAccountCap {
        let user_addr = signer::address_of(user);

        // get the resource account address

        // get the ticket state from the resource account

        // Handle payment and check if the user has enough MOVE

        // get the new ticket ID from the state using the ticket counter

        // Check if user address exists and abort if not

        // Mint the NFT under the resource account by gettting the resource signer and using the token::create function

        // Get the token object and signer using constructor_ref

        // Make the token soulbound by getting transfer ref and disabling ungated transfer

        // define the ticket info using the TicketInfo struct

        // Store TicketInfo at the token's address

        // Store token address in state.token_addresses

        // Emit mint event

        state.ticket_counter = state.ticket_counter + 1;
    }

   // TODOs 8: create a function to mint a transferable ticket. It should:
    // - Check if the user has enough APT
    // - Create the ticket under the resource account
    // - Store the TicketInfo under the token's address
    // - Store the token address in the TicketState
    // - Emit a mint event
    // - Transfer the token to the user
    public entry fun mint_transferable_ticket(
        user: &signer,
        event_id: u64,
        metadata_hash: String,
        token_name: String,
        token_uri: String
    ) acquires TicketState, ResourceAccountCap {
        let user_addr = signer::address_of(user);
        // get the resource account address

        // get the ticket state from the resource account

        // Handle payment and check if the user has enough MOVE

        // get the new ticket ID from the state using the ticket counter

        // Check if user address exists and abort if not

        // Mint the NFT under the resource account by gettting the resource signer and using the token::create function

        // Get the token object and signer using constructor_ref

        // get the transfer ref and transfer the NFT to the user

        // define the ticket info using the TicketInfo struct

        // Store TicketInfo at the token's address

        // Store token address in state.token_addresses

        // Emit mint event

        state.ticket_counter = state.ticket_counter + 1;
    }

    // TODOs 9: create a function to transfer a ticket. It should:
    // - Check if the user is the owner of the ticket
    // - Check if the ticket is not used
    // - Check if the ticket is not soulbound
    // - Transfer the token to the receiver
    public entry fun transfer_ticket(
        owner: &signer,
        receiver: address,
        token_address: Object<Token>
    ) acquires TicketState, TicketInfo {
        let owner_addr = signer::address_of(owner);

        // Verify the token exists and borrow TicketInfo
        let addr_token = object::object_address(&token_address);
        assert!(object::is_object(addr_token), error::not_found(E_TICKET_NOT_FOUND));
        let ticket = borrow_global_mut<TicketInfo>(object::object_address(&token_address));

        // check if caller is the owner of the ticket

        // check if the ticket is not used

        // check if the ticket is not soulbound

        // Update owner

        // Transfer the token object

        // get the resource account address

        // get the ticket state from the resource account

        // Emit transfer event
    }

    // TODOs 10: create a function to validate a ticket. It should:
    // - Check if the user is the owner of the ticket
    // - Check if the ticket is not used
    // - Update the ticket as used
    // - Emit a validation event
    // - Update the usage time
    public entry fun validate_ticket(
        user: &signer,
        token_address: Object<Token>
    ) acquires TicketInfo, TicketState {
        let user_addr = signer::address_of(user);

        // Verify the token exists and borrow TicketInfo
        let addr_token = object::object_address(&token_address);
        assert!(object::is_object(addr_token), error::not_found(E_TICKET_NOT_FOUND));
        let ticket = borrow_global_mut<TicketInfo>(object::object_address(&token_address));

        // Check if the caller is the owner of the ticket

        // Check if the ticket is not used

        // Update ticket as used

        // Update usage time

        // get the resource account address

        // get the ticket state from the resource account

        // Emit transfer event
    }

    // Helper Functions

    // TODOs 11: create a function to get the resource address using an address and a seed
    inline fun get_resource_address(account: address): address {
    }

    // TODOs 12: create a function to get the resource signer using the resource account signer capability
    inline fun get_resource_signer(): signer acquires ResourceAccountCap {
    }

    fun assert_ticket_limit_not_reached(state: &TicketState) {
        assert!(state.ticket_counter < state.max_tickets, error::invalid_state(E_TICKET_LIMIT_REACHED));
    }

    // TODOs 13: create a function to check if the user address has enough MOVE using the Coin module
    fun assert_user_has_enough_apt(user_addr: address, amount: u64) {
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
    // TODOs 14: create a function to get the ticket information using the token address
    public fun get_ticket_status(token_address: Object<Token>): (bool, address, u64, String, bool) acquires TicketInfo {
    }

    #[view]
    public fun get_ticket_count(): u64 acquires TicketState {
        let resurce_address = get_resource_address(@ticket_nft);
        let state = borrow_global<TicketState>(resurce_address);
        state.ticket_counter
    }

    #[view]
    // TODOs 15: create a function to get tickets owned by a user. It should:
    // - Get the resource account address
    // - Get the ticket state from the resource account
    // - Iterate through the token addresses in the state
    // - Check if the token exists and borrow TicketInfo
    // - Check if the ticket owner is the user
    // - Add the ticket to the user_tickets vector
    // - Return the user_tickets vector
    // - Use the vector::push_back function to add tickets to the vector
    public fun get_tickets_by_user(user_addr: address): vector<TicketInfo> acquires TicketState, TicketInfo {
    }
}