var newestVersion = 20161221;

// Check version number and allow adding in new data or wiping stats as needed
(function updateGameData() {

    if (localStorage.getItem('options') !== null) {
        var retrievedOptions = localStorage.getItem('options');
            options = JSON.parse(retrievedOptions);

        if (options.version === newestVersion) {
            
        }
        else if (options.version < 20161216) {
            dataWipe();
        }
        else if (options.version < 20161220) {
            saveWipe();
        }
        gameUpdates();
    }

    // Update game data with any new data
    function gameUpdates() {
        // Make updates to saved game
        if (localStorage.getItem('savedGame') !== null) {
            var retrievedSave = localStorage.getItem('savedGame');
            var newHero = JSON.parse(retrievedSave);

            ////////// CHANGES HERE //////////

            newHero.cooldownCaptureTimer = 1000;

            //////////////////////////////////

            localStorage.setItem('savedGame', JSON.stringify(newHero));
        }

        options.version = newestVersion;
        localStorage.setItem('options', JSON.stringify(options));
    }

    // Wipe all data if needed
    function dataWipe() {
        if (localStorage.getItem('options') !== null) {
            localStorage.removeItem('options');
        }
        if (localStorage.getItem('savedGame') !== null) {
            localStorage.removeItem('savedGame');
        }
    }
    // Wipe saved game if needed
    function saveWipe() {
        if (localStorage.getItem('savedGame') !== null) {
            localStorage.removeItem('savedGame');
        }
        alert('Sorry, but due to code changes saved games will need to be wiped for this update.');
    }

}());