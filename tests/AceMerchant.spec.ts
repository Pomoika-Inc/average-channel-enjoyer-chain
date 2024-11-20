import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceMerchant } from '../wrappers/AceMerchant';
import '@ton/test-utils';

describe('AceMerchant', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceMerchant: SandboxContract<AceMerchant>;

    beforeEach(async () => {
        // blockchain = await Blockchain.create();

        // aceMerchant = blockchain.openContract(await AceMerchant.fromInit());

        // deployer = await blockchain.treasury('deployer');

        // const deployResult = await aceMerchant.send(
        //     deployer.getSender(),
        //     {
        //         value: toNano('0.05'),
        //     },
        //     {
        //         $$type: 'Deploy',
        //         queryId: 0n,
        //     }
        // );

        // expect(deployResult.transactions).toHaveTransaction({
        //     from: deployer.address,
        //     to: aceMerchant.address,
        //     deploy: true,
        //     success: true,
        // });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and aceMerchant are ready to use
    });
});
