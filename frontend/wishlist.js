let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let container = document.getElementById("wishlistItems");
let emptyState = document.getElementById("emptyState");

if (wishlist.length === 0) {
    container.style.display = "none";
    emptyState.style.display = "block";
} else {
    emptyState.style.display = "none";
    container.style.display = "block";

    wishlist.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        container.appendChild(li);
    });
}