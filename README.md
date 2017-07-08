# Tic Tac Toe Online

## Stack
- Django, Postgres, JavaScript/jQuery, HTML, CSS

## Game plan

![](http://i.imgur.com/6cyHqXu.png)

## Match Making: Set game state based on player's presence

- set game state to ready_to_play when:
    - X joins a game with O
    - O joins a game with X

- set game state to waiting for players when:
    - X joins an empty game
    - O joins an empty game
    - X leaves a game while O waits
    - O leaves a game while X waits

- delete the game when:
    - X leaves an empty game
    - O leaves an empty game

    ![](http://i.imgur.com/KsDcz0c.png)

## Unsolved problems
1. Player X with alias "Alice" creates a new game and waits for Player O to join. Player O with alias "Bob joins Alice's game. Alice hit the browser's back button because decided to change her alias to "Cindy" and expects to rejoin Bob.
    - Issue: The browser's back button event doesn't do anything to change the detail of the game.
    - Possible solution: 
        - Create a function that will detect browser back button event and set playerX=none to unseat Alice.

1.  Bob performed a rage quit in the middle of an unfinished game.
    - Issue: The game that was left unfinished has a status set to game_in_progress
    - Possible solutions: 
        - Create a function that will set a timeout to delete the game by id
        - Create a fucntion that will detect browser's close event and delete the game by id

## TODO
- Detect browser back button event and execute function to "unseat" players in the lobby
- Detect browser close event and execute function to delete game by id in the middle of the game
- Have a look at app/urls.py and app/views.py - see if you can simplify multiple "get" functions into one and use JsonResponse to pass data as object literals.
- Timestamp in Game model
- Display a history of completed games
    - filter by status=finished
    - display winner (alias)
    - display loser (alias)
    - display timestamp
    - display tiles