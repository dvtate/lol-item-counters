

const teemo = require("../lol/teemo");
const resources = require("./resources");

// homepage is just a big table of champion icons
//    clicking on champ icon will take user to relevant page for stats

module.exports = async (req, res) => {
    let html = "";
    html += `
    <html>
        <head>
            <title>LoL Item Counters</title>
            <style>
                html {
                    background-color: #000;
                    color: #fff;
                    font-family: sans;
                }

                h2 {

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
            <h4>${require("../backend/matches").getMatches.length} Matches Analyzed</h4>
        </center><hr/>
    `


    html += Object.keys(teemo.champNames)
        // alphabetical order
        .sort((a, b)=> (teemo.champNames[a] > teemo.champNames[b]) - (teemo.champNames[a] < teemo.champNames[b]))
        // linked image
        .map(e => `<a href="/champ/${e}"><img src="${teemo.ddragon.url}/img/champion/${teemo.ddragon.champName(e)}.png" title="${teemo.champNames[e]}" /></a>`)
        // newline for readability
        .join('\n');

    html += `
        </body>
    </html>
    `;

    res.send(html);
}
