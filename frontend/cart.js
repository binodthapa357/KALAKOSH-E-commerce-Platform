// Empty cart example
// const cartItems = [];


// Cart has item example
const cartItems = [1];

const cartContent =
    document.getElementById("cart-content");

const emptyCart =
    document.getElementById("empty-cart");

const summary =
    document.getElementById("summary");

if(cartItems.length === 0){

    cartContent.style.display = "none";

    summary.style.display = "none";

    emptyCart.style.display = "block";

}
else{

    cartContent.style.display = "block";

    summary.style.display = "block";

    emptyCart.style.display = "none";

}