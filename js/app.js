// VARIABLES FOR GAME CUSTOMIZATION //

// Minimum cell width in pixels
var minimumCellWidth = 60;
var maxScreenWidth = 768;
var maxColumns = 8;
var maxRows = 12;
// Percentage of screen space to be saved for the UI
var reservedSpace = 25;
var desktopReservedSpace = 5;
// Side wall in pixels
var reservedSides = 15;
// Minimum percentage of correct answers per level
var correctMinThreshold = 20;
var correctMaxThreshold = 50;

// Customize variables for healing
var healthRestoreFromCapture = 1;
var healthRestoreFromPotion = 30;

// Customize variables for damage
var heroBaseDamage = 25;
var damageFromWrongAnswer = 20;
var damageFromTraps = 15;

var chanceToSpawnTrap = 75;
var backgrounds = 2;
var tilesets = 10;
var junk = 10;
var walls = 16;
var empty = 6;
var traps = ['fire-grate','spikes'];
var numberOfTraps = [2,4,6];
var loot = [
    {
        type: 'health',
        amount: [5,10,15]
    },
    {
        type: 'gold',
        amount: [1,2,5,10,25]
    }
];
var lootChance = 40;

// Object Themes
var themes = [
    // Storage Room
    ['pot-1','pot-2','pot-3','pot-4','pot-5','pot-6','bones-1','bones-3','bones-4','bones-5','bones-6','bones-7','barrel-1','barrel-2','box-1','box-2','table-1','table-2','shelf-1','weapons-1','weapons-2'],
    // Study
    ['bones-3','bones-4','bones-5','chair-1','chair-2','table-1','table-2','shelf-1','shelf-2'],
    // Graveyard 1
    ['fence-1','fence-2','bones-1','bones-2','bones-3','bones-4','bones-5','bones-6','bones-7','coffin-1','coffin-2','coffin-3','grave-1','grave-2','grave-3','grave-4','grave-5','grave-6','monument-1','monument-2','monument-3','monument-4','vase-1','vase-2'],
    // Graveyard 2
    ['fence-1','fence-2','tree-1','tree-2','bush-1','bush-2','bones-1','bones-2','bones-3','bones-4','bones-5','bones-6','bones-7','coffin-1','coffin-2','coffin-3','grave-1','grave-2','grave-3','grave-4','grave-5','grave-6','monument-1','monument-2','monument-3','monument-4'],
    // Outside Area
    ['fence-1','fence-2','tree-1','tree-2','bush-1','bush-2','bones-1','bones-2']
];

//////////////////////////////////////


// Show splash screen
(function splashScreen() {
    var splash = document.querySelector('#splash img');
        splash.style.animation = 'img-fade-in 1.25s 1s 1 forwards';
    setTimeout(function(){
        splash.parentElement.addEventListener('click', fadeImgOut);
    }, 1250);
    var fadeOut = setTimeout(function() {
        fadeImgOut();
    }, 5000);
    function fadeImgOut() {
        clearInterval(fadeOut);
        splash.style.animation = 'img-fade-out 1.25s 1 forwards';
        splash.parentElement.style.animation = 'img-fade-out 0.75s 1.75s 1 forwards';
        setTimeout(function() {
            splash.parentElement.style.display = 'none';
        }, 2500);
    }
}());


// Check if there is already an options file
if (localStorage.getItem('options') === null) {
    // If not, then create a blank one
    options = {
        soundfx: true,
        music: true,
        tutorial: true,
        enemiesEncountered: [],
        newEnemies: 0,
        gold: 0
    };
}
else {
    // Otherwise, retrieve and parse it
    var retrievedList = localStorage.getItem('options');
        options = JSON.parse(retrievedList);
}

// Check if there is already a death list
if (localStorage.getItem('fallenHeroes') === null) {
    // If not, then create a blank one
    fallenHeroes = [];
}
else {
    // Otherwise, retrieve and parse it
    var retrievedList = localStorage.getItem('fallenHeroes');
        fallenHeroes = JSON.parse(retrievedList);
}

// Get display size
var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

// Max screen width for desktop viewing
if (screenWidth > maxScreenWidth) { screenWidth = maxScreenWidth; }

var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

screenWidth = screenWidth - (reservedSides * 2);

// Calculate number of columns to build based on minimum column width
var numberOfColumns = Math.floor(screenWidth / minimumCellWidth);
if (numberOfColumns > maxColumns) { numberOfColumns = maxColumns; }

var cellSize = Math.floor(screenWidth / numberOfColumns);

// Calculate number of rows to build while leaving space for menus
if (screenWidth === maxScreenWidth) {
    reservedSpace = desktopReservedSpace;
}
var numberOfRows = Math.floor((screenHeight * (1 - (reservedSpace / 100))) / cellSize);
if (numberOfRows > maxRows) { numberOfRows = maxRows; }
var totalCells = numberOfColumns * numberOfRows;

var optionsPosition = 'closed';
var levelContainer = document.getElementById('level-container');
    levelContainer.style.width = numberOfColumns * cellSize + 'px';
var heroContainer = document.getElementById('hero-container');
var player = document.getElementById('hero');
    player.addEventListener('click', checkMath);
var healthBar = document.getElementById('health');
var xpBar = document.getElementById('xp');
var gameMode = ['multiples','factors','primes','equality'];
var challengeMode = ['ascending','descending'];

// Add event listeners for the 4 movement buttons
var moveUp = document.getElementById('move-up');
    moveUp.addEventListener('click', moveHero);
var moveDown = document.getElementById('move-down');
    moveDown.addEventListener('click', moveHero);
var moveLeft = document.getElementById('move-left');
    moveLeft.addEventListener('click', moveHero);
var moveRight = document.getElementById('move-right');
    moveRight.addEventListener('click', moveHero);

// Listen for keyboard events for desktop users that like to kick it oldschool
document.onkeyup = checkKey;

function checkKey(e) {
    if (hero.canMove === true) {
        e = e || window.event;
        if (e.keyCode == '37' ||
            e.keyCode == '38' ||
            e.keyCode == '39' ||
            e.keyCode == '40') {
            moveHero(e);
        }
        else if (e.keyCode == '32') {
            checkMath();
        }
    }
}


// Add functionality to title menu buttons
function titleScreen() {
document.body.style.height = '100vh';
// When starting a new game, rotate the display
var newGameButton = document.getElementById('btn-new-game');
    newGameButton.addEventListener('click', function() {
        var screen = document.querySelector('.flipper');
            screen.style.transform = 'rotateY(-180deg)';
        // Reset game modes
        gameMode = ['multiples','factors','primes','equality'];
        document.getElementById('multiples').checked = true;
        document.getElementById('factors').checked = true;
        document.getElementById('primes').checked = true;
        document.getElementById('equality').checked = true;
    });
// To continue your progress in an existing game
var continueButton = document.getElementById('btn-continue');
    continueButton.addEventListener('click', function() {
        // Retrieve saved game from local storage and parse it
        var retrievedList = localStorage.getItem('savedGame');
            hero = JSON.parse(retrievedList);
        startGame();
    });
var optionsButton = document.querySelectorAll('.btn-options');
    for (var i = 0; i < optionsButton.length; i++) {
        optionsButton[i].addEventListener('click', function(e) {
            // Hide main menu button if needed
            if (e.target.offsetParent.id === 'title-screen') {
                document.querySelector('#options-menu .return-to-main-menu').style.display = 'none';
            }
            else if (e.target.parentElement.id === 'top-bar') {
                document.querySelector('#options-menu .return-to-main-menu').style.display = 'inline-block';
            }
            // Open options menu
            var menu = document.getElementById('options-menu');
            if (optionsPosition === 'closed') {
                hero.pause = true;
                menu.style.transform = 'translateX(0)';
                optionsPosition = 'open';
            }
            else {
                hero.pause = false;
                setOptions();
                menu.style.transform = 'translateX(-100%)';
                optionsPosition = 'closed';
            }

        });
    }
var tutorialButton = document.getElementById('btn-tutorial');
    tutorialButton.addEventListener('click', displayTutorial);

// When returning to the main menu, rotate the display back
var mainMenuButton = document.getElementById('btn-main-menu');
    mainMenuButton.addEventListener('click', function() {
        var screen = document.querySelector('.flipper');
            screen.style.transform = 'rotateY(0deg)';
    });
// When ready to play, get the play name and selected difficulties
var playButton = document.getElementById('btn-play');
    playButton.addEventListener('click', function(e) {
        delete hero;
        hero = {};
        hero.name = document.getElementById('name-input').value;
        hero.difficultyMath = document.querySelector('input[name="mathradio"]:checked').value;
        hero.difficultyMonster = document.querySelector('input[name="monsterradio"]:checked').value;
        if (hero.name.length === 0) {
            alert('Please name your character.');
        }
        else if (hero.name.length > 20) {
            alert('In this world no name is longer than 20 characters long.');
        }
        else if (gameMode.length === 0) {
            alert('That would be too easy. Select at least 1 game mode.');
        }
        else if (hero.name.length > 0 && hero.name.length <= 20 && hero.difficultyMath && hero.difficultyMonster && gameMode.length >= 1) {
            if (options.tutorial) {
                displayTutorial(e);
            }
            else {
                startGame();
            }
        }
    });

// Allow selecting different game modes to update array
var modeMultiples = document.getElementById('multiples');
    modeMultiples.addEventListener('click', adjustGameMode);
var modeFactors = document.getElementById('factors');
    modeFactors.addEventListener('click', adjustGameMode);
var modePrimes = document.getElementById('primes');
    modePrimes.addEventListener('click', adjustGameMode);
var modeEquality = document.getElementById('equality');
    modeEquality.addEventListener('click', adjustGameMode);

var returnToMainMenu = document.querySelector('.return-to-main-menu');
    returnToMainMenu.addEventListener('click', fadeToMainMenu);

titleButtons();
}

titleScreen();

