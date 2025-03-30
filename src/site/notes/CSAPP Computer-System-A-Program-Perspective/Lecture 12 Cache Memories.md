---
{"week":"第六周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 12 Cache Memories/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-19T16:46:34.597+08:00","updated":"2025-03-30T15:03:14.638+08:00"}
---

![[12-cache-memories.pdf]]

this lecture: cache memories
- Cache memory organization and operation
- Performance impact of caches
	- The memory mountain
	- Rearranging loops to improve spatial locality
	- Using blocking to improve temporal locality
### Cache memory organization and operation
![Pasted image 20250319165141.png|500](/img/user/accessory/Pasted%20image%2020250319165141.png)

**Cache Memories**
In CPU chip
fast SRAM-based memories
CPU looks first for data in cache -- 由于局部性原理  大多数数据都会命中
完全由硬件管理
所以关键在于 硬件如何查找缓存中的块 并确定是否包含特定块
![Pasted image 20250319165812.png|500](/img/user/accessory/Pasted%20image%2020250319165812.png)
set -- line -- { data, tag, valid}
valid bit: 有效位 -- 指示这些数据位和数据库实际上是存在的   我们刚打开计算机的时候后面的data 会是一些乱七八糟随机的数字  valid bit就是告诉我们 这些 字节 到底是不是我们存的数据
tag: 标记位 -- 帮助快速搜寻快
cache size

**Cache Read**
![Pasted image 20250319170941.png|500](/img/user/accessory/Pasted%20image%2020250319170941.png)
整个address的长度就是word size的长度  -- 比如现在都是64位机器
首先查询set index 获取到set -- set index是个unsigned integer
然后查看tag 从 sets中找到 lines
当找到了tag 而且 valid bit为1 就说明命中了
b是block里面的偏移量

example  Direct Mapped Cache
One line per set
![Pasted image 20250319171226.png|500](/img/user/accessory/Pasted%20image%2020250319171226.png)
![Pasted image 20250319171235.png|400](/img/user/accessory/Pasted%20image%2020250319171235.png)
![Pasted image 20250319171256.png|400](/img/user/accessory/Pasted%20image%2020250319171256.png)

**Direct-Mapped Cache Simulation**
![Pasted image 20250319194404.png|400](/img/user/accessory/Pasted%20image%2020250319194404.png)
这里好好理解一下

在倒数第二个的时候刚把0000扔出去了  然后最后一步又取0000的时候就错过了 -- 错过的唯一原因是 我们每个组只有一行
但还是有两个空的 -- 我们的cache足够大 -- 但缓存关联性低

**E-way Set Associative Cache**
![Pasted image 20250319195510.png|500](/img/user/accessory/Pasted%20image%2020250319195510.png)
![Pasted image 20250319195646.png|500](/img/user/accessory/Pasted%20image%2020250319195646.png)
example
![Pasted image 20250319200154.png|500](/img/user/accessory/Pasted%20image%2020250319200154.png)
这里说一下哈  是先有的block size  然后确定关联性等  就知道了Cache有多大


**Writes**
- Write-through: write immediately to memory.
- Write-back: 直到被替换的时候 -- 才写回

**Write-Miss**
写入缺失（write-miss）是指在计算机系统执行写操作时，尝试写入的数据所在的内存块当前并不在缓存（Cache）中的一种情况。简而言之，就是当处理器试图更新或修改某个数据项，而该数据项不在缓存里时发生的事件
- Write-allocate: 先把数据加载到Cache -- 然后更新
- No-Write-Allocate: 直接写入内存（或许如果不接着访问这种会更好一点）
需要权衡

一般Write-through + no-write-allocate
write-back + write-allocate

**Intel Core i7 Cache Hierarchy**
![Pasted image 20250319202326.png|500](/img/user/accessory/Pasted%20image%2020250319202326.png)
现代cpu包含多个cache
d-cache -- 数据缓存
i-cache -- 指令缓存
L1和L2 8-way 都在core内
L3 16-way 所有core共享
L1未命中 -- 尝试向L2发请求 在L2中查找数据 -- L3 -- main memory

**Cache Performance Metrics**
未命中率
命中时间


命中率增加2%  时间减小了两倍

**Writing Cache Friendly Code**
focus on the inner loops of the core functions.
减少inner loops中的未命中
比如说局部变量 编译器可以放到register中  但是全局变量 编译器没法放到register中
比如 逐元素访问数组


### Performance impact of caches
缓存对代码的性能影响
**The memory  mountain**
CMU的一个人提出来的存储器山
提到了一种 Read throught -- 吞吐量 or  read bandwidth 读带宽  的 衡量标准：
读吞吐量：表示每秒从存储系统中读取的字节数(MB/s)

