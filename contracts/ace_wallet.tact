import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./utils";

contract AceWallet with Deployable, Maintainable, Ownable {
    owner: Address;
    minter: Address;
    balance: Int as coins = 0;

    init(owner: Address, minter: Address) {
        self.owner = owner;
        self.minter = minter;
    }

    receive(msg: InternalAdd) {
        let ctx: Context = context();
        let sender = ctx.sender;
        require(sender == self.minter && sender == msg.origin, ERROR_UNKNOWN_SENDER);   //sending between wallets is not allowed

        self.balance += msg.amount;
        let fwd_fee: Int = ctx.readForwardFee() * 3 / 2;
        let msg_value: Int = calculateMsgValue(myBalance(), ctx.value);
        if (msg.forwardContent != null) {
            msg_value -= fwd_fee + FORWARD_AMOUNT;

            send(SendParameters{
                to: self.owner,
                body: msg.forwardContent!!.asComment(),
                value: FORWARD_AMOUNT,
                bounce: false,
                mode: SendPayGasSeparately
            });
        }

        send(SendParameters{
            to: msg.responseDestination,
            body: Excesses{queryId: msg.queryId}.toCell(),
            value: msg_value,
            mode: SendIgnoreErrors
        });
    }

    get fun jetton_balance(): Int {
        return self.balance;
    }
}
