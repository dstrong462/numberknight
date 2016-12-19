/////////////// STARTUP ///////////////

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
        version: newestVersion,
        newgame: true,
        tutorial: true,
        endgame: false,
        soundfx: true,
        music: true,
        enemiesEncountered: [],
        newEnemies: 0,
        gold: 0,
        avatars: ['hero'],
        storeItems: [
            {
                id: 'avatars-01',
                type: 'avatars',
                item: 'Elite Knights',
                cost: 300,
                imagePath: 'img/avatars/',
                images: ['roman-gold','roman-silver'],
                owned: false
            },
            {
                id: 'avatars-02',
                type: 'avatars',
                item: 'Wolf Rangers',
                cost: 150,
                imagePath: 'img/avatars/',
                images: ['wolf-grey','wolf-brown'],
                owned: false
            }
        ]
    };
    localStorage.setItem('options', JSON.stringify(options));
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

// Prevent dimensions from being retrieved before the window has loaded
var screenInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(screenInterval);
        getDimensions();
    }
}, 500);

function getDimensions() {
    // Get display width
    screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    // Max screen width for desktop viewing
    if (screenWidth > maxScreenWidth) { screenWidth = maxScreenWidth; }

    // Allow more columns for larger screen sizes
    if (screenWidth >= maxScreenWidth) {
        numberOfColumns = maxColumns;
    }

    // Get display height
    screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    screenWidth = screenWidth - (reservedSides * 2);

    cellSize = Math.floor(screenWidth / numberOfColumns);

    numberOfRows = Math.floor((screenHeight - reservedSpace) / cellSize);
    if (numberOfRows > maxRows) { numberOfRows = maxRows; }
    totalCells = numberOfColumns * numberOfRows;

    // Resize UI to match grid size
    cellFontSize = cellSize / 5 + 'px';
    uiWidth = (numberOfColumns * cellSize) + 'px';
    topBar = document.getElementById('top-bar');
    topBar.style.width = uiWidth;
    bottomBar = document.getElementById('bottom-bar');
    bottomBar.style.width = uiWidth;

    optionsPosition = 'closed';
    levelContainer = document.getElementById('level-container');
    levelContainer.style.width = numberOfColumns * cellSize + 'px';
    heroContainer = document.getElementById('hero-container');
    player = document.getElementById('hero');
    player.addEventListener('click', checkMath);
    healthBar = document.getElementById('health');
    timeBar = document.getElementById('time');
    xpBar = document.getElementById('xp');

    // Settings for tutorial
    tutorialData = {
        proceed: false,
        tilesetOutside: 9,
        tilesetInside: 6,
        exitLocation: [numberOfRows - 1, 2],
        numDebris: 2,
        numColumns: 2,
        numTraps: 2,
        objectTheme: themes[1],
        wallTileset: 5,
        wallLocation: [[1,1],[1,numberOfColumns - 2]],
        trapLocation: [[numberOfRows - 2,1],[numberOfRows - 2,numberOfColumns - 2]],
        heroTop: cellSize * 3,
        heroLeft: cellSize * 2,
        heroRow: 4,
        heroCol: 3,
        heroLocation: 'r4c3',
        gameMode: 'multiples',
        target: 10,
    };
}