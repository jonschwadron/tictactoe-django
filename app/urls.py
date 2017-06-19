from django.conf.urls import url

from . import views

app_name = 'app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^new/$', views.new_game, name='new_game'),
    url(r'^(?P<game_id>[0-9]+)/join/x/', views.join_x, name='join_x'),
    url(r'^(?P<game_id>[0-9]+)/join/o/', views.join_o, name='join_o'),
    url(r'^(?P<game_id>[0-9]+)/join/X/', views.updateGame, name='updateGame'),
]    
    
    