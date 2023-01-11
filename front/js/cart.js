let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
function checkCart(backData) {
    let idsToCompare = new Set(backData.map(elem => elem._id));
    cart = cart.filter(product => {
        if (idsToCompare.has(product.terminalId)) {
            let match = backData.find(elem => elem._id === product.terminalId);
            product.terminalName = match.name;
            console.log(product);
            return true;
        }
        console.log(product);
        return false;
    });
}

function drawCart(cart) {
    let zonePanier = document.querySelector("#cart__items");
    zonePanier.innerHTML = cart.map((choix) => 
    `<article class="cart__item" data-id="${choix.terminalId}" data-couleur="${choix.terminalColor}" data-quantité="${choix.terminalQty}" data-prix="${choix.terminalPrice}"> 
      <div class="cart__item__img">
        <img src="${choix.terminalImage}" alt="${choix.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${choix.terminalName}</h2>
          <span>couleur : ${choix.terminalColor}</span>
          <p data-prix="${choix.terminalPrice}">${choix.terminalPrice} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Quantity : </p>
            <input type="number" class="itemQuantity" min="1" max="100" value="${choix.terminalQty}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${choix.terminalId}" data-couleur="${choix.terminalColor}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
    ); 
 }
if (cart.length === 0) {
    document.title = "Your cart is empty"
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
} else {
    fetch("http://localhost:3000/api/products")
        .then(function (response) {
            return response.json();
        })
        .then(function (backData) {
            checkCart(backData);
            drawCart(cart);
            document.title = cart.length + " produits dans votre panier";
        })
}