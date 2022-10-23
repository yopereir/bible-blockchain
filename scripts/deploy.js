// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const bibles =  require('../data/bible_verses.json');
require('dotenv').config();
const verses = [];
bibles.Bibles.forEach(bible => {bible.verses.forEach(verse => {verses.push({verseIdentifier: verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bible.id, verse:verse.text})})});
let totalCostOfProject = 0n;
let owner, Bible, bible;

async function deployment () {
  owner = (await hre.ethers.getSigners())[0].address;
  Bible = await ethers.getContractFactory("Bible", owner);
  if(process.env.CONTRACT_ADDRESS) {bible = await Bible.connect(await ethers.getSigner(owner)).attach(process.env.CONTRACT_ADDRESS);console.log(bible);}
  else {bible = await Bible.connect(await ethers.getSigner(owner)).deploy();console.log("Contract address: "+bible.address);}
  
  totalCostOfProject = await hre.ethers.provider.estimateGas(Bible.getDeployTransaction());
}

async function main() {
  await deployment();
  console.log("Cost of deploying contract: "+totalCostOfProject);
  for (verse of verses.slice(2599, 3533)) {
    console.log(verse.verseIdentifier);
    // await new Promise(resolve => setTimeout(resolve, 3000));
    let tx = await bible.updateBibleVerse(verse.verseIdentifier, verse.verse, true);
    totalCostOfProject = totalCostOfProject.add(tx.gasPrice);
    console.log(tx);
    console.log("Gas Price for deploying verse: " + tx.gasPrice);
    await tx.wait();
  }
  console.log("Total Cost of project: "+totalCostOfProject);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
