/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var opened_card = [];
var active_card = [];
var temp_card = [];
var selected_count = 0;
var moves = 0;
var status = true;
var rating = 0;
var sec = 0;
var intervalId;
var popup = $(".popup");
var star_rating = 1;
let time_status = 0;

var list = [
    {id: 1, card_id: 100, matched: false, symbol: "fa-diamond"},
    {id: 2, card_id: 100, matched: false, symbol: "fa-diamond"},
    {id: 3, card_id: 200, matched: false, symbol: "fa-anchor"},
    {id: 4, card_id: 200, matched: false, symbol: "fa-anchor"},
    {id: 5, card_id: 300, matched: false, symbol: "fa-cube"},
    {id: 6, card_id: 300, matched: false, symbol: "fa-cube"},
    {id: 7, card_id: 400, matched: false, symbol: "fa-bolt"},
    {id: 8, card_id: 400, matched: false, symbol: "fa-bolt"},
    {id: 9, card_id: 500, matched: false, symbol: "fa-paper-plane-o"},
    {id: 10, card_id: 500, matched: false, symbol: "fa-paper-plane-o"},
    {id: 11, card_id: 600, matched: false, symbol: "fa-leaf"},
    {id: 12, card_id: 600, matched: false, symbol: "fa-leaf"},
    {id: 13, card_id: 700, matched: false, symbol: "fa-bicycle"},
    {id: 14, card_id: 700, matched: false, symbol: "fa-bicycle"},
    {id: 15, card_id: 800, matched: false, symbol: "fa-bomb"},
    {id: 16, card_id: 800, matched: false, symbol: "fa-bomb"},
];


// new game function
function new_game() {
    $('.popup').removeClass('open-popup');
    opened_card = [];
    active_card = [];
    temp_card = [];
    selected_count = 0;
    moves = 0;
    list = shuffle(list);
    updatesStars(moves);
    //updateTimer(true,false);


    $('.deck').empty();
    $(".moves").text(0);

    let cards = [];
    list.forEach(function (ele) {
        var element = `<li class='card' data-id='${ele.id}' data-matched='false' data-card_id='${ele.card_id}'><i class='fa ${ele.symbol}'></i></li>`;

        $('.deck').append(element);
        cards.push(element);
    });

    $('.deck').append(popup);

    $('.card').on('click', function () {
        time_status++;

        if (time_status == 1) {// starts the timer when a card is clicked
            startTimer();
        }

        //prevents the moves from updating when a matched card is clicked again
        if ($(this).hasClass("match")) {
            return false;
        }

        //prevents the moves from updating when an open cards is clicked again
        if ($(this).hasClass("open show")) {
            return false;
        }

        selected_count++;
        $(this).addClass("open show").removeClass("mismatched");
        temp_card[0] = $(this).data("id");
        temp_card[1] = $(this).data("card_id");

        active_card[0] = opened_card[0]; //pass the current opened card ID to the active element
        active_card[1] = opened_card[1]; //pass the current opened card CARD ID to the active element
        opened_card[0] = temp_card[0];
        opened_card[1] = temp_card[1];


        //check if the already opened card and the newly opened card match and the already opened card isnt clicked
        if ((active_card[1] == opened_card[1]) && (active_card[0] !== opened_card[0])) {
            setCardAsMatched(active_card[0]);
            setCardAsMatched(opened_card[0]);
            selected_count = 0;
            moves++;
            checkIfAllMatched();
        }
        else {
            if (selected_count == 2) {
                unsetCardAsMatched(active_card[0]);
                unsetCardAsMatched(opened_card[0]);
                setTimeout(function () {
                    $('.card').each(function () {
                        $(this).removeClass("mismatched");
                    });
                }, 300);
                selected_count = 0;
                moves++;
            }
        }
        updateMoves(moves);
        updatesStars(moves);
    });
}

new_game();


//restart game when "play again" is clicked
$(".restart").on('click', function () {
    restart();
});


//restart game function
function restart() {
    $('.popup').removeClass('open-popup');
    resetTimer();
    time_status = 0;
    $(".seconds").text(0);
    //startTimer();
    new_game();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */





/**
 * accept a single card and set it as matched
 * @param {number} element - The id of the element to be matched.
 */
function setCardAsMatched(element) {
   // console.log("element id = " + element);
    $('.card').each(function () {
        let picked = $(this).data("id");
        if (picked == element) {
            //console.log("cards exist");
            $(this).addClass("match").attr("data-matched", "true");
        }
    });
}

/**
 * accept a single card and set it as matched
 * @param {number} element - The id of the element to be unmatched.
 */
function unsetCardAsMatched(element) {
    $('.card').each(function () {
        let picked = $(this).data("id");
        if (picked == element) {
            //console.log("cards unmatched");
            $(this).removeClass("open show").addClass("mismatched");
            //$(this).removeClass("red");
        }
    });
}

/**
 * accept and update the moves on the page
 * @param {number} moves - The total moves made so far
 */
function updateMoves(moves) {
    $(".moves").text(moves);
}

/**
 * accept and update the stars on the page
 * @param {number} moves - The total moves made so far
 */
function updatesStars(moves) {
    rating = (moves > 60) ? 60 : moves;
    rating = Math.floor(rating / 20);
    star_rating = 3 - rating;

    //console.log("ratings : " + rating + " , moves : " + moves);
    let stars = "";
    if (rating == 0) {
        stars = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
    } else if (rating == 1) {
        stars = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star-o'></i></li>";
    } else if (rating == 2) {
        stars = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star-o'></i></li><li><i class='fa fa-star-o'></i></li>";
    } else if (rating == 3) {
        stars = "<li><i class='fa fa-star-o'></i></li><li><i class='fa fa-star-o'></i></li><li><i class='fa fa-star-o'></i></li>";
    }
    $(".stars").html(stars);
}

// the timer function
// function updateTimer(status,reset) {
//
//     var sec = 0;
//
//     if(status){
//         console.log("sec : "+sec);
//          var id = setInterval(function () {
//             sec++;
//             $(".seconds").text(sec);
//         }, 1000);
//     }
//     if(reset){
//         clearInterval(id);
//     }
// }

// start time function
function startTimer() {
    intervalId = setInterval(updateTime, 1000);
}

// update the seconds ellapsed in the dom
function updateTime() {

    $(".seconds").text(sec);
    sec++;
}

// this function clears the time for reset
function resetTimer() {
    clearInterval(intervalId);
    sec = 0;
}

// check if all cards are matched
function checkIfAllMatched() {
    let count_matched = 0;

    $(".card").each(function () {
        var check = $(this).attr('data-matched');
        if (check == "true") {
            count_matched++;
            //console.log(count_matched);
        }
    });
    //console.log("count_matched : " + count_matched);
    if (count_matched == 2) { //if cards are totally matched this calls the popup to show the result
        $('.popup').addClass('open-popup');
        const result_text = `with ${moves} moves and ${star_rating} star(s) in ${--sec} seconds`;
        $('.result').text(result_text);
        resetTimer();
    }
}