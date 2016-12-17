/////////////// CUSTOMIZATION ///////////////

var maxScreenWidth = 768;
var numberOfColumns = 5;
var maxColumns = 7;
var maxRows = 9;
// Amount of screen space to be saved for the UI in pixels
var reservedSpace = 150;
// Side wall in pixels
var reservedSides = 15;
// Minimum percentage of correct answers per level
var correctMinThreshold = 25;
var correctMaxThreshold = 60;

// Customize variables for restoration
var healthRestoreFromCapture = 1;
var timeRestoreFromCapture = 3;
var timeLostFromWrongAnswer = 0;
var defaultTimer = 60;

// Customize variables for damage
var heroBaseDamage = 25;
var damageFromWrongAnswer = 20;
var damageFromTraps = 15;
// Playing with a keyboard is much easier, so if they use a keyboard, make enemies harder
var keyboardPlayer = false;
var keyboardDamageModifier = 1.5;

var chanceToSpawnTrap = 80;
var backgrounds = 2;
var tilesets = 10;
var walls = 16;
var empty = 6;
var traps = ['fire-grate','spikes'];
var trapsToBuild = [];
var debrisToBuild;
var columnsToBuild;
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
// Chance to spawn that sweet loot
var lootChance = 50;

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

var gameMode = ['multiples','factors','primes','equality'];
var challengeMode = ['ascending','descending'];

var maxWeight = 0;
var totalWeight = 0;
var numberOfEnemies = 0;
var maxEnemies = 0;
var enemies = [];
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
        version: 20161215,
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
                cost: 100,
                imagePath: 'img/avatars/',
                images: ['roman-gold','roman-silver'],
                owned: false
            },
            {
                id: 'avatars-02',
                type: 'avatars',
                item: 'Wolf Rangers',
                cost: 100,
                imagePath: 'img/avatars/',
                images: ['wolf-grey','wolf-brown'],
                owned: false
            }
        ]
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

// Get display width
var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

// Max screen width for desktop viewing
if (screenWidth > maxScreenWidth) { screenWidth = maxScreenWidth; }

// Allow more columns for larger screen sizes
if (screenWidth >= maxScreenWidth) {
    numberOfColumns = maxColumns;
}

// Get display height
var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

screenWidth = screenWidth - (reservedSides * 2);

var cellSize = Math.floor(screenWidth / numberOfColumns);

var numberOfRows = Math.floor((screenHeight - reservedSpace) / cellSize);
if (numberOfRows > maxRows) { numberOfRows = maxRows; }
var totalCells = numberOfColumns * numberOfRows;

// Resize UI to match grid size
var cellFontSize = cellSize / 5 + 'px';
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
/////////////// MENUS ///////////////

var avatarSelection = 'hero';

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
            // Check if player has unlocked avatars
            var avatarSelector = document.getElementById('avatar-selector');
                avatarSelector.style.display = 'none';
            if (options.avatars.length > 1) {
                avatarSelector.style.display = 'flex';
                // Set buttons
                var left = document.getElementById('avatar-left');
                    left.addEventListener('click', function() {
                        changeAvatar('left');
                    });
                var right = document.getElementById('avatar-right');
                    right.addEventListener('click', function() {
                        changeAvatar('right');
                    });
                var avatar = document.getElementById('selected-avatar');
                    avatar.src = 'img/avatars/hero.gif';
                    avatarSelection = 'hero';

                // Use arrows to change to selected avatar
                function changeAvatar(direction) {
                    var position = options.avatars.indexOf(avatarSelection);
                    // Loop back around
                    if (position === 0 && direction === 'left') {
                        position = options.avatars.length - 1;
                    }
                    else if (position === options.avatars.length - 1 && direction === 'right') {
                        position = 0;
                    }
                    else if (position > 0 && direction === 'left') {
                        position--;
                    }
                    else if (position < options.avatars.length - 1 && direction === 'right') {
                        position++;
                    }
                    else {
                        position = 0;
                    }
                    avatarSelection = options.avatars[position];
                    avatar.src = 'img/avatars/' + avatarSelection + '.gif';
                }
            }
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

    // Allow user to disable tutorial from showing on starting a new game
    var tutorialCheckbox = document.getElementById('enable-tutorial');
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
    // Display Fallen Heroes button if there are any
    if (fallenHeroes.length > 0) {
        document.getElementById('btn-fallen-heroes').style.display = 'flex';
    }
    else {
        document.getElementById('btn-fallen-heroes').style.display = 'none';
    }
    // Display gold total
    if (options.gold > 0) {
        var goldTotal = document.querySelector('.gold-total span');
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
    mathradio[0].checked = true;
    for (var i = 0; i < mathradio.length; i++) {
        mathradio[i].addEventListener('click', adjustDifficulty);
    }
var monsterradio = document.querySelectorAll('#monster-difficulty input');
    monsterradio[0].checked = true;
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
/////////////// BUILD_LISTS ///////////////

var fallenButton = document.getElementById('btn-fallen-heroes');
    fallenButton.addEventListener('click', displayHeroes);

// Display fallen heroes
function displayHeroes() {
    var container = document.getElementById('fallen-heroes');
        container.innerHTML = '';
    var scroll = document.createElement('div');
        scroll.classList.add('scroll');
        container.appendChild(scroll);
    var list = '<h5>Fallen Heroes</h5><br />';
        scroll.innerHTML = list;
        container.style.display = 'flex';
        container.scroll(0,0);
        container.style.opacity = 1;

    var footer = document.createElement('div');
        footer.innerHTML = '<button></button><button id="clearlist"></button>';
        container.appendChild(footer);

    var button = document.querySelector('#fallen-heroes button');
        button.addEventListener('click', function() {
            scroll.remove();
            container.innerHTML = '';
            container.style.display = 'none';
        });
    var trash = document.getElementById('clearlist');
        trash.addEventListener('click', clearList);
    if (fallenHeroes.length === 0) {
        trash.style.display = 'none';
    }

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
                entry += '<span>Floor ' + fallenHeroes[i].gameLevel + '</span></div>';
                if (fallenHeroes[i].death === 'Quest Complete') {
                    entry += '<p class="complete">' + fallenHeroes[i].death + '</p>';
                }
                else {
                    entry += '<p>' + fallenHeroes[i].death + '</p>';
                }
                row.innerHTML = entry;
                scroll.appendChild(row);
            var button = document.getElementById(row.id);
                button.addEventListener('click', function() {
                    var item = button.id.split('-').pop();
                    listFallenStats(fallenHeroes[item],'fallen-heroes');
                });
                row = scroll.lastChild;
                row.style.transition = 'opacity .5s';
                setTimeout(function() {
                    row.style.opacity = '1';
                }, 200);
                i++;
                if (i < fallenHeroes.length) {
                    createList();
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
        document.getElementById('btn-fallen-heroes').style.display = 'none';
    }
}


// Display information about the different game modes
function showGamemodes(e) {
    var tutorial = document.getElementById('tutorial');
        tutorial.innerHTML = '';
        tutorial.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    var scroll = document.createElement('div');
        scroll.classList.add('scroll');
    
    var list = '<h5>Game Modes</h5>';
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
        list += '<div class="row"><button class="btn-back"></button></div>';

        scroll.innerHTML = list;
        tutorial.appendChild(scroll);

    var backButton = document.querySelector('#tutorial .btn-back');
        backButton.addEventListener('click', function() {
            localStorage.setItem('options', JSON.stringify(options));
            tutorial.style.display = 'none';
            tutorial.innerHTML = '';
        });

        tutorial.style.display = 'flex';
        tutorial.scroll(0,0);
        tutorial.style.opacity = '1';
}


// Display bestiary
function displayBestiary() {
    var bestiaryScreen = document.getElementById('bestiary');
        bestiaryScreen.innerHTML = '';
        bestiaryScreen.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    
    var list = '<div class="scroll"><h5>Monster Manual</h5>';

    for (var i = 0; i < options.enemiesEncountered.length; i++) {
        var monster = bestiary.filter(function(monster) {
            return monster.type === options.enemiesEncountered[i];
        })[0];
        if (monster === undefined) {
            var monster = bosses.filter(function(monster) {
                return monster.type === options.enemiesEncountered[i];
            })[0];
        }
        list += '<div class="bestiary">';
        list += '<img src="img/enemies/' + monster.image + '" />';
        list += '<div><h6>' + monster.type + '</h6>';
        list += '<p>' + monster.info + '</p></div></div>';  
    }

    list += '<button class="btn-back"></button></div>';
    bestiaryScreen.innerHTML = list;
    bestiaryScreen.style.height = 'auto';

    var button = document.querySelector('#bestiary button');
        button.addEventListener('click', function() {
            bestiaryScreen.style.display = 'none';
            bestiaryScreen.innerHTML = '';
        });

    bestiaryScreen.style.display = 'flex';
    bestiaryScreen.style.opacity = '1';
    bestiaryScreen.scroll(0,0);

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
    var scroll = document.createElement('div');
        scroll.classList.add('scroll');

    var stats = '<h5>' + hero.name + '</h5>';
        stats += '<img src="img/avatars/' + hero.avatar + '.gif">';
        stats += '<p>Level: <span>' + hero.level + '</span></p>';
        stats += '<p>strength: <span>' + hero.strength + '</span></p>';
        stats += '<p>Dexterity: <span>' + hero.dexterity + '</span></p>';
        stats += '<p>Endurance: <span>' + hero.endurance + '</span></p>';
        stats += '<p>Dungeon Level: <span>' + hero.gameLevel + '</span></p>';
        stats += '<p>Math Difficulty: <span>' + hero.difficultyMath + '</span></p>';
        stats += '<p>Monster Difficulty: <span>' + hero.difficultyMonster + '</span></p>';
        if (hero.death === 'Quest Complete') {
            stats += '<p class="win">' + hero.death + '</p>';
        }
        else {
            stats += '<p class="death">' + hero.death + '</p>';
        }
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
        stats += '<p>Times Poisoned: <span>' + hero.timesPoisoned + '</span></p>';
        scroll.innerHTML = stats;
        gameOverScreen.appendChild(scroll);
        gameOverScreen.style.opacity = '0';
        gameOverScreen.style.display = 'flex';
    if (view === 'game-over') {
        var button = document.createElement('button');
            button.classList.add('main-menu-button');
            button.innerHTML = 'Main Menu';
            button.addEventListener('click', function() {
                fadeToMainMenu(fadeIn);
            });
    }
    else {
        var button = document.createElement('button');
            button.classList.add('btn-back');
            button.addEventListener('click', function() {
                gameOverScreen.style.display = 'none';
            });
    }
    scroll.appendChild(button);
    gameOverScreen.scroll(0,0);

    setTimeout(function() {
        gameOverScreen.style.opacity = '1';
    }, 200);
}


// Display character store
var goldButton = document.querySelector('.gold-total');
    goldButton.addEventListener('click', openStore);

function openStore() {
    var storeScreen = document.getElementById('store');
        storeScreen.innerHTML = '';
        storeScreen.style.opacity = '0';
        storeScreen.style.display = 'none';
        storeScreen.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    var scroll = document.createElement('div');
        scroll.classList.add('scroll');

    var store = '<h5>- Ye Olde Store -</h5><br />';
        store += '<p>Put your hard earned gold to good use with these unlockable items!</p><p>Or don&apos;t. It&apos;s your gold.</p><br />';
        scroll.innerHTML = store;

    // Loop through all items
    for (var i = 0; i < options.storeItems.length; i++) {

        var div = document.createElement('div');
            div.id = options.storeItems[i].id;
            div.classList.add('store-item');
        var title = document.createElement('h6');
            title.innerHTML = options.storeItems[i].item;
            div.appendChild(title);

        for (var j = 0; j < options.storeItems[i].images.length; j++) {
            var image = document.createElement('img');
                image.src = options.storeItems[i].imagePath + options.storeItems[i].images[j] + '.gif';
                div.appendChild(image);
        }
        var br = document.createElement('br');
            div.appendChild(br);
        // If already owned
        if (options.storeItems[i].owned) {
            var button = document.createElement('span');
                button.classList.add('purchased');
                button.innerHTML = 'owned';
        }
        else {
            var button = document.createElement('span');
                button.classList.add('store-button');
                button.innerHTML = '<img src="img/loot/gold-2.gif">' + options.storeItems[i].cost;
                button.addEventListener('click', makeSelection);
        }
        div.appendChild(button);
        scroll.appendChild(div);
        storeScreen.appendChild(scroll);
    }

    setTimeout(function() {
        storeScreen.style.display = 'flex';
        storeScreen.scroll(0,0);
        storeScreen.style.opacity = '1';
    }, 200);

    var selection;

    function makeSelection() {
        selection = this.parentElement.id;
        makePurchase();
    }

    var buttonContainer = document.createElement('div');
        buttonContainer.classList.add('row');
        buttonContainer.style.marginTop = '50px';
        buttonContainer.style.marginBottom = '50px';
    var button = document.createElement('button');
        button.classList.add('btn-back');
        button.addEventListener('click', function() {
            storeScreen.style.display = 'none';
            storeScreen.innerHTML = '';
        });
        buttonContainer.appendChild(button);
        scroll.appendChild(buttonContainer);

        var gold = document.createElement('div');
            gold.classList.add('gold-total');
            gold.classList.add('gold-bottom');
            gold.innerHTML = '<img src="img/loot/gold-5.gif" alt="Gold Total"><span></span>';
        storeScreen.appendChild(gold);

    // Show gold total
    var goldTotal = document.querySelectorAll('.gold-total span');
    for (var i = 0; i < goldTotal.length; i++) {
        goldTotal[i].parentElement.style.display = 'flex';
        goldTotal[i].innerHTML = options.gold.toLocaleString();
    }


    // Purchase items
    function makePurchase() {
        // Get the item from the store
        var item = options.storeItems.filter(function(item) {
            return item.id === selection;
        })[0];
        // Do you even have the money for this?
        if (options.gold >= item.cost) {
            if (confirm('Ready to buy?')) {
                item.owned = true;
                completePurchase(item);
            }
        }
        else {
            alert('Come back when you have enough gold!');
        }
    }

    // Add item to player data
    function completePurchase(item) {
        if (item.type === 'avatars') {
            for (var i = 0; i < item.images.length; i++) {
                options.avatars.push(item.images[i]);
            }
        }
        // Gray out button
        var button = document.querySelector('#' + selection + ' .store-button');
            button.classList.add('purchased');
            button.classList.remove('store-button');
            button.innerHTML = 'owned';
            button.removeEventListener('click', makeSelection);
        // Update gold total and save
        var newTotal = options.gold - item.cost;
        setTimeout(function() {
            var interval = setInterval(function() {
                if (options.gold > newTotal) {
                    options.gold -= 10;
                    for (var i = 0; i < goldTotal.length; i++) {
                        goldTotal[i].innerHTML = options.gold.toLocaleString();
                    }
                }
                else {
                    clearInterval(interval);
                    options.gold = newTotal;
                    for (var i = 0; i < goldTotal.length; i++) {
                        goldTotal.innerHTML = options.gold.toLocaleString();
                    }
                }
            }, 50);
            localStorage.setItem('options', JSON.stringify(options));
        }, 1000);
    }
}
/////////////// BUILD_LEVELS ///////////////

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
}


