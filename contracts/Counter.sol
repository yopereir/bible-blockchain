// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Counter {
    string[66] books = [
        '1 Chronicles',
        '1 Corinthians',
        '1 John',
        '1 Kings',
        '1 Peter',
        '1 Samuel',
        '1 Thessalonians',
        '1 Timothy',
        '2 Chronicles',
        '2 Corinthians',
        '2 John',
        '2 Kings',
        '2 Peter',
        '2 Samuel',
        '2 Thessalonians',
        '2 Timothy',
        '3 John',
        'Acts',
        'Amos',
        'Colossians',
        'Daniel',
        'Deuteronomy',
        'Ecclesiastes',
        'Ephesians',
        'Esther',
        'Exodus',
        'Ezekiel',
        'Ezra',
        'Galatians',
        'Genesis',
        'Habakkuk',
        'Haggai',
        'Hebrews',
        'Hosea',
        'Isaiah',
        'James',
        'Jeremiah',
        'Job',
        'Joel',
        'John',
        'Jonah',
        'Joshua',
        'Jude',
        'Judges',
        'Lamentations',
        'Leviticus',
        'Luke',
        'Malachi',
        'Mark',
        'Matthew',
        'Micah',
        'Nahum',
        'Nehemiah',
        'Numbers',
        'Obadiah',
        'Philemon',
        'Philippians',
        'Proverbs',
        'Psalms',
        'Revelation',
        'Romans',
        'Ruth',
        'Song of Solomon',
        'Titus',
        'Zechariah',
        'Zephaniah'
    ];
    uint public count;

    // Function to get the current count
    function get() public view returns (uint) {
        return count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
    }
    // Function to multiply count by supplied argument
    function mul(uint factor) public {
        count *= factor;
    }
    // Function to divide count by supplied argument
    function div(uint factor) public {
        if(factor != 0) count /= factor;
        else console.log("Dividing by 0 is ridiculous. Idiot.");
    }

    // Function to decrement count by 1
    function dec() public {
        // This function will fail if count = 0
        count -= 1;
    }
}
