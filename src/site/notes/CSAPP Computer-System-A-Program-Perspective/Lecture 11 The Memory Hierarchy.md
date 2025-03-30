---
{"week":"第六周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 11 The Memory Hierarchy/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-09T14:56:55.087+08:00","updated":"2025-03-30T14:58:20.578+08:00"}
---


![[11-memory-hierarchy.pdf]]

之前在机器级代码提到的memory是想象成一个数组  但事实上memory是个复杂的层级结构(hierarchy) -- 提供了抽象 -- 抽象成了 带下标的巨大数组
this lecture -- 存储器层级结构 怎么构建的

**today‘s agenda**
- Storage technologies and trends
- Locality of reference
- Caching in the memory hierarchy


### Storage technologies and trends

**Random-Access Memory(RAM)**
RAM packaged as a chip
基本存储单元 -- cell -- 一个cell就是一个bit
分类  SRAM  DRAM  --区分 实现方式 [[LCU principles of computer composition/主存储器\|机组主存储器]]
![Pasted image 20250314103015.png|500](/img/user/accessory/Pasted%20image%2020250314103015.png)


**Nonvolatile Memories**
![Pasted image 20250314103438.png|500](/img/user/accessory/Pasted%20image%2020250314103438.png)

**Traditional Bus Structure Connecting CPU and Memory**
![Pasted image 20250314103706.png|500](/img/user/accessory/Pasted%20image%2020250314103706.png)
内存离着cpu 远   read/write 慢 发生很多事情 -- 损耗

**What's Inside A disk Drive?**
![Pasted image 20250314104546.png|500](/img/user/accessory/Pasted%20image%2020250314104546.png)
磁性材料 --  磁场 0 1
机械臂感受磁场变化  -- 机械装置 -- 比DRAM和SRAM慢
有一个内置的小电脑的东西  控制器
![Pasted image 20250314104734.png|500](/img/user/accessory/Pasted%20image%2020250314104734.png)
- consist of platters(盘片)   每个platters 两面 surface
- each surface 由同心圆构成 -- 同心圆叫tracks(磁道)
- each tracks consist of sectors(扇区) -- 扇区存储数据
- 典型的 每个sector 512bytes
- sectors 之间的 gap(空隙) -- 不保存数据
![Pasted image 20250314105112.png|400](/img/user/accessory/Pasted%20image%2020250314105112.png)
platters 在 spindle(主轴) 对齐 -- track也对齐
对齐的track的集合  称为cylinder(柱面)

磁盘的容量有两个因素决定
- 记录密度 recording density -- 决定单独一个扇区可以存储多少bits
- 磁道密度 track density -- 指可以将相邻的磁道放置得多临近
- 两者的乘积叫做面密度 areal density

过去 磁盘的面密度比较低 -- each track on the surface would have the same number of sectors.
-> 所以越往外 扇区间的间隙会越变越大
现代的系统所做的改进是 -- 将磁道划分为所谓的记录区(recording zones)
每一个recording zones 有相同的扇区  -- 越往外 recording zones 越多？
![Pasted image 20250316100641.png|500](/img/user/accessory/Pasted%20image%2020250316100641.png)

**Disk Operation**
![Pasted image 20250316101228.png|500](/img/user/accessory/Pasted%20image%2020250316101228.png)
逆时针旋转
机械臂按半径移动
![Pasted image 20250316101406.png|400](/img/user/accessory/Pasted%20image%2020250316101406.png)
好多臂 -- 但是是对齐的 -- 现在的可能会有一些偏移

读取数据
![Pasted image 20250316101616.png|600](/img/user/accessory/Pasted%20image%2020250316101616.png)
第一步是先把read/write head 移动到红色扇区所在的磁道  等待磁盘旋转
三个因素决定读取一个扇区需要多长时间
- 移动磁头的时间称为 寻道时间 seek
- 等待红色block转过来的时间 叫做 rotational latency 旋转延迟  平均就是磁盘旋转一圈所花费时间的一半
- data transfer 传送时间 指该block在读写头下通过的时间
average time to access some target sector : 三个加起来
![Pasted image 20250316102149.png|500](/img/user/accessory/Pasted%20image%2020250316102149.png)
寻道时间的时间 改不了 是一种机械限制

