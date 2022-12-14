

const teemo = require("../lol/teemo");
const resources = require("./resources");

const startDate = new Date();

// homepage is just a big table of champion icons
//    clicking on champ icon will take user to relevant page for stats

module.exports = async (req, res) => {
    let html = "";
    html += `<!doctype html>
    <html>
        <head>
            <title>LoL Item Counters</title>
            <style>
                html {
                    background-color: #000;
                    color: #fff;
                    font-family: sans;
                }

                /* should make images scale to fill page for different screen sizes */
                img {
                    border: 2px solid #c8aa6e;
                    transition: border 0.25s;
                }
                img:hover {
                    border: 2px solid #fff;
                }

            </style>
        </head><body>
        <center>
            <h1>LoL Item Counters<sup style="font-size:50%">Alpha</sup></h1>
            <p>${require("../backend/matches").getMatches().length} matches analyzed since ${startDate.toString()} </p>
        </center><hr/>
    `


    html += Object.keys(teemo.champNames)
        // alphabetical order
        .sort((a, b)=> (teemo.champNames[a] > teemo.champNames[b]) - (teemo.champNames[a] < teemo.champNames[b]))
        // linked image
        .map(e => `<a href="/champ/${e}"><img src="${teemo.ddragon.url}/img/champion/${teemo.ddragon.champName(e)}.png" title="${teemo.champNames[e]}" /></a>`)
        // newline for readability
        .join('\n');

    html += ``

    html += `
        <hr/>
	<h1>API</h1>
	<ul>
	<li><a href="/api/items">GET /api/items</a></li>
	<li><a href="/api/wrs">GET /api/wrs</a></li>
	</ul>
        </body>
    </html>
    `;

    res.send(html);
}
