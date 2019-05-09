const teemo = require("../lol/teemo");
const matches = require("./matches");
const db = require("./db");

let players = [];
let todo_players = [];


function addPlayer(id) {
    if (!players.includes(id) && !todo_players.includes(id)) {
        todo_players.push(id);
        console.log("added player: ", id);
    }
}
module.exports.addPlayer = addPlayer;

// get user match history and deal with their 10 most recent games
async function processPlayer() {
    if (!todo_players)
        return console.log("no players to process");

    const id = todo_players.pop();
    players.push(id);

    // summoners rift games in this week
    const ml = await teemo.riot.get("na1", "match.getMatchlist", id, {
        queue: [400, 420, 430, 440 ],
        beginTime: Date.now() - (7 * 24 * 60 * 60 * 1000)
    });

    console.log("matches: ");
    console.log(ml);

    ml.matches.forEach(m => {
        matches.addMatch(m.gameId);
    });

}
module.exports.processPlayer = processPlayer;
