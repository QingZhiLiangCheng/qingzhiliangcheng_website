---
{"tags":["folder"],"sticker":"emoji//1f60d","color":"","dg-publish":true,"dg-pinned":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/CSAPP Computer-System-A-Program-Perspective/","pinned":true,"dgPassFrontmatter":true,"noteIcon":"","created":"2024-11-29T12:31:23.842+08:00","updated":"2025-08-04T17:14:50.612+08:00"}
---

📅date: 2024.12.24 - ing
CSAPP 被称为计算机圣经，这本书是由CMU 计算机系主任 Bryant 教授执笔的，我是因为b站up主polebug才接触到这本书，后来发现了Bryant 教授所配套的课 CMU15213 Introduce to Computer Systems fall2015. 相当巧合的是， 15213 正好是 CMU 的邮编（zip code）。 因此，这门课在 CMU 又被亲切地称为『The course that gives CMU its ZIP !』
CMU15213和CSAPP完全配套 课程内容覆盖了汇编语言、体系结构、操作系统、编译链接、并行、网络等。
CSAPP完全算得上是必读的三本书之一 但这算是一本指引书 导论的性质 它不是深入理解汇编、深入理解操作系统、深入理解计算机原理，所以它不会在某个知识点给你涉及很深，比如：
- 虽然讲了虚拟内存，但是并没有说各种页面置换算法，这部分内容得我们去看操作系统相关的书；
- 虽然说了链接，但是讲的内容比较表面，要想深入这块内容还是得看看《程序员的自我修养》这本书；

但是CSAPP绝对能为我们建立一个全面的计算机系统的体系！！

**笔记**
[[CSAPP Computer-System-A-Program-Perspective/数组底层\|数组底层]]
[[CSAPP Computer-System-A-Program-Perspective/之前认为的函数调用原理\|之前认为的函数调用原理]]
[[CSAPP Computer-System-A-Program-Perspective/函数的调用原理\|函数的调用原理]]

---
><font color="#ff0000">[WARING] 这部分不用看</font>
Book:CSAPP
> 	[[CSAPP Computer-System-A-Program-Perspective/A Tour of Computer Systems\|A Tour of Computer Systems]]
> 	Chapter2: Representing and Manipulating Information
> 		[[CSAPP Computer-System-A-Program-Perspective/Information Storage\|Information Storage]]
> 		[[CSAPP Computer-System-A-Program-Perspective/Integer Representations\|Integer Representations]]
> 		[[CSAPP Computer-System-A-Program-Perspective/Integer Arithmetic\|Integer Arithmetic]]
> 		[[CSAPP Computer-System-A-Program-Perspective/Floating Point\|Floating Point]]
> 	Chapter3:Machine-Level Representation of Programs
> 		[[CSAPP Computer-System-A-Program-Perspective/Foreword-Chapter 3\|Foreword-Chapter 3]]
> 		[[CSAPP Computer-System-A-Program-Perspective/Machine-level representation of a program\|Machine-level representation of a program]]
> 		Data Movement Instructions
> 			[[CSAPP Computer-System-A-Program-Perspective/Register and Data Movement Instructions\|Register and Data Movement Instructions]]
> 			[[CSAPP Computer-System-A-Program-Perspective/Stack and Data Movement Instrucitons\|Stack and Data Movement Instrucitons]]
> 		[[CSAPP Computer-System-A-Program-Perspective/Arithmetic and Logical Operations\|Arithmetic and Logical Operations]]
> 		Control: Condition  Jump   Swith
> 			[[CSAPP Computer-System-A-Program-Perspective/Instructions and Condition Codes\|Instructions and Condition Codes]]
> 			[[CSAPP Computer-System-A-Program-Perspective/Jump Instructions\|Jump Instructions]]
> 			[[CSAPP Computer-System-A-Program-Perspective/Implementing Conditional Branches\|Implementing Conditional Branches]]
> 			[[CSAPP Computer-System-A-Program-Perspective/Loops and Swith\|Loops and Swith]]

前面一直都在看书  突然发现了课程CMU 15-213CSAPP  所以 又从课程重新开始看
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 02 03 Bits, Bytes, and Integer\|Lecture 02 03 Bits, Bytes, and Integer]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 04 Floating Point\|Lecture 04 Floating Point]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 05 Machine-Level Programming I： Basics\|Lecture 05 Machine-Level Programming I： Basics]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 06 Machine-Level Programming II：Control\|Lecture 06 Machine-Level Programming II：Control]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 07 Machine-Level Programming III：Procedures\|Lecture 07 Machine-Level Programming III：Procedures]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 08 Machine-Level Programming IV：Data\|Lecture 08 Machine-Level Programming IV：Data]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 09 Machine-Level Programming V：Advanced Topics\|Lecture 09 Machine-Level Programming V：Advanced Topics]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 10 Code Optimization\|Lecture 10 Code Optimization]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 11 The Memory Hierarchy\|Lecture 11 The Memory Hierarchy]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 12 Cache Memories\|Lecture 12 Cache Memories]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 13 Linking\|Lecture 13 Linking]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 14 Exceptional Control Flow： Exceptions and Processes\|Lecture 14 Exceptional Control Flow： Exceptions and Processes]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 15 Exceptional Control Flow： Signals and Nonlocal Jumps\|Lecture 15 Exceptional Control Flow： Signals and Nonlocal Jumps]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 16 System-Level IO\|Lecture 16 System-Level IO]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 17 Virtual Memory：Concepts\|Lecture 17 Virtual Memory：Concepts]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 18 Virtual Memory：Systems\|Lecture 18 Virtual Memory：Systems]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 19 Dynamic Memory Allocation：Basic Concepts\|Lecture 19 Dynamic Memory Allocation：Basic Concepts]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 20：Dynamic Memory Allocation：Advanced Concepts\|Lecture 20：Dynamic Memory Allocation：Advanced Concepts]]
- [[CSAPP Computer-System-A-Program-Perspective/Lecture 21 Network Programming：Part I\|Lecture 21 Network Programming：Part I]]
- Lecture 22 Network Programming: Part II 

![[cmu15213 fall2015.components]]

![[Computer-Systems-A-Programmers-Perspective-3rd.pdf]]