// Check if there is already a saved game
function titleButtons() {
    if (localStorage.getItem('savedGame') === null) {
        // If not, then create a blank one
        savedGame = [];
        // And hide continue button on main menu
        var continueButton = document.getElementById('btn-continue');
            continueButton.style.display = 'none';
    }
    else {
        // Otherwise, retrieve and parse it
        var retrievedData = localStorage.getItem('savedGame');
            savedGame = JSON.parse(retrievedData);
        var continueButton = document.getElementById('btn-continue');
            continueButton.style.display = 'inline-block';
    }
    // Display bestiary button if any monsters have been encountered
    if (options.enemiesEncountered.length > 0) {
        var bestiaryButton = document.getElementById('btn-bestiary');
            bestiaryButton.addEventListener('click', displayBestiary);
            bestiaryButton.style.display = 'flex';
        // Display notification if new enemies have been encountered
        if (options.newEnemies > 0) {
            var newCount = document.getElementById('btn-bestiary-new');
                newCount.innerHTML = options.newEnemies;
                newCount.style.display = 'flex';
        }
    }
    // Display gold total
    if (options.gold > 0) {
        var goldTotal = document.querySelector('#gold-total span');
            goldTotal.parentElement.style.display = 'flex';
            goldTotal.innerHTML = options.gold.toLocaleString();
    }
}

var soundfx = document.getElementById('soundfx');
var music = document.getElementById('music');
    soundfx.addEventListener('click', setOptions);
    music.addEventListener('click', setOptions);
    // Set correct display of buttons based on saved options
    if (options.soundfx) {
        soundfx.checked = true;
    }
    else {
        soundfx.checked = false;
    }
    if (options.music) {
        music.checked = true;
    }
    else {
        music.checked = false;
    }


// Set sound options in local storage
function setOptions() {
    // Change in local storage if needed
    if (soundfx.checked) {
        options.soundfx = true;
    }
    else {
        options.soundfx = false;
    }
    if (music.checked) {
        options.music = true;
    }
    else {
        options.music = false;
    }
    localStorage.setItem('options', JSON.stringify(options));
}


var mathradio = document.querySelectorAll('#math-difficulty input');
    for (var i = 0; i < mathradio.length; i++) {
        mathradio[i].addEventListener('click', adjustDifficulty);
    }
var monsterradio = document.querySelectorAll('#monster-difficulty input');
    for (var i = 0; i < monsterradio.length; i++) {
        monsterradio[i].addEventListener('click', adjustDifficulty);
    }

// Adjust display of stars for math and monster difficulties
function adjustDifficulty(e) {
    if (e.target.name === 'mathradio') {
        var name = mathradio;
    }
    else if (e.target.name === 'monsterradio') {
        var name = monsterradio;
    }
    // Make all grey to start
    for (var i = 1; i < name.length; i++) {
        name[i].nextElementSibling.firstChild.style.backgroundImage = 'url("img/gui/star-off.svg")';
    }
    // Highlight stars as needed
    for (var i = 0; i < e.target.value; i++) {
        name[i].nextElementSibling.firstChild.style.backgroundImage = 'url("img/gui/star-on.svg")';
    }
}

// Add and remove game modes as they are checked and unchecked
function adjustGameMode(e) {
    var mode = gameMode.indexOf(e.target.id); 
    if (e.target.checked && mode === -1) {
        gameMode.push(e.target.id);
    }
    else if (!e.target.checked && mode !== -1) { 
        gameMode.splice(mode, 1);
    }
}


var fallenButton = document.getElementById('btn-fallen-heroes');
    fallenButton.addEventListener('click', displayHeroes);

// Display fallen heroes
function displayHeroes() {
    var listDisplay = document.createElement('div');
        listDisplay.id = 'fallen-heroes';
    document.body.appendChild(listDisplay);
    var container = document.getElementById('fallen-heroes');
    var title = '<h5>Fallen Heroes</h5><br />';
        container.innerHTML = title;

    var i = 0;
    createList();
    // Loop through array at a set interval
    function createList() {
        setTimeout(function() {
            if (fallenHeroes.length > 0) {
            var row = document.createElement('div');
                row.classList.add('row');
                row.id = 'fallen-' + i;
            var entry = '<div><span>' + fallenHeroes[i].name + '</span>';
                entry += '<span>Level ' + fallenHeroes[i].gameLevel + '</span></div>';
                entry += '<p>' + fallenHeroes[i].death + '</p>';
                row.innerHTML = entry;
                container.appendChild(row);
            var button = document.getElementById(row.id);
                button.addEventListener('click', function() {
                    var item = button.id.split('-').pop();
                    listFallenStats(fallenHeroes[item],'fallen-heroes');
                });
                row = container.lastChild;
                row.style.transition = 'opacity .5s';
                setTimeout(function() {
                    row.style.opacity = '1';
                }, 200);
                i++;
                if (i < fallenHeroes.length) {
                    createList();
                }
                else {
                    appendButtons();
                }
            }
            else {
                appendButtons();
            }

            function appendButtons() {
                var footer = document.createElement('div');
                    footer.style.paddingBottom = '25px';
                    footer.innerHTML = '<button></button><button id="clearlist"></button>';
                    container.appendChild(footer);

                var button = document.querySelector('#fallen-heroes button');
                    button.addEventListener('click', function() {
                        container.remove();
                    });
                var trash = document.getElementById('clearlist');
                    trash.addEventListener('click', clearList);
                if (fallenHeroes.length === 0) {
                    trash.style.display = 'none';
                }
            }
        }, 100);
    }
}


// Clear high score list
function clearList() {
    if (confirm('This will clear your Fallen Heroes list. Are you sure about this?')) {
        localStorage.removeItem('fallenHeroes');
        delete fallenHeroes;
        fallenHeroes = [];
        var container = document.getElementById('fallen-heroes');
            container.remove();
        displayHeroes();
    }
}


// Display tutorial on New Games
function displayTutorial(e) {
    var tutorial = document.getElementById('tutorial');
        tutorial.innerHTML = '';
        tutorial.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    
    var list = '<h5>How to Play</h5>';
        list += '<p>Here is a brief description of the game, and any kind of story that I might want to throw in there to fill up some space and make it more interesting.</p>';
        list += '<br />';
        list += '<h5>Game Modes</h6>';
        list += '<br />';
        list += '<h6>Multiples</h6>';
        list += '<p>Find and capture tiles that are MULTIPLES of the number given. Multiples of 5 would be 5, 10, 15, 20, etc.</p>';
        list += '<h6>Factors</h6>';
        list += '<p>Find and capture tiles that evenly divide into the given number. Factors of 20 would be 1, 2, 4, 5, and so on.</p>';
        list += '<h6>Prime Numbers</h6>';
        list += '<p>These are numbers that are only divisible by 1 and themselves. Examples of prime numbers are 3, 5, 7, and 11.</p>';
        list += '<h6>Equality</h6>';
        list += '<p>Select equations that equal the given number. Examples for Equals 6 would include 2+4, and 12&divide;2.</p>';
        list += '<br />';
        list += '<h5>Challenge Levels</h5>';
        list += '<p>Challenge levels are not part of the normal rotation, but will occur every few levels to mix things up.</p>';
        list += '<br />';
        list += '<h6>Ascending Order</h6>'
        list += '<p>Capture the tiles in ascending order from lowest number to highest.</p>';
        list += '<h6>Descending Order</h6>'
        list += '<p>Capture the tiles in descending order from highest number to lowest.</p>';
        list += '<br /><input type="checkbox" name="enable-tutorial" id="enable-tutorial" checked /><label for="enable-tutorial"><span></span>Show Tutorial Next Time</label>'
        list += '<button class="main-menu-button">Play</button>';
        list += '<button class="btn-back"></button>';

        tutorial.innerHTML = list;

    var backButton = document.querySelector('#tutorial .btn-back');
        backButton.addEventListener('click', function() {
            localStorage.setItem('options', JSON.stringify(options));
            tutorial.style.display = 'none';
            tutorial.innerHTML = '';
        });

    if (e.target.id === 'btn-tutorial') {
        document.querySelector('#tutorial .main-menu-button').style.display = 'none';
    }
    else {
        backButton.style.display = 'none';
    }

        tutorial.style.display = 'flex';
        tutorial.style.opacity = '1';

    // Allow user to disable tutorial from showing on starting a new game
    var tutorialCheckbox = document.querySelector('#tutorial input');
    if (options.tutorial) {
        tutorialCheckbox.checked = true;
    }
    else {
        tutorialCheckbox.checked = false;
    }
        tutorialCheckbox.addEventListener('click', function(e) {
            if (e.target.checked) {
                options.tutorial = true;
            }
            else if (!e.target.checked) {
                options.tutorial = false;
            }
        });

    // Start game
    var button = document.querySelector('#tutorial .main-menu-button');
        button.addEventListener('click', function() {
            localStorage.setItem('options', JSON.stringify(options));
            startGame();
        });
}


