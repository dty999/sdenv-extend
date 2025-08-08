/**
 * 文档对象环境模拟处理器
 * @param {Object} config - 配置对象
 * @param {Object} [config.properties] - 自定义文档属性
 */
export default function documentHandle(config = {}) {
  // 从实例内存获取window对象
  const win = this.memory.sdWindow;
  if (!win) {
    console.error("[documentHandle] 未找到sdWindow实例");
    return;
  }

  // 确保document对象存在
  if (!win.document) {
    win.document = Object.create(null);
  }
  const document = win.document;

  // 设置toString行为
  this.tools.setObjNative(document, "HTMLDocument");




  // 支持自定义属性
  if (config.properties && typeof config.properties === "object") {
    Object.assign(document, config.properties);
  }

  return document;
}
