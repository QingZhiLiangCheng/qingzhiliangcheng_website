---
{"week":"第八周","dg-publish":true,"tags":[],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 15 Exceptional Control Flow： Signals and Nonlocal Jumps/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:34:22.538+08:00","updated":"2025-04-02T15:42:34.993+08:00"}
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



