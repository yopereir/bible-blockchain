"use strict";
exports.__esModule = true;
exports.allBibles = exports.allBibleBooks = exports.getNumberOfVersesInChapterInBook = exports.getNumberOfChaptersInBook = exports.getVerseIdentifiers = exports.getVerseNumber = exports.getBookNumber = exports.getBibleId = void 0;
var bibles = require('../data/bible_verses.json');
var books = require('../data/books.json');
var verses = [];
bibles.Bibles.forEach(function (bible) {
    bible.verses.forEach(function (verse) {
        // verseIdentifier: BookNumber-ChapterNumber-verseNumber-TranslationID
        verses.push({ verseIdentifier: verse.book + "-" + verse.chapter + "-" + verse.verse + "-" + bible.id, verse: verse.text });
    });
});
function getBibleId(bibleName) {
    return bibles.Bibles.filter(function (bible) { return bible.name == bibleName; })[0].id;
}
exports.getBibleId = getBibleId;
function getBookNumber(bookName) {
    return books.filter(function (book) { return book.Name == bookName; })[0].Number;
}
exports.getBookNumber = getBookNumber;
function getVerseNumber(verseIdentifier) {
    return bibles.Bibles[0].verses.indexOf(bibles.Bibles[0].verses.filter(function (verse) { return verse.book + "-" + verse.chapter + "-" + verse.verse + "-" + bibles.Bibles[0].id == verseIdentifier; })[0]);
}
exports.getVerseNumber = getVerseNumber;
function getVerseIdentifiers(verseIdentifier) {
    let ids = verseIdentifier.match(/(\d+)/g);
    return {book: ids[0], chapter: ids[1], verse: ids[2], bible: ids[3]}
}
exports.getVerseIdentifiers = getVerseIdentifiers;
function getNumberOfChaptersInBook(bookName) {
    var bookNumber = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter(function (verse) { return verse.book == bookNumber; }).pop().chapter;
}
exports.getNumberOfChaptersInBook = getNumberOfChaptersInBook;
function getNumberOfVersesInChapterInBook(chapterNumber, bookName) {
    var bookNumber = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter(function (verse) { return verse.book == bookNumber && verse.chapter == chapterNumber; }).pop().verse;
}
exports.getNumberOfVersesInChapterInBook = getNumberOfVersesInChapterInBook;
// USE CASES:
// console.log(verses.length); // total verses in bible
// console.log(books.length); // total books in bible
//export let allBibleVerses = verses;
exports.allBibleBooks = books;
exports.allBibles = bibles.Bibles;
// get verse number based on verse identifier
//bibles.Bibles[0].verses.indexOf(bibles.Bibles[0].verses.filter(verse=>verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bibles.Bibles[0].id == "1-10-32-0")[0]);
// get number of verses in each book
//books.forEach(book=>{console.log(book.Name, bibles.Bibles[0].verses.filter(verse=>verse.book == book.Number).length)})
// get number of chapters in each book
//console.log(book.Name, getNumberOfChaptersInBook(book.Name))

// get number of verses in given chapter of given book
//console.log(getNumberOfVersesInChapterInBook(22,"Revelation"));
console.log(getVerseNumber("1-17-18-0")); // get verse number from verse identifier


// MISC:
/*
books.forEach(book=>{console.log(book.Name, getNumberOfChaptersInBook(book.Name))
    let largestChapter = 1
    let numberOfVerses = 1
    Array(getNumberOfChaptersInBook(book.Name)).fill().map((v,i)=>i+1).forEach((chapter)=>
    {
        if(numberOfVerses < getNumberOfVersesInChapterInBook(chapter,book.Name)) {
            largestChapter = chapter
            numberOfVerses = getNumberOfVersesInChapterInBook(chapter,book.Name)
        }
    })
    console.log("Largest Chapter: "+largestChapter);
    console.log("Number of verses: "+getNumberOfVersesInChapterInBook(largestChapter,book.Name))
})
*/