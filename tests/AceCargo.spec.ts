import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceCargo } from '../wrappers/AceCargo';
import '@ton/test-utils';

describe('AceCargo', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceCargo: SandboxContract<AceCargo>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceCargo = blockchain.openContract(await AceCargo.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceCargo.send(
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
            to: aceCargo.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceCargo are ready to use
    });
});
