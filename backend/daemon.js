
const teemo = require("../lol/teemo");
const players = require("./players");
const matches = require("./matches");

async function tick() {
    players.addPlayer('QUJ-xolmtoHxvgf96rC9X26BhLkrL1bytSciJnFk9U13XpA'); // start with me, a player in top 40% (roughly average)
    await players.processPlayer();
};

function chron(){
    tick();
    setTimeout(chron, 120000);
}
setTimeout(chron, 1000);
