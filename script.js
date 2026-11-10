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
            + "&maxResults=20";

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

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

            if (info.imageLinks) {
                cover.src = info.imageLinks.thumbnail;
            }

            cover.alt = info.title || "Book cover";

            const title = document.createElement("h3");
            title.textContent = info.title || "Untitled";

            const author = document.createElement("p");
            author.textContent = info.authors
                ? info.authors.join(", ")
                : "Unknown author";

            bookCard.appendChild(cover);
            bookCard.appendChild(title);
            bookCard.appendChild(author);

            results.appendChild(bookCard);

        });

    } catch (error) {

        console.error(error);
        results.innerHTML = "Could not connect to Google Books.";

    }
}