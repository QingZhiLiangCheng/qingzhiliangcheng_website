---
{"dg-publish":true,"tags":["notes"],"permalink":"/libiry/passages/周记03：暑假第四周 Notion计划的一周/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-26T15:47:52.726+08:00","updated":"2025-07-27T11:43:37.758+08:00"}
---

> 本文是对20250721 - 0727 的记录与思考
> 适用Notion todo 一周, 坚持背英语单词的一周👍


### 🗓️本周周历
![20250721-20250727todolist.png](/img/user/accessory/20250721-20250727todolist.png)
![20250721-20250727calendar.png](/img/user/accessory/20250721-20250727calendar.png)
**本周完成情况**
- Database System
	- [[DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 02 Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023)\|CMU15721 Lecture02 paper]]的Introduce部分和Background and Related Work部分
	- 结束了[[DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 01 lecture：Modern Analytical Database Systems\|CMU15721 Lecture01]]
- Operating System
	- [[CSAPP Computer-System-A-Program-Perspective/Lecture 19 Dynamic Memory Allocation：Basic Concepts\|CMU15213 CSAPP Lecture19]]
	- 南京大学jyy老师操作系统课[[Operating System/NJU OS Operating System Design and Implementation/Lecture 02 操作系统上的程序\|Lecture 02 操作系统上的程序]]
	- 《Operating System: Three Easy Pieces》第二章
- Computer Architecture
	- 苏黎世联邦理工学院Digital Design and Computer Architecture的[[Computer Architecture/ETH Zurich 苏黎世联邦理工学院 Digital Design and Computer Architecture/lecture 01 Introduction and Basics\|lecture 01 Introduction and Basics]]
- Linear Algebra
	- MIT Linear Algebra Lecture01
	- 《Introduce to Linear Algebra》第一章 笔记: [[math/Linear Algebra/Chapter 1 Introduce to Vectors\|Chapter 1 Introduce to Vectors]]
- English
	- completed the English words of Chapter1👏
- Website
	- 给自己的小站加了一个图片预览功能


### ✍️Notion todo
上个周记中说打算用Notion做todo，所以这周我在Notion上搭了一个简单的任务数据库，然后试用了一周，整体试用下来的效果还是蛮好的。
![72eea69f949fba751595a7f1da7d5f8.png|600](/img/user/accessory/72eea69f949fba751595a7f1da7d5f8.png)
在我的todo中，除了任务的常规状态(未开始，进行中，完成和中止)以外，我把任务根据性质分成了四类，分别是学习，生活，课表和协作。同时每个任务可以设置三个优先级。比如这周我的英语单词的优先级就高一点(为了逼着自己学😅)
我还特意加入了“指派者”的属性，是为了未来如果有朋友也想用这个todo清单的话
- ta的任务可以指派给自己
- 如果有多个人一起需要完成的事项，可以指派多个人

然后可以在数据库中根据 指派人分组 将多个人的任务隔离开展示
除此之外，任务有多种展示的形式，比如按状态展示，周历展示等等，而且Notion是跟Notion Calendar是协同的，所以我的任务也会在Notion Calendar中显示，并且我根据任务的性质分了四种颜色在Calendar上显示。等开了学还可以排上自己的课表，课表我设置的块是绿色的🤣
![20250721-20250727calendar.png|500](/img/user/accessory/20250721-20250727calendar.png)
不过这周做的事情非常的杂，没有一个总的规划，导致后期我都不知道我哪门课是什么进度了🤣（有的课是很久远之前的事情了感觉hhh）所以我下周希望能够做一个总的周计划，列好这周想干哪门课的哪些事情，用上我新买的本子，感觉好漂亮hh
![1753540460622.png|250](/img/user/accessory/1753540460622.png)

![1753540401799.png|250](/img/user/accessory/1753540401799.png)

![Pasted image 20250726223400.png|300](/img/user/accessory/Pasted%20image%2020250726223400.png)



