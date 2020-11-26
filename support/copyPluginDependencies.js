const fs = require('fs');
const path = require('path');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

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

			if (depType === 'js') {
				const code = fs.readFileSync(filePath);

				const ast = parser.parse(code.toString());

				traverse(ast, {
					enter(path) {
						if (
							path.node.type === 'UnaryExpression' &&
							path.node.operator === 'typeof' &&
							path.node.argument.type === 'Identifier' &&
							path.node.argument.name === 'define'
						) {
							path.node.argument.name = '__define_disabled__';
						}
					},
				});

				const output = generate(ast, code);

				fileContent += output.code;
			} else {
				fileContent += fs.readFileSync(filePath);
			}
		});
	}

	fs.writeFileSync(outputFile, fileContent);
}
