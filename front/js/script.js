
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for (const productsList of data) {

            const locateSection = document.querySelector('#items');

            const newLink = document.createElement('a');
            newLink.setAttribute("href", `./product.html?id=${productsList._id}`);
            locateSection.appendChild(newLink);

            const newArticle = document.createElement('article');
            newLink.appendChild(newArticle);

            const newImage = document.createElement('img');
            newImage.setAttribute("src", productsList.imageUrl);
            newImage.setAttribute("alt", productsList.altTxt);
            newArticle.appendChild(newImage);

            const newTitle = document.createElement('h3');
            newTitle.setAttribute("class", "productName");
            newTitle.innerText = productsList.name;
            newArticle.appendChild(newTitle);

            const newDescription = document.createElement('p');
            newDescription.setAttribute("class", "productDescription");
            newDescription.innerText = productsList.description;
            newArticle.appendChild(newDescription);
        }
    })

    .catch(function(error) {
        console.log("Error catched!", error);
       })