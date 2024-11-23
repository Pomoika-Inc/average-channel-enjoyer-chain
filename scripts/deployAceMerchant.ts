import { toNano } from '@ton/core';
import { AceMerchant } from '../wrappers/AceMerchant';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceMerchant = provider.open(await AceMerchant.fromInit());

    await aceMerchant.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceMerchant.address);

    // run methods on `aceMerchant`
}
