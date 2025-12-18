// ===============================
// VARIABLES Y ELEMENTOS DEL DOM
// ===============================

let birthdays = [];

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const categoryInput = document.getElementById("categoryInput");
const reminderInput = document.getElementById("reminderInput");
const addBtn = document.getElementById("addBtn");
const birthdayList = document.getElementById("birthdayList");

// ===============================
// CLASE CUMPLEAÑOS
// ===============================

class Birthday {
  constructor(id, name, date, category, reminder) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.category = category;
    this.reminder = reminder;
  }

  daysRemaining() {
    const today = new Date();
    const birthday = new Date(this.date);
    birthday.setFullYear(today.getFullYear());

    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }

    const diff = birthday - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  age() {
    const today = new Date();
    const birthDate = new Date(this.date);
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthday =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthday) age--;
    return age + 1;
  }
}

// ===============================
// STORAGE
// ===============================

const saveToStorage = () => {
  localStorage.setItem("birthdays", JSON.stringify(birthdays));
};

const loadFromStorage = () => {
  const data = JSON.parse(localStorage.getItem("birthdays"));
  if (data) {
    birthdays = data.map(item =>
      new Birthday(
        item.id,
        item.name,
        item.date,
        item.category,
        item.reminder
      )
    );
  }
};

// ===============================
// CARGA ASÍNCRONA DESDE JSON
// ===============================

fetch("./data/cumpleaños.json")
  .then(res => res.json())
  .then(data => {
    if (localStorage.getItem("birthdays") === null) {
      data.forEach(item => {
        birthdays.push(
          new Birthday(
            item.id,
            item.nombre,
            item.fecha,
            item.categoria,
            item.recordatorio
          )
        );
      });
      saveToStorage();
    }
    loadFromStorage();
    renderList();
  });

// ===============================
// AGREGAR
// ===============================

const addBirthday = () => {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;
  const reminder = reminderInput.checked;

  if (!name || !date) {
    Swal.fire("Error", "Completá todos los campos", "error");
    return;
  }

  birthdays.push(
    new Birthday(Date.now(), name, date, category, reminder)
  );

  saveToStorage();
  renderList();

  Swal.fire("🎉 Cumpleaños agregado");
};

// ===============================
// ELIMINAR
// ===============================

const deleteBirthday = (id) => {
  birthdays = birthdays.filter(b => b.id !== id);
  saveToStorage();
  renderList();
};

// ===============================
// RENDER
// ===============================

const renderList = () => {
  birthdayList.innerHTML = "";

  birthdays.sort((a, b) => a.daysRemaining() - b.daysRemaining());

  birthdays.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let mensaje = Faltan ${item.daysRemaining()} días;
    if (item.daysRemaining() === 0) mensaje = "🎂 ¡Es hoy!";

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Categoría: ${item.category}</p>
      <p>Edad a cumplir: ${item.age()}</p>
      <p>${mensaje}</p>
      <p>Recordatorio: ${item.reminder ? "Sí" : "No"}</p>
      <button onclick="deleteBirthday(${item.id})">Eliminar</button>
    `;

    birthdayList.appendChild(card);
  });
};

// ===============================
// EVENTOS
// ===============================

addBtn.addEventListener("click", addBirthday);

loadFromStorage();
renderList();

