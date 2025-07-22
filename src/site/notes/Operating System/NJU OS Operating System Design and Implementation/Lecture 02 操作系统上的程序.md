---
{"tags":["NJU-jjy-OS"],"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/Lecture 02 操作系统上的程序/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-21T22:34:48.077+08:00","updated":"2025-07-22T15:34:37.026+08:00"}
---

### Overview
操作系统 =  对象 + API = C程序
那什么是程序？
本节课的主要内容
- 程序的状态机模型(和编译器)
- 操作系统上的最小/一般/图形 程序

### 状态机与数字电路
在讲程序之间，不得不提到计算机系统基础课中的内容
数字逻辑电路
- 状态 = 寄存器保存的值
- 初始状态 = RESET的值
- 迁移 = 组合电路计算寄存器下一周期的值
$$
\begin{align*}
X' &= \lnot X \land Y \\
Y' &= \lnot X \land \lnot Y
\end{align*}
$$

其实上面的公式的状态是这样的：
![Pasted image 20250722151037.png](/img/user/accessory/Pasted%20image%2020250722151037.png)

这里我们看作是两个寄存器，一个是x一个是y，假设初始状态是00，那么就是我们图中的样子，而每一个状态的改变实际上就是一个时钟周期，而每一个时钟周期，都会取出寄存器的值，通过组合电路算出下一个状态的值，然后写回寄存器
其实初始状态为啥也没有或者是0或者是undefined实际上都没有问题
计算机系统基础课中提到的内容就是状态机的形式，状态机这种状态变化的形式 可以用公式来表达，也可以用图来表示，同样的也可以用代码进行表达
实际上就是用C语言来模拟了这个过程
老师给出的代码是这样的
```c
#define REGS_FOREACH(_)  _(X) _(Y)  
#define RUN_LOGIC        X1 = !X && Y; \  
                         Y1 = !X && !Y;  
#define DEFINE(X)        static int X, X##1;  
#define UPDATE(X)        X = X##1;  
#define PRINT(X)         printf(#X " = %d; ", X);  
  
int main() {  
    REGS_FOREACH(DEFINE);  
    while (1) { // clock  
        RUN_LOGIC;  
        REGS_FOREACH(PRINT);  
        REGS_FOREACH(UPDATE);  
        putchar('\n');  
        sleep(1);  
    }  
}
```

这里老师用了一个工具插入代码创建文件叫[[Operating System/NJU OS Operating System Design and Implementation/vi\|vi]]，这是Linux中的一个常用的文本编辑器
gcc编译的命令在学CMU15445的时候就已经很熟悉了
保存好编译
```shell
vi a.c

# 复制代码

# 在vi中
:wq
# 编译运行
gcc -Og a.c -o a && ./a
```

![nju-jyy-os-gif-lecture01-2.gif](/img/user/accessory/nju-jyy-os-gif-lecture01-2.gif)


