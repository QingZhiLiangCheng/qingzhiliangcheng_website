---
{"week":"第八周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 15 Exceptional Control Flow： Signals and Nonlocal Jumps/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:34:22.538+08:00","updated":"2025-04-06T15:45:34.911+08:00"}
---

![[15-ecf-signals.pdf]]

### Shells
**Linux Process Hierarchy**
![Pasted image 20250402145436.png|500](/img/user/accessory/Pasted%20image%2020250402145436.png)
Linux 启动之后  事实上所有的进程会形成上图的一个层次结构
第一个创建的进程为 init进程 -- 他的pid为0
其他进程都是init进程的子进程
init进程会创建Daemon进程 -- Daemon进程是一个用来提供服务的进程 eg. web服务器
init还会Login shell -- 命令行 
如果我们输入命令 可能会创建一个新的进程 然后执行我们命令的内容 在其中可能还有创建子进程

**shell programs**
bash
![Pasted image 20250402150103.png|400](/img/user/accessory/Pasted%20image%2020250402150103.png)
首先Shell是以用户身份执行其他程序的应用程序

shell program就是一系列读/求值的过程
在这个过程中 先输出提示符 > 然后等待 命令输入
shell会检查末尾的字符 如果是ctrl-D 就退出  否则 就求值
Linux中ctrl-D 不是发送信号(signal)，而是表示一个特殊的二进制值，表示 EOF。注：在shell中，ctrl-D表示退出当前shell。
文件最后会有一个EOF标志（0xFF）表示文件结束，当读取到EOF的下一个时，feof函数才返回非零值 所以是读完了EOF才退出的

求值过程：
![Pasted image 20250402151556.png|500](/img/user/accessory/Pasted%20image%2020250402151556.png)
首先解析buf中的字符串 parseline 传入的是 命令字符串 和一个数组指针  这个数组指针是执行完的命令  parseline返回的是 命令行是否以&结尾
以&结尾是说 shell不用wait这个进程执行完就可以执行其他进程
shell中有很多内建的命令 所以先通过`builtin_command()`来查看是否是内建的命令

问题在于不会回收任何后台进程 -- 可能造成内存泄漏
这时候就需要信号来处理
当shell的子进程终止时，内核会通知shell，然后shell做出反应，调用waitpid。内核使用的这种通知机制叫做**signal**。

### Signals
信号就是一条小信息 -- 通知进程系统中发生了一次某种类型的事件
完全由软件实现
是个唯一的整数
![Pasted image 20250404202834.png|500](/img/user/accessory/Pasted%20image%2020250404202834.png)
- SIGINT: 按下ctrl C就是发出了一个Signal  相当于 kill 这个进程
- SIGKILL: 也是kill一个程序 但是并不会被忽略  有一些例子会忽略ctrl + c
- SIGSEGV: 段错误 效果也是terminate一个程序
- SIGALRM: 是一个可以自行安排的信号 可以自己发送给自己  属于一种设置定时器的方式
- SLGCHLD: shell中很重要的一个Signal  当子进程被终止或者结束时 kernel就会通知他们的父进程

#### Overview
**Signal Concepts: Sending a Signal**
内核发送信号
通过为目标进程的上下文设置一些状态来时实现  -> 所以只是改变了进程上下文的一些位

**Signal Concepts: Receiving a Signal**
目标进程收到Signal
Some possible ways to react:
- Ignore the signal (忽略)
- Terminate the process (结束进程)
- 被用户级别的信号处理函数捕获 处理
信号处理程序（signal handler）和异常中的异常处理程序类似，不过，异常处理程序在内核中，信号处理程序就在当前进程代码的一个函数里。
signal handler的过程如图所示:
![Pasted image 20250404205312.png|500](/img/user/accessory/Pasted%20image%2020250404205312.png)
Process接受Single 然后把控制权交给 signal handler(这只是C程序中的一些代码)

**Pending and Blocked Signals**
待处理信号和阻塞信号
- Pending: 在某些给定的时刻 只能有一个相同类型的待处理信号 -> Signals 没有 排队的说法
- block: process 可以 阻塞 某些信号的接收. process没法阻止signal的传递 但是能够阻止signal的相应  所以被阻塞的Single可以传递 但是不会被接受

