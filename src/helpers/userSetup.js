const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

function userEleventySetup(eleventyConfig) {
  // 1. 正确配置官方高亮插件
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: "code-block",
      "data-language": ({ language }) => language,
      "tabindex": "0" // 增加可访问性支持
    },
    templateFormats: ["*"], // 处理所有文件类型
    trim: true // 自动清理代码缩进
  });

  // 2. 全局注入资源（推荐使用这种更可靠的方式）
  eleventyConfig.addGlobalData("prism", {
    css: "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css",
    js: "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"
  });

  // 3. 使用组合shortcode提升可靠性
  eleventyConfig.addShortcode("prismHeader", function() {
    return `<link rel="stylesheet" href="${this.ctx.prism.css}">`;
  });

  eleventyConfig.addShortcode("prismFooter", function() {
    return `
      <script src="${this.ctx.prism.js}"></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('pre.code-block').forEach((pre) => {
            // 添加复制按钮
            const btn = document.createElement('button');
            btn.className = 'code-copy';
            btn.innerHTML = '📋 Copy';
            btn.ariaLabel = 'Copy code';
            
            btn.addEventListener('click', () => {
              const code = pre.querySelector('code').textContent;
              navigator.clipboard.writeText(code)
                .then(() => {
                  btn.innerHTML = '✅ Copied!';
                  setTimeout(() => btn.innerHTML = '📋 Copy', 2000);
                })
                .catch(err => console.error('Copy failed:', err));
            });
            
            pre.insertAdjacentElement('afterbegin', btn);
          });
        });
      </script>
    `;
  });
}
