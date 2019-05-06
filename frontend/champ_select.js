

const teemo = require("../teemo");
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
                    color: #c8aa6e;
                    font-family: sans;
                }
                h2 {

                }

                /* should make images scale to fill page for different screen sizes */
                img {
                    border: 1px solid #c8aa6e;
                }

            </style>
        </head><body>
        <center><h1>LoL Item Counters</h1></center><hr/>
    `


    html += Object.keys(teemo.champNames)
        // alphabetical order
        //.sort((a, b)=> teemo.champNames[a].toLowerCase().localeCompare(teemo.champNames[b].toLowerCase()))
        .sort((a, b)=> (teemo.champNames[a] > teemo.champNames[b]) - (teemo.champNames[a] < teemo.champNames[b]))
        // map linked image
        .map(e => `<a href="/champ/${e}"><img src="${
            resources.resource_path(`img/champion/${e}.png`)}" title="${teemo.champNames[e]}" /></a>`)
        // newline for readability
        .join('\n');

    html += `
        </body>
    </html>

    `
    res.send(html);
}
