---
{"week":"第九周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 17 Virtual Memory：Concepts/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-11T15:36:37.962+08:00","updated":"2025-04-16T09:35:42.717+08:00"}
---

![[17-vm-concepts.pdf]]

### Address spaces
![Pasted image 20250416080539.png|400](/img/user/accessory/Pasted%20image%2020250416080539.png)
再过去 我们一直把Memory看成一个巨大的内存 上面的图是一个展示一个物理寻址的实例 CPU生成了一个有效的物理地址 实际上是一个偏移量
这是非常简单的微控制器工作的方式 但是大多数系统却不是这么工作的
现在的系统虚拟化main memory
虚拟化这个概念是计算机中最重要的概念之一  当虚拟化一个资源的时候 是像用户显示该资源的一些不同类型的视图 可以介入对该资源的访问过程来实现这一点(一个例子就是之前的库打桩 就是介入资源修改了呈现过程)
比如，磁盘在物理上由柱面、磁道、扇区、盘面组成，你必须指定柱面、磁道、盘面来访问其中一个区域。但我们实际看到的磁盘控制器显示的视图是虚拟化的视图。磁盘控制器将磁盘抽象成一系列逻辑块提供给内核。它通过拦截内核的读写请求来呈现这个视图。将内核发送的逻辑块转换为物理地址。
<font color="#f79646">所以抽象 虚拟化就是修改呈现过程</font>
而今天聚焦的是内存的虚拟化
![Pasted image 20250416081341.png|500](/img/user/accessory/Pasted%20image%2020250416081341.png)
内存的虚拟化实际上是由一块称为MMU的内存管理单元的硬件来处理的
CPU生成virtual address 经过 MMU 转换成 Physical Address

why VA？
在此之前 先定义几个术语
- address space 是一个字节地址的集合
- linear address space: 连续的非负整数集合
- virtual address space: 是包含$N=2^n$个虚拟地址的linear address space
- physical address space: 是包含$M=2^m$个物理地址的linear address space

VA通常比PA大很多  PA对应于系统中实际拥有的DRAM容量 而对于该系统上运行的所有process PA相同

so why VM？
- virtual memory使用DRAM作为存储在磁盘上的实际数据的缓存 仅仅将virtual address space中经常使用的一部分实际存储在物理存储器中 -- efficiently
- each process gets the same uniform linear address space -- simplifies memory management.
- protect address

today's agenda: 了解这三个思想

### VM as a tool for caching
存储在磁盘上的虚拟内存的内容管理缓存在DRAM中
像一般的cache一样 分块block 只不过virtual space中的块大得多 -- 叫 page
![Pasted image 20250416082945.png|500](/img/user/accessory/Pasted%20image%2020250416082945.png)
有的page被Cached 有的没有被Cache但存在于disk 有的甚至没有被分配不存在于磁盘中
DRAM是一个缓存 但他的组织形式与之前的缓存非常不同 这种差异是由于未命中的巨大代价所致
block(page)的大小需要权衡
- 要让磁盘中获取数据库的代价分摊下来足够小
- 又不要让数据库过多的占用稀缺的缓存空间

由于之前学到的直接映射可能会受到冲突未命中的影响 增加缓存的关联性 就能减少这些冲突未命中的可能性(比如 二路组相连) 但是加到极致 就是全部相连hhh 就是全相联 所以vitrual memory cache 是全相联的  --  这就需要一个非常复杂的映射函数 需要去跟踪这些cached page页面的位置(因为可能出现在每一个位置) 我们不能简单的做搜索 其实在进行缓存时 就得进行一次搜索(并行搜索)
替换代价大 -- 所以虚拟内存缓存具有比简单的LRU更复杂的替换算法  复杂的算法意味着选择时的运行时间长 -- 但我们选出一个牺牲块所需要的时间远远小于错误的选择所付出的代价
不使用write-through(直接写回法) 而是使用write-back 尽可能使用将写回磁盘的操作推迟

如何跟踪？ -- Page table
内存中的数据结构 由内核维护 是每个进程上下文的一部分(每一个进程都有自己的page table)
页表就是一个页表条目（Page Table Entry，PTE）的数组
![Pasted image 20250416085048.png|500](/img/user/accessory/Pasted%20image%2020250416085048.png)
PTE k 保存的是 DRAM中物理页面k的物理地址
每个 PTE 是由一个有效位（valid bit）和一个 n 位地址字段组成的。有效位表明了该虚拟页当前是否被缓存在 DRAM 中。如果设置了有效位，那么地址字段就表示 DRAM 中相应的物理页的起始位置，这个物理页中缓存了该虚拟页。如果没有设置有效位，那么一个空地址表示这个虚拟页还未被分配。否则，这个地址就指向该虚拟页在磁盘上的起始位置。

page hit
![Pasted image 20250416090331.png|500](/img/user/accessory/Pasted%20image%2020250416090331.png)
CPU发出virtual address -> MMU使用某种方法在page table中找到 -> 如果在physical memory中存在 就返回page table中的地址 -> 命中

page fault
![Pasted image 20250416090519.png|500](/img/user/accessory/Pasted%20image%2020250416090519.png)

触发 page fault exception(缺页异常)
![Pasted image 20250416090655.png|500](/img/user/accessory/Pasted%20image%2020250416090655.png)
这使得控制器转移给内核中称为缺页处理程序的代码 这段代码选择要驱逐的牺牲页 在这个例子中是VP4 
![Pasted image 20250416092539.png|500](/img/user/accessory/Pasted%20image%2020250416092539.png)
VP3被复制到内存中 如果VP4被修改过 就需要写回disk
![Pasted image 20250416092549.png|500](/img/user/accessory/Pasted%20image%2020250416092549.png)
缺页处理程序返回 返回到原来产生错误的指令

分配页面
如果调用了需要分配一大块虚拟地址空间的malloc函数 如果一个页面尚未分配 那么内核或者malloc函数必须通过调用一个名位sbrk的函数来分配该内存
sbrk函数的功能就是更新page table  当这个页面真正正式第一次被访问的时候 才会被放入缓存

看似比较低效 来回复制 但是 任何时候程序都倾向于只访问一组称为工作集的page(时间局部性和空间局部性原理)
- if working set size < main memory size: 能放下所有的page -- good
- if sum(working set size) > main memory size: bad -- 来回复制页面

### VM as a Tool for Memory Management
