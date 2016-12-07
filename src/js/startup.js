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
        newgame: true,
        tutorial: true,
        endgame: false,
        soundfx: true,
        music: true,
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
if (cellSize > maxiumumCellWidth) {
    cellSize = maxiumumCellWidth;
}

var numberOfRows = Math.floor((screenHeight - reservedSpace) / cellSize);
if (numberOfRows > maxRows) { numberOfRows = maxRows; }
var totalCells = numberOfColumns * numberOfRows;

// Resize UI to match grid size
var uiWidth = (numberOfColumns * cellSize) + 'px';
var topBar = document.getElementById('top-bar');
    topBar.style.width = uiWidth;
var bottomBar = document.getElementById('bottom-bar');
    bottomBar.style.width = uiWidth;

var optionsPosition = 'closed';
var levelContainer = document.getElementById('level-container');
    levelContainer.style.width = numberOfColumns * cellSize + 'px';
var heroContainer = document.getElementById('hero-container');
var player = document.getElementById('hero');
    player.addEventListener('click', checkMath);
var healthBar = document.getElementById('health');
var timeBar = document.getElementById('time');
var xpBar = document.getElementById('xp');