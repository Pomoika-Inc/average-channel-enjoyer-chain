import "@stdlib/deploy";
import "@stdlib/ownable";
import "./ace_moulder";
import "./ace_merchant";
import "./utils";

struct ManufactoryInfo {
    channelId: Int as int64;
    admin: Address?;
    mouldersCount: Int as uint32;
}

message CreateMoulder {
    queryId: Int as uint64;
}

/** Channel's goods' templates creator */ 
contract AceManufactory with Deployable, Maintainable, Adminable {
    owner: Address;
    creator: Address;
    admin: Address? = null;
    channelId: Int as int64;

    nextMoulderIndex: Int as uint32 = 0;

    init(owner: Address, channelId: Int) {
        self.owner = owner;
        self.creator = owner;
        self.channelId = channelId;
    }

    receive(msg: CreateMoulder) {
        self.requireAdmin();

        let value = calculateMsgValueWithGas(myBalance(), context().value, GAS_CONSUMPTION * 3) / 2;
        // Check if there are enough funds to create a new moulder and merchant
        require(value - MIN_TON_FOR_STORAGE - GAS_CONSUMPTION * 4 >= 0, ERROR_NOT_ENOUGH_FUNDS);

        let moulder = initOf AceMoulder(self.owner, self.channelId, self.nextMoulderIndex);
        let merchant = initOf AceMerchant(self.owner, self.channelId, self.nextMoulderIndex);

        send(SendParameters{
            to: contractAddress(moulder),
            body: SetAdmin{
                queryId: msg.queryId,
                admin: self.admin!!
            }.toCell(),
            value: value,
            mode: SendBounceIfActionFail,
            code: moulder.code,
            data: moulder.data
        });
        
        send(SendParameters{
            to: contractAddress(merchant),
            body: SetAdmin{
                queryId: msg.queryId,
                admin: self.admin!!
            }.toCell(),
            value: value,
            mode: SendBounceIfActionFail,
            code: merchant.code,
            data: merchant.data
        });

        self.nextMoulderIndex += 1;
    }

    get fun manufactoryInfo(): ManufactoryInfo {
        return ManufactoryInfo{
            channelId: self.channelId,
            admin: self.admin,
            mouldersCount: self.nextMoulderIndex
        };
    }
}
