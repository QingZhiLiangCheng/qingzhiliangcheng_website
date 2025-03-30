---
{"dg-publish":true,"permalink":"/algorithm/Algorithm Princeton/UNIT6 Merge Sort/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-14T18:55:14.964+08:00","updated":"2025-03-30T15:32:40.992+08:00"}
---


![[22Mergesort.pdf]]

### merge sort
主要思路: 将数组一分为二  然后不断将小数组递归一分为二下去  经过一些排序再合并起来
the base idea: merging
理解归并的工作原理 先理解一个idea 叫"place merge"(原位归并)
假如有一个数组 前一半 和 后一半 已经排好序   -- 将两个子数列合并成一个大的排好序的数列
我们需要一个auxiliary array 辅助数组  用于记录数据 -- 这是实现归并的最简单的方式
首先将所有内容拷贝进数组
![Pasted image 20250220184718.png|400](/img/user/accessory/Pasted%20image%2020250220184718.png)
然后以排好序的顺序  放回原数组
需要三个下标  i指向左边子数组  j指向右边子数组  k指向原数组也就是排好序的数列
![Pasted image 20250220185100.png|400](/img/user/accessory/Pasted%20image%2020250220185100.png)
然后取i和j小的数 放入原数组 原本指针递增  两个相同的取前者
![Pasted image 20250220185329.png](/img/user/accessory/Pasted%20image%2020250220185329.png)

Java中的assertion  方便找漏洞并确定算法的正确  并且能够表明要干什么
assert接受一个boolean
默认禁用

递归
![Pasted image 20250220190310.png](/img/user/accessory/Pasted%20image%2020250220190310.png)

关键在于 辅助数组的创建 不要再递归的sort中创建    会多很多小数组的花费
关键的思想用到了*分治法*  分别解决两个小问题 再将他们合并起来

归并排序的轨迹图
![Pasted image 20250220190850.png](/img/user/accessory/Pasted%20image%2020250220190850.png)

![Pasted image 20250220191346.png](/img/user/accessory/Pasted%20image%2020250220191346.png)
哈哈哈这一部分张亚卿老师也讲到了
**analysis of  compares and array accesses**
proposition: use at most $N lg N$compares and $6NlgN$ array access to sort any array of size N.
这里插一句  lgN就是个数  所以$NlgN$是线性的  -- 之前一直没琢磨过来  那天听了张亚卿老师的课 突然明白了
证明这个命题的方法是从之前的代码推出递推关系式
![Pasted image 20250220192053.png|500](/img/user/accessory/Pasted%20image%2020250220192053.png)
从a拷贝到aux算两次数组访问
![Pasted image 20250220193407.png|500](/img/user/accessory/Pasted%20image%2020250220193407.png)

when N is power of 2
我们证明
$$
ifD(N)=2D(N/2)+N, for N>1,with D(1)=0. then D(N)=NlgN.
$$
三种证明方法：
Pf 1.
![Pasted image 20250220194130.png](/img/user/accessory/Pasted%20image%2020250220194130.png)

Pf 2. 偏向数学的方法
![Pasted image 20250220194503.png|400](/img/user/accessory/Pasted%20image%2020250220194503.png)

Pf 3. 数学归纳法
![Pasted image 20250220195056.png|400](/img/user/accessory/Pasted%20image%2020250220195056.png)


**mergesort analysis: memory**
mergesort的一个重要的特点 就是要随N增大而增大的额外空间 因为额外数组的存在
看似是原地  其实并不是真正的“原地”
insert sort 和 shell sort就是真正的原地排序
事实上有人研究出了原地的mergesort  但是太过繁琐 没有被采用

**mergesort: practical improvements**
首先 对于特别小的数组运用归并排序 太过复杂
因为递归的时候 需要一部分开销
跟糟糕的是 不断地递归会分出很多很多小数组
所以第一个改进  切分
improvement1: use insertion sort, and just cut off and use insertion sort which is simple and efficiend for small subarrays.
![Pasted image 20250220200031.png|500](/img/user/accessory/Pasted%20image%2020250220200031.png)
Cutoff to insertion sort for $\approx 7$ items.

improvement2: stop if already sorted.
- 只需要判断前一半最大的数是否小于后一半最小的数
![Pasted image 20250220200501.png|600](/img/user/accessory/Pasted%20image%2020250220200501.png)

improvement3: 改进在于节省下拷贝到辅助数组的时间
在每次递归前 转换一下原数组和辅助数组的角色
![Pasted image 20250220200519.png|600](/img/user/accessory/Pasted%20image%2020250220200519.png)

节省下拷贝的时间
![Pasted image 20250220200630.png](/img/user/accessory/Pasted%20image%2020250220200630.png)

### bottom-up Mergesort
the idea is to 把开始未排序的每一个元素视为已排序的序列 该序列长度为1 然后遍历并合并
先合并成长度为2的子序列 然后合并成长度为4的子序列……
![Pasted image 20250220201315.png|600](/img/user/accessory/Pasted%20image%2020250220201315.png)
![Pasted image 20250220201352.png|600](/img/user/accessory/Pasted%20image%2020250220201352.png)

第一层循环式logN时间复杂度  因为sz是两倍增长
内层循环执行次数$\frac{N}{2\times sz}$
![Pasted image 20250220202120.png|400](/img/user/accessory/Pasted%20image%2020250220202120.png)
????
相对于普通归并排序  负面影响在于 需要额外存储空间， 大小与序列长度有关
![Pasted image 20250220201805.png|300](/img/user/accessory/Pasted%20image%2020250220201805.png)