// Start Game
function startGame(fadeIn) {
    fadeOut();
    setTimeout(function() {
        generateLevel();
        document.querySelector('.flipper').style.transform = 'rotateY(0deg)';
        document.querySelector('.flip-container').style.display = 'none';
        document.getElementById('tutorial').style.display = 'none';
    }, 1000);
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

// Generate the level
function generateLevel() {
    try {
        resetAll();
        buildMap();
        addHero();
        randomizeObjects();
        buildGrid();
        addMath();
        handleTraps();
    } catch(e) {
        generateLevel();
    }
    fadeIn();
}


var maxWeight = 0;
var totalWeight = 0;
var numberOfEnemies = 0;
var enemies = [];


// Reset anything from the previous level
function resetAll() {
    map = null;
    enemies = null;
    numberOfEnemies = 0;
    totalWeight = 0;
    hero.canMove = false;
    optionsPosition = 'closed';
    document.getElementById('options-menu').style.transform = 'translateX(-100%)';
    var title = document.querySelector('.flip-container');
        title.style.display = 'flex';
    var gameOver = document.getElementById('game-over');
        gameOver.style.display = 'none';
        gameOver.style.opacity = '0';
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
}


// Build an array of objects for the grid. This will store the column, row, its contents, etc.
function buildMap() {
    levelContainer.innerHTML = '';
    levelContainer.appendChild(heroContainer);
    map = [];
    enemies = [];
    // Pick a random tileset
    tilesetNumber = randomNumber(1,tilesets);
    tilesetInside = randomNumber(1,tilesets);
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
    map[cell[0]][cell[1]].tile = 'exit';
    map[cell[0]][cell[1]].contents = 'exit';
    exit = map[cell[0]][cell[1]];
}


// Object constructor for building the map
function Cell(location,row,col,tile) {
    this.location = location
    this.row = row;
    this.col = col;
    this.tile = tile;
    this.contents = 'empty';
    this.hero = false;
    this.enemy = false;
}


// Call individual object functions
function randomizeObjects() {
    randomizeDebris(5);
    randomizeColumns(randomNumber(1,3));
    randomizeTraps(numberOfTraps[hero.difficultyMonster - 1]);
}


// Randomize breakable debris
function randomizeDebris(number) {
    var objectTheme = themes[randomNumber(0,themes.length - 1)];
    for (var i = 0; i < number; i++) {
        var cell = randomCell();
        var object = map[cell[0]][cell[1]];
        object.object = objectTheme[randomNumber(0,objectTheme.length - 1)];
        object.tile = 'empty';
        object.contents = 'blocked';
        object.health = 30;
        object.evasion = 0;
    }
}


// Randomize columns
function randomizeColumns(number) {
    columnArray = [];
    wallTileset = randomNumber(1,walls);
    for (var i = 0; i < number; i++) {
        var cell = randomCell();
        var object = map[cell[0]][cell[1]];
        columnArray.push(object.location);
        object.object = 'wall';
        object.tile = 'empty';
        object.contents = 'blocked';
        object.health = 150;
        object.evasion = 0;
    }
}


// Percentage chance to spawn a trap
function randomizeTraps(number) {
    trapArray = [];
    if (randomNumber(1,100) <= chanceToSpawnTrap) {
        for (var i = 0; i < number; i++) {
            var cell = randomCell();
            var mapTile = map[cell[0]][cell[1]];
                mapTile.tile = 'empty';
                mapTile.object = traps[randomNumber(0,traps.length - 1)];
                mapTile.contents = 'trap';
                mapTile.trapDamage = damageFromTraps;
                trapArray.push(mapTile);
        }
    }
}


// Return a random location that is not the player or exit location
function randomCell() {
    var randomRow = randomNumber(0,(numberOfRows - 1));
    var randomCol = randomNumber(0,(numberOfColumns - 1));
    if (map[randomRow][randomCol].location === hero.location ||
        map[randomRow][randomCol].contents === 'exit') {
        randomCell();
    }
    else {
        return [randomRow, randomCol];
    }
}

//////////////////////
function cheat() {
    hero.answers = hero.answersNeeded - 1;
}
//////////////////////


// Build grid one row at a time
function buildGrid() {
    // Select a random level template style
    levelTemplates = ['single','dual','corners','tri-corners'];
    template = levelTemplates[randomNumber(0,levelTemplates.length - 1)];
    wallTorches = randomNumber(0,1);
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
        var cell = document.getElementById(columnArray[i]).getBoundingClientRect();
        columnPositions.push(cell);
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
                    if (wallTorches === 1) {
                        cell.classList.add('torch');
                    }
                    object.src = 'img/objects/wall-' + wallTileset + '.gif';
                    object.className = 'wall';
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


// Place the hero on the map in a set position
function addHero() {
    if (hero.health) {

    }
    // If new game build new hero
    else {
        // Add new player data
        hero = new Cell('r1c1',1,1,'hero');
        hero.id = 'hero-container';
        hero.top = 0;
        hero.left = 0;
        hero.location = 'r' + hero.row + 'c' + hero.col;
        hero.canMove = true;
        hero.health = 100;
        hero.xp = 0;
        hero.level = 1;
        hero.strength = 1;
        hero.dexterity = 1;
        hero.endurance = 1;
        hero.armorRating = 1;
        hero.attackRating = 1;
        hero.baseDamage = heroBaseDamage;
        hero.evasion = 10;
        hero.gameLevel = 1;
        hero.pause = false;
        hero.multiplesRight = 0;
        hero.multiplesWrong = 0;
        hero.factorsRight = 0;
        hero.factorsWrong = 0;
        hero.primesRight = 0;
        hero.primesWrong = 0;
        hero.equalsRight = 0;
        hero.equalsWrong = 0;
        hero.ascending = [];
        hero.enemiesSlain = 0;
        hero.squaresMoved = 0;
        hero.trapsEvaded = 0;
        hero.attacksEvaded = 0;
        hero.timesFrozen = 0;
        hero.timesWebbed = 0;
        hero.hero = true;
        hero.name = document.getElementById('name-input').value;
        hero.difficultyMath = document.querySelector('input[name="mathradio"]:checked').value;
        hero.difficultyMonster = document.querySelector('input[name="monsterradio"]:checked').value;
    }

    // The hero is contained in a 3x3 grid with movement buttons attached
    // Size the container to fit evenly
    heroContainer.style.width = cellSize * 3 + 'px';
    heroContainer.style.height = cellSize * 3 + 'px';
    heroContainer.style.top = '-' + cellSize + 'px';
    heroContainer.style.left = '-' + cellSize + 'px';
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
}


// Reset variables and route to the selected game mode
function addMath() {
    hero.challengeMode = false;
    if (hero.gameLevel % 4 === 0) {
        var mode = challengeMode[randomNumber(0,challengeMode.length - 1)];
        hero.challengeMode = true;
    }
    else {
        var mode = gameMode[randomNumber(0,gameMode.length - 1)];
    }
    hero.gameMode = mode;
    hero.answers = 0;
    hero.answersNeeded = 0;
    // Calculate the number of valid spaces that are available
    var total = 0;
    var correctNeeded = 0;
    var incorrectNeeded = 0;
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            if (map[r][c].contents === 'empty') {
                total++
            }
        }
    }
    // Add math for exit location
    total++;
    // Calculate the number of valid and invalid answers needed to generate
    correctNeeded = Math.ceil(total * (randomNumber(correctMinThreshold,correctMaxThreshold) / 100));
    incorrectNeeded = total - correctNeeded;
    hero.answersNeeded = correctNeeded;

    // Traditional Game Modes
    if (mode === 'multiples') {
        multiples(total,correctNeeded,incorrectNeeded);
    }
    else if (mode === 'factors') {
        factors(total,correctNeeded,incorrectNeeded);
    }
    else if (mode === 'primes') {
        primes(total,correctNeeded,incorrectNeeded);
    }
    else if (mode === 'equality') {
        equality(total,correctNeeded,incorrectNeeded);
    }
    // Challenge Modes
    else if (mode === 'ascending' || mode === 'descending') {
        ascendingDescending(total);
    }
}


// Generate list of correct and incorrect multiples
function multiples(total,correct,incorrect) {
    var difficulty = [
        {
            // EASY
            min: 2,
            max: 10,
            highest: 50
        },
        {
            // MEDIUM
            min: 5,
            max: 25,
            highest: 100
        },
        {
            // HARD
            min: 10,
            max: 50,
            highest: 200
        }
    ];
    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    var correctArray = [];
    var incorrectArray = [];
    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        answer = { number: randomNumber(1,difficulty[hero.difficultyMath - 1].highest), answer: false };
        if (answer.number % target === 0 && correctArray.length < correct) {
            answer.answer = true;
            correctArray.push(answer);
        }
        else if (answer.number % target !== 0 && incorrectArray.length < incorrect){
            incorrectArray.push(answer);
        }
        else {
            i--;
        }
    }
    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Multiples of ' + target;
    // Send to the display function
    displayMath(finalArray);
}


// Generate list of correct and incorrect factors
function factors(total,correct,incorrect) {
    var difficulty = [
        {
            // EASY
            min: 20,
            max: 40,

        },
        {
            // MEDIUM
            min: 40,
            max: 100,
        },
        {
            // HARD
            min: 50,
            max: 200,
        }
    ];
    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    if (target % 2 !== 0) {
        target++;
    }
    var correctArray = [];
    var incorrectArray = [];
    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        answer = { number: randomNumber(1,difficulty[hero.difficultyMath - 1].max), answer: false };
        if (target % answer.number === 0 && correctArray.length < correct) {
            answer.answer = true;
            correctArray.push(answer);
        }
        else if (target % answer.number !== 0 && incorrectArray.length < incorrect){
            incorrectArray.push(answer);
        }
        else {
            i--;
        }
    }
    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Factors of ' + target;
    // Send to the display function
    displayMath(finalArray);
}


// Generate list of prime numbers
function primes(total,correct,incorrect) {
        var difficulty = [
        {
            // EASY
            max: 50

        },
        {
            // MEDIUM
            max: 100
        },
        {
            // HARD
            max: 200
        }
    ];
    var correctArray = [];
    var incorrectArray = [];
    generatePrimeNumbers(difficulty[hero.difficultyMath - 1].max);
    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        answer = { number: nonPrimes[randomNumber(0,nonPrimes.length - 1)], answer: false };
        if (correctArray.length < correct) {
            answer.number = primes[randomNumber(0,primes.length - 1)];
            answer.answer = true;
            correctArray.push(answer);
        }
        else if (incorrectArray.length < incorrect){
            incorrectArray.push(answer);
        }
        else {
            i--;
        }
    }
    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Prime Numbers';
    // Send to the display function
    displayMath(finalArray);
}


// Generate an array of prime numbers up to the number given
function generatePrimeNumbers(max) {
    var numbers = [];
    primes = [];
    nonPrimes = [];

    for (var i = 2; i <= max; i++) {
        numbers.push(i);   
    }
    while (numbers.length) {
        primes.push(numbers.shift());
        numbers = numbers.filter(function(i) {
            if (i % primes[primes.length - 1] === 0) {
                nonPrimes.push(i);
            }
            return i % primes[primes.length - 1] != 0;
        });
    }
}


