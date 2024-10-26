import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceManufactory } from '../wrappers/AceManufactory';
import '@ton/test-utils';

describe('AceManufactory', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceManufactory: SandboxContract<AceManufactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceManufactory = blockchain.openContract(await AceManufactory.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceManufactory.send(
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
            to: aceManufactory.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceManufactory are ready to use
    });
});
