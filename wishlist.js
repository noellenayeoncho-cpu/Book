
function displayWishlist() {

    const results = document.getElementById("wishlistResults");

    let wishlist = JSON.parse(localStorage.getItem("wishlistBooks")) || [];

    results.innerHTML = "";

    if (wishlist.length === 0) {
        results.innerHTML = "<p>Your Wishlist is empty! </p>";
        return;
    }

    wishlist.forEach(book => {

        const card = document.createElement("div");
        card.className = "book-card";

        const cover = document.createElement("img");
        cover.src = book.image;
        cover.alt = book.title;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "add-wishlist";

        removeButton.addEventListener("click", () => {
            removeFromWishlist(book.id);
        });

        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(removeButton);

        results.appendChild(card);

    });

}


function removeFromWishlist(bookId) {

    let wishlist = JSON.parse(localStorage.getItem("wishlistBooks")) || [];

    wishlist = wishlist.filter(book => book.id !== bookId);

    localStorage.setItem("wishlistBooks", JSON.stringify(wishlist));

    displayWishlist();

}


displayWishlist();