    // Define all abilities and their effects
    const abilityFunctions = {
        "Semblance of a Beast": function() {
            decreaseBossHealthByPercentagePerm(20); //done
        },
        "Song of Longing": function() {
            applyAttackBoost(1.2); //done
        },
        "SwordThrust": function() {
            dealDamageToBoss(200);  // Adjust the damage amount as needed (done)
        },
        "Handprint Momento": function() {
            crystals_multiplulier(2);
        },
        "Cumberstone": function() {
            increaseDifficultyBy(3); //done
        },
        "Gentle Black Roots": function() {
            //displayBossHealth();
            restoreAbilities(); //done
        },
        "Meno Paradox": function() {
            crystalsCount += 5; //done
            addXP(-10);
        },
        "Butterfly Dream": function() {
            //applyHealthDebuff(50); 
            pauseGameTimer(3000);
        },
        "Committ'st Knaveries": function() {
            applyHealthDebuff(50); //done
        },
        "Socratic Reponse": function() { 
            increaseTime(15); //done
            addXP(30);
        }
    };





// Function to execute the character's ability
function useCharacterAbility(character) {
    // Get the ability name from the character object
    const abilityName = character.ability;
    const abilityButton = document.querySelector(`button[data-ability="${character.ability}"]`);

    if (abilityButton) {
        abilityButton.disabled = true;  // Disable the button after ability is used
        abilityButton.classList.add('disabled'); // Add the CSS class to change color to red
    }


    // Look up the ability function in abilities.js
    const abilityFunction = abilityFunctions[abilityName];

    if (abilityFunction) {
        console.log(`${character.name} uses ability: ${abilityName}`);
        // Call the function with no parameters
        abilityFunction();
    } else {
        console.error(`Ability function ${abilityName} not found.`);
    }
}

//Rahamat ability
let sacrifice = 1;
function crystals_multiplulier(num) {
    sacrifice = num;
}



//Function for effects
function increaseTime(amount) {
    addTime(amount);
}


function dealDamageToBoss(damageAmount) {
    if (boss.currentHealth > 0) {

        // Apply total damage to the boss
        boss.currentHealth -= damageAmount;
        updateBossHealthBar();

        // Check if the boss is defeated
        if (boss.currentHealth <= 0) {
            bossDefeated();
        }
    }
}

function restoreAbilities() {
    enableAllAbilityButtons();
}


// Variable to track remaining difficulty levels for Robin ===================================================================
let debuffRemainingDifficulties = 0;

// Function to apply Mischief Maker effect
function applyHealthDebuff(percen) {
    // Apply the effect for the first time
    if (debuffRemainingDifficulties === 0) {
        decreaseBossHealthByPercentage(percen);  // Decrease health by 20%
        debuffRemainingDifficulties = 3;  // Set the effect for 3 difficulty levels
    } else {
        console.log('Mischief Maker effect already active.');
    }
}

// Function to decrease the boss's health by a percentage
function decreaseBossHealthByPercentage(percentage) {
    const healthDecrease = boss.currentHealth * (percentage / 100);
    boss.currentHealth -= healthDecrease;  // Deduct the percentage from the current health
    console.log(`Boss health decreased by ${percentage}%: ${healthDecrease} points.`);
    updateBossHealthBar();  // Update the UI to reflect the health change
}
//===========================================================================================================================

// Track if the health debuff has already been applied
let healthDebuffAppliedPerm = false;

// Function to apply a permanent health debuff
function decreaseBossHealthByPercentagePerm(percentage) {
    healthDebuffAppliedPerm = true;
    const healthDecrease = boss.currentHealth * (percentage / 100);
    boss.currentHealth -= healthDecrease;  // Deduct the percentage from the current health
    console.log(`Boss health decreased by ${percentage}%: ${healthDecrease} points.`);
    updateBossHealthBar();  // Update the UI to reflect the health change
}

function resetHealthDebuff() {
    healthDebuffAppliedPerm = false;
}

//Maheen ability
function increaseDifficultyBy(levels) {
    difficulty += levels;  // Increase the difficulty by the specified number
    console.log(`Difficulty increased by ${levels}. New difficulty level: ${difficulty}`);

    // Scale the boss health or apply any other difficulty-related changes
    boss.maxHealth = Math.floor(boss.maxHealth * Math.pow(1.06, levels));  // Increase the boss's max health by 6% per level
    boss.currentHealth = boss.maxHealth;  // Reset the current health to the new max health

    updateDifficultyDisplay();  // Update the difficulty on the UI
    updateBossHealthBar();  // Update the boss health bar on the UI
}

// Function to apply attack boost for 3 difficulty levels
function applyAttackBoost(atkbuff) {
    activeCharacters.forEach(character => {
        character.attack *= atkbuff;  // Increase attack by 30%
    });
    console.log("Attack boost applied.");

    // Store the current difficulty level at the time the boost is applied
    const boostedDifficulty = difficulty;

    // Check every time the difficulty increases if 3 levels have passed
    const checkDifficultyInterval = setInterval(() => {
        if (difficulty >= boostedDifficulty + 3) {
            // Revert the attack boost after 3 difficulties have passed
            activeCharacters.forEach(character => {
                character.attack /= atkbuff;  // Revert attack boost
            });
            console.log("Attack boost reverted after 3 difficulty levels.");

            clearInterval(checkDifficultyInterval);  // Stop checking once boost is reverted
        }
    }, 1000);  // Check every second if difficulty has increased by 3 levels
}


// Function to pause the game timer for 3 seconds
function pauseGameTimer(seconds) {
    clearInterval(timerInterval);  // Stop the timer

    setTimeout(() => {
        startTimer();  // Resume the timer after 3 seconds
        console.log('Time resumed after 3 seconds.');
    }, seconds);  // Pauses time for 3 seconds
}


// Function to display the boss's current health on the right side of the screen as plain text
function displayBossHealth() {
    let bossHealthElement = document.getElementById('bossHealthDisplay');

    if (!bossHealthElement) {
        // Directly create and append a span for boss health display
        bossHealthElement = document.createElement('span');
        bossHealthElement.id = 'bossHealthDisplay';
        bossHealthElement.style.position = 'fixed';
        bossHealthElement.style.top = '50%';  // Vertically centered
        bossHealthElement.style.right = '20px';  // Right side of the screen
        bossHealthElement.style.color = 'white';
        bossHealthElement.style.fontSize = '24px';  // Larger font for better visibility
        bossHealthElement.style.zIndex = '1000';  // Ensure it's on top of other elements
        bossHealthElement.style.transform = 'translateY(-50%)';  // Vertical center adjustment
        document.body.appendChild(bossHealthElement);
    }

    // Update the health display with current boss health (only the number)
    bossHealthElement.innerText = `${boss.currentHealth} / ${boss.maxHealth}`;
}

// Optional: Call this function to update the health display when the boss's health changes
function updateBossHealthDisplay() {
    const bossHealthElement = document.getElementById('bossHealthDisplay');
    if (bossHealthElement) {
        bossHealthElement.innerText = `${boss.currentHealth} / ${boss.maxHealth}`;
    }
}