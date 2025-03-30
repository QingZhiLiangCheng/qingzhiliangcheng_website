---
{"week":"第二周","dg-publish":true,"permalink":"/CS 61B/Lecture 04 List II SLLists, Nested Classes, Sentinel Nodes/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-05T09:11:09.202+08:00","updated":"2025-03-30T15:27:29.451+08:00"}
---


![[[61B SP24] Lecture 4 - Lists 2_ SLLists.pdf]]

上一节lecture所实现的IntList -- naked recursive data structure
使用的时候需要理解递归 --  丑陋  限制
this lecture 带着实现了一个新的类SLList -- 更加优雅  接近现代语言的列表实现
其实我之前看过LinkedList的源码  也用cpp实现过
但是在lecture中又听了一遍
但是还没有用到泛型   我用cpp的时候用了函数模版


其实是更细化了  把那个IntList 改成了 IntNode -- 删掉了其他所有的方法
这其实我也是平时我们写LinkedList的一个方法  就是多少有点工程化的思想 -- 链表是有一个个节点构成的  所以先实现节点
第一步称作
Improvement 1: Rebranding
```java
public class IntNode {
    public int item;
    public IntNode next;

    public IntNode(int i, IntNode n) {
        item = i;
        next = n;
    }
}
```

Improvement 2: Bureaucracy
```java
public class SLList {
    public IntNode first;

    public SLList(int x) {
        first = new IntNode(x, null);
    }
}
```

为什么这样更好？
```java
IntList L1 = new IntList(5, null);  
SLList L2  = new SLList(5);  
```
因为SLList隐藏了存在空链接的细节  不对用户暴露

addFirst and getFirst
```java
/**  
 * adds item x front of the list. * * @param x  
 */  
public void addFirst(int x) {  
    first = new IntNode(x, first);  
}  
  
/**  
 * return the front item from the list. * * @return  
 */  
public int getFirst() {  
    return first.item;  
}
```

很简单
但是要去体会 IntList 和 SLList的区别  体会怎么把细节藏起来了
IntList需要自己去递归  自己去new 自己去接起来
SLList的优点就在于 SLList就像个中间人  帮我们进入递归数据结构
IntList 用户有可能拥有指向 IntList 中间的变量，这可能会带来不希望的后果
![Pasted image 20250306134501.png|500](/img/user/accessory/Pasted%20image%2020250306134501.png)


Improvement 3: Public vs. Private
现在的SLList可以被绕过  直接访问 里面的naked data structure  而且可以直接操控 item和next
we can modify the SLList class to that the first variable is declared with the private keyword.
Private variables and methods 只能被同一个.java 文件中的代码访问

advantage:
- less of user of class to understand
- safe


Improvements 4: Nested Classed
事实上 IntNode仅仅是一个SLList的一个特性  IntNode好像并没有作为一个直接交互的项目  他没有自己的方法  更像是一个属性
所以我们会使用嵌套类 nested classed
如果嵌套类不需要使用 SLList 的任何实例方法或变量，您可以将嵌套类声明为静态的,将嵌套类声明为静态意味着静态类中的方法无法访问封闭类的任何成员。在这种情况下，这意味着 IntNode 中的任何方法都无法访问 first、addFirst 或 getFirst。
这节省了一些内存，因为每个 IntNode 不再需要追踪如何访问其封闭的 SLList。
当你将嵌套类声明为静态时，这意味着每个该静态嵌套类的实例都不再持有对外部类实例的引用。因此，在你的例子中，如果`IntNode`是静态的，那么它的每个实例就不需要追踪或持有对其外部类`SLList`实例（比如`first`、`addFirst` 或 `getFirst`方法）的引用。这可以稍微减少一些内存消耗，因为不需要额外的空间来存储对外部类实例的引用。
？？？

addLast() and size()
```java
/**  
 * Add x to the end of the list. * @param x  
 */  
public void addLast(int x){  
    IntNode p= first;  
    while(p.next!=null){  
        p=p.next;  
    }  
    p.next=new IntNode(x,null);  
}
```

我的第一反应是迭代 遍历一遍
我没想到这个老师这么喜欢用递归
```java
public int size(IntNode p){  
    if(p.next==null){  
        return 1;  
    }  
    return 1+size(p.next);  
}  
  
public int size(){  
    return size(first);  
}
```

