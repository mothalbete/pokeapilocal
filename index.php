<?php
if (isset($_GET['ajax'])) {
    header('Content-Type: application/json; charset=utf-8');
    $jsonPath = __DIR__ . '/pokemon.json';
    $raw = file_get_contents($jsonPath);
    $data = json_decode($raw, true);
    $porPagina = 10;
    $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
    if ($offset >= count($data['pokemon'])) {
        echo json_encode([]);
        exit;
    }
    $bloque = array_slice($data['pokemon'], $offset, $porPagina);
    echo json_encode($bloque, JSON_UNESCAPED_UNICODE);
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pokédex híbrida</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Pokédex</h1>
  <div id="grid" class="grid"></div>
  <div id="estado" class="loading">Cargando...</div>
  <button id="loadMore">Cargar más</button>

  <!-- Modal para mostrar sprite -->
  <div id="modal" class="modal">
    <div class="modal-content">
      <span id="closeModal" class="close">&times;</span>
      <h2 id="modalName"></h2>
      <img id="modalSprite" src="" alt="Sprite">
    </div>
  </div>

  <script src="main.js"></script>
</body>
</html>
