const pluginCopyButton = require('@11ty/eleventy-plugin-code-snippet'); // 需要先安装

function userMarkdownSetup(md) {
  // 配置markdown-it高亮
  md.set({
    highlight: function (str, lang) {
      if (lang) {
        return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
      }
      return '';
    }
  });
}

function userEleventySetup(eleventyConfig) {
  // 添加代码复制插件
  eleventyConfig.addPlugin(pluginCopyButton, {
    buttonClass: 'code-copy',
    copyIconClass: 'copy-icon',
    successIconClass: 'success-icon'
  });

  // 添加Prism相关资源
  eleventyConfig.addGlobalData('prism', {
    css: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css',
    js: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js'
  });

  // 创建shortcode用于注入资源
  eleventyConfig.addShortcode("prismResources", function() {
    return `
      <link rel="stylesheet" href="${this.ctx.prism.css}">
      <script src="${this.ctx.prism.js}"></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    `;
  });
}

exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
