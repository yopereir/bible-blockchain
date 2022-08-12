const bibles =  require('../data/bible_verses.json')
const books =  require('../data/books.json')
const verses = [];
bibles.Bibles.forEach(bible => {
    bible.verses.forEach(verse => {
        // verseIdentifier: BookNumber-ChapterNumber-verseNumber-TranslationID
        verses.push({verseIdentifier: verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bible.id, verse:verse.text})
    });
});

function getBookNumber(bookName) {
    return books.filter(book=>book.Name == bookName)[0];
}

function getNumberOfChaptersInBook(bookName) {
    const book = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter(verse=>verse.book == book.Number).pop().chapter
}

function getNumberOfVersesInChapterInBook(chapterNumber, bookName) {
    const book = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter(verse=>verse.book == book.Number && verse.chapter == chapterNumber).pop().verse
}

// USE CASES:
console.log(verses.length); //total verses in bible
console.log(books.length); // total books in bible

// get number of verses in each book
//books.forEach(book=>{console.log(book.Name, bibles.Bibles[0].verses.filter(verse=>verse.book == book.Number).length)})
// get number of chapters in each book
//books.forEach(book=>{console.log(book.Name, getNumberOfChaptersInBook(book.Name))})
// get number of verses in given chapter of given book
//console.log(getNumberOfVersesInChapterInBook(22,"Revelation"));