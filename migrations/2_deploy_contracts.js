const Migrations = artifacts.require("EthereumColors");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
};
