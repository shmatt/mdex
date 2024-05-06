import * as core from '@actions/core'
import * as glob from '@actions/glob'
import path from 'path'
import { promises as fs } from 'fs'
import * as fm from 'front-matter'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const pattern = core.getInput('pattern') || '/home/node/Journal/**/*.md'
    const output = core.getInput('output') || 'index.json'

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.info(`Reading markdown files from ${pattern}`)

    const index: { [key: string]: unknown } = {}

    const globber = await glob.create(pattern)
    let fileCount = 0
    let errorCount = 0

    for await (const file of globber.globGenerator()) {
      try {
        fileCount++

        core.debug(`Found file: ${file}`)

        // Read the file
        const content = await fs.readFile(file, 'utf8')

        // extract frontmatter
        const { attributes } = fm.default<unknown>(content)

        // Parse the relative path based on the glob pattern
        const relativePath = path.relative(globber.getSearchPaths()[0], file)

        // Add the file to the index
        index[relativePath] = attributes
      } catch (error) {
        core.error(`Error processing file: ${file}`)
        if (error instanceof Error) core.error(error.message)
        errorCount++
      }
    }

    core.info(`Processed ${fileCount} files with ${errorCount} errors`)

    // Write the index to the output file
    await fs.writeFile(output, JSON.stringify(index, null, 2))

    core.info(`Wrote index to ${output}`)
    core.setOutput('indexPath', output)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
