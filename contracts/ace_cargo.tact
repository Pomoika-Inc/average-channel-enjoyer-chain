import "@stdlib/deploy";
import "./utils";
import "./messages";
import "./ace_minter";

message Confirm {
    queryId: Int as uint64;
}

contract AceCargo with Deployable, Adminable {
    owner: Address;
    creator: Address;
    buyer: Address;
    admin: Address? = null;

    channelId: Int as int64;
    moulderId: Int as uint32;

    startIndex: Int as uint32;
    quantity: Int as uint32;
    price: Int as coins;

    content: MoulderContent;

    deliveryConfirmedByBuyer: Bool = false;
    deliveryConfirmedByAdmin: Bool = false;

    init(owner: Address, buyer: Address, channelId: Int, moulderId: Int, startIndex: Int, quantity: Int, price: Int, content: MoulderContent) {
        self.owner = owner;
        self.buyer = buyer;
        self.channelId = channelId;
        self.moulderId = moulderId;
        self.startIndex = startIndex;
        self.quantity = quantity;
        self.price = price;
        self.content = content;

        self.creator = contractAddress(initOf AceMoulder(owner, channelId, moulderId));
    }

    receive(msg: Confirm) {
        let sender = context().sender;
        if (!self.deliveryConfirmedByBuyer && sender == self.buyer) {
            self.deliveryConfirmedByBuyer = true;
            let minter = initOf AceMinter(self.owner, self.channelId);

            send(SendParameters{
                to: contractAddress(minter),
                body: Burn{
                    queryId: msg.queryId,
                    owner: self.owner,
                    buyer: self.buyer,
                    channelId: self.channelId,
                    moulderId: self.moulderId,
                    startIndex: self.startIndex,
                    quantity: self.quantity,
                    price: self.price,
                    content: self.content
                }.toCell(),
                value: GAS_CONSUMPTION,
                mode: SendIgnoreErrors | SendPayGasSeparately
            });
        } else if (!self.deliveryConfirmedByAdmin && sender == self.admin) {
            self.deliveryConfirmedByAdmin = true;
            //TODO: notify the buyer
        }
    }
}
