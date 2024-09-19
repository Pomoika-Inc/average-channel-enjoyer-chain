import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/ace_wallet.tact',
    options: {
        debug: true,
    },
};