// Reset anything from the previous level
function resetAll(callback) {
    map = null;
    enemies = null;
    numberOfEnemies = 0;
    totalWeight = 0;
    hero.canMove = false;
    hero.timer = 100;
    timeBar.style.width = '100%';
    timeBar.style.display = 'flex';
    if (timeBar.classList.contains('time-danger')) {
        timeBar.classList.remove('time-danger');
    }
    keyboardPlayer = false;
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
    // Set Challenge Level
    if (hero.gameLevel % 8 === 0) {
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
        hero.avatar = avatarSelection;
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
        hero.fastTravel = false;
        hero.frozen = false;
        hero.gameLevel = 1;
        hero.selectedGameModes = gameMode;
        hero.health = 100;
        hero.hero = true;
        hero.id = 'hero-container';
        hero.knights = [{ number: 0, color: '#888888' }, { number: 2, color: '#cc3234' }, { number: 3, color: '#1cba4c' }, { number: 4, color: '#7c629c' }, { number: 5, color: '#fc8a04' },
                        { number: 6, color: '#cccacc' }, { number: 7, color: '#ffffff' }, { number: 8, color: '#f4fe04' },{ number: 9, color: '#a47644' }];
        hero.lastLocation = map[hero.row - 1][hero.col - 1];
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
        hero.timer = 100;
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

    // Apply selected hero avatar
    var avatar = document.querySelector('#hero img');
        avatar.src = 'img/avatars/' + hero.avatar + '.gif';

    var name = document.getElementById('player-name');
        name.innerHTML = 'Ser ' + hero.name;
    var level = document.getElementById('level');
        level.innerHTML = 'Floor ' + hero.gameLevel;
    healthBar.style.width = hero.health + '%';
    healthBar.style.transition = '0s';
    timeBar.style.transition = '0s';
    if (hero.challengeMode || hero.bossLevel || options.tutorial || options.endgame) {
        timeBar.style.display = 'none';
    }
    xpBar.style.width = hero.xp + '%';
    xpBar.style.transition = '0s';
    heroContainer.style.transform = 'translate(' + hero.left + 'px, ' + hero.top + 'px)';
    hero.canMove = true;
    hero.canCapture = true;

    if (options.tutorial === false && options.endgame === false) {
        // Start spawning enemies once the player has started moving or after 10 seconds because these monster aint got all day.
        var moves = hero.squaresMoved;
        var timer = 0;
        var interval = setInterval(function() {
            if (hero.squaresMoved > moves || timer >= 10) {
                clearInterval(interval);
                letTheGamesBegin();
            }
            timer++;
        }, 1000);
    }

    // Add Knight rescue text to hero object for later
    var shuffledRescueText = shuffle(rescueText);
    for (var i = 0; i < hero.knights.length; i++) {
        hero.knights[i].rescueText = shuffledRescueText[i];
    }

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
    debrisToBuild = randomNumber(3,5);
    columnsToBuild = randomNumber(1,3);
    trapsToBuild = [randomNumber(2,4),randomNumber(5,6),randomNumber(7,8)];

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
        cell.addEventListener('click', fastTravel);
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
/////////////// BUILD_MATH ///////////////

// Reset variables and route to the selected game mode
function addMath() {
    if (hero.bossLevel) {
        var mode = hero.selectedGameModes[randomNumber(0,hero.selectedGameModes.length - 1)];
        hero.bossLevel = hero.bosses[randomNumber(0,hero.bosses.length - 1)];
    }
    if (hero.challengeMode) {
        var mode = challengeMode[randomNumber(0,challengeMode.length - 1)];
    }
    else if (options.tutorial && options.newgame) {
        var mode = tutorialData.gameMode;
        document.querySelector('#top-bar .btn-options').style.pointerEvents = 'none';
        document.getElementById('top-bar').style.opacity = 0;
        document.getElementById('healthbar').style.opacity = 0;
        document.getElementById('xpbar').style.opacity = 0;
    }
    else {
        var mode = hero.selectedGameModes[randomNumber(0,hero.selectedGameModes.length - 1)];
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
                total++;
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
        multiples(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'factors') {
        factors(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'primes') {
        primes(total,correctNeeded,incorrectNeeded,displayMath);
    }
    else if (mode === 'equality') {
        equality(total,correctNeeded,incorrectNeeded,displayMath);
    }
    // Challenge Modes
    else if (mode === 'ascending' || mode === 'descending') {
        ascendingDescending(total,displayMath);
    }
}


// Generate list of correct and incorrect multiples
function multiples(total,correct,incorrect,callback) {

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
    if (options.tutorial && options.newgame) {
        target = tutorialData.target;
    }
    var correctArray = [];
    var incorrectArray = [];
    var highestValue = difficulty[hero.difficultyMath - 1].highest;
    var highestMultiple = Math.floor(highestValue / target);

    var correctCounter = 0;
    var incorrectCounter = 0;

    // Route answers to one of two arrays
    for (var i = 0; i < total; i++) {
        // Generate correct answers
        if (correctArray.length < correct) {
            answer = { number: randomNumber(1,highestMultiple) * target, answer: true };
            if (answer.number % target === 0) {
                correctArray.push(answer);
            }
            correctCounter++;
        }
        // Generate false answers
        else if (incorrectArray.length < incorrect) {
            answer = { number: randomNumber(2,highestValue), answer: false };
            if (answer.number % target !== 0) {
                incorrectArray.push(answer);
            }
            else {
                answer.number--;
                if (answer.number % target !== 0) {
                    incorrectArray.push(answer);
                }
                else {
                    i--;
                }
            }
            incorrectCounter++;
        }
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Multiples of ' + target;
    // Send to the display function
    callback(finalArray,fadeIn);
}


// Generate list of correct and incorrect factors
function factors(total,correct,incorrect,callback) {

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
    var safeArray = [];
    var unsafeArray = [];
    var correctArray = [];
    var incorrectArray = [];

    var counter = 0;

    // Generate list of safe numbers
    for (var i = 1; i <= target; i++) {
        if (target % i === 0) {
            safeArray.push(i);
        }
        // Add to wrong answers
        else {
            unsafeArray.push(i);
        }
    }

    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        if (correctArray.length < correct) {
            answer = { number: safeArray[randomNumber(0,safeArray.length - 1)], answer: true };
            correctArray.push(answer);
        }
        else if (incorrectArray.length < incorrect){
            answer = { number: unsafeArray[randomNumber(0,unsafeArray.length - 1)], answer: false };
            incorrectArray.push(answer);
        }
        counter++;
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Factors of ' + target;
    // Send to the display function
    callback(finalArray,fadeIn);
}


// Generate list of prime numbers
function primes(total,correct,incorrect,callback) {

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

    var counter = 0;

    // Route random numbers to one of two arrays
    for (var i = 0; i < total; i++) {
        answer = { number: nonPrimes[randomNumber(0,nonPrimes.length - 1)], answer: false };
        if (correctArray.length < correct) {
            answer = { number: primeNumbers[randomNumber(0,primeNumbers.length - 1)], answer: true };
            correctArray.push(answer);
        }
        else if (incorrectArray.length < incorrect) {
            answer = { number: nonPrimes[randomNumber(0,nonPrimes.length - 1)], answer: false };
            incorrectArray.push(answer);
        }
        else {
            i--;
        }
        counter++;
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Prime Numbers';
    // Send to the display function
    callback(finalArray,fadeIn);
}


// Generate an array of prime numbers up to the number given
function generatePrimeNumbers(max) {

    var numbers = [];
    primeNumbers = [];
    nonPrimes = [];

    for (var i = 2; i <= max; i++) {
        numbers.push(i);   
    }
    while (numbers.length) {
        primeNumbers.push(numbers.shift());
        numbers = numbers.filter(function(i) {
            if (i % primeNumbers[primeNumbers.length - 1] === 0) {
                nonPrimes.push(i);
            }
            return i % primeNumbers[primeNumbers.length - 1] != 0;
        });
    }
}


// Generate list of correct and incorrect equality formulas
function equality(total,correct,incorrect,callback) {

        var difficulty = [
        {
            // EASY
            min: 4,
            max: 15,
            highest: 25,
            deviation: 10
        },
        {
            // MEDIUM
            min: 15,
            max: 50,
            highest: 75,
            deviation: 10
        },
        {
            // HARD
            min: 50,
            max: 100,
            highest: 150,
            deviation: 10
        }
    ];

    target = randomNumber(difficulty[hero.difficultyMath - 1].min, difficulty[hero.difficultyMath - 1].max);
    var correctArray = [];
    var incorrectArray = [];
    var safeMultiples = [];
    var unsafeMultiples = [];
    var safeFactors = [];
    var unsafeFactors = [];
    var symbols = ['+','-','*','/'];
    var highestValue = difficulty[hero.difficultyMath - 1].highest;
    var deviation = difficulty[hero.difficultyMath - 1].deviation;

    // Generate list of safe multiples
    for (var i = 1; i <= target; i++) {
        if (target % i === 0) {
            safeMultiples.push(i);
        }
        // Add to wrong answers
        else {
            unsafeMultiples.push(i);
        }
    }

    // Generate list of safe factors
    for (var i = 1; i <= highestValue; i++) {
        if (i % target === 0) {
            safeFactors.push(i);
        }
        // Add to wrong answers
        else {
            unsafeFactors.push(i);
        }
    }

    // Loop through the total number of formulas needed
    for (var i = 0; i < total; i++) {
        var equation = '';
        var equationString = '';
        var symbol = symbols[randomNumber(0,symbols.length - 1)];
        var num1 = randomNumber(1,target);
        
        // Create addition equations
        if (symbol === '+') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num2 = target - num1;
                equationString = num1 + symbol + num2;
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num2 = target - num1;
                    num2 += randomNumber(1,deviation);
                equationString = num1 + symbol + num2;
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create subtraction equations
        else if (symbol === '-') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num2 = target + num1;
                equationString = num2 + symbol + num1;
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num2 = target + num1;
                    num2 += randomNumber(1,deviation);
                equationString = num2 + symbol + num1;
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create multiplication equations
        else if (symbol === '*') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num1 = safeMultiples[randomNumber(0,safeMultiples.length - 1)];
                var num2 = target / num1;
                equationString = num1 + '&times;' + num2;
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num1 = unsafeMultiples[randomNumber(0,unsafeMultiples.length - 1)];
                var num2 = randomNumber(1,deviation);
                equationString = num1 + '&times;' + num2;
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }

        // Create division equations
        else if (symbol === '/') {
            // Generate correct answers
            if (correctArray.length < correct) {
                var num1 = safeFactors[randomNumber(0,safeFactors.length - 1)];
                var num2 = num1 / target;
                equationString = num1 + '&divide;' + num2;
                answer = { number: equationString, answer: true };
                correctArray.push(answer);
            }
            // Generate false answers
            else if (incorrectArray.length < incorrect) {
                var num1 = unsafeFactors[randomNumber(0,unsafeFactors.length - 1)];
                var num2 = randomNumber(1,deviation);
                equationString = num1 + '&divide;' + num2;
                answer = { number: equationString, answer: false };
                incorrectArray.push(answer);
            }
        }
    }

    // Concat both arrays together and then shuffle
    var finalArray = correctArray.concat(incorrectArray);
    finalArray = shuffle(finalArray);
    document.getElementById('game-mode').innerHTML = 'Equals ' + target;
    // Send to the display function
    callback(finalArray,fadeIn);
}

// Generate list of ascending or descending random values
function ascendingDescending(total,callback) {
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
    callback(finalArray,fadeIn);
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
function displayMath(finalArray,callback) {
    var i = 0;
    var safety = 0;
    for (var r = 0; r < numberOfRows; r++) {
        for (var c = 0; c < numberOfColumns; c++) {
            if (map[r][c].contents === 'empty' || map[r][c].contents === 'exit') {
                map[r][c].number = finalArray[i].number;
                map[r][c].answer = finalArray[i].answer;
                var cell = document.getElementById(map[r][c].location);
                var equation = document.createElement('p');
                    equation.style.fontSize = cellFontSize;
                if (options.tutorial && options.newgame) {
                    equation.style.opacity = '0';
                }
                equation.innerHTML = finalArray[i].number;
                if (cell !== null) {
                    cell.appendChild(equation);
                    i++;
                }
                else if (safety > 100) {
                    break;
                }
                else {
                    safety++;
                }
            }
        }
    }
    callback();
    handleTraps();
    if (options.tutorial) {
        startTutorial();
    }
}


// Slide open exit cover
function openExitCover() {
    if (hero.answers >= hero.answersNeeded && options.tutorial === false) {
        var exitAnswer = document.querySelector('#' + levelExit.id + ' p');
        if (exitAnswer !== null) {
            exitAnswer.style.opacity = '0';
        }
        setTimeout(function() {
            var exitCover = document.querySelector('#' + levelExit.id + ' img');
                exitCover.style.transition = '2.25s ease-in-out';
                exitCover.style.transform = 'translateY(-100%)';
            document.getElementById('game-mode').innerHTML = 'Level Complete!';
        }, 1500);
        // Fade out all incorrect answers
        var maths = document.querySelectorAll('.cell p');
        for (var i = 0; i < maths.length; i++) {
            maths[i].style.opacity = '0';
            hero.canCapture = false;
        }
    }
}


// When activating a square check if answer is correct
function checkMath() {
    var correct = false;
    // Get the hero location so you can check the appropriate map data
    var munchLocation = map[hero.row - 1][hero.col - 1];
    // Prevent from capturing a tile more than once
    if (munchLocation.answer === 'captured' || hero.canCapture === false || !munchLocation.hasOwnProperty('answer')) {
        return;
    }
    // Ascending or Descending Order
    else if (munchLocation.number === hero.ascending[0]) {
        correct = true;
        munchLocation.answer = 'captured';
        hero.ascending.shift();
    }
    else if (munchLocation.answer && hero.challengeMode === false) {
        correct = true;
    }
    if (correct) {
        if (hero.timer + timeRestoreFromCapture < 100) {
            hero.timer += timeRestoreFromCapture;
        }
        else {
            hero.timer = 100;
        }
        hero.answers++;
        restoreHealth(healthRestoreFromCapture);
        munchLocation.answer = 'captured';
        var square = document.querySelector('#' + munchLocation.location + ' p');
        setTimeout(function() {
            if (square === null) {

            }
            else {
                square.remove();
            }
        }, 250);
        if (hero.answers === hero.answersNeeded) {
            if (hero.bossLevel && hero.bossIsDead) {
                openExitCover();
            }
            else if (hero.bossLevel === false) {
                openExitCover();
            }
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

        // Flash tile
        var flash = document.createElement('span');
            flash.classList.add('flash');
            square.parentElement.appendChild(flash);
        setTimeout(function() {
            flash.remove();
        }, 600);
        
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
        hero.timer -= timeLostFromWrongAnswer;
        dealDamage(damageFromWrongAnswer,'wrong answer');
        // Flash tile
        var square = document.querySelector('#' + munchLocation.location + ' p');
        var flash = document.createElement('span');
            flash.classList.add('flash-wrong');
            square.parentElement.appendChild(flash);
        setTimeout(function() {
            flash.remove();
        }, 600);
    }
}
/////////////// MONSTER_MANUAL ///////////////

// My Monster Manual
var bestiary = [
    {
        type: 'Bat',
        boss: false,
        image: 'bat.gif',
        baseDamage: 2,
        health: 30,
        weight: 10,
        evasion: 10,
        moveInterval: 1500,
        moveSpeed: 0.5,
        moveType: 'aggressive',
        info: 'Bats are quick, and not much of a threat alone, but can easily overcome you in larger numbers. They can also fly over obstacles to reach you.'
    },
    {
        type: 'Gelatinous Cube',
        boss: false,
        image: 'cube-green.gif',
        baseDamage: 10,
        health: 50,
        weight: 20,
        evasion: 5,
        moveInterval: 2100,
        moveSpeed: 2,
        moveType: 'passive',
        abilities: [
            {
                ability: 'acid',
                abilityDamge: 5,
                abilityDuration: 5500,
                abilityChance: 100
            }
        ],
        info: 'A slow moving gelatinous mass that leaves a trail of corrosive acid in its wake.'
    },
    {
        type: 'Giant Spider',
        boss: false,
        image: 'spider.gif',
        baseDamage: 10,
        health: 65,
        weight: 30,
        evasion: 15,
        moveInterval: 2000,
        moveSpeed: 0.35,
        moveType: 'passive',
        abilities: [
            {
                ability: 'web',
                abilityDamge: 0,
                trapDuration: 3000,
                abilityDuration: 12000,
                abilityChance: 20
            }
        ],
        info: 'Spiders are quick, and can poison you with their bite. The webs they leave behind can immobilize you for a short period of time.'
    },
    {
        type: 'Number Mage',
        boss: false,
        image: 'number-mage.gif',
        baseDamage: 5,
        health: 85,
        weight: 20,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 0.5,
        moveType: 'passive',
        abilities: [
            {
                ability: 'rotate',
                abilityDamge: 0,
                abilityDuration: 10000,
                abilityChance: 80
            }
        ],
        info: 'The Number Mage is not a threat in the usual sense. They do almost no damage, but cast magic to cloud your mind and make equations more difficult to solve.'
    },
    {
        type: 'Oculord',
        boss: false,
        image: 'oculord.gif',
        baseDamage: 15,
        health: 100,
        weight: 60,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 2.5,
        moveType: 'passive',
        abilities: [
            {
                ability: 'projectile',
                abilityImage: ['projectile-fire.gif', 'projectile-ice.gif'],
                abilityDamge: 15,
                damageDuration: 3000,
                abilityDuration: 0.45,
                abilityChance: 75,
                targetChance: 75
            }
        ],
        info: 'Oculords can shoot both ice and fire from one of the many magical eye stalks that grow from their bodies.'
    },
    {
        type: 'Vampire',
        boss: false,
        image: 'vampire.gif',
        baseDamage: 15,
        health: 125,
        weight: 60,
        evasion: 10,
        moveInterval: 3000,
        moveSpeed: 1,
        moveType: 'passive',
        abilities: [
            {
                ability: 'invisibility',
                abilityDamge: 0.6,
                abilityDuration: 10000,
                abilityChance: 70
            }
        ],
        info: 'These blood sucking fiends have the ability to turn mostly invisible for a period of time. While under this effect they can drain your life within a short range.'
    }
];


// My Boss Monster Manual
var bosses = [
    {
        type: 'Spider Queen',
        boss: true,
        image: 'spider-queen.gif',
        baseDamage: 15,
        health: 500,
        weight: 50,
        evasion: 5,
        moveInterval: 2100,
        moveSpeed: 2,
        moveType: 'passive',
        abilities: [
            {
                ability: 'acid',
                abilityDamge: 5,
                abilityDuration: 5500,
                abilityChance: 80
            },
            {
                ability: 'projectile',
                abilityImage: ['projectile-poison.gif'],
                abilityDamge: 1.15,
                damageDuration: 3000,
                dotStatus: 'poisoned!',
                abilityDuration: 0.45,
                abilityChance: 90,
                targetChance: 100
            },
        ],
        info: 'The Spider Queen resides in a large lair within these dungeon walls. She has a powerful poison, and many smaller minions that will stop at nothing to protect their Queen.'
    },
    {
        type: 'Vampire Lord',
        boss: true,
        image: 'vampire-lord.gif',
        baseDamage: 10,
        health: 500,
        weight: 70,
        evasion: 5,
        moveInterval: 1900,
        moveSpeed: 1.5,
        moveType: 'passive',
        abilities: [
            {
                ability: 'invisibility',
                abilityDamge: 0.9,
                abilityDuration: 7000,
                abilityChance: 70
            },
            {
                ability: 'projectile',
                abilityImage: ['projectile-ice.gif'],
                abilityDamge: 5,
                damageDuration: 1900,
                dotStatus: 'frozen!',
                abilityDuration: 0.45,
                abilityChance: 100,
                targetChance: 100
            },
        ],
        info: 'The Vampire Lord has a powerful short range life drain ability while he remains invisible. His ice projectiles can freeze you in place so that his swarm of bat minions can overtake you.'
    },
    {
        type: 'Red Knight',
        boss: true,
        image: 'red-knight.gif',
        baseDamage: 10,
        health: 225,
        weight: 50,
        evasion: 5,
        moveInterval: 2200,
        moveSpeed: 1.2,
        moveType: 'passive',
        cooldownTimer: 4000,
        abilities: [
            {
                ability: 'burst',
                abilityImage: ['projectile-fire.gif'],
                abilityDamge: 8,
                damageDuration: 3000,
                abilityDuration: 0.35,
                burstSpeed: 350,
                shots: 0,
                abilityChance: 85,
                targetChance: 100
            }
        ],
        info: 'The first of the Three Knights, the Red Knight hurls fireballs in rapid bursts to deal immense damage to their victim.'
    },
    {
        type: 'Blue Knight',
        boss: true,
        image: 'blue-knight.gif',
        baseDamage: 10,
        health: 225,
        weight: 50,
        evasion: 5,
        moveInterval: 2200,
        moveSpeed: 1.2,
        moveType: 'passive',
        abilities: [
            {
                ability: 'ice',
                abilityDamge: 5,
                trapDuration: 1000,
                abilityDuration: 5500,
                abilityChance: 80
            },
            {
                ability: 'projectile',
                abilityImage: ['projectile-ice.gif'],
                abilityDamge: 10,
                damageDuration: 2500,
                dotStatus: 'frozen!',
                abilityDuration: 0.9,
                abilityChance: 100,
                targetChance: 100
            },
        ],
        info: 'The second of the Triumvarate, the Blue Knight leaves a trail of ice, and can shoot freezing orbs, locking their victim in place.'
    },
    {
        type: 'Yellow Knight',
        boss: true,
        image: 'yellow-knight.gif',
        baseDamage: 10,
        health: 225,
        weight: 50,
        evasion: 5,
        moveInterval: 2200,
        moveSpeed: 1.2,
        moveType: 'passive',
        abilities: [
            {
                ability: 'projectile',
                abilityImage: ['projectile-poison.gif'],
                abilityDamge: 1.25,
                damageDuration: 3000,
                dotStatus: 'poisoned!',
                abilityDuration: 0.45,
                abilityChance: 90,
                targetChance: 100
            }
        ],
        info: 'The last of the three guardians, the Yellow Knight launches a powerful poisoned ball that deals damage over time to the effected victim.'
    }
];
/////////////// SPAWN_ENEMIES ///////////////

// Start adding enemies based on monster difficulty
function letTheGamesBegin() {
    // Set up level timer
    var timerInterval = 500;
    var transition = timerInterval / 1000;
        timeBar.style.transition = transition + 's linear';
    var timerIncrement = (100 / defaultTimer) * (timerInterval / 1000);
    var currentLevel = hero.gameLevel;
    var dangerZone = 30;
    // Start the level timer
    var timerInterval = setInterval(function() {
        // Start flashing bar if in the danger zone
        if (hero.timer <= dangerZone) {
            if (timeBar.classList.contains('time-danger')) {

            }
            else {
                timeBar.classList.add('time-danger');
            }
        }
        else if (hero.timer > dangerZone) {
            timeBar.classList.remove('time-danger');
        }
        if (hero.pause) {

        }
        else if (currentLevel !== hero.gameLevel || map === null || hero === null || hero.bossLevel || hero.challengeMode || options.tutorial || options.endgame) {
            clearInterval(timerInterval);
        }
        else if (hero.answers >= hero.answersNeeded) {
            clearInterval(timerInterval);
        }
        else {
            hero.timer -= timerIncrement;
            if (hero.timer <= 0 ) {
                clearInterval(timerInterval);
                dealDamage(1000000,'time');
            }
            else {
                timeBar.style.width = hero.timer + '%';
            }
        }
    }, timerInterval);

    if (hero.difficultyMonster == 1) {
        maxWeight = 50;
        maxEnemies = 5;
    }
    else if (hero.difficultyMonster == 2) {
        maxWeight = 100;
        maxEnemies = 10;
    }
    else if (hero.difficultyMonster == 3) {
        maxWeight = 200;
        maxEnemies = 15;
    }
    levelData = { redKnight: false, blueKnight: false, yellowKnight: false };
    // Gaining levels increases max weight
    maxWeight += ((hero.level - 1) * 10);
    // Gaining levels increases max number of enemies
    if (hero.level % 2 === 0) {
        maxEnemies += (hero.level / 2);
    }
    // If Boss Level
    if (hero.bossLevel !== false) {
        maxWeight *= 2;
        maxEnemies = 25;
    }
    // Get list of safe spawn locations
    spawnArray = [];
    try {
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
    } catch(e) {
    }
    // Start spawning enemies at an interval
    if (options.tutorial === false) {
        spawnEnemy();
    }
}


// Spawn another enemy at a random interval
function spawnEnemy() {
    var spawnLevel = hero.gameLevel;
    var spawnInterval = randomNumber(1000,3000);
    var interval = setInterval(function() {
        if (map === null || map.length === 0 || hero.bossIsDead || spawnLevel !== hero.gameLevel) {
            clearInterval(interval);
        }
        else if (totalWeight < maxWeight && numberOfEnemies < maxEnemies) {
            var spawn = spawnArray[randomNumber(0,spawnArray.length - 1)];
            getEnemy(spawn.row,spawn.col);
        }
        else if (numberOfEnemies >= maxEnemies) {
            clearInterval(interval);
        }
    }, spawnInterval);
}


// Select a random enemy from the bestiary
function getEnemy(row,col) {
    var monster = bestiary[randomNumber(0,bestiary.length - 1)];
    // Boss Level Spawn
    if (hero.bossLevel === 'Spider Queen') {
        if (hero.bossHasSpawned === false) {
            monster = bosses[0];
            hero.bossHasSpawned = true;
        }
        else {
            // Spawn spider minions
            monster = bestiary[2];
        }
        addEnemy(row,col,monster);
    }
    else if (hero.bossLevel === 'Vampire Lord') {
        if (hero.bossHasSpawned === false) {
            monster = bosses[1];
            hero.bossHasSpawned = true;
        }
        else {
            // Spawn bat minions
            monster = bestiary[0];
        }
        addEnemy(row,col,monster);
    }
    else if (hero.bossLevel === 'Red Knight') {
        maxEnemies = 3;
        maxWeight = 1000;
        // Start with Red Knight
        if (hero.bossLevel === 'Red Knight' && levelData.redKnight === false) {
            monster = bosses[2];
            hero.bossHasSpawned = true;
            levelData.redKnight = 'alive';
        }
        else if (hero.bossLevel === 'Red Knight') {
            // Spawn Blue Knight
            if (levelData.blueKnight === false) {
                monster = bosses[3];
                levelData.blueKnight = 'alive';
            }
            // Spawn Yellow Knight
            else if (levelData.yellowKnight === false) {
                monster = bosses[4];
                levelData.yellowKnight = 'alive';
            }
        }
        addEnemy(row,col,monster);
    }
    else if (options.tutorial && options.newgame) {
        monster = bestiary[1];
        addEnemy(3,1,monster);
    }
    else {
        if (monster.weight + totalWeight <= maxWeight) {
            addEnemy(row,col,monster);
        }
        else if (maxWeight - totalWeight <= 20) {

        }
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


// Spawn an enemy and apply some data to it
function addEnemy(row,col,monster) {
    enemyWarning();
    numberOfEnemies++;
    var enemy = (JSON.parse(JSON.stringify(monster)));
    totalWeight += enemy.weight;

    enemy.armorRating = 1;
    enemy.attackRating = 1;
    enemy.canMove = true;
    enemy.col = col;
    enemy.cooldown = false;
    enemy.enemy = true;
    enemy.gameLevel = hero.gameLevel;
    enemy.id = 'enemy-container' + numberOfEnemies;
    enemy.invisible = false;
    enemy.left = (col * cellSize) - cellSize;
    enemy.location = 'r' + row + 'c' + col;
    enemy.row = row;
    enemy.startingHealth = monster.health;
    enemy.top = (row * cellSize) - cellSize;
    
    // Check if monster has been encountered before
    if (options.enemiesEncountered.indexOf(enemy.type) == -1) {
        options.enemiesEncountered.unshift(enemy.type);
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
    if (enemy.boss) {
        // Apply boss scaling
        // If second boss fight
        if (hero.bosses.length === 2) {
            enemy.startingHealth *= 1.25;
            enemy.health *= 1.25;
            enemy.attackRating += 0.25;
        }
        // If third boss fight
        if (hero.bosses.length === 1) {
            enemy.startingHealth *= 1.5;
            enemy.health *= 1.5;
            enemy.attackRating += 0.5;
        }
        enemy.startingHealth *= hero.difficultyMonster;
        enemy.health *= hero.difficultyMonster;
        createEnemy.classList.add('boss');
        var healthBar = document.createElement('span');
            healthBar.id = 'boss-health';
        if (enemy.type === 'Red Knight') {
            healthBar.id = 'boss-health-redknight';
        }
        else if (enemy.type === 'Blue Knight') {
            healthBar.id = 'boss-health-blueknight';
        }
        else if (enemy.type === 'Yellow Knight') {
            healthBar.id = 'boss-health-yellowknight';
        }
            healthBar.style.width = '100%';
            healthBar.style.opacity = '0';
            createEnemy.appendChild(healthBar);
    }
    else {
        createEnemy.classList.add('enemy');
    }
    // Allow aggressive types to fly over objects
    if (enemy.moveType === 'aggressive') {
        createEnemy.classList.add('flying');
    }
        createEnemy.id = enemy.id;
        createEnemy.style.width = cellSize + 'px';
        createEnemy.style.height = cellSize + 'px';
        createEnemy.style.backgroundImage = 'url("img/enemies/shadow.png")';
        createEnemy.style.top = '0';
        createEnemy.style.left = '0';
        createEnemy.style.zIndex = 10;
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
        enemyContainer.style.transition = enemy.moveSpeed + 's ease';
    // Insert the enemy onto one of the outside squares
    if (enemy.row === 1) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + '-' + cellSize + 'px)';
    }
    else if (enemy.row === numberOfRows) {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + (enemy.top + cellSize) + 'px)';
    }
    else if (enemy.row !== 1 || enemy.row !== numberOfRows) {
        if (enemy.col === 1) {
            enemyContainer.style.transform = 'translate(-' + cellSize + 'px, ' + enemy.top + 'px)';
        }
        else if (enemy.col === numberOfColumns) {
            enemyContainer.style.transform = 'translate(' + (enemy.left + cellSize) + 'px, ' + enemy.top + 'px)';
        }
    }

    // Move enemy in from outside of map
    setTimeout(function() {
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        // Add to map data
        if (map !== null) {
            map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
        }
        actionInterval();
    }, 2000);

    // Perform actions at set intervals depending on monster moveInterval
    function actionInterval() {
        var actionInterval = setInterval(function() {
            // Increase monster damage when playing with a keyboard
            if (keyboardPlayer && !enemy.boss) {
                enemy.attackRating = keyboardDamageModifier;
            }
            // Destroy any stowaways trying to sneak into the next level
            if (enemy.gameLevel !== hero.gameLevel) {
                clearTimeout(actionInterval);
                enemy = null;
                delete enemy;
            }
            else if (map === null || hero === null) {
                clearTimeout(actionInterval);
                enemy = null;
                delete enemy;
            }
            else if (hero.bossHasSpawned && hero.bossIsDead && enemy.health > 0) {
                enemy.evasion = 0;
                enemy.health = 1;
                checkForAttack('none',enemy,hero);
            }
            else {
                // Award XP on death, then destroy
                if (enemy.health <= 0) {
                    if (enemy.boss) {
                        if (enemy.type === 'Red Knight') {
                            levelData.redKnight = 'dead';
                        }
                        else if (enemy.type === 'Blue Knight') {
                            levelData.blueKnight = 'dead';
                        }
                        else if (enemy.type === 'Yellow Knight') {
                            levelData.yellowKnight = 'dead';
                        }
                        if (levelData.redKnight === 'dead' && levelData.blueKnight === 'dead' && levelData.yellowKnight === 'dead') {
                            hero.bossIsDead = true;
                            var index = hero.bosses.indexOf('Red Knight');
                            hero.bosses.splice(index,1);
                        }
                        else if (enemy.type !== 'Red Knight' && enemy.type !== 'Blue Knight' && enemy.type !== 'Yellow Knight') {
                            hero.bossIsDead = true;
                            var index = hero.bosses.indexOf(enemy.type);
                            hero.bosses.splice(index,1);
                        }

                        if (hero.bossIsDead) {
                            setTimeout(function() {
                                for (var i = 0; i < columnArray.length; i++) {
                                    var cage = document.getElementById(columnArray[i].location).lastChild;
                                        cage.style.opacity = '0';
                                    var cell = columnArray[i];
                                        map[cell.row - 1][cell.col - 1].contents = 'empty';
                                }
                                textBubble('rescue',1000);
                                if (hero.answers === hero.answersNeeded) {
                                    openExitCover();
                                }
                            }, 2000);
                        }
                    }
                    clearTimeout(actionInterval);
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
                    if (enemy.abilities) {
                        var useAbility = randomNumber(1,100);
                        enemy.currentAbility = enemy.abilities[randomNumber(0,enemy.abilities.length - 1)];
                        if (useAbility <= enemy.currentAbility.abilityChance) {
                            if (enemy.currentAbility.ability === 'acid' || enemy.currentAbility.ability === 'web' || enemy.currentAbility.ability === 'poison' || enemy.currentAbility.ability === 'ice') {
                                layTrap(enemy);
                            }
                            else if (enemy.currentAbility.ability === 'rotate') {
                                rotateEquation(enemy);
                            }
                            else if (enemy.currentAbility.ability === 'projectile') {
                                enemyProjectile(enemy,enemyContainer);
                            }
                            else if (enemy.currentAbility.ability === 'burst' && enemy.currentAbility.shots === 0) {
                                var interval = setInterval(function() {
                                    if (enemy.cooldown) {
                                        clearInterval(interval);
                                    }
                                    else if (enemy.currentAbility.shots >= 3) {
                                        enemy.currentAbility.shots = 0;
                                        clearInterval(interval);
                                        cooldown(enemy,enemy.moveInterval);
                                    }
                                    else if (enemy.cooldown === false) {
                                        enemyProjectile(enemy,enemyContainer);
                                        enemy.currentAbility.shots++;
                                    }
                                }, enemy.currentAbility.burstSpeed);
                            }
                            else if (enemy.currentAbility.ability === 'invisibility' && enemy.invisible === false) {
                                turnInvisible(enemy,enemyContainer);
                            }
                        }
                        getMovementDirection(enemy,enemyContainer);
                    }
                    else {
                        getMovementDirection(enemy,enemyContainer);
                    }
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
/////////////// ENEMY_ABILITIES ///////////////

// Add damage over time effect
function damageOverTime(victim,attacker) {
    var amount = attacker.currentAbility.abilityDamge;
    // Display status ailment
    flashMessage(victim,attacker.currentAbility.dotStatus,attacker.currentAbility.damageDuration);
    // Deal damage over time at set interval
    var interval = setInterval(function() {
        if (victim.health <= 0) {
            clearInterval(interval);
        }
        else  {
            dealDamage(amount,attacker);
        }
    }, 250);
    setTimeout(function() {
        clearInterval(interval);
    }, attacker.currentAbility.damageDuration);
}


// Allow vampires to temporarily turn mostly invisible
function turnInvisible(enemy,enemyContainer) {
    var damage = enemy.currentAbility.abilityDamge;
    enemy.invisible = true;
    enemy.evasion = 50;
    enemyContainer.lastChild.style.opacity = '0';
    // If it has a health bar
    if (enemy.boss) {
        var healthBar = document.getElementById('boss-health');
            healthBar.style.opacity = '0';
    }
    // Drain health if invisible and within range
    var interval = setInterval(function() {
        if (enemy.health <= 0) {
            clearInterval(interval);
        }
        else if (enemy.invisible) {
            if (Math.abs(hero.row - enemy.row) <= 1 && Math.abs(hero.col - enemy.col) <= 1) {
                dealDamage(damage,enemy);
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
        if (enemy.boss) {
            healthBar.style.opacity = '1';
        }
    }, enemy.currentAbility.abilityDuration);
}


// Allow enemies to shoot stuff at you
function enemyProjectile(enemy,enemyContainer) {
    // If enemy shoots projectiles, chance to attack if on same row or column
    if (randomNumber(1,100) < enemy.currentAbility.targetChance) {
        // If player is on same row and to the RIGHT
        if (enemy.row === hero.row && enemy.col < hero.col) {
            var direction = 'right';
        }
        // If player is on same row and to the LEFT
        else if (enemy.row === hero.row && enemy.col > hero.col) {
            var direction = 'left';
        }
        // If player is on same column and UP
        else if (enemy.col === hero.col && enemy.row > hero.row) {
            var direction = 'up';
        }
        // If player is on same column and UP
        else if (enemy.col === hero.col && enemy.row < hero.row) {
            var direction = 'down';
        }
    }
    // Otherwide fire in a random direction
    else {
        var directions = ['up','down','left','right'];
        var direction = directions[randomNumber(0,3)];
    }

    // Create the projectile element
    var spawn = enemyContainer.getBoundingClientRect();
    var object = document.createElement('img');
    var type = enemy.currentAbility.abilityImage[randomNumber(0,enemy.currentAbility.abilityImage.length - 1)];
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
        var speed = numberOfRows * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(-' + distance + 'px)';
    }
    else if (direction === 'down') {
        var distance = levelContainer.clientHeight + cellSize;
        var speed = numberOfRows * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateY(' + distance + 'px) rotate(180deg)';
    }
    else if (direction === 'left') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.currentAbility.abilityDuration;
            projectile.style.transition = speed + 's linear';
            projectile.style.transform = 'translateX(-' + distance + 'px) rotate(-90deg)';
    }
    else if (direction === 'right') {
        var distance = levelContainer.clientWidth + cellSize;
        var speed = numberOfColumns * enemy.currentAbility.abilityDuration;
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
                    freezePerson(hero,enemy.currentAbility.damageDuration,'ice');
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else if (type === 'poison') {
                    hero.timesPoisoned++;
                    damageOverTime(hero,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
                else {
                    flashHitImage(hero,player);
                    dealDamage(enemy.currentAbility.abilityDamge,enemy);
                    clearInterval(interval);
                    projectile.style.display = 'none';
                }
            }
            // Make player immune to damage until projectile leaves the current cell
            else {
                canHit = false;
                flashMessage(hero,'evaded!');
                hero.attacksEvaded++;
                var safeTime = enemy.currentAbility.abilityDuration * 1250;
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
        }, enemy.currentAbility.abilityDuration);
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
            mapLocation.trapType = enemy.currentAbility.ability;
            mapLocation.trapDamage = enemy.currentAbility.abilityDamge;
        if (enemy.currentAbility.ability === 'ice' || enemy.currentAbility.ability === 'web') {
            mapLocation.trapDuration = enemy.currentAbility.trapDuration;
        }
        var trap = document.createElement('img');
            trap.src = 'img/objects/' + enemy.currentAbility.ability + '-' + randomNumber(1,2) + '.gif';
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
        }, enemy.currentAbility.abilityDuration);
    }
}
/////////////// MOVEMENT_ENEMY ///////////////

// Determine which direction to move in
function getMovementDirection(enemy,enemyContainer) {
    var directions = ['up','down','left','right'];
    var hasAttacked = false;
    // Passive enemies have a lower chance to target you
    if (enemy.moveType === 'passive') {
        var chanceToAttack = 40;
    }
    // Aggressive enemies are more likely to attack
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
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
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
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
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
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
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
            if (mapLocation.contents === 'blocked' || mapLocation.enemy.length > 0 || mapLocation.hero)  {
                var index = directions.indexOf('right');
                    directions.splice(index, 1);
            }
        }
    }

    if (enemy.moveType === 'passive' && hasAttacked === false) {
        moveEnemy(enemy,enemyContainer,directions);
    }
    else if (enemy.moveType === 'aggressive' && hasAttacked === false) {
        getAggressiveMovement(enemy,enemyContainer);
    }
}


// Calculate how to hunt the player down
function getAggressiveMovement(enemy,enemyContainer) {
    // If on top of the hero
    if (enemy.row === hero.row && enemy.col === hero.col) {
    }
    // If on the same row
    else if (enemy.row === hero.row) {
        // Try to move right
        if (enemy.col !== numberOfColumns) {
            var mapLocation = map[enemy.row - 1][enemy.col];
            if (enemy.col < hero.col && mapLocation.hero === false) {
                var move = ['right'];
            }
        }
        // Try to move left
        if (enemy.col !== 1) {
            var mapLocation = map[enemy.row - 1][enemy.col - 2];
            if (enemy.col > hero.col && mapLocation.hero === false) {
                var move = ['left'];
            }
        }
    }
    // If on the same column
    else if (enemy.col === hero.col) {
        // Try to move down
        if (enemy.row !== numberOfRows) {
            var mapLocation = map[enemy.row][enemy.col - 1];
            if (enemy.row < hero.row && mapLocation.hero === false) {
                var move = ['down'];
            }
        }
        // Try to move up
        if (enemy.row !== 1) {
            var mapLocation = map[enemy.row - 2][enemy.col - 1];
            if (enemy.row > hero.row && mapLocation.hero === false) {
                var move = ['up'];
            }
        }
    }
    else if (Math.abs(enemy.row - hero.row) < Math.abs(enemy.col - hero.col)) {
        // Try to move to the same column
        // Try to move right
        if (enemy.col !== numberOfColumns) {
            var mapLocation = map[enemy.row - 1][enemy.col];
            if (enemy.col < hero.col && mapLocation.hero === false) {
                var move = ['right'];
            }
        }
        // Try to move left
        if (enemy.col !== 1) {
            var mapLocation = map[enemy.row - 1][enemy.col - 2];
            if (enemy.col > hero.col && mapLocation.hero === false) {
                var move = ['left'];
            }
        }
    }
    // Column position is closer
    else {
        // Try to move to the same row
        // Try to move down
        if (enemy.row !== numberOfRows) {
            var mapLocation = map[enemy.row][enemy.col - 1];
            if (enemy.row < hero.row && mapLocation.hero === false) {
                var move = ['down'];
            }
        }
        // Try to move up
        if (enemy.row !== 1) {
            var mapLocation = map[enemy.row - 2][enemy.col - 1];
            if (enemy.row > hero.row && mapLocation.hero === false) {
                var move = ['up'];
            }
        }
    }
    moveEnemy(enemy,enemyContainer,move);
}


// Move enemy based on passive or aggressive AI
function moveEnemy(enemy,enemyContainer,directions) {
    if (directions === undefined) {
        var move = 'none';
    }
    else {
        var move = directions[randomNumber(0,directions.length - 1)];
    }

    // MOVE UP
    if (move === 'up') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.top -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row--;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE DOWN
    else if (move === 'down') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.top += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.row++;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE LEFT
    else if (move === 'left') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.left -= cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col--;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }

    // MOVE RIGHT
    else if (move === 'right') {
        map[enemy.row - 1][enemy.col - 1].enemy.splice(0,1);
        enemy.left += cellSize;
        enemyContainer.style.transform = 'translate(' + enemy.left + 'px, ' + enemy.top + 'px)';
        enemy.col++;
        map[enemy.row - 1][enemy.col - 1].enemy.push(enemy.id);
    }
    enemy.location = 'r' + enemy.row + 'c' + enemy.col;
}
/////////////// MOVEMENT_PLAYER ///////////////

// Add event listeners for the 4 movement buttons
var moveUp = document.getElementById('move-up');
    moveUp.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-up');
        }
    });
var moveDown = document.getElementById('move-down');
    moveDown.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-down');
        }
    });
var moveLeft = document.getElementById('move-left');
    moveLeft.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-left');
        }
    });
var moveRight = document.getElementById('move-right');
    moveRight.addEventListener('click', function(e) {
        if (hero.fastTravel) {
            hero.fastTravel = false;
        }
        else {
            moveHero('move-right');
        }
    });

// Listen for keyboard events for desktop users that like to kick it oldschool
document.onkeyup = checkKey;

function checkKey(e) {
    if (hero.canMove) {
        e = e || window.event;
        var move = false;
        // Assign movement direction for arrow keys and WASD
        if (e.keyCode == '37' || e.keyCode == '65') {
            move = 'move-left';
        }
        else if (e.keyCode == '38' || e.keyCode == '87') {
            move = 'move-up';
        }
        else if (e.keyCode == '39' || e.keyCode == '68') {
            move = 'move-right';
        }
        else if (e.keyCode == '40' || e.keyCode == '83') {
            move = 'move-down';
        }
        else if (e.keyCode == '32') {
            hero.fastTravel = false;
            checkMath();
        }
        if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') {
            keyboardPlayer = true;
        }
        // Pass movement direction to movement function
        if (move !== false) {
            hero.fastTravel = false;
            moveHero(move);
        }
    }
}


