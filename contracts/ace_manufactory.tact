import "@stdlib/deploy";
import "@stdlib/ownable";
import "./ace_moulder";
import "./ace_merchant";
import "./utils";

// Channel goods templates creator
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

        let value = calculateMsgValue(myBalance(), context().value);
        // Check if there are enough funds to create a new moulder and merchant
        require((value - MIN_TON_FOR_STORAGE * 2) >= 0, ERROR_NOT_ENOUGH_FUNDS);

        let moulder = initOf AceMoulder(self.owner, self.channelId, self.nextMoulderIndex);

        let merchant = initOf AceMerchant(self.owner, self.channelId, self.nextMoulderIndex);

        send(SendParameters{
            to: contractAddress(moulder),
            body: SetAdmin{
                queryId: msg.queryId,
                admin: self.admin!!
            }.toCell(),
            value: value / 2,
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
            value: value / 2,
            mode: SendBounceIfActionFail,
            code: merchant.code,
            data: merchant.data
        });

        self.nextMoulderIndex += 1;
    }

    receive(msg: ApproveMoulding) {
        self.requireOwner();
        let moulder = initOf AceMoulder(self.owner, self.channelId, msg.moulderId);

        let merchant = initOf AceMerchant(self.owner, self.channelId, msg.moulderId);

        send(SendParameters{
            to: contractAddress(moulder),
            body: EnableMoulder{
                queryId: msg.queryId,
                merchant: contractAddress(merchant)
            }.toCell(),
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors
        });
    }
}
