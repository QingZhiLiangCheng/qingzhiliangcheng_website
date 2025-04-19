---
{"week":"第五周","dg-publish":true,"tags":["week5","cmu15445"],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 09 Index Concurrency Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-06T17:46:26.149+08:00","updated":"2025-04-19T09:54:50.920+08:00"}
---


![[09-indexconcurrency.pdf]]

在之前我们讨论了hash table 和 b+tree等内容    为了简化讨论  清晰的解释数据结构以及用于交互和操作的算法 -- 假设系统是单线程的
但事实上 在当今硬件上的任何现代系统中 都需要支持多个线程和多个工作进程同时运行

如果尝试使用worker这个词  既可以表示process(进程)  也可以表示  thread(线程)
大多数现代系统 moden system都是多线程的  但核心思想都是一致的

今天的gole: 数据结构实现线程安全

大多数database system都支持lecture 09 所讨论的内容
有一个非常著名的是redis  -- 单线程  单进程的数据库系统

**concurrency control**
我们将采取一种coucurrency control protocol(并发控制协议) 确保线程和工作进程按照特定方式运行 -- 从而避免数据损坏和无效数据结构的产生

我们可以将当前的程序协议视为系统中的交通指挥官 -- 允许在特定时间告诉不同的worker 谁被允许做什么
这一理念在于 他们将操作于某个共享对象或临界区 --不希望互相干扰并引发问题
可能遇到的问题
**Logical Correctness** -- 逻辑正确性
**Physical Correctness** -- 物理正确性

**Today‘s agenda**
- Latches Overview
- Hash Table Latching
- B+Tree Latching
- Leaf Node Scans

### Latches Overview
![Pasted image 20250225161257.png|500](/img/user/accessory/Pasted%20image%2020250225161257.png)

lock(锁) 是数据库系统中的高级保护**原语**--能够保护数据库的逻辑内容，tuple, database, table   当在一个实例中获取lock的时候 -- 将在整个事务期间都持有该锁 -- 但其实可以提前释放锁 今天不讨论
然后再并发协议内部 会有一些更高级别的机制  这些机制确保我们不会出现任何死锁情况
如果发生死锁 其实数据库存在一种机制 能够回滚事务所做的更改

latches 成为 保护数据结构 from one worker against another
持有latch的时间将持续非常短暂
尽量减少latch所做的bookkeeping(簿记工作量)
 关于Latches的Bookkeeping
- **获取和释放**：每次获取（lock）和释放（unlock）latch都是一种簿记活动。理想情况下，这个过程应该是轻量级的，以减少对性能的影响。
- **持有时间短暂**：正如你提到的，持有latch的时间应该尽可能短，目的是最小化其他线程等待获取相同latch的时间，从而提高并发性并降低延迟。
- **尽量减少簿记工作量**：这意味着在设计latch机制时，应尽量简化与之相关的所有操作，比如记录谁持有了latch、管理等待队列等。通过优化这些操作，可以减少额外开销，并避免成为性能瓶颈。
例如，在高并发环境中，如果一个线程长时间持有latch进行大量复杂的簿记操作，则可能导致其他需要访问相同资源的线程长时间等待，进而影响整体系统性能

![Pasted image 20250225163419.png|500](/img/user/accessory/Pasted%20image%2020250225163419.png)
这张图对比了数据库系统中两种并发控制机制——锁（Locks）和闩（Latches）的核心区别：
**锁（Locks）​**
1. ​**作用对象**​
    - 服务于**事务（Transactions）​**​
    - 保护**数据库内容**​（如表、行、页）
2. ​**行为特性**​
    - 管理**整个事务周期**的并发访问
    - 支持多种模式：共享锁（Shared）、独占锁（Exclusive）、更新锁（Update）、意图锁（Intention）
    - 通过**锁管理器**集中管理，支持死锁检测与解决（Deadlock Detection & Resolution）
    - 允许事务等待锁释放（如通过等待队列或超时机制）

### ​**闩（Latches）​**
1. ​**作用对象**​
    - 服务于**线程/进程**​（Workers）
    - 保护**内存中的数据结构**​（如缓存页、索引结构）
2. ​**行为特性**​
    - 控制**临界区（Critical Sections）​**的短期独占访问
    - 模式简单：读/写闩（Read/Write）
    - ​**无死锁处理机制**，依赖编码规范避免死锁（如固定加锁顺序）
    - 直接嵌入受保护的数据结构，轻量级且快速释放

**Latch Modes**
Mode1: Read Mode
在读模式下  存在一些操作 允许多个工作线程同时获取latch 因为无论他们在执行什么不同的操作  都是读  不会破坏数据结构 或 引发任何冲突
Mode2: Write Mode
独占
当一个线程需要访问对象并进行更改时 不希望其他任何线程同时操作我的对象
![Pasted image 20250225164708.png|300](/img/user/accessory/Pasted%20image%2020250225164708.png)

不要把任何latch都设置为write mode -- it's stupid -- 因为就类似变成单线程了

**how to implement latches?**
**goals**
- 内存占用小: 因为不希望latch 存储大量额外的元数据
- 理想情况下  我们希望在系统中没有争用时 能够以最快的速度运行，同时保持最小开销  如果无法获取latch -- 需要决策  应该等多久 -- 怎么等    
- 往往我们也不希望每个latch上存储大量元数据来记录谁正在等待latch -- 因为这实质上是为数据结构中的可能的latch 设置了一个序列queue        想象一下  一个很大很大的b+树  每个任务都会有自己的优先队列

**latches implementation**
基本的三种方法
- Test-and-Set Spinlock
- Blocking OS Mutex
- Reader-Writer Locks
更高级的
- Adaptive Spinlock(Apple ParkingLot) [Locking in WebKit | WebKit](https://webkit.org/blog/6161/locking-in-webkit/)
- Queue-based Spinlock(MCS Locks) [MCS locks and qspinlocks [LWN.net]](https://lwn.net/Articles/590243/)

**Approach1: Test-and-Set Spn Latch(TAS)**
测试并设置自旋锁 --  简称 自旋锁
最简单的一种方法 -- 因为实质上是一个64bit的内存地址
你只需对其执行原子比较交换操作 查看能否设置它  若无法设置   进行自旋并持续尝试设置  反复进行
![Pasted image 20250225191957.png|300](/img/user/accessory/Pasted%20image%2020250225191957.png)
由于我们在数据库层面和用户空间进行操作 -- 我们可以决定是否以及尝试重试的次数 是否让线程让渡给操作系统 或者自行中止并重新启动

假设我有一个双插槽CPU 我们试图获取的latch为了NUMA区域
NUMA non-uniform memory access 非均匀内存访问
基本上如果CPU中有两个插槽 或者主板上有更多插槽 -- 每个CPU插槽都会配备靠近它的DRAM 速度很快  同时可以与位于另一插槽上的内存进行通信  称其为NUMA区域 但这种传输速度慢 因为需要通过连接 连接到另一个插槽
如果在这个CPU上运行的worker想获取位于另一个插槽的cpu内存中的latch 因此重复尝试  但现在所有这些通过互连线路的通信流量将会拖慢整个数据库的速度
![Pasted image 20250225193039.png|100](/img/user/accessory/Pasted%20image%2020250225193039.png)

​**TAS 自旋锁的核心机制**
1. ​**原子操作**​  
    通过原子指令（如 `CAS`、`Test-and-Set`）直接操作一个内存地址（如 64 位变量），尝试“测试并设置”锁的状态：
    - ​**成功**：获得锁，进入临界区。
    - ​**失败**：自旋（循环重试）或退让（如让出 CPU、短暂休眠）。
2. ​**用户态控制**​  
    在数据库等用户态程序中，可自定义自旋策略（如重试次数、是否主动退让），避免内核态切换的开销。
​**NUMA 架构下的性能问题**
在 ​**双插槽 CPU**​ 的 NUMA 环境中，内存分为多个节点（Node），每个 CPU 插槽优先访问其本地内存（Local Memory），而跨插槽访问远程内存（Remote Memory）需通过 ​**CPU 互连（如 Intel QPI、AMD Infinity Fabric）​**，导致以下问题：
1. ​**跨节点访问延迟高**​
    - 若锁变量位于 ​**远程内存**​（如 CPU1 的本地内存），则 CPU0 的线程每次尝试 `CAS` 操作时，需通过互连链路访问远程内存，**延迟显著增加**​（可能数倍于本地内存访问）。
    - 自旋锁的频繁重试会放大这一问题，导致线程长时间等待。
2. ​**互连带宽争用**​
    - 大量跨节点 `CAS` 操作会占用互连链路带宽，影响其他线程的正常内存访问（如数据页读写），导致系统整体吞吐下降。
3. ​**缓存失效与一致性开销**​
    - 锁变量在多个 CPU 缓存间频繁失效（因原子操作需保证缓存一致性），引发 ​**缓存行同步（Cache Coherency）​**​ 开销，进一步降低效率。

**Approach2: Blocking OS Mutex**
阻塞互斥锁
simple to use
它使用c++构建的  只需要  获取 释放
example: std::mutex
这是standard C++ library 所提供的一个互斥锁类 -- 保护共享数据不被多个线程共同访问
其实在Project1 我已经使用过了  使用方法很简单
使用时只需要调用`lock()`获取锁，使用完后调用`unlock()`释放锁。此外，还可以使用RAII风格的`std::lock_guard`或`std::unique_lock`来自动管理锁的获取和释放。
我当时做project1 应该是用的RAII风格的
![Pasted image 20250304161906.png|500](/img/user/accessory/Pasted%20image%2020250304161906.png)
mutex的底层  在 Linux中 std::mutex 依赖于 pthread_mutex (互斥锁)
互斥锁在linux中是通过futex实现的  --  fast user space mutex(快速用户空间互斥锁)
所以整个的工作过程是  首先采用自旋锁  首先会进行几次快速的检查(自旋)  如果获取资源仍未成功  -- 进入内核态  挂起 直到锁可用为止
所以一旦进入内核态 就涉及到操作系统了  就会变得很慢了 系统调用开销大

**Approach3: Reader-Write Latches**
前面提到的两种latch 并没有涉及到模式
如果想使用read或者write模式的latch  可以 使用 std::shared_mutex
其的层是 pthread_rwlock
工作原理  latch本身拥有自己的优先级队列和计数器 用于跟踪等待的线程数量
![Pasted image 20250304164720.png|400](/img/user/accessory/Pasted%20image%2020250304164720.png)
在这个例子中  来的顺序依次是read read write read
我们可以设置一些策略
在cpp中 应该是在用户空间进行了这些操作  而不是在内核层级

### Hash Table Latching
