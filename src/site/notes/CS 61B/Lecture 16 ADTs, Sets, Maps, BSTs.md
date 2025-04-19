---
{"week":"第六周","dg-publish":true,"tags":["cs61b","week6"],"permalink":"/CS 61B/Lecture 16 ADTs, Sets, Maps, BSTs/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:37:55.411+08:00","updated":"2025-04-19T09:51:35.147+08:00"}
---

### Abstract Data Types
Abstract Data Type(ADT) (抽象数据类型) 仅由其操作定义，而不是其实现定义
从这个描述中  能看到ADT和interface有些相关
一些常见的ADT有
- stacks
- Lists
- Sets
- Maps
而这些ADT是更大的、总括性的接口Collections的子接口
![Pasted image 20250328150705.png](/img/user/accessory/Pasted%20image%2020250328150705.png)
接口为白色 类为蓝色
ADT可以让我们更加高效优雅的编程
比如在Project 1C的时候 -- ArrayDeque和LinkedListArrayDeque能相互使用 -- 因为他们都属于Deque ADT(我还没写Project1  所以 我不知道 这周末没空的时候可以写一下)

这里我突然想起来了Java的Abstract Class
这里总结了一下Abstract Class 和 Interface的区别
- 抽象类主要表达  is-a 的一个关系 -- 可以看作是一个类的模版 提供了通用的功能和行为
- 接口表达一种 can-do的关系 -- 强调的是功能的约定
Animal是一个抽象类  Dog, Cat, Bird 继承Animal
Flyable 是 一个接口  任何可以飞行的类(Bird, Airplane)都可以实现这个接口

### Binary Search Trees
Linked List are great, but it takes a long time to search for an item, even if the list is sorted!
对于array, 我们或许可以用 binary search ，过程见[Binary Search Algorithm – Iterative and Recursive Implementation | GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)
But how do we run binary search for a linked list?
其实还是往中间跳
如果我们有一个指向中间的节点的引用 由于链表是排序的 所以决定了遍历前半段还是后半段 这样会将运行时间减少一半！
如果我们继续找中间一个节点
所以就会变成
![Pasted image 20250328204651.png|500](/img/user/accessory/Pasted%20image%2020250328204651.png)
这其实就是一个排序二叉树 Binary Search Trees
### BST Definitions
**Trees**
A set of nodes.
A set of edges that connected those nodes.
There is exactly one path between any two nodes.
![Pasted image 20250328205757.png|500](/img/user/accessory/Pasted%20image%2020250328205757.png)
- Binary Trees: in addition to the above requirements, also hold the binary property constraint. That is, each node has either 0, 1, or 2 children.
- Binary Search Trees
	in addition to all the above requirements, also hold the property that For every node X in the tree:
	Every Key in the left subtree is less than X's key.
	Every key in the right subtree is greater than X's key.
![Pasted image 20250328210524.png|300](/img/user/accessory/Pasted%20image%2020250328210524.png)
```java
public class BST<T extends Comparable<T>> {  
  
    public class BSTNode<T> {  
        private T key;  
        private BSTNode<T> left;  
        private BSTNode<T> right;  
  
        public BSTNode(T key, BSTNode<T> left, BSTNode<T> right) {  
            this.key = key;  
            this.left = left;  
            this.right = right;  
        }  
  
        public BSTNode(T key) {  
            this.key = key;  
        }  
  
  
    }  
  
    private BSTNode<T> root;  
    private int size;
}
```
### BST Operations
**Search**
Start at the root node and compare it with the element, X, that we are looking for.
If X is greater to the root, we move on the root's right child.
if smaller, we move on the root's left child.
we repeate this process recurively until we either find the item or we get to a leaf, in which case the tree does not contain the item.
```java
static BST find(BST T, Key sk) {
   if (T == null)
      return null;
   if (sk.equals(T.key))
      return T;
   else if (sk ≺ T.key)
      return find(T.left, sk);
   else
      return find(T.right, sk);
}
```
但是注意由于是泛型类型  在Java中没法直接比 得定义比较器
≺ 这个符号不是小于号  是那个偏序的关系
所以如果写Java实现的代码的话 需要用比较器 自然顺序就行
```java
public BSTNode<T> find(BSTNode<T> T, T element) {  
    if (T == null) {  
        return null;  
    }  
    int cmp = element.compareTo(T.key);  
    if (cmp == 0) {  
        return T;  
    } else if (cmp < 0) {  
        return find(T.left, element);  
    } else {  
        return find(T.right, element);  
    }  
}
```

