
const teemo = require("../lol/teemo");
const players = require("./players");
const matches = require("./matches");

players.addPlayer('kjWghx-bZxoVJ4qqC7Fn9sYeOQujQUzV5e-2NaWlkmRrVA-zWf4a8jSuJPexkyI26pjB_tabiCrf3g'); // start with me, a player in top 40% (roughly average)

async function chron(){
    await players.processPlayer();
    setTimeout(chron, 20000);
}
setTimeout(chron, 2000);