我觉得他是想刚好借着这个说一下overload
Here, we have two methods, both named `size`. This is allowed in Java, since they have different parameters. We say that two methods with the same name but different signatures are **overloaded**. For more on overloaded methods, see Java's [official documentation](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html).

Improvement 5: Caching
其实前面写的addLast和size的缺点很明显
如果迭代的话需要O(n) 挨着遍历一遍
To do so, we can simply add a `size` variable to the `SLList` class that tracks the current size, yielding the code below. This practice of saving important data to speed up retrieval is sometimes known as **caching**.
课程只讲了加一个size variable  其实我觉着我们也可以加一个tail 或者 last指针 来指向the end of node
说白了 就是拿着空间换效率
但是确实把遍历均摊了  变成了O(1)

而且有一个点需要说明  如果我们直接在naked list上  是没有地方可以放size viable  因为全是节点  节点没有size属性的 但是当有SSList做中间人就很不一样了

在lecture中 加入了size variable
代码改成了这样
```java
public SLList(int item) {  
    first = new IntNode(item, null);  
    size = 1;  
}  
  
public SLList() {  
    first = null;  
    size = 0;  
}

/**  
 * adds item x front of the list. * * @param x  
 */  
public void addFirst(int x) {  
    size++;  
    first = new IntNode(x, first);  
}

/**  
 * Add x to the end of the list. * * @param x  
 */  
public void addLast(int x) {  
    size++;  
    IntNode p = first;  
    while (p.next != null) {  
        p = p.next;  
    }  
    p.next = new IntNode(x, null);  
}
```
但是会出现一个bug  就是我建立空list的时候 再调用addLast
在p.next的时候错了  因为first是null
所以我们要特殊情况判断  be like
```java
/**  
 * Add x to the end of the list. * * @param x  
 */  
public void addLast(int x) {  
    size++;  
    if(size==0){  
        first=new IntNode(x,null);  
        return;  
    }  
    IntNode p = first;  
    while (p.next != null) {  
        p = p.next;  
    }  
    p.next = new IntNode(x, null);  
}
```

![Pasted image 20250306145517.png|300](/img/user/accessory/Pasted%20image%2020250306145517.png)
问题是加上特殊情况判断可能显得代码变的复杂 更长
而且每当我们增加功能的时候 可能都要加上特殊情况判断  而且可能在bug出现之前我们并不能意识到有特殊情况

所以一种更好的方式 可能是使用头结点的链表
```java
package lecture04;  
  
public class SLList {  
  
    private class IntNode {  
        public int item;  
        public IntNode next;  
  
        IntNode(int item, IntNode next) {  
            this.item = item;  
            this.next = next;  
        }  
    }  
  
    private int size;  
  
    private IntNode sentinel;  
  
    public SLList(int item) {  
        sentinel = new IntNode(0, null);  
        sentinel.next = new IntNode(item, null);  
        size = 1;  
    }  
  
    public SLList() {  
        sentinel = new IntNode(0, null);  
        size = 0;  
    }  
  
    /**  
     * adds item x front of the list.     *     * @param x  
     */  
    public void addFirst(int x) {  
        size++;  
        sentinel.next = new IntNode(x, sentinel.next);  
    }  
  
    /**  
     * return the front item from the list.     *     * @return  
     */  
    public int getFirst() {  
        return sentinel.next.item;  
    }  
  
    /**  
     * Add x to the end of the list.     *     * @param x  
     */  
    public void addLast(int x) {  
        size++;  
        IntNode p = sentinel;  
        while (p.next != null) {  
            p = p.next;  
        }  
        p.next = new IntNode(x, null);  
    }  
  
    public int size() {  
        return size;  
    }  
  
    public static void main(String[] args) {  
        SLList slList = new SLList();  
        slList.addLast(1222);  
        slList.addFirst(10);  
        System.out.println(slList.getFirst());  
        System.out.println(slList.size());  
        slList.addLast(100);  
        System.out.println(slList.size());  
    }  
}
```

![Pasted image 20250306150345.png|400](/img/user/accessory/Pasted%20image%2020250306150345.png)
这条线 是在说  sentinel是个不变量
