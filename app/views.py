# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse
import json
from .models import Player
from .models import Game

def index(request):
     return render(request, "app/index.html")

def join_x(request):
    # get alias from POST
    alias = request.POST['alias']
    
    # get if alias exists else create alias in Player model
    player, created = Player.objects.get_or_create(alias=alias)

    # check if empty playerX and waiting_for_players status exists
    # if found, join the first game_id in the list and change status to ready_to_play
    if Game.objects.filter(playerX=None, status="waiting_for_players").exists():
        game = Game.objects.filter(playerX=None, status="waiting_for_players").first()
        game.playerX = player
        game.status = 'ready_to_play'
        game.save()
    
    # if none found, create game with playerX assigned and set status to waiting_for_players
    else:
        game = Game.objects.create(status="waiting_for_players", playerX=player)
        game.save()

    return render(request, 'app/join.html', {
        'game': game,
        'xState': json.dumps(game.xState),
        'oState': json.dumps(game.oState),
    })

def join_o(request):
    # get alias from POST
    alias = request.POST['alias']
    
    # get if alias exists else create alias in Player model
    player, created = Player.objects.get_or_create(alias=alias)
    
    # check if empty playerX and waiting_for_players status exists
    # if found, join the first game_id in the list and change status to ready_to_play
    if Game.objects.filter(playerO=None, status="waiting_for_players").exists():
        game = Game.objects.filter(playerO=None, status="waiting_for_players").first()
        game.playerO = player
        game.status = 'ready_to_play'
        game.save()

    # if none found, create game with playerX assigned and set status to waiting_for_players
    else:
        game = Game.objects.create(status="waiting_for_players", playerO=player)
        game.save()

    return render(request, 'app/join.html', {
        'game': game,
        'xState': json.dumps(game.xState),
        'oState': json.dumps(game.oState),
    })

def play_x(request, game_id):
    game = Game.objects.get(id=game_id)
    game.status = "game_in_progress"
    game.save()
    return render(request, 'app/game.html', {
        'game': game,
        'game_id': json.dumps(game.id),
        'game_nextPlayer': json.dumps(game.nextPlayer),
    })

def play_o(request, game_id):
    game = Game.objects.get(id=game_id)
    return render(request, 'app/game.html', {
        'game': game,
        'game_id': json.dumps(game.id),
        'game_nextPlayer': json.dumps(game.nextPlayer),
    })

def updateGameData(request, game_id):
    game = Game.objects.get(id=game_id)
    currentPlayer = game.nextPlayer

    position = request.POST['tilePosition']
    position = int(position)
    game.tiles[position] = currentPlayer

    

    winningPlays = [[0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]]

    if (any(j is None for j in game.tiles)):
        game.nextPlayer = request.POST['nextPlayer']
    else:
        game.winner = 'T'
        game.status = 'finished'

    for i in winningPlays:
        #check if winning play exist
        if (game.tiles[i[0]] == currentPlayer and
            game.tiles[i[1]] == currentPlayer and
            game.tiles[i[2]] == currentPlayer):
            game.winner = currentPlayer
            game.status = 'finished'

    game.save()
    return HttpResponse(status=200)

## TODO: consolidate these functions
def getNextPlayer(request, game_id):
    game = Game.objects.get(id=game_id)
    return HttpResponse(json.dumps(game.nextPlayer))

def getTiles(request, game_id):
    game = Game.objects.get(id=game_id)
    return HttpResponse(json.dumps(game.tiles))

def getWinner(request, game_id):
    game = Game.objects.get(id=game_id)
    return HttpResponse(json.dumps(game.winner))

def updateStatusX(request, game_id):
    game = Game.objects.get(id=game_id) 
    game.xState = request.POST['xState']
    game.save()
    return HttpResponse(status=200)

def updateStatusO(request, game_id):
    game = Game.objects.get(id=game_id) 
    game.oState = request.POST['oState']
    game.save()
    return HttpResponse(status=200) 

def getStatusX(request, game_id):
    game = Game.objects.get(id=game_id) 
    return HttpResponse(json.dumps(game.xState))

def getStatusO(request, game_id):
    game = Game.objects.get(id=game_id) 
    return HttpResponse(json.dumps(game.oState))

def getPlayerX(request, game_id):
    game = Game.objects.get(id=game_id) 
    return HttpResponse(game.playerX)

def getPlayerO(request, game_id):
    game = Game.objects.get(id=game_id) 
    return HttpResponse(game.playerO)



