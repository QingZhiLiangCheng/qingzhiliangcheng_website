---
{"tags":["folder"],"sticker":"lucide//database","dg-publish":true,"dg-pinned":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/CMU 15-445：Database Systems/","pinned":true,"dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-20T08:46:32.906+08:00","updated":"2025-07-26T13:21:26.102+08:00"}
---

📅date: 2025.1.20 - ing
🥰CMU15445是我目前看过的最喜欢的课程
Andy老师说：the most important thing you get to understand is I really only care about two things in my entire life. The first one is my wife and my biological daughter and the second one databases.
值得注意的是，教授的全称叫Andrew Pavlo，这是他在学术和正式出版物中的署名，Andy是Andrew的常见昵称，在教学、演讲、网站、社交媒体等更轻松的场合，他经常用的是 Andy Pavlo.
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

**笔记**
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 01 Course Intro & Relational Model\|Lecture 01 Course Intro & Relational Model]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 02 Modern SQL\|Lecture 02 Modern SQL]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 03 Database Storage Part 1\|Lecture 03 Database Storage Part 1]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 04 Database Storage Part 2\|Lecture 04 Database Storage Part 2]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 05 Storage Models & Compression\|Lecture 05 Storage Models & Compression]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 05-03 Summary\|Lecture 05-03 Summary]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 06 Memory & Disk IO Management\|Lecture 06 Memory & Disk IO Management]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 06 Summary\|Lecture 06 Summary]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 07 Hash Tables\|Lecture 07 Hash Tables]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 08 Tree Indexes\|Lecture 08 Tree Indexes]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 09 Index Concurrency Control\|Lecture 09 Index Concurrency Control]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 10 Sorting & Aggregations Algorithm\|Lecture 10 Sorting & Aggregations Algorithm]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 11 Join Algorithms\|Lecture 11 Join Algorithms]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 12 Query Execution Part 1\|Lecture 12 Query Execution Part 1]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 13 Query Execution Part 2\|Lecture 13 Query Execution Part 2]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 14 Query Planning & Optimization\|Lecture 14 Query Planning & Optimization]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 15 Concurrency Control Theory\|Lecture 15 Concurrency Control Theory]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 16 Two-Phase Locking\|Lecture 16 Two-Phase Locking]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 17 Timestamp Ordering Concurrency Control\|Lecture 17 Timestamp Ordering Concurrency Control]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 18 Multi-Version Concurrency Control\|Lecture 18 Multi-Version Concurrency Control]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 19 Database Logging\|Lecture 19 Database Logging]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 20 Database Recovery\|Lecture 20 Database Recovery]]
- [[DataBase Systems/CMU 15-445：Database Systems/Lecture 21 Intro to Distributed Databases\|Lecture 21 Intro to Distributed Databases]]

**Project**
- [[DataBase Systems/CMU 15-445：Database Systems/环境配置 下载代码  提交项目 代码规范\|环境配置 下载代码  提交项目 代码规范]]
- [[DataBase Systems/CMU 15-445：Database Systems/Project 1 Buffer Pool\|Project 1 Buffer Pool]]
- [[DataBase Systems/CMU 15-445：Database Systems/Project 2 Hash Index (fall2023)\|Project 2 Hash Index (fall2023)]]
- [[DataBase Systems/CMU 15-445：Database Systems/Project 3 Query Execution\|Project 3 Query Execution]]

![[Database System Concepts 7th edition.pdf]]

![[cmu15445 fall2023.components]]