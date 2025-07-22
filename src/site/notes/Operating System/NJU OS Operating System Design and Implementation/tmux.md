---
{"tags":null,"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/tmux/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-22T15:52:25.219+08:00","updated":"2025-07-22T16:19:59.382+08:00"}
---

tmux是一个终端复用工具，可以实现在一个终端窗口中进行分屏操作
**安装**
```shell
sudo apt install tmux
```

启动tmux会话
```shell
tmux
```

**基本操作**
- 水平分屏 `Ctrl + b`，然后按 `"`
- 在分屏之间切换 `Ctrl + b`，然后按 方向键
- 关闭分屏 `exit` 或 `Ctrl + d`
- 增加或减小当前窗格的高度 `Ctrl + b` 然后 `Ctrl + ↑/↓`
- 上下滑动窗口 `Ctrl + b` 然后按 `[`  按q退出
