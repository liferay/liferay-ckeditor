const fs = require('fs')
const path = require( 'path' )
const sharp = require("sharp")

const configFilePath = process.argv[2];
const outputDir = process.argv[3]

let rawdata = fs.readFileSync(configFilePath)
let iconsConfig = JSON.parse(rawdata)

const sourceIconsPath = path.join(path.dirname(configFilePath), '../', iconsConfig.dir)

for (const icon of iconsConfig.icons) {
    sharp(`${sourceIconsPath}/${icon.source}.svg`)
        .resize(16)
		.png()
		.toFile(path.resolve(`${outputDir}/${icon.output}.png`))
		.then(() => {
			console.log(`${icon.source} SVG icon converted to PNG`)
		})
		.catch(err => {
            console.log(`${icon.source} ${err}`)
            process.exit(1);
		})

    sharp(`${sourceIconsPath}/${icon.source}.svg`)
        .resize(32)
        .tint('rgb(39,40,51)')
		.png()
		.toFile(path.resolve(`${outputDir}/hidpi/${icon.output}.png`))
		.then(() => {
			console.log(`${icon.source} SVG icon converted to HIDPI PNG`)
		})
		.catch(err => {
            console.log(`${icon.source} ${err}`)
            process.exit(1);
        })
}