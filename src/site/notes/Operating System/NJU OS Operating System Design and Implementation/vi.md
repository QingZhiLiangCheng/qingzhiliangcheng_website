---
{"dg-publish":true,"tags":[],"permalink":"/Operating System/NJU OS Operating System Design and Implementation/vi/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-22T15:14:48.631+08:00","updated":"2025-07-22T15:22:30.390+08:00"}
---


vi是Unix/Linux中最常用的一个文本编辑器之一

**基本操作**

| 操作           | 说明                           |
| ------------ | ---------------------------- |
| `vi a.c`     | 打开或创建 `a.c` 文件（进入 normal 模式） |
| `i` 或 `a`    | 进入编辑模式（insert mode）          |
| 按 `Esc`      | 回到普通模式（normal mode）          |
| `:w`         | 保存                           |
| `:q`         | 退出                           |
| `:wq` 或 `ZZ` | 保存并退出                        |
| `:q!`        | 强制退出（不保存）                    |

| 操作               | 作用              |
| ---------------- | --------------- |
| `i`              | 在光标前进入插入模式      |
| `a`              | 在光标后进入插入模式      |
| `o`              | 在下一行新起一行并进入插入模式 |
| `dd`             | 删除整行            |
| `yy`             | 复制整行            |
| `p`              | 粘贴              |
| `u`              | 撤销              |
| `Ctrl + r`       | 重做              |
| `/关键字` + `Enter` | 搜索内容            |
| `n` / `N`        | 向下/向上查找下一个匹配项   |