// Cycle through all tilesets to avoid pop-in on level generation
var loadingStage = document.getElementById('game-over');
// Cycle through each tileset
for (var i = 1; i <= tilesets; i++) {
    // Cycle through each tile
    for (var j = 1; j <= empty; j++) {
        var img = document.createElement('img');
            img.src = 'img/tiles/' + i + '/empty' + j + '.gif';
            img.style.width = '1px';
            img.style.height = '1px';
        loadingStage.appendChild(img);
    }
}
loadingStage.innerHTML = '';