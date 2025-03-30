---
{"week":"第二周","dg-publish":true,"permalink":"/CS 61B/Lecture 05 List III DLList and Arrays/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-07T10:12:16.731+08:00","updated":"2025-03-30T15:27:41.190+08:00"}
---


![[[61B SP24] Lecture 5 - Lists 3_ DLLists and Arrays.pdf]]

summary of last time
![Pasted image 20250307101603.png|500](/img/user/accessory/Pasted%20image%2020250307101603.png)

also have some problems.
Problem 1:  addLast is slow.
Solution: add a pointer to the end.
但是有一个问题是 加一个end的pointer   addLast变得很快  getLast变得很快
但是removeLast 还是不行
因为removeLast需要拿到前一个节点  因为必须新的最后一个元素
这个时候有一个思路可能是 也记录倒数第二个节点  可是删除之后 要更新 新的倒数第二个节点  还是找不到

Solution: DLList(doubly linked list) instead of SLList(singly linked list)
a non-obvious fact
![Pasted image 20250307102917.png|500](/img/user/accessory/Pasted%20image%2020250307102917.png)
这种设计存在一个微妙的问题，即最后一个指针有时指向哨兵节点，有时指向实际节点。就像非哨兵版本的SLList一样，这会导致代码中出现特殊情况
其实我倒觉得没啥  但有时候会指向虚拟节点  不能getLast  有时候指向实际节点 可能需要特殊判断？
可能是可能会混淆 这个时候到底指向的是不是虚拟节点？
Solution1: Have two sentinels
![Pasted image 20250307103618.png|500](/img/user/accessory/Pasted%20image%2020250307103618.png)

Solution2: circular
事实证明 这是最好的双向链表的设计方式
![Pasted image 20250307103921.png|500](/img/user/accessory/Pasted%20image%2020250307103921.png)

Problem2: only supports integers
引出了 generic  泛型
you use an arbitrary placeholder inside angle brackets: `<>`. Then anywhere you want to use the arbitrary type, you use that placeholder instead.
```java
public class DLList<BleepBlorp> {
    private IntNode sentinel;
    private int size;

    public class IntNode {
        public IntNode prev;
        public BleepBlorp item;
        public IntNode next;
        ...
    }
    ...
}
```
Since generics **only work with reference types**, we cannot put primitives like `int` or `double` inside of angle brackets, e.g. `<int>`. Instead, we use the reference version of the primitive type, which in the case of `int` case is `Integer`, e.g.
-   In the .java file **implementing** a data structure, specify your generic type name only once at the very top of the file after the class name.
- In other .java files, which use your data structure, specify the specific desired type during declaration, and use the empty diamond operator during instantiation.
- If you need to instantiate a generic over a primitive type, use `Integer`, `Double`, `Character`, `Boolean`, `Long`, `Short`, `Byte`, or `Float` instead of their primitive equivalents.

在听后半部分 Arrays 之前 我花了一点时间来实现整个DLList

未来的lecture --  build a totally new type of list. 
有相同的Operation  但不会使用节点和链接作为底层数据

deeply understand what is array
对于数组的声明已经很熟悉了 就不在赘述了
这里有几个更深层的好玩的地方
首先 数组属于引用类型  就像之前介绍过的类一样 只不过之前的类 是开辟了一个空间来放那些属性  而数组是开辟了一块有下标的box
但是值得注意的是 array其实有一个隐藏的属性  length   只不过在可视化工具上看不见  但它依然存在
![Pasted image 20250307135432.png|500](/img/user/accessory/Pasted%20image%2020250307135432.png)

```java
int[] z = null;
int[] x, y;

x = new int[]{1, 2, 3, 4, 5};
y = x;
x = new int[]{-1, 2, 5, 4, 99};
y = new int[3];
z = new int[0];
int xL = x.length;

String[] s = new String[6];
s[4] = "ketchup";
s[x[3] - x[1]] = "muffins";

int[] b = {9, 10, 11};
System.arraycopy(b, 0, x, 3, 2);
```
通过这段代码来深入了解数组的整个底层和过程是什么样的
![Pasted image 20250307140034.png|400](/img/user/accessory/Pasted%20image%2020250307140034.png)
第一句语句 事实上并没有new  事实上并没有为并存的多个整数创建空间
`x=new int[]{-1,2,3,4,5};` 才真正上实例化了一个新的整形数组
因为是引用类型 所以x存储的是地址
同样y=x 只是copy了bit  所以也指向同一个数组
![Pasted image 20250307140413.png|400](/img/user/accessory/Pasted%20image%2020250307140413.png)

![Pasted image 20250307140510.png|400](/img/user/accessory/Pasted%20image%2020250307140510.png)
在执行`y=new int[3]`的时候 要注意两个地方
第一个地方是之前的12345那个数组就彻底消失了  因为这个数组失去了唯一剩余引用 这个时候垃圾收集器会将内存回收
第二个地方是int类型默认初始化是0
![Pasted image 20250307140838.png|400](/img/user/accessory/Pasted%20image%2020250307140838.png)

String类型要注意 并不属于八大基本类型  所以String类型本身也是个引用类型
![Pasted image 20250307141030.png|400](/img/user/accessory/Pasted%20image%2020250307141030.png)

array copy
`System.arraycopy` takes five parameters:
- The array to use as a source
- Where to start in the source array
- The array to use as a destination
- Where to start in the destination array
- How many items to copy

复制数组的另一种方法是使用循环。arraycopy 通常比循环更快，并且可以生成更紧凑的代码
2D Arrays in Java
```java
int[][] pascalsTriangle;
pascalsTriangle = new int[4][];
int[] rowZero = pascalsTriangle[0];

pascalsTriangle[0] = new int[]{1};
pascalsTriangle[1] = new int[]{1, 1};
pascalsTriangle[2] = new int[]{1, 2, 1};
pascalsTriangle[3] = new int[]{1, 3, 3, 1};
int[] rowTwo = pascalsTriangle[2];
rowTwo[1] = -5;

int[][] matrix;
matrix = new int[4][];
matrix = new int[4][4];

int[][] pascalAgain = new int[][]{{1}, {1, 1},
                                 {1, 2, 1}, {1, 3, 3, 1}};
```

![Pasted image 20250307141635.png|400](/img/user/accessory/Pasted%20image%2020250307141635.png)