内核为每个进程在 pending位向量中维护着待处理信号的集合,而在 blocked位向量中维护着被阻塞的信号集合。只要传送了一个类型为k的信号,内核就会设置 pending中的第k位,而只要接收了一个类型为k的信号,内核就会清零 pending中的第k位
这也解释了为什么没有队列 -- 因为就是改变这一位

#### Sending Signals detail
首先我们需要了解Process Groups的概念
![Pasted image 20250405134709.png|500](/img/user/accessory/Pasted%20image%2020250405134709.png)
Shell做的事情是创建一个子进程并修改他的process group id(pgid)等于pid 作为一个新的process group -- 然后这个子进程再创建他的子进程的时候 都会继承这个pgid

允许同时给一组进程发送signal
发送信号的三种方法
**使用 `/bin/kill` program**
这个程序可以发送任意的signal给一个process或者process group
example
![Pasted image 20250405135129.png|300](/img/user/accessory/Pasted%20image%2020250405135129.png)
在这个例子中 pid=24818 和 pid=24819 的两个子进程属于同一个process group
 `/bin/kill`的第一个参数是 Single number  这里的9是指的杀死进程 第二个参数是pid
 比如 `/bin/kill -9 24818` 就是杀死pid=24818的进程
 如果出现在id之前出现了-符号  就说明是一个process group id

**另一种发送信号的方式是在命令行中用ctrl-c ctrl-z**
ctrl-c 会使内核向当前进程组下的所有作业发送sigint信号
ctrl-z 会使啮合向所有进程组下的作业发送sigtstp信号
sigint的默认行为是终结   sigtstp的默认行为是挂起进程
example
![Pasted image 20250405144341.png|600](/img/user/accessory/Pasted%20image%2020250405144341.png)

第三种发送信号的方式是使用kill system call
![Pasted image 20250405145053.png|500](/img/user/accessory/Pasted%20image%2020250405145053.png)

#### Receiving Signals Detail
![Pasted image 20250405145550.png|600](/img/user/accessory/Pasted%20image%2020250405145550.png)
在内核准备好控制权返回给用户代码和进程B之前(图中标出的位置) 他会检查所有待处理的信号
通过计算位向量pnb = pending & ~blocked 来做到这一点(将待处理位向量与阻塞位向量的非进行与运算)  -- pnb是所有**未阻塞待处理信号**的列表
如果pnb是0 那么就会返回控制权
如果pnb非零  会选择pnb中最小的非零位  这个信号的接受会引起这个进程的一些行为 然后继续处理最小的 知道处理完所有得到非零位

每一个signal都有一个预定义的默认行为
- 进程终止
- 进程终止并转存内存
- 进程停止(挂起)知道给SIGCONT信号重启
- 进程忽略该信号
![联想截图_20250405153442.png|700](/img/user/accessory/%E8%81%94%E6%83%B3%E6%88%AA%E5%9B%BE_20250405153442.png)
(图片来源 -- CSAPP)

我们可以通过一个叫signal的system call来修改默认行为
signal function
```c
#include <signal.h>
typedef void (*sighandler_t)(int);

sighandler_t signal(int signum, sighandler_t handler);

// 返回：若成功则为指向前次处理程序的指针，若出错则为 SIG_ERR（不设置 errno）。
```

signal 函数可以通过下列三种方法之一来改变和信号 signum 相关联的行为：
- 如果 handler 是 SIG_IGN，那么忽略类型为 signum 的信号。
- 如果 handler 是 SIG_DFL，那么类型为 signum 的信号行为恢复为默认行为。
- 否则，handler 就是用户定义的函数的地址，这个函数被称为**信号处理程序**，只要进程接收到一个类型为 signum 的信号，就会调用这个程序。通过把处理程序的地址传递到 signal 函数从而改变默认行为，这叫做**设置信号处理程序**（installing the handler）。调用信号处理程序被称为**捕获信号**。执行信号处理程序被称为**处理信号**。
signal handing example
![Pasted image 20250405154113.png|500](/img/user/accessory/Pasted%20image%2020250405154113.png)
pause调用 会等待一个信号处理程序的执行
它捕获用户在键盘上输入 Ctrl+C 时发送的 SIGINT 信号。SIGINT 的默认行为是立即终止该进程。在这个示例中，我们将默认行为修改为捕获信号，输出一条消息，然后终止该进程.
hhh 受到了嘲笑
Signal Handler 也是一个并发的例子
![Pasted image 20250405160139.png|400](/img/user/accessory/Pasted%20image%2020250405160139.png)
这个handler的时间和while循环的时间是重叠的
another view:
![Pasted image 20250405160345.png|500](/img/user/accessory/Pasted%20image%2020250405160345.png)

