// Récupère la valeur de la réponse dans la barre d'URL
const urlParams = new URLSearchParams(window.location.search);
const response = urlParams.get("response");
// Récupère l'élément HTML avec l'ID "orderId"
const orderIdDisplay = document.getElementById("orderId");
// Affiche la valeur de la réponse
orderIdDisplay.innerHTML = response;