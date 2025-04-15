---
{"week":"第十周","dg-publish":true,"tags":[],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 15 Concurrency Control Theory/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-11T15:33:49.723+08:00","updated":"2025-04-15T17:15:43.801+08:00"}
---

![[15-concurrencycontrol.pdf]]

### Overview
并发控制理论
![Pasted image 20250413173606.png|300](/img/user/accessory/Pasted%20image%2020250413173606.png)
之前见过这张数据库引擎的模块化架构图 -- 展示了不同组件的样子
今天讨论的是跨越这些不同层的并发机制 这些机制主要涉及操作执行和访问方法两个方面
今天主要讨论recovery methods(恢复方法) 涉及到buffer pool 和 disk Manager
![Pasted image 20250413174434.png|300](/img/user/accessory/Pasted%20image%2020250413174434.png)
虽然现在我不懂这是什么东西 但是随着探讨事物管理和恢复意味着什么 都会变清晰

**Transaction Management**
事务管理
事务管理使我们能够在数据库系统中安全地进行操作 即使实在多个更新同时进行的情况下
![Pasted image 20250413174843.png|500](/img/user/accessory/Pasted%20image%2020250413174843.png)
这里展示的是数据库操作的示意图 这些操作可以通过SQL查询触发
从Transaction Management组件的角度来看 关注的是对象级别的操作
假设我们启动了一个事务 读取的对象可能是一个记录 也可能是一页 在这里统称为对象
如果在ATM机吐出25美元后 迅速拔掉了电源线 使其无法正确的回执
怎么办？ 后面会看到

另一个我们需要关注的事情
如果你和你的伴侣共用一个银行账户 一起扣款 
![Pasted image 20250413175634.png](/img/user/accessory/Pasted%20image%2020250413175634.png)

如果应对这些不良行为 确保数据库的一致性？

对于第二个情况(并行一起扣款)的情况 可能得解决方法:
当每个 txn 到达 DBMS 时，逐个执行它们（即串行顺序）。
→在 DBMS 中，一个且只有一个 txn 可以同时运行。
在 txn 开始之前，将整个数据库复制到新文件，并对该文件进行所有更改。
→如果 txn 成功完成，请用新文件覆盖原始文件。→如果 txn 失败，只需删除脏副本
他们会提供某种程度的正确性 但从性能的角度来看 性能极差


我们会尽力解决所有问题 除了因电源故障引起的问题 关于停电问题 我们会在后续问题中详细探讨解决方案
因为有时候 比如银行把钱支付出去了 钱一旦交付出去了 就得再找一个别的query把钱拿回来 并且写道歉信之类的  所有这些数字操作 都将纳入一个非常严格的结构中 以确保具备明确正确性的属性

**Transaction Definition**
数据库管理系统（DBMS）主要关注的是对数据库中的数据进行读取和写入操作。一个事务可能会涉及对从数据库检索的数据执行许多操作。然而，这些操作如何影响“外部世界”——即数据库之外的事物，并不在DBMS的管理范围之内。
我们所关心只是一个对象是否被写入 是否被读取 以及这些读写方式是否以不良的方式相互干扰 那些不良的方式是什么 如何预防这些不良方式

**Transaction in SQL**
数据库系统如何知晓一个事务的开始与结束？
事务的开始可以是显式的，也可以是隐式的。
- 在SQL中，可以使用 `BEGIN TRANSACTION` 或 `START TRANSACTION` 来明确地告诉数据库系统一个事务的开始
- 如果没有显式地声明事务的开始，某些数据库系统会在你执行第一个查询时自动开启一个事务

事务的结束通常通过以下两种方式之一来完成：提交（COMMIT） 或 中止（ABORT/ROLLBACK）。
- COMMIT: 使用 `COMMIT` 语句来告知数据库系统，当前事务中的所有操作已完成并且需要永久生效。
- 使用 `ROLLBACK` 或 `ABORT` 语句来告知数据库系统，当前事务的操作需要撤销，所有在此事务中所做的更改将被回滚到事务开始前的状态。
- 如果没有显式声明 默认是 COMMIT

**ACID**
事务具备哪些性质: ACID
- Atomicity(原子性): 即便在这个事务中发生了大量的读取和写入操作 -- 要么全部一起发生 要么都不发生
- Isolation(隔离性): 如果有两个事务(比如之前提到的两个交易记录) 我们希望两个操作彼此互不相关 给人一种每种事务都是独立发生的感觉 虽然我们并不希望一次只运行一个事务 但我们希望营造出系统一次只运行一个事务的假象
- Durability(持久性): 如果数据库向我确认已提交了我的事务 即使出现了某些故障 比如磁盘故障或内存故障 也应该能够恢复数据库的那个状态 包含所有提交的信息
- Consistency(一致性): 如果数据库按照某种定义开始时是一致的 那么它应该以相同的稳定状态结束 一致性原则实际上表明 如果应用程序在SQL DDL中制定了所有希望数据库正确存储的内容 那么数据库事务不应该破坏这些

**Today's Agenda**
- Atomicity
- Consistency
- Isolation
- Durability

### Atomicity
两种可能结果:
- commit 完成其所有actions
- 中止
DBMS 保证 txns 是 atomic 的。→从用户的角度来看：txn 总是要么执行所有作，要么什么都不执行

在深入探讨的过程中 审视几个场景:
- Scenario 1: We take $100 out of an account, but then the DBMS aborts the txn before we transfer it. 
- Scenario 2: We take $100 out of an account, but then there is a power failure before we transfer it

how can we do some of this stuff?
原子性部分的实现可以通过两种方式
- Logging(日志记录)
- Shadow Paging(影子分页)

**Logging**
recording all my actions
当将一个值从100更改为75的那一刻 可以记录下我的值曾经是100 然后改为75
处理这些日志 维护这些日志 并将他们存储在内存中 在适当的时刻 再将这些日志转移到磁盘上 而数据一旦迁移到磁盘 就能应对断电的情况
如果不认为单个磁盘能够可靠的存储该日志 -- 选择磁盘镜像技术
一旦日志被写入磁盘 基本上就能确信能够从中恢复并重建数据库的状态 -- 我们将在两讲后探讨协议区域 探讨如何实现这一过程
日志记录是大多数数据库系统用来记录正在发生的变更的机制
不要与日志存储结构混淆 现在讲的这个更像是跨越所有文件的全局日志机制 而日志存储结构可能只是对于某个table的机制 但是到底有没有重复的部分 是否可以相互使用 这是个很值得深究的问题 需要视情况讨论

**Shadow Paging**
在日志记录及其所有细节尚未真正明确之前的早期阶段 一个非常简单的方法来实现这类操作是使用影子分页技术
有点像copy-on-write(写时复制)的概念
整个过程是这样的: 我要对页面上的一个记录进行更改 我打算创建该页面的一个新副本 并在那里更改 如果需要撤销操作 只需要回溯到就页面 便可以同时保留整页修改前后的副本
可能效率比较低
但快速 易于实现

### Consistency
本质上是说 我作为应用程序开发人员 与数据库系统之间有一个契约 我通过SQL语句 主键约束 检查以及其他我希望在系统中实现的要求
如果这些约束在事务开始之前就已成立 那么该事务运行过程中的所有对象和操作 一旦已经提交 所有那些约束条件必然仍然成立
不过事务管理并不会采取任何不同措施
只需要确保原子性得以维持 AID组件得到保障 一致性自然就会妥善处理

### Isolation
营造一种假象: 每个事务就像它自己运行一样
DBMS通过加错事务的action来实现并发
所以我们需要一种方法来交错事务 但仍然使得他们看起来好像一次运行一个
存在两种方法 -- 不过今天只是从高层次上概述一下 下一讲深入细节
两类锁:
- Pessimistic(悲观锁): 在允许读写操作发生之前 -- 也就是说如果预感到有还是发生 会阻止一切事物暂停
- Optimistic(乐观锁): 乐观控制技术  仍然是隔离原则 不互相干扰 但是会通过检查来确保一切顺利 会记录一些东西来看你们是否发生干扰了
**example**
![Pasted image 20250415112200.png|400](/img/user/accessory/Pasted%20image%2020250415112200.png)
先运行T1还是T2会得到不同的结果
假设A and B each have $1000.
- A=954, B=1166
- A=960 B=1160
但是不变的是A+B=2120 -》 our goal.
换句话说DBMS 无需保证 T1 与 T2 执行的先后顺序，如果二者同时被提交，那么谁先被执行都是有可能的，但执行后的净结果应当与二者按任意顺序分别执行的结果一致
串行
![Pasted image 20250415112323.png|500](/img/user/accessory/Pasted%20image%2020250415112323.png)
所谓的"同时" 不是说一起按下按钮 只是说我们只需要确保最终值试着两种情况之一 而非第三种就行
并行 example 1: good
![Pasted image 20250415113906.png|500](/img/user/accessory/Pasted%20image%2020250415113906.png)
尽管并行存在交错执行 但是我们要保证得到上面两种情况之一 上面这种情况good
example 2: 显然如果按照下面的情况并行 bad
![Pasted image 20250415113710.png|500](/img/user/accessory/Pasted%20image%2020250415113710.png)
![Pasted image 20250415114027.png|500](/img/user/accessory/Pasted%20image%2020250415114027.png)

如何判断一种重叠的Schedule是正确的？ -- if the schedule is equivalent to some serial execution.
这里明确几个概念：
- Serial Schedule: 不同 transactions 顺序执行，之间没有重叠
- Equivalent Schedules: 对于任意数据库起始状态，若两个 schedules 分别执行所到达的数据库最终状态相同，则称这两个 schedules 等价
我们正努力达到的难点是等价调度
等价调度允许某些操作  只要证明这种交错是安全的 而证明是指出所有操作都等价于某种串行

**Conflicting Operators**
我们将从冲突(conflict)的角度考虑这些重写
我们要探讨的是异常现象conflicting operations 三种类型
首先 当两个 operations 满足以下条件时，我们认为它们是 conflicting operations：
- 来自不同的 transactions
- 对同一个对象操作
- 两个 operations 至少有一个是 write 操作

列举出来有三种类型
- Read-Write Conflicts(R-W)
- Write-Read Conflicts(W-R)
- Write-Write Conflicts(W-W)

**Read-Write Conflicts(R-W)**
eg. Unrepeatable read
![Pasted image 20250415160545.png|500](/img/user/accessory/Pasted%20image%2020250415160545.png)

**Write-Read Conflicts(W-R)**
eg. Dirty Read
![Pasted image 20250415160956.png|400](/img/user/accessory/Pasted%20image%2020250415160956.png)
T1 ABORT 导致回滚到10  所以T2就读到了一个脏数据

**Write-Write Conflicts(W-W)**
eg. Lost update: 当写入同一个资源时 后者覆盖掉前者的值
![Pasted image 20250415161412.png|400](/img/user/accessory/Pasted%20image%2020250415161412.png)

**serializability**
Serializability(串行化) 对一个Schedule意味着这个schedule是否正确
有两个不同级别的Serializability
- Conflict Serializability: Most DBMSs try to support this.
- View Serializability

dependency graph: 事务是节点 冲突是有向边 有环表明是一个不良调度 谁指向谁 看的是时间的先后 
![Pasted image 20250415164437.png|500](/img/user/accessory/Pasted%20image%2020250415164437.png)
一般不会允许这个过程运行到第二条线(与悲观和乐观锁有关 )
![Pasted image 20250415165013.png|600](/img/user/accessory/Pasted%20image%2020250415165013.png)
理解了上面这个表就能理解隔离是如何工作的
我觉得有点像数据结构拓扑结构那里学的知识
![Pasted image 20250415170613.png|300](/img/user/accessory/Pasted%20image%2020250415170613.png)
但如果这里涉及到的语句只是查询>=0的
这种循环并不重要
这就是视图可序列化的本质: 如果了解正在发生的事情的语义就会承认更多原本不会接受的schedule
![Pasted image 20250415171031.png|300](/img/user/accessory/Pasted%20image%2020250415171031.png)

![Pasted image 20250415171154.png|400](/img/user/accessory/Pasted%20image%2020250415171154.png)

### Durability
已提交事务的所有更改都应该是持久的。
→没有撕裂的更新。
→失败的交易没有变化。
DBMS 可以使用日志记录或影子分页来确保所有更改都是持久的。
未来两节课会提到

