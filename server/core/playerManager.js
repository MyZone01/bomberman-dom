export class PlayersManager {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerById(id) {
    return this.players.find(player => player.id === id);
  }
  getPlayerByname(name){
    return this.players.find(player => player.nickname === name)
  }
}

