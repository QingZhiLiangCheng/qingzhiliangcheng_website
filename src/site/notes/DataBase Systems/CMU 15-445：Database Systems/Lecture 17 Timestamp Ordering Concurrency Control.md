---
{"tags":["cmu15445","week11"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 17 Timestamp Ordering Concurrency Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-19T16:13:11.416+08:00","updated":"2025-04-24T14:31:39.265+08:00"}
---

![[17-timestampordering.pdf]]

### Last Class
![Pasted image 20250422162535.png|400](/img/user/accessory/Pasted%20image%2020250422162535.png)
这个例子是假设我们知道andy的记录在tuple 1, 所以我们给table加IS锁, 给 tuple1加S锁(其实是用了两个锁 如果我不知道andy的记录在哪里 我就需要从tuple1开始一个一个加s锁 所以 完全有理由只给table加S锁)
而IS锁的好处 就是 我可以同时加IX锁 也就是说 我可以同时对table的一部分进行read而对另一部分进行write
![Pasted image 20250422162941.png|450](/img/user/accessory/Pasted%20image%2020250422162941.png)
所以有了意向锁 有了更多的空间来灵活处理事务 如果我们知道存在一个索引或者新纪录的位置已知的情况下 那么这里就体现出优势了
事实上这里并没有将索引所谓单独的访问路径展示 但一般理论表明 数据的组织资源层次结构并不必然是树状的 可能是一个有向无环图(DAG) 但是思路类似

作为应用程序开发者 通常不会手动获取这些锁；SQL语句提供了允许锁定整个表的操作 但并不推荐这么做 这些锁 会在系统的适当节点中被获取
![Pasted image 20250422164901.png|500](/img/user/accessory/Pasted%20image%2020250422164901.png)
只允许共享锁和独占锁

行级锁
![Pasted image 20250422165737.png|500](/img/user/accessory/Pasted%20image%2020250422165737.png)`SELECT * FROM <table> WHERE <qualification> FOR UPDATE;`。这条语句不仅执行查询，还会对匹配的元组（行）设置排他锁。这意味着其他事务在当前事务完成或释放锁之前不能修改这些行。
同时给了相容性矩阵

### Overview
锁的开销会很大 需要获取很多锁 要获取层级锁 有没有别的方法？ this lecture talking about a timestamp ordering(时间戳排序) --无需使用锁机制 -- 属于一种乐观的策略
尽管Timestamp ordering这种方法没有人使用 但是它引入了我们构建乐观并发控制与MVCC(多版本并发控制)基础的概念
Timestamp Ordering的核心思想就是利用时间戳来决定事物的可串行化执行顺序 为每个 transaction 分配一个 timestamp，如果 $TS(T_i)<TS(T_j)$，则DBMS需要确保执行计划等价于一个顺序为 $T_i,T_j$的序列
所以时间戳应该是一个单调增加 值唯一的数  so where do these timestamps come from? what do they look like? 
- System/Wall Clock.  但往往分布式系统的不同机器的时钟不一样
- Logical Counter. 可能出现两个人同时尝试读取该数值并递增的操作 -- 好在硬件存在原子性指令  可能会溢出；在分布式系统中也难以维持一致性
- Hybrid.
今天暂时忽略如何实现的 假设我们能得到正确的Timestamp

**today's agenda**
- Basic Timestamp Ordering (T/O) Protocol
- Optimistic Counrrency Control
- Isolation Levels

### Basic T/O
