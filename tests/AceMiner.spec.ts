import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceMiner } from '../wrappers/AceMiner';
import '@ton/test-utils';

describe('AceMiner', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceMiner: SandboxContract<AceMiner>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceMiner = blockchain.openContract(await AceMiner.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceMiner.send(
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
            to: aceMiner.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceMiner are ready to use
    });
});
