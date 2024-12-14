import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox'
import { toNano } from '@ton/core'
import { AceMerchant } from '../wrappers/AceMerchant'
import '@ton/test-utils'
import { AceMoulder } from '../wrappers/AceMoulder'

describe('AceMerchant', () => {
    let blockchain: Blockchain
    let owner: SandboxContract<TreasuryContract>
    let admin: SandboxContract<TreasuryContract>
    let aceMerchant: SandboxContract<AceMerchant>
    let aceMoulder: SandboxContract<AceMoulder>

    beforeEach(async () => {
        blockchain = await Blockchain.create()
        owner = await blockchain.treasury('owner')
        admin = await blockchain.treasury('admin')

        aceMerchant = blockchain.openContract(await AceMerchant.fromInit(owner.address, 123n, 1n))  
        aceMoulder = blockchain.openContract(await AceMoulder.fromInit(owner.address, 123n, 1n))  

        const merchantDeployResult = await aceMerchant.send(
            owner.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        )
        expect(merchantDeployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: aceMerchant.address,
            deploy: true,
            success: true,
        })

        const moulderDeployResult = await aceMoulder.send(
            owner.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        )
        expect(moulderDeployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: aceMoulder.address,
            deploy: true,
            success: true,
        })
    })

    it('should set price tag', async () => {
        await aceMerchant.send(
            admin.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'SetPrice',
                queryId: 1n,
                price: toNano('0.1'),
            }
        )
    })

    it('should disable moulder on sale cancelation', async () => {
        await aceMoulder.send(
            owner.getSender(),
            {
                value: toNano('0.1'),
            },
            "Resume"
        )
        expect((await aceMoulder.getMoulderInfo()).stopped).toEqual(false)

        let result = await aceMerchant.send(
            admin.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'SwitchMoulderState',
                queryId: 2n,
                moulderId: moulderId,
                target: false,
            }
        )
        expect(result.transactions).toHaveTransaction({
            from: aceManufactory.address,
            to: moulder.address,
            success: true,
        })

        expect((await moulder.getMoulderInfo()).stopped).toEqual(true)
    })
})
