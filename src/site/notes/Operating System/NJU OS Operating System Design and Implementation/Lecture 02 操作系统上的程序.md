---
{"tags":["NJU-jjy-OS"],"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/Lecture 02 操作系统上的程序/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-21T22:34:48.077+08:00","updated":"2025-07-26T15:42:19.361+08:00"}
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
gcc编译的命令在学CMU15445的时候就已经很熟悉了，特别是在[[CSAPP Computer-System-A-Program-Perspective/Lecture 05 Machine-Level Programming I： Basics\|Lecture 05 Machine-Level Programming I： Basics]],[[CSAPP Computer-System-A-Program-Perspective/Lecture 13 Linking\|Lecture 13 Linking]]...
保存好编译
```shell
vi a.c

# 复制代码

# 在vi中
:wq
# 编译运行
gcc -Og a.c -o a && ./a
```

![nju-jyy-os-gif-lecture01-1.gif|500](/img/user/accessory/nju-jyy-os-gif-lecture01-1.gif)

这段代码事实上是用了C语言的宏定义的特性
其中第一个宏`REGS_FOREACH(_)  _(X) _(Y)`事实上的意思是传入一个函数，然后事实上是把X和Y分别传进这个函数，就像一个模版一样，而UPDATE(X)和UPDATE(X)分别就是更新状态和打印
宏定义事实上是在预处理阶段被替换进去的，其实通过一段命令能看到去掉宏的代码 
```shell
gcc -E a.c
```

![Pasted image 20250722160257.png|500](/img/user/accessory/Pasted%20image%2020250722160257.png)

这里其实老师用到了一个分屏工具叫做[[Operating System/NJU OS Operating System Design and Implementation/tmux\|tmux]]
所以这个小程序算是对数字电路的一个小小的模拟，当然我们可以做一些更好玩的东西，比如说数码管显示，将寄存器中的数据显示出来
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/logisim.c
```

```c
#include <stdio.h>
#include <unistd.h>

#define REGS_FOREACH(_)  _(X) _(Y)
#define OUTS_FOREACH(_)  _(A) _(B) _(C) _(D) _(E) _(F) _(G)
#define RUN_LOGIC        X1 = !X && Y; \
                         Y1 = !X && !Y; \
                         A  = (!X && !Y) || (X && !Y); \
                         B  = 1; \
                         C  = (!X && !Y) || (!X && Y); \
                         D  = (!X && !Y) || (X && !Y); \
                         E  = (!X && !Y) || (X && !Y); \
                         F  = (!X && !Y); \
                         G  = (X && !Y);
#define DEFINE(X)   static int X, X##1;
#define UPDATE(X)   X = X##1;
#define PRINT(X)    printf(#X " = %d; ", X);

int main() {
  REGS_FOREACH(DEFINE);
  OUTS_FOREACH(DEFINE);
  while (1) { // clock
    RUN_LOGIC;
    OUTS_FOREACH(PRINT);
    REGS_FOREACH(UPDATE);
    putchar('\n');
    fflush(stdout);
    sleep(1);
  }
}
```

这是一个像上面的那个小程序那样的一个简单的c语言对0和1的模拟
![nju-jyy-os-gif-lecture01-3.gif|500](/img/user/accessory/nju-jyy-os-gif-lecture01-3.gif)
那如果我把这个电路的模拟器的输出作为输入放入一个小小的前端代码中，那么就可以做出一个数码管的模拟显示
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/seven-seg.py
```

![Pasted image 20250722161435.png|500](/img/user/accessory/Pasted%20image%2020250722161435.png)

这个前端的模拟程序是这样的：
如果A等1，上面的那一条就会亮
![Pasted image 20250722162304.png|150](/img/user/accessory/Pasted%20image%2020250722162304.png)

```bash
 ./logisim | python3 seven-seg.py
```

![nju-jyy-os-gif-lecture01-4.gif|500](/img/user/accessory/nju-jyy-os-gif-lecture01-4.gif)

这里面还提到了UNIX的 管道

### 什么是程序(源代码视角)
程序也是状态机！ 数字系统是状态机，所有的程序都是运行在数字系统上的，那么程序也一定是状态机。 
程序是运行在数字系统上的，整个计算机的架构我觉的苏黎世联邦理工学院的计算机体系中间的特别好[[Computer Architecture/ETH Zurich 苏黎世联邦理工学院 Digital Design and Computer Architecture/lecture 01 Introduction and Basics\|lecture 01 Introduction and Basics]],这里面教授讲了我们要解决一个problem，而解决problem是通过electrons，这里讲了这之间是怎么联系起来的。其实和这里想要说的事情是异曲同工的。
![Pasted image 20250722165216.png|400](/img/user/accessory/Pasted%20image%2020250722165216.png)
我们我们知道C语言内存模型中有栈区，有堆区，这个在CSAPP中学到过[[CSAPP Computer-System-A-Program-Perspective/Lecture 09 Machine-Level Programming V：Advanced Topics\|Lecture 09 Machine-Level Programming V：Advanced Topics]],[[CSAPP Computer-System-A-Program-Perspective/A Tour of Computer Systems\|A Tour of Computer Systems]]，所以程序实际上是改变了内存上的数据
- 状态: 内存中的栈和堆
- 初始状态 main的第一条语句
- 迁移 执行一条简单语句 (当然，这里假设每条语句只做一件简单的事情)

