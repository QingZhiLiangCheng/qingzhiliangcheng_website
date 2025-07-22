---
{"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/gdb/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-22T17:17:59.867+08:00","updated":"2025-07-22T17:56:00.182+08:00"}
---

```bash
gcc -g hanoi.c -o hanoi.out

gdb hanoi.out

layout src # 查看掩码

start # 开始调试

s # 跳入下一行命令 会跳入函数

n #下一条命令 不会进入函数

info frame # 查看栈帧上的内容

info registers rsp # 查看某个寄存器

info registers # 查看所有寄存器
```