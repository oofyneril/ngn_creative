let currentDialogIndex = 0;
let typingSpeed = 10; // Speed of typing in milliseconds
let letterIndex = 0;
let isTyping = false;
let previousCharacter = null;  // To store the previous character
let previousText = null;  // Keep track of the previous dialog text
let storyDialogs = [];
let autoProceed = false; // State for auto-proceeding
let autoProceedInterval; // Store the interval


// Load story from JSON
function loadStory() {
    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            storyDialogs = data.dialogs;  // Assign the JSON data to the storyDialogs array
            typeDialog();  // Start the story
        })
        .catch(error => console.error('Error loading story:', error));
}

// Load the hitting sound effect
const dialogSound = new Audio('audio/dialog-sound.mp3'); // Make sure the path to your sound file is correct
dialogSound.volume = 0.5; // Adjust volume between 0 (mute) and 1 (full volume)

// Function to go to the next dialog automatically
function autoProceedToNextDialog() {
    currentDialogIndex++;
    if (currentDialogIndex < storyDialogs.length) {
        setTimeout(typeDialog, 3000); // Wait 3 seconds before proceeding to the next dialog
    } else {
        stopAutoProceed(); // Stop if reached the end of the story
    }
}

// Function to toggle Auto Proceed on or off
function toggleAutoProceed() {
    autoProceed = !autoProceed;
    clickSound.play();
    const button = document.getElementById('toggleAutoButton');
    if (autoProceed) {
        button.innerText = 'Stop Auto Proceed';
        autoProceedInterval = setInterval(() => {
            if (!isTyping && currentDialogIndex < storyDialogs.length - 1) {
                currentDialogIndex++;
                typeDialog();
            }
        }, 3000); // Auto proceed every 3 seconds
    } else {
        button.innerText = 'Start Auto Proceed';
        clearInterval(autoProceedInterval);
    }
}

// Function to stop auto-proceed when reaching the end or by button click
function stopAutoProceed() {
    autoProceed = false;
    clearInterval(autoProceedInterval);
    document.getElementById('toggleAutoButton').innerText = 'Start Auto Proceed';
}


// Function to start typing the dialog letter by letter
function typeDialog() {
    clickSound.play();
    const dialogTextElement = document.getElementById('dialogText');
    const storyCharacter = document.getElementById('storyCharacter');
    const characterNameElement = document.getElementById('characterName'); // Define character name element

    const currentDialog = storyDialogs[currentDialogIndex];
    const text = currentDialog.text;
    const characterName = currentDialog.character; // Get character name from the current dialog

    // If the current text is the same as the previous, don't update anything
    if (text === previousText) {
        return;
    } else {
        // Update the previousText and previousCharacter to the current ones
        previousText = text;
        previousCharacter = currentDialog.characterImage;

        dialogTextElement.innerHTML = '';  // Clear previous dialog
        storyCharacter.src = currentDialog.characterImage;  // Set the character image
        characterNameElement.innerText = characterName;  // Set the character name

        // Add 'visible' class to transition character into view (you can style this in CSS for a smoother transition)
        setTimeout(() => {
            storyCharacter.classList.add('character-visible');
            characterNameElement.classList.add('character-visible'); // Apply the same effect to the name
            dialogSound.play();
        }, 60);  // Delay to give animation effect

        // Reset letterIndex for new dialog
        letterIndex = 0;
        isTyping = true;
        

        // Function to type each letter
        function typeLetter() {
            if (letterIndex < text.length) {
                document.getElementById('nextButton').disabled = true;
                document.getElementById('resetGameButton').disabled = true;
                dialogTextElement.innerHTML += text.charAt(letterIndex);
                letterIndex++;
                setTimeout(typeLetter, typingSpeed);  // Type the next letter after a delay
            } else {
                isTyping = false;  // Typing finished
                document.getElementById('nextButton').disabled = false;
                document.getElementById('resetGameButton').disabled = false;
                dialogSound.pause();

                // Auto proceed if enabled
                if (autoProceed && currentDialogIndex < storyDialogs.length - 1) {
                    autoProceedToNextDialog();
                }
            }
        }
        typeLetter();  // Start typing the first letter
    }  
}



// Function to move to the next dialog
function nextDialog() {
    if (isTyping) {
        document.getElementById('nextButton').disabled = true;  // Prevent skipping while typing
        document.getElementById('resetGameButton').disabled = true;
    }
    else if (currentDialogIndex < storyDialogs.length - 1) {
        document.getElementById('nextButton').disabled = true;  // Prevent skipping while typing
        document.getElementById('resetGameButton').disabled = true;
        currentDialogIndex++;
        typeDialog();
    } else {
        document.getElementById('nextButton').disabled = false;  // re enable next button at end of dialog
        document.getElementById('resetGameButton').disabled = false;
    }
}

// Function to open story mode
function openStoryMode() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('storyMode').style.display = 'block';
    clickSound.play();
    loadStory();  // Load story from JSON
    typeDialog();  // Start the first dialog
}

// Function to close story mode
function closeStoryMode() {
    document.getElementById('storyMode').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex';
    document.getElementById('nextButton').disabled = false;  // Re-enable next button
    clickSound.play();
}


// Function to reset story mode
function resetStoryMode() {
    clickSound.play();
    if (isTyping) {
        document.getElementById('resetGameButton').disabled = true;
    }
    else if (currentDialogIndex < storyDialogs.length - 1) {
        document.getElementById('resetGameButton').disabled = false;
        currentDialogIndex = 0;  // Reset when closing
        typeDialog();
    } else {
        document.getElementById('resetGameButton').disabled = false;
    }
}



// Function to update the dialog and character image without transition
function showCharacter(characterImage) {
    const characterElement = document.getElementById('storyCharacter');

    // Update the character image (stationary, no transition)
    characterElement.src = characterImage;
    characterElement.style.opacity = '1';  // Ensure the character is visible
}

