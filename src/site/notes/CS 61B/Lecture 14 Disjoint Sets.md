---
{"week":"第五周","dg-publish":true,"tags":["cs61b","week5"],"permalink":"/CS 61B/Lecture 14 Disjoint Sets/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-21T08:08:19.416+08:00","updated":"2025-04-19T09:51:23.107+08:00"}
---

从这个lecture开始 要开始解决一些列data structure 问题
sets, maps, and priority queues.    how you implement to get good performance.

**Today's agenda**
Deriving the “Disjoint Sets” data structure for solving the "Dynamic Connectivity" problem.
这个和Princeton的algorithm课Unit 2 撞了 [[algorithm/Algorithm Princeton/UNIT2 UNION-FIND\|UNIT2 UNION-FIND]]
![Pasted image 20250321081758.png|500](/img/user/accessory/Pasted%20image%2020250321081758.png)

简化为 integer  作业中其实就是做的渗流[[algorithm/Algorithm Princeton/UNIT2 homework\|UNIT2 homework]]
```java
package lecture14;  
  
public interface DisjointSets {  
    /**  
     * Checks to see if two items are connected.     *     * @param p items p  
     * @param q items q  
     * @return ture or false;  
     */    public boolean isConnected(int p, int q);  
  
    /**  
     * Connects two items p and q.     *     * @param p items p  
     * @param q items q  
     */    public void connect(int p, int q);  
}
```
**the Naive Approach**
Connecting two things.
over the lines.   迭代比较复杂
![Pasted image 20250321082540.png|400](/img/user/accessory/Pasted%20image%2020250321082540.png)


那我们如何为这些Disjoint Sets保存数据？ 
除了学习如何实现一个引人入胜的数据结构外，本章还将有机会了解数据结构的实现是如何演变的。
我们将讨论Disjoint Sets的四个迭代
Quick Find -> Quick Union -> Weighted Quick Union(WQU) -> WQU with Path Compression.

**List of Sets**
first idea 可能是使用 a list of sets, e.g `List<Set<Integer>>`
slow
我们的集合列表看起来像这样：`[{0}, {1}, {2}, {3}, {4}, {5}, {6}]`。看起来不错。然而，考虑如何完成像`connect(5, 6)`这样的操作。我们必须迭代最多N个集合来找到5，并且迭代N个集合来找到6。我们的运行时间变为`O(N)`。

| Implementation | constructor  | connect | isConnected |
| -------------- | ------------ | ------- | ----------- |
| ListOfSets     | $\Theta (N)$ | $O (N)$ | $O (N)$     |
构造 -- 构造的时候一定是N的量级


**Quick Find**
use a single array of integers.
-   The **indices of the array** represent the elements of our set.
- The **value at an index** is the set number it belongs to.
For example, we represent `{0, 1, 2, 4}, {3, 5}, {6}` as:
![Pasted image 20250321084431.png](/img/user/accessory/Pasted%20image%2020250321084431.png)
core: the same idea.
`connect(x,y)`
Let's see how the connect operation would work. Right now, `id[2] = 4` and `id[3] = 5`. After calling `connect(2, 3)`, all the elements with id 4 and 5 should have the same id. Let's assign them all the value 5 for now:  遍历所有`value = id[2]` 的 变成`id[3]`
![Pasted image 20250321084547.png](/img/user/accessory/Pasted%20image%2020250321084547.png)
`isConnected(x,y)`
we simply check if `id[x] == id[y]`

```java
package lecture14;  
  
public class QuickFindDS implements DisjointSets {  
    private int[] items;  
  
    public QuickFindDS(int n) {  
        items = new int[n];  
        for (int i = 0; i < n; i++) {  
            items[i] = i;  
        }  
    }  
  
    @Override  
    public boolean isConnected(int p, int q) {  
        return items[p] == items[q];  
    }  
  
    @Override  
    public void connect(int p, int q) {  
        int pValue = items[p];  
        int qValue = items[q];  
        for (int i = 0; i < items.length; i++) {  
            if (items[i] == qValue) {  
                items[i] = pValue;  
            }  
        }  
    }  
}
```

```java
package lecture14;  
  
import static com.google.common.truth.Truth.assertThat;  
import org.junit.Before;  
import org.junit.Test;  
  
  
public class QuickFindDSTest {  
    private QuickFindDS quickFindDS;  
  
    @Before  
    public void setup() {  
        quickFindDS = new QuickFindDS(10);  
    }  
  
    @Test  
    public void testUnionAndConnected() {  
        assertThat(quickFindDS.isConnected(0, 1)).isFalse();  
  
        quickFindDS.connect(0, 1);  
        assertThat(quickFindDS.isConnected(0, 1)).isTrue();  
  
        quickFindDS.connect(1, 2);  
        assertThat(quickFindDS.isConnected(0, 2)).isTrue();  
    }  
  
    @Test  
    public void testMultipleUnions() {  
        quickFindDS.connect(1, 2);  
        quickFindDS.connect(2, 3);  
        quickFindDS.connect(4, 5);  
        quickFindDS.connect(5, 6);  
        quickFindDS.connect(7, 8);  
  
        assertThat(quickFindDS.isConnected(1, 3)).isTrue();  
        assertThat(quickFindDS.isConnected(4, 6)).isTrue();  
        assertThat(quickFindDS.isConnected(1, 4)).isFalse();  
    }  
  
}
```

