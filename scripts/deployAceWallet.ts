import { toNano } from '@ton/core';
import { AceWallet } from '../wrappers/AceWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceWallet = provider.open(await AceWallet.fromInit());

    await aceWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(aceWallet.address);

    // run methods on `aceWallet`
}
