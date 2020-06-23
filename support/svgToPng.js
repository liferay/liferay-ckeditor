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
	var svgData = fs.readFileSync(`${sourceIconsPath}/${source}.svg`, 'utf8');

	svgData = svgData.replace(/\<svg/g, '<svg fill="#6B6C7E"');

	const svgBuffer = Buffer.from(svgData, 'utf8');

	sharp(svgBuffer)
		.resize(16)
		.png()
		.toFile(path.resolve(`${outputDir}/${output}.png`))
		.then(() => {
			console.log(`${source} SVG icon converted to PNG`);
		})
		.catch((err) => {
			console.log(`${source} ${err}`);
			process.exit(1);
		});

	sharp(svgBuffer)
		.resize(32)
		.png()
		.toFile(path.resolve(`${outputDir}/hidpi/${output}.png`))
		.then(() => {
			console.log(`${source} SVG icon converted to HIDPI PNG`);
		})
		.catch((err) => {
			console.log(`${source} ${err}`);
			process.exit(1);
		});
}
