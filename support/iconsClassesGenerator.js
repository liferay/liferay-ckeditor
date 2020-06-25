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
		.replace(/"/g, "'") // Use single quotes instead of double to avoid encoding.
		.replace(/>\s{1,}</g, '><')
		.replace(/\s{2,}/g, ' ')
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');
};

const getCSS = (svgData, cKEditorIcon, direction) => {
	let directionClass = direction ? `.cke_${direction}` : '';

	const activeIconCSS = `${directionClass}.cke_hidpi .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				activeColor
			)}") !important;
		}`;

	const defaultIconCSS = `${directionClass}.cke_hidpi .cke_button .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				defaultColor
			)}") !important;
		}`;

	const disableIconCSS = `${directionClass}.cke_hidpi .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				disableColor
			)}") !important;
		}`;

	const hoverIconCSS = `${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				hoverColor
			)}") !important;
		}`;

	const focusIconCSS = `${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				focusColor
			)}") !important;
		}`;

	return `${activeIconCSS} ${defaultIconCSS} ${disableIconCSS} ${hoverIconCSS} ${focusIconCSS}`;
};

let iconsCSSContent = '';

for (const [cKEditorIcon, clayIcon] of Object.entries(iconsConfig.icons)) {
	let directionClass = '';
	let svgDataList = [];

	if (typeof clayIcon === 'string') {
		const svgData = fs.readFileSync(
			`${sourceIconsPath}/${clayIcon}.svg`,
			'utf8'
		);

		iconsCSSContent += getCSS(svgData, cKEditorIcon);
		//svgDataList = [fs.readFileSync(`${sourceIconsPath}/${clayIcon}.svg`, 'utf8')];
	} else {
		if (clayIcon.ltr) {
			const svgData = fs.readFileSync(
				`${sourceIconsPath}/${clayIcon.ltr}.svg`,
				'utf8'
			);

			iconsCSSContent += getCSS(svgData, cKEditorIcon, 'ltr');
		}

		if (clayIcon.rtl) {
			const svgData = fs.readFileSync(
				`${sourceIconsPath}/${clayIcon.rtl}.svg`,
				'utf8'
			);

			iconsCSSContent += getCSS(svgData, cKEditorIcon, 'rtl');
		}

		//directionClass = `.cke_${clayIcon.direction}`;
		//svgData = fs.readFileSync(`${sourceIconsPath}/${clayIcon.icon}.svg`, 'utf8');
	}

	/*
	const activeIconCSS = 
		`${directionClass}.cke_hidpi .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, activeColor)}") !important;
		}`;

	const defaultIconCSS = 
		`${directionClass}.cke_hidpi .cke_button .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, defaultColor)}") !important;
		}`;

	const disableIconCSS = 
		`${directionClass}.cke_hidpi .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, disableColor)}") !important;
		}`;

	const hoverIconCSS = 
		`${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, hoverColor)}") !important;
		}`;

	const focusIconCSS = 
		`${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(svgData, focusColor)}") !important;
		}`;

		iconsCSSContent += `${activeIconCSS} ${defaultIconCSS} ${disableIconCSS} ${hoverIconCSS} ${focusIconCSS}`;
	*/
}

fs.writeFileSync(outputFile, iconsCSSContent, {flag: 'a'});
