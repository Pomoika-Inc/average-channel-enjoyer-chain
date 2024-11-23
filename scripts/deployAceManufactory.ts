import { toNano } from '@ton/core';
import { AceManufactory } from '../wrappers/AceManufactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceManufactory = provider.open(await AceManufactory.fromInit());

    await aceManufactory.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceManufactory.address);

    // run methods on `aceManufactory`
}
