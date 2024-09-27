const MIN_TON_FOR_STORAGE: Int = ton("0.1");
const GAS_CONSUMPTION: Int = ton("0.015");
const FORWARD_AMOUNT: Int = ton("0.001");

const ERROR_UNKNOWN_SENDER: String = "Unknown sender";

fun calculateMsgValue(balance: Int, msgCoins: Int): Int {
    dump(balance);
    dump(msgCoins);
    let balanceBefore: Int = balance - msgCoins;
    dump(balanceBefore);
    let storageFee: Int = MIN_TON_FOR_STORAGE - balanceBefore;
    dump(storageFee);
    msgCoins -= storageFee + GAS_CONSUMPTION;
    dump(msgCoins);

    return msgCoins;
}