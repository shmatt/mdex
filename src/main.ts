import * as core from '@actions/core'
import * as glob from '@actions/glob'
import { wait } from './wait'
import path from 'path'
import { promises as fs } from 'fs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
	try {
		const rootPath = core.getInput('path') || '~/Journal'

		// Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
		const pattern = path.join(rootPath, '**/*.md');
		core.debug(`Reading markdown files from ${pattern}`);

		const globber = await glob.create(pattern);
		for await (const file of globber.globGenerator()) {
			core.debug(`Found file: ${file}`);
			// Read the file
			const content = await fs.readFile(file, 'utf8');
			const stats = await fs.stat(file);
			const fileStats = {
				ctime: stats.ctime.getTime(),
				mtime: stats.mtime.getTime(),
				size: stats.size
			};

			// extract frontmatter

			// Parse the file
			// core.debug(`Parsed page: ${page}`);
		}

	} catch (error) {
		// Fail the workflow run if an error occurs
		if (error instanceof Error) core.setFailed(error.message)
	}
}
