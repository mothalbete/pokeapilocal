<?php
$json = file_get_contents('pokemon.json');
$data = json_decode($json, true);
$primeros = array_slice($data['pokemon'], 0, 10);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Primeros Pokémon</title>

    <!-- Bootstrap CSS CDN -->
    <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
        rel="stylesheet"
    >

    <!-- Tus estilos -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

<div class="container mt-4">
    <h1 class="mb-4">Primeros 10 Pokémon</h1>

    <table class="table table-striped table-bordered">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($primeros as $poke): ?>
                <tr>
                    <td><?= $poke['id'] ?></td>
                    <td><?= htmlspecialchars($poke['nombre']) ?></td>
                    <td><?= implode(", ", $poke['tipo']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Tus scripts -->
<script src="js/main.js"></script>

</body>
</html>
