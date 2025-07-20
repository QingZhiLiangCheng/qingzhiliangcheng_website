---
{"tags":["csapp"],"dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 19 Dynamic Memory Allocation：Basic Concepts/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-20T18:32:46.730+08:00","updated":"2025-07-20T20:16:31.089+08:00"}
---


![[19-malloc-basic.pdf]]

之前的Lecture讲到了虚拟内存，虚拟内存是一种巨大的抽象，a lots of bytes, 那么我们需要一定的机制来管理和使用它，这就是未来两个Lecture的主题: dynamic memory allocation, 分配的基本原理？如何使用它们来管理系统中的虚拟内存？

### Basic Topics of Dynamic Memory Allocation
应用程序使用Dynamic Memory Allocator(动态存储器分配器)去操纵虚拟内存，去构造、分配以及释放程序所需要的虚拟内存，他们是一个动态变化的内存空间。这个空间在称为heap的区域被维护。
所有的语言都有一些用来分配和操纵动态变化的内存空间的方法，比如在C语言中使用的是malloc的方式，而在java, C++中有new方法
allocator将heap视为不同大小的内存块组成的集合，这些内存块要么是allocated(分配)的，要么是free(空闲)的，分配意味着已经有应用程序占用，而空闲意味着待分配给应用程序
allocator有两种:
- 一种是我们在C语言中用到的malloc的那种分配器，这种分配器应用程序将会决定是否显式分配内存并在用完之后决定是否显式释放内存，换句话说就是程序员在写程序的时候手动申请(malloc) 和释放内存(free)，系统不会释放分配的任何内存，这种分配器叫Explicit Allocator(显示分配器)
- 但在很多别的语言中，都存在Implicit Allocator(隐式分配器), 程序员只需要申请内存，不需要手动释放，释放工作由系统自动完成，比如在Java中就存在Garbage Collection(垃圾回收机制)，自动识别不在使用的内存并释放它

today discuss explicit memory allocaiton. next class will discuss implicit allocators.
C语言中的分配器由standard C library中一组叫做malloc包的函数提供
![Pasted image 20250720191546.png|600](/img/user/accessory/Pasted%20image%2020250720191546.png)
malloc函数用于分配内存，它把以字节为单位的参数作为函数的输入参数，返回一个指向内存块的指针，该内存块至少包含(注意是至少！)所声明的大小的字节，因为该块会在x86-64系统上以16字节对齐
![Pasted image 20250720191841.png|600](/img/user/accessory/Pasted%20image%2020250720191841.png)
free函数用于释放内存，它以一个先前调用malloc时返回的指针作为参数
other functions: calloc(another version of malloc), realloc, sbrk(增大缩小heap，可以用sbrk申请更多的虚拟内存放入heap中)
malloc example, 注意我们经常使用sizeof来获取大小，malloc返回的是一个`void*` 泛型指针，我们需要将其转换为`int*` keep the compiler happy(老师原话hhh), 其实我觉得这样未来才能做一些指针运算之类的，知道增量是多少或者说解引用的时候解引用多少空间.
![Pasted image 20250720192237.png|500](/img/user/accessory/Pasted%20image%2020250720192237.png)

接下来了解malloc和free的内部实现
但是这里做了一个假设，虽然我们知道虚拟地址或者说地址是按照字节编址，这里只聚焦于看字，以字为单位化块 这里假设一个格子四个字节
![Pasted image 20250720192704.png|500](/img/user/accessory/Pasted%20image%2020250720192704.png)
![Pasted image 20250720192837.png|500](/img/user/accessory/Pasted%20image%2020250720192837.png)
对于malloc和free
- 应用程序可以发出任意顺序的malloc和free请求，也就是说，程序员可能会以不可预测的方式申请和释放内存
- free请求只能释放之前由malloc分配过的block, 不能释放没有被分配或者错误地址的内存块
- 内存分配器无法控制分配请求的数量或大小，这些是由应用程序决定的
- 内存分配器立即响应malloc请求，意味着不能重排序或者缓冲分配请求以获得更好的结果
- 不能覆盖使用过的内存
- 分配出来的内存必须满足对其要求
	- 32位系统(x86): 8字节对齐
	- 64位系统(x86-64): 16字节对齐
