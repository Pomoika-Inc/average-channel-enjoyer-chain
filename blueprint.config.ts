import { MistiPlugin } from '@nowarp/blueprint-misti';
import { Config } from '@ton/blueprint';

export const config: Config = {
  plugins: [
    new MistiPlugin(),
  ],
};