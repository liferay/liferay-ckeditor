const fs = require('fs');
const path = require('path');

const pluginDir = process.argv[2];

const configFilePath = path.join(pluginDir, 'deps.json');

const depsDir = path.join(pluginDir, 'deps');

const rawData = fs.readFileSync(configFilePath);
const depsConfig = JSON.parse(rawData);

if (!fs.existsSync(depsDir)) {
	fs.mkdirSync(depsDir);
}

for (const [dep, files] of Object.entries(depsConfig)) {
	const outputDir = path.join(depsDir, dep);

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	files.forEach((file) => {
		const filePath = path.join('../node_modules', dep, file);

		const fileOutput = path.join(outputDir, path.basename(file));

		fs.copyFileSync(filePath, fileOutput);
	});
}
