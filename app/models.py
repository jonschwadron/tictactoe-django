from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.db import models
from django.contrib.postgres.fields import ArrayField

@python_2_unicode_compatible
class Player(models.Model):
    alias = models.CharField(max_length=32)

    def __str__(self):
        return self.alias

@python_2_unicode_compatible
class Game(models.Model):
    tiles = ArrayField(
        models.CharField(max_length=1),
        default=[
            None, None, None,
            None, None, None,
            None, None, None
        ],
        size=9
    )
    status = models.CharField(max_length=32, null=True)
    nextPlayer = models.CharField( max_length=1, default='X')
    playerX = models.ForeignKey(Player, related_name="X", on_delete=models.CASCADE, null=True)
    playerO = models.ForeignKey(Player, related_name="O", on_delete=models.CASCADE, null=True)
    xState = models.CharField(max_length=16, default="not_ready")
    oState = models.CharField(max_length=16, default="not_ready")
    winner = models.CharField(max_length=1, null=True)

    def __str__(self):
        return '%s %s %s %s %s' % (
            self.tiles,
            self.state,
            self.playerNext,
            self.playerX,
            self.playerO
        )