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
  getPlayerByAccess(access) {
    return this.players.find(player => player.access === access);
  }
  getPlayerByName(name) {
    return this.players.find(player => player.nickname === name)
  }
}

