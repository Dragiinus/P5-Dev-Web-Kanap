let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id);

fetch("http://localhost:3000/api/products/" + id)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    } else if (res.id === undefined) {
        throw new Error("Ce produit n'existe pas");
    }   else {
        throw new Error("La réponse du réseau a échoué")
    }
  })