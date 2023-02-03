// Effectuer une requête fetch pour récupérer les produits depuis l'API 
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        // Convertir la réponse en format JSON
        return response.json();
    })
    .then(function (data) {
        // Boucle pour itérer à travers chaque produit dans les données
        for (const productsList of data) {

            // Sélectionner la section où les produits seront affichés
            const locateSection = document.querySelector('#items');

            // Créer un élément 'a' pour chaque produit
            const newLink = document.createElement('a');
            // Ajouter un attribut 'href' pour rediriger vers la page produit
            newLink.setAttribute("href", `./product.html?id=${productsList._id}`);
            // Ajouter l'élément 'a' à la section sélectionnée
            locateSection.appendChild(newLink);

            // Créer un élément 'article' pour contenir les informations du produit
            const newArticle = document.createElement('article');
            // Ajouter l'élément 'article' à l'élément 'a'
            newLink.appendChild(newArticle);

            // Créer une image pour afficher l'image du produit
            const newImage = document.createElement('img');
            // Ajouter les attributs 'src' et 'alt' à l'image
            newImage.setAttribute("src", productsList.imageUrl);
            newImage.setAttribute("alt", productsList.altTxt);
            // Ajouter l'image à l'élément 'article'
            newArticle.appendChild(newImage);

            // Créer un élément 'h3' pour afficher le nom du produit
            const newTitle = document.createElement('h3');
            // Ajouter un attribut 'class' pour le style du nom du produit
            newTitle.setAttribute("class", "productName");
            // Ajouter le nom du produit à l'élément 'h3'
            newTitle.innerText = productsList.name;
            // Ajouter l'élément 'h3' à l'élément 'article'
            newArticle.appendChild(newTitle);

            // Créer un élément 'p' pour afficher la description du produit
            const newDescription = document.createElement('p');
            // Ajouter un attribut 'class' pour le style de la description du produit
            newDescription.setAttribute("class", "productDescription");
            // Ajouter la description du produit à l'élément 'p'
            newDescription.innerText = productsList.description;
            // Ajouter l'élément 'p' à l'élément 'article'
            newArticle.appendChild(newDescription);
        }
    })
    // Si une erreur se produit, la capturer
    .catch(function(error) {
        // Logguer l'erreur
        console.log("Error catched!", error);
    })