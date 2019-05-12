
let wrs = {
};
const teemo = require("../lol/teemo");
Object.keys(teemo.champNames).forEach(id => wrs[id] = { w : 0, l: 0 });



// update champion winrate
function updateWr(champ, win) {
    if (win)
        wrs[champ].w++;
    else
        wrs[champ].l++;
}
module.exports.updateWr = updateWr;

function addPlayer(id) {

}
module.exports.addPlayer = addPlayer;

function loadPlayers() {

}
module.exports.loadPlayers = loadPlayers;

function getWr(champ) {
    return wrs[champ];
}
module.exports.getWr = getWr;
module.exports.getWrs = () => wrs;

module.exports.getWr
