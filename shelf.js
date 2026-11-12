function displayReadingBooks() {
    const results = document.getElementById("readingResults");
    let books = JSON.parse(localStorage.getItem("readingBooks")) || [];

    results.innerHTML = "";

    if (books.length === 0) {
        results.innerHTML = "<p>Your Reading Shelf is empty! Go discover some books ♡</p>";
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

        const rating = document.createElement("select");
        rating.className = "book-rating";

        rating.innerHTML = `
            <option value="">Rate</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
        `;

        rating.value = book.rating || "";

        rating.addEventListener("change", () => {
            book.rating = Number(rating.value);
            localStorage.setItem("readingBooks", JSON.stringify(books));
            showShelfNotification("Rating saved! ♡");
        });

        // FINISHED BUTTON
        const finishedButton = document.createElement("button");
        finishedButton.className = "add-wishlist";
        finishedButton.textContent = "✓ Finished";

        finishedButton.addEventListener("click", () => {
            markAsFinished(book.id);
        });

        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(rating);
        card.appendChild(finishedButton);

        results.appendChild(card);
    });
}


function markAsFinished(bookId) {
    let shelf = JSON.parse(localStorage.getItem("readingBooks")) || [];
    let finished = JSON.parse(localStorage.getItem("readBooks")) || [];

    const book = shelf.find(item => item.id === bookId);

    if (!book) return;

    book.finishedDate = new Date().toLocaleDateString();

    finished.push(book);

    shelf = shelf.filter(item => item.id !== bookId);

    localStorage.setItem("readingBooks", JSON.stringify(shelf));
    localStorage.setItem("readBooks", JSON.stringify(finished));

    displayReadingBooks();
    showShelfNotification("Moved to Finished Books! ♡");
}


function showShelfNotification(message) {
    alert(message);
}

displayReadingBooks();