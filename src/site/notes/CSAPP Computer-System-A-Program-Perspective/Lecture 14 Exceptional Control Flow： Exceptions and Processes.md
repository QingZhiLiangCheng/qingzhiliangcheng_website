---
{"week":"第七周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 14 Exceptional Control Flow： Exceptions and Processes/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-26T23:06:35.686+08:00","updated":"2025-03-31T15:28:04.714+08:00"}
---


![[14-ecf-procs.pdf]]

exceptional Control flow: 异常控制流
从给处理器加电开始，直到你断电为止，程序计数器假设一个值的序列
a0,a1,⋯ ,an−1a0​,a1​,⋯,an−1​
其中，每个 ak是某个相应的指令 Ik​ 的地址。每次从 ak 到 ak+1的过渡称为**控制转移**（control transfer）。这样的控制转移序列叫做处理器的**控制流**（flow of control 或 control flow）
换句话说， CPU reads and executes a sequence of instructions, one at a time, this sequence is the CPU's control flow

之前lecture学习了两种change Control flow的方法：
- Jumps and branches
- Call and return
这两种都是改变程序状态(program state)来引起control flow的突变.

但真正的操作系统需要能够处理系统级别的变化
- 比如说我们使用Ctrl+C 中断程序等等
系统状态的变化  system state 
exceptions中的control flow的突变是通过system state的变化来引发的，这种control flow的突变被称为exception control flow.

这里注意所谓的exceptions不是我们平时所认为的异常，我们平时所认为的异常可能是我们写代码的时候遇到了非法情况 可能要抛异常
而这里的exception是指一些event，这些event可能是system, processor, executing program的一些state，exception会导致control的突变，将控制从当前运行的程序或任务移动到exception handler的执行
这里提到的异常不是通常意义的异常，而是分成四类：Interrupt, faults, aborts, and trap.（后面应该会提到叭）
换句话说 硬件检测到的事件会触发控制转移到异常处理程序。

Exception Control Flow存在不同层次
- Exceptions  异常 位于硬件和操作系统交接的部分
- Process context switch
- Signals 一个进程可以发送信号到另一个进程，而接受者会将控制转移到它的信号处理程序
- Nonlocal jumps  非本地跳转  C库实现 一种违背正常call和return的模式

### Exceptions
异常实际上是将低级别的控制权转移到操作系统内核
![Pasted image 20250330095345.png|500](/img/user/accessory/Pasted%20image%2020250330095345.png)

some event 引起了 system state的变化
异常将控制器从User code 转移到了 Kernel code
系统内核以某种方式相应Exception   叫做 Exception Processing(异常处理)
可以返回到 这一条指令 或者下一条指令 或者 中止 （这跟异常的类型有关，不同的类型 会将不同的返回地址压入栈中）
Examples of events: 
- Divide by 0 除以0
- arithme c overflow
- page fault
- I/O request completes IO请求完成  比如中断请求
- typing Ctrl-C 

Exception实际上由硬件和软件共同完成
实际上是控制权的转移
PC或者%rip的更改是有硬件完成的
该exception执行的代码是由系统内核设置和确定的 每种类型的event 都有一种唯一的 Exception Number(异常编号) 用作 Exception Table的索引
k发生时候 就会跳转到对应的应该执行的code
![Pasted image 20250330100817.png|300](/img/user/accessory/Pasted%20image%2020250330100817.png)
而该异常表的起始地址保存在特殊的CPU寄存器中，称为**异常表基址寄存器（Exception Table Base Register）**

异常的分类方法
asynchronous(异步) or synchronous(同步)
**Asynchronous Exceptions**
Caused by events external to the processor: Interrupts(中断)
这些状态的变化是通过在处理器上设置引脚 向处理器通知这些状态变化
中断 是返回下一条指令
中断的一个常见例子是**定时器中断（Timer Interrupt）**。所有系统都有一个内置计时器，每隔几毫秒就会关闭一次，此时就将中断引脚置为高电平，并且有一个特殊的异常编号用于定时器中断，由此来使得内核再次获得对系统的控制，再由内核决定要做什么，否则用户程序可能会陷入无限循环永远运行，无法让操作系统获得控制权
![Pasted image 20250330102826.png|500](/img/user/accessory/Pasted%20image%2020250330102826.png)

