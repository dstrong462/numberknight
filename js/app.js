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

var chanceToSpawnTrap = 100;
var backgrounds = 2;
var tilesets = 2;
var empty = 6;
var traps = ['fire-grate','spikes'];
var junk = 10;

//////////////////////////////////////


// Check if there is already an options file
if (localStorage.getItem('options') === null) {
    // If not, then create a blank one
    options = {
        soundfx: true,
        music: true,
        enemiesEncountered: [],
        newEnemies: 0
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
            if (e.target.parentElement.parentElement.id === 'title-screen') {
                document.querySelector('#options-menu button').style.display = 'none';
            }
            else if (e.target.parentElement.id === 'top-bar') {
                document.querySelector('#options-menu button').style.display = 'inline-block';
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
// When returning to the main menu, rotate the display back
var mainMenuButton = document.getElementById('btn-main-menu');
    mainMenuButton.addEventListener('click', function() {
        var screen = document.querySelector('.flipper');
            screen.style.transform = 'rotateY(0deg)';
    });
// When ready to play, get the play name and selected difficulties
var playButton = document.getElementById('btn-play');
    playButton.addEventListener('click', function() {
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
            startGame();
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


// Start Game
function startGame(fadeIn) {
    fadeOut();
    setTimeout(function() {
        generateLevel();
        document.querySelector('.flipper').style.transform = 'rotateY(0deg)';
        document.querySelector('.flip-container').style.display = 'none';
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
    setTimeout(function() {
        letTheGamesBegin();
    }, 2500);
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
        fade.style.animation = 'fade-out 1s 1';
}

// Fade back in
function fadeIn() {
    var fade = document.getElementById('fade-to-black');
        fade.style.animation = 'fade-in 1s 0.5s 1';
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
    // Cycle through each row
    for (var r = 1; r <= numberOfRows; r++) {
        var newRow = [];
        var row = '';
            row += 'r' + r;
        // Cycle through each column
        for (var c = 1; c <= numberOfColumns; c++) {
            var col = '';
                col += 'c' + c;
            var location = '';
                location += row + col;
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
    randomizeColumns(2);
    randomizeTraps(4);
}


// Randomize columns
function randomizeColumns(number) {
    for (var i = 0; i < number; i++) {
        var cell = randomCell();
        var object = map[cell[0]][cell[1]];
        object.object = 'junk-' + randomNumber(1,junk);
        object.tile = 'empty';
        object.contents = 'blocked';
        object.health = 30;
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


// Build grid one row at a time
function buildGrid() {
    for (var i = 0; i < numberOfRows; i++) {
        buildRow(i);
    }
    // Add shadow class to first row
    document.querySelector('#level-container .row').id = 'shadow-top';
    // Level exit
    levelExit = document.getElementById(exit.location);
    var cover = document.createElement('img');
        cover.src = 'img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif'; 
        cover.style.width = '100%';
        cover.style.height = '100%';
        levelExit.appendChild(cover);
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
                cell.appendChild(object);
            }
        newRow.appendChild(cell);
    }
    levelContainer.appendChild(newRow);
}


// Grab the content value of the desired cell and apply the appropriate graphic
function applyTileset(e) {
    var tile = e.tile;
    if (tile === 'empty') {
        var tileset = 'url("img/tiles/' + tilesetNumber + '/empty' + randomNumber(1,empty) + '.gif")'; 
    }
    else {
        var tileset = 'url("img/' + tile + '.gif")';
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
    if (hero.gameLevel % 3 === 0) {
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
            awardXp('level');
            startGame();
        }
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
                // Flash hit image
                if (victim.hasOwnProperty('id')) {
                    victimContainer.classList.add('hit');
                    setTimeout(function() {
                        victimContainer.classList.remove('hit');
                    }, 350);
                }
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
                        victim.contents = 'empty';
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
                        }
                    }
                }
            }
        }
        else if (victim === hero) {
            console.log('attack evaded');
            hero.attacksEvaded++;
        }
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
        }
        youDied(deathBy);
    }
    else {
        healthBar.style.width = hero.health + '%';
    }
}


// Freeze anyone who walks through ice for set number of seconds
function freezePerson(person,duration) {
    person.canMove = false;
    setTimeout(function() { 
        person.canMove = true; 
    }, duration);
}


// If stepping on a trapped tile deal damage
function checkForTraps() {
    var location = map[hero.row - 1][hero.col - 1];
    // Check against hero % chance to evade traps
    if (randomNumber(1,100) < hero.evasion) {
        hero.trapsEvaded++;
    }
    else {
        if (location.contents === 'trap' && location.tile === 'ice') {
            var duration = 3000;
            freezePerson(hero,duration);
        }
        else if (location.trapType === 'web') {
            var duration = 4000;
            freezePerson(hero,duration);
        }
        else if (location.contents === 'trap') {
            dealDamage(location.trapDamage,'trap');
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
        resetAll();
        titleButtons();
        setTimeout(function() {
            fadeIn();
        }, 500);
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

                ]
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
    // Spawn enemies at an interval
    var interval = setInterval(function() {
        if (map === null) {
            clearTimeout(interval);
        }
        else if (map.length === 0) {
            clearTimeout(interval);
        }
        else if (totalWeight < maxWeight) {
            var spawn = randomMonsterSpawn();
            getEnemy(spawn.row,spawn.col);
        }
    }, 5000);
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


// Select a random location on the outside of the map
function randomMonsterSpawn() {
    var randomRow = randomNumber(1,numberOfRows);
    if (randomRow === 1 || randomRow === numberOfRows) {
        var randomCol = randomNumber(1,numberOfColumns);
    }
    else {
        var number = randomNumber(0,1);
        if (number === 0) {
            var randomCol = 1;
        }
        else {
            var randomCol = numberOfColumns;
        }
    }
    return { row: randomRow, col: randomCol }
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
        evasion: 0,
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
        damage: 15,
        health: 65,
        weight: 35,
        evasion: 0,
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
        evasion: 0,
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
        evasion: 0,
        moveInterval: 3000,
        moveSpeed: 2.5,
        ability: 'projectile',
        abilityImage: ['projectile-fire.gif', 'projectile-ice.gif'],
        abilityDamge: 20,
        abilityDuration: 0.5,
        abilityChance: 100,
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
    if (monster.abilityImage) {
        enemy.abilityImage = monster.abilityImage;
    }
    // Check if monster has been encountered before
    if (options.enemiesEncountered.indexOf(monster.type) == -1) {
        options.enemiesEncountered.unshift(monster.type);
        options.newEnemies++;
        localStorage.setItem('options', JSON.stringify(options));
    }
    enemies.push(enemy);
    // Add to map data
    map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
    // Create DOM element for enemy
    var createEnemy = document.createElement('div');
        createEnemy.classList.add('enemy');
        createEnemy.id = enemy.id;
        createEnemy.style.width = cellSize + 'px';
        createEnemy.style.height = cellSize + 'px';
        createEnemy.style.backgroundImage = 'url("img/enemies/' + enemy.image + '")';
        createEnemy.style.top = '0';
        createEnemy.style.left = '0';
        createEnemy.style.transitionDuration = '0';
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
    setTimeout(function() {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        actionInterval();
    }, 2000);

    // Perform actions at set intervals depending on monster moveInterval
    function actionInterval() {
        var interval = setInterval(function() {
            // Destroy any stowaways trying to sneak into the next level
            if (hero === null) {
                enemy = null;
                clearTimeout(interval);
            }
            else if (enemy.gameLevel !== hero.gameLevel) {
                enemy = null;
                clearTimeout(interval);
            }
            // Award XP on death, then destroy
            else if (enemy.health <= 0 && enemy.gameLevel === hero.gameLevel) {
                awardXp(enemy);
                totalWeight -= enemy.weight;
                hero.enemiesSlain++;
                enemy = null;
                delete enemy;
                delete enemyContainer;
                clearTimeout(interval);
            }
            // If options menu open, pause movement
            else if (hero.pause === true) {
            }
            // Roll chance to use special ability, then perform an action
            else if (enemy.health >= 0 && enemy.gameLevel === hero.gameLevel && map !== null) {
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
                }
                moveEnemyPassive(enemy,enemyContainer);
            }
            else {
                totalWeight = 0;
                enemy = null;
                delete enemy;
                delete enemyContainer;
                clearTimeout(interval);
            }
        }, enemy.moveInterval);
    }
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
                    freezePerson(hero,enemy.moveInterval);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else {
                    dealDamage(enemy.abilityDamge,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
            }
            // Make player immune to damage until projectile leaves the current cell
            else {
                canHit = false;
                hero.attacksEvaded++;
                var safeTime = enemy.abilityDuration * 1250;
                setTimeout(function() {
                    canHit = true;
                }, safeTime);
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
        setTimeout(function() {
            cell.style.transform = 'rotate(0deg)';
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


// Random movement
function moveEnemyPassive(enemy,enemyContainer) {
    var move = randomNumber(0,3);
    // MOVE UP
    if (move === 0) {
        if (enemy.row === 1) {

        }
        else {
            var mapLocation = map[enemy.row - 2][enemy.col - 1];
            if (enemy.canMove && enemy.top >= cellSize && mapLocation.contents !== 'blocked' && mapLocation.hero === false && mapLocation.enemy === false) {
                map[enemy.row - 1][enemy.col - 1].enemy = false;
                enemy.top -= cellSize;
                enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
                enemy.row--;
                map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
            }
            else if (mapLocation.hero) {
                checkForAttack('up',hero,enemy);
            }
        }
    }
    // MOVE DOWN
    else if (move === 1) {
        if (enemy.row === numberOfRows) {

        }
        else {
            var mapLocation = map[enemy.row][enemy.col - 1];
            if (enemy.canMove && enemy.top <= (numberOfRows - 1) * cellSize && mapLocation.contents !== 'blocked' && mapLocation.hero === false && mapLocation.enemy === false) {
                map[enemy.row - 1][enemy.col - 1].enemy = false;
                enemy.top += cellSize;
                enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
                enemy.row++;
                map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
            }
            else if (mapLocation.hero) {
                checkForAttack('down',hero,enemy);
            }
        }
    }
    // MOVE LEFT
    else if (move === 2) {
        if (enemy.col === 1) {

        }
        else {
            var mapLocation = map[enemy.row - 1][enemy.col - 2];
            if (enemy.canMove && enemy.left >= cellSize && mapLocation.contents !== 'blocked' && mapLocation.hero === false && mapLocation.enemy === false) {
                map[enemy.row - 1][enemy.col - 1].enemy = false;
                enemy.left -= cellSize;
                enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
                enemy.col--;
                map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
            }
            else if (mapLocation.hero) {
                checkForAttack('left',hero,enemy);
            }
        }
    }
    // MOVE RIGHT
    else if (move === 3) {
        if (enemy.col === numberOfColumns) {

        }
        else {
            var mapLocation = map[enemy.row - 1][enemy.col];
            if (enemy.canMove && enemy.left <= (numberOfColumns - 1) * cellSize && mapLocation.contents !== 'blocked' && mapLocation.hero === false && mapLocation.enemy === false) {
                map[enemy.row - 1][enemy.col - 1].enemy = false;
                enemy.left += cellSize;
                enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
                enemy.col++;
                map[enemy.row - 1][enemy.col - 1].enemy = enemy.id;
            }
            else if (mapLocation.hero) {
                checkForAttack('right',hero,enemy);
            }
        }
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

// Because I keep accidentally calling 'random' instead of 'randomNumber' and staring at
// the screen blankly for 10 minutes until I realize why my browser keeps crashing
function random(min, max) {
    alert('use randomNumber, dumbass!');
    return Math.floor(Math.random() * (max - min + 1) + min);
}