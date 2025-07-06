---
{"tags":["cmu15445","week11"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 18 Multi-Version Concurrency Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-19T16:18:12.538+08:00","updated":"2025-07-06T15:08:41.832+08:00"}
---

![[18-multiversioning.pdf]]

Multi - Version Concurrency Control 多版本并发控制
最好的理解方式是，它是一个在高层次上有两个组件的协议: 当我改变事物时，我如何管理这些变化？
截止到目前，我们所阐释的是有两种方法可以实现: 一是我将直接在两阶段锁定机制中进行原地更新，该机制之前是隐式的，现在我将获取一个写锁，确保在我进行修改，其他人无法修改。二是在OCC中，操作类似于制作副本，在副本中修改，最终在写入阶段时写入。
现在开始运用这些理念，进而探讨如何将他们融会贯通，并探究在全球数据库中如何实现这一过程。
所有这些工作区检查，核对等操作过于繁琐，我们将使用时间戳等工具，并保留版本链，以便能够来回切换
可以分为两个部分，一方面是我们如何管理版本，即MV部分; 另一方面，CC部分涉及到我们仍然需要类似2PL, OCC等机制以确保两个写者之间不会相互干扰对方的操作

今天我们所探讨的内容，源自于1978年麻省理工的一篇论文，以及背后的庞大历史

MVCC背后的主要思想是什么呢？我们将构建系统，使得写入这不会有效阻塞读者，我们会创建新的版本，因此读者也不会阻塞写者。
将会运用一种snapshot(快照)的概念，快照类似于OCC协议中的检入检出操作时获取的状态。这就像是说，设想我能在每次事物开始时都逻辑上复制一个数据库，注意是逻辑上的，实际上，我得到了一个快照，并可以再次基础上进行操作，所以说别人操作的时候将不会影响最初的内容，仿佛在数据库所做的一切都处于起始阶段，当进行写操作的时候，必须遵循所有这些验证风格的协议，以确定下一个快照需要呈现的样子 这种现象有一个专门的名词叫 snapshot isolation(快照隔离)
**Example 1**
![Pasted image 20250706114826.png|500](/img/user/accessory/Pasted%20image%2020250706114826.png)
这是一个MVCC的例子，有两个事务, 暂时将Database中的值视为一条记录，这个记录的值不会随着事务的执行而改变，而是关联一个时间戳.
这里事务分配的是1和2
图中的Version只是为了让ppt更好理解，本质上是在说"我是记录A，然后是其第0版"
![Pasted image 20250706114901.png|500](/img/user/accessory/Pasted%20image%2020250706114901.png)
Begin, End是起始和结束的时间戳
![Pasted image 20250706114917.png|500](/img/user/accessory/Pasted%20image%2020250706114917.png)
![Pasted image 20250706114934.png|500](/img/user/accessory/Pasted%20image%2020250706114934.png)
ReadA 操作，这里只有一个Version, 所以他会去查看这个Version并表示将检查开始时间戳，并声明自己是1 我可以阅读这个嘛？, 结束时间戳是无穷大, 本质上, 这意味着当前数据库的状态, 即我们所见的快照, 是从过去的某个时刻开始，其值设定为时间零点, 而且就目前而言，它将在未来持续运行……
![Pasted image 20250706141838.png|500](/img/user/accessory/Pasted%20image%2020250706141838.png)
Write A, 实际上它将在同一表中创建该记录的副本,  没有覆盖旧的内容。
![Pasted image 20250706142102.png|500](/img/user/accessory/Pasted%20image%2020250706142102.png)
然后对旧的内容修正，证明它最终停在了2
任何时间戳小于2的事务将读取第一个版本, 所有第时间戳大于2的事务都将访问第二个版本，但是第二个版本还没有完成，当完成的时候，会在其中添加一个结束时间戳
这个就像GitHub上特定文件的历史记录一样，精确指明了什么时间在哪些内容是有效的
![Pasted image 20250706142440.png|500](/img/user/accessory/Pasted%20image%2020250706142440.png)
除此之外, 还需要一些额外的机制，即一个事务表，用于记录该事物的进展情况
假如我要开始读取A1的版本的a的值，我需要知道它是否有效或者已经被提交, 如果commit了 则可以去引用他. 当然随着进展还可能进入终止阶段abort. 
当一个新的事务试图访问这些版本链, 会看到这些范围的开始和结束，这件告诉事务是否允许看到它, 但还需要知道对事务做出更改的内容是否在该范围内，比如End的那个2是已提交的还是未提交的……
![Pasted image 20250706142925.png|500](/img/user/accessory/Pasted%20image%2020250706142925.png)
事务1 Read A, 那么就会去读取旧版本,因为当前事务是1介于0和2之间
因此这个例子实际上 解决了可重复度的问题

因为我们正在从记录的生命周期中划分，随着时间的推移，他将在时刻改变状态, 所以我们始终知道在给定的时间点上我的事务应该读取哪个版本
如果该版本不可见，就必须等待，并且对该对象施加写锁。
所以，版本机制仅仅是一种机制，仍需要拥有并发控制协议防止写入路径冲突

**Example 2**
![Pasted image 20250706143225.png|500](/img/user/accessory/Pasted%20image%2020250706143225.png)

![Pasted image 20250706143606.png|500](/img/user/accessory/Pasted%20image%2020250706143606.png)

![Pasted image 20250706143618.png|500](/img/user/accessory/Pasted%20image%2020250706143618.png)

![Pasted image 20250706143639.png|500](/img/user/accessory/Pasted%20image%2020250706143639.png)

![Pasted image 20250706143652.png|500](/img/user/accessory/Pasted%20image%2020250706143652.png)
T2读取A0版本, 因为T1还没有提交 这是允许的
![Pasted image 20250706144128.png|500](/img/user/accessory/Pasted%20image%2020250706144128.png)
但是T2想写就不被允许, 因为它需要创建版本链中的新条目, 而现在其实T1正在创建新条目
我觉着这里本质上只有一条版本链 T1占着呢 后面可能还会续
其实就像T2想要写入的时候 会检查 结果发现持有锁了
所以说仍然需要锁来保护正在更新的东西和链。 -> 因此MVCC只是维护版本，仍然需要向2PL这样的协议来保护它

![Pasted image 20250706145136.png|500](/img/user/accessory/Pasted%20image%2020250706145136.png)

![Pasted image 20250706145151.png|500](/img/user/accessory/Pasted%20image%2020250706145151.png)

**Snapshot Isolation(SI) 快照隔离**
快照隔离级别比可串行化级别低一级, 缺了一个称为Write Skew Anomaly(写入倾斜异常)的东西，这是除了前面提到过得不可重复读, 脏读, 丢失修改, 幻读等之外另一种需要了解的异常
![Pasted image 20250706150418.png|200](/img/user/accessory/Pasted%20image%2020250706150418.png)
上面的事务想变成white变成black, 下面的事务想把black变成write
使用快照隔离，同时制作一个副本
![Pasted image 20250706150528.png|300](/img/user/accessory/Pasted%20image%2020250706150528.png)

![Pasted image 20250706150549.png|300](/img/user/accessory/Pasted%20image%2020250706150549.png)
当合并回去的时候
![Pasted image 20250706150633.png|500](/img/user/accessory/Pasted%20image%2020250706150633.png)
这显然是错误的，因为这是不可串行化的 按说我们应该在事务2之前得到的是全是黑的，事务2后事全是白的
![Pasted image 20250706150811.png|500](/img/user/accessory/Pasted%20image%2020250706150811.png)
