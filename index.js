const api = "data.json";
const container = document.querySelector(".container");
const productList = document.querySelector(".productList");
const cartCount = document.querySelector(".cartCount");
const cartListContainer = document.querySelector(".cartListContainer");
const cartBody = document.querySelector(".cartBody");
const totalContainer = document.querySelector(".totalContainer");
const cartText = document.querySelector(".cartText");
const Total = document.querySelector(".Total");
const placeOrderContain = document.querySelector(".placeOrderContain");
const cartModal = document.querySelector(".cartModal");
const modalList = document.querySelector('.modalList')
const cartModalContain = document.querySelector('.cartModalContain')
let productData;
let productIndex;
let removeProductCart = "";
const productCartList = [];

const handleCreateEl = (el, classAdd = "", style = "", innerText = "", innerHTML = "", src = "") => {
  const Element = document.createElement(el);
  if (classAdd) Element.classList.add(classAdd);
  if (style) Element.style = style;
  if (innerHTML) Element.innerHTML = innerHTML;
  if (innerText) Element.innerText = innerText;
  if (src && el === "img") Element.src = src;
  return Element;
}; 

const handleAppendElement = (parent, children = []) => {
  if (!Array.isArray(children)) {
    children = [children];
  }
  children.forEach(el => {
    if (parent && el) parent.appendChild(el);
  });
};

