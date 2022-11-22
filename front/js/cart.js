// Display Selected product and price in cart
function displayCart() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  for (let i = 0; i < cart.length; i++) {
    let selectedProduct = fetchProduct(cart[i]);
    let getPrices = fetchPrices(cart[i], cart);
  }
  let order = document.getElementById('order');
  order.addEventListener("click", checkOrderForm);
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
    let id = cartItem.id
    displayCartItems(product, color, quantity);

    // Change Item Quantity from cart
    let changeQuantity = document.getElementsByClassName('itemQuantity');
    for (i = 0; i < changeQuantity.length; i++) {
      changeQuantity[i].addEventListener('input', event => {
        let dataColor = event.currentTarget.parentNode.parentNode.parentNode.parentNode.dataset.color;
        let newQuantity = event.target.value;
        let cart = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === cartItem.id && cart[i].color === dataColor) {
            cart[i].quantity = newQuantity;
            if (cart[i].quantity < 1 || cart[i].quantity > 100) {
              window.alert("Quantité incorrecte. Merci d'indiquer un nombre entre 1 et 100");
              window.location.reload();
            } else {
              localStorage.setItem('cart', JSON.stringify(cart));
              console.log(cart);

              window.location.reload();
            }
          }
        }
      })
    }

    // Delete item from cart
    let removeProduct = document.getElementsByClassName('deleteItem');
    for (i = 0; i < removeProduct.length; i++) {
      removeProduct[i].addEventListener('click', event => {
        let dataId = event.currentTarget.parentNode.parentNode.parentNode.parentNode.dataset.id;
        let dataColor = event.currentTarget.parentNode.parentNode.parentNode.parentNode.dataset.color;
        let cart = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === cartItem.id && cart[i].color === dataColor) {
            cart.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.reload();
          }
        }
      })
    }
  })
}

// call the API to display total price
function fetchPrices(cartItem, cart) {
  fetch("http://localhost:3000/api/products/" + cartItem.id)
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else if (response.id === undefined) {
      throw new Error("This product id does not exist");
    } else {
      throw new Error("Network response failed");
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

// Display selected product
function displayCartItems(product, color, quantity) {

  // Create div for display settings

  // Add quantity input
  let input = document.createElement('input');
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

  // Change direction of quantity settings
  let settings = document.createElement('div');
  settings.className = 'cart__item__content__settings__quantity';
  settings.appendChild(displayQuantity);
  settings.appendChild(input);

  // Add hover on delete item
  let settingsDelete = document.createElement('div');
  settingsDelete.className = 'cart__item__content__settings__delete';
  settingsDelete.appendChild(deleteItem);

  // Display frame of quantity
  let cartItemContentSettings = document.createElement('div');
  cartItemContentSettings.className = 'cart__item__content__settings';
  cartItemContentSettings.appendChild(settings);
  cartItemContentSettings.appendChild(settingsDelete);

  // Create div for display content

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

  // Add product description
  let cartItemContentDescription = document.createElement('div');
  cartItemContentDescription.appendChild(name);
  cartItemContentDescription.appendChild(displayColor);
  cartItemContentDescription.appendChild(price);

  // Display description of product and settings
  let cartItemContent = document.createElement('div');
  cartItemContent.className = 'cart__item__content';
  cartItemContent.appendChild(cartItemContentDescription);
  cartItemContent.appendChild(cartItemContentSettings);

  // Create div for display img
  let img = document.createElement('img');
  img.src = product.imageUrl;
  img.alt = product.altTxt;

  // Display img of product
  let cartItemImg = document.createElement('div');
  cartItemImg.className = 'cart__item__img';
  cartItemImg.appendChild(img);

  // Create article tag with data
  let article = document.createElement('article');
  article.className = 'cart__item';
  article.setAttribute('data-id', product._id);
  article.setAttribute('data-color', color);
  article.appendChild(cartItemImg);
  article.appendChild(cartItemContent);

  document.getElementById('cart__items').appendChild(article);
}

// Check is form is correct
function checkOrderForm(event) {
  event.preventDefault();

  // Create contact object to persist user infos
  let contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value
  }

  // Check validity of each field of input
  let isFormValid = (
    checkValidity(contact.firstName)
    &&checkValidity(contact.lastName)
    &&checkIfFilled(contact.address)
    &&checkValidity(contact.city)
    &&checkEmailValidity(contact.email)
  )

  // Display error message if first name is not correct
  if (!checkValidity(contact.firstName)) {
    let firstNameError = document.getElementById('firstNameErrorMsg')
    let ErrorMsg = 'Veuillez saisir un prénom valide';
    firstNameError.innerHTML = ErrorMsg;
  }

  // Display error message if last name is not correct
  if (!checkValidity(contact.lastName)) {
    let lastNameError = document.getElementById('lastNameErrorMsg')
    let ErrorMsg = 'Veuillez saisir un nom valide';
    lastNameError.innerHTML = ErrorMsg;
  }

  // Display error message if address is not correct
  if (!checkIfFilled(contact.address)) {
    let addressError = document.getElementById('addressErrorMsg')
    let ErrorMsg = 'Veuillez saisir une adresse valide';
    addressError.innerHTML = ErrorMsg;
  }

  // Display error message if city is not correct
  if (!checkValidity(contact.city)) {
    let cityError = document.getElementById('cityErrorMsg')
    let ErrorMsg = 'Veuillez saisir une ville valide';
    cityError.innerHTML = ErrorMsg;
  }

  // Display error message if email is not correct
  if (!checkEmailValidity(contact.email)) {
    let emailError = document.getElementById('emailErrorMsg')
    let ErrorMsg = 'Veuillez saisir une adresse email valide';
    emailError.innerHTML = ErrorMsg;
  }
  if (isFormValid) {
    sendOrder(contact);
  }
}

// Check that address input is not empty
function checkIfFilled(value) {
  return value !== "";
}

// Check that email is valid
function checkEmailValidity(value) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
}

// Check that first name, last name and city inputs are valid
function checkValidity(value) {
  return (/^[a-z ,.'-éèà]+$/i).test(value);
}

// Send order to API and redirect user to confirmaiton page
function sendOrder(contact) {
 let cart = JSON.parse(localStorage.getItem('cart'));
  let products = [];
  for (item of cart) {
    products.push(item.id);
  }

  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contact,
      products
    })
  })
  .then(function(response) {

    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response failed");
    }
  })
  .then((data) => {
    console.log(data);
    localStorage.setItem("order", JSON.stringify(data));
    clearLocalStorageCart();
    location.href = `confirmation.html?orderid=${data.orderId}`;
  })
  .catch(function(err) {
    console.error(err)
  });
}

// Clear the cart in localStorage
function clearLocalStorageCart() {
  localStorage.setItem("cart", "[]");
}



displayCart();