**Synchronous Exceptions**
由执行指令后发生的事件引起
**Type1: Traps 陷阱**
故意的异常  intentional
陷阱最重要的用途是在用户程序和内核之间提供一个像过程一样的接口，叫做**系统调用(system call)**。
内核的其中一个作用就是提供一个 响应程序发出请求的接口 事实上NJU的OS课介绍过 -- 程序准备好所有的数据 -- 扔给操作系统就可以躺平了（因为好多东西只有OS有权访问）
返回到下一条指令
**Type2: Faults  故障**
无意 但是可以恢复
一个经典的故障示例是缺页异常，当指令引用一个虚拟地址，而与该地址相对应的物理页面不在内存中，因此必须从磁盘中取出时，就会发生故障。
只要把page复制到他该在的地址上  再次启动 就能正常工作
有的不可以恢复 比如说尝试访问未分配的内存
返回current 指令 再次启动一次 or aborts（中止）
![Pasted image 20250330103632.png|500](/img/user/accessory/Pasted%20image%2020250330103632.png)

**Type3: Aborts 中止**
无意 不可恢复
比如执行非法指令  内存有问题……

**System Calls**
![Pasted image 20250330103825.png|500](/img/user/accessory/Pasted%20image%2020250330103825.png)
syscall
比如说Opening File我们可能只是调用了open函数  syscall这样的函数会包装在open这种系统级函数中
![Pasted image 20250330104143.png|500](/img/user/accessory/Pasted%20image%2020250330104143.png)
我们只是调用了open函数  实际上跳转到了_open 函数
在这里将2 (也就是open的number) 传到了eax 然后调用了system call
然后查看rax中的return value是否是负数 如果是负数说明发生了error

**Fault Example: Page Fault**
![Pasted image 20250330104626.png|500](/img/user/accessory/Pasted%20image%2020250330104626.png)
![Pasted image 20250330104638.png|500](/img/user/accessory/Pasted%20image%2020250330104638.png)

### Processes
Definition: A process is an instance of a running program.
进程是正在运行的程序的实例
noticed that is not the same as program or processor.

**Process provides each program with two key abstrctions**
- 独占CPU和寄存器
- 感觉拥有自己的地址空间

系统同时运行了多个process  即使是在简单的单核系统上 这些进程中的许多个 实际上也是在同一时间并发运行的
![Pasted image 20250330110116.png|400](/img/user/accessory/Pasted%20image%2020250330110116.png)
我自己的电脑  top了一下
![Pasted image 20250330110427.png|600](/img/user/accessory/Pasted%20image%2020250330110427.png)

虽然看起来对系统有独特的访问权限，但实际上
假设我们只有一个核心  操作系统管理资源
![Pasted image 20250330110704.png|400](/img/user/accessory/Pasted%20image%2020250330110704.png)
有些时候可能由于定时器中断或者什么而发生Exception，某些时候，操作系统可以控制system，会决定是否要运行另一个程序
它会将当前寄存器的值复制到寄存器中并保存他们 然后会安排下一个待执行的进程
然后加载上次运行该进程时保存的寄存器 然后将地址空间切换到此进程的地址空间
![Pasted image 20250330111301.png|300](/img/user/accessory/Pasted%20image%2020250330111301.png)
![Pasted image 20250330111319.png|300](/img/user/accessory/Pasted%20image%2020250330111319.png)
这个所谓的地址空间和寄存器值是上下文
所以所谓的上下文切换 是 地址空间和寄存器的变化
现在实际上在我们的CPU有多个核  但仍然是上下文的切换

**Concurrent Processes**
我们认为每一个进程代表一个 逻辑控制流

