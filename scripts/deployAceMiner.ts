import { toNano } from '@ton/core';
import { AceMinter } from '../wrappers/AceMinter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceMinter = provider.open(await AceMinter.fromInit());

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
