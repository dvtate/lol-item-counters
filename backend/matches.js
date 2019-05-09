const teemo = require("../lol/teemo");
const players = require("./players");

let matches = [];
let todo_matches = [];


function addMatch(id) {
    if (!todo_matches.includes(id) || !matches.includes(id)) {
        todo_matches.push(id);
        console.log("added match: ", id);
    }
}
module.exports.addMatch = addMatch;

async function processMatch() {
    if (!todo_matches)
        return null;

    const id = todo_matches.pop();
    matches.push(id);

    const m_data = await teemo.riot.get("na1", "match.getMatch", id);
    console.log("m_data: ");
    console.log(m_data);
    const m_timeline = await teemo.riot.get("na1", "match.getMatchTimeline", id);
    console.log("m_timeline: ");
    console.log(m_timeline);

    m_data.participantIdentities.forEach(p => players.addPlayer(p.player.accountId));
    participants = {};
    const winning_team = m_data.teams[0]
    m_data.participants

}
module.exports.processMatch = processMatch;
