let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let zonePanier = document.querySelector("#cart__items");

//regex
let nameRegex = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{2,}$/);
let addressRegex = /^[a-zA-Z0-9\s,'-]{3,}$/;
let cityRegex = /^[a-zA-Z\s-]{2,}$/;
let emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
let idsProduct = cart.map(item => item.terminalId);
drawCart(cart);
formCheck();
totalCalc();

function productDelete(e) {
  let productId = e.target.getAttribute("data-id");
  let index = cart.findIndex(product => product.terminalId === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    drawCart(cart);
    document.location.reload();
  }
}
function productEdit(e) {
  if (e.target.classList.contains("itemQuantity")) {
    let productId = e.target.closest(".cart__item").getAttribute("data-id");
    let productColor = e.target.closest(".cart__item").getAttribute("data-couleur");
    let newQuantity = parseInt(e.target.value);
    let index = cart.findIndex(product => product.terminalId === productId && product.terminalColor === productColor);
    if (index !== -1) {
      cart[index].terminalQty = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      drawCart(cart);
      document.location.reload();
    }
  }
}

function drawCart(cart) {
  if (cart.length === 0) {
    zonePanier.innerHTML = "";
    document.title = "Your cart is empty"
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
  } else {
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
    document.title = cart.length + " produits dans votre panier";
    document.querySelectorAll(".itemQuantity").forEach(input => input.addEventListener("change", productEdit));
    document.querySelectorAll(".deleteItem").forEach(input => input.addEventListener("click", productDelete));
  }
}

function formCheck() {
  let form = document.querySelector('.cart__order__form');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // empêche la soumission du formulaire



    // Expressions régulières pour valider les entrées de l'utilisateur
    let nameRegex = /^[a-zA-Z]+$/;
    let addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
    let cityRegex = /^[a-zA-Z\s]*$/;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Vérifie que les entrées de l'utilisateur sont valides
    let firstNameValid = nameRegex.test(firstName.value);
    let lastNameValid = nameRegex.test(lastName.value);
    let addressValid = addressRegex.test(address.value);
    let cityValid = cityRegex.test(city.value);
    let emailValid = emailRegex.test(email.value);
    const contact = {
      contact: {
        firstName: document.querySelector('input[name="firstName"]').value,
        lastName: document.querySelector('input[name="lastName"]').value,
        address: document.querySelector('input[name="address"]').value,
        city: document.querySelector('input[name="city"]').value,
        email: document.querySelector('input[name="email"]').value
      },
      products: idsProduct
    };
    const option = {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (firstNameValid && lastNameValid && addressValid && cityValid && emailValid && contact.products != 0) {
      console.log("Formulaire soumis avec succès!");
      fetch('http://localhost:3000/api/products/order', option)
        .then(res => res.json())
        .then(response => {
          localStorage.clear();
          localStorage.setItem("order_id", JSON.stringify(response));
          window.location.assign('http://localhost/site/front/html/confirmation.html');
        })
        .catch(error => console.error('Error:', error));
      // Soumettre les données à un script de traitement côté serveur, par exemple
    } else {
      // Afficher des messages d'erreur pour les champs non valides
      if (!firstNameValid) {
        document.querySelector('#firstNameErrorMsg').innerHTML = "Veuillez entrer un prénom valide.";
      }
      if (!lastNameValid) {
        document.querySelector('#lastNameErrorMsg').innerHTML = "Veuillez entrer un nom de famille valide.";
      }
      if (!addressValid) {
        document.querySelector('#addressErrorMsg').innerHTML = "Veuillez entrer une adresse valide.";
      }
      if (!cityValid) {
        document.querySelector('#cityErrorMsg').innerHTML = "Veuillez entrer une ville valide.";
      }
      if (!emailValid) {
        document.querySelector('#emailErrorMsg').innerHTML = "Veuillez entrer une adresse email valide.";
      }
      if (contact.products == 0){
        alert("Votre panier est vide.");
      }
    }
  });
}

function totalCalc() {
  let totalQuantity = 0;
  let totalPrice = 0;

  // Calcule la quantité totale et le prix total des produits
  for (let i = 0; i < cart.length; i++) {
    totalQuantity += cart[i].terminalQty;
    totalPrice += cart[i].terminalQty * cart[i].terminalPrice;
  }

  // Affiche la quantité totale et le prix total des produits
  document.querySelector('#totalQuantity').innerHTML = totalQuantity;
  document.querySelector('#totalPrice').innerHTML = totalPrice.toFixed(2);
}