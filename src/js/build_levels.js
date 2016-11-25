// Start Game
function startGame() {
    fadeOut();
    // Build dungeon and reset menus
    setTimeout(function() {
        resetAll(buildMap);
        document.querySelector('.flipper').style.transform = 'rotateY(0deg)';
        document.querySelector('.flip-container').style.display = 'none';
        document.getElementById('tutorial').style.display = 'none';
    }, 1000);
    if (options.tutorial === false && options.endgame === false) {
        // Start spawning enemies once the player has started moving or after 10 seconds because these monster aint got all day.
        var moves = hero.squaresMoved;
        var timer = 0;
        var interval = setInterval(function() {
            if (hero.squaresMoved > moves || timer >= 10) {
                letTheGamesBegin();
                clearInterval(interval);
            }
            timer++;
        }, 1000);
    }
}


// Reset anything from the previous level
function resetAll(callback) {
    console.log('resetAll');
    map = null;
    enemies = null;
    numberOfEnemies = 0;
    totalWeight = 0;
    hero.canMove = false;
    // Reset challenge and boss levels
    hero.challengeMode = false;
    hero.bossLevel = false;
    hero.bossHasSpawned = false;
    hero.bossIsDead = false;
    optionsPosition = 'closed';
    document.getElementById('options-menu').style.transform = 'translateX(-100%)';
    var title = document.querySelector('.flip-container');
        title.style.display = 'flex';
    var gameOver = document.getElementById('game-over');
        gameOver.style.display = 'none';
        gameOver.style.opacity = '0';
    callback(addHero);
}


// Fade to black
function fadeOut() {
    var fade = document.getElementById('fade-to-black');
        fade.style.display = 'flex';
        fade.style.animation = 'fade-out 1s 1 forwards';
}

// Fade back in
function fadeIn() {
    var fade = document.getElementById('fade-to-black');
        fade.style.animation = 'fade-in 1s 1 forwards';
    var save = document.getElementById('warning');
        save.src = 'img/gui/save.svg';
        save.style.animation = 'saving 3s 1s 1';
    setTimeout(function() {
        fade.style.display = 'none';
        healthBar.style.transition = '.5s';
        xpBar.style.transition = '.5s';
    }, 950);
    // Splash level text if necessary
    if (hero.bossLevel) {
        var levelSplash = document.getElementById('level-splash');
            levelSplash.style.opacity = '0';
            levelSplash.style.display = 'flex';
            levelSplash.innerHTML = '<div><h5>- BOSS LEVEL -</h5></div>';
            levelSplash.style.animation = 'warning 2.5s 1s 1 forwards';
        setTimeout(function() {
            levelSplash.style.display = 'none';
        }, 3500);
    }
}


// Build an array of objects for the grid. This will store the column, row, its contents, etc.
function buildMap(callback) {
    console.log('buildMap');
    // Set Challenge Level
    if (hero.gameLevel % 4 === 0) {
        hero.challengeMode = true;
    }
    // Set Boss Level
    if (hero.gameLevel % 6 === 0) {
        hero.bossLevel = true;
    }
    levelContainer.innerHTML = '';
    levelContainer.appendChild(heroContainer);
    map = [];
    enemies = [];
    // Pick a random tileset
    tilesetNumber = randomNumber(1,tilesets);
    tilesetInside = randomNumber(1,tilesets);
    if (options.tutorial && options.newgame || options.endgame) {
        tilesetNumber = tutorialData.tilesetOutside;
        tilesetInside = tutorialData.tilesetInside;
    }
    // Cycle through each row
    for (var r = 1; r <= numberOfRows; r++) {
        var newRow = [];
        var row = 'r' + r;
        // Cycle through each column
        for (var c = 1; c <= numberOfColumns; c++) {
            var col = 'c' + c;
            var location = row + col;
            // Create an object with these details and push to an array
            location = new Cell(location,r,c,'empty');
            newRow.push(location);
        }
        map.push(newRow);
    }
    // Place exit in random cell
    var cell = randomCell();
    if (options.tutorial && options.newgame) {
        cell = tutorialData.exitLocation;
    }
    map[cell[0]][cell[1]].tile = 'exit';
    map[cell[0]][cell[1]].contents = 'exit';
    exit = map[cell[0]][cell[1]];

    callback();
}