async function handleProductFetch() {
  const data = await fetch(api);
  let res;

  

  console.log(data);
  if (data) {
    productData = await data.json();

    productData.map((product, i) => {

        if(window.innerWidth <= 768){
    res = product.image.tablet;
  }
  if(window.innerWidth <=425){
    res = product.image.mobile;
  }
  else{
  res = product.image.desktop;
  }

  const productCard = handleCreateEl("div", "productCard");
  const productHead = handleCreateEl("div", "productHead");
  const img = handleCreateEl("img", "productImg", "", "", "", res);
  const button = handleCreateEl("button", "Cartbtn");
  const productSub = handleCreateEl("p", "productSub", "", product.category);
  const productTitle = handleCreateEl("p", "productTitle", "", product.name);
  const productPrice = handleCreateEl("p", "productPrice", "", `$${product.price}`);
  const icon = handleCreateEl("p", "", "", "", `<img src="assets/images/icon-add-to-cart.svg" width="20" height="20" alt="">`);
  const text = handleCreateEl("div", "text");
  const btnText = handleCreateEl("p", "", "", "Add to cart");



  handleAppendElement(button, [icon, btnText]);
  handleAppendElement(productHead, [img, button]);
  handleAppendElement(text, [productSub, productTitle, productPrice]);
  handleAppendElement(productCard, [productHead, text]);
  handleAppendElement(productList, productCard);

  
  let isClicked = false;
  button.addEventListener("click", () => {
    if (isClicked) return;
    isClicked = true;
    let count = 0;
    productIndex = i;

    const incBtn = handleCreateEl("button", "quantyBtn", "", "", '<img class="quantyImg" src="assets/images/icon-increment-quantity.svg" alt="">');
    const decBtn = handleCreateEl("button", "quantyBtn", "", "", '<img class="quantyImg" src="assets/images/icon-decrement-quantity.svg" alt="">');
    const displayQuanty = handleCreateEl("p", "", "", "0");

    button.style = "background:hsl(14, 86%, 42%); color:#fff";
    if (button.contains(icon)) button.removeChild(icon);
    if (button.contains(btnText)) button.removeChild(btnText);

    handleAppendElement(button, [decBtn, displayQuanty, incBtn]);

    const allCard = document.querySelectorAll(".productCard .productHead .productImg");
    allCard.forEach((card, idx) => {
      if (idx === productIndex) {
        card.classList.add("isHover");
      }
    });

    const productCart = { ...product, quantity: 1 };
    productCartList.push(productCart);

    incBtn.addEventListener("click", () => {
      count += 1;
      displayQuanty.innerText = count;
      const item = productCartList.find((p) => p.name === product.name);
      if (item) item.quantity = count;
      const allCart = productCartList.reduce((prev, pro) => prev + pro.quantity, 0);
      cartCount.innerText = `Your Cart (${allCart})`;
      cartListFunction();
    });

    decBtn.addEventListener("click", () => {
      count -= 1;
      if (count < 0) count = 0;
      const item = productCartList.find((p) => p.name === product.name);
      if (item) item.quantity = count;
      displayQuanty.innerText = count;
      cartListFunction();
    });
  });
});

  }
}
const cartListFunction = () => {
  cartListContainer.innerHTML = "";
  handleCheckisCartEmpty();
  if (productCartList.length > 0) {
    productCartList.forEach((product, i) => {
      const removeCartBtn = handleCreateEl("button","","","",'<img src="assets/images/icon-remove-item.svg" alt="" >');
      const cartList = handleCreateEl("li");
      const prodName = handleCreateEl("p","prodName","",product.name);
      const cartInfo =handleCreateEl("span");
      const price = handleCreateEl("p","","", `$${product.price}`);
      const quanty = handleCreateEl("p","","",`${product.quantity}x`);
      const cartListBody =handleCreateEl("div");
      const totalPrice = handleCreateEl("p","","",`@$${product.quantity * product.price}`);
     
      handleAppendElement(cartListContainer,[cartList])
      handleAppendElement(cartList,[cartListBody,removeCartBtn])
      handleAppendElement(cartListBody,[prodName,cartInfo])
      handleAppendElement(cartInfo,[quanty,totalPrice,price])
     
    
      removeCartBtn.addEventListener("click", () => {
        productCartList.splice(i, 1);

        const allCart = productCartList.reduce(
          (prev, pro) => prev + pro.quantity,0);
        cartCount.innerText = `Your Cart (${allCart})`;
        cartListFunction();
        handleCheckisCartEmpty();
      });
    });
  }
};
const handleCheckisCartEmpty = () => {
  if (productCartList.length > 0) {
    cartBody.style = "display:none";
    totalContainer.style = "display:flex";
    cartText.innerHTML = "";
    placeOrderContain.style = "display:flex";
    Total.innerText = `$${productCartList.reduce(
      (prev, el) => prev + el.price * el.quantity,
      0
    )}`;
  } else {
    cartBody.style = "display:block";
    totalContainer.style = "display:none";
    cartText.innerHTML = "your added item will appear here";
    placeOrderContain.style = "display:none";
  }
};
const handleConfirmBtn = () => {
  const rect = cartModal.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const modalTop = rect.top + scrollTop;

  window.scrollTo({
    top: modalTop,
    behavior: 'smooth'
  });
  modalList.innerHTML = ""
  console.log(productCartList)
 cartModalContain.style = 'display:block';
  productCartList.forEach((product) => {

   const li = handleCreateEl('li')
   const modalImgContain =handleCreateEl('div',"modalImgContain")
   const img = handleCreateEl('img','','','','',product.image.desktop)
   const h4 = handleCreateEl('h4','','',product.name)
   const div = handleCreateEl('div')
    const h3 = handleCreateEl('h3','','',`@$${(product.quantity * product.price)}`)
   const span = handleCreateEl('span')
   const p1 = handleCreateEl('p','','', `${product.quantity}x`)  
   const p2 = handleCreateEl('p','','',`@$${product.price}`) 
    
  img.width = 35
  img.height = 35
  handleAppendElement(modalList,[li])
  handleAppendElement(li,[modalImgContain,h3])
   modalList.classList.add('modalList')
  
 handleAppendElement(modalImgContain,[img,div])
 handleAppendElement(div,[h4,span])
 handleAppendElement(span,[p1,p2])
  

  });
};
cartModalContain.addEventListener('click', ()=>{
   cartModalContain.style = 'display:none';
})

const handleNewOrder = ()=>{
 location.reload()

}


handleProductFetch();
