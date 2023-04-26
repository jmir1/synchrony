const esbuild = require('esbuild'),
  { join } = require('path'),
  { copyFileSync } = require('fs')

const process_exit = process.exit

const ROOT_PATH = join(__dirname, '..'),
  DIST_PATH = join(ROOT_PATH, 'dist'),
  SRC_PATH = join(ROOT_PATH, 'src')

const args = process.argv.slice(2)

// should be 'production' | 'development'
const env = 'production'

// production enables certain things that make debugging harder
const production = env === 'production'

function postBuild() {
  console.log('Copying CLI ===')
  copyFileSync(join(SRC_PATH, 'deobfuscate.js'), join(DIST_PATH, 'deobfuscate.js'))

  console.log('Building type declarations ===')
}
console.log('Building lib ===')

// code splitting (+ shared code splitting) is only available for ESM format :(
esbuild
  .build({
    entryPoints: [join(SRC_PATH, 'index.ts')],

    watch: false,
    bundle: true,
    outdir: DIST_PATH,
    sourcemap: false,
    minify: production,

    platform: 'browser',
    format: 'esm',

    legalComments: 'inline',

    logLevel: 'info',
    logLimit: process.env.CI ? 0 : 30,

    define: {
      'process.env.NODE_DEBUG': process.env.NODE_DEBUG,
      'process.env.NODE_ENV': env,
    },
  })
  .then(() => postBuild())
  .catch((_err) => {
    process_exit(1)
  })
