const teemo = require("../lol/teemo");
const matches = require("./matches");
const db = require("./db");

let players = [];
let todo_players = [];


function addPlayer(id) {
    if (!players.includes(id) && !todo_players.includes(id)) {
        todo_players.push(id);
//        console.log("added player: ", id);
        return 1;
    }
    return 0;
}
module.exports.addPlayer = addPlayer;
module.exports.getPlayers = () => players;

// get user match history and deal with their 10 most recent games
async function processPlayer() {
    process.stdout.write("\rplayers: " + players.length + " todo_players: " + todo_players.length + '\r');

    if (!todo_players)
        return console.log("no players to process");

    const id = todo_players.shift();

    let ml;
    try {
        // summoners rift games in this week
        ml = await teemo.riot.get("AMERICAS", "match.getMatchIdsByPUUID", id, {
            queue: 420,
            beginTime: Date.now() - (7 * 24 * 60 * 60 * 1000)
        });

//        console.log("matchlist: ", ml);
	let added = 0;
        ml.forEach(m => {
            added += matches.addMatch(m);
        });

        players.push(id);
        for (let i = 0; i < added; i++)
            matches.processMatch();

    } catch (e) {
        todo_players.push(id);
        console.error(e);
    }

}
module.exports.processPlayer = processPlayer;
