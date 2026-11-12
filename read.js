function displayFinishedBooks() {
    const results = document.getElementById("finishedResults");
    let books = JSON.parse(localStorage.getItem("readBooks")) || [];

    results.innerHTML = "";

    if (books.length === 0) {
        results.innerHTML = "<p>You haven't finished any books yet! ♡</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";

        const cover = document.createElement("img");
        cover.src = book.image;
        cover.alt = book.title;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const rating = document.createElement("p");
        rating.textContent = book.rating
            ? "⭐".repeat(book.rating)
            : "Not rated yet";

        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(rating);

        results.appendChild(card);
    });
}

displayFinishedBooks();