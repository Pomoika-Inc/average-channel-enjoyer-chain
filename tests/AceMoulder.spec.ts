import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceMoulder } from '../wrappers/AceMoulder';
import '@ton/test-utils';

describe('AceMoulder', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceMoulder: SandboxContract<AceMoulder>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceMoulder = blockchain.openContract(await AceMoulder.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceMoulder.send(
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
            to: aceMoulder.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceMoulder are ready to use
    });
});
