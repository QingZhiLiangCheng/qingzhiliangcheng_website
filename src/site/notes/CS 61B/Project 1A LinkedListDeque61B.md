---
{"week":"Project","dg-publish":true,"tags":["cs61b","project"],"permalink":"/CS 61B/Project 1A LinkedListDeque61B/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-29T13:23:09.852+08:00","updated":"2025-04-19T09:52:25.425+08:00"}
---

**项目文档**[Project 1A: LinkedListDeque61B | CS 61B Spring 2024](https://sp24.datastructur.es/projects/proj1a/#introduction)

**Style**
On this project, we will be enfocing style.
follow the [Style Guide | CS 61B Spring 2024](https://sp24.datastructur.es/resources/guides/style/)
![Pasted image 20250329132740.png|500](/img/user/accessory/Pasted%20image%2020250329132740.png)
这个功能利用的是CS61B的那个插件
具体的规范见上面的文件

获取代码
我之前已经提前获取好了 放到了CS61B sp24的文件夹
![Pasted image 20250329133920.png|300](/img/user/accessory/Pasted%20image%2020250329133920.png)
proj1a的目录如下所示
```
proj1a
├── src
│   └── Deque61B.java
└── tests
    ├── LinkedListDeque61BTest.java
    └── PreconditionTest.java
```

在这里 我选择了创建了一个CS61BProject的新项目  学到哪个项目的时候往里面复制哪个项目
这里我把proj1a的项目复制进了CS61BProject
注意这里会报很多包的错误
要引入整个Libraries
然后仍然在test会有报错  我们要在src中建立我们的LinkedListDeque61B  并且使用泛型
同时 我们要继承Interface
```java
public class LinkedListDeque61B<T> implements Deque61B<T>{

}
```
然后生成所有需要重写的函数
同时创建一个空的构造函数
就可以start了！
在正式开始start之前 我去u+的华为云上建立了一个新的git代码托管 然后先把这些内容提交上去了

**JUnit Tests**
Project目录中一共提供了两个测试
**LinkedListDeque61BTest**
主要是测试代码功能的测试
现在全部被注释了 打开注释并运行 所以测试都失败 因为我们还没有实现任何功能
**PreconditionTest**
在这个测试文件中，提供了一些测试，用来检查LinkedListDeque61B文件，检查代码结构是否正确。不需要理解这些测试，但应该能够运行它们。

**Writing and Verifying the Constructor**

This section assumes you have watched and fully digested the lectures up to **and including** the `DLList` lecture, Lecture 5.
for this project, you are **required** to implement a circular, doubly-linked topology with a sentinel.
The empty list is represented by a single sentinel node that points at itself. There is a single instance variable called `sentinel` that points at this sentinel.
Implement the constructor for `LinkedListDeque61B` to match the appropriate topology.
Along the way you’ll need to create a `Node` class and introduce one or more instance variables. This may take you some time to understand fully.
Your nodes should be doubly-linked, and have exactly the necessary fields (instance variables) for a doubly-linked node. Additionally, you should only have one node class, and this node class **must** be an inner, or nested class inside `LinkedListDeque61B`.
The design of your `Node` class is a **strict requirement**. If your `Node` class does not meet the specfication listed above (nested class, with the fields of a doubly linked node) you will not pass the autograder.
When you’re done, set a breakpoint on the first line of `addFirstTestBasic`. Run the test in debug mode, and use the Step Over feature. Use the Java Visualizer to verify that your created object matches the expected topology.
**Task**: Implement the constructor. Your LinkedListDeque61B constructor **must** take 0 arguments. Implement a node class. (You would also probably need some instance variables.)
If `PreconditionTest` fails, your implementation is **insufficient** in some way. The test should give you a hint as to what is wrong. Some common mistakes:
- You may be using an incorrect topology. (If you run into a `NullPointerException`, this is likely the case.)
- Node might be defined in a separate file.
- Node might be using an incorrect type to store data. Remember that `Deque61B` is _generic_.
- `LinkedListDeque61B` might have a constructor that takes additional arguments.
- It might have too few or too many fields (instance variables) for a doubly-linked node.
- It might have non-primitive or non-node fields.


My Implementation:
要求的双向链表图示如下所示：
![DDList.png|400](/img/user/accessory/DDList.png)

```java
public class LinkedListDeque61B<T> implements Deque61B<T> {  
    public class ListNode {  
        public ListNode prev;  
        public ListNode next;  
        public T item;  
  
        public ListNode(ListNode prev, T item, ListNode next) {  
            this.prev = prev;  
            this.item = item;  
            this.next = next;  
        }  
    }  
  
    private final ListNode sentinel;  
    private int size;  
  
  
    public LinkedListDeque61B() {  
        sentinel = new ListNode(null, null, null);  
        sentinel.next = sentinel;  
        sentinel.prev = sentinel;  
        size = 0;  
    }
```

可视化工具查看
![Pasted image 20250329150700.png|500](/img/user/accessory/Pasted%20image%2020250329150700.png)
PreconditionTest测试通过
![Pasted image 20250329150854.png|600](/img/user/accessory/Pasted%20image%2020250329150854.png)

**Writing and Verifying `addFirst` and `addLast`**
要求:
Fill in the `addFirst` and `addLast` methods. Then, debug `addFirstAndAddLastTest`. This test will not pass because you haven’t written `toList` yet, but you can use the debugger and visualizer to verify that your code is working correctly.
**Task**: Implement `addFirst` and `addLast`, and verify that they are correct using `addFirstAndAddLastTest` and the Java visualizer.

Implementation:
```java
@Override  
public void addFirst(T x) {  
    size++;  
    ListNode newNode = new ListNode(sentinel, x, sentinel.next);  
    sentinel.next.prev = newNode;  
    sentinel.next = newNode;  
}  
  
@Override  
public void addLast(T x) {  
    size++;  
    ListNode lastNode = sentinel.prev;  
    ListNode newNode = new ListNode(lastNode, x, sentinel);  
    lastNode.next = newNode;  
    sentinel.prev = newNode;  
}
```

debug:
![Pasted image 20250329151924.png|600](/img/user/accessory/Pasted%20image%2020250329151924.png)

**Writing and Verifying `toList`**
要求:
Write the `toList` method. The first line of the method should be something like `List<T> returnList = new ArrayList<>()`. **This is one location where you are allowed to use a Java data structure.** You can import ArrayList by using IntelliJ’s auto import or copying this statement:
```java
import java.util.ArrayList; // import the ArrayList class
```
To verify that your `toList` method is working correctly, you can run the tests in `LinkedListDeque61BTest`. If you pass all the tests, you’ve established a firm foundation upon which to continue working on the project. Woo! If not, use the debugger and carefully investigate to see what’s wrong with your `toList` method. If you get really stuck, go back and verify that your `addFirst` and `addLast` methods are working.
**Task**: Implement `toList`, and verify that it is correct with the tests in `LinkedListDeque61BTest`.

Implementation:
```java
@Override  
public List<T> toList() {  
    List<T> returnList = new ArrayList<>();  
    ListNode p = sentinel.next;  
    while (p != sentinel) {  
        returnList.add(p.item);  
        p = p.next;  
    }  
    return returnList;  
}
```

test:
![Pasted image 20250329152639.png|600](/img/user/accessory/Pasted%20image%2020250329152639.png)
整个LinkedListDeque61BTest都通过

**Writing Tests**
To write tests, we will use Google’s [Truth](https://truth.dev/) assertions library. We use this library over JUnit assertions for the following reasons:
- Better failure messages for lists.
- Easier to read and write tests.
- Larger assertions library out of the box.

我们通常使用 Arrange-Act-Assert 模式来编写测试：
1. Arrange：准备测试用例，例如实例化数据结构或用元素填充它。  
2. Act：执行您要测试的行为。  
3. Assert：断言（2）中操作的结果

**Truth Assertions**
真值断言的格式
```java
assertThat(actual).isEqualTo(expected);
```
为了给断言添加消息，我们可以使用：
```java
assertWithMessage("实际值与期望值不符")  
.that(actual)  
.isEqualTo(expected);
```
我们可以使用除了 `isEqualTo` 之外的其他东西，具体取决于实际值的类型。例如，如果 actual 是一个 List，我们可以执行以下操作来检查其内容，而无需构造一个新的 List:
```java
assertThat(actualList)  
.containsExactly(0, 1, 2, 3)  
.inOrder();
```
如果我们有一个List或其他对象的引用 我们可以使用
```java
assertThat(actualList)  
.containsExactlyElementsIn(expected) // `expected` 是一个 List  
.inOrder();
```

Truth 有很多断言，包括 isNull 和 isNotNull；以及 isTrue 和 isFalse 用于布尔值

剩下的就是测试和实现所有剩余的方法

**isEmpty and size**
These two methods must take **constant time**. That is, the time it takes to for either method to finish execution should not depend on how many elements are in the deque.
Implementation:
```java
@Override  
public boolean isEmpty() {  
    return size==0;  
}  
  
@Override  
public int size() {  
    return size;  
}
```

test:
```java
@Test  
public void emptyAndSizeTest() {  
    Deque61B<Deque61B<Integer>> deque61B = new LinkedListDeque61B<>();  
    assertThat(deque61B.isEmpty()).isTrue();  
    assertThat(deque61B.size()).isEqualTo(0);  
  
    Deque61B<Integer> d = new LinkedListDeque61B<>();  
    d.addLast(0);   // [0]  
    d.addLast(1);   // [0, 1]  
    d.addFirst(-1); // [-1, 0, 1]  
    d.addLast(2);   // [-1, 0, 1, 2]  
    d.addFirst(-2); // [-2, -1, 0, 1, 2]  
    deque61B.addLast(d);  
    assertThat(d.size()).isEqualTo(5);  
    assertThat(deque61B.isEmpty()).isFalse();  
    assertThat(deque61B.size()).isEqualTo(1);  
  
}
```

**get**
Write a test for the `get` method. Make sure to test the cases where `get` receives an invalid argument, e.g. `get(28723)` when the `Deque61B` only has 1 item, or a negative index. In these cases `get` should return `null`.
`get` must use iteration.

Implementation:
我这里建议先算是在前半段还是后半段 然后决定是从后往前遍历还是从前往后遍历
```java
@Override  
public T get(int index) {  
	if (index > size - 1 || index < 0) {  
	    return null;  
	} 
    if ((size >> 1) < index) {  
        return getReverse(index);  
    } else {  
        return getForward(index);  
    }  
}

private T getReverse(int index) {  
    ListNode p = sentinel.prev;  
    for (int i = size - 1; i > index; i--) {  
        p = p.prev;  
    }  
    return p.item;  
}  
  
private T getForward(int index) {  
    ListNode p = sentinel.next;  
    for (int i = 0; i < index; i++) {  
        p = p.next;  
    }  
    return p.item;  
}
```



**getRecursive**
Since we’re working with a linked list, it is interesting to write a recursive get method, `getRecursive`.
Copy and paste your tests for the `get` method so that they are the same except they call `getRecursive`. (While there is a way to avoid having copy and pasted tests, though the syntax is not worth introducing – passing around functions in Java is a bit messy.)

Implementation:
```java
@Override  
public T getRecursive(int index) {  
    if (index > size - 1 || index < 0) {  
        return null;  
    }  
    if ((size >> 1) < index) {  
        return getReverseRecursive(sentinel.prev, size - index - 1);  
    } else {  
        return getForwardRecursive(sentinel.next,index);  
    }  
}

private T getReverseRecursive(ListNode currentNode,int count) {  
    if (count == 0) {  
        return currentNode.item;  
    }  
    return getReverseRecursive(currentNode.prev,count-1);  
}  
  
private T getForwardRecursive(ListNode currentNode,int count) {  
    if (count == 0) {  
        return currentNode.item;  
    }  
    return getForwardRecursive(currentNode.next,count-1);  
}
```

 **`removeFirst` and `removeLast`**
 Lastly, write some tests that test the behavior of `removeFirst` and `removeLast`, and again ensure that the tests fail. **For these tests you’ll want to use `toList`!** Use `addFirstAndAddLastTest` as a guide.
 If `Deque61B` is empty, removing should return `null`.
`removeFirst` and `removeLast` **may not** use looping or recursion. Like `addFirst` and `addLast`, these operations must take "constant time."
Remember that the Java garbage collector will “delete” things for us if and only if there are no pointers to that object.
Implementation:

```java
@Override  
public T removeFirst() {  
    if (isEmpty()) {  
        return null;  
    }  
    ListNode removeNode = sentinel.next;  
    sentinel.next=removeNode.next;  
    sentinel.next.prev=sentinel;  
    size--;  
    return removeNode.item;  
}  
  
@Override  
public T removeLast() {  
    if (isEmpty()) {  
        return null;  
    }  
    ListNode removeNode = sentinel.prev;  
    sentinel.prev=removeNode.prev;  
    sentinel.prev.next=sentinel;  
    size--;  
    return removeNode.item;  
}
```
