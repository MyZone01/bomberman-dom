# 💣 BOMBERMAN-DOM

BomberMan-DOM is a multiplayer game based on the classic BomberMan game, where multiple players battle each other until one remains victorious. This project is implemented using HTML, CSS, JavaScript, and WebSocket technology.

## FEATURES
- Real-time multiplayer gameplay
- Player movement and bomb placement
- Destructible blocks and power-ups
- Countdown timer before game start
- Chat functionality for players to communicate
- Dynamic game board generation
- Victory and defeat conditions

## INSTALLATION
1. Clone the repository:

```bash
git clone https://learn.zone01dakar.sn/git/papgueye/bomberman-dom.git
```

2. Navigate to the project directory:

```bash
cd bomberman-dom
```

3. Open the `index.html` file in your web browser to start the game.

## USAGE
1. Upon opening the game, players will be prompted to enter a nickname.
2. Players can join the waiting room and wait for other players to join.
3. Once enough players have joined, the game will start automatically.
4. Players can move their characters using arrow keys and place bombs using the `spacebar`.
5. Use the chat functionality to communicate with other players.
6. The game ends when only one player remains standing.

## DEVELOPMENT
- The server-side code is written in Node.js and handles WebSocket communication between clients.
- Client-side code is implemented using HTML, CSS, and JavaScript.
- The game board is dynamically generated on the server and displayed on the client using WebSocket messages.
- Player actions such as movement and bomb placement are sent from the client to the server via WebSocket messages.
- Game events such as player movement, bomb explosions, and victory conditions are broadcasted to all clients using WebSocket.

## AUTHORS
+  Pape GUEYE (@papegueye)
+  Serigne Saliou Mbacké MBAYE (@serignmbaye)
+  Mamadou NDIAYE (@mamoundiaye)
+  Abdou Karim SOW (@abdouksow)