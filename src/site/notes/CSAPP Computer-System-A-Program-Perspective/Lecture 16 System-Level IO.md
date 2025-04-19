---
{"week":"第八周","dg-publish":true,"tags":["week8","csapp"],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 16 System-Level IO/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:37:09.412+08:00","updated":"2025-04-19T09:53:33.457+08:00"}
---

![[16-io.pdf]]

**today's agenda**
- Unix I/O
- RIO(robust I/O) package
- Metadata, sharing, and redirection
- Standard I/O
- Closing remarks

### Unix I/O
#### Unix I/O Overview
比起其他操作系统 Unix中的I/O更简单且更一致
设计优点：用文件来描述很多抽象的事物
我记得在前面CSAPP中有这么一句话: Unix的哲学本质是 everything is file
所以所有的IO设备(网络、磁盘和终端)都被模型化为文件  文件就是一个序列 而所有的输入和输出都被当作对相应文件的读和写来执行。
这种将设备映射为文件的机制，允许内核引出简单、优雅的应用接口Unix I/O，使得所有输入和输出都以统一的方式执行，如 `open()`/`close()` 打开/关闭文件，`read()`/ `write()` 读/写文件。
`seek()`改变当前文件位置  但是如果是终端 这个方法不太适用 因为无法移动、备份和回复先前已经读入的数据 也无法提前接受还未键入的数据  -- 所以有些文件有文件位置和seek操作 有的文件没有 eg. socket

#### Files
![Pasted image 20250407151031.png|400](/img/user/accessory/Pasted%20image%2020250407151031.png)

 **regular files**
regular file(普通文件)包含任意数据
有些应用程序常常要区分文本文件(text file)和二进制文件(binary file) 但这不是在操作系统级别 而是在更高级别
- text file: 只包含ASCII字符 or Unicode字符的文件
- binary file: files are everything else.
内核不会深入文件内部的结构  所以在操作系统的眼里 文件之间没有什么区别 文本文件和二进制文件之间没有什么区别
Linux 文本文件包含了一个**文本行**（text line）序列，其中每一行都是一个字符序列，以一个新行符（“\n”）结束。新行符与 ASCII 的换行符（LF）是一样的，其数字值为 0x0a。
如果在windows文件和linux的文件相互转换的时候 注意这两类系统对文本行结尾的处理不一样 -- 这个问题我遇到过 呃呃
- Linux and Mac OS: '\n'(0xa)
- Windows and Internet protocols: '\r\n'(0xd 0xa) -- 两个字符 
回车换行
![Pasted image 20250407152251.png|300](/img/user/accessory/Pasted%20image%2020250407152251.png)
既要把滚轮拉回去(回车)  还有滚一下 滚出一行字的距离

**directory**
Directory consists of an array of links: each link maps a filename to a file.
Each directory contains at least two entries:
- '.' is link to itself
- '..' is link to the parent directory in the directory hierarchy

directory hierarchy:
Linux 内核将所有文件都组织成一个**目录层次结构**（directory hierarchy），由名为 /（斜杠）的**根目录**确定。系统中的每个文件都是根目录的直接或间接的后代
目录层次结构中的位置用**路径名**（pathname）来指定。
- 绝对路径
- 相对路径7
- ''
![Pasted image 20250407152919.png|600](/img/user/accessory/Pasted%20image%2020250407152919.png)
