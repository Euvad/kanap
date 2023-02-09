// Récupération de l'ID du produit dans les paramètres d'URL
const productId = new URLSearchParams(window.location.search).get("id");

// Affichage de l'ID du produit dans la console
console.log(productId);

// Récupération des éléments HTML pour la couleur et la quantité du produit
const itemColor = document.getElementById("colors");
const itemQty = document.getElementById("quantity");

// Vérification si l'ID du produit existe
if (productId != null) {
  // Récupération des données du produit à partir de l'API
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
      // Conversion de la réponse en format JSON
      return response.json();
    })
    .then(async function (data) {
      // Vérification si les données ont été correctement récupérées
      if (await data) {
        // Appel de la fonction pour afficher les données du produit
        getPos(data)
      }
    })
}

// Fonction pour afficher les données du produit
function getPos(data) {
  // Affichage des données du produit dans la console
  console.log(data);
  
  // Mise à jour du titre de la page avec le nom du produit
  document.title = data.name;
  
  // Création d'une nouvelle image pour le produit
  const newImage = document.createElement("img");
  newImage.src = data.imageUrl;
  newImage.alt = data.altTxt;
  
  // Ajout de l'image au HTML
  document.querySelector('.item__img').appendChild(newImage);
  
  // Mise à jour du titre, prix et description du produit dans le HTML
  document.getElementById("title").innerText = data.name;
  document.getElementById("price").innerText = data.price;
  document.getElementById("description").innerText = data.description;
  
  // Boucle pour ajouter les couleurs disponibles pour le produit dans le menu déroulant
  data.colors.forEach(function (newColor) {
    // Création d'une nouvelle option pour la couleur
    const option = document.createElement("option");
    // Récupération du menu déroulant pour les couleurs
    const select = document.getElementById("colors");
    
    // Mise à jour de la valeur et du texte de l'option pour la couleur
    option.value = newColor;
    option.innerText = newColor;
    
    // Ajout de l'option à la liste des couleurs
    select.appendChild(option);
  });
  // Appel de la fonction pour ajouter le produit au panier
  addPanier(data)
}
// La fonction `addPanier` ajoute un article au panier.
// Elle s'applique à un objet `data` qui est défini ailleurs dans le code.

function addPanier(data) {
  // Référence au bouton "Ajouter au panier".
  const buttonCart = document.getElementById("addToCart");

  // Ajout d'un écouteur d'événement "click" au bouton.
  buttonCart.addEventListener("click", function () {
    // Vérification de la quantité et de la couleur sélectionnées.
    if (itemQty.value > 0 && itemQty.value <= 100 && itemColor.value != 0) {
      // Affectation de la valeur de la couleur et de la quantité sélectionnées à des variables.
      let finalColor = itemColor.value;
      let finalQty = itemQty.value;
      
      // Création d'un objet `productData` qui contient les détails du produit.
      let productData = {
        terminalId: productId,
        terminalColor: finalColor,
        terminalQty: Number(finalQty),
        terminalName: data.name,
        terminalImage: data.imageUrl,
        terminalAltxt: data.altTxt
      }
      
      // Récupération de la valeur de l'objet `cart` dans le `localStorage`.
      let cart = JSON.parse(localStorage.getItem("cart"));
      
      // Si `cart` n'existe pas, on le définit comme un tableau vide.
      if (!cart) {
        cart = [];
      }
      
      // Recherche d'un produit similaire dans le panier.
      let storedProductData = cart.find(item => item.terminalId === productData.terminalId && item.terminalColor === productData.terminalColor);
      
      // Si le produit existe déjà, sa quantité est mise à jour.
      if (storedProductData) {
        if (storedProductData.terminalQty + productData.terminalQty <= 100) {
          storedProductData.terminalQty += productData.terminalQty;
        } else {
          // Si la quantité totale dépasse 100, un message d'erreur est affiché.
          alert("Cannot order more than 100 product per color.");
        }
      } else {
        // Sinon, le produit est ajouté au panier.
        cart.push(productData);
      }
      
      // Mise à jour du panier dans le `localStorage`.
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Affichage d'un message de confirmation.
      buttonCart.innerHTML = "Produit ajouté";
      buttonCart.style.backgroundColor = "green";
      buttonCart.style.transition = "background-color 0.5s ease-in-out";
      setTimeout(function () {
        buttonCart.innerHTML = "Ajouter au panier";
        buttonCart.style.backgroundColor = "";
      }, 1000); // 1 seconde
      
      // Affichage du contenu du panier dans la console.
      console.log(cart);
    } else {
      alert("Something went wrong, please fill the from correctly to proceed.");
    }
  });
}