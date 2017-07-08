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
    //initialize setInterval function to retrieve game data
    var gameDataInterval = setInterval(getGameData, 1000);
    function getGameData() {
        // check if winning play exists
        getWinner();

        // retrieve next player state
        $.get(url_getNextPlayer, function (data) {
            game.nextPlayer = JSON.parse(data);
            $('.player_status').html("Next player: " + game.nextPlayer);

            // if end game is detected
            //   -update the game state
            //   -stop the polling
            //   -display modal to reset the game
            //
            // otherwise retrieve the next move
            if (game.winner != null) {
                if (game.winner == 'T') {
                    getTiles();
                    $('.player_status').html("Tied");
                    clearInterval(gameDataInterval);
                    $('#newGamePrompt').show(0);
                } else {
                    getTiles();
                    $('.player_status').html("Winner: " + game.winner);
                    clearInterval(gameDataInterval);
                    $('#newGamePrompt').show(0);
                }
            } else {
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

        // check who makes the next play
        // check if tile is empty before marking it
        // flip the next player
        // send player state and tile position to server
        if (game.nextPlayer == 'X' && window.location.pathname == xPath) {
            if (game.tiles[selectedTile] == null) {
                $(this).html('X');
                game.tilePosition = selectedTile;
                game.tiles[game.tilePosition] = 'X'
                game.nextPlayer = 'O';
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
            if (game.tiles[selectedTile] == null) {
                $(this).html('O');
                game.tilePosition = selectedTile;
                game.tiles[game.tilePosition] = 'O'
                game.nextPlayer = 'X';
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