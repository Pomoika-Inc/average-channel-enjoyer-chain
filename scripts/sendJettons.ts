import { Address, toNano } from '@ton/core';
import { AceMinter } from '../wrappers/AceMinter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const channelId = BigInt(args.length > 0 ? args[0] : await ui.input('Channel ID'))
    const jettonsCount = BigInt(args.length > 0 ? args[1] : await ui.input('Jettons count'))
    const receiverAddress = Address.parse(args.length > 0 ? args[2] : await ui.input('Receiver address'))

    const aceMinter = provider.open(await AceMinter.fromInit(provider.sender().address!!, channelId));

    await aceMinter.send(
        provider.sender(),
        {
            value: toNano('0.3'),
        },
        {
            $$type: 'Mint',
            queryId: 0n,
            amount: jettonsCount,
            rewarded: receiverAddress,
        }
    );
}