这里老师其实用了一个递归的例子，递归经典例子 汉诺塔
```bash
 wget https://jyywiki.cn/pages/OS/2022/demos/hanoi-r.c
```

```c
void hanoi(int n, char from, char to, char via) {
  if (n == 1) printf("%c -> %c\n", from, to);
  else {
    hanoi(n - 1, from, via, to);
    hanoi(1,     from, to,  via);
    hanoi(n - 1, via,  to,  from);
  }
  return;
}
```

我们可以一些一个程序调用这个hanoi函数
```c
#include<stdio.h>
#include "hanoi-r.c"

int main(){
        hanoi(3,'A','B','C');
}
```

![Pasted image 20250722170527.png|500](/img/user/accessory/Pasted%20image%2020250722170527.png)

那我们就能借助[[Operating System/NJU OS Operating System Design and Implementation/gdb\|gdb]]这个工具来从源码的视角来体会 程序是个状态机
```bash
 gcc -g hanoi.c -o hanoi.out

gdb hanoi.out

layout src # 切换到源代码
```

gdb会帮助我们停在一个地方，这就是一个状态
![Pasted image 20250722171706.png|500](/img/user/accessory/Pasted%20image%2020250722171706.png)

可以step进去
```bash
s # 下一条语句 但是会跳入函数

info frame # 查看栈帧上的数据

info registers rsp # 查看某个寄存器
```

![Pasted image 20250722172120.png|500](/img/user/accessory/Pasted%20image%2020250722172120.png)

当然这里提到了栈帧，栈帧是理解函数调用过程一个非常重要的知识，在CSAPP中提到过[[CSAPP Computer-System-A-Program-Perspective/Lecture 07 Machine-Level Programming III：Procedures\|Lecture 07 Machine-Level Programming III：Procedures]] 当然如果理解栈帧的话，就知道这里的rbp, rip是啥 就能体会到他更新了什么  其实这里更需要去看汇编才能体会到

### 什么是程序(二进制代码视角)
事实上这里就是汇编的视角，如果看过CSAPP的指令，寄存器，栈帧这些知识，就能看懂汇编，也就能体会到这是状态机
每一条指令其实都是更新了寄存器 而CPU就是进行计算 放回了寄存器

所以什么是程序？
程序是从初始状态开始，通过指令，取出寄存器中的数，计算，更新成下一个状态。而且其实我们汇编中的指令绝大部分都是这样的
所以这有一个问题就是，可能会是像最开始的那个数字电路的情况一样，停不下来，那什么时候能停下来呢？
其实就涉及到了System call， Syscall指令
这个指令是说我把控制权交给操作系统，或者说是内核，然后就从用户态变成了内核态，然后程序就躺平了
内核就会综合所有的信息，比如说这个程序想打印一些东西，就会帮他打印，或者内核也可以更新一些这个程序的状态等等
所以 程序 = 计算+syscall

### 构造最小的Hello World
我们所认为的最小的程序Hello World
```c
int main() { 
	printf("Hello, World\n"); 
}
```
如果用gcc编译，objdump查看反汇编，事实上这个程序一点也不小
如果我们运行gcc -c只编译不链接 并通过objdump查看的话
```bash
gcc -c hello.c
objdump -d hello.o
```
如果用gcc编
![Pasted image 20250726135622.png|500](/img/user/accessory/Pasted%20image%2020250726135622.png)
我们都知道对于C语言编译的过程是，预处理，编译，汇编，链接，详见[[CSAPP Computer-System-A-Program-Perspective/A Tour of Computer Systems\|A Tour of Computer Systems]]
![Pasted image 20250726140105.png|600](/img/user/accessory/Pasted%20image%2020250726140105.png)
刚刚我们已经生成了.o文件 下一步是链接
我们可以尝试手动链接
```bash
ld hello.o -o hello.out
```
仅仅将hello.o 这个目标文件连接成一个hello.out文件
![Pasted image 20250726140308.png|600](/img/user/accessory/Pasted%20image%2020250726140308.png)
会warning找不到 `entry symbol _start`,那么一个可行的解决方案是把`int main()`改成`void _start()`
![Pasted image 20250726140641.png|250](/img/user/accessory/Pasted%20image%2020250726140641.png)
绕过了warning，但是还是找不到puts
![Pasted image 20250726140846.png|600](/img/user/accessory/Pasted%20image%2020250726140846.png)

如果把printf去掉，编译和连接就都能成功完成
![Pasted image 20250726141018.png|250](/img/user/accessory/Pasted%20image%2020250726141018.png)

