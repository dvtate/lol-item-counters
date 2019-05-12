const teemo = require("../lol/teemo");
const matches = require("./matches");
const db = require("./db");

let players = [];
let todo_players = [];


function addPlayer(id) {
    if (!players.includes(id) && !todo_players.includes(id)) {
        todo_players.push(id);
        //console.log("added player: ", id);
        return 1;
    }
    return 0;
}
module.exports.addPlayer = addPlayer;
module.exports.getPlayers = () => players;

// get user match history and deal with their 10 most recent games
async function processPlayer() {
    console.log("players: ", players.length);
    console.log("todo_players: ", todo_players.length);


    if (!todo_players)
        return console.log("no players to process");

    const id = todo_players.pop();

    let ml;
    try {
        // summoners rift games in this week
        ml = await teemo.riot.get("na1", "match.getMatchlist", id, {
            queue: 420,
            beginTime: Date.now() - (7 * 24 * 60 * 60 * 1000)
        });
    } catch (e) {
        todo_players.push(id);
        console.error(e);
    }

    //console.log("matchlist: ", ml);
    ml.matches.forEach(m => {
        matches.addMatch(m.gameId);
    });

    players.push(id);
    for (let i = 0; i < ml.matches.length; i++)
        await matches.processMatch();
}
module.exports.processPlayer = processPlayer;
