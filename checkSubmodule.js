const child_process = require('child_process');

function main() {
	// See: https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables
	if (process.env.GITHUB_ACTIONS) {
		// Make sure submodule is pointing at a SHA-1 that we can checkout.
		const executable = 'git';
		const args = ['submodule', 'update'];
		const command = [executable, ...args].join(' ');

		const {error, signal, status, stderr, stdout} = child_process.spawnSync(
			executable,
			args
		);

		if (stdout != null) {
			console.log('\n\nstdout:\n\n' + stdout + '\n\n');
		}

		if (stderr != null) {
			console.log('\n\nstderr:\n\n' + stderr + '\n\n');
		}

		if (error) {
			console.log(
				`\n\nError executing \`${command}\`:\n\n` + error + '\n\n'
			);
		}

		if (signal != null) {
			console.log(
				`\n\nCommand \`${command}\` terminated with signal:\n\n` +
					signal +
					'\n\n'
			);
		}

		if (typeof status === 'number' && status) {
			console.log(
				`\n\nCommand \`${command}\` exited with status:\n\n` +
					status +
					'\n\n'
			);
		}

		if (status !== 0) {
			process.exit(1);
		}
	}
}

main();
