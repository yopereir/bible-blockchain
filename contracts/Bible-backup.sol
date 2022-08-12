// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract BibleBackup {
    // identifier for bible verses are in the format: BookNumber-ChapterNumber-verseNumber-TranslationID
    mapping(string=>string) public BIBLE_VERSES;
    // uses same identifier as bible verses with true value meaning it is locked and cannot be edited
    mapping(string=>bool) public BIBLE_VERSES_LOCKED;
    // the original owner of the smart contract 
    address public immutable SUPER_ADMIN;
    // maapping of all admins that returns true if given address is an admin
    mapping(address=>bool) public ADMINS;

    constructor() {
        SUPER_ADMIN = msg.sender;
        ADMINS[msg.sender] = true;
    }

    // Function to only add new admin. Can only be done by existing admins
    function addNewAdmin(address newAdminAddress) public returns (bool) {
        if(ADMINS[msg.sender]) ADMINS[newAdminAddress] = true;
        return ADMINS[newAdminAddress];
    }

    // Function to only remove existing admin. Can only be done by super admin
    function removeAdmin(address adminAddress) public returns (bool) {
        if(SUPER_ADMIN == msg.sender) ADMINS[adminAddress] = false;
        return ADMINS[adminAddress];
    }

    // Function to set OR update LOCK on existing bible verse based on verse identifier
    function lockBibleVerse(string memory verseIdentifier, bool shouldLockVerse) public returns (bool) {
        if(ADMINS[msg.sender]) BIBLE_VERSES_LOCKED[verseIdentifier] = shouldLockVerse;
        return BIBLE_VERSES_LOCKED[verseIdentifier];
    }

    // Function to set OR update an existing bible verse based on verse identifier
    function updateBibleVerse(string memory verseIdentifier, string memory verse) public returns (string memory) {
        if(!BIBLE_VERSES_LOCKED[verseIdentifier]) BIBLE_VERSES[verseIdentifier] = verse;
        return BIBLE_VERSES[verseIdentifier];
    }
}
