import "@stdlib/deploy";
import "@stdlib/stoppable";
import "./ace_moulder";
import "./utils";

struct MerchantInfo {
    id: Int as uint32;
    channelId: Int as int64;
    admin: Address?;
    stopped: Bool;
    price: Int as coins;
    quantity: Int as uint32;
}

/** Sells goods to customers */
contract AceMerchant with Deployable, Adminable, Resumable {
    owner: Address;
    admin: Address? = null;
    stopped: Bool = true;

    channelId: Int as int64;
    id: Int as uint32;

    price: Int as coins = 0;
    quantity: Int as uint32 = 0;

    init(owner: Address, channelId: Int, id: Int) {
        self.owner = owner;
        self.channelId = channelId;
        self.id = id;
    }

    receive(msg: SetPriceTag) {
        self.requireAdmin();
        require(msg.price > 0, ERROR_INVALID_PRICE);
        require(msg.quantity >= 0, ERROR_INVALID_QUANTITY);

        self.price = msg.price;
        self.quantity = msg.quantity;
        
        self.sendExcessessToAdmin(msg.queryId);
    }

    receive(msg: StartSales) {
        self.requireStopped();
        self.requireAdmin();
        self.stopped = false;
        
        // TODO: notification to owner that moulder's approve is needed
        self.sendExcessessToAdmin(msg.queryId);
    }

    receive(msg: CancelSales) {
        self.requireNotStopped();
        self.requireAdmin();
        self.stopped = true;
        
        send(SendParameters{
            to: contractAddress(initOf AceMoulder(self.owner, self.channelId, self.id)),
            body: DisableMoulder{
                queryId: msg.queryId,
            }.toCell(),
            value: context().value,
            mode: SendIgnoreErrors 
        });
    }

    get fun merchantInfo(): MerchantInfo {
        return MerchantInfo{
            id: self.id,
            channelId: self.channelId,
            admin: self.admin,
            stopped: self.stopped,
            price: self.price,
            quantity: self.quantity
        };
    }
}
