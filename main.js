let offset = 0;
let cargando = false;
let terminado = false;

async function cargarBloque() {
  if (cargando || terminado) return;
  cargando = true;
  document.getElementById('estado').textContent = 'Cargando...';

  try {
    const res = await fetch(`index.php?ajax=1&offset=${offset}`);
    const datos = await res.json();

    if (!Array.isArray(datos) || datos.length === 0) {
      terminado = true;
      document.getElementById('estado').textContent = 'No hay más Pokémon';
      document.getElementById('loadMore').disabled = true;
      return;
    }

    const grid = document.getElementById('grid');
    datos.forEach(p => {
      const div = document.createElement('div');
      const tipoPrimario = Array.isArray(p.tipo) ? p.tipo[0] : 'Normal';
      div.className = 'card ' + tipoPrimario;
      div.innerHTML = `
        <h3>${p.nombre}</h3>
        <p><strong>ID:</strong> ${p.id}</p>
        <p><strong>Altura:</strong> ${p.altura} m</p>
        <p><strong>Peso:</strong> ${p.peso} kg</p>
        <div class="types">
          ${Array.isArray(p.tipo) ? p.tipo.map(t => `<span class="type ${t}">${t}</span>`).join('') : ''}
        </div>
      `;
      grid.appendChild(div);
    });

    offset += datos.length;
    document.getElementById('estado').textContent = '';
  } catch (err) {
    console.error(err);
    document.getElementById('estado').textContent = 'Error cargando datos';
  } finally {
    cargando = false;
  }
}

// Cargar los primeros 10 al inicio
cargarBloque();

// Detectar scroll: cuando llegamos al final, cargar más
window.addEventListener('scroll', () => {
  if (terminado) return;
  const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;
  if (nearBottom) cargarBloque();
});

// Botón de respaldo: cargar más al hacer clic
document.getElementById('loadMore').addEventListener('click', cargarBloque);