// Allow player to automate travel for greater distances
function fastTravel(e) {
    if (hero.fastTravel) {
        hero.fastTravel = false;
    }
    else {
        var mapCell;
        for (var r = 0; r < numberOfRows; r++) {
            for (var c = 0; c < numberOfColumns; c++) {
                if (map[r][c].location === e.target.id && map[r][c].contents !== 'blocked') {
                    mapCell = map[r][c];
                    hero.fastTravel = mapCell;
                    var square = document.createElement('span');
                        square.classList.add('highlight');
                    document.getElementById(mapCell.location).appendChild(square);
                        square.style.borderColor = 'rgba(12,126,180,1)';
                    if (hero.fastTravel !== false && hero.canMove !== false) {
                        var end = hero.fastTravel;
                        fastTravelPathing(square);
                    }
                    var interval = setInterval(function() {
                        if (hero.fastTravel !== false && hero.canMove !== false) {
                            var end = hero.fastTravel;
                            fastTravelPathing(square);
                        }
                        else {
                            clearInterval(interval);
                            square.style.borderColor = 'rgba(0,0,0,0)';
                            setTimeout(function() {
                                square.remove();
                            }, 500);
                        }
                    }, 500);
                }
            }
        }
    }
}


// Automate travelling from one location to another with some basic obstacle avoidance
function fastTravelPathing(square) {
    var end = hero.fastTravel;
    // Determine greatest distance to close
    var rows = Math.abs(hero.row - end.row);
    var cols = Math.abs(hero.col - end.col);
    if (rows > cols) {
        var direction = 'vertical';
    }
    else {
        var direction = 'horizontal';
    }
    // Fade out outline if 1 square away from target
    if (Math.abs(hero.row - end.row) <= 1 && Math.abs(hero.col - end.col) <= 1) {
        setTimeout(function() {
            square.style.borderColor = 'rgba(0,0,0,0)';
        }, 350);
    }
    // Stop moving if the end has been reached
    if (hero.location === end.location) {
        hero.fastTravel = false;
    }
    // If on the same row
    else if (hero.row === end.row) {
        // If location is left
        if (hero.col > end.col) {
            // If next cell is clear
            if (map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                moveHero('move-left');
            }
            // If blocked
            else {
                // If not on bottom row, move down
                if (hero.row !== numberOfRows && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                    // Keep from geting stuck in a loop
                    if (hero.lastLocation.lastMove === 'move-down') {
                        moveHero('move-down');
                    }
                    else {
                        moveHero('move-up');
                    }
                }
                // Otherwise, move up
                else if (hero.row === numberOfRows && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                    // Keep from geting stuck in a loop
                    if (hero.lastLocation.lastMove === 'move-up') {
                        moveHero('move-up');
                    }
                    else {
                        moveHero('move-down');
                    }
                }
                else {
                    hero.fastTravel = false;
                }
            }
        }
        // If location is right
        else if (hero.col < end.col) {
            // If next cell is clear
            if (map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                moveHero('move-right');
            }
            // If blocked
            else {
                // If not on bottom row, move down
                if (hero.row !== numberOfRows && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                    // Keep from geting stuck in a loop
                    if (hero.lastLocation.lastMove === 'move-down') {
                        moveHero('move-down');
                    }
                    else {
                        moveHero('move-up');
                    }
                }
                // Otherwise, move up
                else if (hero.row === numberOfRows && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                    // Keep from geting stuck in a loop
                    if (hero.lastLocation.lastMove === 'move-up') {
                        moveHero('move-up');
                    }
                    else {
                        moveHero('move-down');
                    }
                }
                else {
                    hero.fastTravel = false;
                }
            }
        }
    }
    // If target location is up
    else if (hero.row > end.row && direction === 'vertical') {
        // If next cell is clear
        if (map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
            moveHero('move-up');
        }
        // If blocked
        else {
            // If not on right most column, move right
            if (hero.col !== numberOfColumns && map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-right') {
                    moveHero('move-right');
                }
                else {
                    moveHero('move-left');
                }
            }
            // Otherwise, move left
            else if (hero.col === numberOfColumns && map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-left') {
                    moveHero('move-left');
                }
                else {
                    moveHero('move-right');
                }
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    // If target location is down
    else if (hero.row < end.row && direction === 'vertical') {
        // If next cell is clear
        if (map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
            moveHero('move-down');
        }
        // If blocked
        else {
            // If target is to the left
            if (hero.col > end.col || hero.col === numberOfColumns && map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-left') {
                    moveHero('move-left');
                }
                else {
                    moveHero('move-right');
                }
            }
            // If not on right most column, move right
            else if (hero.col !== numberOfColumns && map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-right') {
                    moveHero('move-right');
                }
                else {
                    moveHero('move-left');
                }
            }
            else {
                hero.fastTravel = false;
            }
        }
    }

    // If target location is left
    else if (hero.col > end.col && direction === 'horizontal') {
        // If next cell is clear
        if (map[hero.row - 1][hero.col - 2].contents !== 'blocked' && map[hero.row - 1][hero.col - 2].enemy.length === 0) {
            moveHero('move-left');
        }
        // If blocked
        else {
            // If target location is down
            if (hero.row < end.row && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-down') {
                    moveHero('move-down');
                }
                else {
                    moveHero('move-up');
                }
            }   
            // If target is up
            else if (hero.row > end.row && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-up') {
                    moveHero('move-up');
                }
                else {
                    moveHero('move-down');
                }
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    // If target location is right
    else if (hero.col < end.col && direction === 'horizontal') {
        // If next cell is clear
        if (map[hero.row - 1][hero.col].contents !== 'blocked' && map[hero.row - 1][hero.col].enemy.length === 0) {
            moveHero('move-right');
        }
        // If blocked
        else {
            // If target location is down
            if (hero.row < end.row && map[hero.row][hero.col - 1].contents !== 'blocked' && map[hero.row][hero.col - 1].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-down') {
                    moveHero('move-down');
                }
                else {
                    moveHero('move-up');
                }
            }   
            // If target is up
            else if (hero.row > end.row && map[hero.row - 2][hero.col - 1].contents !== 'blocked' && map[hero.row - 2][hero.col - 1].enemy.length === 0) {
                // Keep from geting stuck in a loop
                if (hero.lastLocation.lastMove === 'move-up') {
                    moveHero('move-up');
                }
                else {
                    moveHero('move-down');
                }
            }
            else {
                hero.fastTravel = false;
            }
        }
    }
    else {
        hero.fastTravel = false;
    }
}


