import { createHtmlPlugin } from 'vite-plugin-html'

export function HtmlPlugin(viteEnv, isBuild: boolean) {
  const { VITE_APP_TITLE } = viteEnv
  const htmlPlugin = createHtmlPlugin({
    minify: isBuild,
    /**
     * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
     * @default src/main.ts
     */
    // entry: 'src/main.ts',
    /**
     * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
     * @default index.html
     */
    // template: 'public/index.html',

    /**
     * 需要注入 index.html ejs 模版的数据
     */
    inject: {
      data: {
        title: VITE_APP_TITLE
        // injectScript: `<script src="./inject.js"></script>`,
      },
      tags: [
        {
          injectTo: 'body-prepend',
          tag: 'div',
          attrs: {
            id: 'tag'
          }
        }
      ]
    }
  })
  return htmlPlugin
}
