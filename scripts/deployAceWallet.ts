import { address, Address, toNano } from '@ton/core';
import { AceWallet } from '../wrappers/AceWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const aceWallet = provider.open(await AceWallet.fromInit(provider.sender().address!!, address("EQBof6Qtji7SaKWKazdpb2oCD6vG1imbGSP0VJxp26dV0lsJ")));

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
