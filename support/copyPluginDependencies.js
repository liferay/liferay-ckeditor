const fs = require('fs');
const path = require('path');

const pluginDir = process.argv[2];

const configFilePath = path.join(pluginDir, 'deps.json');

const vendorsDir = path.join(pluginDir, 'vendors');

const rawData = fs.readFileSync(configFilePath);
const depsConfig = JSON.parse(rawData);

if (!fs.existsSync(vendorsDir)) {
	fs.mkdirSync(vendorsDir);
}

for (const [depType, deps] of Object.entries(depsConfig)) {
	const outputFile = path.join(vendorsDir, `vendors.${depType}`);

	let fileContent = '';

	for (const [dep, files] of Object.entries(deps)) {
		files.forEach((file) => {
			const filePath = path.join('../node_modules', dep, file);

			fileContent += fs.readFileSync(filePath);
		});
	}

	fs.writeFileSync(outputFile, fileContent);
}
