import { toNano } from '@ton/core';
import { AceMoulder } from '../wrappers/AceMoulder';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceMoulder = provider.open(await AceMoulder.fromInit());

    await aceMoulder.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceMoulder.address);

    // run methods on `aceMoulder`
}
