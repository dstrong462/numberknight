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