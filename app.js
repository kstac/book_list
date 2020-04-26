// Book Class: Represents a book
class Book {
    constructor(title, author, genre) {
        this.title = title;
        this.author = author;
        this.genre = genre;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        console.log('displaying books');
        const books = Store.getBooks();

        books.forEach((book) => {this.addBook(book)});
    }

    static addBook(book) {
        const bookList = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        bookList.appendChild(row);
    }

    static deleteBook(el) {
        console.log(el.classList);
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        const div = document.createElement('div');

        div.className = `alert alert-${className}`;
        div.innerText = message;

        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#genre').value = '';
    }

}

// Store class: Persistence of data
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title, author) {
        console.log(`${title}, ${author}`);
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.title === title && book.author === author) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

}

// Event: Display Books
document.addEventListener('DOMContentLoaded', () => {UI.displayBooks()});

// Event: Add a book
document.querySelector('#book-form')
    .addEventListener('submit', (e) => {
        // Prevent default form action
        e.preventDefault();

        // Fetch values from form
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const genre = document.querySelector('#genre').value;

        // Validation
        if (title === '' || author === '') {
            UI.showAlert("Please fill in title and author", "danger");
        } else {
            // Instantiate a book
            const book = new Book(title, author, genre);

            // Add the book to the list
            const bookAdded = UI.addBook(book);

            // Add book to data store
            Store.addBook(book);

            UI.showAlert('Book added!', 'success');

            // Clear the form
            UI.clearFields();
        }
    });

// Event: Delete a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    const target = e.target;
    UI.deleteBook(target);

    const author = target.parentElement.previousElementSibling.previousElementSibling;
    const title = author.previousElementSibling;

    Store.removeBook(title.textContent, author.textContent);
    UI.showAlert('Book removed!', 'success');
});