### sorting complexity
排序问题自身固有的难易程度  称为复杂性
讨论它   --  我们一直讨论的是上界
现在要去寻找下界  -- 这是成本保证的界限
计算模型 -- 决策树   成本模型--比较次数 因为在排序中唯一访问数据的方法是比较
归并排序提供了，提供了一个上界 它是一个保证排序完成的时间与 N log N成正比的算法。我们现在要研究的是下界，有一个 不重要的下界，即你必须查看所有的数据时，下界为N，我们将 寻找更优的下界并且将看到归并排序是最优的（算法）

证明排序下界的基本思想
![Pasted image 20250302103204.png|500](/img/user/accessory/Pasted%20image%2020250302103204.png)

high of tree = worst-case number of compares
决策树证明 排序算法的比较在最差情况下不得不使用至少$log_2N$因子的比较次数
根据斯特林近似公式 --  $lg(N!)$ 跟$NlgN$成正比
![Pasted image 20250302103934.png|500](/img/user/accessory/Pasted%20image%2020250302103934.png)

![Pasted image 20250302104614.png|500](/img/user/accessory/Pasted%20image%2020250302104614.png)

首先决策树 是一棵二叉树
一棵高为h的决策树（二叉树） 最多有$2^h$个叶子结点 --  **高度从1开始的**
叶子节点数小于$N!$  -- 因为N个不同元素  又$N!$个不同的排列方式
联立方程
$$
\begin{cases}
L\geq N! \\
L\leq 2^h
\end{cases}
$$
合并
$$
N! \leq 2^h
$$
取对数
$$
h\geq log_2(N!)
$$
![Pasted image 20250302110006.png|500](/img/user/accessory/Pasted%20image%2020250302110006.png)

![Pasted image 20250302110037.png|400](/img/user/accessory/Pasted%20image%2020250302110037.png)
对于merge sort来说 upper bound = lower bound  那么确实是 最好的算法了
对于比较来说 merge sort确实是最优的
但对于空间来说  mege sort并不是最优的 -- 多使用一倍额外空间 -- 正比于要处理的数组的大小
### comparators
排序器 -- java的一种机制
the same data on different sort keys, different orders.
比如
![Pasted image 20250302110812.png|400](/img/user/accessory/Pasted%20image%2020250302110812.png)
![Pasted image 20250302110822.png|400](/img/user/accessory/Pasted%20image%2020250302110822.png)
这是分别对aritist 和  name的排序 
为了实现对任何type of data都能排序  我们需要使用java的 comparable interface
natural order
![Pasted image 20250302111041.png|400](/img/user/accessory/Pasted%20image%2020250302111041.png)
但还有一种机制叫做 comparator interface
alternate order
![Pasted image 20250302111209.png|400](/img/user/accessory/Pasted%20image%2020250302111209.png)

| **特性**​      | ​**`Comparable`**​       | ​**`Comparator`**​                   |
| ------------ | ------------------------ | ------------------------------------ |
| ​**实现位置**​   | 类内部（需修改源码）               | 类外部（无需修改源码）                          |
| ​**排序规则数量**​ | 只能定义一种默认排序               | 可定义多种排序规则                            |
| ​**方法名**​    | `compareTo(T o)`         | `compare(T o1, T o2)`                |
| ​**排序调用方式**​ | `Collections.sort(list)` | `Collections.sort(list, comparator)` |
| ​**适用场景**​   | 类有自然排序（如数值、字典序）          | 需要灵活或多种排序逻辑                          |
| ​**功能扩展**​   | 无                        | 支持链式比较（如先按年龄，再按姓名）                   |
写一个比较器  作为第二个参数传进去
![Pasted image 20250302113003.png|500](/img/user/accessory/Pasted%20image%2020250302113003.png)

之前的极角问题
![Pasted image 20250302113123.png|500](/img/user/accessory/Pasted%20image%2020250302113123.png)
![Pasted image 20250302113052.png|500](/img/user/accessory/Pasted%20image%2020250302113052.png)

### stability
![Pasted image 20250302113519.png|700](/img/user/accessory/Pasted%20image%2020250302113519.png)
所谓的稳定性 就是在前面的排完序还是在前面
So a stable sort is a sort that preserves the relative order of items with equal keys.
![Pasted image 20250302114051.png|500](/img/user/accessory/Pasted%20image%2020250302114051.png)
之前学过的排序
insertion sort and mergesort are stable but not selection sort or Shellsort.

**insertion sort**
这里涉及到insertion sort的基本思想   如果比前面一个数小才交换
![Pasted image 20250302115416.png|500](/img/user/accessory/Pasted%20image%2020250302115416.png)

**selection sort**
![Pasted image 20250302115517.png|500](/img/user/accessory/Pasted%20image%2020250302115517.png)
因为存在交换  -- 所以可能 把b1 换到后面去了

**shell sort**
有长距离交换
![Pasted image 20250302115821.png|500](/img/user/accessory/Pasted%20image%2020250302115821.png)

**mergesort**
取决于编码方式
如果key相等 从左边的数组取出  那就稳定
![Pasted image 20250302115942.png|500](/img/user/accessory/Pasted%20image%2020250302115942.png)
