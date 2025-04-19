---
{"week":"第七周","dg-publish":true,"tags":["cs61b","week7"],"permalink":"/CS 61B/Lecture 18 Tree Rotation and Red Black Trees/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T11:07:21.076+08:00","updated":"2025-04-19T09:51:50.119+08:00"}
---

### Rotating Trees
B-tree的代码实现并不容易 要判断节点中item的个数
today -- 受b-tree的启发 来学习一个容易实现的结构
如果我们有一个BST有1, 2, 3三个item  -- 会发现中间那个是我们最想要的形状
![Pasted image 20250411091209.png](/img/user/accessory/Pasted%20image%2020250411091209.png)
所以我们有一个想法是加入item后给他旋转成中间的形状
旋转背后的思想是 它是一种可以在不同的二叉搜索树之间进行转换的操作 -- 这些二叉树都代表着相同的事物 只是结构不一样 可以改变数的结构 使得更矮

为了旋转 需要说明两件事
- 左旋还是右旋
- 在哪个节点上旋转
```
rotateLeft(G): Let x be the right child of G. Make G the new left child of x.
```

```
rotateRight(G): Let x be the left child of G. Make G the new right child of x.
```

**rotateLeft(G):**
![Pasted image 20250411112046.png](/img/user/accessory/Pasted%20image%2020250411112046.png)
- G要向左倾斜
- 谁当new root: P
- 当P一上去之后 P会变成三个孩子 -- 但是注意到原来G也是两个孩子的 所以个k给G当他的新的右孩子
或者我么假设GP短暂合并 就很清楚为什么k变成G的新右子树了

**rotateRight(G):**
![Pasted image 20250411093113.png|600](/img/user/accessory/Pasted%20image%2020250411093113.png)


**LR rotate**
![Pasted image 20250411093523.png](/img/user/accessory/Pasted%20image%2020250411093523.png)
**Rotation for Balance**
![Pasted image 20250411093728.png|500](/img/user/accessory/Pasted%20image%2020250411093728.png)
简单证明了能保持平衡
有证明Rotation allows balancing a BST in O(N) moves.

后面会讲怎么选择在哪个点上旋转

### Creating LLRB Trees
LLRB: Left Leaning Red-Black Trees: 左倾红黑树
在之前 学到了BST但BST不一定保持平衡； 学到了2-3tree 但是实现比较难
this lecture 专注于一种使用BST实现 但结构上与2-3tree完全相同 保持平衡的树
我们将通过观察2-3树，并思考我们可以进行哪些修改，从而将其转换为BST来创建这棵树。
对于只有2-节点的2-3树（具有2个子节点的节点），我们已经有了一个BST，所以我们不需要进行任何修改！
但是，当我们得到一个3-节点时会发生什么？
我们可以做的一件事是创建一个“胶水”节点，该节点不包含任何信息，仅用于显示其2个子节点实际上是一个节点的一部分。
![Pasted image 20250411101327.png](/img/user/accessory/Pasted%20image%2020250411101327.png)
然而，这不是一个优雅的解决方案，因为我们会占用更多的空间，而且代码会很丑陋。因此，我们将使用胶水链接来代替胶水节点！
为了将虚拟粘合节点转换为粘合链接，我们任意选择将左侧元素作为右侧元素的子节点。这导致产生一个左倾树。
![Pasted image 20250411101557.png](/img/user/accessory/Pasted%20image%2020250411101557.png)
我们通过将连接设为红色来表示该连接是胶连接。普通连接是黑色的。因此，我们将这些结构称为左倾红黑树（LLRB）。在本课程中，我们将使用左倾树。
左倾红黑树与 2-3 树有一一对应关系。 每个 2-3 树都有一个唯一的与之关联的 LLRB 红黑树。
至于 2-3-4 树，它们与标准红黑树保持对应关系
![Pasted image 20250411102532.png](/img/user/accessory/Pasted%20image%2020250411102532.png)
**Properties**
与 2-3 树的 1-1 对应关系。
没有节点有 2 个红色链接。
没有红色右链接。
从根到叶的每条路径都具有相同数量的黑色链接（因为 2-3 树到每个叶子的链接数量相同）。
高度不超过对应 2-3 树高度的 2 倍 + 1。
![Pasted image 20250411103116.png|500](/img/user/accessory/Pasted%20image%2020250411103116.png)
最高: 全是三节点
![Pasted image 20250411102852.png|500](/img/user/accessory/Pasted%20image%2020250411102852.png)
红黑树的高度与条目数的对数成正比。
### Inserting LLRB Trees
我们总是可以通过插入到2-3树中，然后像之前那样转换它来插入到LLRB树中。然而，这与我们创建LLRB的初衷背道而驰，因为我们创建LLRB是为了避免2-3树的复杂实现！
相反，我们像处理普通BST一样插入到LLRB中。然而，这可能会打破其与2-3树的1-1映射，因此我们将使用旋转来将树恢复到正确的结构。
我们插入总是以红色连接添加 -- 是因为在2-3tree中我们添加的时候是把这个元素加入到node中
但有时，在某些地方插入红色链接可能会导致我们打破LLRB（左倾红黑树）的一些不变性。
**Case1: Insertion results in a learning**
rotateLeft(node)
![Pasted image 20250411112120.png](/img/user/accessory/Pasted%20image%2020250411112120.png)
**Case 2: Double Insertion on the Left**
rotateRight(Z)
![Pasted image 20250411112138.png](/img/user/accessory/Pasted%20image%2020250411112138.png)
**Case  3: Node has two Red Children**
意味着其实应该 往上分裂 --- Solution: 颜色反转
![Pasted image 20250411112155.png](/img/user/accessory/Pasted%20image%2020250411112155.png)

可能需要持续调整
### Runtime Analysis
因为与2-3tree是一一对应的
所以最坏的情况就是全部颜色反转到根节点
LLRB的高度跟BST是一样的  logN
所以整体运行时间也是logN
abstract code
```java
private Node put(Node h, Key key, Value val) {
    if (h == null) { return new Node(key, val, RED); }

    int cmp = key.compareTo(h.key);
    if (cmp < 0)      { h.left  = put(h.left,  key, val); }
    else if (cmp > 0) { h.right = put(h.right, key, val); }
    else              { h.val   = val;                    }

    if (isRed(h.right) && !isRed(h.left))      { h = rotateLeft(h);  }
    if (isRed(h.left)  &&  isRed(h.left.left)) { h = rotateRight(h); }
    if (isRed(h.left)  &&  isRed(h.right))     { flipColors(h);      } 

    return h;
}
```