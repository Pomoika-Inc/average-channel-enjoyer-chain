import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
// import "./ace_merchant";
import "./messages";
import "./utils";

struct MoulderInfo{
    id: Int as uint32;
    channelId: Int as int64;
    admin: Address?;
    stopped: Bool;
    mouldedItems: Int as uint64;
}

/** Creates goods for customers */
contract AceMoulder with Deployable, Adminable, Resumable {
    owner: Address;
    admin: Address? = null;
    stopped: Bool = true;

    channelId: Int as int64;
    id: Int as uint32;

    content: MoulderContent? = null;    // TODO: think about content_update timestamp
    nextItemIndex: Int as uint64 = 0;

    init(owner: Address, channelId: Int, id: Int) {
        self.owner = owner;
        self.channelId = channelId;
        self.id = id;
    }

    receive(msg: SetContent) {
        self.requireStopped();
        self.requireAdmin();
        self.content = msg.content;

        self.sendExcessessToAdmin(msg.queryId);
    }

    receive(msg: DisableMoulder) {
        self.requireNotStopped();
        self.requireMerchant();
        self.stopped = true;

        self.sendExcessessToAdmin(msg.queryId);
    }

    receive(msg: Mould) {
        self.requireNotStopped();
        self.requireMerchant();
        // TODO
    }

    fun requireMerchant() {
        require(sender() == contractAddress(initOf AceMerchant(self.owner, self.channelId, self.id)), ERROR_UNKNOWN_SENDER);
    }

    get fun moulderInfo(): MoulderInfo {
        return MoulderInfo{
            id: self.id,
            channelId: self.channelId,
            admin: self.admin,
            stopped: self.stopped,
            mouldedItems: self.nextItemIndex
        };
    }

    get fun content(): MoulderContent? {
        return self.content;
    }
}
