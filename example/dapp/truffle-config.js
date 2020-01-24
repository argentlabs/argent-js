require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(process.env.PKEY_ROPSTEN, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 3,
      gas: 1000000
    }
  }
};
