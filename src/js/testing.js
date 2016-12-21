// You filthy cheater
function cheat() {
    hero.answers = hero.answersNeeded - 1;
    // hero.gameLevel = 5;
    // options.gold += 350;
}

var debugMenu = document.getElementById('debug');
var debugButton = document.getElementById('btn-debug');
    debugButton.addEventListener('click', function() {
        if (debugMenu.style.display === 'none') {
            debugMenu.style.display = 'flex';
            hero.pause = true;
        }
        else {
            debugMenu.style.display = 'none';
            hero.pause = false;
        }
    });

function debugDamage(amount,source,location) {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    if (source === 'trap') {
        if (location.object === 'spikes') {
            source = 'spikes';
        }
        else if (location.object === 'fire-grate') {
            source = 'fire-grate';
        }
        else if (location.trapType) {
            source = location.trapType;
        }
    }
    else if (source.enemy) {
        source = source.type;
    }
    if (debugMenu.childElementCount > 25) {
        var first = document.querySelector('#debug > p');
            first.remove();
    }
    var entry = document.createElement('p');
        entry.innerHTML = hours + ':' + minutes + ':' + seconds + ' - ' + amount  + ' dmg from ' + source;
        debugMenu.appendChild(entry);
}

function debugHero() {
    var box = document.getElementById('debug-hero');
    var loc = map[hero.row - 1][hero.col - 1];
    var stats = '<p><strong>Hero Data</strong></p>';
    for (var key in hero) {
        stats += '<p>' + key + ': ' + hero[key] + '</p>';
    }
        stats += '<br />';
        stats += '<p><strong>Current Cell</strong></p>';
    for (var key in loc) {
        stats += '<p>' + key + ': ' + loc[key] + '</p>';
    }
    stats += '<br />'
    box.innerHTML = stats;
}