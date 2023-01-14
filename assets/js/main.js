let godisnjeDoba = [];
let brendovi = [];
let pol = [];
let patike = [];

getData("assets/data/pol.json", renderFilter, "pol");
getData("assets/data/brendovi.json", renderFilter, "brendovi");
getData("assets/data/godisnjeDoba.json", renderFilter, "godisnjeDoba");

document.getElementById("pretraga").addEventListener("keyup", filterChange);
document.getElementById("sort").addEventListener("change", filterChange);
document.getElementById("rang").addEventListener("change", filterChange);

const stanje = document.querySelectorAll(".stanje");
stanje.forEach((elem) => {
  elem.addEventListener("change", filterChange);
});

function getData(sourceName, callback, element) {
  fetch(sourceName)
    .then((response) => response.json())
    .then(function (data) {
      callback(data, element);
    });
  // .catch(function (error) {
  //   console.log(error.message);
  // });
}
function renderFilter(data, element) {
  let html = ``;

  data.forEach((elem) => {
    html += `<li class="list-group-item"><input type="checkbox" value="${
      elem.id
    }" class="${element}" name="${element}"/> 
        
    ${(() => {
      if (element == "godisnjeDoba") {
        return elem.naziv;
      } else if (element == "brendovi") {
        return elem.nazivBrenda;
      } else if (element == "pol") {
        return elem.polNaziv;
      }
    })()}  </li>
    `;
  });
  document.getElementById(element).innerHTML = html;

  if (element == "godisnjeDoba") {
    const dob = document.querySelectorAll(".godisnjeDoba");
    for (let i = 0; i < dob.length; i++) {
      dob[i].addEventListener("change", filterChange);
    }
    godisnjeDoba = data;
  } else if (element == "brendovi") {
    const brN = document.querySelectorAll(".brendovi");
    for (let i = 0; i < brN.length; i++) {
      brN[i].addEventListener("change", filterChange);
    }
    brendovi = data;
  } else if (element == "pol") {
    const pOl = document.querySelectorAll(".pol");
    for (let i = 0; i < pOl.length; i++) {
      pOl[i].addEventListener("change", filterChange);
    }
    pol = data;
    getData("assets/data/patike.json", renderSneakers, "patike");
  }
}

function filterChange() {
  getData("assets/data/patike.json", renderSneakers, "patike");
  pageIndex = 0;
}

function polFilter(data) {
  let polArr = [];
  let polChecks = document.querySelectorAll(".pol");

  polChecks.forEach((elem) => {
    if (elem.checked) {
      polArr.push(parseInt(elem.value));
    }
  });

  if (polArr.length != 0) {
    return data.filter((elem) => polArr.includes(parseInt(elem.pol)));
  }
  return data;
}

function brendFilter(data) {
  let tempArrl = [];

  let cheks = document.querySelectorAll(".brendovi");

  cheks.forEach((elem) => {
    if (elem.checked) {
      tempArrl.push(parseInt(elem.value));
    }
  });

  if (tempArrl.length != 0) {
    return data.filter((elem) => tempArrl.includes(parseInt(elem.brendID)));
  }

  return data;
}

function dobaFilter(data) {
  let tempArr = [];
  let cheks = document.querySelectorAll(".godisnjeDoba");
  cheks.forEach((elem) => {
    if (elem.checked) {
      tempArr.push(parseInt(elem.value));
    }
  });
  if (tempArr.length != 0) {
    return data.filter((elem) =>
      elem.godisnjeDoba.some((el) => tempArr.includes(el))
    );
  }
  return data;
}

let itemsPerPage = 3;
let pageIndex = 0;

function renderSneakers(data, element) {
  patike = data;
  checkCart();
  data = polFilter(data);
  data = brendFilter(data);
  data = dobaFilter(data);
  data = searchFilter(data);
  data = filterPrice(data);
  data = filterStanje(data);
  data = sortElements(data);
  let html = ``;

  for (
    let i = pageIndex * itemsPerPage;
    i < pageIndex * itemsPerPage + itemsPerPage;
    i++
  ) {
    if (!data[i]) {
      break;
    }
    html += `
    <div class="col-lg-4 col-md-6 mb-4">
    <div class="card h-100">
    
    <img src="assets/img/${data[i].slika.src}" class="card-img-top" alt="${
      data[i].slika.alt
    }">
    <div class="card-body">
    <h3 class="card-title">${data[i].naziv}</h3>
    <h4> ${getBrend(data[i].brendID)}</h4>
    <h5> ${getPol(data[i].pol)}</h5>
    <h6>${getDoba(data[i].godisnjeDoba)}</h6>
    <p class="card-text ${data[i].naStanju ? "text-success" : "text-danger"}">${
      data[i].naStanju ? "Sneakers available" : "Sneakers not available"
    }</p>
    <p class="card-text text-secondary text-decoration-line-through"><s>${
      data[i].price.staraCena
    }$</s></p>
    <p class="card-text text-primary">${data[i].price.novaCena}$</p>
    <div class="text-center">
 ${
   data[i].naStanju
     ? `<button class="btn btn-primary cartButton" data-id="${data[i].id}">Add to cart</button>`
     : '<button class="btn btn-primary cartButton " disabled>Add to cart</button>'
 }</div>
</div>
    </div>
    </div>
    </div>`;
  }

  if (data.length == 0) {
    html = "Nema rezultata";
  }

  document.getElementById("element").innerHTML = html;
  loadPageNum(data);

  let buttons = document.querySelectorAll(".cartButton");

  buttons.forEach((elem) => {
    elem.addEventListener("click", addToCart);
  });
}

