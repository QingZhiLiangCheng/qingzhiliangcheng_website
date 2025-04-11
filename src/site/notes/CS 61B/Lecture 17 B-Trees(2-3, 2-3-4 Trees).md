---
{"week":"第七周","dg-publish":true,"permalink":"/CS 61B/Lecture 17 B-Trees(2-3, 2-3-4 Trees)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:39:03.320+08:00","updated":"2025-04-11T08:42:10.686+08:00"}
---

### Binary Search Trees
**Tree Height**
In the best case, our tree will have height Θ(logN), whereas in the worst case our tree has a height of Θ(N)
最坏的情况是一直是左子树或者右子树

Consider the following statements about BSTs. Which of the following are true?
1. The worst-case height of a BST is Θ(N).
2. BST height is O(N).
3. BST height is O($N^2$).

事实上这三个说法都对
但是第一个说法是更准确的
Θ(N)给出的是upper bound 和 lower bound之间  --  只能表示线性关系
而O(N) O是上界 所以可能意味着线性 对数 平方根 或者 常数

但是我们一般都是用O的原因是
1. 我们一般会选择最小的上限
2. 更广泛的陈述 -- 二分查找O(log N)是对的  但说Θ(logN)就不对 因为Θ(logN)只能表示线性关系 但二分查找有时候是常数
3. 有时候确切的运行时间是不确定的或者说很难确定 -- 这种情况下 我们一般会使用O提供一个广义的上限

### B-Tree Operations
**Height and Depth**
- height: 最深的节点的深度 -- 属于是树的属性
- depth: 从特定节点到根节点的**距离** -- 是一个节点特定的属性 -- 因为是距离 所以根节点的深度就是0
- average depth: 树的平均深度是每个节点深度的平均值
![Pasted image 20250409144449.png|500](/img/user/accessory/Pasted%20image%2020250409144449.png)

高度和平均深度决定了BST操作的平均时间
- 高度决定了查找节点的最坏运行时间
- 平均深度决定了操作的平均情况运行时间

插入节点的顺序对二叉搜索树的高度和平均深度有重大影响
比如 如果插入顺序是1, 2, 3, 4, 5 那么这棵树就是一个一直右子树的树 height: 4, average depth: 2
虽然有证明可以证明随机生成的插入顺序 具有 logN的高度和平均深度
但是并不总是可以随机插入顺序
而且也不一定是最优的一棵bushy tree

所以我们需要一种方法来搜索树的bushiness -- 茂密性
引出了B-Trees

### B-Trees
![Pasted image 20250409151215.png|300](/img/user/accessory/Pasted%20image%2020250409151215.png)
在这个例子中 如果我按照BST的规则 插入17 18 19 那么就会变得右子树很长 显然不是我们想要的
一个简单的思路是我们发现树变长时因为增加了新的节点 如果不添加子节点 那么树的深度和高度就不会增加 -- 所以一个可能的新的规则是 将16 17 ... 放入同一个节点中
但是问题是 如果一个节点中的数太多  就势必要在节点中遍历找这个数 其实还是O(n) （当然这里我们可以采用二分查找复杂度会更低）
所以我们要设置一个限制 比如说L=3的时候就分裂
哪一个？  这里一个很奇怪的想法是 拿中间 其实也合理 left-middle -- 17
![Pasted image 20250409151824.png|300](/img/user/accessory/Pasted%20image%2020250409151824.png)
![Pasted image 20250409151847.png|300](/img/user/accessory/Pasted%20image%2020250409151847.png)
但是这又违背了BST的性质
第三个想法是 If any node has more than L items, give an item to parent.
再分裂 --变成多叉树了
这里有一个很好的解释: 小于15的在左边 15 17之间的在中间 大于17的在右边
![Pasted image 20250409152654.png|300](/img/user/accessory/Pasted%20image%2020250409152654.png)
其实本质上还是BST搜索的思想 略有变化
![Pasted image 20250409152941.png|500](/img/user/accessory/Pasted%20image%2020250409152941.png)

if the root is full?
![Pasted image 20250409153142.png|300](/img/user/accessory/Pasted%20image%2020250409153142.png)
![Pasted image 20250409153146.png|300](/img/user/accessory/Pasted%20image%2020250409153146.png)

所以这种分裂数具有完美的平衡性
如果我们分裂根节点，每个节点都会下降一个级别。 如果我们分裂叶节点或内部节点，则高度不会改变。 永远不会发生导致不平衡的变化。
这种数据结构的真正名称是 B 树。 每个节点限制为 3 个项目的 B 树也称为 2-3-4 树或 2-4 树（一个节点可以有 2、3 或 4 个子节点)
B树主要用于两种特定情况：第一种，L较小，用于概念上平衡搜索树；第二种，L达到数千，用于包含大型记录的数据库和文件系统。

summary
B-Tree的特性:
- 所有叶节点到根节点的距离相同 -- 因为不允许直接创建新的叶子结点 本质上是攒一会儿一起分裂的那种感觉
- 一个包含k个项的非叶节点必须正好有k+1个子节点
完美平衡

### B-Tree Performance
- Worst: $log_2N$ -- each node has 1 item
![Pasted image 20250411082819.png](/img/user/accessory/Pasted%20image%2020250411082819.png)
- best: $log_{L+1}N$ -- 假设L是每个node的最大数据量
![Pasted image 20250411082908.png](/img/user/accessory/Pasted%20image%2020250411082908.png)
总高度始终在logN量级
#### Runtime for contains
在最坏的情况下，我们必须检查每个节点最多𝐿个项目。我们知道高度是对数的，所以contains的运行时间受𝑂(𝐿log𝑁)限制。由于𝐿是一个常数，我们可以删除乘法因子，从而得到𝑂(log𝑁)的运行时间。

#### Runtime for  add
对于添加操作，可以进行类似的分析，但我们需要考虑必须拆分叶节点的情况。由于树的高度为𝑂(log⁡𝑁)，最坏情况下，我们需要进行log⁡𝑁次拆分操作（从叶节点到根节点的级联）。这只是在我们的运行时间中增加了一个log⁡𝑁的加性因子，因此总运行时间仍然是𝑂(log⁡𝑁)。
也是常数倍的logN