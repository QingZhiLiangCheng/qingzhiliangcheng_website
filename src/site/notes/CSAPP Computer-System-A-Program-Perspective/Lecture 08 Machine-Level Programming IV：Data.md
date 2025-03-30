---
{"week":"第四周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 08 Machine-Level Programming IV：Data/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-09T14:52:36.430+08:00","updated":"2025-03-30T14:55:33.232+08:00"}
---


![[08-machine-data.pdf]]

today -- data representation
之前见过的程序都是操控 long integers and pointers -- scaler data(标量数据) -- 不是任何聚合形式的数据叫标量数据
this lecture要研究的就是把数据聚合起来的情形 -- 有两种方式
- array
- struct

我们将看到他们在机器内存中的表现形式   以及操控这些不同数据结构的代码
我们会看到 在机器内存中 并没有数组这样的高级概念  事实上就是一些字节的集合
C compiler的工作就是生成适当的代码来 分配该内存


### Arrays
数组内存分配原理很简单
![Pasted image 20250309185604.png|500](/img/user/accessory/Pasted%20image%2020250309185604.png)

![Pasted image 20250309185916.png|500](/img/user/accessory/Pasted%20image%2020250309185916.png)

实际上在声明这个数组的时候干了两件事
- 第一件事就是确保能够分配足够的空间
- 第二件事是 提供能通过指针运算来访问数组的方式
注意上面这个ppt中的 p++ 或者 p + i

我今天才知道  原来c语言 数组没有 边界检查
![Pasted image 20250309191445.png|400](/img/user/accessory/Pasted%20image%2020250309191445.png)
事实上如果是负数 规则仍然适用  在这个例子中 就当与 arr内存地址 往前4个字节

![Pasted image 20250309192204.png|500](/img/user/accessory/Pasted%20image%2020250309192204.png)
![Pasted image 20250309192216.png|500](/img/user/accessory/Pasted%20image%2020250309192216.png)
数组的底层事实上就是做了地址运算
![Pasted image 20250309192456.png|500](/img/user/accessory/Pasted%20image%2020250309192456.png)

数组和指针的区别
数组在声明时  既在分配空间  也在创建一个允许指针运算使用的数组名称
而声明一个指针  只是分配的指针的空间 而没有给它所指向的任何东西

指针数组 --  数组指针

**Multidimensional(Nested) Arrays**
![Pasted image 20250309194639.png|500](/img/user/accessory/Pasted%20image%2020250309194639.png)
![Pasted image 20250309194708.png|500](/img/user/accessory/Pasted%20image%2020250309194708.png)
注意逻辑上  和   内存中 的不同
行优先
![Pasted image 20250309194750.png|500](/img/user/accessory/Pasted%20image%2020250309194750.png)
这一张是在说第i行的起始地址
![Pasted image 20250309200044.png|500](/img/user/accessory/Pasted%20image%2020250309200044.png)
一般情况


![Pasted image 20250309195440.png|500](/img/user/accessory/Pasted%20image%2020250309195440.png)

不同的声明方法  -- 其实上面的C语言普通的规规矩矩的声明方法只能是方正的二维数组
下面这种方法用到了数组指针和指针数组 --  实现了像Java一样的数组
![Pasted image 20250309200235.png|500](/img/user/accessory/Pasted%20image%2020250309200235.png)
![Pasted image 20250309200852.png|500](/img/user/accessory/Pasted%20image%2020250309200852.png)
要访问的元素位于 `Mem[Mem[univ+8*index]+4*digit]` 处。

### Structure
![Pasted image 20250309202431.png|500](/img/user/accessory/Pasted%20image%2020250309202431.png)
首先先为struct中的每一个数组元素字段引入一个足够的空间
跟踪每个字段的起始位置 --  内存对齐
对struct 内存 引用 是struct的起始位置
一个很重要的事儿   Fields ordered according to declaration  even if another  ording could yield a more compact
![Pasted image 20250309214021.png|500](/img/user/accessory/Pasted%20image%2020250309214021.png)
注意 例子中i占了8字节是内存对齐了

**Alignment**
对齐
![Pasted image 20250309214514.png|500](/img/user/accessory/Pasted%20image%2020250309214514.png)
int 的起始位置  想是4的位置 -- int 4 
double的起始位置 想是8的位置 -- double 8

为什么这么做 -- 硬件问题
简单来说就是不想 让一个double -- 落在了两个 64位 中间
