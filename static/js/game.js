//create path variables to enable player functions
const xPath = '/' + game_id + '/play/x'
const oPath = '/' + game_id + '/play/o'

//initialize game data
var game = {
    nextPlayer: null,
    tiles: [],
    tilePosition: null,
    winner: null,
    winnerName: null,
}

//function to retrieve the tiles data
function getTiles() {
    $.get(url_getTiles, function (data) {
        game.tiles = JSON.parse(data);
        for (i = 0; i <= game.tiles.length; i++) {
            if (game.tiles[i] != null) {
                $('#tile' + i).html(game.tiles[i]);
            }
        }
    });
}

//function to retrieve the winner or tie
function getWinner() {
    $.get(url_getWinner, function (data) {
        game.winner = JSON.parse(data);
    });
}

$(function () {
    //call once in case of browser refresh
    // getTiles();

    //initialize setInterval function to retrieve game data
    var gameDataInterval = setInterval(getGameData, 1000);
    function getGameData() {
        //get winner or tie data
        getWinner();

        $.get(url_getNextPlayer, function (data) {
            game.nextPlayer = JSON.parse(data);
            $('.player_status').html("Next player: " + game.nextPlayer);

            //check for winner to stop the interval function
            if (game.winner != null) {
                if (game.winner == 'T') {
                    //this function is called so that the next player gets the final tiles data
                    getTiles();

                    $('.player_status').html("Tied");

                    //halt setInterval
                    clearInterval(gameDataInterval);

                    //launch modal prompt and ask if they want to play again
                    $('#newGamePrompt').show(0);
                } else {
                    //this function is called so that the next player gets the final tiles data
                    getTiles();

                    $('.player_status').html("Winner: " + game.winner);

                    //halt setInterval
                    clearInterval(gameDataInterval);

                    //launch modal prompt and ask if they want to play again
                    $('#newGamePrompt').show(0);
                }
            } else {
                //while the player wait for their turn, retrieve the tiles data
                if (game.nextPlayer == 'X' && window.location.pathname == xPath) {
                    getTiles();
                } else if (game.nextPlayer == 'O' && window.location.pathname == oPath) {
                    getTiles();
                }
            }
        });
    }

    $(".tile").click(function () {
        var selectedTile = $(this).attr('value');

        //check who makes the next play
        if (game.nextPlayer == 'X' && window.location.pathname == xPath) {

            //check if tile is empty before marking it
            if (game.tiles[selectedTile] == null) {
                $(this).html('X');
                game.tilePosition = selectedTile;
                game.tiles[game.tilePosition] = 'X'

                //flip the next player
                game.nextPlayer = 'O';

                //send next player state and tile position to django views via HTTP post request
                $.ajax({
                    'type': 'POST',
                    'url': url_updateGameData,
                    'data': {
                        'nextPlayer': game.nextPlayer,
                        'tilePosition': game.tilePosition,
                    },
                });
            } else {
                console.log("that tile was already used")
            }
        } else if (game.nextPlayer == 'O' && window.location.pathname == oPath) {

            //check if tile is empty before marking it
            if (game.tiles[selectedTile] == null) {
                $(this).html('O');
                game.tilePosition = selectedTile;
                game.tiles[game.tilePosition] = 'O'

                //flip the next player
                game.nextPlayer = 'X';

                //send next player state and tile position to django views via HTTP post request
                $.ajax({
                    'type': 'POST',
                    'url': url_updateGameData,
                    'data': {
                        'nextPlayer': game.nextPlayer,
                        'tilePosition': game.tilePosition,
                    },
                });
            } else {
                console.log("that tile was already used")
            }
        } else {
            console.log("wait till your turn");
        }
    });
});