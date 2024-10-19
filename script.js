let characters = [];
let inventory = {};
let activeCharacters = [];
let crystalsCount = 100;
let xp = 0;
let maxXP = 10000;
let boss = {
    name: 'Blind Man',
    maxHealth: 200,
    currentHealth: 200,
};

let abilities = {};
let difficulty = 1;  // Initialize difficulty at level 1
let initialTime = 21;
let timeLeft = 21;  // Starting time in seconds (1 minute)
let timerInterval;  // To store the interval for the timer

// Load the hitting sound effect
const hitSound = new Audio('audio/hit-sound.mp3'); // Make sure the path to your sound file is correct
hitSound.volume = 0.5; // Adjust volume between 0 (mute) and 1 (full volume)

// Load the hitting sound effect
const summonSound = new Audio('audio/summon-sound.mp3'); // Make sure the path to your sound file is correct
summonSound.volume = 0.3; // Adjust volume between 0 (mute) and 1 (full volume)
summonSound.playbackRate = 2;

// Load the hitting sound effect
const abilitySound = new Audio('audio/ability-sound.mp3'); // Make sure the path to your sound file is correct
abilitySound.volume = 0.5; // Adjust volume between 0 (mute) and 1 (full volume)

// Load the hitting sound effect
const clickSound = new Audio('audio/click-sound.mp3'); // Make sure the path to your sound file is correct
clickSound.volume = 0.5; // Adjust volume between 0 (mute) and 1 (full volume)
clickSound.playbackRate = 4;




// Initialize XP and crystals counters on page load
document.addEventListener("DOMContentLoaded", function() {
    updatecrystalsDisplay();  // Ensure the crystals counter is displayed right away
    updateXPDisplay();      // Initialize XP display
    updateBossHealthBar();  // Initialize boss health bar
    updateDifficultyDisplay();  // Display initial difficulty level
});

// Function to return to the main menu
function returnToMenu() {
    clickSound.play();
    document.getElementById('gameContent').style.display = 'none';
    document.getElementById('gachaContent').style.display = 'none';
    document.getElementById('inventoryModal').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    document.getElementById('mainMenu').style.display = 'flex';
    

    // Check and remove game over message, if it exists
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }

    // Stop the timer if it's running
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;  // Ensure the timer interval is cleared properly
    }
    
    // Update the UI for difficulty and boss health bar
    updateDifficultyDisplay();  // Reset difficulty display
    updateBossHealthBar();  // Reset health bar display
    enableAllAbilityButtons();
}

// Function to start the game
function startGame() {
    clickSound.play();
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContent').style.display = 'block';
    // Reset difficulty and boss health when leaving the game
    difficulty = 1;  // Reset difficulty back to 1
    boss.maxHealth = 200;  // Reset boss health to initial value
    boss.currentHealth = boss.maxHealth;  // Make sure current health is reset too
    resetFight();
    resetGame()
    // Update the boss health bar when re-entering
    updateBossHealthBar();
}

// Function to start the timer
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = initialTime;

    // Start a new interval that decreases the timer every second
    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;  // Decrease the time left by 1 second
            document.getElementById('timer').innerText = timeLeft;
            
        } else {
            gameOver();
        }
    }, 1000);  // Interval runs every 1 second
}

// Function to re-enable ability if timeLeft is divisible by 3
// function checkTimer() { 
//     if (timeLeft % 7 === 0) {
//         button.disabled = false;  // Re-enable the button if the time is divisible by 3
//     } else {
//         console.log(`Ability will be available when the time is divisible by 3. Current time: ${timeLeft}`);
//     }
// }


// Function to add extra time
function addTime(seconds) {
    timeLeft += seconds;  // Increase the remaining time
    document.getElementById('timer').innerText = timeLeft;  // Update the display
}

function gameOver() {
    // Create a div for the game over message
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';

    // Award 8 crystals points for each boss kill
    crystalsCount += (7*(difficulty-1));
    document.getElementById('crystalsCounter').innerText = crystalsCount;  // Update crystals counter at the top left

    let currentLevel = difficulty; // Assuming 'difficulty' is your current level
    saveLevel(currentLevel);
    

    // Style the game over message with the CSS you mentioned
    gameOverMessage.innerHTML = `
        <p>Game Over!</p>
        <p>Difficulty Level: ${difficulty}</p>
        <p>=================</p>
        <button class="replay-button" onclick="resetGame()">Replay</button>
        <button class="replay-button" onclick="returnToMenu()">Return to Main Menu</button>
    `;
    

    // Append the message to the body
    document.body.appendChild(gameOverMessage);

    // Stop the timer
    clearInterval(timerInterval);

    // Disable actions like attack if necessary
    document.getElementById('attackButton').disabled = true;
}

