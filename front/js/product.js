//  id retrieval
let params = new URL(document.location).searchParams;
let Getid = params.get("id");

//  Call API Data
function fetchProduct(Getid) {
  fetch("http://localhost:3000/api/products/" + Getid)
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
      displayKanap(product);

      // Select Product
      let selectedProduct = {
        id: product._id,
        price: product.price
      }
      // Select color
      let selectedColor = selectColor(selectedProduct);
      // Select Quantity
      let selectedQuantity = selectQuantity(selectedProduct);

      // Check Users Inputs
      let addToCart = document.getElementById('addToCart');
      addToCart.addEventListener("click", function (event) {
        if (isNaN(parseInt(selectedProduct.quantity)) || parseInt(selectedProduct.quantity) === 0 || selectedProduct.color === undefined || selectedProduct.color === ''){
          window.alert('Veuillez sélectionner tous les champs');
        } else if (parseInt(selectedProduct.quantity) > 100) {
          window.alert('Vous ne pouvez pas choisir plus de 100 produits');
        } else {
          addProductToCart(event, selectedProduct);
          window.alert('L"article a bien été ajouté au panier');
        }
      });
    })
}

// Display product
function displayKanap(product) {
  // Diplay Img
  let img = document.createElement('img');
  img.src = product.imageUrl;
  img.setAttribute("alt", product.altTxt);
  document.querySelector('.item__img').appendChild(img);

  // Display product name
  let title = document.createTextNode(product.name)
  document.getElementById('title').appendChild(title);

  // Display product price
  let price = document.createTextNode(product.price)
  document.getElementById('price').appendChild(price);

  // Display product description
  let description = document.createTextNode(product.description)
  document.getElementById('description').appendChild(description);

  // Display product colors
  for (let i = 0; i < product.colors.length; i++) {
    let colorOption = document.createElement("option");
    colorOption.setAttribute("value", product.colors[i]);
    text = document.createTextNode(product.colors[i]);
    colorOption.appendChild(text);
    document.getElementById('colors').appendChild(colorOption);
  }
}

  // Color selected by user
  function selectColor(selectedProduct) {
    // Save Selected Color
    let elem = document.getElementById('colors');
    elem.addEventListener('change', function() {
      selectedProduct.color = elem.value;
      return selectedProduct;
    })
  };

  //Quantity selected by user
  function selectQuantity(selectedProduct) {
    // Save Selected Quantity
    let elem = document.getElementById('quantity');
    elem.addEventListener('input', function() {
      selectedProduct.quantity = elem.value;
      return selectedProduct;
    })
  };

  // Add product to cart
  function addProductToCart(event, selectedProduct) {
  event.preventDefault();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let ifExists = false;

  if (cart.length === 0) {
    cart.push(selectedProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    for (i = 0; i < cart.length; i++) {
      if (cart[i].id === selectedProduct.id && cart[i].color === selectedProduct.color) {
        cart[i].quantity = (parseInt(cart[i].quantity) + parseInt(selectedProduct.quantity)).toString();
        if (cart[i].quantity < 101) {
          cart.push(cart[i]);
          cart.splice(i, 1);

          localStorage.setItem('cart', JSON.stringify(cart));

          ifExists = true;
        } else {
          ifExists = true;
        }
      }
    }
    if (ifExists === false) {
      cart.push(selectedProduct);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    }
  }
  
  fetchProduct(Getid);