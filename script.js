const API_KEY = "AIzaSyD2PrlmK5m89d8fNjkrYVTCe0JdVJkBqvc";

let selectedBook = null;

async function searchBooks() {
    const searchInput = document.getElementById("bookSearch").value.trim();
    const results = document.getElementById("results");

    if (searchInput === "") {
        results.innerHTML = "Please enter a book title or author!";
        return;
    }

    results.innerHTML = "Looking through the library...";

    try {
        const url = "https://www.googleapis.com/books/v1/volumes?q="
            + encodeURIComponent(searchInput)
            + "&maxResults=20"
            + "&key=" + API_KEY;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            results.innerHTML = "API Error: " + (data.error?.message || response.status);
            return;
        }

        if (!data.items || data.items.length === 0) {
            results.innerHTML = "No books found! Try another search.";
            return;
        }

        results.innerHTML = "";

        data.items.forEach(book => {
            const info = book.volumeInfo;

            const bookCard = document.createElement("div");
            bookCard.className = "book-card";

            const cover = document.createElement("img");
            cover.src = info.imageLinks?.thumbnail || "";
            cover.alt = info.title || "Book cover";

            const title = document.createElement("h3");
            title.textContent = info.title || "Untitled";
            title.style.cursor = "pointer";

            const bookInfo = document.createElement("div");
            bookInfo.className = "book-info-row";

            // ADD TO WISHLIST
            const addButton = document.createElement("button");
            addButton.className = "add-button";
            addButton.textContent = "+";
            addButton.title = "Add to Wishlist";

            addButton.addEventListener("click", (event) => {
                event.stopPropagation();
                addToWishlist(book);
            });

            // ADD TO READING SHELF
            const readingButton = document.createElement("button");
            readingButton.className = "add-button";
            readingButton.textContent = "📖";
            readingButton.title = "Add to Shelf";

            readingButton.addEventListener("click", (event) => {
                event.stopPropagation();
                saveBookToList(
                    book,
                    "readingBooks",
                    "Added to your Reading Shelf! ♡"
                );
            });

            // BUTTON CONTAINER
            const bookActions = document.createElement("div");
            bookActions.className = "book-actions";

            bookActions.appendChild(addButton);
            bookActions.appendChild(readingButton);

            bookInfo.appendChild(title);
            bookInfo.appendChild(bookActions);

            // OPEN BOOK SUMMARY
            cover.addEventListener("click", () => {
                openBookModal(book);
            });

            title.addEventListener("click", () => {
                openBookModal(book);
            });

            bookCard.appendChild(cover);
            bookCard.appendChild(bookInfo);

            results.appendChild(bookCard);
        });

    } catch (error) {
        console.error(error);
        results.innerHTML = "Could not connect to Google Books.";
    }
}


// OPEN BOOK SUMMARY
function openBookModal(book) {
    selectedBook = book;

    const info = book.volumeInfo;

    document.getElementById("modalImage").src =
        info.imageLinks?.thumbnail || "";

    document.getElementById("modalTitle").textContent =
        info.title || "Untitled";

    document.getElementById("modalSummary").textContent =
        info.description || "Sorry! No summary is available for this book.";

    document.getElementById("bookModal").style.display = "flex";
}


// CLOSE BOOK SUMMARY
function closeBookModal() {
    document.getElementById("bookModal").style.display = "none";
}


// ADD TO WISHLIST
function addToWishlist(book) {
    let wishlist = JSON.parse(localStorage.getItem("wishlistBooks")) || [];

    if (wishlist.some(item => item.id === book.id)) {
        showNotification("This book is already in your Wishlist! ♡");
        return;
    }

    const info = book.volumeInfo;

    const bookData = {
        id: book.id,
        title: info.title || "Untitled",
        image: info.imageLinks?.thumbnail || "",
        description: info.description || "No summary available."
    };

    wishlist.push(bookData);

    localStorage.setItem("wishlistBooks", JSON.stringify(wishlist));

    showNotification("Added to your Wishlist! ♡");
}


// ADD TO READING SHELF
function saveBookToList(book, listName, message) {
    let savedBooks = JSON.parse(localStorage.getItem(listName)) || [];

    if (savedBooks.some(item => item.id === book.id)) {
        showNotification("This book is already saved! ♡");
        return;
    }

    const info = book.volumeInfo;

    const bookData = {
        id: book.id,
        title: info.title || "Untitled",
        image: info.imageLinks?.thumbnail || "",
        description: info.description || "No summary available."
    };

    savedBooks.push(bookData);

    localStorage.setItem(listName, JSON.stringify(savedBooks));

    showNotification(message);
}


// ADD FROM BOOK SUMMARY
document.getElementById("modalAddButton").addEventListener("click", () => {
    if (selectedBook) {
        addToWishlist(selectedBook);
    }
});


// CLOSE SUMMARY WHEN CLICKING OUTSIDE
document.getElementById("bookModal").addEventListener("click", (event) => {
    if (event.target.id === "bookModal") {
        closeBookModal();
    }
});


// SEARCH USING ENTER
document.getElementById("bookSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBooks();
    }
});


// WEBSITE NOTIFICATION
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");

    notificationMessage.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}