**Insert**
First, we serach in the tree for the node. If we find it, we don't do anything. If we don't find it, we wil be at a leaf node already. At this point, we can just add the new element to either the left or right of the leaf, preserving the BST property.
```java
static BST insert(BST T, Key ik) {
  if (T == null)
    return new BST(ik);
  if (ik ≺ T.key)
    T.left = insert(T.left, ik);
  else if (ik ≻ T.key)
    T.right = insert(T.right, ik);
  return T;
}
```
Implementation
```java
public BSTNode<T> insert(BSTNode<T> T, T elemnt) {  
    if (this.isEmpty()) {  
        root = new BSTNode<>(elemnt);  
        size++;  
        return root;  
    }  
    if (T == null) {  
        size++;  
        return new BSTNode<>(elemnt);  
    }  
    int cmp = elemnt.compareTo(T.key);  
    if (cmp < 0) {  
        T.left = insert(T.left, elemnt);  
    } else {  
        T.right = insert(T.right, elemnt);  
    }  
    return T;  
}
```
具体的过程可以debug一下看一下可视化

**Delete**
three categories:
- the node we are trying to delete has no children.
- has 1 child
- has 2 children
**Delection 1: No Children**
if the node ha s no children, it is a leaf, and we can just delete its parents pointer and the node will eventually be swept away be the garbage collector.
垃圾回收器
**Delection 2: One Child**
we can just reassign the parent's child children pointer to the node's and the node will eventually be garbage collected.
**Delection 3: Two Children**
we choose a new node to replace the deleted one.
we know that the new node must:
- be > than everything in the left subtree.
- be < than everything riht subtree.
![Pasted image 20250329105408.png|400](/img/user/accessory/Pasted%20image%2020250329105408.png)
比如说要删除dog节点 -- 只需要选择左子树最右边的cat节点或者 右子树最左边的elf节点移动到dog的位置
这被称为Hibbard删除法，它可以完美地在删除过程中维护二叉搜索树的性质。
```java
public BSTNode<T> remove(BSTNode<T> T, T element) {  
    //元素未找到 -- do nothing    if (T == null) {  
        return null;  
    }  
    int cmp = element.compareTo(T.key);  
    if (cmp < 0) {  
        T.left = remove(T.left, element);  
    } else if (cmp > 0) {  
        T.right = remove(T.right, element);  
    } else if (T.right != null && T.left != null) {  
        //如果有左右节点  
        //将右子树的最小的值 换到当前节点 并且删除右子树最小的值  
        T.key = findMin(T.right).key;  
        T.right = remove(T.right, T.key);  
    } else {  
        //如果只有一个孩子  返回那个非空的孩子  
        //如果没有孩子 就返回空  
        T = (T.left != null) ? T.left : T.right;  
    }  
    return T;  
}  
  
private BSTNode<T> findMin(BSTNode<T> T) {  
    if (T == null) {  
        return null;  
    }  
    if (T.left == null) {  
        return T;  
    }  
    return findMin(T.left);  
}
```
太妙了这个递归

### BSTs as Sets and Maps
我们可以使用BST来实现集合Set抽象数据结构
而且每个操作会降到log(n) -- 因为BST能二分查找

如果每个二叉树搜索节点保存 key-value pairs -- 就会变成一个map
比较每个元素的key 来决定放在数的哪个位置
