---
{"data":"2024-09-20","tags":["#folder"],"sticker":"emoji//1f3d7-fe0f","dg-publish":true,"permalink":"/LCU DataStructure/LCU DataStructure/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-09-22T17:16:56.309+08:00","updated":"2025-04-01T13:52:38.202+08:00"}
---


首先需要注意的是，其实<font color="#c0504d">数据结构讲的是一些理论性的东西，并不是软件工程层面的东西</font>。所以课本上的一些东西会和比如Java源码中的数据结构有一定的出入。
比如说工程上队列实现都是用链式的，但是课本还会讲比如循环队列的原理之类。课本上的循环队列在出队列的时候为了时间复杂度会把front指针往后移动，但如果我直接继承我之前写的线性表的话，出队列的时候就是删除元素，会涉及到数组的整体移动，时间复杂度是O(n)。
我的笔记会尽量在整理整个课本知识的基础上（为了考试），更好的去用代码实现数据结构（优雅）嘻嘻。

[[LCU DataStructure/线性表\|线性表]]
	- [[LCU DataStructure/顺序表\|顺序表]]
	- [[LCU DataStructure/链表\|链表]]
[[LCU DataStructure/栈\|栈]]
	- [[LCU DataStructure/顺序栈\|顺序栈]]
	- [[LCU DataStructure/链式栈\|链式栈]]
	- [[LCU DataStructure/游戏中栈的应用\|游戏中栈的应用]]
[[LCU DataStructure/队列\|队列]]
	-[[LCU DataStructure/顺序队列\|顺序队列]]
	- [[LCU DataStructure/链式队列\|链式队列]]
	- [[LCU DataStructure/优先队列\|优先队列]]
	- [[LCU DataStructure/双端队列\|双端队列]]
[[LCU DataStructure/矩阵的压缩存储\|矩阵的压缩存储]]
[[LCU DataStructure/广义表\|广义表]]
[[LCU DataStructure/树\|树]]
	- [[LCU DataStructure/二叉树\|二叉树]]
	- [[LCU DataStructure/红黑树\|红黑树]]
[[LCU DataStructure/图\|图]]
	![[6 第七章图-2023.ppt]]
期末复习：
	[[LCU DataStructure/专题一：线性表选择题\|专题一：线性表选择题]]
	[[LCU DataStructure/专题二：线性表算法设计题\|专题二：线性表算法设计题]]
	[[LCU DataStructure/专题三：栈和队列\|专题三：栈和队列]]
	[[LCU DataStructure/专题四：树和二叉树\|专题四：树和二叉树]]
	[[LCU DataStructure/专题五：图\|专题五：图]]
	[[LCU DataStructure/专题六：排序\|专题六：排序]]
	[[LCU DataStructure/专题七：查找\|专题七：查找]]
题目：
	[[LCU DataStructure/第一套题\|第一套题]]
	[[LCU DataStructure/第二套题\|第二套题]]
	[[LCU DataStructure/第三套题\|第三套题]]
	[[LCU DataStructure/第四套题\|第四套题]]
