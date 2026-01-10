import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { fromNano, toNano } from '@ton/core'
import { AceManufactory } from '../wrappers/AceManufactory'
import '@ton/test-utils'
import { AceMoulder } from '../wrappers/AceMoulder'
import { AceMerchant } from '../wrappers/AceMerchant'

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

describe('AceManufactory', () => {
    let blockchain: Blockchain
    let owner: SandboxContract<TreasuryContract>
    let admin: SandboxContract<TreasuryContract>
    let aceManufactory: SandboxContract<AceManufactory>
    const channelId = 123n

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        owner = await blockchain.treasury('owner')
        admin = await blockchain.treasury('admin')

        aceManufactory = blockchain.openContract(await AceManufactory.fromInit(owner.address, channelId))

        const deployResult = await aceManufactory.send(
            owner.getSender(),
            {
                value: toNano('0.103'),
            },
            {
                $$type: 'SetAdmin',
                queryId: 0n,
                admin: admin.address,
            }
        )
        console.log("AceManufactory after deploy balance: ", fromNano(await aceManufactory.getBalance()));

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: aceManufactory.address,
            deploy: true,
            success: true,
        })
    })

    it('should create moulder', async () => {
        const result = await aceManufactory.send(
            admin.getSender(),
            {
                value: toNano('0.37'),
            },
            {
                $$type: 'CreateMoulder',
                queryId: 1n,
            }
        )
        console.log("AceManufactory after moulder creation balance: ", fromNano(await aceManufactory.getBalance()));

        expect(result.transactions).toHaveTransaction({
            from: admin.address,
            to: aceManufactory.address,
            success: true,
        })

        const moulderId = (await aceManufactory.getManufactoryInfo()).mouldersCount - 1n

        const moulder = blockchain.openContract(await AceMoulder.fromInit(owner.address, channelId, moulderId))
        const merchant = blockchain.openContract(await AceMerchant.fromInit(owner.address, channelId, moulderId))

        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: moulder.address,
            success: true,
        })
        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: merchant.address,
            success: true,
        })
        
        const moulderInfo = await moulder.getMoulderInfo()
        expect(moulderInfo.admin?.toString()).toEqual(admin.address.toString())
        expect(moulderInfo.stopped).toEqual(true)
        console.log("AceMoulder after creation balance: ", fromNano(await moulder.getBalance()));

        const merchantInfo = await merchant.getMerchantInfo()
        expect(merchantInfo.admin?.toString()).toEqual(admin.address.toString())
        expect(merchantInfo.stopped).toEqual(true)
        console.log("AceMerchant after creation balance: ", fromNano(await merchant.getBalance()));
    }, 35000)
})

