interface NFTProperty {
  trait_type: string
  value: string
  rarity: number
}

interface NFTHistoryEvent {
  event: string
  from: string
  to: string
  price?: number
  date: string
}

export interface NFT {
  id: string
  name: string
  collection: string
  description: string
  image: string
  price: number
  owner: string
  contractAddress: string
  tokenId: string
  badge?: string
  properties: NFTProperty[]
  history: NFTHistoryEvent[]
}

const nfts: NFT[] = [
  {
    id: "1",
    name: "Cosmic Perspective #24",
    collection: "Cosmic Series",
    description:
      "A mesmerizing digital artwork that captures the vastness of the cosmos through vibrant colors and intricate details. This piece invites viewers to contemplate their place in the universe.",
    image: "/placeholder.svg?height=500&width=500",
    price: 1.5,
    owner: "ArtistX",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "24",
    badge: "New",
    properties: [
      { trait_type: "Style", value: "Abstract", rarity: 15 },
      { trait_type: "Color Palette", value: "Cosmic", rarity: 8 },
      { trait_type: "Dimensions", value: "3000x3000", rarity: 25 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "ArtistX", date: "2023-12-01" },
      { event: "Listed", from: "ArtistX", to: "Marketplace", price: 1.5, date: "2023-12-05" },
    ],
  },
  {
    id: "2",
    name: "Digital Dreams #12",
    collection: "Dream Collection",
    description:
      "An exploration of the subconscious mind through digital art. This piece blends surrealism with digital techniques to create a dreamlike landscape that feels both familiar and otherworldly.",
    image: "/placeholder.svg?height=500&width=500",
    price: 2.3,
    owner: "CryptoCreator",
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    tokenId: "12",
    badge: "Hot",
    properties: [
      { trait_type: "Style", value: "Surrealism", rarity: 12 },
      { trait_type: "Technique", value: "Digital Painting", rarity: 20 },
      { trait_type: "Theme", value: "Dreams", rarity: 5 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "DigitalArtist", date: "2023-11-15" },
      { event: "Sold", from: "DigitalArtist", to: "Collector1", price: 1.8, date: "2023-11-20" },
      { event: "Listed", from: "Collector1", to: "Marketplace", price: 2.3, date: "2023-12-01" },
    ],
  },
  {
    id: "3",
    name: "Abstract Realms",
    collection: "Abstract Collection",
    description:
      "A bold exploration of form and color, this abstract piece challenges perceptions and invites multiple interpretations. The dynamic composition creates a sense of movement and energy.",
    image: "/placeholder.svg?height=500&width=500",
    price: 0.8,
    owner: "DigitalArtist",
    contractAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    tokenId: "5",
    properties: [
      { trait_type: "Style", value: "Abstract", rarity: 15 },
      { trait_type: "Medium", value: "Digital", rarity: 30 },
      { trait_type: "Color Scheme", value: "Vibrant", rarity: 10 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "DigitalArtist", date: "2023-10-05" },
      { event: "Listed", from: "DigitalArtist", to: "Marketplace", price: 0.8, date: "2023-10-10" },
    ],
  },
  {
    id: "4",
    name: "Neon Wilderness",
    collection: "Cyberpunk Series",
    description:
      "A cyberpunk-inspired landscape that blends natural elements with futuristic neon aesthetics. This piece explores the intersection of nature and technology in a dystopian future.",
    image: "/placeholder.svg?height=500&width=500",
    price: 3.2,
    owner: "FutureVisions",
    contractAddress: "0xef1234567890abcdef1234567890abcdef123456",
    tokenId: "17",
    badge: "Trending",
    properties: [
      { trait_type: "Style", value: "Cyberpunk", rarity: 8 },
      { trait_type: "Lighting", value: "Neon", rarity: 12 },
      { trait_type: "Setting", value: "Urban Jungle", rarity: 5 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "FutureVisions", date: "2023-09-20" },
      { event: "Listed", from: "FutureVisions", to: "Marketplace", price: 3.2, date: "2023-09-25" },
    ],
  },
  {
    id: "5",
    name: "Pixel Perfection",
    collection: "Retro Gaming",
    description:
      "A nostalgic tribute to the golden age of pixel art and retro gaming. This meticulously crafted piece features pixel-perfect details that evoke the charm of classic video games.",
    image: "/placeholder.svg?height=500&width=500",
    price: 1.1,
    owner: "8BitWizard",
    contractAddress: "0x90abcdef1234567890abcdef1234567890abcdef",
    tokenId: "42",
    properties: [
      { trait_type: "Style", value: "Pixel Art", rarity: 18 },
      { trait_type: "Era", value: "8-bit", rarity: 15 },
      { trait_type: "Theme", value: "Gaming", rarity: 20 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "8BitWizard", date: "2023-11-01" },
      { event: "Listed", from: "8BitWizard", to: "Marketplace", price: 1.1, date: "2023-11-05" },
    ],
  },
  {
    id: "6",
    name: "Ethereal Echoes",
    collection: "Dreamscapes",
    description:
      "A hauntingly beautiful composition that captures the ephemeral nature of memories and dreams. Soft colors and flowing forms create a sense of tranquility and contemplation.",
    image: "/placeholder.svg?height=500&width=500",
    price: 2.7,
    owner: "DreamWeaver",
    contractAddress: "0x567890abcdef1234567890abcdef1234567890ab",
    tokenId: "31",
    properties: [
      { trait_type: "Style", value: "Ethereal", rarity: 7 },
      { trait_type: "Mood", value: "Contemplative", rarity: 12 },
      { trait_type: "Technique", value: "Digital Watercolor", rarity: 9 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "DreamWeaver", date: "2023-10-15" },
      { event: "Listed", from: "DreamWeaver", to: "Marketplace", price: 2.7, date: "2023-10-20" },
    ],
  },
  {
    id: "7",
    name: "Quantum Quasar",
    collection: "Cosmic Series",
    description:
      "An exploration of quantum physics and cosmic phenomena through digital art. This piece visualizes the invisible forces that shape our universe in vibrant, dynamic forms.",
    image: "/placeholder.svg?height=500&width=500",
    price: 1.8,
    owner: "CosmicCreator",
    contractAddress: "0xcdef1234567890abcdef1234567890abcdef1234",
    tokenId: "9",
    properties: [
      { trait_type: "Style", value: "Cosmic", rarity: 10 },
      { trait_type: "Theme", value: "Quantum Physics", rarity: 5 },
      { trait_type: "Color Scheme", value: "Spectral", rarity: 8 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "CosmicCreator", date: "2023-09-10" },
      { event: "Listed", from: "CosmicCreator", to: "Marketplace", price: 1.8, date: "2023-09-15" },
    ],
  },
  {
    id: "8",
    name: "Urban Legends",
    collection: "City Life",
    description:
      "A dynamic representation of modern urban life, capturing the energy and complexity of city environments. This piece blends architectural elements with human stories.",
    image: "/placeholder.svg?height=500&width=500",
    price: 1.4,
    owner: "UrbanArtist",
    contractAddress: "0x34567890abcdef1234567890abcdef1234567890",
    tokenId: "15",
    properties: [
      { trait_type: "Style", value: "Urban", rarity: 15 },
      { trait_type: "Setting", value: "Cityscape", rarity: 20 },
      { trait_type: "Time", value: "Night", rarity: 12 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "UrbanArtist", date: "2023-11-25" },
      { event: "Listed", from: "UrbanArtist", to: "Marketplace", price: 1.4, date: "2023-11-30" },
    ],
  },
  {
    id: "9",
    name: "Digital Flora",
    collection: "Nature Reimagined",
    description:
      "A stunning digital interpretation of botanical forms, this piece reimagines natural flora through a technological lens. The intricate details showcase the beauty of both natural and digital creation.",
    image: "/placeholder.svg?height=500&width=500",
    price: 1.9,
    owner: "NatureDigital",
    contractAddress: "0x67890abcdef1234567890abcdef1234567890abc",
    tokenId: "27",
    properties: [
      { trait_type: "Style", value: "Digital Botanical", rarity: 6 },
      { trait_type: "Subject", value: "Flora", rarity: 15 },
      { trait_type: "Technique", value: "Fractal Generation", rarity: 8 },
    ],
    history: [
      { event: "Minted", from: "0x0000", to: "NatureDigital", date: "2023-10-25" },
      { event: "Listed", from: "NatureDigital", to: "Marketplace", price: 1.9, date: "2023-10-30" },
    ],
  },
]

export function getNFTs(): NFT[] {
  return nfts
}

export function getNFTById(id: string): NFT | undefined {
  return nfts.find((nft) => nft.id === id)
}

