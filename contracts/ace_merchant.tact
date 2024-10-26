import "@stdlib/deploy";
import "./utils";

// Sells goods to customers
contract AceMerchant with Deployable, Adminable {
    owner: Address;
    admin: Address = null;
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

    receive(msg: CancelSales) {
        self.requireAdmin();
        
        let moulder = initOf AceMoulder{
            channelId: self.channelId,
            id: self.id
        };

        send(SendParameters{
            to: contractAddress(moulder),
            body: DisableMoulder{
                queryId: msg.queryId,
                owner: self.owner
            }.toCell(),
            value: calculateMsgValue(myBalance(), context().value),
            mode: SendIgnoreErrors
        });
    }
}