信号处理程序可以被其他信号处理程序中断
![Pasted image 20250405160654.png|500](/img/user/accessory/Pasted%20image%2020250405160654.png)
![Pasted image 20250405160702.png|500](/img/user/accessory/Pasted%20image%2020250405160702.png)
在这个例子中，主程序捕获到信号 s，该信号会中断主程序，将控制转移到处理程序 S。S 在运行时，程序捕获信号 t≠s，该信号会中断 S，控制转移到处理程序 T。当 T 返回时，S 从它被中断的地方继续执行。最后，S 返回，控制传送回主程序，主程序从它被中断的地方继续执行。

#### Blocking and Unblocking Signals Details
同一类型的Signal 会被block(阻塞)
内核提供了一个system call 允许显示设置阻塞和解除阻塞 -- sigprocmask function
```c
#include <signal.h>

int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
int sigemptyset(sigset_t *set); // Create empty set
int sigfillset(sigset_t *set);// Add every signal number
int sigaddset(sigset_t *set, int signum);// Add signal number
int sigdelset(sigset_t *set, int signum);//Delete signal number
//返回；如果成功则为 0，若出错则为 -1。
```
支持设置或解除一组阻塞   后面这四个函数是创建这一组set的
![Pasted image 20250405162626.png|599](/img/user/accessory/Pasted%20image%2020250405162626.png)
- SIG_BLOCK: 设置
- SIG_SETMASK: 解除

#### Writing Signal Handlers
- Safe Signal Handle 安全的信号处理
- Current Signal Handle 正确的信号处理
- Portable Signal Handling  可移植的信号处理
**Safe Signal Handle**
信号处理程序很麻烦是因为它们和主程序以及其他信号处理程序并发地运行, 如果处理程序和主程序并发地访问同样的全局数据结构，那么结果可能就不可预知，而且经常是致命的
guideline for writing safe handlers
1. G0: 处理程序要尽可能简单    
	- eg. 简单地设置全局标志并立即返回
2. G1: 使用异步信号安全的函数
	- 书中列出了所有的Linux保证安全的系统级函数
	![Pasted image 20250405165028.png|600](/img/user/accessory/Pasted%20image%2020250405165028.png)
	- 这里有一个很值得注意的函数是 printf, sprintf, malloc, exit 都不在内
	- 在这里信号程序中输出唯一安全的方法是使用write函数
3. G2: 保存和回复error
	- 许多 Linux 异步信号安全的函数都会在出错返回时设置 errno。在处理程序中调用这样的函数可能会干扰主程序中其他依赖于 errno 的部分。解决方法是在进入处理程序时把 errno 保存在一个局部变量中，在处理程序返回前恢复它。注意，只有在处理程序要返回时才有此必要。如果处理程序调用`_exit` 终止该进程，那么就不需要这样做了。
4. G3: 共享data structure的时候 main函数和signal handle都要阻塞一些signal
5. G4: 用 volatile 声明全局变量
	- volatile 限定符强迫编译器每次在代码中引用 g 时，都要从内存中读取 g 的值
	- eg. signal handle要设置一个全局变量  而main函数在等待这个全局变量 如果是写操作  写操作只会写到寄存器中  main程序永远也接收不到改变
6. G5: 如果variable仅仅被读写 用`sig_automic_t`声明: 保证了原子性操作

printf调用必须获得终端上所谓的锁  获得锁意味着同一时刻只能有一个printf的实例向终端进行写操作  可能会出现死锁(printf在等一个等不到的锁释放)
```c
#include "csapp.h"

ssize_t sio_putl(long v);
ssize_t sio_puts(char s[]);
// 返回：如果成功则为传送的字节数，如果出错，则为 -1。

void sio_error(char s[]);
// 返回：空。
```

