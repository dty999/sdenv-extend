import _merge from 'lodash-es/merge';
import { gv } from './globalVarible';
import { loopRunInit } from './utils/index';
import * as tools from './tools/index';
import * as adapt from './adapt/index'
import * as handles from './handle/index';


export default class {
  constructor(config, win = undefined) {
    console.log('[mysdenv: win1 ] ')
    const self = this;
    Object.assign(this, _merge(
      {},
      gv,
      config || {},
      {
        tools,
        adapt,
      }
    ));
    this.setWindow(win);
    this.setDocument(win.document);

    loopRunInit.call(this);
    this.bindThis();
  }

  bindThis() {
    const that = this;
    function addBind(obj) {
      Object.entries(obj).forEach(([key, fun]) => {
        if (typeof fun !== 'function') {
          addBind(fun)
        } else {
          obj[key] = fun.bind(that);
        }
      })
    }
    ['tools', 'adapt'].forEach(it => {
      addBind(this[it]);
    });
  }

  setWindow(win) {
    if (!win) return;
    Object.assign(this.memory, {
      sdWindow: win,
      sdEval: win.eval,
      sdFunction: win.Function,
      sdDate: win.Date,
      sdMath: win.Math,
    });
    if (this.config.isNode) {
      // 修改setFunc工具中的Function指向到window.Function
      // tools._setFuncInit();
      Object.setPrototypeOf(win.window, win.Window.prototype);
    }
  }

  setDocument(document){
    this.getHandle('document')()

  }


  getHandle(name) {
    const handleName = `${name}Handle`;
    if (!handles[handleName]) return;
    return (...params) => {
      handles[handleName].call(this, ...params);
      return this;
    }
  }

  getTools(name) {
    if (!tools[name]) return;
    return (...params) => {
      return tools[name].call(this, ...params);
    }
  }

  getUtils(name) {
    if (!utils[name]) return;
    return (...params) => {
      return utils[name].call(this, ...params);
    }
  }
}
