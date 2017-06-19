from channels import Group
from channels.sessions import channel_session
from .models import Game

@channel_session
def ws_receive(message):
    message.reply_channel.send({
        'text': message.content['text'],
    })
    
@channel_session
def ws_disconnect(message):