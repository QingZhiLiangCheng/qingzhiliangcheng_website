---
{"dg-publish":true,"permalink":"/algorithm/Algorithm Princeton/UNIT5 Elementary Sorts/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-20T19:20:15.331+08:00","updated":"2025-03-30T15:32:35.190+08:00"}
---


![[21ElementarySorts.pdf]]
the sort problem is re-arrange an array of n items into ascending order according to a defined key which is part of the item.
our goal is to be able to sort any type of data

how can we make it so that we can implement one sort program that can be used by different clients to implement different types of data.
In the way that, that happends is a mechanism known as a callback.

how to compare data of all those different types without being given any information about the type of an item's key? And the answer is that what is we set up a mechanism known as a callback or reference to executable code where the client, by passing an array of objects to the sort function.
In Java, there's an implicit mechanism that says that any such array of objects is going to have the compareTo() method, then the sort function calls back the compareTo() method associated with the objects in the array when it ever needs, whenever it needs to compare two items.

there's a lot of different ways to implement callbacks and that's programming language specific. Different languages have different machanisms.
![Pasted image 20250120193523.png|400](/img/user/accessory/Pasted%20image%2020250120193523.png)
在java中，当一个类实现了`Comparable<T>`接口时，它必须定义一个`compareTo(T other)`方法 来决定顺序
![Pasted image 20250120194320.png](/img/user/accessory/Pasted%20image%2020250120194320.png)

在cpp中 我们可能用的是一个函数  一般写在sort的最后面
It's all about the idea of passing functions as arguments to other functions

 compareTo() method has to implement in the so called a total order(全序关系----对应学过的一个叫偏序关系)
 ![Pasted image 20250120194757.png|500](/img/user/accessory/Pasted%20image%2020250120194757.png)
### selection sort
核心：在未排队的项中找到最小的，然后与未排序的第一项交换
![Pasted image 20250125125440.png](/img/user/accessory/Pasted%20image%2020250125125440.png)
![Pasted image 20250125125736.png|400](/img/user/accessory/Pasted%20image%2020250125125736.png)
箭头左边的都已经排好序了  箭头右边的都比左边的大 但是未排序
算法就是找到箭头右边的最小项 然后和箭头右边的下一项交换位置
![Pasted image 20250125125947.png](/img/user/accessory/Pasted%20image%2020250125125947.png)

![Pasted image 20250125130105.png](/img/user/accessory/Pasted%20image%2020250125130105.png)

比较次数：数学模型：
$(N-1)+(N-2)+...+1+0 == \frac{N^2}{2}$
![Pasted image 20250125130411.png|400](/img/user/accessory/Pasted%20image%2020250125130411.png)
大约就是$\frac{N^2}{2}$，半个N边长的正方形

- 选择排序与输入的序列本身的顺序无关 因为无论如何都要去比较所有未排序的项
- 选择排序已经是移动开销最小的了  只需要线性次数的交换

### insertion select
未排序都不去看 拿一张 然后 像插牌一样 插入前面排好序的牌  但是注意是从最后面往前比
换句话说就是拿未排序的第一张牌加入排序的牌  然后只要左侧相邻的牌更大 就一直交换

![Pasted image 20250125132916.png|400](/img/user/accessory/Pasted%20image%2020250125132916.png)
![Pasted image 20250125132954.png](/img/user/accessory/Pasted%20image%2020250125132954.png)

![Pasted image 20250125133015.png|500](/img/user/accessory/Pasted%20image%2020250125133015.png)

平均要移动一半才能到达正确位置  所以大约是正方形一半的一半 $\frac{1}{4}N^2$
![Pasted image 20250125133254.png|500](/img/user/accessory/Pasted%20image%2020250125133254.png)

插入排序的运行时间取决于数据开始的顺序
- 如果本来有序  只需要比较N-1次
- 如果本来就是倒序  就是$\frac{1}{2}N^2$比较和$\frac{1}{2}N^2$次交换

部分有序的情况
我们定义inversion(逆序对)
A E E L M O T R X P S  六个inversion
T-R T-P T-S R-P X-P X-S
部分有序：逆序对的数量是线性的  或者说是比cN小
An array is partially sorted if the number of inversion is <= c N.

插入排序有趣的地方在于  对于部分有序的序列 运行时间是 线性的
Number of exchanges equals the number of inversions.
number of compares = exchanges + (N – 1)

### shellsort
希尔排序的出发点其实就是插入排序
插入排序每次只能移动一个位置 而希尔排序的思想是每次会将数组项移动若干位置-- 这种操作方式叫做h-sorted the array.
h-sorted array 包含h个不同的交叉的有序子序列
![Pasted image 20250206202409.png|400](/img/user/accessory/Pasted%20image%2020250206202409.png)
![Pasted image 20250206202523.png|400](/img/user/accessory/Pasted%20image%2020250206202523.png)