**Current Signal Handle**
信号的一个与直觉不符的方面是未处理的信号是不排队的。因为 pending 位向量中每种类型的信号只对应有一位，所以每种类型最多只能有一个未处理的信号。因此，如果两个类型 k 的信号发送给一个目的进程，而因为目的进程当前正在执行信号 k 的处理程序，所以信号 k 被阻塞了，那么第二个信号就简单地被丢弃了；它不会排队。
所以用接收到的信号可以统计事件发生的次数 -- 是错误的

![Pasted image 20250406143750.png|500](/img/user/accessory/Pasted%20image%2020250406143750.png)
使用Signal改变了SIGCHLD 来跟踪一子进程的停止
for循环创建子进程  子进程sleep一段时间后 退出
父进程一直到等到ccount变为0
在`child_handler`中(一旦接收到了SIGCHLD才调用这个函数)
但是只打印了两次 
父进程接收并捕获了第一个信号。当处理程序还在处理第一个信号时，第二个信号就传送并添加到了待处理信号集合里。然而，因为 SIGCHLD 信号被 SIGCHLD 处理程序阻塞了，所以第二个信号就不会被接收。此后不久，就在处理程序还在处理第一个信号时，第三个信号到达了。因为已经有了一个待处理的 SIGCHLD，第三个 SIGCHLD 信号会被丢弃。一段时间之后，处理程序返回，内核注意到有一个待处理的 SIGCHLD 信号，就迫使父进程接收这个信号。父进程捕获这个信号，并第二次执行处理程序。

关键思想是如果存在一个未处理的信号就表明**至少**有一个信号到达了。

![Pasted image 20250406145048.png|500](/img/user/accessory/Pasted%20image%2020250406145048.png)


**Portable Signal Handling**
Unix 信号处理的另一个缺陷在于不同的系统有不同的信号处理语义 -- 不兼容 不可移植
- signal 函数的语义各有不同: 有些老的 Unix 系统在信号 k 被处理程序捕获之后就把对信号 k 的反应恢复到默认值。在这些系统上，每次运行之后，处理程序必须调用 signal 函数，显式地重新设置它自己.
- 系统调用可以被中断。像 read、write 和 accept 这样的系统调用潜在地会阻塞进程一段较长的时间，称为**慢速系统调用**。在某些较早版本的 Unix 系统中，当处理程序捕获到一个信号时，被中断的慢速系统调用在信号处理程序返回时不再继续，而是立即返回给用户一个错误条件，并将 errno 设置为 EINTR。在这些系统上，程序员必须包括手动重启被中断的系统调用的代码。
Solution: sigaction function. 它允许用户在设置信号处理时，明确指定他们想要的信号处理语义。
```c
#include <signal.h>

int sigaction(int signum, struct sigaction *act,
              struct sigaction *oldact);
// 返回：若成功则为 0，若出错则为 -1。
```
sigaction 函数运用并不广泛，因为它要求用户设置一个复杂结构的条目.
一个更简洁的方式，就是定义一个包装函数，称为 Signal，它调用 sigaction
```c
handler_t *Signal(int signum, handler_t *handler)
{
    struct sigaction action, old_action;

    action.sa_handler = handler;
    sigemptyset(&action.sa_mask); /* Block sigs of type being handled */
    action.sa_flags = SA_RESTART; /* Restart syscalls if possible */
    
    if (sigaction(signum, &action, &old_action) < 0)
        unix_error("Signal error");
    return (old_action.sa_handler);
}
```
Signal和signal的调用方式一样
- 只有这个处理程序当前正在处理的那种类型的信号被阻塞。
- 和所有信号实现一样，信号不会排队等待。
- 只要可能，被中断的系统调用会自动重启。
- 一旦设置了信号处理程序，它就会一直保持，直到 Signal 带着 handler 参数为 SIG_IGN 或者 SIG_DFL 被调用。

