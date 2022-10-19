//  id retrieval
let params = new URL(document.location).searchParams;
let Getid = params.get("id");
console.log(Getid);

//  Exctract API Data
function fetchProduct(Getid) {
  fetch("http://localhost:3000/api/products/" + Getid)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      } else if (res.id === undefined) {
          throw new Error("Ce produit n'existe pas");
      }   else {
          throw new Error("La réponse du réseau a échoué")
      }
    })
    .then(function(product) {
      displayKanap(product);
    })
  }

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