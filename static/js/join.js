const xPath = '/join/x/'
const oPath = '/join/o/'

$(function () {

    if (window.location.pathname === xPath) {
        var xCheckbox = $('.checkbox');

        $('input.checkbox').on('click', function () {
            if (xCheckbox.is(':checked')) {
                lobby.xState = 'ready';
            } else {
                lobby.xState = 'not_ready';
            }

            $.ajax({
                type: "POST",
                url: updateStatusX,
                data: {
                    'xState': lobby.xState
                }
            });
        });
    } else if (window.location.pathname === oPath) {
        var oCheckbox = $('.checkbox');

        $('input.checkbox').on('click', function () {
            if (oCheckbox.is(':checked')) {
                lobby.oState = 'ready';
            } else {
                lobby.oState = 'not_ready';
            }

            $.ajax({
                type: "POST",
                url: updateStatusO,
                data: {
                    'oState': lobby.oState
                }
            });
        });
    } else {
        console.log("error");
    }

    var playerStatusInterval = setInterval(getPlayerStatus, 1000);

    function getPlayerStatus() {
        if (window.location.pathname === xPath) {
            $.get(getPlayerO, function (data) {
                if (data != "None") {
                    lobby.playerO = data;
                    $('#lobby_playerO').html(lobby.playerO);
                    $.get(getStatusO, function (data) {
                        lobby.oState = JSON.parse(data);
                        if (lobby.oState == "not_ready") {
                            $('#lobby_oState').html("Not Ready");
                        } else {
                            $('#lobby_oState').html("Ready");
                        }
                    });
                }
            });
        } else if (window.location.pathname === oPath) {
            $.get(getPlayerX, function (data) {
                if (data != "None") {
                    lobby.playerX = data;
                    $('#lobby_playerX').html(lobby.playerX);
                    $.get(getStatusX, function (data) {
                        lobby.xState = JSON.parse(data);
                        if (lobby.xState == "not_ready") {
                            $('#lobby_xState').html("Not Ready");
                        } else {
                            $('#lobby_xState').html("Ready");
                        }
                    });
                }
            });
        } else {
            console.log("error");
        }

        if (lobby.xState == "ready" && lobby.oState == "ready") {
            clearInterval(playerStatusInterval);
            $('#myModal').show(0, function () {
                var count = 2;
                var counter = setInterval(timer, 1000);
                function timer() {
                    count = count - 1;
                    if (count <= 0) {
                        clearInterval(counter);
                        if (window.location.pathname === xPath) {
                            window.location.replace(play_x);
                        } else if (window.location.pathname === oPath) {
                            window.location.replace(play_o);
                        } else {
                            console.log("error");
                        }
                        return;
                    }
                }
            });
        }
    }
});