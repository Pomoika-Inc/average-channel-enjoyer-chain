
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

