const HDWalletProvider = require("truffle-hdwallet-provider");
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(process.env.TEST_MNEMONIC, process.env.RINKEBY_ALCHEMY_KEY)
      },
      network_id: '4',
      skipDryRun: true,
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(process.env.MAINNET_MNEMONIC, process.env.MAINNET_RPC_URL)
      },
      network_id: '1',
      skipDryRun: true,
    },

  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
