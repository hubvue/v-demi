const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, '..', 'lib')

function loadModule(name) {
  try {
    return require(name)
  } catch (e) {
    return undefined
  }
}

function loadModulePkg(name) {
  try {
    const pkgPath = require.resolve(`${name}/package.json`)
    return require(pkgPath)
  } catch (e) {
    return undefined
  }
}

function loadProjectPkg() {
  try {
    console.log('process.cwd()', process.cwd())
    const projectPkgPath = path.resolve(process.cwd(), 'package.json')
    console.log('pkg path', projectPkgPath)
    const pkg = require(projectPkgPath)
    console.log('pkg', pkg)
    return pkg
  } catch (e) {
    return undefined
  }
}

function getPkgFramework() {
  const pkg = loadProjectPkg()
  if (!pkg) {
    return undefined
  }
  return pkg['v-demi']
}

function checkVersion(srcV, destV) {
  const srcVArr = srcV.split('-')[0].split('.').map(v => +v)
  const destVArr = destV.split('-')[0].split('.').map(v => +v)
  
  const srcVMa = srcVArr[0]
  const destVMa = destVArr[0]
  const srcVMi = srcVArr[1]
  const destVMi = destVArr[1]
  const srcVP = srcVArr[2]
  const destVP = destVArr[2]
  if (srcVMa < destVMa) {
    return false
  }
  if (srcVMi < destVMi) {
    return false
  }
  return srcVP >= destVP
}

function copy(name, version, vue) {
  vue = vue || 'vue'
  const src = path.join(dir, `v${version}`, name)
  const dest = path.join(dir, name)
  let content = fs.readFileSync(src, 'utf-8')
  content = content.replace(/'vue'/g, `'${vue}'`)
  // unlink for pnpm, #92
  try {
    fs.unlinkSync(dest)
  } catch (error) { }
  fs.writeFileSync(dest, content, 'utf-8')
}

function copyMpx(name, version) {
  const src = path.join(dir, `mpx${version}`, name)
  const dest = path.join(dir, name)
  let content = fs.readFileSync(src, 'utf-8')
  // unlink for pnpm, #92
  try {
    fs.unlinkSync(dest)
  } catch (error) { }
  fs.writeFileSync(dest, content, 'utf-8')
}

function updateVue2API() {
  const ignoreList = ['version', 'default']
  const VCA = loadModule('@vue/composition-api')
  if (!VCA) {
    console.warn('[vue-demi] Composition API plugin is not found. Please run "npm install @vue/composition-api" to install.')
    return
  }

  const exports = Object.keys(VCA).filter(i => !ignoreList.includes(i))

  const esmPath = path.join(dir, 'index.mjs')
  let content = fs.readFileSync(esmPath, 'utf-8')

  content = content.replace(
    /\/\*\*VCA-EXPORTS\*\*\/[\s\S]+\/\*\*VCA-EXPORTS\*\*\//m,
`/**VCA-EXPORTS**/
export { ${exports.join(', ')} } from '@vue/composition-api/dist/vue-composition-api.mjs'
/**VCA-EXPORTS**/`
    )

  fs.writeFileSync(esmPath, content, 'utf-8')
  
}

function switchVersion(framework, version, vue) {
  switch (framework) {
    case 'mpx':
      copyMpx('index.cjs', '')
      copyMpx('index.mjs', '')
      copyMpx('index.d.ts', '')
      break
    default:
      copy('index.cjs', version, vue)
      copy('index.mjs', version, vue)
      copy('index.d.ts', version, vue)
    
      if (version === 2)
        updateVue2API()
  }
}


module.exports.loadModule = loadModule
module.exports.switchVersion = switchVersion
module.exports.loadModulePkg = loadModulePkg
module.exports.checkVersion = checkVersion
module.exports.loadProjectPkg = loadProjectPkg
module.exports.getPkgFramework = getPkgFramework