// Place the hero on the map in a set position
function addHero() {
    console.log('addHero');
    if (hero.health) {

    }
    // If new game build new hero
    else {
        // Add new player data
        hero = new Cell('r1c1',1,1,'hero');
        hero.armorRating = 1;
        hero.ascending = [];
        hero.attackRating = 1;
        hero.attacksEvaded = 0;
        hero.baseDamage = heroBaseDamage;
        hero.bosses = ['Spider Queen','Vampire Lord','Red Knight'];
        hero.bossHasSpawned = false;
        hero.bossIsDead = false;
        hero.bossLevel = false;
        hero.canCapture = true;
        hero.canMove = true;
        hero.challengeMode = false;
        hero.cooldownTimer = 200;
        hero.dexterity = 1;
        hero.difficultyMath = document.querySelector('input[name="mathradio"]:checked').value;
        hero.difficultyMonster = document.querySelector('input[name="monsterradio"]:checked').value;
        hero.endurance = 1;
        hero.equalsRight = 0;
        hero.equalsWrong = 0;
        hero.enemiesSlain = 0;
        hero.evasion = 10;
        hero.factorsRight = 0;
        hero.factorsWrong = 0;
        hero.gameLevel = 1;
        hero.health = 100;
        hero.hero = true;
        hero.id = 'hero-container';
        hero.knights = [{ number: 0, color: '#888888' }, { number: 2, color: '#cc3234' }, { number: 3, color: '#1cba4c' }, { number: 4, color: '#7c629c' }, { number: 5, color: '#fc8a04' },
                        { number: 6, color: '#cccacc' }, { number: 7, color: '#ffffff' }, { number: 8, color: '#f4fe04' },{ number: 9, color: '#a47644' }];
        hero.left = 0;
        hero.level = 1;
        hero.location = 'r' + hero.row + 'c' + hero.col;
        hero.multiplesRight = 0;
        hero.multiplesWrong = 0;
        hero.name = document.getElementById('name-input').value;
        hero.pause = false;
        hero.primesRight = 0;
        hero.primesWrong = 0;
        hero.squaresMoved = 0;
        hero.strength = 1;
        hero.timesFrozen = 0;
        hero.timesPoisoned = 0;
        hero.timesWebbed = 0;
        hero.top = 0;
        hero.trapsEvaded = 0;
        hero.xp = 0;
    }

    if (options.tutorial && options.newgame) {
        hero.top = tutorialData.heroTop;
        hero.left = tutorialData.heroLeft;
        hero.row = tutorialData.heroRow;
        hero.col = tutorialData.heroCol;
        hero.location = tutorialData.heroLocation;
    }

    // The hero is contained in a 3x3 grid with movement buttons attached
    // Size the container to fit evenly
    heroContainer.style.width = cellSize * 3 + 'px';
    heroContainer.style.height = cellSize * 3 + 'px';
    heroContainer.style.top = '-' + cellSize + 'px';
    heroContainer.style.left = '-' + cellSize + 'px';
    heroContainer.style.zIndex = 15;
    // Size each cell to match the map cell size
    var heroGrid = document.querySelectorAll('#hero-container div');
    for (var i = 0; i < heroGrid.length; i++) {
        heroGrid[i].style.width = cellSize + 'px';
        heroGrid[i].style.height = cellSize + 'px';
    }

    var name = document.getElementById('player-name');
        name.innerHTML = 'Ser ' + hero.name;
    var level = document.getElementById('level');
        level.innerHTML = 'Floor ' + hero.gameLevel;
    healthBar.style.width = hero.health + '%';
    healthBar.style.transition = '0s';
    xpBar.style.width = hero.xp + '%';
    xpBar.style.transition = '0s';
    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
    hero.canMove = true;

    getObjectLocations();
}


// Object constructor for building the map
function Cell(location,row,col,tile) {
    this.location = location
    this.row = row;
    this.col = col;
    this.tile = tile;
    this.contents = 'empty';
    this.hero = false;
    this.enemy = [];
}


// Build array of safe locations to spawn traps, columns, and debris
function getObjectLocations() {
    console.log('getObjectLocations');
    debrisToBuild = randomNumber(3,5);
    columnsToBuild = randomNumber(1,3);
    trapsToBuild = [randomNumber(1,2),randomNumber(3,4),randomNumber(4,6)];

    var total = trapsToBuild[hero.difficultyMonster - 1] + debrisToBuild + columnsToBuild;
    if (options.endgame) {
        total = 20;
    }
    var fullArray = [];
    locationArray = [];

    // Generate list of safe locations to spawn traps, columns, and objects
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            var cell = map[r][c];
            if (cell.location !== hero.location && cell.contents !== 'exit' && cell.contents !== 'blocked') {
                var temp = [cell.row - 1,cell.col - 1];
                fullArray.push(temp);
            }
        }
    }
    // Randomly grab one and remove it from the array to prevent duplicates
    for (var i = 0; i < total * 2; i++) {
        var index = randomNumber(0,fullArray.length - 1);
        var cell = fullArray[index];
            locationArray.push(cell);
            fullArray.splice(index,1);
    }
    console.log(total + ' / ' + locationArray.length);
    randomizeDebris();
}


