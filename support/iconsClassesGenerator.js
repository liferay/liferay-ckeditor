const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const configFilePath = process.argv[2];
const outputFile = process.argv[3];

const rawData = fs.readFileSync(configFilePath);
const iconsConfig = JSON.parse(rawData);

const sourceIconsPath = path.join(
	path.dirname(configFilePath),
	'..',
	iconsConfig.dir
);

const activeColor = '#272833';
const defaultColor = '#6b6c7e';
const disableColor = '#a7a9bc';
const focusColor = '#272833';
const hoverColor = '#272833';

const encodeSvgData = (svgData, color) => {
	const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

	return svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, `<svg fill="${color}"`)
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');
};

let iconsCSSContent = '';

for (const [output, source] of Object.entries(iconsConfig.icons)) {
	var svgData = fs.readFileSync(`${sourceIconsPath}/${source}.svg`, 'utf8');
	
	const activeIconCSS = 
		`.cke_hidpi .cke_button.cke_button_on .cke_button__${output}_icon,
		.cke_button.cke_button_on .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, activeColor)}") !important;
		}`;

	const defaultIconCSS = 
		`.cke_hidpi .cke_button .cke_button__${output}_icon,
		.cke_button .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, defaultColor)}") !important;
		}`;

	const disableIconCSS = 
		`.cke_hidpi .cke_button.cke_button_disabled .cke_button__${output}_icon,
		.cke_button.cke_button_disabled .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, disableColor)}") !important;
		}`;

	const hoverIconCSS = 
		`.cke_hidpi .cke_button:hover .cke_button__${output}_icon,
		.cke_button:hover .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, hoverColor)}") !important;
		}`;

	const focusIconCSS = 
		`.cke_hidpi .cke_button:focus .cke_button__${output}_icon,
		.cke_button:focus .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, focusColor)}") !important;
		}`;

	iconsCSSContent += `${activeIconCSS} ${defaultIconCSS} ${disableIconCSS} ${hoverIconCSS} ${focusIconCSS}`;
}

fs.writeFileSync(outputFile, iconsCSSContent, { flag: 'a'});