import "@stdlib/deploy";
import "@stdlib/ownable";

struct JettonData {
    uri: String;
    decimals: Int as int8 = 0;
}

contract AceMinter with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.01");
    
    owner: Address;
    channelId: Int as int64;
    totalSupply: Int as coins = 0;
    data: JettonData;

    init(channelId: Int, uri: String) {
        self.owner = sender();
        self.channelId = channelId;
        self.data = JettonData{uri};
    }

    receive(msg: Mint) {
        self.requireOwner();
        // self.mint(msg.amount, self.owner);
    }
}

message Mint {
    queryId: Int;
    amount: Int as coins;
    rewarded: Address;
}
