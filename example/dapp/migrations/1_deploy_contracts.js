const FakePool = artifacts.require('FakePool');

module.exports = function(deployer) {
  deployer.deploy(FakePool, '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367');
};
