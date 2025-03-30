---
{"week":"第三周","dg-publish":true,"permalink":"/CS 61B/Lecture 07 List IV Arrays and Lists/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-09T12:21:19.732+08:00","updated":"2025-03-30T15:27:45.476+08:00"}
---


![[[61B SP24] Lecture 7 - Lists 4_ Arrays and Lists.pdf]]

**Linked List Performance Puzzle Solution**
事实证明 无论怎么办  对于Linked list 来说 get方法基本都会比getBack慢
这是因为  链表只有第一个和最后一个项目的引用  必须去遍历访问才能找到后面一个或者前面一个节点
即使我们使用左移运算来决定是从前往后遍历还是从后往前遍历  最坏情况都与链表成线性关系 --  事实上是一般 $\frac{n}{2}$   ---O(n)

**Our First Attempt: The Naive Array Based List**
因为数组访问第i个元素 属于 常数级别 --  所以我们想通过array 来 构建 一个 list
不同的是  
array is a fixed-length data structure --  定长的数据结构
list is an infinitely-extensible data structure -- 无限扩展的数据结构

lecture帮忙写好了函数签名   可以从[https://github.com/Berkeley-CS61B/lectureCode/tree/master/lists4/DIY](https://github.com/Berkeley-CS61B/lectureCode/tree/master/lists4/DIY).下载

**基本结构**
```java
public class AList {  
  
    private int[] items;  
    private int size;
}
```


我们会发现
-   The position of the next item to be inserted (using `addLast`) is always `size`.
- The number of items in the AList is always `size`.
- The position of the last item in the list is always `size - 1`.
```java
public class AList {  
  
    private int[] items;  
    private int size;  
  
    /** Creates an empty list. */  
    public AList() {  
        items=new int[100];  
        size=0;  
    }  
  
    /** Inserts X into the back of the list. */  
    public void addLast(int x) {  
        items[size++]=x;  
    }  
  
    /** Returns the item from the back of the list. */  
    public int getLast() {  
        return items[size-1];          
    }  
    /** Gets the ith item in the list (0 is the front). */  
    public int get(int i) {  
        return items[i];          
    }  
  
    /** Returns the number of items in the list. */  
    public int size() {  
        return size;          
    }
}
```
当然现在还没有去考虑合法性和扩容的情况

**removeLast**
在写removeLast操作的时候 -- 我们应该弄明白size, items, the item in items 哪些需要改变
这里有一个观点是 用户并不关心 底层的实现  他们只关心看到的东西
所以 这里的意思是 我们removeLast的时候 最后一个元素无需变成0  只需要把size减小1  在 get的时候做好判断就好了

```java
/**  
 * Gets the ith item in the list (0 is the front). 
**/
public int get(int i) {  
    if (i >= items.length) {  
        throw new IllegalArgumentException();  
    }  
    return items[i];  
}

/**  
 * Deletes item from back of the list and 
 * returns deleted item. 
 **/   
public int removeLast() {  
    return items[size--];  
}
```

**resizing  arrays**
第一个想法 可能是  建一个size+1的数组 把数据复制过去  然后改变items的引用
![Pasted image 20250309140655.png|500](/img/user/accessory/Pasted%20image%2020250309140655.png)

```java
public void addLast(int x) {  
    if (size == items.length) {  
        resize(size + 1);  
    }  
    items[size++] = x;  
}  
  
private void resize(int capacity) {  
    int[] a = new int[capacity];  
    System.arraycopy(items, 0, a, 0, size);
```

这很慢   在普林斯顿的Algorithm课上 学过 见[[algorithm/Algorithm Princeton/UNIT4 BAGS, QUERES, AND STACKS\|UNIT4 BAGS, QUERES, AND STACKS]]
![Pasted image 20250309141310.png|400](/img/user/accessory/Pasted%20image%2020250309141310.png)

![Pasted image 20250309141716.png|500](/img/user/accessory/Pasted%20image%2020250309141716.png)

解决方案就是 size * 2 -- 均摊见上面图的红点
```java
public void addLast(int x) {  
    if (size == items.length) {  
        resize(size*2);  
    }  
    items[size++] = x;  
}
```

**Memory Performance**
在普林斯顿的算法课上 实际上还提到了缩减的方法 是看四分之一满的时候
如果删除了大部分空间  会造成内存浪费

在CS61B中是这么讲的
具体来说，我们定义一个“使用率”R，它等于列表的大小除以项目数组的长度
在典型的实现中，当R降至小于0.25时，我们会将数组的大小减半。

其实也是四分之一

**Generic AList**
就像我们之前做的那样，我们可以修改 AList，使其可以容纳任何数据类型，而不仅仅是整数。为此，我们再次在我们的类中使用特殊的尖括号表示法，并在适当的地方用任意类型参数替换整数。例如，在下面，我们使用 Glorp 作为我们的类型参数。
这里有一个重要的语法差异：由于泛型实现方式的一个晦涩问题，Java 不允许我们创建泛型对象数组。也就是说，我们不能做这样的事情：
```java
Glorp[] items = new Glorp[8];
```

instead
```java
Glorp[] items = (Glorp []) new Object[8];
```
这会产生一个编译警告，但我们只能接受它。我们将在后面的章节中更详细地讨论这个问题。
我们做的另一个改变是，我们将所有“删除”的项目都设置为 null。以前，我们没有理由将已删除的元素清零，但对于通用对象，我们确实希望将对我们存储的对象的引用设置为 null。这是为了避免“游荡”。回想一下，Java 只有在最后一个引用丢失时才会销毁对象。如果我们未能将引用设置为 null，那么 Java 将不会对已添加到列表中的对象进行垃圾回收。