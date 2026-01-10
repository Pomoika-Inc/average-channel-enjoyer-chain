message Excesses {
    queryId: Int as uint64;
}

message SetAdmin {
    queryId: Int as uint64;
    admin: Address;
}

// Minter
message InternalAdd {
    queryId: Int as uint64;
    amount: Int as coins;
    origin: Address;
    responseDestination: Address;
    forwardContent: String?;
}

message Burn {
    queryId: Int as uint64;
    owner: Address;
    buyer: Address;

    channelId: Int as int64;
    moulderId: Int as uint32;

    startIndex: Int as uint32;
    quantity: Int as uint32;
    price: Int as coins;

    content: MoulderContent;
}

// Moulder

struct MoulderContent {
    name: String;
    description: String;
    imageUrl: String;
}

message Mould {
    queryId: Int as uint64;
    receiver: Address;
    quantity: Int as uint32;
    price: Int as coins;
    maxQuantity: Int as uint32;
}
