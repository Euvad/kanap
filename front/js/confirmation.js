let storedResponse = JSON.parse(localStorage.getItem("order_id"));
localStorage.clear();
if(storedResponse === null){
    window.location.replace('http://localhost/site/front/html/index.html');
}else{
    const orderIdDisplay = document.getElementById("orderId");
    orderIdDisplay.innerHTML = storedResponse.orderId;
}