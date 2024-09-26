import { fromNano, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { AceMinter } from '../wrappers/AceMinter';
import { AceWallet } from '../wrappers/AceWallet';

describe('AceMinter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let aceMinter: SandboxContract<AceMinter>;
    let aceWallet: SandboxContract<AceWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        aceMinter = blockchain.openContract(await AceMinter.fromInit(123n, "localhost"));
        aceWallet = blockchain.openContract(await AceWallet.fromInit(deployer.address, aceMinter.address, 123n));

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
        const deployWalletResult = await aceWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 1n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: aceMinter.address,
            deploy: true,
            success: true,
        });
        expect(deployWalletResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: aceWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        expect(await aceMinter.getBalance()).toEqual(0n);
        expect(await aceWallet.getBalance()).toEqual(0n);
    });

    it('should mint to deployed wallet', async () => {
        const mintAmount = 100n;
        let result = await aceMinter.send(
            deployer.getSender(),
            {
                value: toNano('0.3'),
            },
            {
                $$type: 'Mint',
                queryId: 0n,
                amount: mintAmount,
                rewarded: deployer.address,
            }
        )

        expect((await aceMinter.getJettonData()).total_supply).toEqual(mintAmount);
        expect(await aceWallet.getJettonBalance()).toEqual(mintAmount);

        // expect(await aceMinter.getBalance()).toEqual(toNano('0.1'));
        // expect(await aceWallet.getBalance()).toEqual(toNano('0.1'));
    }, 10000);
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
