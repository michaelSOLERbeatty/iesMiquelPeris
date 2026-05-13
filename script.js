const hoy = new Date().toDateString();

const fechaGuardada = localStorage.getItem('fecha-reservas');

if (fechaGuardada !== hoy) {
  localStorage.setItem('reservas-material', JSON.stringify([]));
  localStorage.setItem('fecha-reservas', hoy);
}

let reservas = JSON.parse(
  localStorage.getItem('reservas-material') || '[]'
);

mostrarReservas();

function horarioPermitido() {
  const ahora = new Date();
  const hora = ahora.getHours();
  const minuto = ahora.getMinutes();

  return hora === 6 && minuto >= 0 && minuto <= 50;
}

function reservar(material) {
  if (!horarioPermitido()) {
    alert('Solo se puede reservar entre las 08:00 y las 08:20');
    return;
  }

  const nombre = prompt('Introduce tu nombre');

  if (!nombre || nombre.trim() === '') {
    alert('Debes introducir un nombre válido');
    return;
  }

  const yaReservado = reservas.some(
    reserva => reserva.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (yaReservado) {
    alert('Solo se permite una reserva por persona al día');
    return;
  }

  const nuevaReserva = {
    nombre,
    material,
    hora: new Date().toLocaleTimeString()
  };

  reservas.push(nuevaReserva);

  localStorage.setItem(
    'reservas-material',
    JSON.stringify(reservas)
  );

  mostrarReservas();
}

function mostrarReservas() {
  const contenedor = document.getElementById('lista-reservas');

  contenedor.innerHTML = '';

  if (reservas.length === 0) {
    contenedor.innerHTML = '<p>No hay reservas hoy.</p>';
    return;
  }

  reservas.forEach(reserva => {
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
