//Exctract API Data
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(products) {
    console.log(products);
    for (let i = 0; i < products.length; i++) {
      displayProducts(products[i]);
    }
  })
  .catch(function(err) {
    console.error('Fetch error:', err)
    // Une erreur est survenue
  });

function displayProducts(product) {

  // Create Descriptions
  let description = document.createElement('p');
  description.classList.add('productDescription');
  let textDescription = document.createTextNode(product.description);
  description.appendChild(textDescription);

  // Create Header
  let header = document.createElement('h3');
  header.classList.add("productName");
  let productName = document.createTextNode(product.name);
  header.appendChild(productName);

  // Create Image
  let img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt =product.altTxt;

  // Create Article with Children
  let article = document.createElement('article');
  article.appendChild(img);
  article.appendChild(header);
  article.appendChild(description);

  // Create Link
  let elementA = document.createElement("a");
  elementA.href = `product.html?id=${product._id}`;
  elementA.appendChild(article);
  document.querySelector("#items").appendChild(elementA);
}