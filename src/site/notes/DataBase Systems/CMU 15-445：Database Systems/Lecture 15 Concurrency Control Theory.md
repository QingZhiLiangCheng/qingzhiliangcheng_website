---
{"week":"第十周","dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 15 Concurrency Control Theory/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-11T15:33:49.723+08:00","updated":"2025-04-13T19:27:23.412+08:00"}
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
- Atomicity(原子性)
- Consistency(一致性)
- Isolation(隔离性)
- Durability(持久性)