#### Synchronizing Flows to Avoid Races
同步流以避免讨厌的并发错误
下面这个例子它总结了一个典型的 Unixshell 的结构。父进程在一个全局作业列表中记录着它的当前子进程，每个作业一个条目。addjob 和 deletejob 函数分别向这个作业列表添加和从中删除作业。
```c
/* WARNING: This code is buggy! */
void handler(int sig)
{
    int olderrno = errno;
    sigset_t mask_all, prev_all;
    pid_t pid;

    Sigfillset(&mask_all);
    while ((pid = waitpid(-1, NULL, 0)) > 0) { /* Reap a zombie child */
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all);
        deletejob(pid); /* Delete the child from the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);
    }
    if (errno != ECHILD)
        Sio_error("waitpid error");
    errno = olderrno;
}

int main(int argc, char **argv)
{
    int pid;
    sigset_t mask_all, prev_all;

    Sigfillset(&mask_all);
    Signal(SIGCHLD, handler);
    initjobs(); /* Initialize the job list */

    while (1) {
        if ((pid = Fork()) == 0) { /* Child process */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all); /* Parent process */
        addjob(pid);  /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);
    }
    exit(0);
}
```
信一看，这段代码是对的。不幸的是，可能发生下面这样的事件序列：
1. 父进程执行 fork 函数，内核调度新创建的子进程运行，而不是父进程。
2. 在父进程能够再次运行之前，子进程就终止，并且变成一个僵死进程，使得内核传递一个 SIGCHLD 信号给父进程。
3. 后来，当父进程再次变成可运行但又在它执行之前，内核注意到有未处理的 SIGCHLD 信号，并通过在父进程中运行处理程序接收这个信号。
4. 信号处理程序回收终止的子进程，并调用 deletejob，这个函数什么也不做，因为父进程还没有把该子进程添加到列表中。
5. 在处理程序运行完毕后，内核运行父进程，父进程从 fork 返回，通过调用 add-job 错误地把（不存在的）子进程添加到作业列表中。

这是一个称为**竞争**（race）的经典同步错误的示例。
main 函数中调用 addjob 和处理程序中调用 deletejob 之间存在竞争。如果 addjob 赢得进展，那么结果就是正确的。如果它没有，那么结果就是错误的。
Solution: 通过在调用 fork 之前，阻塞 SIGCHLD 信号，然后在调用 addjob 之后取消阻塞这些信号，我们保证了在子进程被添加到作业列表中之后回收该子进程。注意，子进程继承了它们父进程的被阻塞集合，所以我们必须在调用 execve 之前，小心地解除子进程中阻塞的 SIGCHLD 信号。
```c
void handler(int sig)
{
    int olderrno = errno;
    sigset_t mask_all, prev_all;
    pid_t pid;

    Sigfillset(&mask_all);
    while ((pid = waitpid(-1, NULL, 0)) > 0) { /* Reap a zombie child */
        Sigprocmask(SIG_BLOCK, &mask_all, &prev_all);
        deletejob(pid); /* Delete the child from the job list */
        Sigprocmask(SIG_SETMASK, &prev_all, NULL);
    }
    if (errno != ECHILD)
        Sio_error("waitpid error");
    errno = olderrno;
}

int main(int argc, char **argv)
{
    int pid;
    sigset_t mask_all, mask_one, prev_one;

    Sigfillset(&mask_all);
    Sigemptyset(&mask_one);
    Sigaddset(&mask_one, SIGCHLD);
    Signal(SIGCHLD, handler);
    initjobs(); /* Initialize the job list */
    
    while (1) {
        Sigprocmask(SIG_BLOCK, &mask_one, &prev_one); /* Block SIGCHLD */
        if ((pid = Fork()) == 0) { /* Child process */
            Sigprocmask(SIG_SETMASK, &prev_one, NULL); /* Unblock SIGCHLD */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, &mask_all, NULL); /* Parent process */
        addjob(pid); /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, &prev_one, NULL); /* Unblock SIGCHLD */
    }
    exit(0);
}
```

