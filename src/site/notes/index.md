---
{"sticker":"emoji//1f3e0","dg-publish":true,"dg-home":false,"permalink":"/index/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-30T14:49:23.695+08:00","updated":"2025-07-02T22:21:06.481+08:00"}
---


>✒️签名
「幸福就是 橙子🍊不去想苹果🍎的事情」

### Cpp
大一下学期 spring2024
当时学cpp的时候还没有开始用obsidian，所以没有留笔记，只留了大作业
学习期间我用封装继承多态, 函数模版, 虚函数, 抽象类, 运算符重载等实现一个List, LinkedList, ArrayList.
我的大作业是用Vue和Cpp写了一个酒店管理系统
👉我的笔记：[[high-language/CPP/CPP\|CPP]]

### LCU 数据结构
📅date: 2024.09.20 - 2025.01.06完结✅
大二上学期 spring2024
当时才开始学着用obsidian这个笔记 记得很零散 而且水平有限
只参考一下期末复习的专题就可以
👉我的笔记：[[LCU DataStructure/LCU DataStructure\|LCU DataStructure]]
👉数据结构课程设计两次小实验报告, 数据结构大作业, 数据结构期末复习的相关资料都在这个百度网盘链接中:  https://pan.baidu.com/s/1ynhy6GBWodQREPO1Wa0oWg?pwd=qzlc 提取码: qzlc 
(🤣老实说 我的大作业使用Rust写了一个简单的虚拟货币交易系统 但是最后因为当时水平的原因并没有真正完成)

### LCU 计算机组成原理
📅date: 2024.10.30 - 2025.01.03完结✅
大二上课程 fall2024
我当时跟的是哈工大刘宏伟老师的课  但是没有完全跟完
最后面我总结了考试的专题  大题都考到了
👉课程视频: [计算机组成原理（哈工大刘宏伟）135讲（全）高清_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1t4411e7LH/?spm_id_from=333.337.search-card.all.click)
👉我的课程笔记:[[LCU principles of computer composition/LCU principles of computer composition\|LCU principles of computer composition]]
👉我的LCU课程资料 期末复习, 实验: https://pan.baidu.com/s/1wrDehpVJHtN8AU-xaIX0Gw?pwd=qzlc 提取码: qzlc

### ⭐CSAPP & CMU15213
📅date: 2024.12.24 - ing
CSAPP 被称为计算机圣经，这本书是由CMU 计算机系主任 Bryant 教授执笔的，我是因为b站up主polebug才接触到这本书，后来发现了Bryant 教授所配套的课 CMU15213 Introduce to Computer Systems fall2015. 相当巧合的是， 15213 正好是 CMU 的邮编（zip code）。 因此，这门课在 CMU 又被亲切地称为『The course that gives CMU its ZIP !』
CMU15213和CSAPP完全配套 课程内容覆盖了汇编语言、体系结构、操作系统、编译链接、并行、网络等。
CSAPP完全算得上是必读的三本书之一 但这算是一本指引书 导论的性质 它不是深入理解汇编、深入理解操作系统、深入理解计算机原理，所以它不会在某个知识点给你涉及很深，比如：
- 虽然讲了虚拟内存，但是并没有说各种页面置换算法，这部分内容得我们去看操作系统相关的书；
- 虽然说了链接，但是讲的内容比较表面，要想深入这块内容还是得看看《程序员的自我修养》这本书；

