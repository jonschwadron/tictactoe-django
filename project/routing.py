from app import consumers

channel_routing = {
    route("websocket.receive", websocket_receive, path=r'^(?P<game_id>[0-9]+)/join'),
}