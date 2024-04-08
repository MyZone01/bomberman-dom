export default class PlayersManager {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerById(id) {
    return this.players.find(player => player.id === id);
  }
}
