---
{"tags":["cmu15445","week11"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 17 Timestamp Ordering Concurrency Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-19T16:13:11.416+08:00","updated":"2025-06-30T20:26:59.623+08:00"}
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
Basic T/O 事务不需要加锁
每个对象都会记录两个时间戳
- `W_TS(X)`：最后一次写 X 发生的时间戳
- `R_TS(X)`：最后一次读 X 发生的时间戳

所以这里的过程是 我试图对某个对象进行读写操作 会查看时间戳并思考 但这个操作的时间戳优先于我 那就要撤销我的操作

**Basic T/O Reads**
当事务$T_i$需要对对象X进行读操作时，需要检查 $TS(T_i)<W-TS(X)$
$TS(T_i)$ 是事务 $T_i$ 的时间戳: 每个事务在启动时都会被分配一个唯一的时间戳，表示该事务开始的时间点
$W-TS(X)$ 是对象X的写时间戳 这里不是减法啊 其实是一个小短横 - 其实用$W\_TS(X)$ 或许更好理解我觉得 -- 其实就是最近一次对象X成功执行写操作的事务的时间戳 换句话说 就是最后一次修改X的事务的时间
所以如果X的写时间戳大于事务$T_i$的时间戳 -- 那么说明发生了某些未来的变化 我本不应该看到这个未来的值 我不能读取来自未来的事物
如果X的写时间戳小于事务$T_i$的时间戳 -- 那就 read it --但是要让全世界都知道我read了X -- 做法就是更新X的时间戳为事务$T_i$的时间戳
事实上这是讨论的RW异常
**Basic T/O Writes**
我们需要检查试图写入的对象的读取或写入时间戳是否在未来 即 R-TS(X) or W-TS(x)
WW 异常 和 WR异常
So if $TS(T_i)<R-TS(X) or TS(T_i)<W-TS(X)$ -> Abort
Else -> Allow write and update W-TS(X)

**BASIS T/O Example 1**
![Pasted image 20250425194534.png|500](/img/user/accessory/Pasted%20image%2020250425194534.png)

![Pasted image 20250425194546.png|500](/img/user/accessory/Pasted%20image%2020250425194546.png)

![Pasted image 20250425194604.png|500](/img/user/accessory/Pasted%20image%2020250425194604.png)

![Pasted image 20250425194628.png|500](/img/user/accessory/Pasted%20image%2020250425194628.png)

![Pasted image 20250425194720.png|500](/img/user/accessory/Pasted%20image%2020250425194720.png)

![Pasted image 20250425194734.png|500](/img/user/accessory/Pasted%20image%2020250425194734.png)

![Pasted image 20250425194746.png|500](/img/user/accessory/Pasted%20image%2020250425194746.png)

![Pasted image 20250425194813.png|500](/img/user/accessory/Pasted%20image%2020250425194813.png)

**Basic T/O Example 2**
![Pasted image 20250425194850.png|500](/img/user/accessory/Pasted%20image%2020250425194850.png)

**Thomas write rule(TWR)**
这算是一种优化 核心在于 在上面的例子中 可以认为T1和T2是紧紧相连甚至是同时运行的 Basic T/O要求T1回滚 但这是不必要的 因为T2已经写过了A 那么T1想写的数据将永远不会被读到
所以当 $TS(T_i)>TS(T_2)$ 时候 没有必要回滚 忽略就可以
![Pasted image 20250425203639.png|500](/img/user/accessory/Pasted%20image%2020250425203639.png)
TWR 优化了 Basic T/O 的写检查，使得一些本不必中止的事务顺利进行，提高了事务并发程度

**Basic T/O Summary**
不会造成死锁 因为没有事务需要等待
但长时间运行的 txn 可能会变得饥饿。→txn 从较新的 txn 读取内容的可能性增加
除此之外 将数据复制到 txn 的工作区和更新时间戳的开销很高。→每次读取都需要 txn 写入数据库
但我们对这种协议感兴趣 是因为OLTP多 如果事务都是短暂的 那么即使强制事务通过整个层次结构进行分层锁定 并获取所有这些锁 似乎有些成本高昂 但现在开始探讨的这些协议 如时间戳和MVCC(多版本并发控制 下一节) 表现出更高的性能

### Optimistic Concurrency Control
From 论文《On Optimistic Methods for Concurrency Control》
对象将会读取数据并创建工作区（就像我们开始为事务一创建对象A那样）. 工作区保存所有对象 并且现在该工作区将保留我们在事务中读取或写入的所有内容 而不仅仅是写入的内容
我们对事务所做的修改都发生在本地工作区 有点像GitHub 某个时刻提交 所以你将在你的工作区完成所有操作 然后最终需要执行最终的写入操作 将数据写入主数据库 当向所谓的全局数据库写入数据之前 需要先进行检查 确保一切安全且正确

**OCC Phases**
Phase 1: Read Phase
读取阶段 因为从全局数据库的角度来看 每个事务在读取阶段所做的仅仅是读取数据 但该事务所有的工作即将发生时 即进行本地的修改以及读写等操作时 这一切都是基于数据库的本地副本进行的  就像我们pull 代码一样
Phase 2: Vaildation Phase
验证阶段 我们将检查 对我来说执行最终操作是否安全 即实际上确保正确无误并将我在工作区中所做的所有更改永久化
Phase 3: Write Phase

**OCC example**
![Pasted image 20250430082448.png|500](/img/user/accessory/Pasted%20image%2020250430082448.png)
![Pasted image 20250430082459.png|500](/img/user/accessory/Pasted%20image%2020250430082459.png)
![Pasted image 20250430082518.png|500](/img/user/accessory/Pasted%20image%2020250430082518.png)
![Pasted image 20250430082530.png|500](/img/user/accessory/Pasted%20image%2020250430082530.png)
![Pasted image 20250430082550.png|500](/img/user/accessory/Pasted%20image%2020250430082550.png)
一开始Ti 和 Tj并没有赋予恰当的名字 这是一个技巧 在下面的图中的这个时候才分配了名子
无穷大指的是未来的某个事物 将介入时间戳视为目前有效性持续至无穷大
![Pasted image 20250430082625.png|500](/img/user/accessory/Pasted%20image%2020250430082625.png)
![Pasted image 20250430082637.png|500](/img/user/accessory/Pasted%20image%2020250430082637.png)
![Pasted image 20250430082654.png|500](/img/user/accessory/Pasted%20image%2020250430082654.png)

**OCC: Three Phases**
在读取阶段结束时 当我获取名称后 我获得我的事务编号
在验证阶段 我将检查 如果我取出了已检查的内容 再将其放回 是否会违反我们正努力实现的可串行化调度
![Pasted image 20250430083645.png|500](/img/user/accessory/Pasted%20image%2020250430083645.png)
如何确保其安全性？
上面的论文其实提到了 只需要关注 三个检验
任意条件成立意味着该事务对是安全的 将这三个条件应用于所有事务 基本上就算完成了
Case 1: Ti 在 Tj 之前完全完成
![Pasted image 20250430084129.png|500](/img/user/accessory/Pasted%20image%2020250430084129.png)

Case 2: Ti 在 Tj 开始其写入阶段之前完成其写入阶段
![Pasted image 20250430084357.png|500](/img/user/accessory/Pasted%20image%2020250430084357.png)
Tj可能已经开始读取Ti正在写入的内容 审视T1的写集和Tj的读集 若他们无冲突 宣告这两项事务安全$WriteSet(T_i) \cap ReadSet(T_j) = \emptyset$ 

Case 3: Ti 在 Tj 完成其读取阶段之前完成其读取阶段
![Pasted image 20250430091236.png|500](/img/user/accessory/Pasted%20image%2020250430091236.png)
$WriteSet(T_i) \cap ReadSet(T_j) = \emptyset$ and $WriteSet(T_i) \cap WriteSet(T_j) = \emptyset$
**OCC Validation**
![Pasted image 20250430223053.png|500](/img/user/accessory/Pasted%20image%2020250430223053.png)
上节课的内容回避了关于事务ID确切分配时机的问题，但首先是Ti和Tj被赋予了事务编号，以确保在通过OCC强制执行等效串行调度中，i先于j.  
如果事务i需要commit, 他会询问所有需要关注的j是什么, 系统中会保留一下状态来跟踪所有活跃的事务, 所以i会知道它需要从自己的点开始检查未来所有的事务, 而这些未来的事务在某一点上都会被分配一个事务id, 事务id是通过最简单的方式分配的, 有一个全局计数器, 每个人都会对这个计数器进行原子增量操作并获得一个事务id, 所以事务i知道关注哪些事务, 然后进行检查

**OCC - write phase**
前面已经讨论了 read phase, 以及validation phase, 现在事务已经验证完毕，准备声明: 已经获得绿灯信号，可将所有内容写入全局数据库
现在，多个事务可能同时进入写入阶段
但这里只介绍了一个非常高的层面的概述
在写阶段确保正确性最简单的方法是，按照一个串行顺序执行写操作，任何想进入写阶段的交易都会在内容中获得一个锁存器，声明"我正在写入，请其他人等待我完成". 
这可能需要很长时间，因为该交易可能更新了百万级别的对象，现在都需要写入磁盘

除此之外，还存在一种高级协议，允许并行写操作发生，从宏观的角度看，利用条件3，进行大量读写集之间的检查，甚至会延迟事务号分配，reader甚至不会获得事务号；对于writer，将连续执行检查，尽可能长时间地避免进入临界区，有点像 我们每个人都要写入，然后就建立起一个顺序(对象id), 从低到高进行写入操作，这样写入时就不会相互干扰

真正深入理解这个并行提交协议需要30-40min, 这里老师只是想让我们知道，写入阶段需要并行化，并且如果事务i在事务j之前完成，那么事务i的写集必须在事务j的写集之前被写入

**OCC - observations**
乐观并发控制 vs. 悲观并发控制 我们何时认为一种方法比另一种方法更有效？
权衡！
乐观并发控制并不进行锁定, 所以当锁定可能成为事务执行工作的瓶颈时, 它可以开始表现得很出色, 但必须付出的代价是，它将制作该数据集的多个副本，这很昂贵
所以如果工作负载中存在大量更新操作， 并且这些针对的是对数据库的较大部分，OCC并不适合，因为他必须创建所有这些副本，而如果这些事务之间存在真正的冲突，就意味着有些事务需要回滚
在2PL中，当首次有两个事务尝试相互干扰时，我们就会立即制止他们，但缺点是你会一直持有锁。 

### The Phantom  Problem、

**Dynamic Databases**
到目前为止，我们谈论了大约两周的内容中，我们一直假设我们的数据库对象是真实存在的、物理的，比如页面和记录，我们对其进行操作，如复制或者获取锁
但在现实中，存在创建新事物的事务
在创建操作中，有一个有趣的问题，我们需要担心一个我们迄今为止还未曾关注的问题: the phantom problem. 当创建一个新内容的时候，尝试获取锁或进行复制时，将永远无法预见其存在
eg
![Pasted image 20250629193529.png|600](/img/user/accessory/Pasted%20image%2020250629193529.png)
查询试图找出people表中，状态为'lit'的记录有多少条，稍后重复这一操作，但在中间，有一个新的记录被创建了
在进行查询的时候，可能会在所有页或记录上获取一个读锁，并遵循两阶段锁定协议，如果锁定实在页或记录的粒度上完成的，实际上会得到错误的结果。如果所有锁定都在数据库或者表级别完成的，其实就没问题，但没法实现粒度锁定
这就是所谓的幻影问题  当然包括删除
如果采用OCC, 系统会为所有读取数据制作副本，它只是会重新从那里读取，因为它认为所有状态等于lib的记录都已经包含在内了
所以说目前讨论的所有机制都没法解决幻读问题

为了避免幻影问题，有三种方法
**Approach 1:  Re-Execute Scans** 每当需要完成事务的时候，会重新查询指定所需的所有数据，并检查是否得到了相同的结果。 如果采用的是OCC，那是很简单的，因为可以跟踪我读取过的所有的对象
**Approach 2: Predicate Locking** 谓词锁定。谓词锁定表明，如果我只是跟踪所有谓词的状态，即等于"点亮"，这种情况就不会发生。对于任何试图通过谓词规范逻辑覆盖记录的人，需要进行一些特殊处理。 谓词锁定是在70年代发现幻影问题时提出的第一种解决方案，但很难实现，而且没有人这么做，因为这是一个NP完全问题。
**Approach 3: Index Locking** 索引锁。最终采用的方法是使用索引锁，我们需要对如何允许使用索引进行锁定并做出调整，因为索引指向的是实际的数据项，但也可以指向数据项的范围，因此他能一定程度上模拟谓词锁

深入讨论

**Re-Execute Scans**
重新读取数据，并确认它是否与我之前读取的内容完全一致
但这需要一个昂贵的检查，遍历整个系统。
这种方法的应用场景是，有一类事务系统处理的是内存中的数据，因为实际上现在可以得到一个4TB的内存服务器，许多甚至大型的、重量级的事务负载都可以在内存中完成，内存中的OLTP是一个大趋势。
有一篇论文指出，如果你增加更多节点，事务系统实际上会变慢，并且证明他们会以平方级别恶化，而不像分析系统那样(如果我增加更多的节点，可以进行分区和其他操作，可以变得更快) 
所以重新执行扫描适用于数据在内存中的情况，因为这要快得多。如果要访问磁盘, 等待重新扫描的时间会很长。
解决这个问题的方法，就是下面提到的谓词锁(Predicate Locking).

**Predicate Locking**
每当有一个查询的时候，我会查看SELECT语句的WHERE，以及UPDATE, INSERT, DELECT的WHERE子句。update, insert, delete试图更改，设想可以查看所有这些谓词，并且通过仅查看谓词来逻辑上解决他们是否想干扰的问题。这是一个很好的方法，应为不需要去鼓捣对象，日志表之类的东西。
但这个方法的证明是极其困难的，大多数人都不会这么做，但这是最初提出的方案，来自于一个德国的系统Hyper，在这个系统出提出了谓词块的概念。
老师有一个即将毕业的学生，在一个受限的环境中研究了使用谓词块进行OLTP，并认识到了这些谓词块具有特殊的结构，但并不完全适用于普遍情况。
谓词锁是怎么工作的呢？-- 需要构建某种结构来确定哪些谓词存在重叠
![Pasted image 20250630190751.png|500](/img/user/accessory/Pasted%20image%2020250630190751.png)
仅仅只有个list是很简单的，但是一般情况下，设计到谓词合取和析取，那就会变得很复杂
但是注意，虽然叫谓词锁，但并不是我们所严格意义上研究的锁实体，而是基本上声明了一种数据结构来模拟。


**Index Locking**
索引需要b-tree，如果试图讨论的谓词没有b-tree，那么无法使用index locking, 因此必须为所有出现的，希望用“谓词锁”所保护的谓词构建b-tree. 否则，只能采取X和S锁
现在假设出现幻影问题的每一个感兴趣的谓词都拥有b-tree
![Pasted image 20250630192900.png|400](/img/user/accessory/Pasted%20image%2020250630192900.png)
如果把锁建在键14上，可以防止其他人在处理的时候碰到key 14，所以一种想法就是在扫描索引并执行范围谓词的时候，触碰到每个键时，会围绕这个键设置锁，当其他人试图在键上做什么，并不会立即生效。
但这并没有解决问题，因为问题不是键本身，而是键之间的东西，如果试图插入15，刚刚的方法就行不通了，所以还必须要保护这个间隙。有一种锁叫间隙锁。
![Pasted image 20250630193254.png|400](/img/user/accessory/Pasted%20image%2020250630193254.png)

现在我们要做一种叫做key-range lock的东西，要将这两种东西结合起来。既可以锁定键，也可以锁定间隙
在我们之前所讨论的例子中，状态等于lit，只需要锁键就可以，现在我们让例子更复杂一点，选择查询视图读取所有记录在14到16之前的个数，如果插入15就会造成幻影问题。
我们将会使用这个叫key-range lock的东西，即针对键值14及其右侧的所有内容进行锁定，这被称为"next key", 从逻辑上讲表明正在锁定14，但事实上会锁定14以及右侧知道出现实际值的所有内容。注意包含14，但不包含16。
当然还有一种完全对称的方法是prior key，但是注意，只实现这两种机制中的一种就可以，否则会陷入死锁。
![Pasted image 20250630194003.png|400](/img/user/accessory/Pasted%20image%2020250630194003.png)
有一句很形象的话，hhh 每个人都得朝一个方向游泳。这取决于如何访问b-tree，如果在执行查询范围的时候，b-tree是从最低键值开始，如果从低到高扫描子节点，那么会采用prior key，但大多数系统无论访问路径是什么，都采用next-key的机制。
可能会多锁定一点
我们还需要关注的是，能否利用细粒度锁定中的IX模式等有趣的功能
设想如果我有一个查询，从10读取数据，包括10-15但不包括16，那么他可以在这个范围获取ix锁，这算是谓词锁，如果查看记录后，发现需要将键14更新为其他内容，它只能在改键上获取X锁，而另一个事物需要更新12，那么获取IX锁和X锁 是被允许的

![Pasted image 20250630195521.png|500](/img/user/accessory/Pasted%20image%2020250630195521.png)

### Isolation Levels
SQL拥有一套标准，以特定术语定义了隔离的级别，但事实证明，这些术语令人困惑，曾经有人撰写过一篇论文，指出SQL的定义是错误的。
![Pasted image 20250630200303.png|500](/img/user/accessory/Pasted%20image%2020250630200303.png)
这里只是想让我们明白，SQL具备定义功能，实际上在安装数据库系统时，就可以启动一个事务，许多数据库都设有默认的隔离级别（后面会看到），在大多数系统中，可以在事务级别选择不同的隔离级别。
到目前为止我们讨论过的所有的内容都是**Serializable**的，可串行化的，完美世界，一切皆可序列化，幻影得到保护；**Repeatable Reads**，对幻读没法提供保护，但这是大多数数据库系统的默认级别，这是为了更多的并行处理能力而“放弃”了幻读哈哈哈；**Read Committed**，可能会出现幻读和不可重复读，所以直方图查询(前面讨论过，某些聚合函数？可能会制作直方图)就在这个级别上运行。**Read Uncommitted**,啥也会发生哈哈哈
![Pasted image 20250630201211.png|500](/img/user/accessory/Pasted%20image%2020250630201211.png)

还有一种角度是将这些隔离级别映射到锁定协议
- Serializable: 可串行化基本上意味着锁定，首先获取所有锁，加上索引锁，并使用强严格的2PL
- Repeatable Reads: no index locks
- Read Committed: 如果采用2PL，将遵循所有步骤，唯独共享锁S-lock的处理上不同，读取数据后，不会保持共享锁，而是立即释放，所以并不是严格意义上的2PL
- Read Uncommitted: no S-lock  但存在写锁

显示设置隔离性
![Pasted image 20250630201749.png|500](/img/user/accessory/Pasted%20image%2020250630201749.png)

大多数数据库的默认隔离性和最高隔离性
![Pasted image 20250630201921.png](/img/user/accessory/Pasted%20image%2020250630201921.png)
有些系统甚至不支持完全序列化，Oracle接近这一点，但并为完全实现，Oracle实现的是一种snapshot isolation(快照隔离)的思想，基本思想是为每个事物提供数据库完整副本, 每当事务运行时，会得到一个事务ID， 然后对其进行更改，并以安全的方式放回。
![Pasted image 20250630202459.png|500](/img/user/accessory/Pasted%20image%2020250630202459.png)

Andy曾经做了一项调查，询问众多数据库管理员，数据库系统的默认隔离级别是什么，试试上级就是串行化并不太受欢迎。
![Pasted image 20250630202653.png|500](/img/user/accessory/Pasted%20image%2020250630202653.png)