但是CSAPP绝对能为我们建立一个全面的计算机系统的体系！！
👉课程网站: [15-213: Introduction to Computer Systems / Schedule Fall 2015](https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html)
👉课程视频: [2015 CMU 15-213 CSAPP 深入理解计算机系统 课程视频_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1iW411d7hd/?spm_id_from=333.337.search-card.all.click)
👉我的课程笔记:[[CSAPP Computer-System-A-Program-Perspective/CSAPP Computer-System-A-Program-Perspective\|CSAPP Computer-System-A-Program-Perspective]]
👉我的视频: [csapp lecture02 03 Bits, Bytes, Integer（声音有点小）-情栀凉橙-csapp-哔哩哔哩视频](https://www.bilibili.com/list/1775867009/?sid=4659250&spm_id_from=333.1387.0.0&oid=114322852283478&bvid=BV1SaddY9EkX)


### ⭐CMU15445 Intro to Database System
📅date: 2024.1.20 - ing
🥰CMU15445是我目前看过的最喜欢的课程
Andy老师说：the most important thing you get to understand is I really only care about two things in my entire life. The first one is my wife and my biological daughter and the second one databases.
这门课的全套课程开源，而且实验对外校同学完全开放。
课程主题包括：
1. 数据模型（关系型，文档型，键值型）
2. 存储模型（n-ary，decomposition，可以理解为行式、列式）
3. 查询语言（sql，存储过程 stored procedures）
4. 存储结构（heaps，基于日志 log-structured）
5. 索引设计（排序树，哈希表）
6. 事务处理（ACID，并发控制）
7. 数据恢复（日志、快照）
8. 执行引擎（joins，排序，聚集，优化）
9. 并发架构（多核，分布式）

我看的是CMU15445 fall2023
2023的project分别是 bufferpool(缓冲池), hash index(哈希索引), query execution(查询执行), concurrency control(并发控制)
往年的Project2都是B+Tree Index的 由于原来网上都说Project2的难度是最大的 所以2023年将Project2改为了Hash Index 保证了难度的递增 但是我后期又做了B+Tree Index
我做的时候fall2023的gradescope已经处于末期了 所以后面我又转到了fall2024的gradescope

课程的配套教材是《Database-System-Concept-7th》不过前期我没有看配套教材 是听到lecture15的时候才开始看的

👉课程网站:  [Schedule | CMU 15-445/645 : Intro to Database Systems (Fall 2023)](https://15445.courses.cs.cmu.edu/fall2023/schedule.html)
👉课程视频: [【数据库系统导论 15-445 2023Fall】CMU—中英字幕_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Ex4y1p7bi/?spm_id_from=333.337.search-card.all.click)
👉配套教材电子书pdf:  https://pan.baidu.com/s/1SyFSNb-iiEXtDQaAcZiByA?pwd=QZLC 
👉我的笔记:[[DataBase Systems/CMU 15-445：Database Systems/CMU 15-445：Database Systems\|CMU 15-445：Database Systems]]
👉我的视频: [cmu15445 lecture 03 Database Storage Part1_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gxZRYoEiR/?spm_id_from=333.1387.homepage.video_card.click)
Andy要求不能公开代码 所以Project代码我private了

### ⭐CS61B Data Structures and Algorithms
📅date: 2025.03.02 - ing
CS61B是伯克利大学这个系列的第二个课程, 除此之外还有CS61A, CS61C
CS61B，主要内容为Java和数据结构。其中，前4周的时间都在谈Java中会很经常使用到的语法（关于静态与动态变量，比较器，迭代器，引用传递等基础知识），第5-11周主要在讲数据结构的类型（不相交集合，二叉搜索树和红黑树，哈希表，图等），第12-14周主要讲各种排序算法和软件设计原则
因为我大二下有Java课 所以我跟了这个课
伯克利大学21年的课程公开了很多资源 但我嫌页面太丑了hhh 然后我跟的是24年春的   但没有公开评分平台我哭死😭
我觉得Project3还是很有意思的 我打算作为我Java的大作业
👉课程网站: [Home | CS 61B Spring 2024](https://sp24.datastructur.es/)
👉课程视频: 从网站跳转
👉课程笔记: 从网站跳转
👉我的笔记: [[CS 61B/CS 61B\|CS 61B]]
👉CS61B 课程学习 代码仓库: https://codehub.devcloud.cn-north-4.huaweicloud.com/51257dbf8a21492f89da2942785a5ec8/CS61B.git
👉CS61B lab 代码仓库: https://codehub.devcloud.cn-north-4.huaweicloud.com/51257dbf8a21492f89da2942785a5ec8/CS61B-lab.git
👉CS61B Project 代码仓库: https://codehub.devcloud.cn-north-4.huaweicloud.com/51257dbf8a21492f89da2942785a5ec8/CS61BProject.git

### Algorithm
📅date1: 2025.01.07 - 2025.2.14 停(之后没在往后看)
我感觉市面上最好的算法书就是那本红皮的《Algorithm》
Princeton的算法课就是由作者讲的
Coursera上整理了好了所有的lecture, homework.
直接跟就行  作业可以直接在Coursera上评分 但是Coursera把课程分成了两部分
👉Part I: [算法，第一部分 | Coursera](https://www.coursera.org/learn/algorithms-part1)
👉Part II: [算法，第二部分 | Coursera](https://www.coursera.org/learn/algorithms-part2)
👉我的笔记: [[algorithm/Algorithm Princeton/Algorithm Princeton\|Algorithm Princeton]]



### LCU Database System
📅date: 2024.04.09 - ing
LCU的数据库课程教材用的王珊老师的《数据库系统概论》
LCU的数据库课的lab使用的是SQL Server数据库
老师提供了一个远程数据库 但是因为权限问题 有些操作需要在本地环境上实现
所以我从怎么在自己电脑上安装一个SQL Server数据库环境开始(也可以用实验室的电脑做实验 就不用自己在自己的电脑上装SQL Server环境了 我这里是主张用自己的电脑) 把lab的每一步都整理了下来
在做实验的时候 会有一些小坑hhh
除此之外 我还整理了一些考试的考点
👉实验要求, 最终实验报告,课本pdf等见百度网盘链接:  https://pan.baidu.com/s/1pzAJqBN0LuXk838H7WnD5Q?pwd=QZLC 
👉我的笔记 [[DataBase Systems/LCU Database System/LCU Database System\|LCU Database System]]

### LCU Operating System
📅date: 2024.04.12 - ing
LCU的操作系统课程汤小丹 汤子瀛老师的《计算机操作系统》 我们学校的老师也参与了编著
LCU的操作系统课的实验分为三个部分 分别是进程调度实验, 资源管理实验和存储器管理实验。三个实验主要就是用C/C++编写模拟程序，我感觉实验指导书给的很详细了，给了大量的代码，只需要补全部分代码即可，但需要去了解整个代码的含义和过程。
个人感觉做着比CMU15445的Project简单很多
我这里整理了一些复习笔记和详细的实验操作流程和一些小坑. 
除此之外 还整理了一些考试的考点
👉我的笔记[[Operating System/LCU Operating System/LCU Operating System\|LCU Operating System]]

[[math/MIT 18.01 Single Variable Calculus/MIT 18.01 Single Variable Calculus\|MIT 18.01 Single Variable Calculus]]
[[DataBase Systems/CMU 15-721 Advanced Database Systems/CMU 15-721 Advanced Database Systems\|CMU 15-721 Advanced Database Systems]]
[[LCU Web/LCU Web\|LCU Web]]
[[high-language/Java/LCU Java\|LCU Java]]