#### Explicitly Waiting for Signals
显示地等待信号
有时候主程序需要显式地等待某个信号处理程序运行。例如，当 Linux shell 创建一个前台作业时，在接收下一条用户命令之前，它必须等待作业终止，被 SIGCHLD 处理程序回收。
下面的代码给出了一个基本的思路。父进程设置 SIGINT 和 SIGCHLD 的处理程序，然后进入一个无限循环。它阻塞 SIGCHLD 信号，避免前面提到的race.
创建了子进程之后，把 pid 重置为 0，取消阻塞 SIGCHLD，然后以循环的方式等待 pid 变为非零。子进程终止后，处理程序回收它，把它非零的 PID 赋值给全局 pid 变量。这会终止循环，父进程继续其他的工作，然后开始下一次迭代。
```c
#include "csapp.h"

volatile sig_atomic_t pid;

void sigchld_handler(int s)
{
    int olderrno = errno;
    pid = waitpid(-1, NULL, 0);
    errno = olderrno;
}

void sigint_handler(int s)
{
}

int main(int argc, char **argv)
{
    sigset_t mask, prev;

    Signal(SIGCHLD, sigchld_handler);
    Signal(SIGINT, sigint_handler);
    Sigemptyset(&mask);
    Sigaddset(&mask, SIGCHLD);

    while (1) {
        Sigprocmask(SIG_BLOCK, &mask, &prev); /* Block SIGCHLD */
        if (Fork() == 0) /* Child */
            exit(0);

        /* Parent */
        pid = 0;
        Sigprocmask(SIG_SETMASK, &prev, NULL); /* Unblock SIGCHLD */

        /* Wait for SIGCHLD to be received (wasteful) */
        while (!pid)
            ;

        /* Do some work after receiving SIGCHLD */
        printf(".");
    }
    exit(0);
}
```
这段代码正确，但循环是一种浪费
我们可能会想要修补这个问题，在循环体内插入 pause：
```c
while (!pid) /* Race! */
    pause();
```
注意，我们仍然需要一个循环，因为收到一个或多个 SIGINT 信号，pause 会被中断。不过，这段代码有很严重的竞争条件：如果在 while 测试后和 pause 之前收到 SIGCHLD 信号，pause 会永远睡眠。
另一个选择是用 sleep 替换 pause：
```c
while (!pid) /* Too slow! */
    sleep(1);
```
当这段代码正确执行时，它太慢了。如果在 while 之后 sleep 之前收到信号，程序必须等相当长的一段时间才会再次检查循环的终止条件。
合适的解决方法是使用 sigsuspend。
```c
#include <signal.h>

int sigsuspend(const sigset_t *mask);

// 返回：-1
```
sigsuspend 函数暂时用 mask 替换当前的阻塞集合，然后挂起该进程，直到收到一个信号，其行为要么是运行一个处理程序，要么是终止该进程。如果它的行为是终止，那么该进程不从 sigsuspend 返回就直接终止。如果它的行为是运行一个处理程序，那么 sigsuspend 从处理程序返回，恢复调用 sigsuspend 时原有的阻塞集合。
sigsuspend 函数等价于下述代码的原子的（不可中断的）版本：
```c
sigprocmask(SIG_BLOCK, &mask, &prev);
pause();
sigprocmask(SIG_SETMASK, &prev, NULL);
```
原子属性保证对 sigprocmask（第 1 行）和 pause（第 2 行）的调用总是一起发生的，不会被中断。这样就消除了潜在的竞争，即在调用 sigprocmask 之后但在调用 pause 之前收到了一个信号。
在每次调用 sigsuspend 之前，都要阻塞 SIGCHLD。sigsuspend 会暂时取消阻塞 SIGCHLD，然后休眠，直到父进程捕获信号。在返回之前，它会恢复原始的阻塞集合，又再次阻塞 SIGCHLD。如果父进程捕获一个 SIGINT 信号，那么循环测试成功，下一次迭代又再次调用 sigsuspend。如果父进程捕获一个 SIGCHLD，那么循环测试失败，会退出循环。
```c
#include "csapp.h"

volatile sig_atomic_t pid;

void sigchld_handler(int s)
{
    int olderrno = errno;
    pid = Waitpid(-1, NULL, 0);
    errno = olderrno;
}

void sigint_handler(int s)
{
}

int main(int argc, char **argv)
{
    sigset_t mask, prev;

    Signal(SIGCHLD, sigchld_handler);
    Signal(SIGINT, sigint_handler);
    Sigemptyset(&mask);
    Sigaddset(&mask, SIGCHLD);

    while (1) {
        Sigprocmask(SIG_BLOCK, &mask, &prev); /* Block SIGCHLD */
        if (Fork() == 0) /* Child */
            exit(0);

        /* Wait for SIGCHLD to be received */
        pid = 0;
        while (!pid)
            sigsuspend(&prev);

        /* Optionally unblock SIGCHLD */
        Sigprocmask(SIG_SETMASK, &prev, NULL);

        /* Do some work after receiving SIGCHLD */
        printf(".");
    }
    exit(0);
}
```

和前面的解决思路是一样的 既然无法判断结束子程序的handler是在main操作前还是操作后发生那就先设置mask 屏蔽掉SIGCHLD 等main准备好了再允许进入handler

