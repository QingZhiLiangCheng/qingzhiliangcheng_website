const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

function userEleventySetup(eleventyConfig) {
  // 添加官方高亮插件
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: { 
      class: "code-block",
      "data-language": ({ language }) => language 
    }
  });
  
  // 保留之前讨论的复制按钮逻辑
  eleventyConfig.addShortcode("prismResources", function() {
    return `
      <link rel="stylesheet" href="${this.ctx.prism.css}">
      <script src="${this.ctx.prism.js}"></script>
      <script>
        // 粘贴之前提供的复制按钮脚本
        document.querySelectorAll('pre').forEach((pre) => {
          const btn = document.createElement('button');
          btn.className = 'code-copy';
          btn.innerHTML = '📋 Copy';
          btn.onclick = () => {
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code);
            btn.innerHTML = '✅ Copied!';
            setTimeout(() => btn.innerHTML = '📋 Copy', 2000);
          };
          pre.prepend(btn);
        });
      </script>
    `;
  });
}
