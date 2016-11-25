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
                if (fallenHeroes[i].death === 'Quest Complete') {
                    entry += '<p class="complete">' + fallenHeroes[i].death + '</p>';
                }
                else {
                    entry += '<p>' + fallenHeroes[i].death + '</p>';
                }
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


// Display information about the different game modes
function showGamemodes(e) {
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
        list += '<div class="row"><button class="btn-back"></button></div>';

        tutorial.innerHTML = list;

    var backButton = document.querySelector('#tutorial .btn-back');
        backButton.addEventListener('click', function() {
            localStorage.setItem('options', JSON.stringify(options));
            tutorial.style.display = 'none';
            tutorial.innerHTML = '';
        });

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
        if (monster === undefined) {
            var monster = bosses.filter(function(monster) {
                return monster.type === options.enemiesEncountered[i];
            })[0];
        }
        list += '<div class="row"><div class="col-2">';
        list += '<img src="img/enemies/' + monster.image + '"></div>';
        list += '<div class="col-9"><p>' + monster.type + '</p>';
        list += '<p>' + monster.info + '</p></div></div>';  
    }

    gameOverScreen.innerHTML = list;

    var container = document.createElement('div');
    var button = document.createElement('button');
        button.className = 'main-menu-button';
        container.appendChild(button);
        gameOverScreen.appendChild(container);

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
        stats += '<div><button class="main-menu-button">Main menu</button></div>';
        gameOverScreen.innerHTML = stats;
        gameOverScreen.style.opacity = '0';
        gameOverScreen.style.display = 'flex';
        setTimeout(function() {
            gameOverScreen.style.opacity = '1';
        }, 200);
    if (view === 'game-over') {
        var mainMenuButton = document.querySelector('.main-menu-button');
            mainMenuButton.addEventListener('click', function() {
                fadeToMainMenu(fadeIn);
            });
    }
    else {
        var closeButton = document.querySelector('#game-over div .main-menu-button');
            closeButton.innerHTML = '';
            closeButton.className = 'btn-back';
            closeButton.style.paddingBottom = '25px';
            closeButton.addEventListener('click', function() {
                gameOverScreen.style.display = 'none';
            });
    }
}