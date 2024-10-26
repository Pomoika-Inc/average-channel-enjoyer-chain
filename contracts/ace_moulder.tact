import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
import "./messages";
import "./utils";

// Creates goods for customers
contract AceMoulder with Deployable, Adminable, Stoppable {
    owner: Address;
    admin: Address = null;
    stopped: Bool = true;

    channelId: Int as int64;
    id: Int as uint32;

    content: MoulderContent? = null;
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

    receive(msg: EnableMoulder) {
        self.requireStopped();
        self.requireOwner();
        self.stopped = false;
        self.owner = msg.merchant;

        self.reply("Moulder enabled".asComment());
    }

    receive(msg: DisableMoulder) {
        self.requireNotStopped();
        self.requireOwner();
        self.stopped = true;
        self.owner = msg.owner;

        self.sendExcessessToAdmin(msg.queryId);
    }

    receive(msg: Mould) {
        self.requireNotStopped();
        self.requireOwner();

    }
}
