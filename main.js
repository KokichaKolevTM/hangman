// todo:
// - option for a hint
// - statistics
// 

const $ = (s) => document.querySelector(s);

function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

function updateHangmanImage(wrongInputs) {
    if (wrongInputs.length <= 6) {
        $("#hangman-canvas").src = `images/hangman-${wrongInputs.length}.svg`;
    }
}

function showOverlay(isGameWon) {
    $("#input-guess").blur();
    $("#overlay").classList.remove("hidden");
    $("#overlay-message").textContent = isGameWon ? "You won!" : "You lost!";
    $("#overlay-message").style.color = isGameWon ? "greenyellow" : "red";
}

function increaseLocalStorage(key) {
    localStorage.setItem(
        key,
        localStorage.getItem(key) ? parseInt(localStorage.getItem(key)) + 1 : 1
    );
}

let choosenDifficulty = (choosenCountry = wordToGuess = "");
let foundLetters = new Set([]);
let wrongInputs = [];
let numberOfLives = 6;

$("#start-game").addEventListener("click", () => {
    $("#input-guess").value = "";
    setTimeout(() => {
        $("#input-guess").focus();
    }, 150);

    $("#settings").classList.add("hidden");
    $("#game").classList.remove("hidden");
    choosenDifficulty = $("input[name='difficulty']:checked").id;
    choosenCountry = $("input[name='country']:checked").id;

    let words;
    switch (choosenCountry) {
        case "bg":
            words = bgWords;
            break;
        case "gb":
            words = gbWords;
            break;
    }

    switch (choosenDifficulty) {
        case "easy":
            words = words.filter((word) => word.length <= 4);
            break;
        case "medium":
            words = words.filter((word) => word.length >= 5 && word.length <= 6);
            break;
        case "hard":
            words = words.filter((word) => word.length >= 7);
            break;
    }

    wordToGuess = words[getRandomNumber(words.length)];
    console.log("word to guess:", wordToGuess);

    $("#guess-progress").textContent = "_".repeat(wordToGuess.length);
});

$("#input-guess").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (wordToGuess.toLowerCase().includes($("#input-guess").value.toLowerCase())) {
            foundLetters.add($("#input-guess").value.toLowerCase());

            let guessProgress = "";
            for (let i = 0; i < wordToGuess.length; i++) {
                guessProgress += foundLetters.has(wordToGuess[i].toLowerCase())
                    ? wordToGuess[i]
                    : "_";
            }
            $("#guess-progress").textContent = guessProgress;

            if (!guessProgress.includes("_")) {
                showOverlay(true);
                increaseLocalStorage("win_count");
            }
        } else {
            wrongInputs.push($("#input-guess").value.toLowerCase());
            $("#wrong-letters").textContent = `Wrong Letters: ${Array.from(
                new Set(wrongInputs)
            ).join(", ")}`;
            numberOfLives--;
            updateHangmanImage(wrongInputs);

            if (numberOfLives === 0) {
                $("#guess-progress").textContent = wordToGuess;
                showOverlay(false);
                increaseLocalStorage("loss_count");
            }
        }
        $("#input-guess").value = "";
    }
});

$("#input-guess").addEventListener("input", () => {
    let regex;
    switch ($("input[name='country']:checked").id) {
        case "bg":
            regex = /[^а-я]/i;
            break;
        case "gb":
            regex = /[^a-z]/i;
            break;
    }
    $("#input-guess").value = $("#input-guess").value.replace(regex, "");

    if ($("#input-guess").value.length > 1) {
        $("#input-guess").value = $("#input-guess").value[0];
    }
});

$("#start-again").addEventListener("click", () => {
    numberOfLives = 6;
    foundLetters = new Set([]);
    wrongInputs = [];

    $("#game").classList.add("hidden");
    $("#overlay").classList.add("hidden");
    $("#settings").classList.remove("hidden");
    $("#wrong-letters").textContent = "";
    $("#input-guess").value = "";
    updateHangmanImage(wrongInputs);
});
