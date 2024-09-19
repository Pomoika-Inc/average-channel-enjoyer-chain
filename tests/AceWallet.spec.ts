import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceWallet } from '../wrappers/AceWallet';
import '@ton/test-utils';

describe('AceWallet', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceWallet: SandboxContract<AceWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceWallet = blockchain.openContract(await AceWallet.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: aceWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceWallet are ready to use
    });
});
