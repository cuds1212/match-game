// Initialize counters and variables.
var guessCount = 0; // number of guesses in current turn
var guesslValue = null; // value of first guess in current turn
var turnCount = 0; // number of turns in current game
var matchCount = 0; // number of matches in current game

var bestGame = Number(localStorage.getItem("bestGame"));

// Randomize game board.
var squareValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
var colors = ["rgb(52, 152, 219)", "rgb(155, 89, 182)", "rgb(46, 204, 113)", "rgb(241, 196, 15)", "rgb(230, 126, 34)", "rgb(26, 188, 156)", "rgb(231, 76, 60)", "rgb(149, 165, 166)"];
squareValues = shuffleArray(squareValues);
colors = shuffleArray(colors);

// Populate game board values.
for(var i=0; i<16; i++){
    $(".square").get(i).dataset.value = squareValues[i];
}

// Set up game logic via event listeners.
$(".square").click(function(){

    // If first guess, just show square.
    if(guessCount==0 && !$(this).hasClass("show")){ // don't count already shown squares
        $(this).css("backgroundColor", colors[$(this).data("value")-1]); // set background color
        $(this).children("span").text($(this).data("value")); // set correct text value
        $(this).toggleClass("guess show"); // toggle guess and show classes

        guessCount += 1; // increment guess count
        guessValue = $(this).data("value"); // update current guess value
    }

    // If second selection...
    else if(guessCount==1 && !$(this).hasClass("show")){
        // First show square.
        $(this).css("backgroundColor", colors[$(this).data("value")-1]); // set background color
        $(this).children("span").text($(this).data("value")); // set correct text value
        $(this).toggleClass("guess show"); // toggle guess and show classes
  
        guessCount += 1; // increment guess count
        turnCount += 1; // increment turn count

        // Next check to see if a match is made.
        if($(this).data("value") == guessValue){ // match is made
            $(".guess").addClass("match"); // add match class
            $(".guess").removeClass("guess"); // remove guess class
            matchCount += 1; // increment match count
            guessCount = 0; // reset guess count
            guessValue = null; // reset current guess value

            // Update status message.
            $("#status").text("That's a match!");

            // Was this the last match of the game?
            if(matchCount===8){
                $('#turns').text(turnCount) // set turn count text

                // What this the best game?
                if(!bestGame || turnCount < bestGame){
                    localStorage.setItem("bestGame",String(turnCount));
                    $('#best-game-message').text("This is a new personal best for you!!!");
                }
                else{
                    $('#best-game-message').text("However, your personal best is " + localStorage.getItem("bestGame") + " moves...");
                }

                $('.modal-container').addClass('game-over'); // display game over modal
            }
        }
        else{
            // else.....
            $("#status").text("Try again!");

            setTimeout(function(){
                // Hide guessed squares after a delay.
                $(".guess").children("span").text("");
                $(".guess").css("backgroundColor","rgb(52, 73, 94)");
                $(".guess").toggleClass("guess show");

                guessCount = 0; // reset guess count
                guessValue = null; // reset current guess value
            }, 1000);
        } 
    }
});

// Toggle instructions on mobile devices.

$('.fa-question-circle').click(function(){
    if($(".instructions-container").css("maxHeight")===0+"px"){
        $(".instructions-container").css("display", "block");
        $(".instructions-container").css("maxHeight", $(".instructions-container").prop('scrollHeight')+"px");
        $(".instructions-container").css("opacity", "1");
    }
    else {
        $(".instructions-container").css("maxHeight", 0+"px");
        $(".instructions-container").css("opacity", "0");
        setTimeout(function(){
            $(".instructions-container").css("display", "none");
        },500);
    }
});

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

