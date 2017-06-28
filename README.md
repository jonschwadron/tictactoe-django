# Jon Schwadron's Occipital Web Team Challenge

## Build a functional prototype of a tic tac toe website game

## Download
[Link to OVA file](https://www.dropbox.com/s/gbbh6vlg29zacx1/jon-schwadwron-occipital-challenge.ova?dl=0)

## User story
I was given a chance to complete the MVP scope and was able to build playable/functional prototype. I ran into interesting problems which made me pivot in constructing the game. I think the toughest part was initializing the game for two players, especially where I spent time thinking about how to write a query with filters. For example, I ran into an issue where I joined X as Alice in one browser, joined X as Bob in a second browser, and then joined O as Cindy in a third browser. Cindy joined Bob's game, meaning something happened to Alice - I believe Alice was overwritten by Bob in the same id. I resolved it by adding another filter parameter to ensure playerX=None is in the query. With that in place, I was able to play the game in 4 browsers where Alice as Player X is playing against Bob as Player O, and Cindy as Player X is playing against Doug as Player O.

Polling was another challenge. I have tried to reduce the amount of polling as much as possible. For an example, I realized it's unneccesary to poll the tiles to both players at the same time. Instead, the player making the next move will have polling for tiles request.

I learned to manage my time better by taking a step back and think about what would be the best solution to the problem. Usually I would dive into testing the code and wing it from there. That didn't work out so well last week... especially when I jumped ahead to implement Django Channels. I think it doesn't work out because I was trying to solve mutliple problems at once and I eventually fell deep into a pool of confusion after a few hours of coding. I changed my routine so that before diving into code, I would write down thoughts on my notepad, research for solutions, read other people's opinion in the comments, and narrow down my conclusion. One problem and one solution at a time, in ascending order of steps. It also helps to update the TODO list and keep the ball rolling. I was surprised how efficient that was.

The game is not perfect and it still have some minor issues that needs to be resolved. However, this is the best and the first online two-player Tic Tac Toe game I ever created in my life. Few years ago I used to think about how difficult it would be to create an online version of it due to the level of complexity in it. To my surprise, I'm able to build one even though it took me two weeks to figure it out. There's something annoying about those constant stream of requests in console/terminal, perhaps maybe it's the amount of data being transferred and I imagine that can't be good for mobile users with data caps. I'm guessing this when websockets would be useful.

There are extra features I would like to add to make the overall user experience better - such as keeping player scores, rematch option for quick play repeatability, and maybe some subtle animation for winning tiles. With your permission I would like to add this to my portfolio website.

## Stack
- Django, Postgres, JavaScript/jQuery, HTML, CSS

## Approach
- Started with back end then worked toward the front end. One problem at a time.
- Researched best practice, i.e. passing data between Views <-> JavaScript as JSON object, querying filter, ArrayField in Models, and setInterval polling.

## Unsolved problems
1. Player X with alias "Alice" creates a new game and waits for Player O to join. Player O with alias "Bob joins Alice's game. Alice decided to change her alias to "Cindy" and expects to rejoin Bob.
    - Issue: When Alice hit the back button to change her alias, Bob is still seeing Alice in his browser.
    - Possible solutions: 
        - Detect browser back button event and set playerX=none to "unseat" playerX
        - Create a back button that will take you to index page and set playerX=none to "unseat" playerX

1.  Alice quits in the middle of an unfinished game and resulted Bob to leave the game as well.
    - Issue: The game that was left unfinished has a status set to game_in_progress
    - Possible solutions: 
        - Create a timeout to delete the game by id
        - Detect browser close event and trigger a function to delete game by id

## TODO
- Detect browser back button event and execute function to "unseat" players in the lobby
- Detect browser close event and execute function to delete game by id in the middle of the game
- Have a look at app/urls.py, I feel it's not "DRY" enough and I think it can be simplified. The same goes for app/views.py. Maybe try combining the "get" functions into one and use JsonResponse to pass JSON data as object literal.
- Timestamp in Game model
- Display a history of completed games
    - filter by status=finished
    - display winner (alias)
    - display loser (alias)
    - display timestamp
    - display tiles
- Websockets/Django Channels
    - See Greg's input below

## Greg@Occipital's suggestion:
Adding aliases adds a not-insignificant amount of scope to the project. To do it well (and support some of your other ideas like game history), I think you would have to add an account system (with registration, login, a profile where you would enter your alias/username, etc), otherwise you either (1) can't ensure the same alias is being used by the same person or (2) can't allow alias re-use between sessions.

Let's violate (1) and see what that might look like in a simpler tictactoe webapp that supports aliases, using websockets. I would probably have the /join/x/ and /join/o/ views pop a javascript prompt where you would enter your alias, which would be sent to the server via websocket, creating the Player model and the Game model and associating the two. In more detail, the event flow might look like:

1. Alice visits /join/x/, and enters alice as her alias in the javascript prompt.
Pushing "cancel" on the prompt returns her to the index page /.
Pushing "ok" on the prompt triggers a websocket message to the server with a payload something like {event: 'join', alias: 'alice'}.
1. The 'join' event creates a Player model with alias='alice' and looks for a Game model with state='waiting_for_players'. Not finding one, a Game model is created with state='waiting_for_players'. The websocket connection is added to a websocket group for the game.
1. After the javascript prompt clears, the page shows a disabled tic tac toe board and the message "Waiting for player O to join".
1. Bob visits /join/o/, and enters bob as his alias in the javascript prompt, triggering the {event: 'join', alias: 'bob'} websocket message.
1. The 'join' event creates a Player model with alias='bob' and looks for a Game model with state='waiting_for_players'. It does find one, so it associates the bob Player with this Game in the database and adds Bob's websocket connection to a websocket group for the game. Then a websocket message is broadcast to the game's group, something like {event: 'start', x: 'alice', o: 'bob', first_player: 'x'}.
1. Both clients receive the start event, which triggers javascript that enables the tictactoe board for the first player (in this case, Alice) and shows the name of their opponent ("Player O: bob has joined!"). The server updates the game state from waiting_for_players to started.
1. When Alice clicks on a board space, that fires another websocket message {event: 'move', player: 'x', position: 4}. The server could validate that move (the correct player made a move in a valid location), then rebroadcast it to Bob so Bob can show that move on their page and enable the board so Bob can make a move.
    1. The server would be storing moves in the Game's board_state and would also be checking for ties or wins, and might have a different message {event: 'win', player: 'x'} or {event: 'tie'} to send to all players to trigger javascript to disable the board, show an "Alice wins!" message, and add a "play again?" button. The server would move the game state to complete, in this case.
1. As an additional note, you'd probably want to handle websocket disconnect messages to tell the player that their opponent abandoned and move the game state from waiting_for_players or started to abandoned.

The above certainly isn't perfect, but it avoids trusting the clients, allows aliases, and could be extended to support multiple games relatively easily (just parameterize your Game query and websocket groups with the game id).

Pulling back a little bit, an overall simpler tictactoe implementation (no websockets) might POST to /move/x/ and /move/o/ when the player clicks a board position and continuously GET /board_state/ (just a jQuery $.get in a setInterval, for example) to see what the current board state is (if the opponent has made a move, if the server has detected win/loss/tie conditions), redrawing the whole board to match what the server says the board looks like.

