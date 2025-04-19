---
{"week":"第十周","dg-publish":true,"tags":[],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 16 Two-Phase Locking/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-11T15:34:42.844+08:00","updated":"2025-04-19T09:35:23.795+08:00"}
---

![[16-twophaselocking.pdf]]

### Overview
上节课提到了悲观算法和乐观算法来实现防止发生事务之间的相互干扰(depend graph)
悲观是通过锁来实现的 下一节课谈到乐观并发控制协议
锁在这里的作用: 
![Pasted image 20250416221752.png|500](/img/user/accessory/Pasted%20image%2020250416221752.png)
在读取和写入对象前会获取锁 在T2 LockA的时候会发现A已经被事务T1持有 T2阻塞
我们不会去深入探讨Lock Manger的样子 但它通常是按照被锁定的对象ID组织成哈希表 然后他会跟踪所有锁持有者或持有者请求 这些请求被放在一个待处理的队列上

today's agenda
- Lock Types
- Two-Phase Locking 两阶段锁定的协议
- Deadlock Detection + Prevention 讨论实施锁定时可能出现的糟糕情况 -- 死锁
- Hierarchical Locking 层级锁定 -- 在树的不同级别上进行

### Lock Tpyes
**Locks vs. Latches**
[[DataBase Systems/CMU 15-445：Database Systems/Lecture 06 Memory & Disk IO Management\|Lecture 06 Memory & Disk IO Management]]提到过
![Pasted image 20250416222925.png|500](/img/user/accessory/Pasted%20image%2020250416222925.png)
- Lock(锁)是数据库的一个概念 -- 用来分离transaction的 防止transaction互相干扰
- Latch(闩锁)是试图让内存中共享数据结构的thread避免相互干扰

**Basic Lock Types**
- S-Lock: 共享锁  允许多个事务在同一时间读取同一对象
- X-Lock: 互斥锁 允许一个事务修改一个对象。 这个锁对任何其他锁都是不兼容的。每次只有一个事务可以持有排他性锁。

兼容性矩阵
![Pasted image 20250416224844.png|400](/img/user/accessory/Pasted%20image%2020250416224844.png)
锁的类型不只是这两种 但是我们目前是只使用这两种锁 确保安全。
采用多种所锁的目的是为了更高的并发性
![Pasted image 20250416224741.png|700](/img/user/accessory/Pasted%20image%2020250416224741.png)
hhhh好多好多锁

现在需要关注的是 如何正确的使用锁
事务必须从锁管理器请求锁（或升级）。
有一个锁升级的例子: 在一个事务中的第一个查询要查看所有的内容 然后在同一个事务的下一个查询 会更新第一个查询结果中的部分数据 -- 在一个查询中 只需要给bufferpool中的page加上读锁(共享锁)就行 但是对于需要更新的页面 就会将读锁升级成写锁(互斥锁)
锁管理器根据其他事务当前持有的锁来授予或阻止请求。当事务不再需要锁来释放对象时，它们必须释放锁。锁管理器使用有关哪些事务持有哪些锁以及哪些事务正在等待获取锁的信息更新其内部锁表。
![Pasted image 20250417114210.png|500](/img/user/accessory/Pasted%20image%2020250417114210.png)
虽然看似运转起来了 但是其实这是一个冲突的例子
![Pasted image 20250417114418.png|500](/img/user/accessory/Pasted%20image%2020250417114418.png)
所以说仅仅在需要访问或写入数据时获取锁无法保证 schedule 的正确性，我们需要更强的加锁策略

### Two-Phase Locking(2PL)
- **Phase #1– Growing**: 事务可按需获取某条数据的锁，lock manager 授予/拒绝这些锁请求。
- **Phase #2– Shrinking**: 事务只能释放之前获取的锁，不能获得新锁。即一旦开始释放锁进入 Shrinking 阶段，之后就只能释放锁。

上面的例子中的问题在于 A的解锁发生的太早 以至于T2能够开始获取那些尚未提交的事务所做的更改 Phase 2很好的解决了这个问题
![Pasted image 20250417114947.png|500](/img/user/accessory/Pasted%20image%2020250417114947.png)
![Pasted image 20250417115529.png|500](/img/user/accessory/Pasted%20image%2020250417115529.png)

这个图是一个单一事务的图 表明一旦开始收缩(放锁) 就不能在grow了(即申请锁)
有一个神奇的点 稍后会讲到  lock point(锁定点) 探讨它在幕后诱导的dependence graph中锁代表的真正含义
最先到达锁定点的事务将成为最终串行调度中的第一个事务
因为2PL的规则 grow阶段不能释放锁 必须得所有的加锁操作完成之后才能开始释放锁 -- 但是虽然有加锁操作 授不授权允不允许是另外一回事儿 事实上不允许重复加写锁 所以这也确保了只有一个写锁
![Pasted image 20250417115705.png|600](/img/user/accessory/Pasted%20image%2020250417115705.png)
首先你会发现A的释放锁的时间延后了  是因为2PL需要保证在第一次释放锁之后不能在获取锁 所有就只剩了一次申请和释放
但问题是T1加的锁是一个写锁 所有T2不能再加锁 所以阻止了dependence graph中弧线的产生 所以阻止了循环 

但2PL有一些问题 被称为**cascading aborts(级联中止)** --当一个事务中止 (abort) 时，会导致另一个事务也必须回滚。这导致了工作的浪费(当然还可能导致死锁 后面会提到)
![Pasted image 20250417132402.png|500](/img/user/accessory/Pasted%20image%2020250417132402.png)
这个例子的意思是 在T1中我已经完成了对A的操作了 然后T2开始对A操作 但是T1中B出现了问题 整个T1都会被中止(原子性) 所以T2中的Read A变成了一个脏读 只能跟着回滚
所以我们希望加强2PL协议 使得这种情况在新协议中不被接受  这种新协议叫做**Strong Strict 2PL(aka. Rigorous 2PL)**
![Pasted image 20250417134233.png|500](/img/user/accessory/Pasted%20image%2020250417134233.png)
假设我们还是用刚刚那个图 第一个释放是A 第二个释放是B 所以问题的关键在于由于先释放了A 所以导致了其他transaction又访问了A
所以办法是一起释放 最后释放 保证在整个transaction完成之前都不能让其他transaction持有  即transaction只允许在transaction结束后释放锁(即commit和aborted)
![Pasted image 20250417134839.png|500](/img/user/accessory/Pasted%20image%2020250417134839.png)
但是一个lock manager(前面提到过是个hash table) 显然不能一口气同时释放所有的锁 这涉及到语义 在关键时间点释放就可以 比如我们编写完提交日志 随后便可开始删除操作  暂时忽略……
example
![Pasted image 20250417135807.png|400](/img/user/accessory/Pasted%20image%2020250417135807.png)
![Pasted image 20250417135819.png|500](/img/user/accessory/Pasted%20image%2020250417135819.png)
![Pasted image 20250417135903.png|500](/img/user/accessory/Pasted%20image%2020250417135903.png)
![Pasted image 20250417135913.png|500](/img/user/accessory/Pasted%20image%2020250417135913.png)

### Deadlock Detection + Prevention
2PL可能导致死锁 —— Solution：Detection(死锁检测)和Prevention(预防)
![Pasted image 20250417140521.png|500](/img/user/accessory/Pasted%20image%2020250417140521.png)
死锁：事务之间互相等待对方释放自己想要的锁
存在检测死锁的机制
- Approach 1: Deadlock Detection
- Approach 2: Deadlock Prevention

**Deadlock Detection**
引入了一个成为wait for graphs(等待图)的东西 -- 类似与 dependence graph
为了检测死锁，DBMS 会维护一张 waits-for graph，来跟踪每个事务正在等待 (释放锁) 的其它事务，然后系统会定期地检查 waits-for graph 看其中是否有成环，如果成环了，就要决定如何打破这个环。
waits-for graph 中的节点是事务，从 Ti 到 Tj 的边表示 Ti 正在等待 Tj 释放锁，但是这个东西挺占用资源的
![Pasted image 20250418214912.png|500](/img/user/accessory/Pasted%20image%2020250418214912.png)
当 DBMS 检测到死锁时，它会选择一个 "受害者" (事务)，将该事务回滚，打破环形依赖，而这个 "受害者" 将依靠配置或者应用层逻辑重启 (restart) 或中止 (abort)，中止更为常见
检测死锁的频率越高，陷入死锁的事务等待的时间越短，但消耗的 cpu 也就越多。这是个典型的 trade-off，通常有一个调优的参数供用户配置。
如何选择合适的 "受害者" (选择受害者的指标)：
- 事务持续时间
- 事务的进度
- 事务锁住的数据数量
- 级联事务的数量
- 事务曾经重启的次数

选择完 "受害者" 后，还要**决定回滚 txn 的更改的程度**：完全回滚 or 回滚到足够消除环形依赖即可。

**Deadlock Prevention**
Deadlock prevention 是一种事前行为，采用这种方案的 DBMS 无需维护 waits-for graph，也不需要实现 detection 算法，而是在事务尝试获取其它事务持有的锁时直接决定是否需要将其中一个事务中止。
通常 prevention 会按照事务的年龄来赋予优先级，事务的时间戳越老，优先级越高。有两种 prevention 的策略：
- `Wait-Die ("Old Waits for Young")`：如果 requesting txn 优先级比 holding txn 更高 (老) 则等待后者释放锁；更低则自行中止
- `Wound-Wait ("Young Waits for Old")`：如果 requesting txn 优先级比 holding txn 更高 (老) 则后者自行中止释放锁，让前者获取锁；否则 requesting txn 等待 holding txn 释放锁

![Pasted image 20250418220531.png|500](/img/user/accessory/Pasted%20image%2020250418220531.png)
无论是 Old Waits for Young 还是 Young Waits for Old，只要保证 prevention 的方向是一致的，就能阻止死锁发生，其原理类似哲学家就餐设定顺序的解决方案：先给哲学家排个序，遇到获取刀叉冲突时，顺序高的优先。
当 txn abort 后 restart 时，**它的 (新) 优先级是它的原始时间戳**，这是为了防止饥饿。

### Hierarchical Locking
我们拥有一个层次结构 用于组织数据的方式 -- 我们的每一条记录并不是孤立存在的 attribute in tuple, tuple in table, table in page, page in file, file in database -- 而我们访问数据也是遵循了这个层级 -- 所以我们尝试在不同粒度获取锁 并允许混合使用这些不同粒度的锁
![Pasted image 20250418221345.png|500](/img/user/accessory/Pasted%20image%2020250418221345.png)
为了使整个层级结构正常工作 就不能仅仅使用共享锁和排他锁了 
我们需要一种Intention Lock(意向锁)的机制 -- 意向锁允许将更高级别的节点锁定为共享或独占模式，而无需检查所有后代节点。如果节点处于意向模式，则显式锁定在树中的较低级别完成。
- **意向共享锁** Intention-Shared (IS)：若一个节点被加上 IS 锁，则将在树的较低层使用 S 锁进行显式锁定。
- **意向排他锁** Intention-Exclusive (IX)：若一个节点被加上 IX 锁，则将在树的较低层使用 X 进行显示锁定。
- **意向共享排他锁** Shared+Intention-Exclusive (SIX)：若一个节点被加上 SIX 锁，则对以该节点为 root 的树使用 S 锁显示锁定，且将在树的较低层使用 X 锁进行显示锁定。**SIX 锁可理解为 S + IX**
![Pasted image 20250419092205.png|500](/img/user/accessory/Pasted%20image%2020250419092205.png)
example:
T1 - 获取Andy的银行账户余额
T2 - 将bookie's account余额增加1%
![Pasted image 20250419092513.png|500](/img/user/accessory/Pasted%20image%2020250419092513.png)

example:
T1 - scan all tuples in R and update one tuple.
T2 - read a single tuple in R.
T3 - scan all tuples in R.
![Pasted image 20250419093500.png|500](/img/user/accessory/Pasted%20image%2020250419093500.png)
![Pasted image 20250419093510.png|500](/img/user/accessory/Pasted%20image%2020250419093510.png)
![Pasted image 20250419093519.png|500](/img/user/accessory/Pasted%20image%2020250419093519.png)
