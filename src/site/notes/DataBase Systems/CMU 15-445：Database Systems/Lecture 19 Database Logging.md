---
{"tags":["cmu15445"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 19 Database Logging/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-07T16:31:29.312+08:00","updated":"2025-07-09T12:01:29.146+08:00"}
---

### Crash Recovery
![Pasted image 20250709100645.png|500](/img/user/accessory/Pasted%20image%2020250709100645.png)

![Pasted image 20250709100700.png|500](/img/user/accessory/Pasted%20image%2020250709100700.png)
到了COMMIT的时候做什么？
为了确保持久性，我们可以坚持将任何已作出的更改推送磁盘，但是速度非常慢
假设我们拥有其他协议，这些协议在提交时不要求我们将所有内容刷新到磁盘，因为该事务可能设计了上十亿条数据
假设COMMIT的时候停电了, 或者有人意外清除了内存，会发生什么？
我们COMMIT了事务，但是变更只存在于缓冲池中，我们会丢失这些变更

我们需要获取原子性和持久性的组件

**Today's Agenda**
- Failure Classification: 讨论故障发生的原因
- Buffer Pool Policies: 缓冲池策略 -- 正是我们需要采用新技术的原因所在
- Shadow Paging: 一种机制，影子分页，跟踪所做更改 == bad ideas
- Write-Ahead Log: 预写日志，跟踪所做更改
- Logging Schemes: 日志方案, 了解在日志中应记录哪些信息
- Checkpoints: 检查点机制

**Storage Types**
- Volatile Storage
- Non-Volatile Storage
- Stable Storage

之前我们提到易损失性和不易损失性的存储, 在Lecture3就提到了
但是教科书中还提到了一种Stable Storage(稳定性存储), 它基本上能在所有的可能得故障场景中幸存下来，虽然这种理论上的存储并不存在，但我们可以通过所做的每件事进行复制来接近它。
一种提到的方法是复制磁盘，并使用分布式事务协议同步副本，后面的课会讲到，今天不会讲

### Failure Classification
- Type 1: Transaction Failures
- Type 2: System Failures
- Type 3: Storage Media Failures

#### Transcation Failures
事务为什么会失败？
**Logical Errors**
首先可能是因其中存在逻辑错误而失败, 比如我更新了一条数据，完整性约束失败了就会中止事务
**Internal State Erros**
另一种可能是所执行的操作本身没有问题，但与另一个交易发生了死锁
总之，事务可能因多种原因失败，而这些都将纳入我们所讨论的原子性和持久性范畴，因为一个已失败的事务可能已经开始了某些变更操作，我们不得不撤销所有的这些更改

#### System Failures
**SoftWare Failure**
系统可能因软件故障而崩溃，此时部分工作已经完成，但事务尚未提交，或者事务已经提交，变更仍存在缓冲池中
**Hardware Failure**


#### Storage Media Failure
存储介质可能发生故障 比如我们认为数据已经写入磁盘, 但事实上并未成功写入 -- 数据已写入，但哪里的位元发生了损坏
我们需要其他类型的机制与复制一起应对这一问题，
我们假定有其他机制来解决这个问题，所以我们将不再进行讨论


### Observation
作为数据库系统，我们需要确保已提交事务的变更能够安全存入稳定存储，同时避开任何部分变更的残留
有两个关键机制来实现这一点
- Undo(撤销): 即将某些内容放入了稳定存储, 这些更改是一个事务，但由于事务失败或者前面讨论的其他故障，该事务被中止了, 就需要撤销我们的操作
- Redo(重做): 即已提交的事务做的更改仅存在于缓冲池中，但该事务已经提到

### Buffer Pool Policies
![Pasted image 20250709112516.png|500](/img/user/accessory/Pasted%20image%2020250709112516.png)

![Pasted image 20250709112539.png|500](/img/user/accessory/Pasted%20image%2020250709112539.png)

![Pasted image 20250709112557.png|500](/img/user/accessory/Pasted%20image%2020250709112557.png)

如果事务T2提交了，我们该如何处理？
如果我们决定将该页面刷新到磁盘以确保T2的更改持久化, 那我们会携带上T1对A的更改，但T1对A的结果尚未确定
![Pasted image 20250709112826.png|500](/img/user/accessory/Pasted%20image%2020250709112826.png)

会有各种各样的方案，但基本的思想是，因为他们都在同一页上，缓冲池能在页面内移动数据，某一给定页面可能因多个处于不同状态的事务而发生变更，必须确保在此场景下系统正常工作

#### Steal Policy
我们在编写缓冲池时采用了LRU-K策略，而且我们在Project中的K=2, 这为缓冲管理器提供了很多自由 -- LRU-K能够跟踪页面的使用情况，并在需要驱逐时决定何时踢出某些内容。唯一的规定是，如果一个页面被锁定(pin)，即有人正在使用它，就不能被踢出，但如果一个页面未被锁定，那么它可能是脏页，我就可以将其踢出，
为了获得缓冲池的最大性能和空间利用率，意味着即使页面有脏变更，我也允许将其踢出。
Steal Policy允许缓冲池管理器获取未加锁的页面并将其刷新到磁盘，即使页面是脏的，且该脏页所属的事务尚未提交。
所以说，未提交的更改会被写入稳定存储，这在steal策略下是允许的
而No-steal就是说除了锁定的页面，正在运行的事务的页面也没法窃取, 使用no-steal策略, 不仅并发程度低， buffer pool也很快会满 可能会导致死锁

#### Force Policy
提交时刻，我该如何操作的问题
在提交时刻，如果我声明正在提交的事务所做的所有更改必须在提交前强制写入磁盘，我们将获得持久性，但这样的成本会很高，因为可能会有大量的更改需要刷新
Force: 就是上面说的 强加所有的修改都写入
No-Force: 不要这样，寻求一种更高效的提交方式，并以不同的方法应对可能发生的负面情况, 这便是日志记录发挥作用的地方

#### Steal Policy + Force Policy 组合
可以变成一个四象限图了
**No-Steal + Force**