| Implementation | constructor  | connect | isConnected  |
| -------------- | ------------ | ------- | ------------ |
| ListOfSetsDS   | $\Theta (N)$ | $O (N)$ | $O (N)$      |
| QuickFindDS    | $\Theta (N)$ | $O (N)$ | $\Theta (1)$ |

**Quick Union**
假设我们优先考虑使 connect 操作快速。我们仍然会用一个数组来表示我们的集合。与使用 id 不同，我们给每个项分配其父项的索引。如果一个项没有父项，那么它就是一个“根”，我们给它分配一个负值。
实际上虽然是一个数组 但是逻辑上是一棵树
![Pasted image 20250321094811.png](/img/user/accessory/Pasted%20image%2020250321094811.png)

`connect(x,y)`
To connect two items, we find the set that each item belongs to (the roots of their respective trees), and make one the child of the other.
`connect(5, 2)`:
1. `find(5)` -> 3
2. `find(2)` -> 0
3. Set `find(5)`'s value to `find(2)` aka `parent[3] = 0`
![Pasted image 20250321101453.png](/img/user/accessory/Pasted%20image%2020250321101453.png)

`isConnected(x,y)`
找父节点

core: 父节点和父节点链接在一起
```java
package lecture14;  
  
public class QuickUnionDS implements DisjointSets {  
    private int[] items;  
  
    public QuickUnionDS(int n) {  
        items = new int[n];  
        for (int i = 0; i < n; i++) {  
            items[i] = -1;  
        }  
    }  
  
    @Override  
    public boolean isConnected(int p, int q) {  
        return find(p) == find(q);  
    }  
  
    @Override  
    public void connect(int p, int q) {  
        int rootP= find(p);  
        int rootQ= find(q);  
        items[rootP]=rootQ;  
    }  
  
    private int find(int p) {  
        if (items[p] == -1) {  
            return p;  
        }  
        return find(items[p]);  
    }  
  
  
}
```

```java
package lecture14;  
  
import static com.google.common.truth.Truth.assertThat;  
import org.junit.Before;  
import org.junit.Test;  
public class QuickUnionDSTest {  
    private QuickUnionDS quickUnionDS;  
  
    @Before  
    public void setup(){  
        quickUnionDS = new QuickUnionDS(7);  
    }  
  
    @Test  
    public void testQuickUnion(){  
        assertThat(quickUnionDS.isConnected(0,1)).isFalse();  
        quickUnionDS.connect(0,1);  
        assertThat(quickUnionDS.isConnected(0,1)).isTrue();  
  
        quickUnionDS.connect(1,2);  
        quickUnionDS.connect(4,1);  
  
        quickUnionDS.connect(3,5);  
  
        quickUnionDS.connect(5,2);  
        assertThat(quickUnionDS.isConnected(0,3)).isTrue();  
    }  
  
}
```

performance
一种情况就是一直是左子树或者右子树连到一起
the tree very long
递归会变得很慢
find就得遍历整个tree  - O(n)
而connect 和 isConnected 都用了

| Implementation | constructor  | connect | isConnected  |
| -------------- | ------------ | ------- | ------------ |
| ListOfSetsDS   | $\Theta (N)$ | $O (N)$ | $O (N)$      |
| QuickFindDS    | $\Theta (N)$ | $O (N)$ | $\Theta (1)$ |
| QuickUnionDS   | $\Theta (N)$ | $O (N)$ | $O (N)$      |

find 也能这么实现  迭代 -- 但是还是 遍历一遍  但会比递归稍微好一点
```java
    private int find(int p) {
        while (parent[p] >= 0) {
            p = parent[p];
        }
        return p;
    }
```


**Weighted Quick Union(WQU)**
影响find的是tree的长度
所以我们需要想办法减小树的高度
whenever we call `connect`, we always link the root of the smaller tree to the larger tree.
Following this rule will give your trees a maximum height of logN.
![Pasted image 20250321104305.png](/img/user/accessory/Pasted%20image%2020250321104305.png)

Implementation Weighted QuickUnion
我们需要去跟踪size的大小
注意啊 我们跟踪的是size 不是height啊  -- 其实跟踪size 就实现了胖胖的效果  就变矮了
有两种实现方法
Choice 1: 多使用一个size数组
Choice 1: 不再单用-1表示是父节点  而是用 -size 来表示这棵子树的大小