// Check collision of movement, and move accordingly
function moveHero(move) {
    if (hero.canMove && hero.health > 0 && hero !== null) {
        cooldown(hero,hero.cooldownTimer);
        var munchLocation = map[hero.row - 1][hero.col - 1];
        hero.lastLocation = munchLocation;
        hero.lastLocation.lastMove = move;
        if (move === 'move-up') {
            if (hero.row === 1) {

            }
            else {
                var mapLocation = map[hero.row - 2][hero.col - 1];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
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
        else if (move === 'move-down') {
            if (hero.row === numberOfRows) {

            }
            else {
                var mapLocation = map[hero.row][hero.col - 1];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
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
        else if (move === 'move-left') {
            if (hero.col === 1) {

            }
            else {
                var mapLocation = map[hero.row - 1][hero.col - 2];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
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
        else if (move === 'move-right') {
            if (hero.col === numberOfColumns) {
            }
            else {
                var mapLocation = map[hero.row - 1][hero.col];
                if (mapLocation.enemy.length > 0) {
                    var name = mapLocation.enemy[0];
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
        if (hero.location === levelExit.id && hero.answers >= hero.answersNeeded) {
            if (hero.bossLevel && hero.bossIsDead || hero.bossLevel === false) {
                hero.canMove = false;
                hero.gameLevel++;
                if (hero.bossLevel && hero.bossIsDead) {
                    hero.knights.splice(0,3);
                }
                if (options.tutorial) {
                    options.tutorial = false;
                }
                // Save game to local storage
                localStorage.setItem('savedGame', JSON.stringify(hero));
                localStorage.setItem('options', JSON.stringify(options));
                if (hero.knights.length === 0) {
                    options.endgame = true;
                    startGame();
                }
                else {
                    awardXp('level');
                    startGame();
                }
            }
        }
    }
}

/////////////// ATTACK_PLAYER ///////////////

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
                    var original = attackerContainer.style.zIndex;
                    attackerContainer.style.zIndex = 25;
                    attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + (attacker.top - (cellSize / 2)) + 'px)';
                    setTimeout(function() { 
                        attackerContainer.style.transform = 'translate(' + attacker.left + 'px, ' + attackerTop + 'px)';
                        setTimeout(function() {
                            attackerContainer.style.zIndex = original;
                        }, 200);
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
                    if (victim.boss) {
                        if (victim.type === 'Red Knight') {
                            var healthBar = document.getElementById('boss-health-redknight');
                        }
                        else if (victim.type === 'Blue Knight') {
                            var healthBar = document.getElementById('boss-health-blueknight');
                        }
                        else if (victim.type === 'Yellow Knight') {
                            var healthBar = document.getElementById('boss-health-yellowknight');
                        }
                        else {
                            var healthBar = document.getElementById('boss-health');
                        }

                            healthBar.style.opacity = '1';
                            healthBar.style.width = (victim.health / victim.startingHealth) * 100 + '%';
                    }
                    if (victim.health <= 0) {
                        if (victim.object) {
                            delete map[victim.row - 1][victim.col - 1].health;
                            var object = document.querySelector('#' + victim.location + ' img');
                                object.style.opacity = '0';
                                object.parentElement.classList.remove('torch');
                            // If it is a column
                            if (victim.object === 'wall') {
                                // Remove from columnArray
                                var colIndex = columnArray.map(function(e) { return e.location; }).indexOf(victim.location);
                                columnArray.splice(colIndex,1);
                                victim.contents = 'empty';
                            }
                            else {
                                rollLoot(victim);
                            }
                        }
                        else {
                            map[victim.row - 1][victim.col - 1].enemy.splice(0,1);
                            var enemyIndex = enemies.map(function(e) { return e.id; }).indexOf(victim.id);
                            enemies.splice(enemyIndex,1);
                            victimContainer.style.opacity = '0';
                            setTimeout(function() {
                                victimContainer.remove();
                            }, 350);
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
function flashMessage(person,message,time) {
    var msg = document.querySelector('#' + person.id + ' .message');
    if (msg === null || hero.health <= 0) {
        return;
    }
    else {
            msg.innerHTML = message;
            msg.style.display = 'flex';
            msg.style.opacity = '0';
            if (time) {
                var duration = time / 1000;
            }
            else {
                var duration = 0.7;
            }
            msg.style.animation = 'flash-message ' + duration + 's 1 forwards';
        setTimeout(function() {
            msg.style.display = 'none';
        }, duration * 1000);
    }
}


// Deal damage depending on what healing method is passed to the function
function dealDamage(amount,source) {
    if (source.hasOwnProperty('attackRating')) {
        amount *= source.attackRating;
    }
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
        // If they ran out of time
        else if (source === 'time') {
            var deathBy = deathText.time[randomNumber(0,deathText.time.length - 1)];
        }
        // If it was an enemy
        else if (source.enemy) {
            if (source.type === 'Bat') {
                var deathBy = deathText.bat[randomNumber(0,deathText.bat.length - 1)];
            }
            else if (source.type === 'Gelatinous Cube') {
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
            else if (source.type === 'Spider Queen') {
                var deathBy = deathText.spiderQueen[randomNumber(0,deathText.spiderQueen.length - 1)];
            }
            else if (source.type === 'Vampire Lord') {
                var deathBy = deathText.vampireLord[randomNumber(0,deathText.vampireLord.length - 1)];
            }
            else if (source.type === 'Red Knight' || source.type === 'Blue Knight' ||source.type === 'Yellow Knight') {
                var deathBy = deathText.threeKnights[randomNumber(0,deathText.threeKnights.length - 1)];
            }
        }
        youDied(deathBy);
    }
    else {
        healthBar.style.width = hero.health + '%';
    }
}
/////////////// TUTORIAL ///////////////

var rescueText =    ['Hail, and well met!',
                    'You&apos;re here to rescue us? Inconceivable!',
                    'You are the greatest swordsman that ever lived!',
                    'Thank you!',
                    'It was starting to get really boring in here...',
                    'This place totally stinks, thank you for rescuing us!',
                    'I can&apos;t wait to go home and get on the internet again!',
                    'I knew you would come for us!',
                    'You&apos;re awesome!',
                    'I hate spiders!',
                    'I thought we were done for!',
                    'Did you bring anything to eat with you? I&apos;m starving!',
                    'You&apos;re the coolest.',
                    'Have you found the others?',
                    'You were always my favorite. Thank you!'];

// Display story and message text on screen
var multipart = 0;
function textBubble(msg,delay) {
    if (delay === undefined) {
        delay = 2000;
    }
    if (multipart === 'done') {
        multipart = 0;
    }
    hero.pause = true;
    hero.canMove = false;
    tutorialData.proceed = false;
    setTimeout(function() {
        var overlay = document.getElementById('level-splash');
            overlay.innerHTML = '';
            overlay.style.opacity = '0';
            overlay.style.display = 'flex';
        var bubble = document.createElement('div');
            bubble.style.backgroundColor = 'rgba(0,0,0,0.8)';

        // If a multi part message is received
        if (Array.isArray(msg) && multipart < msg.length) {
            if (msg[0] === 'theend') {
                bubble.innerHTML = '<h5>- The End -</h5>';
            }
            else {
                bubble.innerHTML = msg[multipart];
            }
            multipart++;
        }
        else {
            // If rescuing a knight
            if (msg === 'rescue') {
                var knight1 = document.createElement('p');
                    knight1.style.color = hero.knights[0].color;
                    knight1.innerHTML = hero.knights[0].rescueText;
                    bubble.appendChild(knight1);
                var knight2 = document.createElement('p');
                    knight2.style.color = hero.knights[1].color;
                    knight2.innerHTML = hero.knights[1].rescueText;
                    bubble.appendChild(knight2);
                var knight3 = document.createElement('p');
                    knight3.style.color = hero.knights[2].color;
                    knight3.innerHTML = hero.knights[2].rescueText;
                    bubble.appendChild(knight3);
            }
            else {
                bubble.innerHTML = msg;
            }
        }

        // Close message after clicking on it
        setTimeout(function() {
            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fade-in 1s 1 forwards';
                setTimeout(function() {
                    tutorialData.proceed = true;
                    hero.canMove = true;
                    hero.pause = false;
                    overlay.style.display = 'none';
                    if (Array.isArray(msg) && multipart < msg.length) {
                        textBubble(msg,delay);
                    }
                    else if (multipart >= msg.length) {
                        multipart = 'done';
                    }
                }, 1000);
            });
        }, 1000);

        overlay.appendChild(bubble);
        overlay.style.animation = 'fade-out 1s 1 forwards';
    }, delay);
}


// Settings for tutorial
var tutorialData = {
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


// Run the tutorial level for new players
function startTutorial() {

    var message = 'Welcome to Number Knight!<br />Tap here to get started.';
    textBubble(message);
    hero.evasion = 100;
    hero.canCapture = false;

    // TUTORIAL SECTION - Show movement buttons
    var showButtons = setInterval(function() {
        if (tutorialData.proceed) {
            clearInterval(showButtons);
            var moveButtons = [];
                moveButtons.push(moveUp,moveRight,moveDown,moveLeft);
            var i = 0;
            var interval = setInterval(function() {
                if (i >= moveButtons.length) {
                    clearInterval(interval);
                }
                else {
                    moveButtons[i].style.animation = 'fade-out 0.5s 1 forwards';
                    i++;
                }
            }, 250);
            var message = 'Tap the arrows to move around, or use the arrow keys if you have a keyboard.';
            textBubble(message,2000);
            teachMovement();
        }
    }, 250);

    // TUTORIAL SECTION - Teach basic movement to player
    function teachMovement() {
        hero.squaresMoved = 0;
        var moveOnce = setInterval(function() {
            if (hero.squaresMoved >= 2) {
                clearInterval(moveOnce);
                var message = 'Great. Now auto move to the highlighted square by tapping on it.';
                tutorialData.highlightedSquare = map[0][numberOfColumns - 1].location,
                textBubble(message,0);
                setTimeout(function() {
                    var square = document.getElementById(tutorialData.highlightedSquare);
                        square.style.border = '2px solid rgba(0,0,0,0)';
                        square.style.borderRadius = '6px';
                        square.style.transition = 'border-color 1s';
                        square.style.borderColor = 'rgba(255,215,0,1)';
                }, 1000);
            }
        }, 250);
        var moveToSquare = setInterval(function() {
            if (hero.location === map[0][numberOfColumns - 1].location) {
                clearInterval(moveToSquare);
                var message = 'See those 2 traps? Go step on one and see what happens.';
                textBubble(message,0);
                setTimeout(function() {
                    var square = document.getElementById(tutorialData.highlightedSquare);
                        square.style.borderColor = 'rgba(47,45,37,0.5)';
                    var moveButtons = [];
                        moveButtons.push(moveUp,moveRight,moveDown,moveLeft);
                    for (var i = 0; i < moveButtons.length; i++) {
                        moveButtons[i].style.animation = 'fade-in 0.5s 1 forwards';
                    }
                    setTimeout(function() {
                        for (var i = 0; i < moveButtons.length; i++) {
                            moveButtons[i].style.opacity = 0;
                        }
                        teachTraps();
                    }, 500);
                }, 500);
            }
        }, 250);
    }

    // TUTORIAL SECTION - Teach player about damage from traps
    function teachTraps() {
        hero.squaresMoved = 0;
        hero.evasion = 0;
        document.getElementById('healthbar').style.opacity = 1;
        for (var i = 0; i < 2; i++) {
            document.getElementById(trapArray[i].location).style.border = '2px solid rgba(0,0,0,0)';
            document.getElementById(trapArray[i].location).style.borderRadius = '6px';
            document.getElementById(trapArray[i].location).style.transition = 'border-color 1s';
            document.getElementById(trapArray[i].location).style.borderColor = 'rgba(226,39,39,1)';
        }
        var interval = setInterval(function() {
            if (hero.squaresMoved >= 2) {
                clearInterval(interval);
                for (var i = 0; i < 2; i++) {
                    document.getElementById(trapArray[i].location).style.borderColor = 'rgba(47,45,37,0.5)';
                }
            }
        }, 250);
        var takeDamage = setInterval(function() {
            if (hero.health < 100) {
                clearInterval(takeDamage);
                var message = 'Ouch! Break open one of these containers and find something to heal yourself with.';
                textBubble(message,500);
                hero.evasion = 100;
                teachLooting();
            }
        }, 250);
    }


    // TUTORIAL SECTION - Teach player how to break objects and find loot
    function teachLooting() {
        var object1 = document.getElementById(map[0][0].location);
        var object2 = document.getElementById(map[numberOfRows - 1][numberOfColumns - 1].location);
        var objects = [];
            objects.push(object1,object2);
        for (var i = 0; i < 2; i++) {
            objects[i].style.border = '2px solid rgba(0,0,0,0)';
            objects[i].style.borderRadius = '6px';
            objects[i].style.transition = 'border-color 1s';
            objects[i].style.borderColor = 'rgba(255,215,0,1)';
        }
        hero.squaresMoved = 0;
        var interval = setInterval(function() {
            if (hero.squaresMoved > 0) {
                var objects = document.querySelectorAll('.cell');
                for (var i = 0; i < objects.length; i++) {
                    objects[i].style.borderColor = 'rgba(47,45,37,0.5)';
                }
            }
            if (hero.health === 100) {
                clearInterval(interval);
                teachMath();
            }
        }, 250);
    }


    // TUTORIAL SECTION - Teach the player how to match
    function teachMath() {
        var message = 'What would a dungeon be without math?';
        textBubble(message,1000);
        var mathTutorial = document.querySelectorAll('.cell p');
        var i = 0;
        var interval = setInterval(function() {
            if (i >= mathTutorial.length) {
                clearInterval(interval);
                document.querySelector('#top-bar .btn-options').style.pointerEvents = 'auto';
                document.getElementById('top-bar').style.opacity = 1;
                continueMath();
            }
            else if (tutorialData.proceed) {
                mathTutorial[i].style.opacity = 1;
                i++;
            }
        }, 100);
        function continueMath() {
            var message = 'Stand on top of the nearest Multiple of 10, and capture the tile by tapping on your player, or by pressing the spacebar.';
            textBubble(message,500);
            hero.canCapture = true;
            var interval = setInterval(function() {
                if (hero.answers > 0) {
                    var message = 'Great! Now capture a few more.';
                    textBubble(message,0);
                    clearInterval(interval);
                }
            }, 250);
            var moreMath = setInterval(function() {
                if (hero.answers > 2 && tutorialData.proceed) {
                    teachCombat();
                    clearInterval(moreMath);
                }
            }, 250);
        }
    }


    // TUTORIAL SECTION - Teach the player how to deal with enemies
    function teachCombat() {
        hero.canCapture = false;
        hero.enemiesSlain = 0;
        var message = "It wouldn't be a proper dungeon without monsters now would it?";
        textBubble(message,0);
        var interval = setInterval(function() {
            if (tutorialData.proceed) {
                letTheGamesBegin();
                document.getElementById('xpbar').style.opacity = 1;
                clearInterval(interval);
                var message = 'Stand next to an enemy and tap on it to attack. Watch out for the pools of acid!';
                textBubble(message,2500);
            }
        }, 250);
        var slayMonster = setInterval(function() {
            if (hero.enemiesSlain > 0) {
                hero.canCapture = true;
                var message = "To proceed deeper into the dungeon capture any remaining tiles.";
                textBubble(message,0);
                clearInterval(slayMonster);
                finishUp();
            }
        }, 250);
    }

    // TUTORIAL SECTION - Finish up the tutorial and lay out the story
    function finishUp() {
        var interval = setInterval(function() {
            if (hero.answers >= hero.answersNeeded) {
                var message = ['Your training is complete, but your journey is just beginning...',
                    'You are the only remaining Number Knight. The others have all been captured by the foul beasts within this dungeon.',
                    'It is up to you and you alone to rescue them and return peace and safety to this world once again.<br /><br />Good luck!'];
                textBubble(message,500);
                clearInterval(interval);
            }
        }, 250);
        var final = setInterval(function() {
            if (multipart === 'done') {
                setTimeout(function() {
                    clearInterval(final);
                    options.tutorial = false;
                    options.newgame = false;
                    openExitCover();
                    restoreHealth(100);
                    hero.evasion = 10;
                }, 1000);
            }
        }, 250);
    }
}
/////////////// DEATH ///////////////

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
function fadeToMainMenu(callback) {
    fadeOut();
    setTimeout(function() {
        try {
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
            titleButtons();
            setTimeout(function() {
                callback();
            }, 500);
        } catch(e) {}
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

    fireGrate:  ['Got a little too fired up by a fire grate.',
                'Got served up extra crispy by a fire grate.',
                'Cooked to perfection by a fire grate.',
                'Killed by a fire grate.',
                'Tripped and fell into a fire grate.',
                'Do you smell what the dungeon is cookin? Fire grate does.'],

    math:       ['Forgot how to math.',
                'Left their calculator at home.',
                'Didn&apos;t pay attention in math class.',
                'Got mathed upside the head.',
                'Got in a fight with a number and lost.',
                'Couldn&apos;t math their way out of a paper bag.',
                'Death by math.',
                'Killed by numbers.',
                'Math is hard.'],

    time:       ['Ran out of time.'],

    bat:        ['Nibbled to death by a bat.',
                'Killed by a flying rat.',
                'Got one too many bats to the face.',
                'Death by bats.',
                'Lost a fight to a bat.',
                'Ran into a bats mouth face first.'],

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
                'Died valiantly while battling an Oculord.',
                'Death by Oculord.',
                'Eaten by a one-eyed flying meatball.',
                'Put food on the table for a family of Oculords.'],
                
    vampire:    ['Killed by a vampire.',
                'Got a very aggressive hickey from a vampire.',
                'Was the main course at the all you can eat vampire buffet.',
                'Decided to help out a starving vampire in need.',
                'Gave a vampire a tall glass of Blood Light.',
                'Got a big sloppy, bloody kiss from a vampire.'],

    spiderQueen:    ['Food for Spider Queen babies.',
                    'I still hate spiders. Why did I put a gigantic one that shoots poison in my game??',
                    'Put food on the table for a family of spiders.',
                    'Got wrapped up like a Christmas present for some hungry spider kids.',
                    'Eaten by a big mommy spider.',
                    'Tried to headbutt the Spider Queen, but got eaten instead.'],

    vampireLord:    ['Killed by the Vampire Lord.',
                    'Frozen. Bitten. And drained of all life by the Vampire Lord.',
                    'The Vampire Lord does not like non-vampires.',
                    'Got turned into a vampire by the Vampire Lord. So I guess that&apos;s pretty cool.',
                    'Vampire Lord thanks you for the delicious blood.',
                    'More blood for the vampire lord.'],

    threeKnights:   ['Was defeated by The Three Knights.'],
}


// The player won, show a scene and end game
function theEnd() {
    heroContainer.style.opacity = '0';
    var topBar = document.getElementById('top-bar');
        topBar.style.opacity = '0';
    var bottomBar = document.getElementById('bottom-bar');
        bottomBar.style.opacity = '0';
    hero.canMove = false;
    fadeIn();
    var message1 =  ['The Number Knights have been reunited and are now stronger than ever.',
                    'The evil beasts within this dungeon have all been slain, and peace has once again returned to this world.',
                    'Thank you for playing!'];
    textBubble(message1);
    var interval = setInterval(function() {
        if (multipart === 'done') {
            clearInterval(interval);
            var message2 = ['theend'];
            textBubble(message2,3000);
            var ending = setInterval(function() {
                if (multipart === 'done') {
                    clearInterval(ending);
                    youDied('Quest Complete');
                    setTimeout(function() {
                        heroContainer.style.opacity = '1';
                        topBar.style.opacity = '1';
                        bottomBar.style.opacity = '1';
                    }, 1000);
                    options.endgame = false;
                    localStorage.setItem('options', JSON.stringify(options));
                }
            }, 500);
        }
    }, 500);
}
/////////////// UTILITIES ///////////////

// Randomize loot drop
function rollLoot(victim) {
    if (options.tutorial || randomNumber(1,100) <= lootChance) {
        var lootType = loot[randomNumber(0,loot.length - 1)];
        var lootAmount = lootType.amount[randomNumber(0,lootType.amount.length - 1)];
        if (options.tutorial && options.newgame) {
            lootType = loot[0];
            lootAmount = lootType.amount[2];
        }
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


// Freeze anyone who walks through ice for set number of seconds
function freezePerson(person,duration,type) {
    person.canMove = false;
    person.frozen = true;
    var timer = document.getElementById('hero-status');
        timer.style.width = '100%';
    if (type === 'ice') {
        if (hero.hero) {
            hero.timesFrozen++;
        }
        flashMessage(person,'frozen!',duration);
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
        person.frozen = false;
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
        if (location.trapType === 'ice') {
            var duration = location.trapDuration;
            freezePerson(hero,duration,'ice');
            flashMessage(hero,'frozen!',duration);
        }
        else if (location.trapType === 'web') {
            hero.timesWebbed++;
            var duration = location.trapDuration;
            freezePerson(hero,duration,'web');
            flashMessage(hero,'trapped!',duration);
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
            if (options.tutorial && options.newgame) {
                restoreHealth(100);
            }
            else {
                restoreHealth(location.loot.amount);
            }
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
            localStorage.setItem('savedGame', JSON.stringify(hero));
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
    var str = [0,0,1.2,1.5,1.9,2.5];
    var dex = [0,0,18,28,40,55];
    var end = [0,0,0.95,0.85,0.72,0.5];
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
        strLvl.innerHTML = 'MAX';
        changeStr.innerHTML = Math.round(hero.baseDamage * hero.attackRating);
    }
    else {
        changeStr.innerHTML = Math.round((hero.baseDamage * hero.attackRating)) + ' -> ' + Math.round((hero.baseDamage * str[hero.strength + 1]));
    }
    var changeDex = document.getElementById('add-dex');
    if (hero.dexterity === (dex.length - 1)) {
        dexLvl.innerHTML = 'MAX';
        changeDex.innerHTML = hero.evasion + '%';
    }
    else {
        changeDex.innerHTML = hero.evasion + '% -> ' + dex[hero.dexterity + 1] + '%';
    }
    var changeEnd = document.getElementById('add-end');
    if (hero.endurance === (end.length - 1)) {
        endLvl.innerHTML = 'MAX';
        changeEnd.innerHTML = (hero.armorRating * 100) + '%';
    }
    else {
        changeEnd.innerHTML = (hero.armorRating * 100) + '% -> ' + (end[hero.endurance + 1] * 100) + '%';
    }

    for (var i = 0; i < choices.length; i++) {
        choices[i].addEventListener('click', function(e) {
            for (var i = 0; i < choices.length; i++) {
                choices[i].style.backgroundColor = 'rgba(0,0,0,0)';
                choices[i].style.outlineColor = 'rgba(0,0,0,0)';
            }
            this.style.backgroundColor = 'rgba(255,255,255,0.07)';
            this.style.outlineColor = '#ffd700';
            selection = this.classList[1];
        });
    }
    var button = document.querySelector('#level-up-menu button');
        button.addEventListener('click', function() {
            var done = false;
            if (selection === 'strength' && hero.strength < (str.length - 1)) {
                hero.strength++;
                hero.attackRating = str[hero.strength];
                done = true;
            }
            else if (selection === 'dexterity' && hero.dexterity < (dex.length - 1)) {
                hero.dexterity++;
                hero.evasion = dex[hero.dexterity];
                done = true;
            }
            else if (selection === 'endurance' && hero.endurance < (end.length - 1)) {
                hero.endurance++;
                hero.armorRating = end[hero.endurance];
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
                    choices[i].style.backgroundColor = 'rgba(0,0,0,0)';
                    choices[i].style.outlineColor = 'rgba(0,0,0,0)';
                }
                selection = null;
                var elClone = button.cloneNode(true);
                button.parentNode.replaceChild(elClone, button);
            }
        });
}


// Add a cooldown to a skill if needed
function cooldown(person,duration) {
    // For the player
    if (person.hero) {
        hero.canMove = false;
    }
    // For enemies
    else {
        person.cooldown = true;
    }
    setTimeout(function() {
        if (person.hero) {
            if (hero.frozen) {

            }
            else {
                hero.canMove = true;
            }
        }
        else {
            person.cooldown = false;
        }
    }, duration);
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
// You filthy cheater
function cheat() {
    hero.answers = hero.answersNeeded - 1;
    hero.gameLevel = 5;
    options.gold += 350;
}
//# sourceMappingURL=app.js.map
