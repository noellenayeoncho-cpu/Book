const API_KEY = "AIzaSyD2PrlmK5m89d8fNjkrYVTCe0JdVJkBqvc";

let selectedBook = null;

async function searchBooks() {

    const searchInput = document.getElementById("bookSearch").value.trim();
    const results = document.getElementById("results");

    if (searchInput === "") {
        results.innerHTML = "Please enter a book title or author!";
        return;
    }

    results.innerHTML = "Searching...";

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

            // TITLE AND PLUS BUTTON
            const bookInfo = document.createElement("div");
            bookInfo.className = "book-info-row";

            const addButton = document.createElement("button");
            addButton.className = "add-button";
            addButton.textContent = "+";
            addButton.title = "Add to Wishlist";

            addButton.addEventListener("click", (event) => {
                event.stopPropagation();
                addToWishlist(book);
            });

            bookInfo.appendChild(title);
            bookInfo.appendChild(addButton);
            cover.addEventListener("click", () => {
                openBookModal(book);
            });

            title.addEventListener("click", () => {
                openBookModal(book);
            });

            title.style.cursor = "pointer";

            bookCard.appendChild(cover);
            bookCard.appendChild(bookInfo);

            results.appendChild(bookCard);

        });

    } catch (error) {

        console.error(error);
        results.innerHTML = "Could not connect to Google Books.";

    }
}

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

function closeBookModal() {

    document.getElementById("bookModal").style.display = "none";

}

function addToWishlist(book) {

    let wishlist = JSON.parse(localStorage.getItem("wishlistBooks")) || [];

    if (wishlist.some(item => item.id === book.id)) {
        alert("This book is already in your Wishlist!");
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

    alert("Added to your Wishlist!");

}


document.getElementById("modalAddButton").addEventListener("click", () => {

    if (selectedBook) {
        addToWishlist(selectedBook);
    }

});



document.getElementById("bookModal").addEventListener("click", (event) => {

    if (event.target.id === "bookModal") {
        closeBookModal();
    }

});



document.getElementById("bookSearch").addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBooks();
    }

});