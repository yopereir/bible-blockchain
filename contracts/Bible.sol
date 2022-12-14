// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Bible is Initializable {
    struct BibleVerse {
        string BIBLE_VERSE; //string containing the full bible verse
        bool BIBLE_VERSE_LOCKED; // true value meaning it is locked and cannot be edited
    }
    // identifier for bible verses are in the format: BookNumber-ChapterNumber-verseNumber-TranslationID
    mapping(string=>BibleVerse) public BIBLE_VERSES;
    // the original owner of the smart contract 
    address public SUPER_ADMIN;
    // maapping of all admins that returns true if given address is an admin
    mapping(address=>bool) public ADMINS;

    function initialize() public initializer {
        SUPER_ADMIN = msg.sender;
        ADMINS[msg.sender] = true;
    }

    // Function to set super admin. can only be called set by existing super admin.
    function setSuperAdmin(address newAdminAddress) public returns (bool) {
        if(SUPER_ADMIN == msg.sender) {
            SUPER_ADMIN = newAdminAddress;
            ADMINS[newAdminAddress] = true;
            ADMINS[msg.sender] = false;
        }
        return SUPER_ADMIN == newAdminAddress;
    }

    // Function to add or remove admin. Can only be done by super admin
    function addNewAdmin(address newAdminAddress, bool shouldSetAsAdmin) public returns (bool) {
        if(SUPER_ADMIN == msg.sender) ADMINS[newAdminAddress] = shouldSetAsAdmin;
        return ADMINS[newAdminAddress];
    }

    // Function to set OR update LOCK on existing bible verse based on verse identifier
    function lockBibleVerse(string memory verseIdentifier, bool shouldLockVerse) public returns (bool) {
        if(ADMINS[msg.sender]) BIBLE_VERSES[verseIdentifier].BIBLE_VERSE_LOCKED = shouldLockVerse;
        return BIBLE_VERSES[verseIdentifier].BIBLE_VERSE_LOCKED;
    }

    // Function to set OR update an existing bible verse based on verse identifier
    function updateBibleVerse(string memory verseIdentifier, string memory verse, bool shouldLockVerse) public returns (string memory) {
        if(!BIBLE_VERSES[verseIdentifier].BIBLE_VERSE_LOCKED) {
            BIBLE_VERSES[verseIdentifier].BIBLE_VERSE = verse;
            if(ADMINS[msg.sender]) BIBLE_VERSES[verseIdentifier].BIBLE_VERSE_LOCKED = shouldLockVerse;
        }
        return BIBLE_VERSES[verseIdentifier].BIBLE_VERSE;
    }
    // Functions to send ether to SUPER_ADMIN in case ether is accidentally sent to this contract as this contract is not intended to have any ether
    receive() external payable { 
        (bool sent, ) = SUPER_ADMIN.call{value: msg.value}("");
        require(sent, "Failed to send Ether to Super Admin.");
    }
    fallback() external payable { 
        (bool sent, ) = SUPER_ADMIN.call{value: msg.value}("");
        require(sent, "Failed to send Ether to Super Admin.");
    }
}