// Generate list of correct and incorrect equality formulas
function equality(total,correct,incorrect) {
        var difficulty = [
        {
            // EASY
            min: 1,
            max: 20,

        },
        {
            // MEDIUM
            min: 20,
            max: 70,
        },
        {
            // HARD
            min: 70,
            max: 150,
        }
    ];
    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    var correctArray = [];
    var incorrectArray = [];
    var symbols = ['+','-','*','/'];

    // Loop through the total number of formulas needed
    for (var i = 0; i < total; i++) {
        var equation = '';
        var equationString = '';
        var symbol = symbols[randomNumber(0,symbols.length - 1)];
        var num1 = randomNumber(1,target);
        
        // Create valid formulas
        if (correctArray.length < correct) {
            // Create valid addition formula
            if (symbol === '+') {
                var num2 = target - num1;
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>' + symbol + '</p><p>' + num2;
                }
                else {
                    equationString = num1 + symbol + num2;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Create valid subtraction formula
            else if (symbol === '-') {
                var num2 = target + num1;
                if (hero.difficultyMath === '3') {
                    equationString = num2 + '</p><p>' + symbol + '</p><p>' + num1;
                }
                else {
                    equationString = num2 + symbol + num1;
                }
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Create valid multiplication formula
            else if (symbol === '*') {
                // Loop it until a valid number is given
                for (var i = 0; i < 1; i++) {
                    var num1 = randomNumber(1,target);
                    if (target % num1 === 0) {
                        var num2 = target / num1;
                        if (hero.difficultyMath === '3') {
                            equationString = num1 + '</p><p>&times;</p><p>' + num2;
                        }
                        else {
                            equationString = num1 + '&times;' + num2;
                        }
                        answer = { number: equationString, answer: true };
                        correctArray.push(answer);
                    }
                    else {
                        i--;
                    }
                }
            }
            // Create valid division formulas
            else if (symbol === '/') {
                // Loop it until a valid number is given
                for (var i = 0; i < 1; i++) {
                    var num1 = randomNumber(target, target * 3);
                    if (num1 % target === 0) {
                        var num2 = num1 / target;
                        if (hero.difficultyMath === '3') {
                            equationString = num1 + '</p><p>&divide;</p><p>' + num2;
                        }
                        else {
                            equationString = num1 + '&divide;' + num2;
                        }
                        answer = { number: equationString, answer: true };
                        correctArray.push(answer);
                    }
                    else {
                        i--;
                    }
                }
            }
        }
        // Create invalid formulas
        else if (incorrectArray.length < incorrect) {
            var num2 = randomNumber(1,target);
            equationString = num1 + symbol + num2;
            // Make sure it is invalid
            if (eval(equationString) !== target && symbol === '/') {
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&divide;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&divide;' + num2;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
            else if (eval(equationString) !== target && symbol === '*') {
                if (hero.difficultyMath === '3') {
                    equationString = num1 + '</p><p>&times;</p><p>' + num2;
                }
                else {
                    equationString = num1 + '&times;' + num2;
                }
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
            else {
                i--;
            }
        }
    }
    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Equals ' + target;
    // Send to the display function
    displayMath(finalArray);
}

// Generate list of ascending or descending random values
function ascendingDescending(total) {
    var difficulty = [
        {
            // EASY
            min: 1,
            max: totalCells,

        },
        {
            // MEDIUM
            min: 1,
            max: totalCells * 2,
        },
        {
            // HARD
            min: 1,
            max: totalCells * 4,
        }
    ];

    var finalArray = [];
    var numberArray = [];
    for (var i = 0; i < total; i++) {
        var number = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
        if (numberArray.indexOf(number) == -1) {
            answer = { number: number, answer: true };
            finalArray.push(answer);
            numberArray.push(number);
        }
        else {
            i--;
        }
    }
    if (hero.gameMode === 'ascending') {
        numberArray.sort( function(a,b) { return a - b; } );
        var modeText = 'Ascending Order';
    }
    else if (hero.gameMode === 'descending') {
        numberArray.sort( function(a,b) { return b - a; } );
        var modeText = 'Descending Order';
    }
    hero.ascending = numberArray;
    hero.answersNeeded = total;
    document.getElementById('game-mode').innerHTML = modeText;
    // Send to the display function
    displayMath(finalArray);
}


// Take the combined array of answers, shuffle it, then return it
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Place all of the math formulas into the grid
function displayMath(finalArray) {
    var i = 0;
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            if (map[r][c].contents === 'empty' || map[r][c].contents === 'exit') {
                map[r][c].number = finalArray[i].number;
                map[r][c].answer = finalArray[i].answer;
                var cell = document.getElementById(map[r][c].location);
                var equation = document.createElement('p');
                    equation.innerHTML = finalArray[i].number;
                cell.appendChild(equation);
                i++;
            }
        }
    }
}


// When activating a square check if answer is correct
function checkMath() {
    var correct = false;
    // Get the hero location so you can check the appropriate map data
    var munchLocation = map[hero.row - 1][hero.col - 1];
    // Prevent from capturing a tile more than once
    if (munchLocation.answer === 'captured') {

    }
    // Ascending or Descending Order
    else if (munchLocation.number === hero.ascending[0]) {
        correct = true;
        hero.ascending.shift();
    }
    else if (munchLocation.answer && hero.challengeMode === false) {
        correct = true;
    }
    if (correct) {
        hero.answers++;
        restoreHealth(healthRestoreFromCapture);
        munchLocation.answer = 'captured';
        var square = document.querySelector('#' + munchLocation.location + ' p');
        setTimeout(function() {
            if (square === null) {
                console.log('null square');
            }
            else {
                square.remove();
            }
        }, 250);
        if (hero.answers === hero.answersNeeded) {
            var exitAnswer = document.querySelector('#' + levelExit.id + ' p');
            if (exitAnswer !== null) {
                exitAnswer.style.opacity = '0';
            }
            var exitCover = document.querySelector('#' + levelExit.id + ' img');
                exitCover.style.transition = '2.25s ease-in-out';
                exitCover.style.transform = 'translateY(-100%)';
        }

        if (hero.gameMode === 'multiples') {
            hero.multiplesRight++;
        }
        else if (hero.gameMode === 'factors') {
            hero.factorsRight++;
        }
        else if (hero.gameMode === 'primes') {
            hero.primesRight++;
        }
        else if (hero.gameMode === 'equality') {
            hero.equalsRight++;
        }
    }
    else if (munchLocation.contents === 'exit' && hero.answers === hero.answersNeeded ) {
        startGame();
    }
    else if (!munchLocation.hasOwnProperty("answer")) {

    }
    else {
        if (hero.gameMode === 'multiples') {
            hero.multiplesWrong++;
        }
        else if (hero.gameMode === 'factors') {
            hero.factorsWrong++;
        }
        else if (hero.gameMode === 'primes') {
            hero.primesWrong++;
        }
        else if (hero.gameMode === 'equality') {
            hero.equalsWrong++;
        }
        flashHitImage(hero,player);
        dealDamage(damageFromWrongAnswer,'wrong answer');
    }
}

var taps = [];

// Move hero with screen swipes
function swipe() {

    var touchSurface = document.getElementById('touch-surface');

    var xStart;
    var xEnd;
    var yStart;
    var yEnd;
    var xDistance;
    var yDistance;
    var minDistance = 75;
    var tolerance = 75;
    var startTime;
    var totalTime;
    var timeLimit = 250;

    touchSurface.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (hero.canMove) {
            xStart = e.changedTouches[0].clientX;
            yStart = e.changedTouches[0].clientY;
            startTime = new Date().getTime();
        }
    });

    touchSurface.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    touchSurface.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (hero.canMove) {
            xEnd = e.changedTouches[0].clientX;
            yEnd = e.changedTouches[0].clientY;
            totalTime = new Date().getTime() - startTime;

            xDistance = xEnd - xStart;
            yDistance = yEnd - yStart;

            // Weird method I came up with to check for a double tap
            // if (totalTime <= timeLimit && Math.abs(xDistance) < 50 && Math.abs(yDistance) < 50) {
            //     var tap = new Date().getTime();
            //         taps.push(tap);
            //     setTimeout(function() {
            //         taps = [];
            //     }, timeLimit);
            //     if (taps.length === 2) {
            //         if (taps[1] - taps[0] < timeLimit) {
            //             checkMath();
            //         }
            //     }
            // }


            // Make sure swipe is fast enough, and prevent swiping the hero
            if (totalTime <= timeLimit && e.target.id !== 'hero') {

                // Check for LEFT or RIGHT movement
                if (Math.abs(xDistance) > minDistance && Math.abs(yDistance) < tolerance) {
                    // Move RIGHT
                    if (xEnd - xStart > 0) {
                        e.target.id = 'move-right';
                        moveHero(e);
                    }
                    // Move LEFT
                    else if (xEnd - xStart < 0) {
                        e.target.id = 'move-left';
                        moveHero(e);
                    }
                }
                // Check for UP or DOWN movement
                else if (Math.abs(yDistance) > minDistance && Math.abs(xDistance) < tolerance) {
                    // Move DOWN
                    if (yEnd - yStart > 0) {
                        e.target.id = 'move-down';
                        moveHero(e);
                    }
                    // Move UP
                    else if (yEnd - yStart < 0) {
                        e.target.id = 'move-up';
                        moveHero(e);
                    }
                }
            }
        }
    });

}


