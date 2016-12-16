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