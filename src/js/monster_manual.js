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
        info: 'Description of the monster goes here. Description of the monster goes here. Description of the monster goes here. Description of the monster goes here. Description of the monster goes here.'
    },
    {
        type: 'Gelatinous Cube',
        boss: false,
        image: 'cube-green.gif',
        baseDamage: 10,
        health: 50,
        weight: 25,
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
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Giant Spider',
        boss: false,
        image: 'spider.gif',
        baseDamage: 10,
        health: 65,
        weight: 35,
        evasion: 15,
        moveInterval: 2000,
        moveSpeed: 0.35,
        moveType: 'passive',
        abilities: [
            {
                ability: 'web',
                abilityDamge: 0,
                abilityDuration: 12000,
                abilityChance: 10
            }
        ],
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Number Mage',
        boss: false,
        image: 'number-mage.gif',
        baseDamage: 5,
        health: 85,
        weight: 15,
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
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Oculord',
        boss: false,
        image: 'oculord.gif',
        baseDamage: 15,
        health: 100,
        weight: 50,
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
                abilityChance: 70,
                targetChance: 50
            }
        ],
        info: 'Description of the monster goes here.'
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
        info: 'Description of the monster goes here.'
    }
];


// My Boss Monster Manual
var bosses = [
    {
        type: 'Spider Queen',
        boss: true,
        image: 'spider-queen.gif',
        baseDamage: 10,
        health: 300,
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
                abilityDamge: 1.25,
                damageDuration: 3000,
                dotStatus: 'poisoned!',
                abilityDuration: 0.45,
                abilityChance: 90,
                targetChance: 100
            },
        ],
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Vampire Lord',
        boss: true,
        image: 'vampire-lord.gif',
        baseDamage: 10,
        health: 300,
        weight: 100,
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
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Red Knight',
        boss: true,
        image: 'red-knight.gif',
        baseDamage: 10,
        health: 150,
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
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Blue Knight',
        boss: true,
        image: 'blue-knight.gif',
        baseDamage: 10,
        health: 150,
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
                abilityDamge: 5,
                damageDuration: 1900,
                dotStatus: 'frozen!',
                abilityDuration: 0.9,
                abilityChance: 100,
                targetChance: 100
            },
        ],
        info: 'Description of the monster goes here.'
    },
    {
        type: 'Yellow Knight',
        boss: true,
        image: 'yellow-knight.gif',
        baseDamage: 10,
        health: 150,
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
        info: 'Description of the monster goes here.'
    }
];