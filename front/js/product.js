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

      let selectedProduct = {
        id: product._id,
        price: product.price
      }

      let selectedColor = selectColor(selectedProduct);
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
        }
      });
    })
}

  function addProductToCart(event, selectedProduct) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let pushCart = false;

    for (i = 0; i < cart.length; i++) {
      if (cart[i].id === selectedProduct.id && cart[i].color === selectedProduct.color) {
        pushCart = true;
      }
    }
    if (pushCart === false) {
      cart.push(selectedProduct);
      localStorage.setItem('cart', JSON.stringify(cart));
      toggleButton();
    }
  }

  function toggleButton() {
    let addToCart = document.getElementById('addToCart');
    addToCart.innerHTML = '<i class="fas fa-check"></i>Ajouté au panier !';
    addToCart.style.backgroundColor = "#3DE087";
    addToCart.style.borderColor = "#3DE087";
    addToCart.style.color = "black";
  }
  
  function selectColor(selectedProduct) {
    // Save Selected Color
    let elem = document.getElementById('colors');
    elem.addEventListener('change', function() {
      selectedProduct.color = elem.value;
      return selectedProduct;
    })
  };

  function selectQuantity(selectedProduct) {
    // Save Selected Quantity
    let elem = document.getElementById('quantity');
    elem.addEventListener('input', function() {
      selectedProduct.quantity = elem.value;
      return selectedProduct;
    })
  };

  function displayKanap(product) {

    // Display Img Product
    let img = document.createElement('img');
    img.src = product.imageUrl;
    document.querySelector('.item__img').appendChild(img);

    // Display Name Product
    let title = document.createTextNode(product.name)
    document.getElementById('title').appendChild(title);

    // Display Price Product
    let price = document.createTextNode(product.price)
    document.getElementById('price').appendChild(price);

    // Display Description Product
    let description = document.createTextNode(product.description)
    document.getElementById('description').appendChild(description);

    // Display Color Product
    for (let i = 0; i < product.colors.length; i++) {
      let colorOption = document.createElement("option");
      colorOption.setAttribute("value", product.colors[i]);
      text = document.createTextNode(product.colors[i]);
      colorOption.appendChild(text);
      document.getElementById('colors').appendChild(colorOption);
    }
  }
  
  fetchProduct(Getid);