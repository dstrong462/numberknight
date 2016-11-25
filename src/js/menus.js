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
            options.newgame = false;
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
var gamemodesButton = document.getElementById('btn-gamemodes');
    gamemodesButton.addEventListener('click', showGamemodes);

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
            options.newgame = true;
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
    returnToMainMenu.addEventListener('click', function() {
        fadeToMainMenu(fadeIn);
    });

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