// Check collision of movement, and move accordingly
function moveHero(e) {
    if (hero.canMove) {
        var munchLocation = map[hero.row - 1][hero.col - 1];
        if (e.target.id === 'move-up' || e.keyCode == '38') {
            if (hero.row === 1) {

            }
            else {
                var mapLocation = map[hero.row - 2][hero.col - 1];
                if (mapLocation.enemy !== false) {
                    var name = mapLocation.enemy;
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('up',target,hero);
                }
                else if (hero.top >= cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.top -= cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.row--;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('up',mapLocation,hero);
                }
            }
        }
        else if (e.target.id === 'move-down' || e.keyCode == '40') {
            if (hero.row === numberOfRows) {

            }
            else {
                var mapLocation = map[hero.row][hero.col - 1];
                if (mapLocation.enemy !== false) {
                    var name = mapLocation.enemy;
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('down',target,hero);
                }
                else if (hero.top <= (numberOfRows - 2) * cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.top += cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.row++;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('down',mapLocation,hero);
                }
            }
        }
        else if (e.target.id === 'move-left' || e.keyCode == '37') {
            if (hero.col === 1) {

            }
            else {
                var mapLocation = map[hero.row - 1][hero.col - 2];
                if (mapLocation.enemy !== false) {
                    var name = mapLocation.enemy;
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('left',target,hero);
                }
                else if (hero.left >= cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.left -= cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.col--;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('left',mapLocation,hero);
                }
            }
        }
        else if (e.target.id === 'move-right' || e.keyCode == '39') {
            if (hero.col === numberOfColumns) {

            }
            else {
                var mapLocation = map[hero.row - 1][hero.col];
                if (mapLocation.enemy !== false) {
                    var name = mapLocation.enemy;
                    var target = enemies.filter(function(target) {
                        return target.id === name;
                    })[0];
                    checkForAttack('right',target,hero);
                }
                else if (hero.left <= (numberOfColumns - 2) * cellSize && mapLocation.contents !== 'blocked') {
                    map[hero.row - 1][hero.col - 1].hero = false;
                    hero.left += cellSize;
                    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
                    hero.col++;
                    hero.squaresMoved++;
                    map[hero.row - 1][hero.col - 1].hero = true;
                    checkForTraps();
                    checkForLoot();
                }
                else {
                    checkForAttack('right',mapLocation,hero);
                }
            }
        }
        hero.location = 'r' + hero.row + 'c' + hero.col;
        if (hero.location == levelExit.id && hero.answers === hero.answersNeeded) {
            hero.gameLevel++;
            // Save game to local storage
            localStorage.setItem('savedGame', JSON.stringify(hero));
            localStorage.setItem('options', JSON.stringify(options));
            awardXp('level');
            startGame();
        }
    }
}


// Flash hit image on character
function flashHitImage(victim,victimContainer) {
    if (victim.hasOwnProperty('id')) {
        victimContainer.classList.add('hit');
        setTimeout(function() {
            victimContainer.classList.remove('hit');
        }, 350);
    }
}


