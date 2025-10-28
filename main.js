// ===== AGENDA DE CUMPLEAÑOS =====

// ===== ARRAY PRINCIPAL =====
let agenda = [];

// ===== FUNCIONES =====

// Convierte número a dos dígitos
function twoDigits(n) {
  return n < 10 ? "0" + n : String(n);
}

// Formatea Date a "YYYY-MM-DD"
function formatDateIso(dateObj) {
  const y = dateObj.getFullYear();
  const m = twoDigits(dateObj.getMonth() + 1);
  const d = twoDigits(dateObj.getDate());
  return `${y}-${m}-${d}`;
}

// Valida fecha ingresada
function parseFechaInput(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, message: "Fecha vacía o no válida." };
  }

  input = input.trim();

  // YYYY-MM-DD
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = Number(isoMatch[3]);
    if (y < 1900) return { valid: false, message: "Año debe ser 1900 o mayor." };
    const dateTest = new Date(y, m - 1, d);
    dateTest.setHours(0, 0, 0, 0);
    if (dateTest.getFullYear() === y && dateTest.getMonth() + 1 === m && dateTest.getDate() === d) {
      return { valid: true, day: d, month: m, year: y };
    }
    return { valid: false, message: "Fecha ISO inválida." };
  }

  // DD/MM/YYYY
  const dmyMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const d = Number(dmyMatch[1]);
    const m = Number(dmyMatch[2]);
    const y = Number(dmyMatch[3]);
    if (y < 1900) return { valid: false, message: "Año debe ser 1900 o mayor." };
    const dateTest = new Date(y, m - 1, d);
    dateTest.setHours(0, 0, 0, 0);
    if (dateTest.getFullYear() === y && dateTest.getMonth() + 1 === m && dateTest.getDate() === d) {
      return { valid: true, day: d, month: m, year: y };
    }
    return { valid: false, message: "Combinación día/mes/año inválida." };
  }

  // DD/MM (cumple recurrente)
  const dmMatch = input.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (dmMatch) {
    const d = Number(dmMatch[1]);
    const m = Number(dmMatch[2]);
    if (m < 1 || m > 12 || d < 1 || d > 31) {
      return { valid: false, message: "Día o mes fuera de rango." };
    }
    const hoy = new Date();
    const dateTest = new Date(hoy.getFullYear(), m - 1, d);
    dateTest.setHours(0, 0, 0, 0);
    if (dateTest.getMonth() + 1 !== m || dateTest.getDate() !== d) {
      return { valid: false, message: "Combinación día/mes inválida (ej: 31/02)." };
    }
    return { valid: true, day: d, month: m, year: null };
  }

  return { valid: false, message: "Formato no reconocido. Usá DD/MM, DD/MM/YYYY o YYYY-MM-DD." };
}

// Agrega cumpleaños al array
function agregarCumple(nombre, fechaInput) {
  const parse = parseFechaInput(fechaInput);
  if (!parse.valid) {
    alert("Fecha inválida: " + parse.message);
    return false;
  }
  const nuevo = {
    nombre: nombre.trim(),
    day: parse.day,
    month: parse.month,
    year: parse.year
  };
  agenda.push(nuevo);
  alert(`🎂 Se agregó a ${nuevo.nombre} - ${twoDigits(nuevo.day)}/${twoDigits(nuevo.month)}${nuevo.year ? "/" + nuevo.year : ""}`);
  return true;
}

// Muestra toda la agenda con alert
function mostrarAgenda() {
  if (agenda.length === 0) {
    alert("📭 La agenda está vacía.");
    return;
  }
  let salida = "📅 Agenda de cumpleaños:\n";
  for (let i = 0; i < agenda.length; i++) {
    const e = agenda[i];
    const fechaStr = e.year ? `${twoDigits(e.day)}/${twoDigits(e.month)}/${e.year}` : `${twoDigits(e.day)}/${twoDigits(e.month)}`;
    salida += `${e.nombre} - ${fechaStr}\n`;
  }
  alert(salida);
}

// Calcula próxima ocurrencia de un cumpleaños
function calcularProximaOcurrencia(day, month) {
  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  let fecha = new Date(anioActual, month - 1, day);
  fecha.setHours(0, 0, 0, 0);
  if (fecha < hoy) {
    fecha = new Date(anioActual + 1, month - 1, day);
    fecha.setHours(0, 0, 0, 0);
  }
  return fecha;
}

// Muestra próximos cumpleaños con alert
function proximosCumples(diasVentana = 7) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + diasVentana);

  let proximos = [];

  for (let i = 0; i < agenda.length; i++) {
    const e = agenda[i];
    const prox = calcularProximaOcurrencia(e.day, e.month);
    if (prox >= hoy && prox <= limite) {
      proximos.push({ nombre: e.nombre, fecha: prox });
    }
  }

  if (proximos.length === 0) {
    alert(`😅 No hay cumpleaños en los próximos ${diasVentana} días.`);
    return;
  }

  proximos.sort((a, b) => a.fecha - b.fecha);
  let salida = `🎈 Cumpleaños en los próximos ${diasVentana} días:\n`;
  for (let i = 0; i < proximos.length; i++) {
    salida += `${proximos[i].nombre} - ${formatDateIso(proximos[i].fecha)}\n`;
  }
  alert(salida);
}

// ===== INTERACCIÓN CON EL USUARIO =====
alert("🎉 Bienvenido a tu Agenda de Cumpleaños 🎉");

let opcion;
do {
  opcion = prompt(
    "Elegí una opción:\n1) Agregar cumpleaños\n2) Ver agenda completa\n3) Ver cumpleaños próximos\n4) Salir\n\nFormatos válidos para fecha: DD/MM  |  DD/MM/YYYY  |  YYYY-MM-DD"
  );

  if (opcion === "1") {
    const nombre = prompt("Ingresá el nombre:");
    if (!nombre || nombre.trim() === "") {
      alert("Nombre vacío. Operación cancelada.");
    } else {
      const fecha = prompt("Ingresá la fecha (DD/MM  o  DD/MM/YYYY  o  YYYY-MM-DD):");
      agregarCumple(nombre, fecha);
    }
  } else if (opcion === "2") {
    mostrarAgenda();
  } else if (opcion === "3") {
    const diasStr = prompt("¿Cuántos días hacia adelante querés ver? (Enter = 7)");
    let dias = 7;
    if (diasStr && diasStr.trim() !== "") {
      const n = Number(diasStr);
      if (!Number.isNaN(n) && n > 0) {
        dias = Math.floor(n);
      } else {
        alert("Valor no válido. Se usará 7 días.");
      }
    }
    proximosCumples(dias);
  } else if (opcion !== "4") {
    alert("⚠️ Opción no válida. Elegí 1, 2, 3 o 4.");
  }
} while (opcion !== "4");

alert("👋 Gracias por usar la agenda. ¡Hasta luego!");


