---
{"week":"第九周","dg-publish":true,"tags":[],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 13 Query Execution Part 2/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:32:37.630+08:00","updated":"2025-04-02T14:27:29.558+08:00"}
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
并行的处理请求的模型
DBMS 的进程模型定义了如何构建系统以支持并发请求/查询。
过程模型是用来讨论系统如何并发处理我们上一个lecture提到的 生产者-消费者 树型表示
基本思想是 系统中存在多个worker
worker 是 DBMS 组件，负责代表客户端执行任务并返回结果
worker可能是一个进程 也可能是一个线程
有三种方式
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
- **A process crash does not take down the entire system.**

#### Thread Per Worker
现在的思路是 不再使用进程这种更为重量级的抽象来执行任务 而采用Thread(线程)
线程相较于进程而言成本要低得多 -- 启动和销毁一个进程的开销远大于创建新线程和终止线程的开销
这里的思想是 我拥有的操作系统为我提供了这个重量级的进程模型 但在进程内部 可以使用p线程 可以启动任意数量的线程
带一个线程崩溃  遭遇信号终止或信号暂停  整个进程都会随之终止
SQL Server, MySQL, Oracle, DB2 已经实现了线程模型与工作模型之间实现了平衡
![Pasted image 20250401192809.png|400](/img/user/accessory/Pasted%20image%2020250401192809.png)
这种模型使得线程的控制权在操作系统手中而不依赖操作系统的调度

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
可以读一读 [How Microsoft brought SQL Server to Linux | TechCrunch](https://techcrunch.com/2017/07/17/how-microsoft-brought-sql-server-to-linux/#)
这一方法最大的优势在于 涵盖了IO等管理内容
我将发送一个IO请求 但不会直接调用Windows驱动程序或Windows层
这种做法的一大优势在于 当他们需要迁移至Linux的系统时，(因为在云环境中，服务器基本上都是运行Linux的），非常的轻松
在数据库拥有一个与操作系统良好定义的接口是一个及其明智的想法

量子与调度机制
SQLOS（SQL Server操作系统）定义了一个基本的时间单位（量子），通常为**4毫秒**
这个时间单位就是一个任务(如查询操作)在CPU上连续执行的最长时间
**但调度器无法强制执行这一时间限制**：即任务可能因代码逻辑未主动让出控制权，而占用CPU超过4毫秒。
所以需要显示添加yield的调用
yield的作用就是主动暂停让出CPU 将控制权交给调度器
```python
last = now()       # 记录初始时间
for tuple in R:    # 遍历关系表R中的每个元组
    if now() - last > 4ms:  # 自上次检查后已超过4ms
        yield          # 主动让出CPU
        last = now()   # 更新时间标记
    if eval(predicate, tuple, params):  # 若满足条件
        emit(tuple)    # 输出符合条件的元组
```

#### Embedded DBMS
嵌入式数据库模型
把数据库形象成一个以库的形式编写的实体
这种模型本质上 数据库引擎会应用于应用程序代码的内部 只需要考虑向数据库发出调用
在应用程序运行的线程中
Berkeley DB, SQLite, LevelDB
SQLite官网有一整个c文件, 只需要将它编译进代码 然后运行 这就是数据库系统

### Execution Parallelism
讨论的是我是否应该对每个操作符投入更多的worker？
#### Inter-Query Parallelism
查询间并行  就是并行执行多个查询
如果查询都是read-only  那就是一个极容易并行化的任务
但如果我既想select又想update 会造成一些并发的问题 -- 在lecture15(事务)讨论

#### Intra-Query Parallelism
查询内并行 就是一个查询内部的并行处理
我觉得有点像微指令流水线的感觉
举了一个例子 -> **PARALLEL GRACE HASH JOIN**
![Pasted image 20250402085301.png|500](/img/user/accessory/Pasted%20image%2020250402085301.png)
在这个例子中并行可以是让每一个worker执行一个HTr和HTs的相互对应

#### Approach1: Intra-Opetator
水平加速 水平方法的并行
简单来说就是一个查询内 相同操作符的并行
DBMS 在查询计划中插入一个 exchange 操作符，以合并/拆分来自多个 children/parent 运算符的结果   Postgres叫做 gather（gather可能更好理解 意思是涵盖每个worker的工作）

![Pasted image 20250402085829.png|500](/img/user/accessory/Pasted%20image%2020250402085829.png)
其实也是一种分而治之的思想
注意 我们可以去指定 哪个worker去执行哪个页面
这个图中 可能12完成的比较快 3还在执行 那么12会继续接受page4 page5
最终exchange操作符汇总了所有的结果 要往上游的运算符传
exchange operator的类型不同 可能根据query的不同 可以用不同类型的exchange operator
**Exchange 1: Gather**
gather就是上面图中用到的exchange operator 就是纯粹的收集数据 将所有数据作为一个单一的输出发送
![Pasted image 20250402091412.png|300](/img/user/accessory/Pasted%20image%2020250402091412.png)
**Exchange 2: Distribute**
一个输入 分到多个输出上
这种操作 比如 读取表R 应用哈希函数H1 并生成H的分区
当Distribute分配时  会使用某种函数 -- 哈希函数/轮询算法/范围函数 -- 高级数据库课程
![Pasted image 20250402091428.png|300](/img/user/accessory/Pasted%20image%2020250402091428.png)
**Exchange3: Repartion**
多个输入 多个输出
比如说跨多个操作符操作的时候 完全可以将不同操作符的功能融合为一个整体
![Pasted image 20250402091803.png|300](/img/user/accessory/Pasted%20image%2020250402091803.png)
**example**
![Pasted image 20250402092937.png|500](/img/user/accessory/Pasted%20image%2020250402092937.png)
这里将投影优化下移了
为什么用hash table 见[[DataBase Systems/CMU 15-445：Database Systems/Lecture 11 Join Algorithms\|Lecture 11 Join Algorithms]]

#### Inter-Operator
纵向加速
单个查询中不同操作符的并行执行
流式
流水线并行
Unix管道连接进程  第一个进程完成所有任务之前就开始发送数据
这里的思路是一样的
![Pasted image 20250402093436.png|500](/img/user/accessory/Pasted%20image%2020250402093436.png)

#### Bushy Parallelism
两种的融合
![Pasted image 20250402093554.png|500](/img/user/accessory/Pasted%20image%2020250402093554.png)
当然A和B的join我也可以拆

### IO Parallelism
前面讨论的是我有多个核心 我有多个节点 怎么使用它们的问题
当数据库系统的瓶颈不在 CPU 而是磁盘时，再多的多核优化都是浪费的，需要进行 I/O 并行。 也就是说我们需要把IO任务分布到多个设备（比如说磁盘）中进行并行处理
#### Multi-DIsk Parallelism
多磁盘并行
磁盘有寿命 也会出现比特腐烂 我们的服务器中通常是一组磁盘 共同构成一个IO子系统
所以我们会复制副本 并且保持副本的一致性

![Pasted image 20250402134437.png|300](/img/user/accessory/Pasted%20image%2020250402134437.png)

这张图仅仅是数据库的逻辑视图
假设我们有6个page 我们会有bufferpool bufferpool仅会获取这些page的pageID -> 许多DBMS会接管这一部分工作 -- 并在数据库层面上对对象进行布局
RAID0 形式 -- 条带 如果轮询的分page  那么瓶颈就是磁盘
RAID1 形式 -- 镜像 就是上图的 不同的存储设备存储着相同的数据

但现代的做法是通过软件来实现这一切
在软件层面 可以有一个软件控制分布在全球各地的磁盘 构成一个分布式系统
在软件层面可以使用Erasure Codes(擦除码)（有点像校验码那种操作）
在文件或对象级别拆分数据并添加冗余编码，无需依赖硬件控制器。
将数据分块为`k`个片段，计算生成`m`个冗余校验块  -- - - 允许任意`m`个块丢失时仍能恢复原始数据。

软件和硬件这些内容都会在高级数据库课程才展开介绍 只需要了解就行

#### Database Partitioning
数据库分区
**Physical Database Partitioning**
物理分区
将整个数据库划分为 ​**互不相交的子集（Disjoint Subsets）​**，每个子集（如单个数据库实例）存储到独立的磁盘位置。
实现: DBMS将每个数据库存储在了单独的目录中 允许管理页执行数据库的磁盘路径
所有分区的变更日志（Log File）通常共享，确保事务一致性（ACID）
**Logical Table Partitioning**
逻辑分区
将逻辑表拆分成多个物理段 每个段单独处理
eg: 哈希函数均有分布数据

这一部分也是高级数据库课程的内容 只需要了解就行







