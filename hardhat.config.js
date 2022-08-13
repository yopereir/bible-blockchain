require("@nomicfoundation/hardhat-toolbox");
task("balance", "Prints an account's balance")
.addParam("account", "The account's address")
.setAction(async (taskArgs) => {
  const balance = await ethers.provider.getBalance(taskArgs.account);

  console.log(ethers.utils.formatEther(balance), "ETH");
});
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const RINKEBY_ACCOUNT_PRIVATE_KEY = ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "localhost",
  networks: {
    rinkeby: {
      url: ``,
      accounts: [RINKEBY_ACCOUNT_PRIVATE_KEY]
    }
  }
};
