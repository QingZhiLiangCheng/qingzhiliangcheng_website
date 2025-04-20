---
{"sticker":"lucide//database","dg-publish":true,"tags":["LCU数据库"],"permalink":"/DataBase Systems/LCU Database System/LCU Database System/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-09T13:35:44.736+08:00","updated":"2025-04-20T19:27:43.119+08:00"}
---

### LCU Database System Lab
LCU的数据库课的lab使用的是SQL Server数据库
老师提供了一个远程服务器 但是因为权限问题 有些操作需要在本地环境上实现
所以我从怎么在自己电脑上安装一个SQL Server数据库环境开始(也可以用实验室的电脑做实验 就不用自己在自己的电脑上装SQL Server环境了 我这里是主张用自己的电脑) 把lab的每一步都整理了下来
老师给的会有一些小坑hhh

**实验说明**
1. 服务器ip地址   10.200.7.129（实验室和宿舍都可以访问）
2. 登录账户和密码相同，3班为dbuser202303，对应数据库db202303；4班为dbuser202304、对应数据库db202304；5班为dbuser202305，对应数据库db202305；6班为dbuser202306，对应数据库db202306。
3. 为了避免命名冲突，每个人都要在表名后面加学号后缀，比如student2023406313
4. 部分实验内容比如第一个实验中和架构相关的内容因为权限问题无法在服务器上面完成，可以使用实验室电脑自带的sql server服务完成。其它内容建议在服务器上面完成，可以保存下来后续实验继续使用。
5. 一共5个实验，4周的时间，安排好进度，实验任务书可以在U+的实验模块下载，所有实验结束后需要提交实验报告到U+平台。
6. 本说明可以在U+的资料模块下载。

**实验要求**
实验要求, 最终实验报告,课本pdf等见百度网盘链接:  https://pan.baidu.com/s/1pzAJqBN0LuXk838H7WnD5Q?pwd=QZLC 提取码: QZLC 

**实验笔记**
[[DataBase Systems/LCU Database System/SQL Server, SSMS Navcat DataGrip安装配置\|SQL Server, SSMS Navcat DataGrip安装配置]]（如果不想再自己电脑上装SQL Server 可以跳过这一篇笔记 直接在实验室电脑上做实验也可以）
[[DataBase Systems/LCU Database System/lab1 模式定义与数据完整性操作\|lab1 模式定义与数据完整性操作]]
[[DataBase Systems/LCU Database System/lab2 SQL数据操作及查询\|lab2 SQL数据操作及查询]]


### LCU Database System Course
课本pdf: https://pan.baidu.com/s/1pzAJqBN0LuXk838H7WnD5Q?pwd=QZLC 
我参考了这个[【专栏必读】（考研复试）数据库系统概论第五版（王珊）专栏学习笔记目录导航及课后习题答案详解_数据库系统概论第五版课后答案pdf-CSDN博客](https://blog.csdn.net/qq_39183034/article/details/122771126)
但是我还整理了一些题目 除此之外 因为我学过CMU15445 所以加了一些自己的理解 删了一些很了解的
期中复习: 期中题型里面有选择、编写SQL语句，还有关系代数的内容
[[DataBase Systems/LCU Database System/数据库系统概念 & 关系数据库系统概念\|数据库系统概念 & 关系数据库系统概念]]
[[DataBase Systems/LCU Database System/关系代数\|关系代数]]
[[DataBase Systems/LCU Database System/SQL 语句\|SQL 语句]]
