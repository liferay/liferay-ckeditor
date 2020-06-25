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

const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

let iconsCSSContent = '';

for (const [output, source] of Object.entries(iconsConfig.icons)) {
	var svgData = fs.readFileSync(`${sourceIconsPath}/${source}.svg`, 'utf8');

	const defaultSvgData = svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, '<svg fill="#6b6c7e"')
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');

	const defaultIconCSS = 
		`.cke_hidpi .cke_button .cke_button__${output}_icon,
		.cke_button .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${defaultSvgData}") !important;
		}`;

	const hoverSvgData = svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, '<svg fill="#272833"')
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');

	const hoverIconCSS = 
		`.cke_hidpi .cke_button:hover .cke_button__${output}_icon,
		.cke_button:hover .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${hoverSvgData}") !important;
		}`;

	const activeSvgData = svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, '<svg fill="#272833"')
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');

	const activeIconCSS = 
		`.cke_hidpi .cke_button.cke_button_on .cke_button__${output}_icon,
		.cke_button.cke_button_on .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${activeSvgData}") !important;
		}`;

	const disableSvgData = svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, '<svg fill="#a7a9bc"')
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');

	const disableIconCSS = 
		`.cke_hidpi .cke_button.cke_button_disabled .cke_button__${output}_icon,
		.cke_button.cke_button_disabled .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${disableSvgData}") !important;
		}`;

	const focusSvgData = svgData
		.replace(/\s+fill="[^"]+"/, '')
		.replace(/<svg/, '<svg fill="#272833"')
		.replace(/"/g, '\'') // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, "><")
		.replace(/\s{2,}/g, " ")
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');

	const focusIconCSS = 
		`.cke_hidpi .cke_button:focus .cke_button__${output}_icon,
		.cke_button:focus .cke_button__${output}_icon {
			background: url("data:image/svg+xml;charset=utf8,${focusSvgData}") !important;
		}`;

	iconsCSSContent += `${defaultIconCSS} ${hoverIconCSS} ${activeIconCSS} ${disableIconCSS} ${focusIconCSS}`;
}
fs.writeFileSync(outputFile, iconsCSSContent, { flag: 'a'});