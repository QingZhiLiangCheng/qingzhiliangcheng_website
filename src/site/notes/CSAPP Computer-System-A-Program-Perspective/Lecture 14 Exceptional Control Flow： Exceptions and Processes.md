---
{"week":"第七周","dg-publish":true,"tags":["week7","csapp"],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 14 Exceptional Control Flow： Exceptions and Processes/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-26T23:06:35.686+08:00","updated":"2025-04-19T09:53:26.740+08:00"}
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
我们认为每一个进程代表一个 逻辑控制流  --  整个过程的全部指令
当我们单步执行程序时，可以看到一系列PC值，这个PC序列就称为**逻辑控制流**
这里注意一下前面一直提到的是物理控制流, 是在系统层次上的指令地址序列，而逻辑控制流是在程序级别上的，所以物理控制流包含逻辑控制流。 说简单点 就是物理控制流是整个系统这段时间的PC值序列 而逻辑控制流是这段时间里单个程序（可能是下图的Process A）的PC序列
![Pasted image 20250331155056.png|400](/img/user/accessory/Pasted%20image%2020250331155056.png)
在这个图中，三个process的竖的黑线就是他们各自的逻辑控制流
而所有的竖线合起来 就是整个系统的物理控制流。
从图中也能看出来 当进程执行了一部分逻辑流的时候 会被别的进程Preempted(抢占)
这里将多个进程轮流运行的概念称为**多任务（Multitasking）**，将进程每次执行一部分逻辑流的时间称为**时间片（Time Slice）**，则多任务也叫**时间分片（Time Slicing）**。比如进程A就由两个时间片组成。
当逻辑流X在逻辑流Y开始之后和Y结束之前运行，或逻辑流Y在逻辑流X开始之后和X结束之前运行，则称这两个流为**并发流（Concurrent Flow）**。比如进程A和B是并发流，进程A和C也是并发流。我们将这种多个流并发地执行的现象称为**并发（Concurrency）**
否则 他们是连续(sequential)的
我的理解是交替运行叫并发
所以A和B是并发的 A和C是并发的
但是B和C不是并发的 因为C开始的时候B已经执行完了

尽管并发的进程可能并不是真正意义上的并行（即它们可能只是交替执行），但从逻辑或user的角度，我们可以把它们看作是“同时”运行的。
这里区分一下并发和并行的区别:
- 并发: 并发是指多个任务在同一时间段内交替执行 而不是真正的同时执行
- 并行是指的多个任务真正同时执行
![Pasted image 20250331170613.png|400](/img/user/accessory/Pasted%20image%2020250331170613.png)

Process are managed by a memory-resident OS code called **kernel**
内核始终出现在process的上下文
![Pasted image 20250331190039.png|400](/img/user/accessory/Pasted%20image%2020250331190039.png)
内核位于内存地址空间的顶部（之前的图里面见过）

整个过程就是
Process A在运行的过程中 发生Exception 把控制权返回给内核 内核调用其调度程序 该调度程序决定是否让A继续运行 还是通过context switch 去到another process

### Process Control
Linux中存在很多函数 可以用户使用实现进程控制
大多数这些函数都进行system calls  但我们可以调用
这些函数大都会返回-1如果出错的话  而且还可以通过一个全局变量error查看错误（存在个例比如exit或者free return void
所以使用这些函数的时候一定要用if语句来判断返回值
![Pasted image 20250331191453.png|500](/img/user/accessory/Pasted%20image%2020250331191453.png)
`fork()` 是 Linux 和其他类 Unix 系统中的一个系统调用，用于创建一个新的进程，这个新的进程是调用进程的子进程。这个过程被称为“派生”（forking）。在 `fork()` 调用之后，两个进程（父进程和新创建的子进程）将并行执行 `fork()` 调用之后的代码。
**这里注意课程中的ppt有个错误的地方  如果遇到错误我们应该返回非零值 返回零是说明正常退出  后面的好像还有这个问题**

**Error-handling Wrappers**
在函数中处理错误形成一个包装器
包装器与原函数有相同的接口 第一个字母大写
![Pasted image 20250331192045.png|300](/img/user/accessory/Pasted%20image%2020250331192045.png)

**Obtaining Process IDs**
最简单的process control函数是getpid函数获取当前进程的pid   getppid返回当前进程的父进程的pid
pid是什么？
在计算机操作系统中，PID（Process Identifier，进程标识符）是一个非负整数，用来唯一标识一个进程。

**Creating and Terminating Processes**
进程有以下三种运行状态:
- Running: Process is either excuting, or waiting to be executed and will eventually be sheduled.
- Stopped: 停止 而且再通知之前不会再被Schedule, 通常一个进行会停止 是因为收到某种信号  下一个lecture学Signal的时候会再提到
- Terminated  终止 永远不会再被安排了


Process becomes terminated for one of three reasons:
- 接收到了一个signal
- return -- 比如我们main函数return 0
- exit

**Creating Process**
fork函数
调用一次 返回两次: 在parent process 和 child process各调用一次
- 在child process中返回0
- parent process中返回child's PID
而且这是唯一区分child process和parent process的方法
child process 会拥有一个跟parent process 的 virtual address space一样的副本，这意味着所有的变量 栈 代码都是一样的 但不是同一份
所以可以在两个process做不一样的事情
![Pasted image 20250331194424.png|400](/img/user/accessory/Pasted%20image%2020250331194424.png)
比如在这个例子中 创建了一个child process 并且在child process中++x
在parent process中 --x
我们无法保证子进程还是父进程先执行 在Fork返回的时候 内核可能会先安排子进程 也可能会先安排父进程
我们使用一种工具来捕捉fork可能发生的情况 -- **Process Graphs**
每个顶点对应一个语句的执行, a->b表示a先执行, 边标记变量当前值或者是printf输出的内容
拓扑排序

![Pasted image 20250331194744.png|300](/img/user/accessory/Pasted%20image%2020250331194744.png)

![Pasted image 20250331200103.png|500](/img/user/accessory/Pasted%20image%2020250331200103.png)

![Pasted image 20250331200139.png|500](/img/user/accessory/Pasted%20image%2020250331200139.png)
![Pasted image 20250331200211.png|500](/img/user/accessory/Pasted%20image%2020250331200211.png)

**Reaping Child Processes**
当一个进程因任何原因终止时，系统实际上会一直保持直到它被parent process reaped(回收)
这样做的原因是父进程可能想知道子进程的退出状态
所以当系统离开子进程的时候 不会完全从系统中删除它 而是会保留一些状态信息，比如说退出的状态， OS tables
由于这个子进程被终止 但没完全消失 -- 成为 zombie (僵尸进程)
父进程可以使用wait或者waitpid回收  之后zombie就会被从内核中删除
如果父进程没有回收 当父进程中止的时候 子进程将会被pid=1的init process回收
![Pasted image 20250331202547.png|500](/img/user/accessory/Pasted%20image%2020250331202547.png)
![Pasted image 20250331202441.png|500](/img/user/accessory/Pasted%20image%2020250331202441.png)
我们调用上面的例子
在输出parent pid=556, child pid=557之后 parent进入while循环了就
child就变成了一个zombie process
我们使用&保留当前进程
通过ps查看进程
我们发现当我们kill 556的时候 child也会被回收
这里其实就是上面说的 被init回收了

如果是子进程循环 会发生什么？
![Pasted image 20250331211258.png|500](/img/user/accessory/Pasted%20image%2020250331211258.png)
kill子进程就可以

**wait**
`wait()` 是一个在类 Unix 操作系统中使用的系统调用，它使得父进程可以等待其子进程的状态发生变化，通常是等待子进程结束。当一个子进程终止时，它会留下一个状态信息，这个信息可以通过 `wait()` 或者 `waitpid()` 系统调用来获取。
函数原型
```c
#include <sys/types.h>
#include <sys/wait.h>

pid_t wait(int *status);
```
- `status`：这是一个指向整数的指针，用于存储子进程退出时的状态信息。如果不需要这个状态信息，可以传递 `NULL`。
- 返回值：成功时返回终止子进程的进程ID；如果在调用时没有子进程立即终止，则调用会被阻塞直到有子进程终止。如果有错误发生（例如该进程没有子进程），则返回 `-1` 并设置 `errno`。
![Pasted image 20250331211723.png|500](/img/user/accessory/Pasted%20image%2020250331211723.png)
![Pasted image 20250331211851.png|500](/img/user/accessory/Pasted%20image%2020250331211851.png)
注意: 多个子进程可能同时完成，`wait()` 会按任意顺序处理这些子进程。

**waitpid**
可以等待特定的process
![Pasted image 20250331212720.png|500](/img/user/accessory/Pasted%20image%2020250331212720.png)

```c
#include <sys/types.h>
#include <sys/wait.h>
pid_t waitpid(pid_t pid, int *statusp, int options); 
```
- **等待集合`pid`**
	- 如果`pid>0`，则等待集合就是一个单独的子进程
	- 如果`pid=-1`，则等待集合就是该进程的所有子进程
	- 注意：当父进程创造了许多子进程，这里通过`pid=-1`进行回收时，子程序的回收顺序是不确定的，并不会按照父进程生成子进程的顺序进行回收。可通过按顺序保存子进程的PID，然后按顺序指定`pid`参数来消除这种不确定性。

- **等待行为`options`**
	- `0`：**默认选项，则会挂起当前进程，直到等待集合中的一个子进程终止，则函数返回该子进程的PID。此时，已终止的子进程已被回收。
	- `WNOHANG`：**如果等待子进程终止的同时还向做其他工作，该选项会立即返回，如果子进程终止，则返回该子进程的PID，否则返回0。
	- `WUNTRACED`：**当子进程被终止或暂停时，都会返回。
	- `WCONTINUED`：**挂起当前进程，知道等待集合中一个正在运行的子进程被终止，或停止的子进程收到`SIGCONT`信号重新开始运行。
	- 注意：**这些选项可通过`|`合并。

- 如果`statusp`非空，则`waitpid`函数会将子进程的状态信息放在`statusp`中，可通过`wait.h`中定义的宏进行解析
	- `WIFEXITED(statusp)`：如果子进程通过调用`exit`或`return`正常终止，则返回真，。此时可通过`WEXITSTATUS(statusp)`获得退出状态。
	- `WIFSIGNALED(status)`：如果子进程是因为一个未捕获的信号终止的，则返回真。此时可通过`WTERMSIG(statusp)`获得该信号的编号。
	- `WIFSTOPPED(statusp)`：如果引起函数返回的子进程是停止的，则返回真。此时可通过`WSTOPSIG(statusp)`获得引起子进程停止的信号编号。
	- `WIFCONTINUED(statusp)`：如果子进程收到`SIGCONT`信号重新运行，则返回真。
- 如果当前进程没有子进程，则`waitpid`返回-1，并设置`errno`为`ECHILD`，如果`waitpid`函数被信号中断，则返回-1，并设置`errno`为`EINTR`。否则返回被回收的子进程PID。
`waitpid`通过设置`options`来决定是否回收停止的子进程。并且能通过`statusp`来判断进程终止或停止的原因。
调用`wait(&status)`等价于调用`waitpid(-1, &status, 0)`。

**execve: Loading and Runing Programs**
上面介绍的fork只是创建一个副本的子进程--有相同的代码 内存……
execve函数则可以在当前进程的上下文中加载并运行一个程序
```c
#include <unistd.h>
int execve(const char *filename, const char *argv[], const char *envp[]); 
```
`execve`函数加载并运行`filename`可执行目标文件，参数列表`argv`和环境列表`envp`是以`NULL`结尾的字符串指针数组，其中`argv[0]`为文件名。
exceve所有代码 数据 和堆栈 都会覆盖虚拟内存地址  但是它保留了一样的进程（一样的PID） 只是运行了一个不同的程序
**注意: called once and never returns！**
调用`exevec`函数其实就是调用加载器，则加载器会在可执行目标文件`filename`的指导下，将文件中的内容复制到代码段和数据段，再调用`_libc_start_main`来初始化执行环境，调用`main`函数，`main`函数的函数原型如下所示
```c
int main(int argc, char *argv[], char *envp[]);
```

when a new program starts, 会创建新的栈帧 覆盖原来的虚拟内存空间
![Pasted image 20250331214205.png|400](/img/user/accessory/Pasted%20image%2020250331214205.png)
argv其实就是个指针列表 每一个指向一个与**参数**对应的字符串  rsi就是main的第二个参数
第一个参数是argc 包含的参数数量
envp环境列表也一样 -- 也是指向了环境变量对应的字符串

execv example
![Pasted image 20250331215051.png|500](/img/user/accessory/Pasted%20image%2020250331215051.png)