// Return a random location that is not the player or exit location
function randomCell() {
    var randomRow = randomNumber(0,(numberOfRows - 1));
    var randomCol = randomNumber(0,(numberOfColumns - 1));
    var cell = map[randomRow][randomCol];
    if (cell.location === hero.location || cell.contents === 'exit' || cell.contents === 'blocked') {
        randomCell();
    }
    else {
        return [randomRow, randomCol];
    }
}


// Randomize breakable debris
function randomizeDebris() {
    console.log('randomizeDebris');
    var objectTheme = themes[randomNumber(0,themes.length - 1)];
    if (options.tutorial && options.newgame) {
        var number = tutorialData.numDebris;
        objectTheme = tutorialData.objectTheme;
        var template = [[0,0],[numberOfRows - 1,numberOfColumns - 1]];
    }
    else if (options.endgame) {
        var number = 10;
    }
    else {
        var number = debrisToBuild;
    }
    for (var i = 0; i < number; i++) {
        var cell = locationArray[0];
        var object = map[cell[0]][cell[1]];
        if (options.tutorial && options.newgame) {
            object = map[template[i][0]][template[i][1]];
        }
        if (options.endgame) {
            object.object = 'knight-' + i;
        }
        else {
            object.object = objectTheme[randomNumber(0,objectTheme.length - 1)];
        }
        object.tile = 'empty';
        object.contents = 'blocked';
        object.health = 30;
        object.evasion = 0;
        locationArray.shift();
    }

    randomizeColumns();
}


// Randomize columns
function randomizeColumns() {
    console.log('randomizeColumns');
    columnArray = [];
    wallTileset = randomNumber(1,walls);
    if (options.endgame || options.tutorial && options.newgame) {
        var number = tutorialData.numColumns;
        wallTileset = tutorialData.wallTileset;
        var template = tutorialData.wallLocation;
    }
    else if (hero.bossLevel !== false) {
        wallTileset = '0';
        var number = 3;
    }
    else {
        var number = columnsToBuild;
    }

    for (var i = 0; i < number; i++) {
        var cell = locationArray[0];
        var object = map[cell[0]][cell[1]];
        if (options.endgame || options.tutorial && options.newgame) {
            object = map[template[i][0]][template[i][1]];
        }
        columnArray.push({ location: object.location, row: object.row, col: object.col });
        object.object = 'wall';
        object.cage = false;
        object.tile = 'empty';
        object.contents = 'blocked';
        if (hero.bossLevel === false) {
            object.health = 150;
            object.evasion = 0;
        }
        locationArray.shift();
    }

    randomizeTraps();
}


// Percentage chance to spawn a trap
function randomizeTraps() {
    console.log('randomizeTraps');
    trapArray = [];
    if (options.tutorial && options.newgame) {
        var totalTraps = tutorialData.numTraps;
        var template = tutorialData.trapLocation;
    }
    else if (options.endgame) {
        var totalTraps = 0;
    }
    else {
        var totalTraps = trapsToBuild[hero.difficultyMonster - 1];
    }

    var safety = 0;
    for (var i = 0; i < totalTraps; i++) {
        var cell = locationArray[0];
        if (safety > 25) {
            console.log('/// STOP randomizeTraps ///');
            break;
        }
        if (cell === undefined) {
            i--;
            safety++
        }
        else {
            var mapTile = map[cell[0]][cell[1]];
            if (options.tutorial && options.newgame) {
                mapTile = map[template[i][0]][template[i][1]];
            }
            mapTile.tile = 'empty';
            mapTile.object = traps[randomNumber(0,traps.length - 1)];
            if (options.tutorial && options.newgame) {
                mapTile.object = traps[i];
            }
            mapTile.contents = 'trap';
            mapTile.trapDamage = damageFromTraps;
            trapArray.push(mapTile);
            locationArray.shift();
        }
    }

    buildGrid();
}

// Build grid one row at a time
function buildGrid() {
    console.log('buildGrid');
    // Select a random level template style
    levelTemplates = ['single','dual','corners','tri-corners'];
    template = levelTemplates[randomNumber(0,levelTemplates.length - 1)];
    wallTorches = randomNumber(0,1);
    if (options.tutorial && options.newgame || options.endgame) {
        template = 'corners';
        wallTorches = 1;
    }
    captive = 0;
    exitTileset = '';

    for (var i = 0; i < numberOfRows; i++) {
        buildRow(i);
    }
    // Add shadow class to first row
    document.querySelector('#level-container .row').id = 'shadow-top';
    // Level exit
    levelExit = document.getElementById(exit.location);
    levelExit.style.backgroundImage = 'url("img/exit.gif")'
    levelExit.style.overflow = 'hidden';
    var cover = document.createElement('img');
        cover.src = exitTileset;
        cover.style.width = '100%';
        cover.style.height = '100%';
        levelExit.appendChild(cover);
    columnPositions = [];
    for (var i = 0; i < columnArray.length; i++) {
        var cell = document.getElementById(columnArray[i].location).getBoundingClientRect();
        columnPositions.push(cell);
    }
    if (options.endgame) {
        theEnd();
    }
    else {
        addMath();
    }
}


