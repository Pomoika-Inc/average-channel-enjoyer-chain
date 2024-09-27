import { toNano } from '@ton/core'

export const STORAGE: bigint = toNano("0.1")
export const MIN_STORAGE: bigint = STORAGE - toNano("0.0012") // permissable error
export const GAS_CONSUMPTION: bigint = toNano("0.015")
export const NETWORK_FEE: bigint = toNano("0.0101")

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))