// Function to start the boss fight
function startBossFight() {
    boss.currentHealth = boss.maxHealth;
    updateBossHealthBar();
}

// Function to update the boss's health bar
function updateBossHealthBar() {
    const bossHealthPercentage = (boss.currentHealth / boss.maxHealth) * 100;
    document.getElementById('bossHealthBar').style.width = bossHealthPercentage + '%';
    if (boss.currentHealth <= 0) {
        bossDefeated();
    }
}

function basicAttack() {
    if (boss.currentHealth > 0) {
        let totalDamage = 10; // Total damage dealt by all active characters

        // Loop through each active character and calculate damage
        activeCharacters.forEach(character => {
            const damage = character.attack;
            totalDamage += damage;

            // Optional: You can still print the damage info for debugging
            console.log(`${character.name} dealt ${damage} damage to the boss!`);
        });

        // Apply total damage to the boss
        boss.currentHealth -= totalDamage;
        hitSound.play();
        updateBossHealthBar();
        updateBossHealthDisplay();

        // Log total damage dealt for debugging
        console.log(`Total damage dealt: ${totalDamage}`);

        // Check if the boss is defeated
        if (boss.currentHealth <= 0) {
            bossDefeated();
        }
    }
}

function updateBossHealthBar() {
    const bossHealthPercentage = (boss.currentHealth / boss.maxHealth) * 100;
    document.getElementById('bossHealthBar').style.width = bossHealthPercentage + '%';

    if (boss.currentHealth <= 0) {
        document.getElementById('bossHealthBar').style.width = '0%';
    }
}


// Example: Trigger ability for a specific character
function triggerAbility(characterName) {
    // Find the character by name
    const character = characters.find(char => char.name === characterName);
    console.error(`Character ${characterName} finding.`);

    if (character) {
        console.error(`Character ${characterName} found.`);
        abilitySound.play();
        useCharacterAbility(character);
    } else {
        console.error(`Character ${characterName} not found.`);
    }
}

// // Then use the abilities as shown before
// function useCharacterAbility(character) {
//     const ability = abilities[character.name];

//     if (ability) {
//         console.log(`${character.name} uses ability: ${ability.name}`);
//         console.log(ability.description);
//         // Execute ability logic here
//     } else {
//         console.error(`No ability found for ${character.name}`);
//     }
// }

// Function to handle boss defeat
function bossDefeated() {
    document.getElementById('bossStatus').innerText = "Boss Defeated!";
    // document.getElementById('attackButton').disabled = true;

    addXP(5);  // Award 5 XP per boss kill

    // Increase boss max health by 6%
    boss.maxHealth = Math.floor(boss.maxHealth * 1.06);  // Add 6% to boss max health
    difficulty++;  // Increase difficulty level

    // Check if Mischief Maker effect is active
    if (debuffRemainingDifficulties > 0) {
        debuffRemainingDifficulties--;  // Decrease the number of difficulties remaining
        if (debuffRemainingDifficulties > 0) {
            decreaseBossHealthByPercentage(20);  // Apply the 20% health decrease for this level
        } else {
            console.log('Mischief Maker effect has ended.');
        }
    }

    updateDifficultyDisplay();  // Update difficulty display
    resetFight();  // Reset the fight with the new health
    updateBossHealthDisplay();
}

// Function to reset the fight
function resetFight() {
    // document.getElementById('attackButton').disabled = false;
    boss.currentHealth = boss.maxHealth;
    updateBossHealthBar();
    document.getElementById('bossStatus').innerText = "";
}

// Function to reset the fight
function resetGame() {
    clickSound.play();
    // Remove the game over message from the screen
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        document.body.removeChild(gameOverMessage);  // Remove the message from the DOM
    }

    // document.getElementById('attackButton').disabled = false;
    boss.currentHealth = boss.maxHealth;
    difficulty = 1;
    
    // Reset the time left and update the display
    timeLeft = initialTime;
    document.getElementById('timer').innerText = timeLeft;
    startTimer();

    updateBossHealthBar();
    updateDifficultyDisplay();
    enableAllAbilityButtons();
    updateBossHealthDisplay();
    document.getElementById('attackButton').disabled = false;  // Re-enable the attack button
    abilityButtons.classList.remove('disabled'); // Add the CSS class to change color to red
    document.getElementById('bossStatus').innerText = "";
}

