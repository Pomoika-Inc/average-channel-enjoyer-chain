const MIN_TON_FOR_STORAGE: Int = ton("0.1");
const GAS_CONSUMPTION: Int = ton("0.001");
const FORWARD_AMOUNT: Int = ton("0.0001");

const ERROR_UNKNOWN_SENDER: String = "Unknown sender";

fun calculateMsgValue(balance: Int, msgCoins: Int): Int {
    let balanceBefore: Int = balance - msgCoins;
    let storageFee: Int = MIN_TON_FOR_STORAGE - min(balanceBefore, MIN_TON_FOR_STORAGE);
    msgCoins -= storageFee + GAS_CONSUMPTION;

    return msgCoins;
}