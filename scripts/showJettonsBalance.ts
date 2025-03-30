import { Address, toNano } from '@ton/core';
import { AceMinter } from '../wrappers/AceMinter';
import { NetworkProvider } from '@ton/blueprint';
import { AceWallet } from '../wrappers/AceWallet';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const channelId = BigInt(args.length > 0 ? args[0] : await ui.input('Channel ID'))
    const userAddress = Address.parse(args.length > 1 ? args[1] : await ui.input('User address'))

    const aceMinter = provider.open(await AceMinter.fromInit(provider.sender().address!!, channelId));
    const aceWallet = provider.open(await AceWallet.fromInit(userAddress, aceMinter.address));

    console.log(`AceWallet address: ${aceWallet.address.toString()}`);
    console.log(`Balance: ${await aceWallet.getJettonBalance()}`);
}
