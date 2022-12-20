
const teemo = require("../lol/teemo");
const players = require("./players");
const matches = require("./matches");

const summoners = ['ridderhoff', 'ggun', 'Berenthal', 'flameon', 'frying', 'realcry', ];

Promise.all(summoners.map(async sn => {
	const s = await teemo.riot.get('na1', 'summoner.getBySummonerName', sn);
	players.addPlayer(s.puuid);
})).then(async function chron(){
    await players.processPlayer();
    setTimeout(chron, 20000);
});