function filterPrice(data) {
  let price = document.getElementById("rang").value;
  document.getElementById("rez").textContent =
    document.getElementById("rang").value;
  return data.filter(
    (elem) => parseInt(elem.price.novaCena) <= parseInt(price)
  );
}

function searchFilter(data) {
  let val = document.getElementById("pretraga").value;

  if (val) {
    return data.filter(
      (elem) => elem.naziv.toLowerCase().indexOf(val.trim().toLowerCase()) != -1
    );
  }

  return data;
}

function getPol(id) {
  let pol_ = pol.filter((elem) => elem.id == id)[0];
  return pol_.polNaziv;
}

function getBrend(id) {
  let brnd = brendovi.filter((elem) => elem.id == id)[0];
  return brnd.nazivBrenda;
}

function getDoba(doba) {
  let html = ``;
  let dobaIds = godisnjeDoba.filter((elem) => doba.includes(elem.id));

  for (let i = 0; i < dobaIds.length; i++) {
    html += dobaIds[i].naziv;

    if (dobaIds.length - 1 != i) {
      html += ", ";
    }
  }
  return html;
}

function sortElements(data) {
  let method = document.getElementById("sort").value;
  if (method == "asc") {
    return data.sort((a, b) =>
      parseInt(a.price.novaCena) > parseInt(b.price.novaCena) ? 1 : -1
    );
  } else {
    return data.sort((a, b) =>
      parseInt(a.price.novaCena) < parseInt(b.price.novaCena) ? 1 : -1
    );
  }
}

function filterStanje(data) {
  let cheks = document.querySelector(".stanje:checked");

  if (cheks.value == "dostupno") {
    return data.filter((elem) => elem.naStanju);
  } else {
    return data.filter((elem) => !elem.naStanju);
  }
}

function loadPageNum(data) {
  const num = document.getElementById("pageNum");
  num.innerHTML = "";

  for (let i = 0; i < Math.ceil(data.length / itemsPerPage); i++) {
    const paraf = document.createElement("p");
    paraf.innerHTML = i + 1;

    paraf.addEventListener("click", function (e) {
      pageIndex = parseInt(e.target.textContent) - 1;

      renderSneakers(data, "patike");
    });
    if (i == pageIndex) {
      paraf.style.fontSize = "2rem";
    }
    num.append(paraf);
  }
}

function addToCart() {
  let id = this.dataset.id;

  let patika = patike.filter((elem) => elem.id == id)[0];
  let cart = [];
  console.log(patika);

  const cookieCart = document.cookie
    .split(";")
    .find((row) => row.startsWith("cart="));

  if (cookieCart) {
    cart = JSON.parse(cookieCart.split("=")[1]);
  }

  if (cart.some((elem) => elem.id == id)) {
    cart.find((elem) => elem.id == id).quantity++;
  } else {
    cart.push({ id: id, quantity: 1 });
  }
  setCookie("cart", JSON.stringify(cart), 5);
  checkCart();
}
function setCookie(item, value, expr) {
  let date = new Date();
  date.setMonth(date.getMonth() + expr);
  document.cookie = item + "=" + value + "; expires=" + date.toUTCString();
}

function checkCart() {
  let cartHolder = document.getElementById("korpa");
  let html = "";

  const cookieCart = document.cookie
    .split(";")
    .find((row) => row.startsWith("cart="));
  if (cookieCart && cookieCart.length > 7) {
    html += `<ul class="list-group">`;

    let cart = JSON.parse(cookieCart.split("=")[1]);
    let s = 0;
    cart.forEach((cartItem) => {
      let price = patike.filter((patika) => patika.id == cartItem.id)[0].price
        .novaCena;
      let name = patike.filter((patika) => patika.id == cartItem.id)[0].naziv;
      s = s + parseInt(price) * parseInt(cartItem.quantity);
      html += `<li class="list-group-item elemLis">${name} ${
        parseInt(price) * parseInt(cartItem.quantity)
      }$ 
        <input type="number" class="input_qua"
        value="${cartItem.quantity}" min="1" data-id="${
        cartItem.id
      }"> <button class="btn btn-danger reBtn" data-id="${
        cartItem.id
      }">X</button>            
        </li>`;
    });
    html += `
        <li class="list-group-item">Total: ${s}$</li>
        <li class="list-group-item"><button class="btn btn-danger reBtn" data-id="-1">Remove All</button></li> </ul>`;
    cartHolder.innerHTML = html;

    document.querySelectorAll(".reBtn").forEach((elem) => {
      elem.addEventListener("click", removeItem);
    });

    document.querySelectorAll(".input_qua").forEach((elem) => {
      elem.addEventListener("change", changeQuan);
    });
  } else {
    cartHolder.innerText = "The cart is empty!";
  }
}

function removeItem() {
  let id = this.dataset.id;

  let cart = [];
  if (id != -1) {
    const cookieCart = document.cookie
      .split(";")
      .find((row) => row.startsWith("cart="));

    if (cookieCart) {
      cart = JSON.parse(cookieCart.split("=")[1]);
    }

    cart = cart.filter((elem) => elem.id != id);
  }
  setCookie("cart", JSON.stringify(cart), 5);
  checkCart();
}

function changeQuan() {
  let id = this.dataset.id;
  let cart = [];

  const cookieCart = document.cookie
    .split(";")
    .find((row) => row.startsWith("cart="));
  if (cookieCart) {
    cart = JSON.parse(cookieCart.split("=")[1]);
  }

  if (cart.some((elem) => elem.id == id)) {
    cart.find((elem) => elem.id == id).quantity = this.value;
  }

  setCookie("cart", JSON.stringify(cart), 5);
  checkCart();
}
