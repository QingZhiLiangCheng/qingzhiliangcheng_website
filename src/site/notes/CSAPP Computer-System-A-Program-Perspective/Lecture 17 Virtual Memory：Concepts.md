---
{"week":"第九周","dg-publish":true,"tags":[],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 17 Virtual Memory：Concepts/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-11T15:36:37.962+08:00","updated":"2025-04-16T15:10:59.834+08:00"}
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
每个进程都有属于自己的虚拟地址空间 内核通过为每个进程提供自己独立的页表来实现这一点 在进程的上下文中 它是内核中的数据结构 是内核为进程所维护的
每个进程的页表都映射进该进程的虚拟地址空间
有趣的是在虚拟地址空间中连续的页面可以映射到DRAM的任意位置
![Pasted image 20250416140245.png|500](/img/user/accessory/Pasted%20image%2020250416140245.png)
程序员可以认为每个进程都有一个非常相似的虚拟地址空间: 有相同大小的地址空间 代码和数据分别从同一个地址开始  但其实进程使用的页面实际上可能会分散在内存中
不同时刻 相同的虚拟页面可以存储在不同的物理页面中
还有一个非常巧妙的功能: 允许多个虚拟页面映射到同一个物理页面 -- 这是一种使多个进程可以共享某些代码和数据的非常简单直接的方式 -- 这就是C语言共享库的实现方式 lib.c只需要加载到物理内存中一次
这简化了链接Linking: 因为每个program有相同的address space，code, heap等都是开始于从一个address所以直接扔进去就行
这简化了加载Loading: execve查看ELF文件，它知道文件中的代码和数据段有多大。它从固定的地址为代码和数据分配虚拟内存。为它们创建PTE，并把每个PET都置位无效的。这是一个trick。当MMU实际访问代码和数据时，就会碰到缺页异常，然后才把数据和代码拷贝至内存中。这个trick是既简单又有效的（想想程序中有一个很大的数组，实际只有访问到的那部分会分配内存）。

### VM as a tool for memory protection
虚拟地址空间的有些部分是只读的 比如 code section 某些部分只能在内核运行
这是一个x86-64位机器 指针和地址都是64位的
但实际上 真正的虚拟地址空间是48位的 高位全为0或全为1 -- Intel的规则 -- 高位都是1的地址是为内核保留的 高位都是0的地址是为用户代码保留的
所以我们还可以在PTE中设置一些位
- SUP: 用户代码是否可以访问某些虚拟页面 -- 管理页模式
- Read/Write/Execute

![Pasted image 20250416143042.png|500](/img/user/accessory/Pasted%20image%2020250416143042.png)



### VM Address Translation
硬件是如何做地址翻译的：根据虚拟地址的虚拟页号找到PET，再找到PET中的物理页号，将物理页号替换虚拟页号与虚拟页偏移量结合起来，就得到物理地址。
![Pasted image 20250416143257.png|500](/img/user/accessory/Pasted%20image%2020250416143257.png)
![Pasted image 20250416143243.png|500](/img/user/accessory/Pasted%20image%2020250416143243.png)
000...000|000...000
...
000...000|111...111
000...001|000...000 

Page Hit
![Pasted image 20250416144025.png|500](/img/user/accessory/Pasted%20image%2020250416144025.png)
所以即使是页面命中的情况 我们仍然需要访问访存
Page Fault
![Pasted image 20250416144414.png|500](/img/user/accessory/Pasted%20image%2020250416144414.png)

结合高速缓存和虚拟内存
![Pasted image 20250416144654.png|500](/img/user/accessory/Pasted%20image%2020250416144654.png)
页表在内存中，每次访问需要几十几百个周期。即使放在L1缓存，也要1~2个周期。在MMU中有一个关于PTE的小的缓存，称为翻译后备缓冲器（TLB）。它缓存了最近使用的PTE。访问TLB非常快。
TLB使用虚拟地址的VPN部分来访问
![Pasted image 20250416145738.png|500](/img/user/accessory/Pasted%20image%2020250416145738.png)
组相连映射
TLB Hit
![Pasted image 20250416150004.png|500](/img/user/accessory/Pasted%20image%2020250416150004.png)
少访问一次内存
TLB Miss
![Pasted image 20250416150115.png|500](/img/user/accessory/Pasted%20image%2020250416150115.png)
实际上存储整个页表是非常大的  采用了层级结构来压缩
 eg. 2-level page table
 Lecel 1: always memory resident
 Level 2: 大小相同  起始位置存储在Level 1中
 现在通常是四级页表
 ![Pasted image 20250416150616.png|500](/img/user/accessory/Pasted%20image%2020250416150616.png)
![Pasted image 20250416150644.png|500](/img/user/accessory/Pasted%20image%2020250416150644.png)
使用4个页表就覆盖了整个进程的虚拟地址空间。
- 如果一个一级页表是空的，那么二级页表也不会存在。这是一个很大的节约，因为一个典型程序4G的虚拟地址空间的大部分都是未分配的。
- 只有一级页表才需要存放在主存/TLB，虚拟内存系统可以在需要时创建、调入或调出二级页表；且常用的二级页表才需要缓存在主存/TLB。

MMU使用多级页表进行地址转换方式如下:
![Pasted image 20250416151055.png|500](/img/user/accessory/Pasted%20image%2020250416151055.png)
