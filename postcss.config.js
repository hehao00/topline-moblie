/**
 * post-css 是一个后处理器
 * 该文件是 post-css的配置文件
 * 插件：
 * autoprefixer 用来处理样式兼容前缀用的
 * postcss-pxtorem用来将px 转rem
 */
/**
 * 如果是vant 的样式 则基于37.5去转 vant是基于375设备像素写的
 * 自己的则基于75基准值去转换
 * 转换工具以样式文件为单位进行转换的
 * 每一个文件的转换都需要调用这个函数 为不同的文件设置不同的转换规则
 * file : 文件信息对象
 * dirname当前文件的目录路径
 */

const { sep } = require('path')

module.exports = ({ file }) => {
  // path.sep 用于获取操作系统的路径分隔符
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5 // vant 转换的基准值
    : 75 // 设计稿转换的基准值

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}
