// Récupère la valeur de la clé "order_id" dans le stockage local et la parse en objet JSON
let storedResponse = JSON.parse(localStorage.getItem("order_id"));
// Récupère l'élément HTML avec l'ID "orderId"
const orderIdDisplay = document.getElementById("orderId");
// Affiche la valeur de "orderId" de l'objet stocké dans "storedResponse"
orderIdDisplay.innerHTML = storedResponse.orderId;
// Efface toutes les données du stockage local
localStorage.clear();