// Build rows as needed to populate the grid
function buildRow(row) {
    var newRow = document.createElement('div');
        newRow.classList.add('row');
    for (var i = 0; i < numberOfColumns; i++) {
        var cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            // Give it an ID to match the location
            cell.id = map[row][i].location;
            var tileGraphic = applyTileset(map[row][i]);
            cell.style.backgroundImage = tileGraphic;
            if (map[row][i].object) {
                var object = document.createElement('img');
                    object.src = 'img/objects/' + map[row][i].object + '.gif';
                if (map[row][i].object === 'wall') {
                    if (hero.bossLevel) {
                        wallTorches = 0;
                        var prisoner = document.createElement('img');
                            prisoner.src = 'img/objects/knight-' + hero.knights[captive].number + '.gif';
                            prisoner.classList.add('prisoner');
                            cell.appendChild(prisoner);
                            captive++;
                    }
                    else if (wallTorches === 1) {
                        cell.classList.add('torch');
                    }
                    object.src = 'img/objects/wall-' + wallTileset + '.gif';
                    object.className = 'wall';
                }
                else if (map[row][i].object.includes('knight')) {
                    object.className = 'knight';
                }
                cell.appendChild(object);
            }
        newRow.appendChild(cell);
    }
    levelContainer.appendChild(newRow);
}


// Grab the content value of the desired cell and apply the appropriate graphic
function applyTileset(e) {
    var tile = e.tile;
    if (tile === 'empty' || tile === 'exit') {
        // Apply same tileset to entire map
        if (template === 'single') {
            var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
        }
        // Border the map with one tileset, then fill the middle with another
        else if (template === 'dual') {
            if (e.row === 1 || e.row === numberOfRows || e.col === 1 || e.col === numberOfColumns) {
                var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
            }
            else {
                var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
            }
        }
        // Border map except for corners
        else if (template === 'corners') {
            if (e.row === 1 || e.row === numberOfRows) {
                if (e.col === 1 || e.col === numberOfColumns) {
                    var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
                else {
                    var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
            }
            else if (e.col === 1 || e.col === numberOfColumns) {
                var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
            }
            else {
                var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
            }
        }
        // Add larger corner sections
        else if (template === 'tri-corners') {
            if (e.row === 1 || e.row === numberOfRows) {
                if (e.col === 1 || e.col === 2 || e.col === numberOfColumns || e.col === numberOfColumns - 1) {
                    var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
                else {
                    var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
            }
            else if (e.row === 2 || e.row === numberOfRows - 1) {
                if (e.col === 1 || e.col === numberOfColumns) {
                    var tileset = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
                else {
                    var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
                }
            }
            else {
                var tileset = 'img/tiles/' + tilesetInside + '/empty' + randomNumber(1,empty) + '.gif'; 
            }
        }
    }
    // If object, apply object image
    else {
        var tileset = 'url("img/' + tile + '.gif")';
    }
    // Apply correct tileset to exit cover
    if (e.contents === 'exit') {
        exitTileset = tileset;
    }
    else {
        tileset = 'url("' + tileset + '")';
    }
    return tileset;
}


// Make changes for special trap types
function handleTraps() {
    for (var i = 0; i < trapArray.length; i++) {
        // Turn fire grate on and off
        if (trapArray[i].object === 'fire-grate') {
                (function() {
                var currentLevel = hero.gameLevel;
                var mapLocation = map[trapArray[i].row - 1][trapArray[i].col - 1];
                    mapLocation.contents = 'empty';
                var interval = randomNumber(5000,10000);
                var grate = document.querySelector('#' + trapArray[i].location + ' img');
                var burnInterval = setInterval(function() {
                    if (currentLevel === hero.gameLevel) {
                        grate.src = 'img/objects/fire-grate-on.gif';
                        mapLocation.contents = 'trap';
                        if (mapLocation.location === hero.location) {
                            checkForTraps();
                        }
                        setTimeout(function() {
                            grate.src = 'img/objects/fire-grate.gif';
                            mapLocation.contents = 'empty';
                        }, 3000);
                    }
                    else {
                        clearInterval(burnInterval);
                    }
                }, interval);
            }());
        }
    }
}