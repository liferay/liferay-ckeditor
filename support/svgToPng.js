const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const configFilePath = process.argv[2];
const outputDir = process.argv[3];

const rawData = fs.readFileSync(configFilePath);
const iconsConfig = JSON.parse(rawData);

const sourceIconsPath = path.join(
	path.dirname(configFilePath),
	'..',
	iconsConfig.dir
);

for (const [source, output] of Object.entries(iconsConfig.icons)) {
	sharp(`${sourceIconsPath}/${icon.source}.svg`)
		.resize(16)
		.png()
		.toFile(path.resolve(`${outputDir}/${icon.output}.png`))
		.then(() => {
			console.log(`${icon.source} SVG icon converted to PNG`);
		})
		.catch((err) => {
			console.log(`${icon.source} ${err}`);
			process.exit(1);
		});

	sharp(`${sourceIconsPath}/${icon.source}.svg`)
		.resize(32)
		.png()
		.toFile(path.resolve(`${outputDir}/hidpi/${icon.output}.png`))
		.then(() => {
			console.log(`${icon.source} SVG icon converted to HIDPI PNG`);
		})
		.catch((err) => {
			console.log(`${icon.source} ${err}`);
			process.exit(1);
		});
}
