const productId = new URLSearchParams(window.location.search).get("id");
console.log(productId);

const itemColor = document.getElementById("colors");
const itemQty = document.getElementById("quantity");

if (productId != null) {
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function (response) {
            return response.json();
        })
        .then(async function (data) {
            if (await data) {
                getPos(data)
            }
        })
}

function getPos(data) {
    console.log(data);
    document.title = data.name;
    const newImage = document.createElement("img");
    newImage.src = data.imageUrl;
    newImage.alt = data.altTxt;
    document.querySelector('.item__img').appendChild(newImage);
    document.getElementById("title").innerText = data.name;
    document.getElementById("price").innerText = data.price;
    document.getElementById("description").innerText = data.description;

    data.colors.forEach(function (newColor) {
        const option = document.createElement("option");
        const select = document.getElementById("colors");

        option.value = newColor;
        option.innerText = newColor;

        select.appendChild(option);
    });
    addPanier(data);
}

function addPanier(data) {
  const buttonCart = document.getElementById("addToCart");
  buttonCart.addEventListener("click", function () {
    if (itemQty.value > 0 && itemQty.value <= 100 && itemColor.value != 0) {
      let finalColor = itemColor.value;
      let finalQty = itemQty.value;
      let productData = {
        terminalId: productId,
        terminalColor: finalColor,
        terminalQty: Number(finalQty),
        terminalName: data.name,
        terminalImage: data.imageUrl,
        terminalPrice: data.price,
        terminalAltxt: data.altTxt
      }
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      let storedProductData = cart.find(item => item.terminalId === productData.terminalId && item.terminalColor === productData.terminalColor);

      if (storedProductData) {
        if (storedProductData.terminalQty + productData.terminalQty <= 100) {
          storedProductData.terminalQty += productData.terminalQty;
        } else {
          alert("Cannot order more than 100 product per color.");
        }
      } else {
        cart.push(productData);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(productData.terminalName + " has been added to your cart. Cart quantity: " + storedProductData.terminalQty);
      console.log(cart);
    } else {
      alert("Something went wrong, please fill the from correctly to proceed.");
    }
  });
}