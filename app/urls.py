from django.conf.urls import url

from . import views

app_name = 'app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^join/x/', views.join_x, name='join_x'),
    url(r'^join/o/', views.join_o, name='join_o'),
    url(r'^(?P<game_id>[0-9]+)/exit/x/', views.exit_x, name='exit_x'),
    url(r'^(?P<game_id>[0-9]+)/exit/o/', views.exit_o, name='exit_o'),
    url(r'^(?P<game_id>[0-9]+)/play/x', views.play_x, name='play_x'),
    url(r'^(?P<game_id>[0-9]+)/play/o', views.play_o, name='play_o'),
    url(r'^(?P<game_id>[0-9]+)/updateStatus/x', views.updateStatusX, name='updateStatusX'),
    url(r'^(?P<game_id>[0-9]+)/updateStatus/o', views.updateStatusO, name='updateStatusO'),
    url(r'^(?P<game_id>[0-9]+)/getStatus/x', views.getStatusX, name='getStatusX'),
    url(r'^(?P<game_id>[0-9]+)/getStatus/o', views.getStatusO, name='getStatusO'),
    url(r'^(?P<game_id>[0-9]+)/getPlayer/x', views.getPlayerX, name='getPlayerX'),
    url(r'^(?P<game_id>[0-9]+)/getPlayer/o', views.getPlayerO, name='getPlayerO'),
    url(r'^(?P<game_id>[0-9]+)/updateGameData', views.updateGameData, name='updateGameData'),
    url(r'^(?P<game_id>[0-9]+)/getNextPlayer', views.getNextPlayer, name='getNextPlayer'),
    url(r'^(?P<game_id>[0-9]+)/getTiles', views.getTiles, name='getTiles'),
    url(r'^(?P<game_id>[0-9]+)/getWinner', views.getWinner, name='getWinner'),
]    
    
    