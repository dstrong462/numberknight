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
        info: 'The Number Mage is not a threat in the usual sense. They do almost no damage, but cast magic to cloud your mind and make equations more difficult to solve.'
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
        weight: 50,
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
                abilityDamge: 1.35,
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
                damageDuration: 1900,
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