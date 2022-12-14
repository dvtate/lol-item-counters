const teemo = require("../lol/teemo");
const players = require("./players");
const interface = require("./interface");

let matches = [];
let todo_matches = [];


function addMatch(id) {
    if (!todo_matches.includes(id) || !matches.includes(id)) {
        todo_matches.push(id);
        return 1;
    }
    return 0;
}
module.exports.addMatch = addMatch;
module.exports.getMatches = () => matches;

/* return value
{
    teams: [
        {
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
        }, {
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
            "champid" : [items]
        }
    ],
    win: 0/1,
},
or null if there is nothing to do/invalid match
*/
async function processMatch() {
    process.stdout.write("matches: " + matches.length + " todo_matches: " + todo_matches.length + '\r');

    if (!todo_matches)
        return console.log('no matches to process');

    const id = todo_matches.pop();

    let match_data, timeline;
    try {
        match_data = await teemo.riot.get("AMERICAS", "match.getMatch", id);
        timeline = await teemo.riot.get("AMERICAS", "match.getTimeline", id);

        // figure out winning team id, if both/neither is win return null
        const winning_team_id =
            match_data.info.teams[0].win == match_data.info.teams[1] ? null
            : match_data.info.teams[0].win ? match_data.info.teams[0].teamId
            : match_data.info.teams[1].win ? match_data.info.teams[1].teamId
            : null;
        if (!winning_team_id) {
//            matches.push(id);
            return null;
        }

        // see comment above this fxn
        let ret = {
            teams: [{}, {}],
            win: 1
        };

        // participantids mapped to champion, team, and index
        // makes it so that i can read riotapi data into ret
        let participants = {
            // participantId : { champ: championId, teamInd: !!win }
        };

        // load match data into our datastructures
        match_data.info.participants.forEach(p => {
            const teamInd = p.teamId == winning_team_id ? 1 : 0;
            ret.teams[teamInd][p.championId] = [];
            participants[p.participantId] = { champ: p.championId, teamInd: teamInd };
        });

        timeline.info.frames.forEach(f => f.events.forEach(e => {
            const p = participants[e.participantId];
            if (e.type == "ITEM_PURCHASED") {
                ret.teams[p.teamInd][p.champ].push(e.itemId);
            } else if (e.type == "ITEM_UNDO") {
                const ind = ret.teams[p.teamInd][p.champ].lastIndexOf(e.beforeId);
                if (ind < 0) {
                    if (e.beforeId == 0) // undo sell
                        ret.teams[p.teamInd][p.champ].push(e.afterId);
                    else
                        console.log("invalid ITEM_UNDO event... (or maybe out of order... o fuck)\n",
                            "item: ", e.beforeId, "inventory: ", ret.teams[p.teamInd][p.champ], "after: ", e.afterId);

                } else {
                    ret.teams[p.teamInd][p.champ].splice(ind, 1);
                }
            } else if (e.type == "ITEM_DESTROYED") {
                const ind = ret.teams[p.teamInd][p.champ].lastIndexOf(e.itemId);
                
            }
        }));

        // get items
//	console.log('ret', ret);
        interface.updateStats(ret);

        matches.push(id);
        let added = 0;
//	console.log('ps', match_data.metadata.participants);
        match_data.metadata.participants.forEach(p => added += players.addPlayer(p));
	//console.log('added', added, 'players');
        for (let i = 0; i < added; i++)
            players.processPlayer();
    } catch (e) {
        // maybe i should use a queue...
        console.error("processMatch(): ", e);
        todo_matches.push(id);
        return null;
    }
}
module.exports.processMatch = processMatch;
