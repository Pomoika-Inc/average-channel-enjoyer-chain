import "@stdlib/ownable";
import "./messages";

const MIN_TON_FOR_STORAGE: Int = ton("0.1");
const GAS_CONSUMPTION: Int = ton("0.015");
const FORWARD_AMOUNT: Int = ton("0.001");

const ERROR_UNKNOWN_SENDER: String = "Unknown sender";
const ERROR_REQUIRE_ADMIN: String = "Sender isn't admin";
const ERROR_NOT_ENOUGH_FUNDS: String = "Not enough funds";
const ERROR_INVALID_PRICE: String = "Price must be greater than 0";
const ERROR_INVALID_QUANTITY: String = "Quantity must be greater or equal to 0";

const RESUME_COMMENT: Cell = "Resume".asComment();
const STOP_COMMENT: Cell = "Stop".asComment();

fun calculateMsgValue(balance: Int, msgCoins: Int): Int {
    return calculateMsgValueWithGas(balance, msgCoins, GAS_CONSUMPTION);
}

fun calculateMsgValueWithGas(balance: Int, msgCoins: Int, gasConsumption: Int): Int {
    dump(balance);
    dump(msgCoins);
    let balanceBefore: Int = balance - msgCoins;
    dump(balanceBefore);
    let storageFee: Int = MIN_TON_FOR_STORAGE - balanceBefore;
    dump(storageFee);
    msgCoins -= storageFee + gasConsumption;
    dump(msgCoins);

    return msgCoins;
}


trait Adminable with Ownable {
    owner: Address;
    creator: Address;
    admin: Address?;

    receive(msg: SetAdmin) {
        let sender = sender();
        require(sender == self.creator || sender == self.owner, ERROR_UNKNOWN_SENDER);
        self.admin = msg.admin;
    }

    fun requireAdmin() {
        require(sender() == self.admin, ERROR_REQUIRE_ADMIN);
    }

    fun sendExcessessToAdmin(queryId: Int) {
        let excesses = calculateMsgValue(myBalance(), context().value);
        require(excesses >= 0, ERROR_NOT_ENOUGH_FUNDS);

        if (excesses > 0) {
            send(SendParameters{
                to: self.admin!!,
                body: Excesses{queryId: queryId}.toCell(),
                value: excesses,
                mode: SendIgnoreErrors
            });
        }
    }
}

trait Maintainable {

    get fun balance(): Int {
        return myBalance();
    }
}
