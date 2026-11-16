import { existsSync } from 'node:fs'

const dir = 'soda'
const repository = 'https://github.com/getsodajs/soda.git'

function git(args: string[]): void {
  const result = Bun.spawnSync(['git', ...args], { stdout: 'inherit', stderr: 'inherit' })

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1)
  }
}

if (process.env.SODA_DIR !== undefined) {
  console.log(`Reading the docs from ${process.env.SODA_DIR}`)
  process.exit(0)
}

if (existsSync(`${dir}/.git`)) {
  git(['-C', dir, 'fetch', '--quiet', '--depth', '1', 'origin', 'main'])
  git(['-C', dir, 'reset', '--quiet', '--hard', 'FETCH_HEAD'])
} else {
  git(['clone', '--quiet', '--depth', '1', repository, dir])
}

console.log(`Reading the docs from ${dir} at ${Bun.spawnSync(['git', '-C', dir, 'rev-parse', '--short', 'HEAD']).stdout.toString().trim()}`)
