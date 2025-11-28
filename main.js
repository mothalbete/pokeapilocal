let offset = 0;
let cargando = false;
let terminadoLocal = false;
let terminadoAPI = false;

// Mapa de traducción de tipos (español → inglés)
const mapaTipos = {
  planta: 'grass',
  veneno: 'poison',
  fuego: 'fire',
  agua: 'water',
  bicho: 'bug',
  volador: 'flying',
  normal: 'normal',
  electrico: 'electric',
  eléctrico: 'electric', // con tilde
  tierra: 'ground',
  hada: 'fairy',
  psiquico: 'psychic',
  psíquico: 'psychic', // con tilde
  roca: 'rock',
  fantasma: 'ghost',
  hielo: 'ice',
  dragon: 'dragon',
  dragón: 'dragon',
  siniestro: 'dark',
  acero: 'steel',
  lucha: 'fighting'
};

function traducirTipo(tipo) {
  if (!tipo) return 'normal';
  const clave = tipo.toLowerCase();
  return mapaTipos[clave] || tipo.toLowerCase();
}

function capitalizar(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function obtenerSprite(p) {
  // Si viene de la API, ya tiene sprites
  if (p.sprites && p.sprites.versions) {
    const animado = p.sprites.versions["generation-v"]["black-white"].animated.front_default;
    if (animado) return animado;
    return p.sprites.front_default;
  }
  // Si viene del JSON local, construimos la URL con su id
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${p.id}.gif`;
}

function mostrarModal(nombre, spriteUrl) {
  document.getElementById('modalName').textContent = nombre;
  document.getElementById('modalSprite').src = spriteUrl;
  document.getElementById('modal').style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
});

async function cargarBloque() {
  if (cargando || (terminadoLocal && terminadoAPI)) return;
  cargando = true;
  document.getElementById('estado').textContent = 'Cargando...';

  try {
    let datos = [];

    if (!terminadoLocal) {
      // JSON local
      const res = await fetch(`index.php?ajax=1&offset=${offset}`);
      datos = await res.json();

      if (!Array.isArray(datos) || datos.length === 0) {
        terminadoLocal = true;
        // continuar desde el siguiente Pokémon después del último local
        offset = 50; // tu JSON tiene 50, así que empezamos en el 51
        return await cargarBloque();
      }
    } else {
      // API
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=10`);
      const apiData = await res.json();
      if (!Array.isArray(apiData.results) || apiData.results.length === 0) {
        terminadoAPI = true;
        document.getElementById('estado').textContent = 'No hay más Pokémon';
        document.getElementById('loadMore').disabled = true;
        return;
      }

      for (const p of apiData.results) {
        const detalleRes = await fetch(p.url);
        const detalle = await detalleRes.json();
        datos.push({
          id: detalle.id,
          nombre: capitalizar(detalle.name),
          altura: detalle.height/10,
          peso: detalle.weight/10,
          tipo: detalle.types.map(t => t.type.name.toLowerCase()),
          sprites: detalle.sprites
        });
      }
    }

    const grid = document.getElementById('grid');
    datos.forEach(p => {
      const tipoPrimario = traducirTipo(Array.isArray(p.tipo) ? p.tipo[0] : 'normal');
      const div = document.createElement('div');
      div.className = 'card ' + tipoPrimario;
      div.innerHTML = `
        <h3>${p.nombre}</h3>
        <p><strong>ID:</strong> ${p.id}</p>
        <p><strong>Altura:</strong> ${p.altura} m</p>
        <p><strong>Peso:</strong> ${p.peso} kg</p>
        <div class="types">
          ${Array.isArray(p.tipo) ? p.tipo.map(t => {
            const tipoTraducido = traducirTipo(t);
            return `<span class="type ${tipoTraducido}">${capitalizar(t)}</span>`;
          }).join('') : ''}
        </div>
      `;
      // Evento click para abrir modal con sprite
      div.addEventListener('click', () => {
        const spriteUrl = obtenerSprite(p);
        mostrarModal(p.nombre, spriteUrl);
      });
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

cargarBloque();

window.addEventListener('scroll', () => {
  if (terminadoLocal && terminadoAPI) return;
  const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;
  if (nearBottom) cargarBloque();
});

document.getElementById('loadMore').addEventListener('click', cargarBloque);
