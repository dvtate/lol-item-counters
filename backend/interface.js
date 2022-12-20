

const teemo = require("../lol/teemo");
const db = require("./db");
const players = require("./players");
const matches = require("./matches");

/*
module.exports.itemStats =

{
    champid: {
        itemid: { w : ###, l: ### },
    }, ..
}

*/


module.exports.itemStats = {};
setTimeout(() => Object.keys(teemo.champNames).forEach(id => module.exports.itemStats[id] = {}), 1500);


module.exports.getWr = (champ) => {
    if (champ) {
        return db.getWr(champ);
    } else {
        return db.getWrs();
    }
    return ret;
};

module.exports.getCompleted = () => {
    return {
        players: players.getPlayers(),
        matches: matches.getMatches(),
    };
};
module.exports.getTodo = () => {
    return { // *
        players: [],
        matches: [],
    }
};


// called in matches.js
module.exports.updateStats = match_data => {
    /* accepts
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
        win: 0/1, // index of winning team
    },
    or null if there is nothing to do/invalid match
    */

    if (!match_data)
        return;
    //console.log("updating match data");

    // only one win/loss per game
    let update_item = (champ, item, win) => {
            if (!module.exports.itemStats[champ])
		module.exports.itemStats[champ] = {};
            let data = module.exports.itemStats[champ][item] || { w: 0, l: 0 };
            if (win)
                data.w++;
            else
                data.l++;
            module.exports.itemStats[champ][item] = data;
    };

    //Object.keys(match_data.teams[0]).forEach(c => console.log(c));
    //Object.keys(match_data.teams[1]).forEach(c => console.log(c));

    // update item stats for both teams
    Object.keys(match_data.teams[0]).forEach(achamp => {

        Object.keys(match_data.teams[1]).forEach(echamp => {
            let items = {}; // only one item per matchup
            match_data.teams[1][echamp].forEach(item =>
                items[item] = true);
            Object.keys(items).forEach(item =>
                update_item(achamp, item, match_data.win == 0));
        })
        db.updateWr(achamp, match_data.win == 1);
    });

    Object.keys(match_data.teams[1]).forEach(achamp => {
        Object.keys(match_data.teams[0]).forEach(echamp => {
            let items = {}; // only one item per matchup
            match_data.teams[0][echamp].forEach(item =>
                items[item] = true);
            Object.keys(items).forEach(item =>
                update_item(achamp, item, match_data.win == 1));
        });
        db.updateWr(achamp, match_data.win == 0);
    });
}
