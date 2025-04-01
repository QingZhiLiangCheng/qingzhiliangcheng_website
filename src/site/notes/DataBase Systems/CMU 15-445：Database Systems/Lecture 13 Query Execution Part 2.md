---
{"week":"第九周","dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 13 Query Execution Part 2/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:32:37.630+08:00","updated":"2025-04-01T22:12:44.376+08:00"}
---

![[13-queryexecution2.pdf]]

last class, we discussed 将运算法组合成执行任意查询的计划
但我们假设的是使用单个worker执行
this class,  we will discuss how to exeute queries using multiple workers.  如何使用多个worker执行查询

**Hardware trends**
![Pasted image 20250401105946.png|500](/img/user/accessory/Pasted%20image%2020250401105946.png)
the first question we need to worry about is processors.
这张图展示了1970年至今的processor的变化
图片来源: [42 Years of Microprocessor Trend Data | Karl Rupp](https://www.karlrupp.net/2018/02/42-years-of-microprocessor-trend-data/)
Transistors(晶体管) 橙色  我们在processor上的晶体管的数量在一直增长
真正发生变化的是蓝线 Single-Thread Performance -- 单个计算线程能完成多少工作 -- 不过现在蓝线已经开始趋近于平缓
所以我们需要一个模型来应对硬件情况，所谓的这个情况就是单个核心能输出的性能变得相对静态
所以这些额外的晶体管预算 实现的是黑线 -- 即多核  可以看出来05年左右还是单核心的  而现在开始达到十个核心  甚至未来会更多
所以我们需要关注的是 如何在我们的机器的硬件上运行查询机制  而我们这套机器的硬件是一台并行机器  我们需要利用硬件的全部能力

除此之外 还有别的一些复杂的硬件

![Pasted image 20250401111718.png|600](/img/user/accessory/Pasted%20image%2020250401111718.png)
图片来源: [EP22: Latency numbers you should know. Also... - by Alex Xu](https://blog.bytebytego.com/p/ep22-latency-numbers-you-should-know)
为此我专门写了一篇笔记
这张图是Jeff Dean画的 提醒程序员真正了解处理器的工作原理以及数据访问方面的权衡
some factors in this picture:
L1 Cache是距离processor最近的小型缓存  注意processor有register用于提取数据和计算 而访问L1 Cache也就1ns
深入到RAM访问 -- DRAM -- bufferpool部分 -- 速度比前者慢两个数量级  想要拿到RAM的数据 需要跨越L2 Cache 和 L1 Cache两个层级 -- 所以我们的查询处理算法 要具备跨越这些缓存维持的局部性
SSD与RAM插了三个数量级 -- 机械硬盘差了四个数量级
可能需要多个计算机之间通信 -- 10微秒 如今 新型的技术如CXL 使得单一节点能够访问另一个节点的DRAM 比从本地磁盘读应该会快的多  但是可能仍然比从本地内存读取要慢
有时候可能要在不同服务器之间进行通信 有时候这些服务器在地理上是分散的  而这是导致跨机器访问时产生的成本所在 -- 100毫秒

so that's why we care about the parallel execution(并行执行)
我们要充分利用所有并行硬件 -- 达到更高的效率
会降低应有成本 因为可能意味着我们会使用更少的机器

当我们要讨论提升性能时， 我们需要区分延迟改进和吞吐量改进
- 前者关注的是如何使用单个查询更快执行
- 后者着眼于如何让一批查询更快的迅速完成
我们正在寻求能够满足这两个需求的机制

**Paraller/Distributed**
并行 分布式 -- 这是不同的术语
两者的共同点: 数据库不再一台服务器 一个节点上运行 而是有这么一组节点
数据库管理系统必须向最终用户/应用程序提供单一节点系统的假象。最终的程序仍发送查询请求 系统必须解决如何分解查询 并利用分布的资源
会变快

不同
并行系统和分布式系统的关键区别在于: 在并行系统中 虽然涉及多台机器 但他们紧密相连 网络速度极快 且假定网络可靠 这意味着 如果我从另一个节点发送信息或执行操作 我可以确信它会完成 无须担心消息丢失 在分布式系统中 服务器可能地理分布广泛  可能会丢失 所以分布式系统需要检查机制
现在的云数据库会得到这两种系统 -- 高级数据库课程的内容
但是这两种系统有一种融合的趋势

eg: 银行  分布式 可能会有一个节点失效  所以我们都要进行多个数据副本存储

**today agenda**
- Process Models 过程模型
- Execution Parallelism 执行级并行
- IO Parallelism IO并行

### Process Models
DBMS 的进程模型定义了如何构建系统以支持并发请求/查询。
过程模型是用来讨论系统如何并发处理我们上一个lecture提到的 生产者-消费者 树型表示
在这个过程中 我们会讨论进程模型 讨论如何分配worker 是将其分配给某个进程 还是将一个worker映射到一个进程？
我是直接启动一个新的p线程？还是拥有一组特性 然后从中找到一个可用的线程集合并分配任务？
worker 是 DBMS 组件，负责代表客户端执行任务并返回结果
对于上面的疑问 有三种方式
- Approach1: Process per DBMS Worker
- Approach2: Thread per DBMS Worker
- Approach3: Embedded DBMS

#### Approach 1: Process per DBMS Worker
最简单的模型
Each worker is a separate OS process
![Pasted image 20250401190734.png|400](/img/user/accessory/Pasted%20image%2020250401190734.png)
基本思路：从连接到数据库的应用程序中 接受一个查询请求  然后又一个dispatcher(调度器)，他将调用工作进程 如果需要启动一个进程 则会启动 或者如果有一组进程正在等待分配任务 则从该池中提取，然后完成该操作符的工作
IBM DB2, Postgres, Oracle  在phreads变得流行之前 每个常见的数据库的采用了这种模型
- relies on the OS dispatcher
- Use shared-memory for global data structures.  对于一些全局的数据结构或信息，通过共享内存让不同的进程能够访问，从而实现必要的协调和通信
- A process crash does not take down the entire system.

#### Thread Per Worker
现在的思路是 不再使用进程这种更为重量级的抽象来执行任务 而采用Thread(线程)
线程相较于进程而言成本要低得多 -- 启动和销毁一个进程的开销远大于创建新线程和终止线程的开销
这里的思想是 我拥有的操作系统为我提供了这个重量级的进程模型 但在进程内部 可以使用p线程 可以启动任意数量的线程
带一个线程崩溃  遭遇信号终止或信号暂停  整个进程都会随之终止
SQL Server, MySQL, Oracle, DB2 已经实现了线程模型与工作模型之间实现了平衡
![Pasted image 20250401192809.png|400](/img/user/accessory/Pasted%20image%2020250401192809.png)

**Scheduling -- SQL Server**
For each query plan, the DBMS decides where, when, and how to execute it.
- 决定多少任务和多少工作线程参与其中 -- 这一决策你拥有的CPU核心数
- 哪个核心执行哪个任务   有时选择特定的核心让线程管理器或操作系统决定任务分配更有利  主要原因在于DBMS更了解上下文   eg: 如果我有一个结果在core4上 如果后续有一个聚合操作，而core4空闲 我可能会希望将一个工作线程安排在core4上

为什么我们不构建一个没有操作系统的DBMS呢？
长期存在的争论
但是我们很多时候都是有一个服务器 需要大量的底层设备管理操作  还有设备驱动 网络适配卡 存储设备…… 数据库只是其中之一  但是操作系统所执行的部分功能 例如文件缓存 会对数据库操作系统造成干扰 我们倾向于使用bufferpool

**SQL Server - SQLOS**
SQL OS层
本质上是一种抽象层  介于数据库引擎与操作系统所需之间 以及操作系统内部为该操作系统所实施的部分
