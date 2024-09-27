import { toNano } from '@ton/core'
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import '@ton/test-utils'
import { AceMinter } from '../wrappers/AceMinter'
import { AceWallet } from '../wrappers/AceWallet'

import { GAS_CONSUMPTION, MIN_STORAGE, NETWORK_FEE, STORAGE } from './utils'

describe('AceMinter', () => {
    let blockchain: Blockchain
    let deployer: SandboxContract<TreasuryContract>
    let aceMinter: SandboxContract<AceMinter>
    let aceWallet: SandboxContract<AceWallet>

    beforeEach(async () => {
        blockchain = await Blockchain.create()
        deployer = await blockchain.treasury('deployer')

        aceMinter = blockchain.openContract(await AceMinter.fromInit(123n, "localhost"))
        aceWallet = blockchain.openContract(await AceWallet.fromInit(deployer.address, aceMinter.address, 123n))

        const deployResult = await aceMinter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        )
        const deployWalletResult = await aceWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 1n,
            }
        )

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: aceMinter.address,
            deploy: true,
            success: true,
        })
        expect(deployWalletResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: aceWallet.address,
            deploy: true,
            success: true,
        })
    })

    it('should deploy', async () => {
        expect(await aceMinter.getBalance()).toEqual(0n)
        expect(await aceWallet.getBalance()).toEqual(0n)
    })

    it('should mint to deployed wallet', async () => {
        const mintAmount = 100n
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

        expect((await aceMinter.getJettonData()).total_supply).toEqual(mintAmount)
        expect(await aceWallet.getJettonBalance()).toEqual(mintAmount)

        expect(await aceMinter.getBalance()).toBeGreaterThan(MIN_STORAGE)
        const balanceAfterFirstMint = await aceWallet.getBalance()
        expect(balanceAfterFirstMint).toBeGreaterThan(MIN_STORAGE)

        const deployerBalanceBefore = await deployer.getBalance()
        result = await aceMinter.send(
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

        const balanceAfterSecondMint = await aceWallet.getBalance()
        //check that wallet balance is not growing after mints
        expect(balanceAfterSecondMint).toBeLessThan(balanceAfterFirstMint)
        expect(balanceAfterSecondMint).toBeGreaterThan(MIN_STORAGE)
        //check that most of the value returned back to deployer
        expect(await deployer.getBalance()).toBeGreaterThan(deployerBalanceBefore - (GAS_CONSUMPTION * 2n + NETWORK_FEE))
    })

    it('should mint to new wallet', async () => {
        const mintAmount = 100n
        const customer = await blockchain.treasury('customer')
        const customerWallet = blockchain.openContract(await AceWallet.fromInit(customer.address, aceMinter.address, 123n))
        
        const deployerBalanceBefore = await deployer.getBalance()
        let result = await aceMinter.send(
            deployer.getSender(),
            {
                value: toNano('0.3'),
            },
            {
                $$type: 'Mint',
                queryId: 0n,
                amount: mintAmount,
                rewarded: customer.address,
            }
        )

        expect((await aceMinter.getJettonData()).total_supply).toEqual(mintAmount)
        expect(await customerWallet.getJettonBalance()).toEqual(mintAmount)

        expect(await aceMinter.getBalance()).toBeGreaterThan(MIN_STORAGE)
        expect(await customerWallet.getBalance()).toBeGreaterThan(MIN_STORAGE)
        expect(await deployer.getBalance()).toBeGreaterThan(deployerBalanceBefore - STORAGE * 2n - GAS_CONSUMPTION * 2n - NETWORK_FEE)
    })
})
