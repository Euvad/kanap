// Initialisation du panier avec les données du local storage
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// Référence à la section dans laquelle les articles seront affichés
let zonePanier = document.querySelector("#cart__items");

// Expression régulière pour vérifier le nom
let nameRegex = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{2,}$/);

// Expression régulière pour vérifier l'adresse
let addressRegex = /^[a-zA-Z0-9\s,'-]{3,}$/;

// Expression régulière pour vérifier la ville
let cityRegex = /^[a-zA-Z\s-]{2,}$/;

// Expression régulière pour vérifier l'email
let emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/);

// Extraction des identifiants de produits du panier
let idsProduct = cart.map(item => item.terminalId);

// Afficher les articles du panier
drawCart(cart);

// Vérifier le formulaire
formCheck();

// Calculer le total
totalCalc();

// Fonction pour supprimer un article du panier
function productDelete(e) {
  // Récupération de l'identifiant du produit à supprimer
  let productId = e.target.getAttribute("data-id");

  // Recherche de l'article dans le panier
  let index = cart.findIndex(product => product.terminalId === productId);

  // Si l'article est trouvé, le supprimer et mettre à jour le local storage
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    drawCart(cart);
    // Recharger la page pour afficher les changements
    document.location.reload();
  }
}
// Fonction pour éditer la quantité d'un produit dans le panier
function productEdit(e) {
  // Vérifie si la classe de la cible de l'événement contient "itemQuantity"
  if (e.target.classList.contains("itemQuantity")) {
    // Récupère l'ID du produit le plus proche de la cible de l'événement
    let productId = e.target.closest(".cart__item").getAttribute("data-id");
    // Récupère la couleur du produit le plus proche de la cible de l'événement
    let productColor = e.target.closest(".cart__item").getAttribute("data-couleur");
    // Convertit la valeur de la cible de l'événement en entier
    let newQuantity = parseInt(e.target.value);
    // Trouve l'index du produit dans le panier en utilisant l'ID et la couleur
    let index = cart.findIndex(product => product.terminalId === productId && product.terminalColor === productColor);
    // Si le produit est trouvé dans le panier
    if (index !== -1) {
      // Modifie la quantité du produit dans le panier
      cart[index].terminalQty = newQuantity;
      // Enregistre les modifications dans le local storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // Redessine le panier avec les modifications apportées
      drawCart(cart);
      // Recharge la page pour afficher les modifications
      document.location.reload();
    }
  }
}

function drawCart(cart) {
  // Si le panier est vide
  if (cart.length === 0) {
    // La zone du panier est vide
    zonePanier.innerHTML = "";
    // Le titre de la page est "Your cart is empty"
    document.title = "Votre panier est vide";
    // La quantité totale dans le panier est mise à 0
    document.querySelector("#totalQuantity").innerHTML = "0";
    // Le prix total dans le panier est mis à 0
    document.querySelector("#totalPrice").innerHTML = "0";
    // Le titre h1 est mis à "Vous n'avez pas d'article dans votre panier"
    document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
  } else {
    // La zone du panier est remplie avec les articles du panier
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
    // Changer le titre de la page en indiquant le nombre de produits dans le panier
    document.title = cart.length + " produits dans votre panier";

    // Ajouter un écouteur d'événement pour tous les éléments avec la classe "itemQuantity" pour appeler la fonction "productEdit" lorsque la quantité d'un produit est modifiée
    document.querySelectorAll(".itemQuantity").forEach(input => input.addEventListener("change", productEdit));

    // Ajouter un écouteur d'événement pour tous les éléments avec la classe "deleteItem" pour appeler la fonction "productDelete" lorsqu'un produit est supprimé
    document.querySelectorAll(".deleteItem").forEach(input => input.addEventListener("click", productDelete));
  }
}

// Fonction de vérification de formulaire
function formCheck() {
  // Récupère le formulaire
  let form = document.querySelector('.cart__order__form');
  // Ajouter un écouteur d'événement de soumission de formulaire
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // empêche la soumission du formulaire

    // Expressions régulières pour valider les entrées de l'utilisateur
    let nameRegex = /^[a-zA-Z]+$/;
    let addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
    let cityRegex = /^[a-zA-Z\s]*$/;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Récupère les valeurs des champs de formulaire
    let firstName = document.querySelector('input[name="firstName"]');
    let lastName = document.querySelector('input[name="lastName"]');
    let address = document.querySelector('input[name="address"]');
    let city = document.querySelector('input[name="city"]');
    let email = document.querySelector('input[name="email"]');

    // Vérifie que les entrées de l'utilisateur sont valides
    let firstNameValid = nameRegex.test(firstName.value);
    let lastNameValid = nameRegex.test(lastName.value);
    let addressValid = addressRegex.test(address.value);
    let cityValid = cityRegex.test(city.value);
    let emailValid = emailRegex.test(email.value);

    // Définit l'objet de contact
    const contact = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      },
      products: idsProduct
    };

    // Options pour la requête fetch
    const option = {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // Si toutes les données de formulaire sont valides et que des produits ont été sélectionnés, soumettre le formulaire
    if (firstNameValid && lastNameValid && addressValid && cityValid && emailValid && contact.products != 0) {
      // Afficher un message dans la console indiquant que le formulaire a été soumis avec succès
      console.log("Formulaire soumis avec succès!");

      // Envoyer les données de formulaire à une API de traitement de commandes
      fetch('http://localhost:3000/api/products/order', option)
        .then(res => res.json())
        .then(response => {
          // Supprimer les données de commande précédentes de localStorage
          localStorage.clear();
          // Stocker l'ID de commande dans localStorage
          localStorage.setItem("order_id", JSON.stringify(response));
          // Rediriger l'utilisateur vers la page de confirmation
          window.location.assign('http://localhost/site/front/html/confirmation.html');
        })
        .catch(error => console.error('Error:', error));
    } else {
      // Si l'un des champs de formulaire n'est pas valide, afficher un message d'erreur
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
      if (contact.products == 0) {
        // Si le panier est vide, afficher un message d'alerte
        alert("Votre panier est vide.");
      }
    }
  });
}

// Fonction pour calculer le total de la quantité et du prix des produits
function totalCalc() {
  let totalQuantity = 0; // Initialiser la quantité totale à zéro
  let totalPrice = 0; // Initialiser le prix total à zéro
  
  // Boucle pour parcourir le tableau "cart" et calculer la quantité totale et le prix total des produits
  for (let i = 0; i < cart.length; i++) {
  totalQuantity += cart[i].terminalQty;
  totalPrice += cart[i].terminalQty * cart[i].terminalPrice;
  }
  
  // Afficher la quantité totale et le prix total des produits sur la page web
  document.querySelector('#totalQuantity').innerHTML = totalQuantity;
  document.querySelector('#totalPrice').innerHTML = totalPrice.toFixed(2);
  }