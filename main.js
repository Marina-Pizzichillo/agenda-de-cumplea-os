
(function () {
  // Recuperar cumpleaños del storage o inicializar un array vacío (con control de errores)
  let birthdays = [];
  try {
    const raw = localStorage.getItem("birthdays");
    const parsed = raw ? JSON.parse(raw) : null;
    birthdays = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("No se pudo leer localStorage:", e);
    birthdays = [];
  }

  const nameInput = document.getElementById("nameInput");
  const dateInput = document.getElementById("dateInput");
  const addBtn = document.getElementById("addBtn");
  const birthdayList = document.getElementById("birthdayList");

  // Validadores
  const isValidName = (name) => {
    if (!name) return false;
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) return false;
    // Permite letras Unicode, espacios y algunos signos comunes
    return /^\p{L}[\p{L}\s'’\-]{0,49}$/u.test(trimmed);
  };

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    // Formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;
    // Comprobar que partes coinciden (evita que "2023-02-31" se vuelva 2023-03-03)
    const [y, m, day] = dateStr.split("-").map(Number);
    return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
  };

  const isDuplicate = (name, date) =>
    birthdays.some((b) => b.name.toLowerCase() === name.toLowerCase() && b.date === date);

  // Guardar en storage
  const saveToStorage = () => {
    try {
      localStorage.setItem("birthdays", JSON.stringify(birthdays));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
      alert("Error al guardar. Revisa la configuración del navegador.");
    }
  };

  // Agregar cumpleaños
  const addBirthday = () => {
    if (!nameInput || !dateInput) {
      alert("Formulario no disponible en la página.");
      return;
    }

    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!isValidName(name)) {
      alert("Nombre inválido. Usa entre 2 y 50 letras; se permiten espacios y signos simples.");
      return;
    }

    if (!isValidDate(date)) {
      alert("Fecha inválida. Usa el formato YYYY-MM-DD y una fecha real.");
      return;
    }

    if (isDuplicate(name, date)) {
      alert("Ese cumpleaños ya está en la lista.");
      return;
    }

    birthdays.push({ name, date });
    saveToStorage();
    renderList();

    nameInput.value = "";
    dateInput.value = "";
    nameInput.focus();
  };

  // Eliminar por índice
  const removeBirthday = (index) => {
    if (index < 0 || index >= birthdays.length) return;
    birthdays.splice(index, 1);
    saveToStorage();
    renderList();
  };

  // Mostrar lista
  const renderList = () => {
    if (!birthdayList) return;
    birthdayList.innerHTML = "";

    birthdays.forEach((item, i) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.date}`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Eliminar";
      btn.style.marginLeft = "8px";
      btn.addEventListener("click", () => removeBirthday(i));

      li.appendChild(btn);
      birthdayList.appendChild(li);
    });
  };

  // Eventos
  if (addBtn) {
    addBtn.addEventListener("click", addBirthday);
  } else {
    console.warn("addBtn no encontrado en el DOM.");
  }

  // Enter en inputs agrega
  if (nameInput) {
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addBirthday();
    });
  }
  if (dateInput) {
    dateInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addBirthday();
    });
  }

  // Mostrar lista al cargar la página (recuperado del storage)
  renderList();
})();
