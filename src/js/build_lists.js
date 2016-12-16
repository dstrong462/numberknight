/////////////// BUILD_LISTS ///////////////

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
                entry += '<span>Floor ' + fallenHeroes[i].gameLevel + '</span></div>';
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
        document.getElementById('btn-fallen-heroes').style.display = 'none';
    }
}


// Display information about the different game modes
function showGamemodes(e) {
    var tutorial = document.getElementById('tutorial');
        tutorial.innerHTML = '';
        tutorial.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    
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

        tutorial.innerHTML = list;
        tutorial.style.height = 'auto';

    var backButton = document.querySelector('#tutorial .btn-back');
        backButton.addEventListener('click', function() {
            localStorage.setItem('options', JSON.stringify(options));
            tutorial.style.display = 'none';
            tutorial.innerHTML = '';
        });

        tutorial.style.display = 'flex';
        tutorial.style.opacity = '1';
}


// Display bestiary
function displayBestiary() {
    var bestiaryScreen = document.getElementById('bestiary');
        bestiaryScreen.innerHTML = '';
        bestiaryScreen.style.backgroundImage = 'url("img/backgrounds/background-0' + randomNumber(1,backgrounds) + '.gif")';
    
    var list = '<h5>Monster Manual</h5>';

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

    bestiaryScreen.innerHTML = list;
    bestiaryScreen.style.height = 'auto';

    var button = document.createElement('button');
        button.className = 'btn-back';
        bestiaryScreen.appendChild(button);
        button.addEventListener('click', function() {
            bestiaryScreen.style.display = 'none';
            bestiaryScreen.innerHTML = '';
        });

    bestiaryScreen.style.display = 'flex';
    bestiaryScreen.style.opacity = '1';

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
        gameOverScreen.innerHTML = stats;
        gameOverScreen.style.opacity = '0';
        gameOverScreen.style.display = 'flex';
        setTimeout(function() {
            gameOverScreen.style.opacity = '1';
        }, 200);
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
    gameOverScreen.appendChild(button);
    gameOverScreen.style.height = 'auto';
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

    var store = '<h5>- Ye Olde Store -</h5><br />';
        store += '<p>Put your hard earned gold to good use with these unlockable items!</p><p>Or don&apos;t. It&apos;s your gold.</p><br />';
        storeScreen.innerHTML = store;

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
        storeScreen.appendChild(div);
    }

    var selection;

    function makeSelection() {
        selection = this.parentElement.id;
        makePurchase();
    }

    setTimeout(function() {
        storeScreen.style.display = 'flex';
        storeScreen.style.opacity = '1';
    }, 200);

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
        storeScreen.appendChild(buttonContainer);

        var gold = document.createElement('div');
            gold.classList.add('gold-total');
            gold.classList.add('gold-bottom');
            gold.innerHTML = '<img src="img/loot/gold-5.gif" alt="Gold Total"><span></span>';
        storeScreen.appendChild(gold);
        storeScreen.style.height = 'auto';

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