// Function to re-enable all ability buttons
function enableAllAbilityButtons() {
    const abilityButtons = document.querySelectorAll('.ability-button');  // Get all ability buttons
    abilityButtons.forEach(button => {
        button.disabled = false;  // Re-enable each button
        button.classList.remove('disabled'); // Add the CSS class to change color to red
    });
}


// Function to update the XP display
function updateXPDisplay() {
    document.getElementById('xpLabel').innerText = "XP: " + xp;
    document.getElementById('xpBar').value = xp;
}

// Function to add XP
function addXP(amount) {
    xp += amount;
    if (xp > maxXP) {
        xp = 0;
    }
    updateXPDisplay();
}


function updateDifficultyDisplay() {
    document.getElementById('difficultyLevel').innerText = "Level: " + difficulty;
}

// Function to open the Gacha section ==============================================================================================
function openGacha() {
    clickSound.play();
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gachaContent').style.display = 'block';
    updatecrystalsDisplay();
}


// Function to randomly select a character based on rarity
function getRandomCharacter() {
    const rarityProbabilities = {
        "Ultra-Rare": 0.01,
        "Super-Rare": 0.05,
        "Rare": 0.19,
        "Common": 0.75
    };

    // Calculate total probability
    let totalProbability = 0;
    characters.forEach(character => {
        totalProbability += rarityProbabilities[character.rarity];
    });

    // Generate a random number
    let random = Math.random() * totalProbability;
    let accumulatedProbability = 0;

    // Find the character based on the generated random number
    for (let i = 0; i < characters.length; i++) {
        accumulatedProbability += rarityProbabilities[characters[i].rarity];
        if (random < accumulatedProbability) {
            console.log("Randomly selected character:", characters[i]); // For debugging
            return characters[i];
        }
    }

    // Default to the first character if something goes wrong
    return characters[0];
}

// Function to update the crystals display in the Gacha section
function updatecrystalsDisplay() {
    document.getElementById('crystalsCounter').innerText = crystalsCount;
}

