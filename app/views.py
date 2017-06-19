# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from .models import Game

def index(request):
     return render(request, "app/start.html")
    
def new_game(request):
    game = Game.objects.create(tiles=[
        None, None, None,
        None, None, None,
        None, None, None])
    game_id = game.id
    game_tiles = game.tiles
    request.session['game_id'] = game_id
    request.session['game_tiles'] = game_tiles 
    return render(request, "app/join.html", {
        'game': game_id
    })

def join_x(request, game_id):
    game = Game.objects.get(id=game_id)
    player = game.playerState
    game_tiles = request.session.get('game_tiles')
    return render(request, 'app/game.html', {
        'game': game_id,
        'player': player,
        'tiles': game_tiles,
    })

def join_o(request, game_id):
    game = Game.objects.get(id=game_id)
    player = game.playerState
    return render(request, 'app/game.html', {
        'game': game_id,
        'player': player
    })

def start_game(request):
    game = request.session.get('game')
    return render(request, "app/game.html", {
        'game': game.id
    })

def updateGame(request, game_id):
    updateGame = Game.objects.get(game_id)  
    if not 'tiles' in request.DATA:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    updateGame.tiles = request.DATA['tiles']
    updateGame.playerState = request.DATA['player']
    updateGame.save()
    return HttpResponse(status=200)

## use with websocket and some javascript logic
## on /start/x/ player X enters alias and clicks Join X
## lock player X's screen and display 'waiting for player O' or 'initializing game'
## on /start/o/ player O enters alias and clicks Join O
## lock player O's screen and display 'waiting for player X' or 'initializing game'
# def initGame(request, aliasX, aliasO):
#     aliasX = request.POST['aliasInputX']
#     aliasO = request.POST['aliasInputO']
#     x = Player(alias=aliasX)
#     x.save()
#     o = Player(alias=aliasO)
#     o.save()
#     Game.objects.create(playerX=x.id, playerO=o.id)
#     return render(request, "app/game.html", {
#         'playerX': aliasX,
#         'playerO': aliasO
#     })