Memory Mountain是一种用于展示内存系统性能的可视化表示方法，特别是针对读取吞吐量（read throughput）如何依赖于空间局部性（spatial locality）和时间局部性（temporal locality）
Memory Mountain通过构建一个三维图形，其中两个轴分别代表空间局部性和时间局部性，而第三个轴则代表对应的读取吞吐量，来直观地展示这些局部性对内存系统性能的影响。不同的点或区域在这个mountain上的高度反映了不同类型的内存访问模式下的性能好坏

![Pasted image 20250320082125.png|500](/img/user/accessory/Pasted%20image%2020250320082125.png)



![Pasted image 20250320083125.png|500](/img/user/accessory/Pasted%20image%2020250320083125.png)
`注：这个图是先暖好身的，已经跑过一遍后，第二次跑时的数据` 1.固定Size不变<=32K(L1 cache的容量)时，当Stride增加时，吞吐量几乎不变，因为所有数据都在L1 cache中了，每次都是命中的。 2.固定Size不变>32K时，由于只有一部分存在L1 cache中了，Size越大的越在难存在缓存中，所以出现了空间局部性的斜坡. 3.固定步长不变，可以看到当元素总数量 **工作集<=32KB**时，读吞吐量几乎不变，因为所有数据都在L1 cache中，每次都命中。 **工作集尺寸比32KB大一点且小于256KB时**，由于读吞吐量受从.L2 cache读数据的比例增加而急剧下降，所以有了个悬崖。接近32+256KB时，由于速度基本被L2的速度给拉了，基本上就保持L2 cache的读速度了。 **工作集尺寸比256KB大一点，小于8MB**时，同样的道理有个悬崖，后面基本就保持L3 cache 的读速度了 **工作集尺寸大于8MB**，由于L3也存不下了，只能从主存中读，所以读速度又迅速下降，尺寸再大就基本保持主存的读取速度。

当工作集太大，不能装进任何一个高速缓存时，主存山脊的最高点(步长=1)也比他的最低点高8倍.所以，`即使当程序的时间局部性很差，空间局部性依然能补救，并且他是非常重要的`。

这里自己画了一个Memory Mountain 玩 见[[CSAPP Computer-System-A-Program-Perspective/lab Memory Mountain\|lab Memory Mountain]]

**Rearranging loops to improve spatial locality**
重新排列循环来改善性能 -- 改善的空间局部性
以一个矩阵乘法为例
![Pasted image 20250320192214.png|300](/img/user/accessory/Pasted%20image%2020250320192214.png)
事实上 i j k 这三个循环 可以置换为任何 六种组合中的一种
![Pasted image 20250320192520.png|350](/img/user/accessory/Pasted%20image%2020250320192520.png)

assume: block size = 32B
![Pasted image 20250320194536.png|400](/img/user/accessory/Pasted%20image%2020250320194536.png)
数组是行存储的
A是以行为单位来读取的 一行可以摆在一个block中  -- 第一次未命中 二三四次命中
B是列为单位来读取的 --  一直不命中
C不在内循环中 -- 忽略

![Pasted image 20250320195204.png|400](/img/user/accessory/Pasted%20image%2020250320195204.png)
都是横着读 -- 只看复杂度最高的那句话  j在i的内循环  j在k的内循环

![Pasted image 20250320195338.png|400](/img/user/accessory/Pasted%20image%2020250320195338.png)
最好的事kij 但是有一个可能 因为kij创造了 一个变量 需要写入一个值
在任何类型的存储系统中都证明了这一点  read比write快
但在这里 write没有影响到
![Pasted image 20250320195414.png|400](/img/user/accessory/Pasted%20image%2020250320195414.png)

**Using blocking to impact temporal locality**
如何改善时间局部性
改善时间局部性 -- need a technique called blocking
![Pasted image 20250320201447.png|500](/img/user/accessory/Pasted%20image%2020250320201447.png)
原来我们没有阻塞的矩阵乘法  假设Cache block = 8 doubles  第一个矩阵中那么没八个里面就会有一个未命中  第二个矩阵中n个都会未命中
n/8 + n
如果是方阵  就是(n/8+n) * n

考虑矩阵分块进行优化
如果把整个快一起来看的话 跟原始情况完全类似
但算快内的乘法的时候 简单了
![Pasted image 20250320202548.png|500](/img/user/accessory/Pasted%20image%2020250320202548.png)
对于每个block中 共$B^2$个元素 每8个一次未命中 -- 所以是 $\frac{B^2}{8}$
由于语句是`C[]=A[]+B[]` 忽略C中的block  A和B每一行或者列都有$\frac{n}{B}$个block
所以是$\frac{2n}{B} \times \frac{B^2}{8} = \frac{nB}{4}$
一共迭代$n^2$次 --  所以未命中次数的总数是$\frac{n^3}{4B}$

![Pasted image 20250320211100.png|500](/img/user/accessory/Pasted%20image%2020250320211100.png)