Choice 1
```java
package lecture14;  
  
public class WeightedQuickUnionChoice1 implements DisjointSets{  
    private int[] parent;  
    private int[] size;  
  
    public WeightedQuickUnionChoice1(int n){  
        parent = new int[n];  
        size = new int[n];  
  
        for (int i = 0; i < n; i++) {  
            parent[i]=-1;  
            size[i]=1;  
        }  
    }  
  
    @Override  
    public boolean isConnected(int p, int q) {  
        return find(p) == find(q);  
    }  
  
    @Override  
    public void connect(int p, int q) {  
        int parentP = find(p);  
        int parentQ = find(q);  
        if(size[parentP]<size[parentQ]){  
            parent[parentP]=parentQ;  
            size[parentQ]+=size[parentP];  
        }else{  
            parent[parentQ]=parentP;  
            size[parentP]+=size[parentQ];  
        }  
    }  
  
    private int find(int p){  
        while (parent[p] >= 0) {  
            p = parent[p];  
        }  
        return p;  
    }  
  
}
```
一定要跑一遍测试 看一下visualizer 对不对哈

choice2:
```java
package lecture14;  
  
public class WeightedQuickUnionChoice2 implements DisjointSets {  
    private int[] parent;  
  
    public WeightedQuickUnionChoice2(int n) {  
        parent = new int[n];  
        for (int i = 0; i < n; i++) {  
            parent[i] = -1;  
        }  
    }  
  
    @Override  
    public boolean isConnected(int p, int q) {  
        return find(p) == find(q);  
    }  
  
    @Override  
    public void connect(int p, int q) {  
        int parentP = find(p);  
        int parentQ = find(q);  
        if (parent[parentQ] < parent[parentP]) {  
            parent[parentQ] += parent[parentP];  
            parent[parentP] = parentQ;  
        } else {  
            parent[parentP] += parent[parentQ];  
            parent[parentQ] = parentP;  
        }  
    }  
  
    private int find(int p) {  
        while (parent[p] >= 0) {  
            p = parent[p];  
        }  
        return p;  
    }  
}
```

Why logN？
见[[algorithm/Algorithm Princeton/UNIT2 UNION-FIND\|UNIT2 UNION-FIND]]
想要深度加1就得翻倍  从一个节点开始   翻倍 深度加1  但是只有n个节点 所以最多只能加倍lgn次

| Implementation       | constructor  | connect     | isConnected  |
| -------------------- | ------------ | ----------- | ------------ |
| ListOfSetsDS         | $\Theta (N)$ | $O (N)$     | $O (N)$      |
| QuickFindDS          | $\Theta (N)$ | $O (N)$     | $\Theta (1)$ |
| QuickUnionDS         | $\Theta (N)$ | $O (N)$     | $O (N)$      |
| Weighted Quick Union | $\Theta (N)$ | $O (log N)$ | $O (log N)$  |

**Weighted Quick Union with Path Compression**
由于我们find的时候需要一层一层数  会耗费时间
a clear idea is 查询过一条路径之后 就把所有的这条路径上的节点直接连接到最终找出来的父节点上
![Pasted image 20250321143202.png|500](/img/user/accessory/Pasted%20image%2020250321143202.png)
![Pasted image 20250321143222.png|400](/img/user/accessory/Pasted%20image%2020250321143222.png)

之后再次查询的时候就会变得cheap
那个时间复杂度就不会算了hhh
```java
package lecture14;  
  
public class WeightedQuickUnionWithPathCompression implements DisjointSets{  
    private int[] parent;  
    private int[] size;  
  
    public WeightedQuickUnionWithPathCompression(int n){  
        parent = new int[n];  
        size = new int[n];  
  
        for (int i = 0; i < n; i++) {  
            parent[i]=i;  
            size[i]=1;  
        }  
    }  
  
    @Override  
    public boolean isConnected(int p, int q) {  
        return find(p) == find(q);  
    }  
  
    @Override  
    public void connect(int p, int q) {  
        int parentP = find(p);  
        int parentQ = find(q);  
        if(size[parentP]<size[parentQ]){  
            parent[parentP]=parentQ;  
            size[parentQ]+=size[parentP];  
        }else{  
            parent[parentQ]=parentP;  
            size[parentP]+=size[parentQ];  
        }  
    }  
  
    private int find(int p){  
        while (parent[p] != p) {  
            parent[p] = parent[parent[p]];  
            p = parent[p];  
        }  
        return p;  
    }  
  
}
```
其实这就展示出在初始化时的时候用i的好处了
这是Princeton大学的写法  感觉比初始化-1好多了 只是改了find方法
而且很巧妙