![Pasted image 20250726141006.png|600](/img/user/accessory/Pasted%20image%2020250726141006.png)

但是运行给了Segmentation fault错误
![Pasted image 20250726141104.png|600](/img/user/accessory/Pasted%20image%2020250726141104.png)
如果写个while(1)的话，就可以直接运行了
但是我们还是聚焦于上面Segmentation fault的函数，我们可以通过一些工具去找到里面的问题，比如说gdb
![Pasted image 20250726141620.png|500](/img/user/accessory/Pasted%20image%2020250726141620.png)
然后会发现实在ret的时候出现了问题
那ret的时候都干了些什么事情？ CSAPP中讲过 见[[CSAPP Computer-System-A-Program-Perspective/Lecture 07 Machine-Level Programming III：Procedures\|Lecture 07 Machine-Level Programming III：Procedures]]
call的时候干了两件事：第一件事是改变寄存器%rip的值(%rip保存的是PC，就是下一条要执行的指令)，使得能够jump到mult2中；第二件事是把要返回的地址，也就是当前call指令的下一条指令的地址压入栈，对应的%rsp(栈顶指针)要-8(栈是从高地址向低地址增长)
![Pasted image 20250303202447.png|500](/img/user/accessory/Pasted%20image%2020250303202447.png)
那么同样的ret干的事儿也就很明确了，就是倒着的步骤，先pop，%rsp+8，然后把那个地址给%rip
![Pasted image 20250303202708.png|500](/img/user/accessory/Pasted%20image%2020250303202708.png)

所以说这个地方错了，有两种可能，要么是rsp的地址不合法，要么就是要跳转回去的rip的地址不合法
可以在gdb中通过命令看rsp寄存器中的值
![Pasted image 20250726143723.png|500](/img/user/accessory/Pasted%20image%2020250726143723.png)
再看的过程中要注意，第一行和第二行是从c0变成了d0，而地址又是字节编址的，所以说一行其实是16个字节，而一个数就是4个字节，而rsp是64位的寄存器，所以得看两个数，x86计算机又是小端法，那么其实rsp中的值是0x000...1 这些只是都在CSAPP中讲过
再往下执行会发现他返回的错误的原因是没法访问0x1这个地址
![Pasted image 20250726144110.png|250](/img/user/accessory/Pasted%20image%2020250726144110.png)
问题其实出现在初始状态是没法返回的
那有什么办法能让计算机停下来？ 就需要一个简单的system call
![Pasted image 20250726144527.png|250](/img/user/accessory/Pasted%20image%2020250726144527.png)

![Pasted image 20250726144916.png|500](/img/user/accessory/Pasted%20image%2020250726144916.png)

所以我们知道了是从`_start`开始的，最后要通过system call返回，那么我们就能构造一个很小的汇编代码
```c
#include <sys/syscall.h>

.globl _start
_start:
  movq $SYS_write, %rax   // write(
  movq $1,         %rdi   //   fd=1,
  movq $st,        %rsi   //   buf=st,
  movq $(ed - st), %rdx   //   count=ed-st
  syscall                 // );

  movq $SYS_exit,  %rax   // exit(
  movq $1,         %rdi   //   status=1
  syscall                 // );

st:
  .ascii "\033[01;31mHello, OS World\033[0m\n"
ed:
```

![Pasted image 20250726145451.png|600](/img/user/accessory/Pasted%20image%2020250726145451.png)
可以连接成功并执行

### 如何在程序的两个视角切换？
我们既然有两种状态机，怎么切换？
一种是C语言层面的状态机，一种是汇编层面的状态机，这其实两种不同的抽象，C语言层面的状态机是对汇编的抽象，而汇编是对硬件的抽象？
我们绝大多数时候都在写C代码，会有一个程序帮我们生成汇编层面的东西，这个东西就是编译器 -- 这就明白了什么是编译器
那什么叫做正确的编译？
其实编译器有好多优化层级，比如说-Og, -O1... 而且其实我之前看过值传递的那个代码的那个优化，会直接把swap那个函数给删掉，那什么叫做正确的编译？
在C语言代码有一些是不可优化的代码 比如`volatile int x = 1;` 对于这种不可优化的，在C语言上声明的读就是读，读一万次就是一万次 不可优化；所谓的正确的编译就是在所有在C语言状态机上不可优化的东西都被正确的翻译在了汇编状态机上，其他的，能省的都省了。
我的理解其实就是 状态能对应起来就行
额不过CSAPP优化那一节我没听呃呃 

### 操作系统中的一般程序
和minimal.S没有区别，就是计算和syscall
在应用眼里 看到的操作系统就是syscall，syscall就是个API
在操作系统的眼里，程序就是一个一个状态机，而操作系统管理者所有的硬件和软件资源，收录了所有的API之后，操作系统说你行你就行，说你不行你就不行，这是管理多个状态机所必须的，不能打架，谁有权限就给它

trace工具
执行的第一个都是execve设置初始状态