// Attack depending on what direction you are attacking from
function checkForAttack(direction,victim,attacker) {
    if (victim.hasOwnProperty('health')) {
        // Check if evasion stops attack
        if (randomNumber(1,100) > victim.evasion) {
            if (victim.health > 0) {
                var victimContainer = document.getElementById(victim.id);
                if (victim.hero) {
                    victimContainer = player;
                }
                flashHitImage(victim,victimContainer);
                // Move attacker for attack animation
                var attackerContainer = document.getElementById(attacker.id);
                var attackerTop = attacker.top;
                var attackerLeft = attacker.left;
                if (direction === 'up') {
                    attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + (attacker.top - (cellSize / 2)) + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                else if (direction === 'down') {
                    attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + (attacker.top + (cellSize / 2)) + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                else if (direction === 'left') {
                    attackerContainer.style.transform = 'translate(' + (attacker.left - (cellSize / 2)) + 'px, ' + attacker.top + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                else if (direction === 'right') {
                    attackerContainer.style.transform = 'translate(' + (attacker.left + (cellSize / 2)) + 'px, ' + attacker.top + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                    }, 200);
                }
                if (victim === hero) {
                    dealDamage(attacker.baseDamage,attacker);
                }
                else {
                    victim.health -= attacker.baseDamage * attacker.attackRating;
                    if (victim.health <= 0) {
                        delete map[victim.row - 1][victim.col - 1].health;
                        map[victim.row - 1][victim.col - 1].enemy = false;
                        if (victim.enemy !== false) {
                            var enemyIndex = enemies.map(function(e) { return e.id; }).indexOf(victim.id);
                            enemies.splice(enemyIndex,1);
                            victimContainer.style.opacity = '0';
                            setTimeout(function() {
                                victimContainer.remove();
                            }, 350);
                        }
                        else {
                            var object = document.querySelector('#' + victim.location + ' img');
                                object.style.opacity = '0';
                            // Roll for loot
                            rollLoot(victim);
                        }
                    }
                }
            }
        }
        else {
            if (victim === hero) {
                hero.attacksEvaded++;
                flashMessage(victim,'evaded!');
            }
            else {
                flashMessage(victim,'miss!');
            }
        }
    }
}


// Flash a status message for evasions
function flashMessage(person,message) {
    var msg = document.querySelector('#' + person.id + ' .message');
        msg.innerHTML = message;
        msg.style.display = 'flex';
        msg.style.opacity = '0';
        if (message === 'miss' || message === 'evaded!') {
            var duration = 0.7;
        }
        else {
            var duration = 2;
        }
        msg.style.animation = 'flash-message ' + duration + 's 1 forwards';
    setTimeout(function() {
        msg.style.display = 'none';
    }, duration * 1000);

}


// Randomize loot drop
function rollLoot(victim) {
    if (randomNumber(1,100) <= lootChance) {
        var lootType = loot[randomNumber(0,loot.length - 1)];
        var lootAmount = lootType.amount[randomNumber(0,lootType.amount.length - 1)];
        var lootDrop = { type: lootType.type, amount: lootAmount }
        var location = map[victim.row - 1][victim.col - 1]
            location.contents = 'loot';
            location.loot = lootDrop;
        var lootLocation = document.getElementById(victim.location);
        var lootImage = document.createElement('img');
            lootImage.src = 'img/loot/' + lootDrop.type + '-' + lootAmount + '.gif';
            lootImage.style.width = '50%';
            lootLocation.appendChild(lootImage);
    }
    else {
        victim.contents = 'empty';
    }
}

// Restore health depending on what healing method is passed to the function
function restoreHealth(amount) {
    if (hero.health >= 100) {}
    else if (hero.health + amount <= 100) {
        hero.health += amount;
    }
    else {
        hero.health = 100;
    }
    healthBar.style.width = hero.health + '%';
}


// Deal damage depending on what healing method is passed to the function
function dealDamage(amount,source) {
    amount *= hero.armorRating;
    hero.health -= amount;
    if (hero.health <= 0) {
        // Determine the cause of death
        var location = map[hero.row -1][hero.col - 1];
        // If it was a trap
        if (source === 'trap') {
            if (location.object === 'spikes') {
                var deathBy = deathText.spikes[randomNumber(0,deathText.spikes.length - 1)];
            }
            else if (location.object === 'fire-grate') {
                var deathBy = deathText.fireGrate[randomNumber(0,deathText.fireGrate.length - 1)];
            }
            else if (location.trapType) {
                var deathBy = 'Slipped and fell on some ' + location.trapType;
            }
        }
        // If it was a wrong answer
        else if (source === 'wrong answer') {
            var deathBy = deathText.math[randomNumber(0,deathText.math.length - 1)];
        }
        // If it was an enemy
        else if (source.enemy) {
            if (source.type === 'Gelatinous Cube') {
                var deathBy = deathText.gelCube[randomNumber(0,deathText.gelCube.length - 1)];
            }
            else if (source.type === 'Giant Spider') {
                var deathBy = deathText.spider[randomNumber(0,deathText.spider.length - 1)];
            }
            else if (source.type === 'Number Mage') {
                var deathBy = deathText.numMage[randomNumber(0,deathText.numMage.length - 1)];
            }
            else if (source.type === 'Oculord') {
                var deathBy = deathText.oculord[randomNumber(0,deathText.oculord.length - 1)];
            }
            else if (source.type === 'Vampire') {
                var deathBy = deathText.vampire[randomNumber(0,deathText.vampire.length - 1)];
            }
        }
        youDied(deathBy);
    }
    else {
        healthBar.style.width = hero.health + '%';
    }
}


// Freeze anyone who walks through ice for set number of seconds
function freezePerson(person,duration,type) {
    person.canMove = false;
    var timer = document.getElementById('hero-status');
        timer.style.width = '100%';
    if (type === 'ice') {
        flashMessage(person,'frozen!');
        timer.style.backgroundColor = '#8aeaea';
    }
    else {
        timer.style.backgroundColor = '#24e35a';
    }
        timer.style.display = 'flex';
        timer.style.animation = 'status-effect ' + (duration / 1000) + 's linear 1 forwards';
    setTimeout(function() {
        timer.style.display = 'none';
        person.canMove = true;
    }, duration);
}


// If stepping on a trapped tile deal damage
function checkForTraps() {
    var location = map[hero.row - 1][hero.col - 1];
    // Check against hero % chance to evade traps
    if (randomNumber(1,100) < hero.evasion && location.contents === 'trap') {
        hero.trapsEvaded++;
        flashMessage(hero,'evaded!');
    }
    else {
        if (location.contents === 'trap' && location.tile === 'ice') {
            hero.timesFrozen++;
            var duration = 3000;
            flashMessage(hero,'frozen!');
            freezePerson(hero,duration,'ice');
        }
        else if (location.trapType === 'web') {
            hero.timesWebbed++;
            var duration = 4000;
            flashMessage(hero,'trapped!');
            freezePerson(hero,duration,'web');
        }
        else if (location.contents === 'trap') {
            flashHitImage(hero,player);
            dealDamage(location.trapDamage,'trap');
        }
    }
}


// Check for loot and make necessary changes
function checkForLoot() {
    var location = map[hero.row - 1][hero.col - 1];
    if (location.contents === 'loot') {
        var cell = document.querySelectorAll('#' + location.location + ' img');
        if (location.loot.type === 'health' && hero.health < 100) {
            restoreHealth(location.loot.amount);
            location.contents = 'empty';
            for (var i = 0; i < cell.length; i++) {
                cell[i].remove();
            }
        }
        else if (location.loot.type === 'gold') {
            options.gold += location.loot.amount;
            location.contents = 'empty';
            for (var i = 0; i < cell.length; i++) {
                cell[i].remove();
            }
        }
    }
}


// Award that sweet xp
function awardXp(source) {
    // Add xp for completing a level
    if (source === 'level') {
        setTimeout(function() {
            hero.xp += 15;
            xpBar.style.width = hero.xp + '%';
        }, 2500);
    }
    // Add xp for slaying a monster
    else {
        hero.xp += Math.floor((0.5 / hero.level) * source.weight);
        xpBar.style.width = hero.xp + '%';
    }
    // Level up and overflow xp
    if (hero.xp >= 100) {
        hero.xp -= 100;
        hero.level++;
        xpBar.style.width = hero.xp + '%';
        var level = document.getElementById('level');
            level.innerHTML = 'Level Up!';
            level.classList.add('level-up');
            level.addEventListener('click', levelUp);
        restoreHealth(100);
    }
}


// Allocate 1 skill point for the player to use and change stat accordingly
function levelUp() {
    hero.pause = true;
    var str = [0,0,.25,.35,.5];
    var dex = [0,0,5,7,9];
    var end = [0,0,.1,.15,.2];
    var selection = '';
    var menu = document.getElementById('level-up-menu');
        menu.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
        menu.style.display = 'flex';
        menu.style.animation = 'img-fade-in 1s 1 forwards';
    var strLvl = document.querySelector('.strength div span');
        strLvl.innerHTML = 'lvl ' + hero.strength;
    var dexLvl = document.querySelector('.dexterity div span');
        dexLvl.innerHTML = 'lvl ' + hero.dexterity;
    var endLvl = document.querySelector('.endurance div span');
        endLvl.innerHTML = 'lvl ' + hero.endurance;
    var choices = document.querySelectorAll('#level-up-menu .row');

    var changeStr = document.getElementById('add-str');
    if (hero.strength === (str.length - 1)) {
        changeStr.innerHTML = 'MAX LEVEL';
    }
    else {
        changeStr.innerHTML = Math.round((hero.baseDamage * hero.attackRating)) + ' -> ' + Math.round((hero.baseDamage * (hero.attackRating + str[hero.strength + 1])));
    }
    var changeDex = document.getElementById('add-dex');
    if (hero.dexterity === (dex.length - 1)) {
        changeStr.innerHTML = 'MAX LEVEL';
    }
    else {
        changeDex.innerHTML = hero.evasion + '% -> ' + (hero.evasion + dex[hero.dexterity + 1]) + '%';
    }
    var changeEnd = document.getElementById('add-end');
    if (hero.endurance === (end.length - 1)) {
        changeStr.innerHTML = 'MAX LEVEL';
    }
    else {
        changeEnd.innerHTML = (hero.armorRating * 100) + '% -> ' + ((hero.armorRating - end[hero.endurance + 1]) * 100) + '%';
    }

    for (var i = 0; i < choices.length; i++) {
        choices[i].addEventListener('click', function(e) {
            for (var i = 0; i < choices.length; i++) {
                choices[i].style.outlineColor = 'rgba(0,0,0,0)';
            }
            this.style.outlineColor = '#ffd700';
            selection = this.classList[1];
        });
    }
    var button = document.querySelector('#level-up-menu button');
        button.addEventListener('click', function() {
            var done = false;
            if (selection === 'strength' && hero.strength < (str.length - 1)) {
                hero.strength++;
                hero.attackRating += str[hero.strength];
                done = true;
            }
            else if (selection === 'dexterity' && hero.dexterity < (dex.length - 1)) {
                hero.dexterity++;
                hero.evasion += dex[hero.dexterity];
                done = true;
            }
            else if (selection === 'endurance' && hero.endurance < (end.length - 1)) {
                hero.endurance++;
                hero.armorRating -= end[hero.endurance];
                done = true;
            }

            if (done) {
                var level = document.getElementById('level');
                    level.innerHTML = 'Floor ' + hero.gameLevel;
                    level.classList.remove('level-up');
                    level.removeEventListener('click', levelUp);
                    menu.style.animation = 'img-fade-out 1s 1 forwards';
                setTimeout(function() {
                    for (var i = 0; i < choices.length; i++) {
                        choices[i].removeEventListener('click', function(e) {});
                    }
                    menu.style.display = 'none';
                    hero.pause = false;
                }, 1000);
                for (var i = 0; i < choices.length; i++) {
                    choices[i].style.outlineColor = 'rgba(0,0,0,0)';
                }
                selection = null;
                var elClone = button.cloneNode(true);
                button.parentNode.replaceChild(elClone, button);
            }
        });
}


// Add player to fallen heroes and display final summary
function youDied(deathBy) {
    healthBar.style.width = '0';
    // Add hero to list of fallen heroes
    hero.death = deathBy;
    fallenHeroes.push(hero);
    // Sort fallen heroes list
    fallenHeroes.sort( function(a,b) { return b.gameLevel - a.gameLevel; } );
    // Trim list if too long
    if (fallenHeroes.length > 25) {
        fallenHeroes.splice((fallenHeroes.length), 1);
    }
    localStorage.setItem('fallenHeroes', JSON.stringify(fallenHeroes));
    localStorage.setItem('options', JSON.stringify(options));
    // Kill character
    localStorage.removeItem('savedGame');
    listFallenStats(hero,'game-over');
        hero = null;
        hero = { canMove: false };
}


// Fade to black, reset menus, and fade back in
function fadeToMainMenu() {
    fadeOut();
    // Reset all menus
    setTimeout(function() {
        try {
            resetAll();
            titleButtons();
            setTimeout(function() {
                fadeIn();
            }, 1000);
        }
        catch(e) {
            console.log(e);
            alert('fadeToMainMenu ERROR');
        }
    }, 1000);
}


// Display how the character died in a plethora of humorous ways
var deathText = {

    spikes:     ['Tripped and fell on some spikes.',
                'Landed heart first on a spike.',
                'Felt the need to add another hole to their face.',
                'Got into a fight with some spikes and lost.',
                'Death by spikes.',
                'Tried to make out with some spikes and was very successful.'],

    fireGrate:  ['Got a little too fired up.',
                'Got served up extra crispy.',
                'Cooked to perfection.',
                'Killed by fire.',
                'Tripped and fell into a fire.',
                'Do you smell what the dungeon is cookin?'],

    math:       ['Forgot how to math.',
                'Left their calculator at home.',
                'Didn&rsquo;t pay attention in math class.',
                'Got mathed upside the head',
                'Got in a fight with a number and lost somehow.',
                'Couldn&rsquo;t math their way out of a paper bag.',
                'Death by math.',
                'Killed by numbers.',
                'Math is hard.'],

    gelCube:    ['Ate too much Jell-O.',
                'Run over by a Gelatinous Cube.',
                'Got a big ole hug from a Gelatinous Cube.',
                'Got into a fatal makeout session with a Gelatinous Cube.',
                'Being slowly digested and turned into Gelatinous Cube poop.',
                'Trapped in a Gelatinous Cube of emotion.'],

    spider:     ['Killed by a spider. A big one.',
                'I hate spiders. Why did I put them in my game??',
                'Not very good at making friends with spiders.',
                'Food for the Spider Queen.',
                'Spiders are very aggressive huggers.',
                'Tripped and fell into a spiders mouth.'],

    numMage:    ['Killed by the weakest enemy in the entire game.',
                'Got out numbered by a Number Mage.',
                'Death by Number Mage.',
                'Do Number Mages even deal damage?'],

    oculord:    ['Looked too deeply into the all seeing eye of the Oculord.',
                'Beat up by a giant meatball.',
                'Died valiantly while battling an Oculord.'

                ],
    vampire:    ['Killed by a vampire.']
}


// Display bestiary
function displayBestiary() {
    var gameOverScreen = document.getElementById('game-over');
        gameOverScreen.innerHTML = '';
        gameOverScreen.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    
    var list = '<h5>Bestiary</h5>';

    for (var i = 0; i < options.enemiesEncountered.length; i++) {
        var monster = bestiary.filter(function(monster) {
            return monster.type === options.enemiesEncountered[i];
        })[0];

        list += '<div class="row"><div class="col-2">';
        list += '<img src="img/enemies/' + monster.image + '"></div>';
        list += '<div class="col-9"><p>' + monster.type + '</p>';
        list += '<p>' + monster.info + '</p></div></div>';  
    }

    gameOverScreen.innerHTML = list;

    var button = document.createElement('button');
        button.className = 'main-menu-button';
        gameOverScreen.appendChild(button);

        gameOverScreen.style.opacity = '1';
        gameOverScreen.style.display = 'flex';

    var closeButton = document.querySelector('.main-menu-button');
        closeButton.innerHTML = '';
        closeButton.className = 'btn-back';
        closeButton.addEventListener('click', function() {
            gameOverScreen.style.display = 'none';
            gameOverScreen.innerHTML = '';
        });

    options.newEnemies = 0;
    localStorage.setItem('options', JSON.stringify(options));
    var newCount = document.getElementById('btn-bestiary-new');
        newCount.style.display = 'none';
}

// Display fallen hero stats
function listFallenStats(hero,view) {
    var gameOverScreen = document.getElementById('game-over');
        gameOverScreen.innerHTML = '';
        gameOverScreen.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    var stats = '<h5>' + hero.name + '</h5>';
        stats += '<p>Level <span>' + hero.level + '</span></p>';
        stats += '<p>STR: <span>' + hero.strength + '</span></p>';
        stats += '<p>DEX: <span>' + hero.dexterity + '</span></p>';
        stats += '<p>END: <span>' + hero.endurance + '</span></p>';
        stats += '<p>Dungeon Level: <span>' + hero.gameLevel + '</span></p>';
        stats += '<p>Math Difficulty: <span>' + hero.difficultyMath + '</span></p>';
        stats += '<p>Monster Difficulty: <span>' + hero.difficultyMonster + '</span></p>';
        stats += '<p class="death">' + hero.death + '</p>';
        stats += '<h6>Accuracy</h6>';
        stats += '<p>Multiples: <span>' + getAccuracy(hero.multiplesRight,hero.multiplesWrong) + '</span></p>';
        stats += '<p>Factors: <span>' + getAccuracy(hero.factorsRight,hero.factorsWrong) + '</span></p>';
        stats += '<p>Primes: <span>' + getAccuracy(hero.primesRight,hero.primesWrong) + '</span></p>';
        stats += '<p>Equality: <span>' + getAccuracy(hero.equalsRight,hero.equalsWrong) + '</span></p>';
        stats += '<h6>Fun Stats</h6>';
        stats += '<p>Spaces Moved: <span>' + hero.squaresMoved + '</span></p>';
        stats += '<p>Enemies Slain: <span>' + hero.enemiesSlain + '</span></p>';
        stats += '<p>Traps Evaded: <span>' + hero.trapsEvaded + '</span></p>';
        stats += '<p>Attacks Evaded: <span>' + hero.attacksEvaded + '</span></p>';
        stats += '<p>Times Frozen: <span>' + hero.timesFrozen + '</span></p>';
        stats += '<p>Times Spider Webbed: <span>' + hero.timesWebbed + '</span></p>';

        stats += '<button class="main-menu-button">Main menu</button>';
        gameOverScreen.innerHTML = stats;
        gameOverScreen.style.opacity = '0';
        gameOverScreen.style.display = 'flex';
        setTimeout(function() {
            gameOverScreen.style.opacity = '1';
        }, 200);
    if (view === 'game-over') {
        var mainMenuButton = document.querySelector('.main-menu-button');
            mainMenuButton.addEventListener('click', fadeToMainMenu);
    }
    else {
        var closeButton = document.querySelector('.main-menu-button');
            closeButton.innerHTML = '';
            closeButton.className = 'btn-back';
            closeButton.addEventListener('click', function() {
                gameOverScreen.style.display = 'none';
            });
    }
}


// Start adding enemies based on monster difficulty
function letTheGamesBegin() {
    if (hero.difficultyMonster == 1) {
        maxWeight = 60;
    }
    else if (hero.difficultyMonster == 2) {
        maxWeight = 100;
    }
    else if (hero.difficultyMonster == 3) {
        maxWeight = 180;
    }
    // Get list of safe spawn locations
    spawnArray = [];
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            var cell = map[r][c];
            if (r === 0 || r === numberOfRows - 1) {
                if (cell.object && cell.contents !== 'trap') {
                }
                else {
                    spawnArray.push(cell);
                }
            }
            else if (c === 0 || c === numberOfColumns -1) {
                if (cell.object && cell.contents !== 'trap') {
                }
                else {
                    spawnArray.push(cell);
                }
            }
        }
    }
    // Spawn first enemy
    var spawn = spawnArray[randomNumber(0,spawnArray.length - 1)];
    getEnemy(spawn.row,spawn.col);
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


