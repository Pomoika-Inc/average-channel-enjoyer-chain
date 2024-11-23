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

/** Channel's goods' templates creator */ 
contract AceManufactory with Deployable, Adminable {
    owner: Address;
    admin: Address? = null;
    channelId: Int as int64;

    nextMoulderIndex: Int as uint32 = 0;

    init(owner: Address, channelId: Int) {
        self.owner = owner;
        self.channelId = channelId;
    }

    receive(msg: CreateMoulder) {
        self.requireAdmin();

        let value = calculateMsgValue(myBalance(), context().value) / 2;
        // Check if there are enough funds to create a new moulder and merchant
        require(value - MIN_TON_FOR_STORAGE >= 0, ERROR_NOT_ENOUGH_FUNDS);
        let myAddress = myAddress();

        let moulder = initOf AceMoulder(myAddress, self.channelId, self.nextMoulderIndex);
        let merchant = initOf AceMerchant(myAddress, self.channelId, self.nextMoulderIndex);

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

    receive(msg: SwitchMoulderState) {
        require(msg.moulderId < self.nextMoulderIndex, "Moulder doesn't exist");
        self.requireOwner();

        let value = (context().value - GAS_CONSUMPTION);
        require(value > 0, ERROR_NOT_ENOUGH_FUNDS);

        let moulder = contractAddress(initOf AceMoulder(myAddress(), self.channelId, msg.moulderId));

        send(SendParameters{
            to: moulder,
            body: msg.target ? RESUME_COMMENT : STOP_COMMENT,
            value: value,
            mode: SendIgnoreErrors
        });
    }

    get fun manufactoryInfo(): ManufactoryInfo {
        return ManufactoryInfo{
            channelId: self.channelId,
            admin: self.admin,
            mouldersCount: self.nextMoulderIndex
        };
    }
}