### 😳本周好玩的事儿或者观点
####  Andy老师的名字
在听CMU15721 Lecture01的时候，最后听Andy老师说Lecture02的那篇paper是他写的，然后我翻了一下，发现Andy老师的署名是Andrew Pavlo。查了一下才知道，老师在学术和正式出版物中的署名是Andrew Pavlo，而Andy是Andrew的常见昵称，所以说在教学，演讲，网站，社交媒体等更轻松的场合，他经常使用的是Andy Pavlo.
#### Topic: 程序是状态机 & 程序 = 计算 + 系统调用 & 程序眼中的操作系统
在南京大学jyy老师的操作系统课上，听到了一个比较好的观点：程序是状态机
首先我们的数字电路逻辑就是一个状态机，每一个状态就是寄存器保存的值，而每次迁移都是组合电路计算寄存器下一周期的值然后再存入寄存器，比如
$$
\begin{align*}
X' &= \lnot X \land Y \\
Y' &= \lnot X \land \lnot Y
\end{align*}
$$
![Pasted image 20250722151037.png](/img/user/accessory/Pasted%20image%2020250722151037.png)
而程序是建立在数字电路逻辑基础上的，所以程序也是状态机。
从源代码的视角来看，程序是状态机。在CSAPP中其实提到过C语言的内存模型，其中最主要的就是stack栈区和heap堆区，我们对于函数的调用都在栈区，在C语言中malloc动态申请的空间，包括C++，java new出来的对象也都是在堆区。所以说其实对于C语言的每一行代码，其实改变的是内存中栈区和堆区的状态，每一条语句(假设每条语句都做简单的事情)就是从内存中取值，计算，然后存回内存，形成了一个新的状态
从汇编asc的角度来看，程序也是状态机，在CSAPP中其实我们接触过汇编以及指令，其实本质上是在寄存器上的操作，而每一条指令就是从寄存器中取值，计算，放回寄存器，形成了一个新的状态
而且，其实我们知道，源代码的视角和汇编的视角的寄存器之间其实是由关系的，比如说事实上CSAPP上学到过栈区是通过寄存器%rsp 甚至是寄存器%rbp(可选)来维护的。
其实源代码视角的状态机和汇编视角的状态机是对于同一个东西的不同层面的抽象，<font color="#f79646">所谓抽象，就是对于呈现过程的修改</font>(好好体会这句话，这是CSAPP，CMU15213的教授说的)
那什么叫编译？ 所谓的编译就是从C语言源代码状态的状态机转为汇编，二进制代码视角的状态机！
在操作系统的眼中，程序其实就是一个状态机，而我们在上面提到的状态之间的转变其实只是取内容，计算然后放回去，所以其实像上面例子图中的情况，是会出现循环的状态转变的，那我们怎么停止这个程序？ -- 事实上用到的是system call(syscall).
所谓的syscall，就是指当程序的状态变到一个适当的时候的时候，通过system call，程序将权限完全交给操作系统，然后自己就躺平了，这其实就是操作系统课上学到的用户态转变为内核态的过程，在内核态中，操作系统统筹所有硬件软件资源，来决定帮程序进行想要的操作，比如展示在屏幕上，打印，或者停止它.... 也可以将权限再返还给用户
所以，程序 = 计算 + syscall!
而在程序的眼中，操作系统就是一系列规定好了的syscall，这其实是一种接口(Interface),API.
#### Topic: 计算机体系视角的总结
在苏黎世联邦理工学院的数字逻辑和计算机体系结构的课程中，教授是体系结构的大牛 Onur Mutlu，视角很棒，从从晶体管、逻辑门开始，一直讲解到微架构、缓存和虚拟内存，还会介绍 很多体系结构领域最新的研究进展。
在第一讲中，他提到了整个体系的视角，其实这个视角我模模糊糊的知道，但是没有整理过
![Pasted image 20250721190743.png|500](/img/user/accessory/Pasted%20image%2020250721190743.png)
这里的核心的观点是：
计算机是干什么的？ -- 答案是解决问题(problem)
那How does a computer solve problems? -- 答案是指挥电子(Electrons)（这是物理层面达到共识的事情）
那么问题是，物理中证明了电子是潜在的解决问题的工具，但我们没法直接与电子沟通，也就是说我们面临着很多Problems在顶层，我们知道Electrons是潜在的底层的解决问题的工具。
我们把Problems转换为算法(Algorithms)，然后算法通过各种语言，程序(Program)实现，程序在操作系统，软件，硬件上运行，通过接口与操作系统打交道，然后被编译成较低层次的结构能够理解的指令，而这个较低层次的东西叫做Micro-architecture(微架构)，所谓的微结构，本质上是对指令集架构上实现的内容，而micro-architecture是通过Digital logic(数字逻辑)实现的，digital logic是通过一些晶体管类似的器件来实现的，而这些器件是基于电子的基本原理的
#### Topic: 一些硬件的前沿
在苏黎世联邦理工学院的数字逻辑和计算机体系结构的课程中，老师提到了一个观点是，研究表明，访问主存的能耗远高于复杂计算的能耗，所以人们在研究最小化数据移动的东西
比如将计算和存储结合在同一个芯片上，be like
![Pasted image 20250722204204.png|400](/img/user/accessory/Pasted%20image%2020250722204204.png)
还有的在研究非遗损失性的内存，就是断电不损失数据的内存
![Pasted image 20250722204601.png|400](/img/user/accessory/Pasted%20image%2020250722204601.png)

#### 皇家流沙包和ta的咖啡
呃呃这周才发现我超喜欢的up主流沙包竟然是卖咖啡豆的，并且有自己的小店，叫coxxee
<iframe width ="100%" height = "400" src="https://player.bilibili.com/player.html?isOutside=true&aid=492639568&bvid=BV1mN411W7rt&cid=1311572464&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="false"></iframe>
等开了学打算买一次尝一下 而且还能备注获得包包的亲笔便签祝福一张hhh
![e73bd56a93ead70b8801a6e580a7c70.jpg|300](/img/user/accessory/e73bd56a93ead70b8801a6e580a7c70.jpg)

#### 画图工具
之前遇到一张图片，还问过好多朋友这张图是不是ipad的画出来的
![94ac1caf5d5faebe5ade0c9936ccee0.png|600](/img/user/accessory/94ac1caf5d5faebe5ade0c9936ccee0.png)
这周搜手绘风的时候无意间在知乎上遇到了画这张图的工具，叫做Excalidraw，这是一个开源的虚拟白板工具，专门用于手绘风格的绘图。
GitHub地址: [excalidraw/excalidraw: Virtual whiteboard for sketching hand-drawn like diagrams](https://github.com/excalidraw/excalidraw)当然可以通过GitHub自己部署或者自己做一些小更改
也有网上大家部署好了的公网的地址: [Excalidraw | Hand-drawn look & feel • Collaborative • Secure](https://excalidraw.com/)
### 👔新衣服✌️
新风格: 买了一件夹克和方格衬衣😅😅😅
适合自己的: 买了一件新大衣和牛仔裤 大衣很帅！
