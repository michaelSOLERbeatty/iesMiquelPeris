import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// CONFIGURA TU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyA5exXDTNQ4dPvAelimGmQ5VZhIUBtYYZk",
  authDomain: "iesmiquelperis-88467.firebaseapp.com",
  databaseURL: "https://iesmiquelperis-88467-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iesmiquelperis-88467",
  storageBucket: "iesmiquelperis-88467.firebasestorage.app",
  messagingSenderId: "186900110075",
  appId: "1:186900110075:web:4bdcbef58f7b116a49ae5e",
  measurementId: "G-T70T6DT5PB"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const hoy = new Date().toDateString();

mostrarReservas();

resetDiario();

function horarioPermitido() {

  const ahora = new Date();

  const hora = ahora.getHours();

  const minuto = ahora.getMinutes();

  return hora === 8 && minuto >= 0 && minuto <= 20;
}


window.reservar = async function(material) {

  if (!horarioPermitido()) {

    alert('Solo se puede reservar entre las 08:00 y las 08:20');

    return;
  }

  const nombre = prompt('Introduce tu nombre');

  if (!nombre || nombre.trim() === '') {

    alert('Debes introducir un nombre válido');

    return;
  }

  const reservasRef = collection(db, 'reservas');

  const consulta = query(
    reservasRef,
    where('nombre', '==', nombre.toLowerCase()),
    where('fecha', '==', hoy)
  );

  const resultado = await getDocs(consulta);

  if (!resultado.empty) {

    alert('Solo se permite una reserva por persona al día');

    return;
  }

  await addDoc(reservasRef, {
    nombre: nombre.toLowerCase(),
    material,
    hora: new Date().toLocaleTimeString(),
    fecha: hoy
  });

  mostrarReservas();
};


async function mostrarReservas() {

  const contenedor = document.getElementById('lista-reservas');

  contenedor.innerHTML = '';

  const reservasRef = collection(db, 'reservas');

  const consulta = query(
    reservasRef,
    where('fecha', '==', hoy)
  );

  const resultado = await getDocs(consulta);

  if (resultado.empty) {

    contenedor.innerHTML = '<p>No hay reservas hoy.</p>';

    return;
  }

  resultado.forEach((documento) => {

    const reserva = documento.data();

    const div = document.createElement('div');

    div.classList.add('reserva-item');

    div.innerHTML = `
      <div>
        <strong>${reserva.material}</strong><br>
        Reservado por: ${reserva.nombre}
      </div>

      <div>
        ${reserva.hora}
      </div>
    `;

    contenedor.appendChild(div);
  });
}


async function resetDiario() {

  const reservasRef = collection(db, 'reservas');

  const resultado = await getDocs(reservasRef);

  resultado.forEach(async (documento) => {

    const reserva = documento.data();

    if (reserva.fecha !== hoy) {

      await deleteDoc(doc(db, 'reservas', documento.id));
    }
  });
}