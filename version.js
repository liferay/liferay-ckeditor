const fs = require("fs");
const path = require("path");

function main() {
    checkVersion();
}

/**
 * Confirms that proposed version:
 *
 * - Conforms to expected pattern (eg. 4.13.1-liferay.1).
 * - Matches the CKEditor version currently checked out in submodule.
 * - Matches the version in the build output.
 *
 */
function checkVersion() {
    const version = process.env.npm_package_version;

    if (!version) {
        die("Expected non-empty npm_package_version environment variable");
    }

    let ckeditorVersion;

    try {
        ({ version: ckeditorVersion } = require("./ckeditor-dev/package.json"));
    } catch (_error) {
        die("Unable to read version from ckeditor-dev/package.json");
    }

    if (!ckeditorVersion || !/^\d+\.\d+\.\d+$/.test(ckeditorVersion)) {
        die(`Unexpected CKEditor version: ${ckeditorVersion}`);
    }

    const regexp = new RegExp(`^${ckeditorVersion}-liferay\\.\\d+$`);

    if (!regexp.test(version)) {
        die(
            `Proposed version ${JSON.stringify(
                version
            )} does not match expected format (${regexp})`
        );
    }

    let builtVersion;

    try {
        const source = fs.readFileSync(
            path.join(__dirname, "ckeditor", "ckeditor.js"),
            "utf8"
        );

        [, builtVersion] = source.match(/\bversion\s*:\s*"(\d+\.\d+\.\d+)/);
    } catch (_error) {
        die("Failed to read built version from ckeditor/ckeditor.js");
    }

    if (builtVersion !== ckeditorVersion) {
        die(
            `Built CKEditor version (${builtVersion}) does not match submodule version (${ckeditorVersion})`
        );
    }
}

function die(message) {
    log(`error: ${message}`);

    process.exit(1);
}

function log(message) {
    process.stderr.write(`${message}\n`);
}

main();