// Function to pull a character from the gacha
function pullGacha() {
    const crystalsCost = 5;
    if (crystalsCount >= crystalsCost) {
        crystalsCount -= crystalsCost;
        updatecrystalsDisplay();

        clickSound.play();
        summonSound.play();
        // Simulate the gacha process (e.g., after 3 seconds reveal the character)
        setTimeout(() => {
            // Stop the animation after 3 seconds
            gachaBall.classList.add('spin', 'glow');

            const character = getRandomCharacter();
            const resultDiv = document.getElementById('result');

            // Add an outer glow around the character container for dramatic reveal
            resultDiv.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; animation: fadeIn 1.5s ease;">
                    <img src="${character.image}" alt="${character.name}" style="width:300px; animation: bounceIn 1s ease;">
                </div>
            `;

            addItemToInventory(character);
            updateInventoryDisplay();

        }, 1000); // Wait for 3 seconds before showing the result (gacha spin time)
    } else {
        alert("You need at least 5 crystals to pull a character!");
    }
    // Start spinning the gacha ball and add the glow effect
    gachaBall.classList.remove('spin', 'glow');
}

// Function to get the color based on the character rarity
function getRarityColor(rarity) {
    switch (rarity) {
        case "Ultra-Rare": return "red";
        case "Super-Rare": return "purple";
        case "Rare": return "blue";
        case "Common": return "green";
    }
}

// Define stats based on rarity
const rarityStats = {
    "Common": {
        health: 100,
        attack: 9,
        defense: 5,
        speed: 3
    },
    "Rare": {
        health: 120,
        attack: 10,
        defense: 7,
        speed: 4
    },
    "Super-Rare": {
        health: 150,
        attack: 12,
        defense: 9,
        speed: 5
    },
    "Ultra-Rare": {
        health: 200,
        attack: 15,
        defense: 12,
        speed: 6
    }
};

// Function to assign stats to characters based on their rarity
function assignStats(character) {
    const stats = rarityStats[character.rarity];
    return {
        health: stats.health,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed
    };
}


// Function to add a character to the inventory
function addItemToInventory(character) {
    if (inventory[character.name]) {
        inventory[character.name].count++;
    } else {
        inventory[character.name] = {
            character: character,
            count: 1
        };
    }
}



// Function to open the inventory====================================================================================

fetch('characters.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load characters.json");
        }
        return response.json();
    })
    .then(data => {
        data.characters.forEach(character => {
            const stats = assignStats(character);  // Assign stats based on rarity
            character.health = stats.health;
            character.attack = stats.attack;
            character.defense = stats.defense;
            character.speed = stats.speed;
        });

        characters = data.characters;  // Store the characters in the global 'characters' array
        console.log('Characters loaded with stats:', characters); // Check stats applied
    })
    .catch(error => {
        console.error("Error loading characters:", error);
    });




function openInventory() {
    clickSound.play();
    document.getElementById('mainMenu').style.display = 'none';  // Hide the main menu
    document.getElementById('inventoryModal').style.display = 'block';  // Show the inventory modal
    updateInventoryDisplay();  // Update the inventory display to show current characters
}

// Function to update the inventory display
function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';

    for (let key in inventory) {
        let character = inventory[key].character;
        let count = inventory[key].count;

        // Apply a rarity class to the inventory item container
        const rarityClass = character.rarity.toLowerCase().replace(' ', '-'); // e.g., ultra-rare becomes ultra-rare


        const inventoryItem = `
            <div class="inventory-item ${rarityClass}" style="position: relative;">
                <img src="${character.image}" alt="${character.name}" style="width:160px; height:200px;">
                <p style="position: absolute; top: 0.5px; right: 10px; color: #000000; font-weight: bold;">
                    x${count}
                </p>
                <div class="button-container" style="display: flex; justify-content: space-between; margin-top: 10px;">
                    <button class="view-details-button" style="font-size: 10;" onclick="showCharacterDetails('${character.name}')">View Details</button>
                    <button class="select-character-button" onclick="selectCharacter('${character.name}')">Select</button>
                </div>
            </div>
        `;
        inventoryDiv.innerHTML += inventoryItem;
    }
}

// Function to show the character details
function showCharacterDetails(characterName) {
    const character = characters.find(char => char.name === characterName);
    if (character) {
        console.log(`View Details clicked for: ${characterName}`);  // Print in the console when "View Details" is clicked
        const characterDetailsDiv = document.getElementById('characterDetails');

        // Clear previous classes and add a new class based on rarity
        characterDetailsDiv.className = ''; // Clear any existing classes
        const rarityClass = character.rarity.toLowerCase().replace(' ', '-'); // Convert rarity to lowercase and replace spaces with hyphens
        characterDetailsDiv.classList.add('character-details', rarityClass);  // Add the corresponding rarity class
        
        characterDetailsDiv.innerHTML = `
            <h2 style="
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;">
            ${character.name} (${character.rarity})
            </h2>

            <img src="${character.char}" alt="${character.name}" style="width:200px; height:90%;">

            <p><strong>Ability:</strong> ${character.ability} - ${character.abilityDescription}</p>

            <p style="font-size: 16px; margin-bottom: 0;"><strong>Description:</strong> ${character.description}</p>
        `;
        openCharacterMenu();
    } else {
        console.log(`Character not found: ${characterName}`);  // Debugging output for missing characters
    }
}

// Function to show the modal
function openCharacterMenu() {
    clickSound.play();
    document.getElementById('characterMenu').style.display = 'block';
}

function closeCharacterMenu() {
    clickSound.play();
    document.getElementById('characterMenu').style.display = 'none';
}

// Function to update the selected characters display under the boss health bar
function updateSelectedCharactersDisplay() {
    const selectedCharactersContainer = document.getElementById('selectedCharactersContainer');

    // Clear any previous characters or attack buttons
    selectedCharactersContainer.innerHTML = '';

    if (activeCharacters.length === 0) {
        selectedCharactersContainer.innerHTML = '<p>No characters selected</p>';
    } else {
        activeCharacters.forEach((char) => {
            // Create a container to group character display and ability button
            const characterGroup = document.createElement('div');
            characterGroup.style.textAlign = 'center';
            characterGroup.style.marginBottom = '20px';

            // Create the character image and name display
            const charDisplay = `
                <img src="${char.char}" style= "width: 100px; margin-bottom: 20px;">
            `;

            characterGroup.innerHTML = charDisplay;

            // Ability button for the character
            const abilityButton = document.createElement('button');
            abilityButton.classList.add('ability-button');
            abilityButton.style.textAlign = 'center';
            abilityButton.style.position = 'relative';
            abilityButton.style.right = '160px';
            abilityButton.style.top = '20px';
            abilityButton.innerText = `${char.ability}`;
            abilityButton.setAttribute('data-ability', char.ability);  // Assign data-ability attribute
            abilityButton.onclick = () => useCharacterAbility(char); // Ability function for the character

            // Append the button group and character group to the containers
            characterGroup.appendChild(abilityButton);
            selectedCharactersContainer.appendChild(characterGroup);
        });
    }
}

// Function to select or deselect a character from the inventory
function selectCharacter(characterName) {
    const character = inventory[characterName].character;

    // Check if the character is already in the active characters array (selected)
    const characterIndex = activeCharacters.findIndex(char => char.name === characterName);

    if (characterIndex !== -1) {
        // If character is already selected, deselect it
        activeCharacters.splice(characterIndex, 1);
        console.log(`${characterName} has been deselected.`);
    } else if (activeCharacters.length < 3) {
        // If character is not selected, add it to active characters (max 3)
        activeCharacters.push(character);
        console.log(`${characterName} has been selected.`);
    } else {
        console.log("Maximum of 3 characters can be selected.");
    }

    // Update the display for selected characters
    updateSelectedCharactersDisplay();
    updateActiveCharactersDisplay()
}

// Function to update the active characters display
function updateActiveCharactersDisplay() {
    const activeCharactersDiv = document.getElementById('activeCharacters');
    activeCharactersDiv.innerHTML = '';
    activeCharacters.forEach(char => {
        activeCharactersDiv.innerHTML += `
            <div class="active-character">
                <img src="${char.char}" alt="${char.name}" style="width:100px;">
            </div>
        `;
    });
}

function openArchives() {
    clickSound.play();
    // Logic to display the Archives section or modal
    document.getElementById('mainMenu').style.display = 'none';  // Hide main menu
    document.getElementById('archiveModal').style.display = 'block';  // Show the Archives modal
    updateArchivesDisplay();  // Populate the archives content with characters
}

function closeArchives() {
    document.getElementById('archiveModal').style.display = 'none';  // Hide the Archives modal
    document.getElementById('mainMenu').style.display = 'flex';  // Show the main menu
    clickSound.play();
}

// Function to populate the Archives with all characters
function updateArchivesDisplay() {
    const archivesContent = document.getElementById('archivesContent');
    archivesContent.innerHTML = '';  // Clear previous content

    // Loop through all characters and display them
    characters.forEach(character => {
        const rarityClass = character.rarity.toLowerCase().replace(' ', '-'); // e.g., ultra-rare becomes ultra-rare

        const archiveItem = `
            <div class="inventory-item ${rarityClass}">
                <img src="${character.image}" alt="${character.name}" style="width:100px;">
                <p style="color: #FFFF;"><strong>Ability:</strong> ${character.ability}</p>
            </div>
        `;

        archivesContent.innerHTML += archiveItem;
    });
}

function openStory() {
    clickSound.play();
    window.open('story.html', '_self');  // Open in the same tab
}

//Achievement
// Function to save the current level when the game is over
function saveLevel(level) {
    let levels = JSON.parse(localStorage.getItem('achievements')) || [];
    levels.push(level);

    // Sort levels in descending order
    levels.sort((a, b) => b - a);

    // Store in local storage
    localStorage.setItem('achievements', JSON.stringify(levels));
}

// Function to load and display achievements
function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = ''; // Clear the list

    let levels = JSON.parse(localStorage.getItem('achievements')) || [];

    levels.forEach((level, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Level Reached: ${level}`;
        achievementsList.appendChild(listItem);
    });
}

function resetAchievements() {
    localStorage.removeItem('achievements'); // Remove the achievements key from local storage
    openAchievements();
}


// Function to open the achievements modal
function openAchievements() {
    loadAchievements();
    document.getElementById('achievementsModal').style.display = 'block';
}

// Function to close the achievements modal
function closeAchievements() {
    document.getElementById('achievementsModal').style.display = 'none';
}

