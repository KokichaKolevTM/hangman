const $ = (s) => document.querySelector(s);

function getCheckedOptionID(options) {
    for (const option of options) {
        if (option.checked) {
            return option.id;
        }
    }
}

function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

function drawHangman(wrongInputs) {
    if (wrongInputs.length <= 6) {
        $("#hangman-canvas").src = `images/hangman-${wrongInputs.length}.svg`;
    }
}

function showOverlay(gameWon) {
    setTimeout(() => {
        $("#start-again").focus();
    }, 100);

    $("#overlay").style.display = "flex";
    $("#overlay-message").textContent = gameWon ? "You won!" : "You lossed!";
    $("#overlay-message").style.color = gameWon ? "greenyellow" : "red";
}

let choosenDifficulty = (choosenCountry = wordToGuess = "");
let foundLetters = new Set([]);
let wrongInputs = [];
let numberOfLives = 6;

$("#start-game").addEventListener("click", () => {
    setTimeout(() => {
        $("#input-guess").focus();
    }, 100);

    $("#settings").style.display = "none";
    $("#game").style.display = "block";
    choosenDifficulty = getCheckedOptionID(document.getElementsByName("difficulty"));
    choosenCountry = getCheckedOptionID(document.getElementsByName("country"));

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
            }
        } else {
            wrongInputs.push($("#input-guess").value);
            $("#wrong-letters").textContent = `Wrong Letters: ${Array.from(
                new Set(wrongInputs)
            ).join(", ")}`;
            numberOfLives--;
            drawHangman(wrongInputs);

            if (numberOfLives === 0) {
                $("#guess-progress").textContent = wordToGuess;
                showOverlay(false);
            }
        }
        $("#input-guess").value = "";
    }
});

$("#input-guess").addEventListener("input", () => {
    let regex;
    switch (getCheckedOptionID(document.getElementsByName("country"))) {
        case "bg":
            regex = /[^а-я]/i
            break;
        case "gb":
            regex = /[^a-z]/i;
            break;
    }
    $("#input-guess").value = $("#input-guess").value.replace(regex, "");
});

$("#start-again").addEventListener("click", () => {
    numberOfLives = 6;
    foundLetters = new Set([]);
    wrongInputs = [];

    $("#game").style.display = "none";
    $("#overlay").style.display = "none";
    $("#settings").style.display = "flex";
    $("#wrong-letters").textContent = "";
    $("#input-guess").value = "";
    drawHangman(wrongInputs);
});
