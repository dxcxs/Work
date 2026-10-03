// 1. Product object with multiple properties
let product = {
  name: "Wireless Mouse",
  price: 599,
  stock: 25
};

// 2. Function to display product information dynamically
function displayProduct(item) {
  const stockStatus = item.stock > 0
    ? `<span class="in">In stock (${item.stock} left)</span>`
    : `<span class="out">Out of stock</span>`;

  // Show on the web page
  document.getElementById("productInfo").innerHTML = `
    <h2>${item.name}</h2>
    <p>Price: ${item.price.toLocaleString()} THB</p>
    <p>Stock: ${stockStatus}</p>
  `;

  // Also show in the console
  console.log(`Name: ${item.name}`);
  console.log(`Price: ${item.price}`);
  console.log(`Stock: ${item.stock}`);
}

displayProduct(product);

// To test: change product.stock = 0; then call displayProduct(product); again
