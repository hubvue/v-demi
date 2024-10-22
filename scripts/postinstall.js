const { switchVersion, loadModule, loadModulePkg, checkVersion, getPkgFramework } = require('./utils')

const Vue = loadModule('vue')
const Mpx = loadModulePkg('@mpxjs/core')

function switchMpx() {
  switchVersion('mpx')
}

function switchVue() {
  if (Vue.version.startsWith('2.7.')) {
    switchVersion('vue', 2.7)
  }
  else if (Vue.version.startsWith('2.')) {
    switchVersion('vue', 2)
  }
  else if (Vue.version.startsWith('3.')) {
    switchVersion('vue', 3)
  }
  else {
    console.warn(`[v-demi] Vue version v${Vue.version} is not supported.`)
  }
}

function runSwitch() {
  if ((!Mpx || !checkVersion(Mpx.version, '2.7.0')) && (!Vue || typeof Vue.version !== 'string')) {
    console.warn('[v-demi] Vue or Mpx is not found. Please run "npm install vue or npm install @mpxjs/core" to install.')
    return
  }
  const framework = getPkgFramework()
  switch (true) {
    case framework === 'mpx':
      switchMpx()
      break
    case framework === 'vue':
      switchVue()
      break
    case !!Mpx:
      switchMpx()
      break
    default:
      switchVue()
      break
  }
}

runSwitch()
