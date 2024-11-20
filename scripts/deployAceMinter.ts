import { toNano } from '@ton/core';
import { AceMinter } from '../wrappers/AceMinter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const channelId = BigInt(args.length > 0 ? args[0] : await ui.input('Channel ID'))

    const aceMinter = provider.open(await AceMinter.fromInit(provider.sender().address!!, channelId));

    await aceMinter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceMinter.address);

    // run methods on `aceMinter`
}
