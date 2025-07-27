---
{"dg-publish":true,"tags":["ETH-Zurich-Computer-Architecture"],"permalink":"/Computer Architecture/ETH Zurich 苏黎世联邦理工学院 Digital Design and Computer Architecture/lecture 01 Introduction and Basics/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-21T16:19:02.880+08:00","updated":"2025-07-27T11:25:18.414+08:00"}
---

课程pdf: [fetch.php](https://safari.ethz.ch/digitaltechnik/spring2023/lib/exe/fetch.php?media=onur-ddca-2023-lecture1-intro-afterlecture.pdf)
课程视频：[【数字设计和计算机体系结构 DDCA 2023】ETH—中英字幕_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV13nyeYYECw/?spm_id_from=333.1391.0.0&vd_source=3256c9484ee0afb7fb8a95fc60db92c6)
date: 20250721

---
第一节课只是去讲 什么是计算机体系结构，为什么要学习这些内容，以及这个领域正在发生什么

![Pasted image 20250721182211.png|500](/img/user/accessory/Pasted%20image%2020250721182211.png)
**research's goal is to build fundamentally better computers.**
**butter?** 在接下来的课程中会看到很多关于设计的原则和理念，今天只是宏观的举例子
- secure(安全), reliable(可靠)
- energy-effcient
- low-latency and predictable(低延迟，可预测)
- for AI/MI, Genomics, Medicine Health……

**computer Architecture的顺序**
- First Computer Architecture & Digital Design Course(也就是这门课)
- Advanced Computer Architecture Course: 高级课程，我找到了24年的
- Seminar in Computer Architecture: 研讨课，做报告，阅读前沿研究


**What will we Learn in This Course?**
How Computer Work today -- 包括前沿的东西 真真正正我们能见到的内存条之类的(目前我这么感觉) 不过基础课程要从晶体管开始一步一步构建上去
我们将会把晶体管抽象成开关，然后在其上构建电路，接着我们将它与指令连接起来
然后下面研究 can we work better？

**We will study how something like this works**
![Pasted image 20250721183925.png|500](/img/user/accessory/Pasted%20image%2020250721183925.png)
这可能是一个Apple M1 Utra System(2022), 中间是这是一个片上系统，有多个处理器，加速器，以及大量的片上内存，缓存... 我们将从基础开始 了解中间将会发生的事情；然后我们会看到Main Memory，我们将讨论他的设计；然后会讨论Storage, 非遗损失性的 比如磁盘，SSD；但很遗憾由于时间关系不会讨论Sensors(传感器)

**Major High Level Goals of This Course**
- Understand the basics: 基础知识
- Understand the principles of design: 原则和取舍
- Understand the precedents: 先例 过去的人做了什么 -- 同时注入前沿
- Based on such understanding:
	- learn how the mordern computer works underneath. -- 如何工作
	- evaluate tradeoffs of the different designs and ideas. -- 评估不同想法的取舍
	- implement a principled design(a simple microprocessor) -- 在实验中实现一个simple微处理器

How does a computer solve problems?
answer: 指挥电子
How Do Problems Get Solved by Electorons?
电子是潜在的解决问题的工具(从物理中能看到这一点)，但我们没法直接与电子沟通，我们面临很多**Problems**在顶层，我们知道**Electrons**是潜在的底层的解决问题的工具。
我们把Problems转换为Algorithms，然后算法用某种Language，Program变成，并在System Software上运行，然后被编译成较低层次的结构能够理解的指令，而这个较低层次的东西叫做Micro-Architecture(微架构)，然后micro-architecture将会通过Digital logic(数字逻辑)实现，而digital logic通过构成devices(transistors 晶体管)的器件来实现，晶体管的操作基于electrons的基本原理
![Pasted image 20250721190743.png|500](/img/user/accessory/Pasted%20image%2020250721190743.png)
传统的计算机习题结构都会讨论软件，硬件，接口和微架构，为了适应现在的发展（我自己认为包括有摩尔定律的问题）我们需要讨论的体系结构要广泛很多
![Pasted image 20250721191806.png|600](/img/user/accessory/Pasted%20image%2020250721191806.png)

在通用系统中，程序以指令的形式表达，而本门课程会包含成为指令架构的东西 interface(接口)是硬件和软件之间的契约。
本门课程会涵盖微架构的内容，本质上是对指令集架构上实现的内容，指令集架构可以是Intel x86, ARM...
微架构由数字逻辑电路构成，也是本门课程设计的内容


![Pasted image 20250721193626.png|600](/img/user/accessory/Pasted%20image%2020250721193626.png)
这是我们第19讲左右要看到的脉冲矩阵，基本上这是用于矩阵乘法，向量矩阵乘的，由谷歌设计的，称作TPU(张量处理单元) , 这是当今机器学习加速器的核心

![Pasted image 20250721194024.png|500](/img/user/accessory/Pasted%20image%2020250721194024.png)
这是Tesla的自动驾驶计算机，这是另一个机器学习加速器，执行机器学习推理，例如行人检测，神经网络等任务 -- 并不完全适用，这是特定目的实现的，这也是我们要往上讨论几层的原因
![Pasted image 20250721194310.png|500](/img/user/accessory/Pasted%20image%2020250721194310.png)
这是大约21年他们的学习芯片
![Pasted image 20250721194325.png|400](/img/user/accessory/Pasted%20image%2020250721194325.png)
他们构建了用于特定功能的高性能的chip，并且构建了system来支持这种性能……
![Pasted image 20250722200714.png|500](/img/user/accessory/Pasted%20image%2020250722200714.png)
这是一款英伟达的GPU, 他们在为动态编程添加专用指令，GPU算是一个比较专用的系统，是为图形设计的，而事实上GPU可以做其他事情，比如并行计算， 而现在为了动态变成添加了专用指令……
![Pasted image 20250722201120.png|500](/img/user/accessory/Pasted%20image%2020250722201120.png)
这实际上是一个芯片，这里的想法是为什么不把大量的计算包括内存放到同一个芯片上呢
事实上这些例子是想说 通用性和专用性之间存在了紧张的取舍关系，他们都在寻求在特定的工作负载上的高效率，而且他们采用的是上面介绍的扩展的架构视角

**Why Study Computer Architecture？**
- Enable better Systems: faster, cheaper, smaller, more reliable, ...
- Enable new applications
- Enable better solutions to problems
- Understand why computers work the way they do

事实上在我们讨论的层次结构的底层，就有很多地方值得创新…… 但这些微电子学和物理学的内容，我们不考虑

可持续性的问题，事实上计算机是用来解决问题的，但是也带来了一部分麻烦
![Pasted image 20250722203906.png|400](/img/user/accessory/Pasted%20image%2020250722203906.png)
研究结果还表明，访问主存的能耗远高于进行复杂计算的能耗
![Pasted image 20250722203926.png|400](/img/user/accessory/Pasted%20image%2020250722203926.png)
所以人们在研究最小化数据移动的模型
比如选择将计算和存储结合在同一个芯片上
![Pasted image 20250722204149.png|400](/img/user/accessory/Pasted%20image%2020250722204149.png)
![Pasted image 20250722204204.png|400](/img/user/accessory/Pasted%20image%2020250722204204.png)
非易失性的内存
![Pasted image 20250722204601.png|400](/img/user/accessory/Pasted%20image%2020250722204601.png)


加速器 片上系统
![Pasted image 20250722205035.png|400](/img/user/accessory/Pasted%20image%2020250722205035.png)
![Pasted image 20250722205044.png|400](/img/user/accessory/Pasted%20image%2020250722205044.png)


……
