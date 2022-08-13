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

const RINKEBY_ACCOUNT_PRIVATE_KEY = "82ac048b9b48090575c92a4eac30674a883331f7c25a2204163e4a72d1532ff2"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "localhost",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/`,
      accounts: [RINKEBY_ACCOUNT_PRIVATE_KEY]
    }
  }
};
