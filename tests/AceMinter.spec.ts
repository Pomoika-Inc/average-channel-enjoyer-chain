import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceMinter } from '../wrappers/AceMinter';
import '@ton/test-utils';

describe('AceMinter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceMinter: SandboxContract<AceMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        aceMinter = blockchain.openContract(await AceMinter.fromInit(123n, "localhost"));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await aceMinter.send(
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
            to: aceMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceMinter are ready to use
    });
});
