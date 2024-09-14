import { toNano } from '@ton/core';
import { AceMiner } from '../wrappers/AceMiner';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceMiner = provider.open(await AceMiner.fromInit());

    await aceMiner.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceMiner.address);

    // run methods on `aceMiner`
}
