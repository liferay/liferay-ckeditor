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
		.replace(/<!--.*?-->/gs, '')
		.replace(/(<svg[^>]*)( fill="[^"]+")/, '\1')
		.replace(/<svg/, `<svg fill="${color}"`)
		.replace(/"/g, "'") // Use single quotes instead of double to avoid encoding.
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ')
		.replace(symbols, encodeURIComponent)
		.replace(/\s+/g, '%20');
};

const getCSS = (svgData, cKEditorIcon, direction) => {
	let directionClass = direction ? `.cke_${direction}` : '';

	const activeIconCSS = `
		${directionClass}.cke_hidpi .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_on .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				activeColor
			)}") !important;
		}
	`;

	const defaultIconCSS = `
		${directionClass}.cke_hidpi .cke_button .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				defaultColor
			)}") !important;
		}
	`;

	const disableIconCSS = `
		${directionClass}.cke_hidpi .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button.cke_button_disabled .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				disableColor
			)}") !important;
		}
	`;

	const hoverIconCSS = `
		${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):hover .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				hoverColor
			)}") !important;
		}
	`;

	const focusIconCSS = `
		${directionClass}.cke_hidpi .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon,
		${directionClass} .cke_button:not(.cke_button_disabled):focus .cke_button__${cKEditorIcon}_icon {
			background: url("data:image/svg+xml;charset=utf8,${encodeSvgData(
				svgData,
				focusColor
			)}") !important;
		}
	`;

	return [
		activeIconCSS,
		defaultIconCSS,
		disableIconCSS,
		hoverIconCSS,
		focusIconCSS,
	].join('\n\n');
};

let iconsCSSContent = '';

for (const [cKEditorIcon, clayIcon] of Object.entries(iconsConfig.icons)) {
	let directionClass = '';
	let svgDataList = [];

	let svgData;

	if (typeof clayIcon === 'string') {
		try {
			svgData = fs.readFileSync(
				`${sourceIconsPath}/${clayIcon}.svg`,
				'utf8'
			);

			iconsCSSContent += getCSS(svgData, cKEditorIcon);
		} catch (err) {
			console.warn(
				'Could not read:',
				`${sourceIconsPath}/${clayIcon}.svg`
			);
		}
	} else {
		if (clayIcon.ltr) {
			try {
				svgData = fs.readFileSync(
					`${sourceIconsPath}/${clayIcon.ltr}.svg`,
					'utf8'
				);

				iconsCSSContent += getCSS(svgData, cKEditorIcon, 'ltr');
			} catch (err) {
				console.warn(
					'Could not read:',
					`${sourceIconsPath}/${clayIcon.ltr}.svg`
				);
			}
		}

		if (clayIcon.rtl) {
			try {
				svgData = fs.readFileSync(
					`${sourceIconsPath}/${clayIcon.rtl}.svg`,
					'utf8'
				);

				iconsCSSContent += getCSS(svgData, cKEditorIcon, 'rtl');
			} catch (err) {
				console.warn(
					'Could not read:',
					`${sourceIconsPath}/${clayIcon.rtl}.svg`
				);
			}
		}
	}
}

fs.writeFileSync(outputFile, iconsCSSContent, {flag: 'a'});
