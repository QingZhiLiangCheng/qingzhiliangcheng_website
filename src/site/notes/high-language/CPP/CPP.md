---
{"dg-publish":true,"permalink":"/high-language/CPP/CPP/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-20T11:20:01.294+08:00","updated":"2025-07-31T20:35:27.404+08:00"}
---



大一下学期 spring2024
当时学cpp的时候还没有开始用obsidian，所以没有留笔记，只留了大作业
学习期间我用封装继承多态, 函数模版, 虚函数, 抽象类, 运算符重载等实现一个List, LinkedList, ArrayList.
我的大作业是用Vue和Cpp写了一个酒店管理系统
👉前端Vue代码仓库: https://github.com/QingZhiLiangCheng/hotel_management_system_vue.git
👉后端cpp代码仓库: https://github.com/QingZhiLiangCheng/hotel_management_system_background.git

一些不懂的 逐渐补充的知识
[[high-language/CPP/右值引用 移动语义\|右值引用 移动语义]]

**ChengZiList**
📅Date: 2025.04.28 -- ing
在学弟学妹问我怎么学C++的时候，我一般建议他们试着去实现List, LinkedList, ArrayList 用上面向对象的知识…… 为了帮助大家掌握C++和数据结构的知识，我设计并开发了一个名为ChengZiList的简单的项目

ChengZiList的灵感来源于我之前看的两个课程: CS61B 和 CMU15445。CS61B在课程初期通过循序渐进的方式，深入探讨了链表和动态数组的设计与实现，这让我受益匪浅。而在参与的CMU15445的bustub项目的时候，我对其中Google Test框架的单元测试功能产生了兴趣，同时我比较喜欢国外这种写项目的这种方式。

基于这些启发，我在ChengZiList中提供了完整的文档，并使用Google Test框架编写了全面的测试用例。项目从简单的链表实现入手，逐步引入双向循环链表以及更复杂的数据结构。在这个过程中，诸如“为什么需要虚拟头节点”、“双向链表的优势是什么”、“为什么要进行动态扩容”等问题都会迎刃而解。同时，学习者还能通过实践深刻体会到C++中面向对象特性——如封装、继承、多态和重载的魅力所在。

[[high-language/CPP/ChengZiList/ChengZiList\|ChengZiList]]
