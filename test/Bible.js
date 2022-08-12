const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Bible", function () {

  describe("Admin functions", async function () {
    let owner, otherUser, Bible, bible;
    async function deployment () {
      owner = (await hre.ethers.getSigners())[1].address;
      otherUser = (await hre.ethers.getSigners())[0].address;
      Bible = await ethers.getContractFactory("Bible", owner);
      bible = await Bible.connect(await ethers.getSigner(owner)).deploy();
    };
    before(async function() {
        return await deployment();
    });
    it("Should set contract creator as super admin", async function () {
      expect(await bible.SUPER_ADMIN()).to.equal(owner);
    });

    it("Should set contract creator address to true in admin mappings", async function () {
      expect(await bible.ADMINS(owner)).to.equal(true);
    });

    it("Should have non-contract creators address to false in admin mappings", async function () {
      expect(await bible.ADMINS(otherUser)).to.equal(false);
    });

    it("Should set address of new admin to true in admin mappings when called by Super admin", async function () {
      expect(await bible.callStatic.addNewAdmin(otherUser, true)).to.equal(true);
      await bible.addNewAdmin(otherUser, true);
      expect(await bible.ADMINS(otherUser)).to.equal(true);
    });

    it("Should NOT set address of new admin to false in admin mappings when NOT called by Super admin", async function () {
      await bible.addNewAdmin(otherUser, true);
      expect(await bible.connect(await ethers.getSigner(otherUser)).callStatic.addNewAdmin(otherUser, false)).to.equal(true);
      await bible.connect(await ethers.getSigner(otherUser)).addNewAdmin(otherUser, false);
      expect(await bible.ADMINS(otherUser)).to.equal(true);
    });

    it("Should set address of new admin to false in admin mappings when called by Super admin", async function () {
      expect(await bible.callStatic.addNewAdmin(otherUser, false)).to.equal(false);
      await bible.addNewAdmin(otherUser, false);
      expect(await bible.ADMINS(otherUser)).to.equal(false);
    });

    it("Should NOT set address of new admin to true in admin mappings when NOT called by Super admin", async function () {
      await bible.addNewAdmin(otherUser, false);
      expect(await bible.connect(await ethers.getSigner(otherUser)).callStatic.addNewAdmin(otherUser, true)).to.equal(false);
      await bible.connect(await ethers.getSigner(otherUser)).addNewAdmin(otherUser, true);
      expect(await bible.ADMINS(otherUser)).to.equal(false);
    });
  });

  describe("Bible verse functions", async function () {
    let owner, otherUser, Bible, bible;
    async function deployment () {
      owner = (await hre.ethers.getSigners())[0].address;
      otherUser = (await hre.ethers.getSigners())[1].address;
      Bible = await ethers.getContractFactory("Bible", owner);
      bible = await Bible.connect(await ethers.getSigner(owner)).deploy();
    }  
    before(async function() {
        return await deployment();
    });

    it("Should set and then get the last verse in the bible if super admin", async function () {
      const [verseIdentifier, verse] = ["66-22-21-0", "The grace of the Lord Jesus be with the saints. Amen."]
      await bible.updateBibleVerse(verseIdentifier, verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });

    it("Should set and then get the second last verse in the bible if called by regular admin", async function () {
      const [verseIdentifier, verse] = ["66-22-20-0", "He who testifieth these things saith, Yea: I come quickly. Amen: come, Lord Jesus."]
      await bible.addNewAdmin(otherUser, true);
      await bible.connect(await ethers.getSigner(otherUser)).updateBibleVerse(verseIdentifier, verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });

    it("Should return empty string for verse and false for lock identifier that is not set", async function () {
      const verseIdentifier = "";
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal('');
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });

    it("Should NOT set the shortest verse in the bible if NOT admin OR super admin", async function () {
      const [verseIdentifier, verse] = ["43-11-35-0", "Jesus wept."]
      await bible.addNewAdmin(otherUser, false);
      expect(await bible.connect(await ethers.getSigner(otherUser)).callStatic.updateBibleVerse(verseIdentifier, verse)).to.equal('');
      await bible.connect(await ethers.getSigner(otherUser)).updateBibleVerse(verseIdentifier, verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal('');
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });

    it("Should lock and unlock a verse by super admin and admin", async function () {
      const [verseIdentifier, verse] = ["43-11-35-0", "Jesus wept."]
      await bible.updateBibleVerse(verseIdentifier, verse);
      await bible.addNewAdmin(otherUser, true);
      await bible.lockBibleVerse(verseIdentifier, false);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
      await bible.lockBibleVerse(verseIdentifier, true);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(true);
      await bible.lockBibleVerse(verseIdentifier, false);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
      await bible.connect(await ethers.getSigner(otherUser)).lockBibleVerse(verseIdentifier, true);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(true);
      await bible.connect(await ethers.getSigner(otherUser)).lockBibleVerse(verseIdentifier, false);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });

    it("Should NOT update verse in the bible if Lock is present AND admin OR super admin", async function () {
      const [verseIdentifier, verse] = ["43-11-35-0", "Jesus wept."]
      await bible.addNewAdmin(otherUser, true);
      await bible.updateBibleVerse(verseIdentifier, verse);
      await bible.lockBibleVerse(verseIdentifier, true);
      await bible.updateBibleVerse(verseIdentifier, verse+"update");
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(true);
      await bible.connect(await ethers.getSigner(otherUser)).updateBibleVerse(verseIdentifier, verse+"update");
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(true);
      await bible.connect(await ethers.getSigner(otherUser)).lockBibleVerse(verseIdentifier, false);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
      await bible.connect(await ethers.getSigner(otherUser)).updateBibleVerse(verseIdentifier, verse+"update");
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse+"update");
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
      await bible.updateBibleVerse(verseIdentifier, verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE).to.equal(verse);
      expect((await bible.BIBLE_VERSES(verseIdentifier)).BIBLE_VERSE_LOCKED).to.equal(false);
    });
  });

  describe.only("Deploy all bible verses", async function () {
    const bibles =  require('../data/bible_verses.json');
    const verses = [];
    bibles.Bibles.forEach(bible => {bible.verses.forEach(verse => {verses.push({verseIdentifier: verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bible.id, verse:verse.text})})});
    let totalCostOfProject = 0n;
    let owner, otherUser, Bible, bible;
    async function deployment () {
      owner = (await hre.ethers.getSigners())[0].address;
      otherUser = (await hre.ethers.getSigners())[1].address;
      Bible = await ethers.getContractFactory("Bible", owner);
      bible = await Bible.connect(await ethers.getSigner(owner)).deploy();
      totalCostOfProject = await hre.ethers.provider.estimateGas(Bible.getDeployTransaction());
    }  
    before(async function() {
        return await deployment();
    });

    it("Should deploy all bible verses of ASV edition", async function () {
      console.log("Cost of deploying contract: "+totalCostOfProject);
      this.timeout(6*60*60*1000); // set mocha timeout such that 1hr = 60 * 60 * 1000 ms
      for (verse of verses) {
        console.log(verseIdentifier);
        totalCostOfProject = totalCostOfProject.add((await bible.updateBibleVerse(verse.verseIdentifier, verse.verse)).gasPrice);
      }
      console.log("Total Cost of project: "+totalCostOfProject);
    });
  });

});