对序列进行m排序--插入排序 -- 但是之前是往前走一个  现在往前走h个
![Pasted image 20250206202711.png|300](/img/user/accessory/Pasted%20image%2020250206202711.png)

**why insertion sort?**
- 如果h很大 那么进行排序的子数组的长度就很小--任何一种排序性能都会很好
- 如果h很小  由于之前我们已经用过h-sort了  所以数组是部分有序的  使用插入排序就会很快

![Pasted image 20250206203309.png](/img/user/accessory/Pasted%20image%2020250206203309.png)
事实上最后的1-sort  就是普通的插入排序  只不过因为部分有序  变得效能更好了

事实证明 g-有序的数组经过h-排序后依然是g-有序的

shellsort的一个问题是  **which increment sequence to use?**

choice 1: maybe is powers of two
不行  在进行1-排序之前不会将偶数位数的元素和奇数位置的元素进行比较  --  那么1-sort 性那你就很差

choice 2: powers of two minus one.
maybe
希尔自己提出来的用power of two + 1

后来有人提出来用3x+1

对于增量序列一直困扰了人很久
这是老师经过研究了一年后得到的一个序列  very good的性能
![Pasted image 20250206204021.png](/img/user/accessory/Pasted%20image%2020250206204021.png)



![Pasted image 20250206204253.png](/img/user/accessory/Pasted%20image%2020250206204253.png)

性能分析：
对于3x+1 增量 最坏情况下的比较次数是$O(N^{\frac{3}{2}})$ (积分)
实际应用比这个小   --  问题是没有精确的模型 没有人知道描述使用任何一种有效的增量序列的希尔排序需要进行多少比较次数

一般认为是 c N lg N

**why are we interested in shellsort?**
- 小数组的时候 可以胜过经典的复杂方法
- 代码量不大
- 通常应用于嵌入式系统或硬件排序类的系统
- 找一个更好地增量序列

### Application 1: Shuffle sort
洗牌
为每一个数组元素产生一个随机实数 --  利用随机数排序   
![Pasted image 20250206205510.png](/img/user/accessory/Pasted%20image%2020250206205510.png)
![Pasted image 20250206205521.png](/img/user/accessory/Pasted%20image%2020250206205521.png)

证明 在输入中没有重复值 并且 可以产生均匀随机实数的情况下 --》 能够产生一个均匀的随机序列

但是似乎排序对于这个问题来说有些累赘

更好地方法   only 线性
每次在0和i之间挑选一个整数  然后将`a[i]`和这个数代表的元素交换
![Pasted image 20250206210302.png|500](/img/user/accessory/Pasted%20image%2020250206210302.png)
这段代码平平无奇  但确实标准随机类中的一段代码

![Pasted image 20250206210556.png](/img/user/accessory/Pasted%20image%2020250206210556.png)
不够均匀  但是上面的算法 被证明了可以均匀
### Application 2: Convex hull
计算集合例子
平面上有一个N个点构成的几何  从几何角度 我们可以找到一个 ”凸包“ -- 也就是能包含所有点的最小的凸多边形
事实证明 由点构成的所有集合都有凸包
![Pasted image 20250214175531.png|200](/img/user/accessory/Pasted%20image%2020250214175531.png)

我们要做的是编写一个程序   对于给定的点集生成它的convex hull
application 1: 如果一个机器人 从s去t点：  最短路径 -- convex hull
![Pasted image 20250214175924.png|300](/img/user/accessory/Pasted%20image%2020250214175924.png)
application 2: 找点集中距离最远的两点
![Pasted image 20250214180136.png|300](/img/user/accessory/Pasted%20image%2020250214180136.png)
最远的两点 就是 convex hull 上的 两点  -》 可以根据convex hull的特性来编写程序

convex hull的特性 geometric properties
- 能使用逆时针或者是左转的方式来穿过凸包
- 如果选择在y轴上坐标最小的点 也就是最低点  作为p点   从x轴的p点指向每个点 极角是递增的
![Pasted image 20250214180752.png|400](/img/user/accessory/Pasted%20image%2020250214180752.png)

the algorithm that we're going to look at, called the Graham scan
- 选择p点
- 排序 极角
- 舍弃无法直接逆时针旋转的点
![Pasted image 20250214183506.png|300](/img/user/accessory/Pasted%20image%2020250214183506.png)

implementation challenges:
Q: How to find point p with smallest y-coordinate?
	排序
Q: How to sort point
	Define a total order for each point p.
Q: 怎么判断是否左转？
	几何性质 后面讲

**ccw**
![Pasted image 20250214184451.png](/img/user/accessory/Pasted%20image%2020250214184451.png)

![Pasted image 20250214184610.png|500](/img/user/accessory/Pasted%20image%2020250214184610.png)
基本思想是计算 a与b连线的斜率  b与c连线的斜率 
![Pasted image 20250214185011.png|500](/img/user/accessory/Pasted%20image%2020250214185011.png)

![Pasted image 20250214185119.png|500](/img/user/accessory/Pasted%20image%2020250214185119.png)