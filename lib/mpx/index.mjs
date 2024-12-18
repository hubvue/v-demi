import * as Mpx from '@mpxjs/core'

var isVue2 = false
var isVue3 = false
var isMpx = true
var Vue2 = undefined
var Vue = undefined


function install() {}

export * from '@mpxjs/core'
export {
  Vue,
  Vue2,
  Mpx,
  isVue2,
  isVue3,
  isMpx,
  install,
}

// Vue 3 components mock
function createMockComponent(name) {
  return {
    setup() {
      throw new Error('[v-demi] ' + name + ' is not supported in Mpx. It\'s provided to avoid compiler errors.')
    }
  }
}
export var Fragment = /*#__PURE__*/ createMockComponent('Fragment')
export var Transition = /*#__PURE__*/ createMockComponent('Transition')
export var TransitionGroup = /*#__PURE__*/ createMockComponent('TransitionGroup')
export var Teleport = /*#__PURE__*/ createMockComponent('Teleport')
export var Suspense = /*#__PURE__*/ createMockComponent('Suspense')
export var KeepAlive = /*#__PURE__*/ createMockComponent('KeepAlive')
