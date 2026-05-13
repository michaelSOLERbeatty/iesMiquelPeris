export default function ReservaMaterialDeportivo() {
  const materiales = [
    { id: 'futbol', nombre: 'Pelota de fútbol ⚽' },
    { id: 'baloncesto', nombre: 'Pelota de baloncesto 🏀' },
    { id: 'pingpong', nombre: 'Pelota de ping pong 🏓' },
  ];

  const ahora = new Date();
  const hora = ahora.getHours();
  const minuto = ahora.getMinutes();

  const reservasGuardadas = JSON.parse(localStorage.getItem('reservas-material') || '[]');
  const fechaGuardada = localStorage.getItem('fecha-reservas');

  const hoy = new Date().toDateString();

  // Reset diario
  if (fechaGuardada !== hoy) {
    localStorage.setItem('reservas-material', JSON.stringify([]));
    localStorage.setItem('fecha-reservas', hoy);
  }

  const [reservas, setReservas] = React.useState(
    fechaGuardada === hoy ? reservasGuardadas : []
  );

  const horarioPermitido =
    hora === 8 && minuto >= 0 && minuto <= 20;

  const reservar = (material) => {
    const nombre = prompt('Introduce tu nombre:');

    if (!nombre || nombre.trim() === '') {
      alert('Debes introducir un nombre válido.');
      return;
    }

    const yaReservado = reservas.some(
      (r) => r.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (yaReservado) {
      alert('Solo se permite una reserva por persona al día.');
      return;
    };
    if (!horarioPermitido) {
      alert('Las reservas solo están disponibles entre las 08:00 y las 08:20.');
      return;
    }

    const nuevaReserva = {
      nombre,
      material,
      hora: new Date().toLocaleTimeString(),
    };

    const nuevasReservas = [...reservas, nuevaReserva];

    setReservas(nuevasReservas);
    localStorage.setItem(
      'reservas-material',
      JSON.stringify(nuevasReservas)
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Reserva de Material Deportivo
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Las reservas están disponibles únicamente de 08:00 a 08:20.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {materiales.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {item.nombre}
                </h2>

                <button
                  onClick={() => reservar(item.nombre)}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                    horarioPermitido
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h2 className="text-2xl font-bold mb-4">
              Reservas actuales
            </h2>

            {reservas.length === 0 ? (
              <p className="text-gray-500">
                No hay reservas registradas hoy.
              </p>
            ) : (
              <div className="space-y-3">
                {reservas.map((reserva, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{reserva.material}</p>
                      <p className="text-sm text-gray-500">
                        Reservado por: {reserva.nombre}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {reserva.hora}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Fecha actual: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
