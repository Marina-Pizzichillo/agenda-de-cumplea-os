// Recuperar cumpleaños del storage o inicializar un array vacío
let birthdays = JSON.parse(localStorage.getItem("birthdays")) || [];

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const birthdayList = document.getElementById("birthdayList");

// Guardar en storage
const saveToStorage = () => {
  localStorage.setItem("birthdays", JSON.stringify(birthdays));
};

// Agregar cumpleaños
const addBirthday = () => {
  const name = nameInput.value.trim();
  const date = dateInput.value;

  if (name === "" || date === "") {
    alert("Por favor completa todos los campos.");
    return;
  }

  birthdays.push({ name, date });
  saveToStorage();
  renderList();

  nameInput.value = "";
  dateInput.value = "";
};

// Mostrar lista
const renderList = () => {
  birthdayList.innerHTML = "";

  birthdays.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.date}`;
    birthdayList.appendChild(li);
  });
};

// Evento de botón
addBtn.addEventListener("click", addBirthday);

// Mostrar lista al cargar la página (recuperado del storage)
renderList();



