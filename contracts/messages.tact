
message InternalAdd {
    queryId: Int as uint64;
    amount: Int as coins;
    origin: Address;
    responseDestination: Address;
    forwardContent: String?;
}

message Excesses {
    queryId: Int as uint64;
}

message SetAdmin {
    queryId: Int as uint64;
    admin: Address;
}

// Manufactory
message CreateMoulder {
    queryId: Int as uint64;
}

message ApproveMoulding {
    queryId: Int as uint64;
    moulderId: Int as uint32;
}

// Moulder
struct MoulderContent {
    name: String;
    description: String;
    imageUrl: String;
}

message SetContent {
    queryId: Int as uint64;
    content: MoulderContent;
}

message DisableMoulder {
    queryId: Int as uint64;
}

message Mould {
    queryId: Int as uint64;
    receiver: Address;
    responseDestination: Address;
}

// Merchant
message SetPriceTag {
    queryId: Int as uint64;
    price: Int as coins;
    quantity: Int as uint32;
}

message CancelSales {
    queryId: Int as uint64;
}
