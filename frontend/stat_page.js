const teemo = require("../lol/teemo");
const backend = require("../backend/interface");
const resources = require("./resources");

module.exports = async (req, res) => {
    let page = `
    <html>
        <head>
            <title>${teemo.champNames[req.params.id]} - LoL Item Counters</title>
            <style>
                html {
                    /*background-color: #000;
                    color: #fff;*/
                    font-family: sans;
                }
            </style>
        </head><body>
    `;

    const wr = backend.getWr()[req.params.id];

    page += `<table><tr>
            <td><img src="${teemo.ddragon.url}/img/champion/${teemo.ddragon.champName(req.params.id)}.png" title="${teemo.champNames[req.params.id]}" /></td>
            <td><h2>${teemo.champNames[req.params.id]}</h2><h4>${wr.w}W ${wr.l}L ${Math.round(10000 * wr.w /( wr.w + wr.l)) / 100}%</h4></td>
        </tr></table><hr>`;

    page += `<table>
    <tr><th>Item</th><th>WR</th></tr>
    ${ Object.keys(backend.itemStats[req.params.id]).map(i => {
                const w = backend.itemStats[req.params.id][i].w,
                      l = backend.itemStats[req.params.id][i].l;
                return `<tr>
                    <td><img src="${teemo.ddragon.url}/img/item/${i}.png" title="itemid#${i}" alt="lol item #${i}" /></td>
                    <td><h4>${w}W ${l}L ${Math.round(10000 * w / (w + l)) / 100}%</h4></td>
                </tr>`}).join('\n')
    }`;

    page += `</body></html>`;

    res.send(page);
}
