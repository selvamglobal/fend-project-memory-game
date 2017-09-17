// List of cards
let cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
    "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
    "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game State Variables
let openCards = [];
let matchedCards = 0;
let moveCounter = "";
let moveCounterforTimer = 0;
let numStars = 3;
let timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};
// stars rating
const hard = 15;
const medium = 20;

// Model Popup for results
const modal = $("#win-modal");
 if(moveCounterforTimer>0){
        resetTimer();
    }
// Timer functions
const startTimer = function () {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }
    var time = String(timer.minutes) + ":" + timer.seconds;
    $(".timer").text(time);
};
// Resets timer state and restarts timer
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");
    timer.clearTime = setInterval(startTimer, 1000);
}
//Check if card is not matched or open state
function isValidCard(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
}
// Returns win condition
function hasWon() {
    if (matchedCards === 16) {
        return true;
    } else {
        return false;
    }
}
// Sets currently open cards to the match state, checks win condition
const setMatch = function () {
    openCards.forEach(function (card) {
        card.addClass("match");
    });
    openCards = [];
    matchedCards += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// Sets currently open cards back to default state
const resetOpen = function () {
    openCards.forEach(function (card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    openCards = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        openCards.push(card);
    }
}
// Model after winning
function showModal() {
    modal.css("display", "block");
}
// Randomise cards Every time its loading
function updateCards() {
    cards = shuffle(cards);
    var index = 0;
    $.each($(".card i"), function () {
        $(this).attr("class", "fa " + cards[index]);
        index++;
    });
  
    
}
// Removes last start from remaining stars, updates modal HTML
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
}
// Restores star icons to 3 stars, updates modal HTML
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
}
// Updates number of moves in the HTML, removes star is necessary based on difficulty variables
function updateMoveCounter() {
    $(".moves").text(moveCounter);
    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
}
// Resets all game state variables and resets all required HTML to default state
const resetGame = function () {
    openCards = [];
    matchedCards = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};
// Resets game state and toggles win modal display off
const playAgain = function() {
    resetGame();
    modal.css("display", "none");
};
// Returns whether or not currently open cards match
function checkMatch() {
    if (openCards[0].children().attr("class")===openCards[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
}
// On click function
const onClick = function () {
    moveCounterforTimer++;
    if(moveCounterforTimer===1){
        resetTimer();
    }
    if (isValidCard($(this))) {
        if (openCards.length === 0) {
            openCard($(this));

        } else if (openCards.length === 1) {
            openCard($(this));
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Provides a randomized game board on page load
$(updateCards);
$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);