// Select a random enemy from the bestiary
function getEnemy(row,col) {
    var monster = bestiary[randomNumber(0,bestiary.length - 1)];
    if (monster.weight + totalWeight <= maxWeight) {
        addEnemy(row,col,monster);
    }
    else if (maxWeight - totalWeight <= 20) {

    }
    else {
        getEnemy(row,col);
    }
}


// Flash the warning icon when an enemy is spawning
function enemyWarning() {
    var warning = document.getElementById('warning');
        warning.src = 'img/gui/warning.svg';
        warning.style.animation = 'warning 2.5s 1';
        setTimeout(function() {
            warning.style.animation = '';
        }, 2500);
}


// My Monster Manual
var bestiary = [
    {
        type: 'Gelatinous Cube',
        image: 'cube-green.gif',
        damage: 10,
        health: 50,
        weight: 25,
        evasion: 5,
        moveInterval: 2100,
        moveSpeed: 2,
        ability: 'acid',
        abilityDamge: 5,
        abilityDuration: 5500,
        abilityChance: 100,
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Giant Spider',
        image: 'spider.gif',
        damage: 10,
        health: 65,
        weight: 35,
        evasion: 15,
        moveInterval: 2000,
        moveSpeed: 0.35,
        ability: 'web',
        abilityDamge: 0,
        abilityDuration: 12000,
        abilityChance: 10,
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Number Mage',
        image: 'number-mage.gif',
        damage: 5,
        health: 85,
        weight: 35,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 0.5,
        ability: 'rotate',
        abilityDamge: 0,
        abilityDuration: 10000,
        abilityChance: 80,
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Oculord',
        image: 'oculord.gif',
        damage: 15,
        health: 100,
        weight: 50,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 2.5,
        ability: 'projectile',
        abilityImage: ['projectile-fire.gif', 'projectile-ice.gif'],
        abilityDamge: 15,
        abilityDuration: 0.45,
        abilityChance: 70,
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Vampire',
        image: 'vampire.gif',
        damage: 15,
        health: 125,
        weight: 60,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 1,
        ability: 'invisibility',
        abilityImage: 'vampire-shadow.gif',
        abilityDamge: 0.5,
        abilityDuration: 10000,
        abilityChance: 70,
        info: 'Description of the monster goes here.'
    }
]


// Spawn an enemy and apply some data to it
function addEnemy(row,col,monster) {
    enemyWarning();
    numberOfEnemies++;
    totalWeight += monster.weight;
    // Create new enemy object and push to array of enemies
    var enemy = {};
    enemy.id = 'enemy-container' + numberOfEnemies;
    enemy.enemy = true;
    enemy.type = monster.type;
    enemy.image = monster.image;
    enemy.top = (row * cellSize) - cellSize;
    enemy.left = (col * cellSize) - cellSize;
    enemy.row = row;
    enemy.col = col;
    enemy.location = 'r' + row + 'c' + col;
    enemy.gameLevel = hero.gameLevel;
    enemy.canMove = true;
    enemy.health = monster.health;
    enemy.armorRating = 1;
    enemy.attackRating = 1;
    enemy.baseDamage = monster.damage;
    enemy.evasion = monster.evasion;
    enemy.weight = monster.weight;
    enemy.moveInterval = monster.moveInterval;
    enemy.moveSpeed = monster.moveSpeed;
    enemy.ability = monster.ability;
    enemy.abilityDamge = monster.abilityDamge;
    enemy.abilityDuration = monster.abilityDuration;
    enemy.abilityChance = monster.abilityChance;
    enemy.invisible = false;
    if (monster.abilityImage) {
        enemy.abilityImage = monster.abilityImage;
    }
    // Check if monster has been encountered before
    if (options.enemiesEncountered.indexOf(monster.type) == -1) {
        options.enemiesEncountered.unshift(monster.type);
        options.newEnemies++;
        localStorage.setItem('options', JSON.stringify(options));
    }
    if (enemies !== null) {
        enemies.push(enemy);
    }
    else {
        resetAll();
        return;
    }
    // Create DOM element for enemy
    var createEnemy = document.createElement('div');
        createEnemy.classList.add('enemy');
        createEnemy.id = enemy.id;
        createEnemy.style.width = cellSize + 'px';
        createEnemy.style.height = cellSize + 'px';
        createEnemy.style.backgroundImage = 'url("img/enemies/enemy-shadow.png")';
        createEnemy.style.top = '0';
        createEnemy.style.left = '0';
        createEnemy.style.transitionDuration = '0';
    var message = document.createElement('span');
        message.className = 'message';
        message.innerHTML = '';
        createEnemy.appendChild(message);
    var enemyImage = document.createElement('img');
        enemyImage.src = 'img/enemies/' + enemy.image;
        createEnemy.appendChild(enemyImage);
        levelContainer.appendChild(createEnemy);
    var enemyContainer = document.getElementById(enemy.id);
    // Insert the enemy onto one of the outside squares
    if (enemy.row === 1) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + '-' + cellSize + 'px)';
        enemyContainer.style.transition = enemy.moveSpeed + 's ease';
    }
    else if (enemy.row === numberOfRows) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + (enemy.top + cellSize) + 'px)';
        enemyContainer.style.transition = enemy.moveSpeed + 's ease';
    }
    else if (enemy.row !== 1 || enemy.row !== numberOfRows) {
        if (enemy.col === 1) {
            enemyContainer.style.transform = 'translate(-' + cellSize + 'px, ' + enemy.top + 'px)';
            enemyContainer.style.transition = enemy.moveSpeed + 's ease';
        }
        else if (enemy.col === numberOfColumns) {
            enemyContainer.style.transform = 'translate(' + (enemy.left + cellSize) + 'px, ' + enemy.top + 'px)';
            enemyContainer.style.transition = enemy.moveSpeed + 's ease';
        }
    }
    // Move enemy in from outside of map
    setTimeout(function() {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        // Add to map data
        if (map !== null) {
            map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
        }
        actionInterval();
    }, 2000);

    // Spawn another enemy at a random interval
    var spawnInterval = randomNumber(2000,7000);
    var monsterSpawn = setInterval(function() {
        if (map === null || map.length === 0) {
            clearInterval(monsterSpawn);
        }
        else if (totalWeight < maxWeight) {
            clearInterval(monsterSpawn);
            var spawn = spawnArray[randomNumber(0,spawnArray.length - 1)];
            getEnemy(spawn.row,spawn.col);
        }
    }, spawnInterval);

    // Perform actions at set intervals depending on monster moveInterval
    function actionInterval() {
        var interval = setInterval(function() {
            // Destroy any stowaways trying to sneak into the next level
            if (enemy.gameLevel !== hero.gameLevel) {
                console.log('i shouldnt be here');
                clearTimeout(interval);
                enemy = null;
                delete enemy;
            }
            else if (map === null || hero === null) {
                console.log('null map: ' + enemy);
                clearTimeout(interval);
                enemy = null;
                delete enemy;
            }
            else {
                // Award XP on death, then destroy
                if (enemy.health <= 0) {
                    clearTimeout(interval);
                    awardXp(enemy);
                    totalWeight -= enemy.weight;
                    hero.enemiesSlain++;
                    enemy = null;
                    delete enemy;
                    delete enemyContainer;
                }
                // If options menu open, pause movement
                else if (hero.pause === true) {
                }
                // Roll chance to use special ability, then perform an action
                else if (enemy.health >= 0) {
                    var useAbility = randomNumber(1,100);
                    if (useAbility <= enemy.abilityChance) {
                        if (enemy.ability === 'acid' || enemy.ability === 'web') {
                            layTrap(enemy);
                        }
                        else if (enemy.ability === 'rotate') {
                            rotateEquation(enemy);
                        }
                        else if (enemy.ability === 'projectile') {
                            enemyProjectile(enemy,enemyContainer);
                        }
                        else if (enemy.ability === 'invisibility' && enemy.invisible === false) {
                            turnInvisible(enemy,enemyContainer);
                        }
                    }
                    getMovementDirection(enemy,enemyContainer,'passive');
                }
                else {
                    clearTimeout(interval);
                    totalWeight = 0;
                    enemy = null;
                    delete enemy;
                    delete enemyContainer;
                }
            }
        }, enemy.moveInterval);
    }
}