现代磁盘有更简单的视图
logical disk blocks  从0开始编号
磁盘控制器保持映射  保持物理扇区和逻辑块之间的映射
存在一些柱面保留为备用柱面 -- 没有被映射  如果有一个柱面坏了  就会将信息复制给备用柱面 继续工作
这就是为什么磁盘的格式容量会比实际容量小  可能还有一部分存的元数据

cpu编写三元组来启动读取行为
- command -- read
- logical block number -- 逻辑块号
- certain address in Memory  --  放在内存的哪个位置
![Pasted image 20250316104120.png|500](/img/user/accessory/Pasted%20image%2020250316104120.png)
无需经过cpu
然后通过中断interrupt 机制来通知cpu
![Pasted image 20250316104215.png|500](/img/user/accessory/Pasted%20image%2020250316104215.png)

这么做的原因是 disk真的是太慢了

SSD 固态硬盘
![Pasted image 20250316104516.png|500](/img/user/accessory/Pasted%20image%2020250316104516.png)
在CPU的角度来看 -- SSD和机械硬盘 具有相同的物理接口 具有相同的包装
但他没有那些机械部件 -- 完全由闪存构建  其内部的Flash translation layer -- 和机械硬盘的磁盘控制器差不多
以page为单位 -- read or write
好多page 叫一个 block   一个page只能在所属的block都被擦除后 才能写这一页
写入一个page的时候  要找到一个block  把原来的东西复制进来  然后把原来的block删除 以供继续写入
当经历大约10万次重复写入和擦除后 这个块就会磨损
现在的SSD中 translation layer中实现了好多专有算法 -- 来延长SSD的使用寿命
![Pasted image 20250316160255.png|500](/img/user/accessory/Pasted%20image%2020250316160255.png)

### Locality of reference
locality -- 局部性
程序倾向于使用地址接近或等于他们最近使用的地址的数据和仪器  -- 叫局部性
这个好像在机组上提到过
两种不同的形式
- temporal locality 时间局限性
	最近引用的存储器位置可能在不久的将来再次被引用的属性
- spatial locality  空间局部性
	引用临近存储器位置的倾向
examp -- for loop
好的局部性--带来好的性能
![Pasted image 20250317140433.png|300](/img/user/accessory/Pasted%20image%2020250317140433.png)
good locality -- 因为 二维数组在内存中是行优先的

### Caching in the memory hierarchy
**memory hierarchy**
![Pasted image 20250317140928.png|400](/img/user/accessory/Pasted%20image%2020250317140928.png)
存储器层级结构中的每一层都包含从下一个较低级别层级所检索的数据

**caches**
a idea
缓存 - 暂存
由于局部性原理

**general cache concepts**
some unit  在层级之间来回传递
![Pasted image 20250317141746.png|450](/img/user/accessory/Pasted%20image%2020250317141746.png)
划分为大小相同的block -- 在层级之间传输
任何时间点 cache都保存memory的一个子集

4想要被访问
cpu首先查看这个数据是否存在高速缓存中
如果不在 就会从memory复制到cache中 -- 涉及到替换策略 （我记得在机组中学的是同时CPU直接访问的内存 -- 只是同时再存一次 -- 防止下次用）

hit 命中  or miss 未命中

types of cache misses
- cold miss
	cache is empty
- conflict miss
	跟设计有关
	限制了块被放置得位置
	嗷嗷想起来了机组中的 相连映射的知识  这个0号放了  那个0号就回不命中
- capacity miss
	想用的block 大于 cache的最大容量了  那肯定有未命中的

不断被访问的块 -- working set  工作集
