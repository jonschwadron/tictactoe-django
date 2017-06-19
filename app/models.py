from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.contrib.postgres.fields import ArrayField
from django.db import models

@python_2_unicode_compatible
class Game(models.Model):
    tiles = ArrayField(
        models.CharField(max_length=9),
        default=[
            'null', 'null', 'null',
            'null', 'null', 'null',
            'null', 'null', 'null'
        ]
    )
    playerState = models.CharField(default='X', max_length=1)
    
    ## use with websocket
    # playerX = models.ForeignKey(Player, related_name="X", on_delete=models.CASCADE)
    # playerO = models.ForeignKey(Player, related_name="O", on_delete=models.CASCADE)

    def __str__(self):
        return '%s %s' % (
            self.tiles,
            self.turnState
        )

@python_2_unicode_compatible
class Winner(models.Model):
    winningPlay = ArrayField(
        ArrayField(
            models.IntegerField(
                default=[
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                ]
            )
        )
    )
    theWinner = models.CharField(max_length=1, blank=True) # X, O, or D for draw

    def __str__(self):
        return '%s %s' % (
            self.winningPlay,
            self.theWinner
        )