- 不能进行内存压缩

分配器是一种时间和空间上的权衡，尝试尽可能的块，但我们希望高效的利用内存
我们定义了速度和内存效率指标: throughput(吞吐量), memory utilizaiton(内存利用率)
吞吐量实际上是每单位时间内完成请求的数量
内存利用率是max Aggregate payload(最大有效载荷)和Current heap size(当前堆大小)的比值，payload是指的我们调用malloc(p), 事实上我们申请了p字节的有效载荷，也就是说，在第 `Rₖ` 次请求执行完之后，`Pₖ` 是当前所有还没被 `free()` 的 malloc 块的 payload 总和。在这里其实是假设了heap size只增不减，但是事实上在真正的malloc包中不是这样的
我们的目标是maximize throughput and peek memory utilizaiton(最大吞吐量，峰值内存利用率)

上面的例子事实上是一个fragmentation(碎片)的例子，fragmentation有两种，这个在操作系统上加过
- internal fragmentation
- external fragmentation

对于有效负载小于块大小，其实这里注意啊，上面也提到了，我们malloc(p), 是申请了p字节的有效载荷，但是我们分配出来的并不一定是p个字节啊，需要对齐，所以说没用到的就是internal fragmentation，不过其实注意一下 block size中除了payload和padding之外，metadata(元数据)也占用空间，而这也是内部碎片的一部分
换句话说，内部碎片的大小: block size - payload
![Pasted image 20250720195540.png|500](/img/user/accessory/Pasted%20image%2020250720195540.png)
而下面这个例子，就是external fragmentation的一个例子
![Pasted image 20250720195912.png|500](/img/user/accessory/Pasted%20image%2020250720195912.png)

How do we know how much memory to free given just a pointer?
一种方法是，在每个块的开头使用一个字大小的区域来记录大小，不过注意啊这个块的开头，是指的payload前，换句话说就是我所占用的块前面有一个header，用来存，metadata，metadata其中包括block size, 后面才是payload，然后可能还会有对齐多分配的一些碎片
![Pasted image 20250720200653.png|500](/img/user/accessory/Pasted%20image%2020250720200653.png)

How do we keep track of the free blocks?
Methods 1: Implicit List using Length(隐式空闲链表): 所有内存块都用一个链表串起来，每个块都有长度，无论是allocated的还是free的，然后遍历块的时候，根据大小跳过去判断，不过这要扫描整个堆
![Pasted image 20250720201541.png|500](/img/user/accessory/Pasted%20image%2020250720201541.png)
Methods 2: Explicit List among Free Blocks using Pointers(显式空闲链表) -- 只串联空闲块，每个空闲块可能会保存两个指针prev, next 不过图中是保留了一个指针
![Pasted image 20250720201600.png|500](/img/user/accessory/Pasted%20image%2020250720201600.png)
Methods 3: Segregated Free List(分离空闲链表) -- 把空闲块按大小分类，没类用一个链表，每次分配时区对应的大小或者大小区域的链表中去找 -- 怎么把握粒度？
Methods 4: Blocks Sorted by Size -- 通过数据结构比如红黑树等，对free block进行排序
其实，看到这里我突然想起来操作系统中的动态分配，各种算法，首次适应算法，临近适应算法等等，甚至有的有个表来存每一个block的大小等等 其实当时我学LCU操作系统的课的时候，没和heap和malloc联系起来，也没考虑到前面有metadata也算内部碎片的一部分(其实后面考试是速成的，没认真看书，但我不知道书上有没有)，另外CSAPP算是导论性质的，这一部分就是操作系统的范畴，如果要细究的话，还是得去看操作系统的书

### Implicit Free Lists
