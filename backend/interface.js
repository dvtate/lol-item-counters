

const teemo = require("../lol/teemo");
const db = require("./db");


/*
module.exports.itemStats =

{
    champid: {
        itemid: { w : ###, l: ### },
    }, ..
}

*/

module.exports.itemStats = {};
Object.keys(teemo.champNames).forEach(id => module.exports.itemStats[id] = {});
module.exports.itemStats['42']['1001'] = { w: 50, l: 50 };
console.log(module.exports.itemStats);
module.exports.getWr = () => {
    // TODO: make use db
    let ret = {};
    Object.keys(teemo.champNames).forEach(id => ret[id] = { w: 50, l: 50 });
    return ret;
}
