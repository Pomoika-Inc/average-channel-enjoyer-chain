import { toNano } from '@ton/core';
import { AceCargo } from '../wrappers/AceCargo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceCargo = provider.open(await AceCargo.fromInit());

    await aceCargo.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceCargo.address);

    // run methods on `aceCargo`
}
