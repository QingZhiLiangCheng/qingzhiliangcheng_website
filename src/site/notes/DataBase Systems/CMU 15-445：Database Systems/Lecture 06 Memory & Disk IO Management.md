---
{"week":"第四周","dg-publish":true,"tags":["week4","cmu15445"],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 06 Memory & Disk IO Management/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-06T17:44:54.904+08:00","updated":"2025-04-25T19:09:58.522+08:00"}
---


![[06-bufferpool.pdf]]

上节课结束了数据库存储方面的讨论 -- 着重讨论了数据库系统如何在磁盘上表示数据
从这个Lecture开始 主要探讨的是如何从磁盘获取这些页面  并引入内存  并进行相应的处理
我们的目标是拥有一个数据系统 营造出一种错觉 --  我们拥有的内存比实际更多

Lecture 6 要讨论的是 如果从磁盘获取所需的数据页并载入内存 

在磁盘间移动数据 遇到的问题
- 我们的页面写入磁盘的哪个位置？
- 如何才能以一种方式排列  以便最大化IO的量？
- 预取技术？
- 将数据带入内存   何时把数据从内存中驱逐出去？

做这些工作的是 buffer pool management / buffer pool cache  --  一个数据库系统从操作系统中分配并自行控制的内存
![Pasted image 20250207180213.png](/img/user/accessory/Pasted%20image%2020250207180213.png)
![Pasted image 20250207180226.png](/img/user/accessory/Pasted%20image%2020250207180226.png)

每次进入buffer pool的位置可能不同

**today's agenda**
- Buffer Pool Manager
	- 什么是buffer pool manager
	- 优化措施
- Replacement Policies -- buffer pool 替换策略
- Disk I/O Scheduling  磁盘IO调度
- Other Memory Pools 其他内存池

### Buffer Pool Manager
Buffer Pool Manager 事实上就是操作系统 分配的 一块内存空间
我们逻辑上将这块空间分割成固定大小的页面 -- 以page为度量  称为 frame  --  帧
->系统启动 --  malloc -- 获取一部分内存 -- 分成帧
开始请求page的时候  我们将磁盘中的page精确复制到memory  找空闲帧
![Pasted image 20250207181458.png|300](/img/user/accessory/Pasted%20image%2020250207181458.png)
如果我们修改了页面中的内容 并不需要立即放回disk --> Write-Back Cache
这里涉及到了机组上学的 cache的写回法和写直达法 见[[LCU principles of computer composition/高速缓冲存储器\|高速缓冲存储器]]
除此之外会有一个 write-ahead log （预写日志） 会记录我们所做的更改 并且会确保在脏页刷新到磁盘之前 该日志文件已先行刷新至磁盘
Dirty Page(脏页)：Dirty pages are buffered and not written to disk immediately →Write-Back Cache

存在一个内部数据结构 跟踪实际存在于frame中的内容 --  page table 页表 
当然 操作系统也有自己的page table 这里指的是数据库的自己的page table
操作系统的page table 见[[CSAPP Computer-System-A-Program-Perspective/Lecture 17 Virtual Memory：Concepts\|Lecture 17 Virtual Memory：Concepts]] 图片来自CSAPP
![Pasted image 20250425184930.png|500](/img/user/accessory/Pasted%20image%2020250425184930.png)
这里提到的Page Table是数据库系统自己的page table. 通常会使用一个固定大小的哈希表  用于记录所有帧的信息  每个帧通过特定的帧ID进行标识 然后再该页中存储当前页的相关信息 可能是个页面指针 -- 给出page ID   就能 拿到该页面的指针
使用一个latch来保护页表 --  类似于mutex（互斥锁） 允许我们让多个线程或多个工作进程同时访问页表  阻止其他线程？
除了记录页面指针 以及 frame中的信息外    还拥有 additional mete-data per page 额外元数据
- Dirty Flag
- Pin / Reference Counter(引用计数器)  跟踪该页面保持在内存中的workers的数量 -- 在驱逐时 不能被驱逐   就是有一个小计数器 表示 有一个工作进程在访问
- Access Tracking Information

假设来了一个查询 不存在page table中  首先要加锁保护  然后获取所需数据
![Pasted image 20250207191427.png|300](/img/user/accessory/Pasted%20image%2020250207191427.png)
然后再缓冲池更新一个空闲帧 --》 更新页表 --》更新元数据（例如谁访问了页面 最后一次访问时间等等）
![Pasted image 20250207191552.png|300](/img/user/accessory/Pasted%20image%2020250207191552.png)
![Pasted image 20250207191605.png|300](/img/user/accessory/Pasted%20image%2020250207191605.png)
一旦查询完成了对该表所需的更新操作  --  释放锁存器 -- 将工作线程返回到原先的任务重
![Pasted image 20250207191654.png|300](/img/user/accessory/Pasted%20image%2020250207191654.png)
此后 任何寻求第二页的其他工作线程都能在page table中找到

 这里使用的是latch  not  lock
 **locks vs latches**
锁是用来保护数据库中更高层次的概念或对象的 -- table  tuple
保护数据库的逻辑内容免受其他事务的影响 --  我们还没有讨论什么是事务  -- 比如 我们要执行多个更新操作 进行多次往返的SQL查询 -- 如果我对某项资源加锁 我希望在某个事务期间持有该锁 
lecture是低级的内部原语  保护数据库系统的关键部分

**什么是latch -- DeepSeek**
好的，我现在要理解数据库系统中的latch如何保护页表（page table）。首先，我需要明确几个概念：什么是latch，什么是页表，以及它们在数据库系统中的作用。
首先，latch在数据库中通常指的是轻量级的锁机制，用于短时间的同步，确保数据结构在并发访问时的一致性。与操作系统的锁（如mutex）不同，latch通常持有时间更短，用于保护内部数据结构，比如缓冲池中的页表。
页表在操作系统中是用来将虚拟地址映射到物理地址的数据结构，但在数据库系统中，可能指的是缓冲池中的页表，用来跟踪哪些数据页在内存中，它们的状态等信息。缓冲池管理着从磁盘读取的数据页，供事务快速访问，因此页表需要高效且正确地被管理，以避免并发问题，比如多个线程同时修改同一页表项导致的数据不一致。
那问题来了，latch如何保护页表？可能的思路是，当多个线程需要访问或修改页表时，通过获取latch来确保同一时间只有一个线程可以修改页表结构，防止竞态条件。例如，当一个线程要修改页表项的状态（比如标记为脏页），它需要先获取对应的latch，修改完成后释放。其他线程必须等待latch释放后才能继续操作，从而保证操作的原子性。
接下来要考虑的是latch的类型。可能有共享latch和排他latch。**读操作可以获取共享latch，允许多个读并发，而写操作需要排他latch，独占访问**。比如，当读取页表项时，获取共享latch，多个读可以同时进行；当要修改页表项时，必须获得排他latch，此时其他读或写都必须等待。
另外，需要确定页表的粒度。整个页表可能被一个全局的latch保护，但这可能导致性能瓶颈，因为每次访问页表都要竞争这个latch。**另一种方式是对页表进行分片，每个分片有自己的latch，减少竞争**。例如，根据页号哈希到不同的分片，每个分片独立加锁，这样不同页的访问可以并行处理，提高并发性。
实际应用中，比如MySQL的InnoDB缓冲池管理，可能使用了类似的机制。当需要从缓冲池中获取一个页时，会先锁定对应的latch，防止其他线程同时修改该页的控制结构。**例如，当需要置换出一个页时，必须锁定相关的latch，确保在修改页表项时不会被其他操作干扰。**
但是，可能存在的疑问是，latch和锁（lock）的区别。在数据库中，锁通常指事务级别的锁，用于保证ACID属性，比如行锁、表锁，而latch是更底层的保护机制，用于内存数据结构的并发控制，比如保护缓冲池、页表等，两者的作用域和生命周期不同。Latch通常在操作完成后立即释放，而锁可能持续到事务结束。
还需要考虑错误处理，比如获取latch失败时的重试机制，或者死锁检测。但latch通常设计为不会有死锁，或者通过严格的获取顺序来避免。例如，所有线程按固定顺序申请多个latch，或者使用try-latch并在失败时回退操作。
可能遇到的问题包括：如何减少latch竞争以提高性能？**分片是一种方法，但分片的数量需要权衡，过多会增加内存开销，过少可能无法有效降低竞争**。另外，是否所有操作都需要latch？例如，只读操作是否需要获取共享latch，或者是否有无锁的数据结构可用？
还有一个例子是，当页表中某个页被淘汰出去时，需要修改页表项，标记该页为不在内存中，或者更新其位置。这时必须用排他latch来确保这个过程不会被其他线程中断，比如另一个线程同时试图读取该页的内容，导致不一致的状态。
总结的话，latch在数据库系统中保护页表主要是通过提供并发的访问控制，确保页表数据结构的完整性和一致性。通过共享和排他模式，以及分片策略，平衡并发性能和数据安全。

**page table vs  page directory**
- The page directory is the mapping from page ids to page locations in the database files
	All changes must be recorded on disk to allow the DBMS to find on restart.
- The page table is the mapping from page ids to a copy of the page in buffer pool frames
	This is an in-memory data structure that does not need to be stored on disk.

一般情况下 先看page table  当page table没有的话  才会调用磁盘调度机制   从磁盘上获取该页面  放入页表中

**Allocation Policies**
- Global Policies
	- 考虑所有活动事务 找到 分配内存的最佳决策
- Local Policies
	- 它做出的决策将使 单个查询或事务运行更快  即使不利于整个工作负载
	- 本地策略将frame分配给特定事物 而不考虑并发事务的行为

大多数系统 同时使用 Global Policies 和 Local Policies
### Buffer Pool Optimizats
- Multiple Buffer Pools
- Pre-Fetching
- Scan Sharing
- Buffer Pool Bypass

不能说哪种更好   --  大部分数据库系统会选择其中的组合或者大多数

#### Multiple Buffer Pools
前面介绍的实例   只有一个page table  一组frame组成   由于存在多个工作进程同时进行  我们采用了latch 来保护数据结构
而这对于大量CPU核心同时运行大量工作线程的情况  这些latch 将 成为瓶颈
缓解这一点的简单方法就是使用多个缓冲池

仍然分配相同数量的内存 但是分割成大小相等的块  并为每一块创建一个单独的页表
DB2 可以定制  缓冲池管理  --  比如允许哪些表  被 哪个缓冲池管理

使用Multiple Buffer Pool技术的还有 Mysql, Oracle, SQL Server

问题是  在运行时  应该确定哪个缓冲池管理器

example  I have two buffer pool.  123 由 buffer pool1 管理  456由buffer pool2 管理

- Approach 1: Object Id
	![Pasted image 20250210093613.png|400](/img/user/accessory/Pasted%20image%2020250210093613.png)
	SQL Server中还有个Object ID 其实就是像操作系统的内存地址的编址一样 可以分成各种偏移量
- Approach 2: Hashing
	最简单的方法 -- MySQL  对记录id进行哈希处理 调整缓冲池数量
	![Pasted image 20250210093859.png|400](/img/user/accessory/Pasted%20image%2020250210093859.png)
	涉及到 hash的方法  和  处理hash 碰撞的 方法

#### Pre-Fetching
prefetch  --  预取技术
##### Sequential Scans
基本思路是  当运行一个查询时  如果它需要开始访问表中的数据  就会打开一个游标  逐页逐页的扫描
![Pasted image 20250210094548.png|400](/img/user/accessory/Pasted%20image%2020250210094548.png)
现在数据系统可以智能化的判断 --  可能继续读page2 page3  所以在DBMS在处理page1的时候  去获取了page2 page3 放入缓存
![Pasted image 20250210094725.png|400](/img/user/accessory/Pasted%20image%2020250210094725.png)
所以当Q1继续往后  所需要的page2 已经存好了

上面这一部分是操作系统可以推理出来的  他无法做到的是推理出页面物理上所表示的逻辑数据结构 并据此进行预取


##### Index Scans
假设有一个查询
```sql
SELECT * FROM A WHERE val BETWEEN 100 AND 250
```

![Pasted image 20250210101348.png|400](/img/user/accessory/Pasted%20image%2020250210101348.png)
b+树 这里涉及到b+树叶子结点之间有指针
![Pasted image 20250210101457.png](/img/user/accessory/Pasted%20image%2020250210101457.png)
![Pasted image 20250210101516.png](/img/user/accessory/Pasted%20image%2020250210101516.png)

#### scan sharing(synchronized scans)
扫描共享 or 同步扫描
核心思想：当多个查询同时请求访问同一表格时，其中一个查询开始执行，逐页扫描数据，我们能够识别到这些查询所需的数据相同，因此，我们只需要借助已启动查询的扫描结果，实现数据的共享访问
两个游标相连，同时读取相同的页面
扫描共享实际上位于访问方法的较低的物理层级 即如果实际扫描页面 我们能够识别出两个查询需要读取相同的内容 因此 我们可以在检索过程中重复使用任何页面   -》 因此避免了冲突的游标试图同时读取同一页面的情况 ？？
有先后顺序？
DB2, SQL Server, Teradata 和 Postgres 支持非完全相同查询的完整扫描共享
Oracle 仅支持完全相同的查询进行游标共享
![Pasted image 20250213203800.png](/img/user/accessory/Pasted%20image%2020250213203800.png)
Oracle的文档中说明了 这三句其实并不匹配  因为在进行字符串哈希处理时  他们并不相同
Process:
```SQL
SELECT SUM(val) From A
```
![Pasted image 20250213204025.png](/img/user/accessory/Pasted%20image%2020250213204025.png)
查询二出现
```SQL
SELECT AVG(val) From A
```
正常的做法应该是生成游标Q2 然后从page0开始读取  -- but stupid  因为page0 刚刚被移除
更佳的做法 是 将Q2 附加到 Q1上 在扫描表时 再次从最低层级开始  并让Q2随Q1一同遍历到最后  然后Q2意识到 表顶端有一些页面之前遗漏了  然后回去获取那些数据
有什么问题？
如果我想获取前100条数据
```SQL
SELECT AVG(val) From A LIMIT 100
```
由于关系型数据库 是无序的  从理论上来说  这样也是正确的
但是从应用视角来看  比较混乱 -- 因为不同时间点会呈现不同的结果
所以scan sharing的棘手处在于 理解和把握实际意图的语句  进而确定何时安全将一个游标附加到另一个游标上 and 如何在需要时 回溯 获得准确的结果
走向极端的扫描共享 -- continuous scan sharing   连续扫描共享
实际上没有任何系统这么做  但是 思维很有趣
哈哈哈哈哈 一直在动  然后带上 查询 就走
![Pasted image 20250213205238.png|100](/img/user/accessory/Pasted%20image%2020250213205238.png)
![Pasted image 20250213205314.png|100](/img/user/accessory/Pasted%20image%2020250213205314.png)
![Pasted image 20250213205344.png|100](/img/user/accessory/Pasted%20image%2020250213205344.png)
但有一个原型 真的这么做 -- Crescendo  来自 苏黎世联邦理工学院
#### Buffer Pool Bypass
缓冲池旁路
核心：如果我们有一个执行顺序扫描的查询 我们必须从磁盘读取到内存中 但或许我们并不想将其纳入我们的缓冲池
reason 
- 我们必须承担缓冲池的维护成本
- 如果进行顺序扫描  刚刚读取的数据 可能实际上并没有用
与其让不同的工作人员同时顺序扫描 -- 脏页-- 给每个工作人员分配一小块内存 然后将读取的任何页面放入该工作人员的内存中   只读
Oracle, PostgreSQL, SQL Server, Informix都支持  在Informix中叫  Light Scans 轻量扫描
- advantage: 不会污染页表
- disadvantage: 如果两个人要相继访问相同的页面 共享能力会丧失 失去重复利用的可能性
so 权衡

### Replacement Policies 
执行引擎表示 将一个page加载到内存中  并放置于一个 frame 中  若没有空间的frame 就必须要淘汰
需要考虑的指标和目标
	- Correctness: 不希望驱逐一个页面后 该页面立刻成为最常用的对象
	- Accuracy
	- Speed: 不希望使用NP完全算法 或指数级算法
	- Meta-data overhead: 不希望为维护所需的元数据付出高昂的代价

计组 Cache 替换策略 
#### LRU -- Least Recently Used
最近最少使用
核心思路是维护一个时间戳 或 追踪一个链表 记录页面最后一次被访问的时间 打需要驱逐页面时 我们只需要前往链表的末端 并弹出那里的任何内容
访问page1  page1在list中 所以移动
![Pasted image 20250213213214.png|300](/img/user/accessory/Pasted%20image%2020250213213214.png)
![Pasted image 20250213213425.png|300](/img/user/accessory/Pasted%20image%2020250213213425.png)
![Pasted image 20250213213445.png|300](/img/user/accessory/Pasted%20image%2020250213213445.png)

#### Clock
另一种在不跟踪此链表中世纪时间戳的情况下 实现相同效果的方法 是使用一种 clock(时钟)的近似算法
核心思想：不再追踪LRU中页面的精确顺序 而是为每个使用的页面设置一个简单的引用位 用以记录 每当该位置为1时 页面被访问 写入 或 读取的时刻
我们将有一个时钟指针扫过并查看所有的页面  如果位被设置为1  将其设置为0  如果将其设为0  我们会进行驱逐操作
process：
假设 访问page1  设置为1
![Pasted image 20250213214922.png|200](/img/user/accessory/Pasted%20image%2020250213214922.png)
![Pasted image 20250213214945.png|200](/img/user/accessory/Pasted%20image%2020250213214945.png)
接下来 假设一个查询需要访问缓冲池中不存在的页面  开始决定淘汰哪一个
page1 为1 置为0   继续转  page2为0  所以驱逐
![Pasted image 20250213215001.png|200](/img/user/accessory/Pasted%20image%2020250213215001.png)
![Pasted image 20250213215019.png|200](/img/user/accessory/Pasted%20image%2020250213215019.png)
![Pasted image 20250213215039.png|200](/img/user/accessory/Pasted%20image%2020250213215039.png)

假设page4 和page3 都被访问了
![Pasted image 20250425190732.png|200](/img/user/accessory/Pasted%20image%2020250425190732.png)
![Pasted image 20250213215444.png|200](/img/user/accessory/Pasted%20image%2020250213215444.png)

**good idea or bad idea？**
LRU和Clock 都存在的缺点  
- 没有跟踪被访问的频率  即那些页面被访问了

在两种情况下  容易遭受  sequential flooding(顺序洪泛)的问题
be like
![Pasted image 20250213215957.png|300](/img/user/accessory/Pasted%20image%2020250213215957.png)
![Pasted image 20250213220020.png|300](/img/user/accessory/Pasted%20image%2020250213220020.png)
so bad

#### Better Policies LRU-K
解决方案被称为 LRU-K
思路是 记录一个页面被访问的最后k次
当决定要驱逐的时候  k次访问的间隔
大多数系统实现这个  通常会记录 最近 两次的情况
question: 我尚未进行两次访问  立即被驱逐 但假设该页实际上是热页  我希望将其保存在内存中
解决这个问题的方法是  维护一个内存中的哈希表 用来记录以下信息
- 这是我最近从磁盘上置换出去的几页
- 他们被访问的时间戳

当我在页面刚被移除后再次检索它时  我至少对其历史有所了解  不会默认为无限大
SQL Server和Postgre真正实现了这一点

#### MySQL Approximate LRU-K
MySQL并没有完全采用LRUK算法  而是采用了一种近似的方法
他们实现这一功能的方式是逻辑上划分LRU页面列表的链表
包含两个区 -young List  -old List
对于两个不同区域中的每一个  将拥有一个不同的头指针 指示着新条目插入的位置
![Pasted image 20250214134858.png|400](/img/user/accessory/Pasted%20image%2020250214134858.png)
假设有一个query  要访问page1
新页面  被插入 the head of the old list
![Pasted image 20250214135112.png|500](/img/user/accessory/Pasted%20image%2020250214135112.png)
![Pasted image 20250214135133.png|500](/img/user/accessory/Pasted%20image%2020250214135133.png)

如果在old list中的页面 不被访问  会逐渐移至链表末尾  随后被淘汰
如果再次被访问  会放入the head of the young list 然后把最后一个 挤进 old list
![Pasted image 20250214135357.png|500](/img/user/accessory/Pasted%20image%2020250214135357.png)
![Pasted image 20250214135413.png|500](/img/user/accessory/Pasted%20image%2020250214135413.png)

#### Better Policies: localization
SQL Server 实现了 一系列优化 这些优化能追踪何时 如何 以及谁访问或引用了某个数据页，这可以确定 是否一次访问计数为一个不同的引用  是否应该更新间隔
for example  在更新你的账户信息的时候 假设处于某种原因  那个事务对记录跟新了两次 SQL Server视为一次  但 Postgre视为两次
Localization 本地化策略
其核心思想是基于每个查询来决定哪些页面应该被驱逐出缓冲池，目的是最小化每个查询对缓冲池造成的“污染”，即避免某个查询加载的页面过多地占据缓冲池，影响其他查询的性能。
系统需要记录一个查询已经访问了哪些页面。这样做可以帮助系统更好地做出决策，比如优先保留那些频繁访问的页面，或者在需要腾出空间时优先考虑移除那些只被当前查询短期使用的页面
**Postgres的做法**：文中提到的例子指出，PostgreSQL数据库维护了一个小型的循环缓冲区（ring buffer），这个缓冲区是特定查询私有的。这意味着每个查询都有自己独立的一块小缓冲区来追踪它访问过的页面信息。循环缓冲区的设计有助于高效地管理和更新这些信息，而不需要消耗太多的额外资源

#### Better Policies: Priority Hints
优先级提示
- **页面上下文的理解**：DBMS能够识别并理解在查询执行过程中每个页面的角色和重要性。例如，某些页面可能因为频繁被访问或对事务完成至关重要而被认为更加重要。
- **提供优先级提示**：基于上述理解，DBMS可以为缓冲池提供指示，指出哪些页面应当被视为高优先级，意味着它们应该较少被驱逐出缓冲池；反之，低优先级的页面则可以在需要空间时优先考虑移除
这种机制使得缓冲池管理不再仅仅是基于简单的LRU（最近最少使用）等算法，而是可以根据实际查询需求动态调整页面的优先级。
example
如果有一个多页的索引   并且收到的查询总是会插入新纪录 这些记录仅增加索引所基于的值的大小  那么我知道 我始终命中树的右侧
![Pasted image 20250214141052.png](/img/user/accessory/Pasted%20image%2020250214141052.png)


#### Challenge: is whether they're dirty page
最简单的方法是  如果我所有的页面都是干净的  从缓冲池中驱逐他们就是什么都不做 只需要将页面引用放入page table中 -- 覆盖之前的内容
如果所有页面都已经修改 或者想换出的页面已经被修改  就必须写入disk 确保其持久性和安全性
实际上在刷新包含日志引用的脏页之前  必须确保日志记录先刷到disk
是否需要违背LRU呢  因为 写回慢 
避免这一问题的一种方法是 -- 想要访问某一页时 不使写操作处于关键路径上 -- **Background writing**
在后台运行一个单独的线程  定期遍历页表 并确保日志写入磁盘
-》 当安全写入脏页后 就可以驱逐该页 或者 取消dirty 标志

### Disk I/O Scheduling 
在磁盘写入和读取时  实际上如何实现这一操作？
当我们向文件系统发出读写调用时 假设我们是在文件系统上运行 而非原始分区  我们的数据系统之下有一系列层次   如操作系统 文件系统 硬件 ， 这些层级会巧妙地尝试通过重新排序和批处理处理IO请求，以明显最大化其能达到的带宽
现代磁盘驱动器 固态硬盘(SSD)，非易失性内存快速驱动器 之所以迅速 部分原因在于拥有长队列 并能执行并行请求
Challenge在于 数据系统之下的这些层次 并不知道实际上对应的是什么 他们只收到 读取写入某个位置的页面和命令
大多数数据库 都建议放弃Linux调度器    使用FIFO策略   -- Oracle,Vertica, MySQL
所以大多数数据系统会有一个自己的小型适配层 -- 跟踪哪些读写请求尚未完成 并从缓冲池管理器中获取  同时决定如何取消这些请求以优化性能

Compute priority based on several factors
- Sequential vs. Random IO
- Critical Path Task vs. Background Task
- Table vs. Index vs. Log vs. Ephemeral Data
- Transaction Information
- User-based SLAs

所以为了获得更好的性能 我们采用 **direct I/O**的方式
对于大部分磁盘操作  你都需要通过操作系统API进行
我们不希望操作系统维护自己的缓存  不希望操作系统对我们的读写进行缓冲

如果我在文件系统进行读取  操作系统会 在所有运行的进程中维护自己的小型缓冲池 但我们希望绕过page Cache
![Pasted image 20250214143931.png|200](/img/user/accessory/Pasted%20image%2020250214143931.png)
Postgre不这么做 因为 太早了 数据库
- fwrite   其实是写入了page cache   OS决定什么时候刷新
- fsync    阻塞 直到硬件返回并告知 数据已经持久化
- 哈哈哈哈哈 fsync error

### Other Memory Pools
Sorting+Join Buffers：缓存住热点的数据
Query Cache：执行结果的缓存
Maintenance Buffers：维护缓存：查询缓存前提是数据没后发生变化
Log Buffers：日志缓存，记录操作日志（读写磁盘代价很高，经常会记录一个中间状态）
Dictionary Cache：字典缓存

![[06-bufferpool node.pdf]]