### non local jump
lecture中没讲 老师说看课本hhh
C 语言提供了一种用户级异常控制流形式，称为非本地跳转（non local jump），它将控制直接从一个函数转移到另一个当前正在执行的函数，而不需要经过正常的调用—返回序列。非本地跳转是通过 setjmp 和 longjmp 函数来提供的。
```c
#include <setjmp.h>
int setjmp(jmp_buf env);
int sigsetjmp(sigjmp_buf env, int savesigs);

// 返回：setjmp 返回 0，longjmp 返回非零。
```
setjmp 函数在 env 缓冲区中保存当前调用环境，以供后面的 longjmp 使用，并返回 0。调用环境包括程序计数器、栈指针和通用目的寄存器。
```c
#include <setjmp.h>

void longjmp(jmp_buf env, int retval);
void siglongjmp(sigjmp_buf env, int retval);

// 从不返回。
```
longjmp 函数从 env 缓冲区中恢复调用环境，然后触发一个从最近一次初始化 env 的 setjmp 调用的返回。然后 setjmp 返回，并带有非零的返回值 retval。
setjmp 函数只被调用一次，但返回多次：一次是当第一次调用 setjmp，而调用环境保存在缓冲区 env 中时，一次是为每个相应的 longjmp 调用。另一方面，longjmp 函数被调用一次，但从不返回。
**非本地跳转的一个重要应用就是允许从一个深层嵌套的函数调用中立即返回，通常是由检测到某个错误情况引起的**。如果在一个深层嵌套的函数调用中发现了一个错误情况，我们可以使用非本地跳转直接返回到一个普通的本地化的错误处理程序，而不是费力地解开调用栈。
example：
main 函数首先调用 setjmp 以保存当前的调用环境，然后调用函数 foo，foo 依次调用函数 bar。如果 foo 或者 bar 遇到一个错误，它们立即通过一次 longjmp 调用从 setjmp 返回。setjmp 的非零返回值指明了错误类型，随后可以被解码，且在代码中的某个位置进行处理。
```c
#include "csapp.h"

jmp_buf buf;

int error1 = 0;
int error2 = 1;

void foo(void), bar(void);

int main()
{
    switch (setjmp(buf)) {
    case 0:
        foo();
        break;
    case 1:
        printf("Detected an error1 condition in foo\n");
        break;
    case 2:
        printf("Detected an error2 condition in foo\n");
        break;
    default:
        printf("Unknown error condition in foo\n");
    }
    exit(0);
}

/* Deeply nested function foo */
void foo(void)
{
    if (error1)
        longjmp(buf, 1);
    bar();
}

void bar(void)
{
    if (error2)
        longjmp(buf, 2);
}
```
longjmp 允许它跳过所有中间调用的特性可能产生意外的后果。例如，如果中间函数调用中分配了某些数据结构，本来预期在函数结尾处释放它们，那么这些释放代码会被跳过，因而会产生内存泄漏。

**非本地跳转的另一个重要应用是使一个信号处理程序分支到一个特殊的代码位置，而不是返回到被信号到达中断了的指令的位置**
example: 当用户在键盘上键入 Ctrl+C 时，这个程序用信号和非本地跳转来实现软重启。sigsetjmp 和 siglongjmp 函数是 setjmp 和 longjmp 的可以被信号处理程序使用的版本。
```cpp
#include "csapp.h"

sigjmp_buf buf;

void handler(int sig)
{
    siglongjmp(buf, 1);
}

int main()
{
    if (!sigsetjmp(buf, 1)) {
        Signal(SIGINT, handler);
        Sio_puts("starting\n");
    }
    else
        Sio_puts("restarting\n");

    while (1) {
        Sleep(1);
        Sio_puts("processing...\n");
    }
    exit(0); /* Control never reaches here */
}
```
在程序第一次启动时，对 sigsetjmp 函数的初始调用保存调用环境和信号的上下文（包括待处理的和被阻塞的信号向量）。随后，主函数进入一个无限处理循环。当用户键入 Ctrl+C 时，内核发送一个 SIGINT 信号给这个进程，该进程捕获这个信号。不是从信号处理程序返回，如果是这样那么信号处理程序会将控制返回给被中断的处理循环，反之，处理程序完成一个非本地跳转，回到 main 函数的开始处。