// Allow vampires to temporarily turn mostly invisible
function turnInvisible(enemy,enemyContainer) {
    enemy.invisible = true;
    enemy.evasion = 50;
    enemyContainer.lastChild.style.opacity = '0';
    // Drain health if invisible and within range
    var interval = setInterval(function() {
        if (enemy.health <= 0) {
            clearInterval(interval);
        }
        else if (enemy.invisible) {
            if (Math.abs(hero.row - enemy.row) <= 1 && Math.abs(hero.col - enemy.col) <= 1) {
                dealDamage(enemy.abilityDamge,enemy);
            }
        }
        else {
            clearInterval(interval);
        }
    }, 250);
    setTimeout(function() {
        enemy.invisible = false;
        enemy.evasion = 0;
        enemyContainer.lastChild.style.opacity = '1';
    }, enemy.abilityDuration);
}


// Allow enemies to shoot stuff at you
function enemyProjectile(enemy,enemyContainer) {
    // Fire in a random direction
    var directions = ['up','down','left','right'];
    var direction = directions[randomNumber(0,3)];
    // Create the projectile element
    var spawn = enemyContainer.getBoundingClientRect();
    var object = document.createElement('img');
    var type = enemy.abilityImage[randomNumber(0,enemy.abilityImage.length - 1)];
        object.src = 'img/enemies/' + type;
        object.id = 'projectile' + randomNumber(1,1000);
        object.classList.add('projectile');
        object.style.width = cellSize + 'px';
        object.style.height = cellSize + 'px';
        object.style.top = enemy.top + 'px';
        object.style.left = enemy.left + 'px';
        // Rotate it to match the direction it is being fired in
        if (direction === 'down') { object.style.transform = 'rotate(180deg)'; }
        else if (direction === 'left') { object.style.transform = 'rotate(-90deg)'; }
        else if (direction === 'right') { object.style.transform = 'rotate(90deg)'; }
        levelContainer.appendChild(object);
    var projectile = document.getElementById(object.id);

    if (direction === 'up') {
        var distance = levelContainer.clientHeight + cellSize;
        var speed = numberOfRows * enemy.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(-' + distance + 'px)';
    }
    else if (direction === 'down') {
        var distance = levelContainer.clientHeight + cellSize;
        var speed = numberOfRows * enemy.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(' + distance + 'px) rotate(180deg)';
    }
    else if (direction === 'left') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateX(-' + distance + 'px) rotate(-90deg)';
    }
    else if (direction === 'right') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateX(' + distance + 'px) rotate(90deg)';
    }
    var canHit = true;
    // Check for collisions
    var interval = setInterval(function() {
        var projectilePos = projectile.getBoundingClientRect();
        var playerPos = player.getBoundingClientRect();
        if (Math.abs(projectilePos.top - playerPos.top) <= (cellSize * 0.85) &&
            Math.abs(projectilePos.left - playerPos.left) <= (cellSize * 0.85) &&
            canHit) {
            if (randomNumber(1,100) > hero.evasion) {
                // Check for projectile type
                type = type.split('-').pop().split('.').shift();
                if (type === 'ice') {
                    freezePerson(hero,enemy.moveInterval,'ice');
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else {
                    flashHitImage(hero,player);
                    dealDamage(enemy.abilityDamge,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
            }
            // Make player immune to damage until projectile leaves the current cell
            else {
                canHit = false;
                flashMessage(hero,'evaded!');
                hero.attacksEvaded++;
                var safeTime = enemy.abilityDuration * 1250;
                setTimeout(function() {
                    canHit = true;
                }, safeTime);
            }
        }
        // Check if there is a column collision
        for (var i = 0; i < columnPositions.length; i++) {
            if (Math.abs(projectilePos.top - columnPositions[i].top) <= (cellSize * 0.85) &&
            Math.abs(projectilePos.left - columnPositions[i].left) <= (cellSize * 0.85) &&
            canHit) {
                clearInterval(interval);
                projectile.style.display = 'none';
            }
        }
    }, 250);
    // Wait until the projectile is off screen, then remove it
    setTimeout(function() {
        clearInterval(interval);
        projectile.remove();
    }, speed * 1000);
}


// Allow enemies to rotate the equations
function rotateEquation(enemy) {
    var location = map[enemy.row - 1][enemy.col - 1];
    if (location.hasOwnProperty('answer') && location.answer !== 'captured') {
        var cell = document.querySelector('#' + enemy.location + ' p');
            cell.style.transition = '1s';
            cell.style.transform = 'rotate(180deg)';
            cell.style.color = '#E22727';
        setTimeout(function() {
            cell.style.transform = 'rotate(0deg)';
            cell.style.color = '#fff';
        }, enemy.abilityDuration);
    }
}


// Allow enemies to lay temporary traps
function layTrap(enemy) {
    var mapLocation = map[enemy.row - 1][enemy.col - 1];
    var cell = document.getElementById(enemy.location);
    if (mapLocation.contents === 'trap') {

    }
    else if (mapLocation.contents !== 'trap') {
        var original = mapLocation.contents;
        var originalDmg = mapLocation.trapDamage;
            mapLocation.contents = 'trap';
            mapLocation.trapType = enemy.ability;
            mapLocation.trapDamage = enemy.abilityDamge;
        var trap = document.createElement('img');
            trap.src = 'img/objects/' + enemy.ability + '-' + randomNumber(1,2) + '.gif';
            trap.opacity = '0';
            trap.style.animation = 'img-fade-in 1s 1';
            cell.appendChild(trap);

        setTimeout(function() {
            trap.style.animation = 'img-fade-out 1s 1 forwards';
            mapLocation.contents = original;
            mapLocation.trapType = '';
            mapLocation.trapDamage = originalDmg;
            setTimeout(function() {
                trap.style.display = 'none';
                cell.removeChild(trap);
            }, 1000);
        }, enemy.abilityDuration);
    }
}


// Determine which direction to move in
function getMovementDirection(enemy,enemyContainer,movementType) {
    var directions = ['up','down','left','right'];
    var hasAttacked = false;
    // Passive enemies have a lower chance to target you
    if (movementType === 'passive') {
        var chanceToAttack = 40;
    }
    // A future aggressive AI will be more... aggressive
    else {
        var chanceToAttack = 80;
    }

    // If on top row, do not move up
    if (enemy.row === 1) {
        var index = directions.indexOf('up');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 2][enemy.col - 1];
        // If the player is above them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('up',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy || mapLocation.hero)  {
                var index = directions.indexOf('up');
                    directions.splice(index, 1);
            }
        }
    }

    // If on bottom row, do not move down
    if (enemy.row === numberOfRows) {
        var index = directions.indexOf('down');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row][enemy.col - 1];
        // If the player is below them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('down',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy || mapLocation.hero)  {
                var index = directions.indexOf('down');
                    directions.splice(index, 1);
            }
        }
    }

    // If on left most column, do not move left
    if (enemy.col === 1) {
        var index = directions.indexOf('left');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 1][enemy.col - 2];
        // If the player is left of them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('left',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy || mapLocation.hero)  {
                var index = directions.indexOf('left');
                    directions.splice(index, 1);
            }
        }
    }

    // If on right most column, do not move right
    if (enemy.col === numberOfColumns) {
        var index = directions.indexOf('right');
            directions.splice(index, 1);
    }
    else {
        var mapLocation = map[enemy.row - 1][enemy.col];
        // If the player is right of them, roll for attack chance
        if (mapLocation.hero && randomNumber(1,100) <= chanceToAttack) {
            checkForAttack('right',hero,enemy);
            hasAttacked = true;
        }
        // If location is blocked or contains an enemy
        else {
            if (mapLocation.contents === 'blocked' || mapLocation.enemy || mapLocation.hero)  {
                var index = directions.indexOf('right');
                    directions.splice(index, 1);
            }
        }
    }

    if (movementType === 'passive' && hasAttacked === false) {
        moveEnemyPassive(enemy,enemyContainer,directions);
    }
}


// Random movement
function moveEnemyPassive(enemy,enemyContainer,directions) {
    var move = directions[randomNumber(0,directions.length - 1)];

    // MOVE UP
    if (move === 'up') {
        var mapLocation = map[enemy.row - 2][enemy.col - 1];
        map[enemy.row - 1][enemy.col - 1].enemy = false;
        enemy.top -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row--;
        map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
    }

    // MOVE DOWN
    else if (move === 'down') {
        var mapLocation = map[enemy.row][enemy.col - 1];
        map[enemy.row - 1][enemy.col - 1].enemy = false;
        enemy.top += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row++;
        map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
    }

    // MOVE LEFT
    else if (move === 'left') {
        var mapLocation = map[enemy.row - 1][enemy.col - 2];
        map[enemy.row - 1][enemy.col - 1].enemy = false;
        enemy.left -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col--;
        map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
    }

    // MOVE RIGHT
    else if (move === 'right') {
        var mapLocation = map[enemy.row - 1][enemy.col];
        map[enemy.row - 1][enemy.col - 1].enemy = false;
        enemy.left += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col++;
        map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
    }
    enemy.location = 'r' + enemy.row + 'c' + enemy.col;
}


// Calculate accuracy of input answers
function getAccuracy(right,wrong) {
    if (right !== 0 || wrong !== 0) {
        return Math.floor((right / (right + wrong)) * 100) + '&#37;';
    }
    else {
        return '--';
    }
}

// Random number generator within a range
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}