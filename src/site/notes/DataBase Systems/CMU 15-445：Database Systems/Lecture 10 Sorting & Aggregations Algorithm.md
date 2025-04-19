---
{"week":"第六周","dg-publish":true,"tags":["week6","cmu15445"],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 10 Sorting & Aggregations Algorithm/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-06T17:46:28.144+08:00","updated":"2025-04-19T09:54:53.261+08:00"}
---


![[10-sorting.pdf]]

Operator Excution 操作符执行引擎
![Pasted image 20250306075923.png|200](/img/user/accessory/Pasted%20image%2020250306075923.png)
在这个阶段查询已经开始  查询已经开始 基本上已经有了优化规则  现在面临的情况必须执行该查询中的操作符
未来四个lecture课程中  我们会探讨操作符的算法 --  这些算法最终会使用到access methods

what happends to the query after it's been parsed.
![Pasted image 20250306081307.png|300](/img/user/accessory/Pasted%20image%2020250306081307.png)
这里有一个查询 在将此查询交给database engine后  通过syntactical parser(语法解析器)检查 虽然转换成关系代数的形式  而这种形式就是被优化的对象
优化在后续讨论
今天的lecture 假设已经为查询构建了一种树形表示 --  树节点为操作符
对于这个查询例子来说
关系r作为输入传递给连接操作符  连接条件要求r表和s表的id字段相等   s表正在被扫描 选择value>100的记录 仅有>100的记录会被发送到连接操作符
现在如果再此基础上构建了索引  那么该索引将会被使用 （前面的lecture  b+tree已经讲了索引的原理
最后是送入了一个投影运算符

 对于这个查询的树形结构 通常情况下 可能是一个有向无环图(DAG)
 可能存在一部分查询  连接操作符的输出会被发送到另一个子树中 所有子树在生成最终输出之前汇聚在一起
 涉及到嵌套查询时，会用到公共表达式表(CTEs), 通常最终生成一个类似于有向无环图的结构
 最坏复杂度--有向无环图

我们试图通过这些操作符的算法实现什么目标？
1. 我们希望我们的操作符算法能够处理无法完全装入内存的数据
2. 我们希望利用可用内存，而这种内存以缓冲池的形式存在  而这里就是我们将在缓冲池中引入页面的地方 会采用某种缓冲区替换策略 
3. 我们还将首选最大化顺序 I/O 数量的算法

sort and aggregation operations in today's lecture.

**sort**
关系模型 基于关系代数   关系代数 基于 集合论  集合本身 无序
**why  do we need to sort?**
sql允许 order by   我们需要order by 一些东西
排序可能会使得distinct, group by等更加简单
在后面讲聚合的内容时   会讲基于排序的方法  基于哈希的方法   并比较
**in-memory sorting**
If data fits(可完全存入内存), then we can use a standard sorting algorithm like Quicksort.
内存内排序 大多数database system 都采用了Quicksort
但不完全是快排  快排会找一个枢纽点  并对两侧进行排序  如果一侧的数据量变得很小  可能会改用插入排序  因为数据量极小的时候  插入排序要快得多

在数据平台中 尤其是python,他在数据科学领域非常流行，我们所见的许多数据科学笔记本经常与关系数据库连接  比如notion？  一般都用python  可以把数据导入python数据结构 并且python内置了默认的排序机制   叫TimSort
TimSort是插入排序与二分排序的结合体

sort algorithms Animations 网站
[Sorting Algorithms Animations | Toptal®](https://www.toptal.com/developers/sorting-algorithms)
https://visualgo.net/en/sorting
排序算法的核心在于  哪种算法胜出将取决于数据分布以及算法本身的固有特性

**Top-N Heap Sort**
![Pasted image 20250306092939.png|300](/img/user/accessory/Pasted%20image%2020250306092939.png)
order by     前4条
还有一个可选语句 with ties  意思是如果在最前面四行中有任何并列情况 就应该把所有并列的记录都给出  所以如果该表的记录数超过四条  最后的输出至少四条
heap sort的原理都很清晰了
值得注意的一个点是到9的时候  因为比四个最小的数里面最大的数6大了 所以可以直接跳过
![Pasted image 20250306093258.png|200](/img/user/accessory/Pasted%20image%2020250306093258.png)
所以  我们在数据库环境中实现内存排序等 由于存在一些语义  所以我们需要再基本排序的原理上 自行调整修改
后面还会扩展

**external merge sort**
当一个表的记录数量远超内存容量时 如何排序？
许多算法 -- called  external memory sort algorithm --  基于分治的思想  divide and conquer
由于没法把所有的内容都加载到内存 -- 将其分割成若干较小的部分 -- 单独处理每个部分 并确保最终能汇总生成输出结果

我们在排序的时候会有一些中间文件   这些中间文件写入的是哪些内容？
Choices 1: Tuple   ---  key and tuple/value --- early materialization -- 早期物化
Choices 2: Record ID -- late materialization -- 延迟物化   获取key  并存储 指向记录的指针
显然Choice2 从空间角度来说 更优  但 可能会导致大量的随机IO操作  因为我们在排序过程中  要多次遍历 
行存储：Choice 1
列存储：Choice 2
因为列存储本来就没把数据放到一起     不妨将拼接工作稍后进行
![Pasted image 20250310213614.png|400](/img/user/accessory/Pasted%20image%2020250310213614.png)

**2-way external merge sort**
假设我们有一个包含n页数据的数据集  以及 b页 的缓冲池  n远大于b
从简单的二路归并开始 --  逐渐推广
假设8个page  每个page两个记录  呃呃  当然不可能这么少  假设b是3个page
最后一个是一个虚拟页 -- 仅用于标示文件的结束
每一遍排序都会读取上一遍内容 写入新数据 写入数据的时候采用的是上面介绍的early materialization或者late materialization的格式
第一遍完全就是每个page自己排序  page内你可以采用你想用的排序方式

第二遍开始合并两个page为一个大项
page1 page2进入内存  占用buffer pool的两个位置  另一个位置留给输出的page
在每个页面开始都有一个游标 -- 输出最小的然后移动游标 -- 就是merge sort的步骤
而生成的一个大page 实际上是两个标准的小page 然后选择 移动游标 选择 移动游标  当前一半  也就是一个标准page满了就会写入disk  剩下的用第二个标准page存储

所以现在由完全未排序 -> 单个page排序 -> 一对page 跨页排序

4-page Runs 的时候  第一对 的第一个page（例子中2,3）进入bufferpool  第二对的第一个page（例子中4,7）进入bufferpool   先给两个最小的页面进行合并 当一个page扫描完了 就放入这一对的另一个page 继续扫描
比如在这个例子中 2和4比 2写入新页面 游标移动 3和4比 3写入新页面 新页面满了  存入内存 2,3 页面也遍历完了  所以4,6 页面进入 -- 继续扫描
![Pasted image 20250310220541.png|600](/img/user/accessory/Pasted%20image%2020250310220541.png)
二叉树 -- number of passes
IO操作 2N -- N是 每个页面的页面数  一次扫描一次写入

改变N -- 加速过程
如果bufferPool能放入5个page  这个时候是四路归并排序 -- 我们就可以分割这颗树  直接就读取四个page直接排序 --  直接就跳过了上面这棵树的Pass 0 和 Pass1 -- 减少两轮遍历
实际上扩宽了树的结构
![Pasted image 20250311160624.png|400](/img/user/accessory/Pasted%20image%2020250311160624.png)

![Pasted image 20250311161125.png|500](/img/user/accessory/Pasted%20image%2020250311161125.png)

如果绘制这个对数函数  会发现对于较大的n值  即使增加n 所需的遍历此时不会显著改变 它将以阶跃函数的方式跳跃  如果情况确实如此 即使给p页或者这些页的一半 对于整个n值范围 所需的遍历次数可能保持不变

这意味着，在给定固定数量的缓冲页面 B 的情况下，即使数据集 N 显著增大，只要这种增大不导致 ⌈N/B⌉ 跨越到对数函数的下一个整数级，那么所需的遍历次数将保持不变。换句话说，对于特定范围内的 N 值，无论 N 在该范围内如何变化，所需的遍历次数都是相同的。
例如，如果 B=100，则⌈N/100⌉ 需要达到下一个100的倍数才会导致遍历次数增加。因此，在某个范围内，增加 N 并不会显著改变所需的遍历次数，直到 N 的增加足够多以至于跨越了对数函数的下一个整数级。

**Double Buffering Optimization**
因此 在许多情况下  进行Double Buffering Optimization(双缓冲)优化 是有意义的
双缓冲的核心在于  它会尝试利用缓冲池，并非使用所有页面 而是仅使用其中一部分来进行一次遍历 同时其他部分正在准备中
![Pasted image 20250311162037.png|600](/img/user/accessory/Pasted%20image%2020250311162037.png)
假设我们bufferpool=8  我们本可以做7路归并排序
但从另一个观点看  当page从磁盘拿入bufferpool的时候 只有IO总线忙  CPU实际上在处于空闲状态， 当开始归并排序的时候 总线没有进行操作  仅有CPU在执行任务
并且发现增大N 没啥用
所以就会采用double buffering optimization的方法  分成两组 每一组4个page槽 三个放入page 一个作为输出
再第一组再合并的时候  放入第二组 

**Comparison Optimization**
降低操作延迟 --  Comparison Optimization
Approach 1: Code Specialization
Instead of comparison function as a pointer to sorting alogrithm, create a hardcoded version of sort that is specific to a key type.
实现特定类型的排序  比如说日期
如果使用cpp  也可以使用函数模版

Approach 2: Suffix Truncation
string keys  -- 对整个字符串进行比较
字符串很长  按位比较可能会比较慢
一种广泛的代替技术是获取key在某种编码固定长度形式中的表示 -- 通常类似于该字符的64位编码  并且这个编码仅仅是字符串的前缀
所以可以先比较前缀 -- 如果一样 -- 在回退到原字符串 比较原字符串


**using b+tree for sorting？**
可以使用b+tree
但是必须注意b+tree的类型
b+tree 分为两种形式
- clustered   聚簇型
- unclustered 非聚簇型
聚簇指的是图片中灰色区域所示的B树叶子层级中的记录ID 通常会遵循存储在磁盘上的页面的记录ID 如果拥有一个聚簇b tree , 那么只需对key进行排序
![Pasted image 20250311190637.png|400](/img/user/accessory/Pasted%20image%2020250311190637.png)
假设是依据studentID构建  当查询要求按studentID排序时 无需额外排序  只需从最左边的叶子结点开始  从左到右排序检索该节点中的记录 提取指针  就能获得输出结果（不过之前我记得也有叶子结点存的就是tuple本身的）
比如图中 前三个键都属于101页
所以实际上只要访问b树最底层（有哪个页面的指针）一次 每个页面一次  就能完成排序
比外部排序快

若为非聚簇B树  除非在B树上有范围选择谓词  否则使用可能不是明智之举
![Pasted image 20250311191221.png|400](/img/user/accessory/Pasted%20image%2020250311191221.png)
不得不跟踪key的路径   随机IO  浪费资源    外部排序更好


所以说如果你想要排序的那个属性 有聚簇b树  就是用b树来获取排序  如果没有聚簇b树 使用外部排序算法更有利


**Aggregation**
开始考虑不同的算法    开始考虑哈希技术
![Pasted image 20250311191821.png|500](/img/user/accessory/Pasted%20image%2020250311191821.png)
这是一个聚合的例子
选择操作->投影->排序（上面将的排序）-> 消除重复项（游标跳过）
![Pasted image 20250311192045.png|600](/img/user/accessory/Pasted%20image%2020250311192045.png)
有一个优化
再合并的时候 碰到相同的 游标略过


基于排序方法 --  基于哈希方法   二元对立

GROUP BY 或 DISTINCT 不需要数据有序
再次情况下 哈希法几乎是更优的选择
如果我有一个聚簇b tree 可能会直接利用b tree ， 哈希可能不是一个好的选择

**External Hashing Aggregate**
分而治之
Phase 1: 分解文件 -- 尽可能小的分解  能够放入内存中
Phase2: 重新散列 ReHashing 针对每个分区进行操作 -- 内存中

Phase 1: Partition
仍然是B buffers page -- use B-1 留一个当输出
![Pasted image 20250311193612.png|500](/img/user/accessory/Pasted%20image%2020250311193612.png)
很多数据 内存放不下  应用哈希函数 创建不同的 分区文件 创建B-1 个分区文件
读取一条数据 哈希  放入对应的分区文件中
保证了相同的cid放入了同一个bucket

Phase 2: ReHash
使用第二个Hash函数
![Pasted image 20250311194558.png|500](/img/user/accessory/Pasted%20image%2020250311194558.png)

注意在对每个哈希 建立 hashtable  哈希完了 存入 输出  然后清空整个hash table 换下一个分区

如果哈希完了 好多项  内存中的hash table放不过来 怎么办
Choice1:  在分区
Choice2: 采用排序算法实现这一分区

分组  连接  计算平均值
![Pasted image 20250311200908.png](/img/user/accessory/Pasted%20image%2020250311200908.png)

