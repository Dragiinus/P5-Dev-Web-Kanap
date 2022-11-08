function displayCart() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  for (let i = 0; i < cart.length; i++) {
    let selectedProduct = fetchProduct(cart[i]);
    let getPrices = fetchPrices(cart[i], cart);
  }
  cartTotalPrice(cart);
}

function fetchPrices(cartItem, cart) {
  fetch("http://localhost:3000/api/products/" + cartItem.id)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    } else if (res.id === undefined) {
        throw new Error("Ce produit n'existe pas");
    } else {
        throw new Error("La réponse du réseau a échoué")
    }
  })
  .then(function(product) {
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
      cart.forEach(cartItem => {

        totalQuantity += parseInt(cartItem.quantity);
        totalPrice = totalPrice + (product.price * cartItem.quantity);
      });
    }
    document.getElementById('totalQuantity').innerHTML = totalQuantity;
    document.getElementById('totalPrice').innerHTML = totalPrice;
  })
}

function cartTotalPrice(cart) {

  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length > 0) {
    cart.forEach(cartItem => {

      totalQuantity += parseInt(cartItem.quantity);
      totalPrice = totalPrice + (cartItem.price * cartItem.quantity);
    });
  }
  document.getElementById('totalQuantity').innerHTML = totalQuantity;
  document.getElementById('totalPrice').innerHTML = totalPrice;
}

//  Call API Data
function fetchProduct(cartItem) {
  fetch("http://localhost:3000/api/products/" + cartItem.id)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    } else if (res.id === undefined) {
        throw new Error("Ce produit n'existe pas");
    } else {
        throw new Error("La réponse du réseau a échoué")
    }
  })
  .then(function(product) {
    let color = cartItem.color;
    let quantity = cartItem.quantity;
    displayCartItems(product, color, quantity);

    let changeQuantity = document.getElementById(`itemQuantityId_${product._id}`);
    changeQuantity.addEventListener("input", function () {
      let newQuantity = changeQuantity.value;
      console.log(newQuantity);
      let cart = JSON.parse(localStorage.getItem('cart'));
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartItem.id) {
          cart[i].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(cart));
          console.log(cart);

          window.location.reload();
        }
      }
    })

    let removeProduct = document.getElementById(`productId_${product._id}`);
    removeProduct.addEventListener("click", function () {
      let cart = JSON.parse(localStorage.getItem('cart'));
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartItem.id) {
          cart.splice(i, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          window.location.reload();
        }
      }
    })
  })
}

function displayCartItems(product, color, quantity) {

  // Create div for display settings

  // Add quantity input
  let input = document.createElement('input');
  input.id = `itemQuantityId_${product._id}`
  input.className = 'itemQuantity';
  input.setAttribute('name', 'itemQuantity');
  input.setAttribute('type', 'number');
  input.setAttribute('min', 1);
  input.setAttribute('max', 100);
  input.setAttribute('value', quantity);

  // Add product quantity
  let displayQuantity = document.createElement('p');
  let productQuantity = document.createTextNode(`Qté : ${quantity}`);
  displayQuantity.appendChild(productQuantity);

  // Delete item
  let deleteItem = document.createElement('p');
  deleteItem.className = 'deleteItem';
  deleteItem.id = `productId_${product._id}`
  let textDelete = document.createTextNode('Supprimer');
  deleteItem.appendChild(textDelete);

  // Settings
  let settings = document.createElement('div');
  settings.className = 'cart__item__content__settings__quantity';
  settings.appendChild(displayQuantity);
  settings.appendChild(input);

  let settingsDelete = document.createElement('div');
  settingsDelete.className = 'cart__item__content__settings__delete';
  settingsDelete.appendChild(deleteItem);

  let cartItemContentSettings = document.createElement('div');
  cartItemContentSettings.className = 'cart__item__content__settings';
  cartItemContentSettings.appendChild(settings);
  cartItemContentSettings.appendChild(settingsDelete);

  // CREATE DIV TO DISPLAY CONTENT
  
  // Add product price
  let price = document.createElement('p');
  let productPrice = document.createTextNode(`${product.price} €`);
  price.appendChild(productPrice);

  // Add product color
  let displayColor = document.createElement('p');
  let productColor = document.createTextNode(color);
  displayColor.appendChild(productColor);

  // Add product name
  let name = document.createElement('h2');
  let productName = document.createTextNode(product.name)
  name.appendChild(productName);

  let cartItemContentDescription = document.createElement('div');
  cartItemContentDescription.appendChild(name);
  cartItemContentDescription.appendChild(displayColor);
  cartItemContentDescription.appendChild(price);

  let cartItemContent = document.createElement('div');
  cartItemContent.className = 'cart__item__content';
  cartItemContent.appendChild(cartItemContentDescription);
  cartItemContent.appendChild(cartItemContentSettings);

  // Create div for display img
  let img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt =product.altTxt;

  let cartItemImg = document.createElement('div');
  cartItemImg.className = 'cart__item__img';
  cartItemImg.appendChild(img);

  // Create article tag with data
  let article = document.createElement('article');
  article.className = 'cart__item';
  article.setAttribute('data-id', 1);
  article.setAttribute('data-color', color);
  article.appendChild(cartItemImg);
  article.appendChild(cartItemContent);

  document.getElementById('cart__items').appendChild(article);
}

displayCart();