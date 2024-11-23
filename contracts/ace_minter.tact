import "@stdlib/deploy";
import "@stdlib/ownable";
import "./ace_wallet";
import "./messages";
import "./utils";

struct JettonData {
    uri: String;
    // decimals: Int as int8 = 0;
    // amount_style: String = "n";
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
    data: JettonData = JettonData{uri: ""};

    init(owner: Address, channelId: Int) {
        self.owner = owner;
        self.channelId = channelId;
    }

    receive(msg: Mint) {
        self.requireOwner();
        let init: StateInit = initOf AceWallet(msg.rewarded, myAddress());

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

    bounced(msg: bounced<InternalAdd>) {
        self.totalSupply -= msg.amount;

        // TODO: notify the owner
    }

    get fun jetton_data(): Metadata {
        return Metadata{
            total_supply: self.totalSupply,
            mintable: true,
            admin_address: self.owner,
            jetton_content: self.data.toCell(),
            jetton_wallet_code: initOf AceWallet(self.owner, myAddress()).code
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
