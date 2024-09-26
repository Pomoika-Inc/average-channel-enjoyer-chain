import "@stdlib/deploy";
import "@stdlib/ownable";
import "./ace_wallet";
import "./messages";
import "./utils";

struct JettonData {
    uri: String;
    decimals: Int as int8 = 0;
}

struct Metadata {
    total_supply: Int;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
}

contract AceMinter with Deployable, Ownable {
    
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
        let init: StateInit = initOf AceWallet(msg.rewarded, myAddress(), self.channelId);

        send(SendParameters{
            to: contractAddress(init),
            body: InternalAdd{
                queryId: msg.queryId,
                amount: msg.amount,
                origin: myAddress(),
                responseDestination: self.owner
            }.toCell(),
            value: calculateMsgValue(myBalance(), context().value),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data
        });
        self.totalSupply += msg.amount;
    }

    get fun jetton_data(): Metadata {
        return Metadata{
            total_supply: self.totalSupply,
            mintable: true,
            admin_address: self.owner,
            jetton_content: self.data.toCell(),
            jetton_wallet_code: initOf AceWallet(myAddress(), self.owner, self.channelId).code
        };
    }

    get fun balance(): Int {
        return myBalance();
    }
}

message Mint {
    queryId: Int as uint64;
    amount: Int as coins;
    rewarded: Address;
}
