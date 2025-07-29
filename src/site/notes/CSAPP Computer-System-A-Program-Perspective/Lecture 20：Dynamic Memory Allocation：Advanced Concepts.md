---
{"tags":["csapp"],"dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 20：Dynamic Memory Allocation：Advanced Concepts/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-28T20:31:56.667+08:00","updated":"2025-07-29T12:27:23.147+08:00"}
---

![[20-malloc-advanced.pdf]]

今天将聚焦于主要用于存储空闲列表的不同数据结构，我们将看一下隐式分配器，对垃圾收集器的方式进行简要学习
### Explicit Free Lists
有关Explicit Free Lists的想法见[[CSAPP Computer-System-A-Program-Perspective/Lecture 19 Dynamic Memory Allocation：Basic Concepts#Basic Topics of Dynamic Memory Allocation\|Lecture 19 Dynamic Memory Allocation：Basic Concepts#Basic Topics of Dynamic Memory Allocation]]，总之核心思想是追踪空闲内存块，与implicit list不同，它只追踪了空闲块
![Pasted image 20250729112552.png|500](/img/user/accessory/Pasted%20image%2020250729112552.png)
Explicit Free List的关键在于在空闲块的区域中保存了前后指针，next/prev，这些指针将空闲块组成成了一个双向链表
![Pasted image 20250729112815.png|500](/img/user/accessory/Pasted%20image%2020250729112815.png)
这里应该是做了个排序了吧，这个链表的每个节点会散落在内存中的各个地方
分配
![Pasted image 20250729115213.png|500](/img/user/accessory/Pasted%20image%2020250729115213.png)
释放 合并
当我们调用free释放一个内存块后，空闲块需要被插入到空闲链表中，把它插在哪 有两种策略
- LIFO -- 将新释放的块插入到空闲链表的头部
	- 实现简单 只需要更新头指针和新块的next/prev
	- 但可能会导致内存碎片化严重
- Address-Ordered -- 按地址排序，将新释放的块插入空闲链表中使得链表中快按内存地址升序排列
	- 更容易出发合并，碎片更少
	- 遍历整个链表

Freeding With a LIFO Policy Case 1
![Pasted image 20250729120715.png|500](/img/user/accessory/Pasted%20image%2020250729120715.png)
Freeding With a LIFO Policy Case 2
![Pasted image 20250729120753.png|500](/img/user/accessory/Pasted%20image%2020250729120753.png)
Freeding With a LIFO Policy Case 3
![Pasted image 20250729121047.png|500](/img/user/accessory/Pasted%20image%2020250729121047.png)

Freeding With a LIFO Policy Case 4
![Pasted image 20250729121519.png|500](/img/user/accessory/Pasted%20image%2020250729121519.png)

不过这个算法的核心就是头插法，free后的那个快一定要在最前面，我们完全可以合并之后让他在链表上那个地方不懂

### Segregated Free Lists
Segregated Free List的想法是每个尺寸的块都有自己大小的列表，但也存在可以规定一些范围的情况
![Pasted image 20250729121949.png|500](/img/user/accessory/Pasted%20image%2020250729121949.png)

分配
假设要分配一个大小为n的块，从对应的size class list开始找，也就是说从 `list[n]` 开始，找一个大小大于等于 `n` 的块 `m`，如果找到了，如果块m比n大，就需要拆分，然后将剩余部分放回对应的空闲链表，如果找不到就需要`list[n+1]`往后找，如果所有size class list都没有合适的块，就要使用 `sbrk()` 或 `mmap()` 向操作系统申请一段新的堆内存
释放
释放也很快，只需要释放合并之后放到对应的链表中
Seglist Allocator是讲到目前为止最好的allocator, 它提供了吞吐量上的进步和内存利用率方面的改进，因为他们不是整个链表引入搜索，而是每次都从大小相近的链表找
经典的 分类分的好 找的就快