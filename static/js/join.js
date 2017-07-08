const xPath = '/join/x/'
const oPath = '/join/o/'

function displayPlayerAlias(data) {
    if (window.location.pathname === oPath) {
        lobby.playerX = data;
        $('#lobby_playerX').html(lobby.playerX);
    } else if (window.location.pathname === xPath) {
        lobby.playerO = data;
        $('#lobby_playerO').html(lobby.playerO);
    }
}

function displayPlayerState(data) {
    if (window.location.pathname === oPath) {
        lobby.xState = JSON.parse(data);
        if (lobby.xState == "not_ready") {
            $('#lobby_xState').html("Not Ready");
        } else {
            $('#lobby_xState').html("Ready");
        }
    } else if (window.location.pathname === xPath) {
        lobby.oState = JSON.parse(data);
        if (lobby.oState == "not_ready") {
            $('#lobby_oState').html("Not Ready");
        } else {
            $('#lobby_oState').html("Ready");
        }
    }
}

function unseatPlayer() {
    if (window.location.pathname === oPath) {
        $('#lobby_playerX').html('Waiting for player...');
        $('#lobby_xState').html('');
        lobby.playerX = null;
    } else if (window.location.pathname === xPath) {
        $('#lobby_playerO').html('Waiting for player...');
        $('#lobby_oState').html('');
        lobby.playerO = null;
    }
}

window.onbeforeunload = function () {
    if (window.location.pathname === xPath) {
        $.ajax({
            type: "POST",
            url: exit_x,
        });
    }
    else if (window.location.pathname === oPath) {
        $.ajax({
            type: "POST",
            url: exit_o,
        });
    }
};

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
                    displayPlayerAlias(data);
                    $.get(getStatusO, function (data) {
                        displayPlayerState(data);
                    });
                } else {
                    unseatPlayer();
                }
            });
        } else if (window.location.pathname === oPath) {
            $.get(getPlayerX, function (data) {
                if (data != "None") {
                    displayPlayerAlias(data);
                    $.get(getStatusX, function (data) {
                        displayPlayerState(data);
                    });
                } else {
                    unseatPlayer();
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