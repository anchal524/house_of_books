/* this file is strictly for testing db functions. */

const books = require("./books");
const connection = require("../config/mongoCollection");

const main = async () => {
    try {
        const id = "626ea903aa3f53db40cc8f97";
        const book = await books.getById(id);
        console.log("book_found", book);
    } catch (e) {
        console.log(e);
    }

    try {
        const allBooks = await books.getAll();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.getNewAddition();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.getBooksForRent();
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.addRentedBook(
            "627161da17f0455539944549",
            "626ff983aa3f53db40cc8fad",
            "05-03-2022",
            "06-03-2022",
            true
        );
    } catch (e) {
        console.log(e);
    }
    try {
        const allBooks = await books.addNewBook(
            "149192912",
            "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1459115220l/27968891.jpg",
            "How google runs",
            "Betsy Beyer",
            4.23,
            "Paperback",
            "Sci-fi",
            500,
            2016,
            60,
            "O'Reilly Media",
            "Site Reliability Engineering: How Google Runs Production Systems",
            2016,
            true,
            true,
            true
        );
    } catch (e) {
        console.log(e);
    }

    try {
        // const db = await connection;
        // await db.;
        console.log("Done");
    } catch (e) {
        console.log(e);
    }
};

main();
