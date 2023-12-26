const API = "http://localhost:8000/product";

let contactsBtn = document.querySelector(".contacts_btn");
let modalWindow = document.querySelector(".modWindow");
contactsBtn.addEventListener("click", () => {
  modalWindow.style.display = "block";
});

// ! CREATE

let contactName = document.querySelector(".inp_Name");
let lastName = document.querySelector(".inp_lastName");
let phoneNumber = document.querySelector(".inp_telephone");
let image = document.querySelector(".inp_photo");
let addContactBtn = document.querySelector(".addContact");
let contactCard = document.querySelector(".card");
let list = document.querySelector(".task-list");

addContactBtn.addEventListener("click", () => {
  if (
    !contactName.value.trim() ||
    !lastName.value.trim() ||
    !phoneNumber.value.trim() ||
    !image.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  let newObj = {
    nameOfCont: contactName.value,
    lName: lastName.value,
    phone: phoneNumber.value,
    img: image.value,
  };
  createTask(newObj);
  readTask();

  contactName.value = "";
  lastName.value = "";
  phoneNumber.value = "";
  image.value = "";
});

//Создаем карточку контакта
function createTask(card) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(card),
  }).then(() => readTask());
}

function readTask() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      contactCard.innerHTML = "";
      data.forEach((elem) => {
        console.log(elem);
        list.innerHTML = "";
        contactCard.innerHTML += `
        <h5>${elem.nameOfCont}</h5>
        <h5>${elem.lName}</h5>
        <h5>${elem.phone}</h5>
        <img class=".card_img" src="${elem.img}" alt="" />
        <button id=${elem.id} class="btnDelete">delete</button>
        <button id=${elem.id} class="btnEdit">edit</button>`;
        contactCard.style.border = "1px solid black";
      });
    });
}
readTask();

// Удяляем карточку

let deleteBtn = document.querySelector(".btnDelete");
let editBtn = document.querySelector(".btnEdit");
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  console.log(del_class);
  if (del_class.includes("btnDelete")) {
    const del_id = e.target.id;
    //console.log(del_id);

    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readTask());
  }
});

// deleteBtn.style.display = "none";
// editBtn.style.display = "none";

//редактируем карточку
let inpEdit = document.querySelector(".inpEdit");
let inpEdLastName = document.querySelector(".inpEditLastName");
let inpEditPhone = document.querySelector(".inpEditPhone");
let inpEditPhoto = document.querySelector(".inpEditImage");
let btnEditSave = document.querySelector(".saveEdit");
let editModal = document.querySelector(".editModal");
document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    editModal.style.display = "block";
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        inpEdit.value = data.nameOfCont;
        inpEdLastName.value = data.lName;
        inpEditPhone.value = data.phone;
        inpEditPhoto.value = data.img;

        btnEditSave.setAttribute("id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", () => {
  let editTask = {
    nameOfCont: inpEdit.value,
    lName: inpEdLastName.value,
    phone: inpEditPhone.value,
    img: inpEditPhoto.value,
  };
  editedTask(editTask, btnEditSave.id);
});

function editedTask(editTask, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editTask),
  }).then(() => {
    readTask();
  });
}
