import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { AceManufactory } from '../wrappers/AceManufactory';
import '@ton/test-utils';
import { AceMoulder } from '../wrappers/AceMoulder';
import { AceMerchant } from '../wrappers/AceMerchant';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

describe('AceManufactory', () => {
    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let aceManufactory: SandboxContract<AceManufactory>;
    const channelId = 123n;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        owner = await blockchain.treasury('owner');
        admin = await blockchain.treasury('owner');

        aceManufactory = blockchain.openContract(await AceManufactory.fromInit(owner.address, channelId));

        const deployResult = await aceManufactory.send(
            owner.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'SetAdmin',
                queryId: 0n,
                admin: admin.address,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: aceManufactory.address,
            deploy: true,
            success: true,
        });
    });

    it('should create moulder', async () => {
        const result = await aceManufactory.send(
            admin.getSender(),
            {
                value: toNano('0.3'),
            },
            {
                $$type: 'CreateMoulder',
                queryId: 1n,
            }
        )

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            to: aceManufactory.address,
            success: true,
        });

        const moulderId = (await aceManufactory.getManufactoryInfo()).mouldersCount - 1n;

        const moulder = blockchain.openContract(await AceMoulder.fromInit(aceManufactory.address, channelId, moulderId));
        const merchant = blockchain.openContract(await AceMerchant.fromInit(aceManufactory.address, channelId, moulderId));

        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: moulder.address,
            success: true,
        });
        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: merchant.address,
            success: true,
        });
        
        expect((await moulder.getMoulderInfo()).admin?.toString()).toEqual(admin.address.toString());
        expect((await merchant.getMerchantInfo()).admin?.toString()).toEqual(admin.address.toString());
    }, 35000);
    
    it('should create moulder', async () => {
        const result = await aceManufactory.send(
            admin.getSender(),
            {
                value: toNano('0.3'),
            },
            {
                $$type: 'CreateMoulder',
                queryId: 1n,
            }
        )

        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            to: aceManufactory.address,
            success: true,
        });

        const moulderId = (await aceManufactory.getManufactoryInfo()).mouldersCount - 1n;

        const moulder = blockchain.openContract(await AceMoulder.fromInit(aceManufactory.address, channelId, moulderId));
        const merchant = blockchain.openContract(await AceMerchant.fromInit(aceManufactory.address, channelId, moulderId));

        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: moulder.address,
            success: true,
        });
        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: merchant.address,
            success: true,
        });
        
        expect((await moulder.getMoulderInfo()).admin?.toString()).toEqual(admin.address.toString());
        expect((await merchant.getMerchantInfo()).admin?.toString()).toEqual(admin.address.toString());
    }, 35000);
});

