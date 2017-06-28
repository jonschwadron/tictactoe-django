$(function () {
    $('#btnX').click(function () {
        console.log("clicked!");
        $('#formX').toggle();
    });

    $('#btnO').click(function () {
        console.log("clicked!");
        $('#formO').toggle();
    });
    // if https, use wss
    // daphne project.asgi:channel_layer --port 8888
    // var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    // var websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + window.location.pathname);

    // websocket.onmessage = function (message) {
    //     var data = JSON.parse(message.data);
    //     console.log(data);
    // };

    

    
    var game = {
        id: $("#board").attr('game-id'),
        playerState: 'X',
        boardArray: ''
    }

    //get tiles from Views
    var tiles = JSON.parse('{{ tiles_json|escape_js }}')

    const xPath = '/' + game.id + '/join/x/'
    const oPath = '/' + game.id + '/join/o/'

    //if player x's turn... do something
    //if player o's turn... do something

    if (window.location.pathname === xPath) {
        if (game.playerState == 'X') {
            $(".tile").click(function () {
                if (game.boardArray.length <= 9 && game.boardArray[$(this).val()] == 'null') {
                    //assign X to boardArray[inputvalue]
                    game.boardArray[$(this).val()] = 'X'

                    //http post
                    $.ajax({
                        'type': 'POST',
                        'url': xPath,
                        'data': {
                            'tiles': JSON.stringify(game.boardArray),
                            'player': JSON.stringify(game.player)
                        },
                        'contentType': 'application/json',
                        'dataType': 'json'
                    });

                    //display X on button
                    $(this).html('X');

                    //send data to websocket
                    // websocket.send(JSON.stringify(game));

                    //flip turns
                    game.playerState = 'O';

                    console.log("board: " + game.boardArray);
                }
            });
        } else {
            console.log("Please wait until it's your turn.");
        }
    }

    if (window.location.pathname === oPath) {
        if (game.playerState == 'O') {
            $(".tile").click(function () {
                if (game.boardArray.length <= 9 && game.boardArray[$(this).val()] == 'null') {
                    //assign X to boardArray[inputvalue]
                    game.boardArray[$(this).val()] = 'O'

                    //post
                    $.ajax({
                        'type': 'POST',
                        'url': oPath,
                        'data': {
                            'tiles': JSON.stringify(game.boardArray),
                            'player': JSON.stringify(game.player)
                        },
                        'contentType': 'application/json',
                        'dataType': 'json'
                    });

                    //display X on button
                    $(this).html('X');

                    //send data to websocket
                    // websocket.send(JSON.stringify(game));

                    //flip turns
                    game.playerState = 'X';

                    console.log("board: " + game.boardArray);
                }
            });
        } else {
            console.log("Please wait until it's your turn.");
        }
    }
});