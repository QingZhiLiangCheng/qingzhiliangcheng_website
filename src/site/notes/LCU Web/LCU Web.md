---
{"tags":["folder","LCU-Web"],"dg-publish":true,"permalink":"/LCU Web/LCU Web/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-06-07T19:14:16.422+08:00","updated":"2025-07-02T22:21:29.547+08:00"}
---

2025spring
软工的期中考试是100个选择题，期末考试是给个图片然后用三件套给复现出来，除此之外还有大作业……
机房里面只有VS code.
盒子模型
列表
超链接
表格和表单
浮动
布局 -- 三列布局
滑动门技术

demo
江北水城
阿里巴巴导航
动画片
蓝天广告
卡通
登录
注册
长鼻猴
体彩
学院
最新动态
家具大视野
团购

按钮显示效果
360导航效果 - 精灵
单个滑动门按钮

### Demo 1: 江北水城
![Pasted image 20250608103538.png](/img/user/accessory/Pasted%20image%2020250608103538.png)
-  最外面要用一个大的盒子模型 用`margin:auto`和width将整个部分居中
- 用div划分好各个部分: header, contenter, footer
- 对于江北水城这段文字的水平 垂直 居中
	- 父组件要用 flex, justify-content, align-item？
	- 要用 text-align, 有时候还得配合margin
- 按钮式用list做的  清空样式用 `list-style-type: none`
- 文字可以配合br标签使用
- 如果不想环绕left的这个 就要用 `overflow: hidden`
- 最下面的这个图片是用的list的ul和li做的, 通过一个float:left 让他变成一排，不要用三个通过分别left, left, right, 第二个图片和第三个图片之间可能会有空隙吧
- 那如果是一排有间距的卡片呢？ 后面再说吧

### Demo 2: 阿里巴巴导航
![Pasted image 20250608154304.png](/img/user/accessory/Pasted%20image%2020250608154304.png)
- 表单和输入框的定义方法
	- 搜索是个图片 使用了 no-repeat 和 right
- nav导航栏 仍然是使用ul与li组合 和 left浮动效果
- 超链接标签的定义方法 文字居中用text-align  去掉下划线用text-decoration
- 指向动画

### Demo 3: 动画片
![Pasted image 20250608161505.png](/img/user/accessory/Pasted%20image%2020250608161505.png)
- 边框
- 指向动画
- 图片在上面 字在下面 用的br标签换行

哈哈哈哈哈其实没复习完就考试了