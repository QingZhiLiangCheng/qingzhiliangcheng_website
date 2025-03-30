---
{"week":"第三周","dg-publish":true,"permalink":"/CS 61B/Lecture 08 Inheritance I Interface and Implementation Inheritance/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-10T15:11:53.568+08:00","updated":"2025-03-30T15:27:47.265+08:00"}
---


Inheritance  继承

在听这节lecture 之前  要完成 AList 和 DLList的实现
要求：
![Pasted image 20250310151955.png|500](/img/user/accessory/Pasted%20image%2020250310151955.png)
在这里 我会补一下实现  然后提交一次

完善DLList
```java
package lecture05;  
  
import java.util.NoSuchElementException;  
  
public class DLList<T> {  
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
  
    public ListNode sentinel;  
    private int size;  
  
    /**  
     * 构造函数  
     */  
    public DLList() {  
        //我觉得这样会不会不太好  
        sentinel = new ListNode(null, null, null);  
        sentinel.next = sentinel;  
        sentinel.prev = sentinel;  
        size = 0;  
    }  
  
  
    /**  
     * 按位置插入  
     *  
     * @param x  
     * @param position  
     */  
    public void insert(T x, int position) {  
        if (position < 0 || position > size) {  
            throw new IndexOutOfBoundsException("Invalid position");  
        }  
        ListNode p = sentinel;  
        for (int i = 0; i < position; i++) {  
            p = p.next;  
        }  
        ListNode newNode = new ListNode(p, x, p.next);  
        newNode.next.prev = newNode;  
        newNode.prev.next = newNode;  
        size++;  
    }  
  
    /**  
     * 头插  
     *  
     * @param item  
     */  
    public void addFirst(T item) {  
        size++;  
        ListNode current = new ListNode(sentinel, item, sentinel.next);  
        sentinel.next.prev = current;  
        sentinel.next = current;  
    }  
  
    /**  
     * 尾插  
     *  
     * @param item  
     */  
    public void addLast(T item) {  
        size++;  
        ListNode current = new ListNode(sentinel.prev, item, sentinel);  
        sentinel.prev.next = current;  
        sentinel.prev = current;  
    }  
  
    public T getFirst() {  
        if (isEmpty()) {  
            throw new NoSuchElementException("List is empty");  
        }  
        return sentinel.next.item;  
    }  
  
    public T getLast() {  
        if (isEmpty()) {  
            throw new NoSuchElementException("List is empty");  
        }  
        return sentinel.prev.item;  
    }  
  
    public T get(int index) {  
        if (index < 0 || index >= size) {  
            throw new IndexOutOfBoundsException("Invalid position");  
        }  
        ListNode p;  
        if (index < (size >> 1)) {  
            p = getFromFirst(index);  
        } else {  
            p = getFromLast(index);  
        }  
        return p.item;  
    }  
  
    private ListNode getFromFirst(int index) {  
        ListNode p = sentinel.next;  
        for (int i = 0; i < index; i++) {  
            p = p.next;  
        }  
        return p;  
    }  
  
    private ListNode getFromLast(int index) {  
        ListNode p = sentinel.prev;  
        for (int i = 0; i < (size - index - 1); i++) {  
            p = p.prev;  
        }  
        return p;  
    }  
  
    public T removeFirst() {  
        if (isEmpty()) {  
            throw new NoSuchElementException("List is empty");  
        }  
        size--;  
        T item = sentinel.next.item;  
        sentinel.next = sentinel.next.next;  
        sentinel.next.prev = sentinel;  
        return item;  
    }  
  
    public T removeLast() {  
        if (isEmpty()) {  
            throw new NoSuchElementException("List is empty");  
        }  
        size--;  
        T item = sentinel.prev.item;  
        sentinel.prev = sentinel.prev.prev;  
        sentinel.prev.next = sentinel;  
        return item;  
    }  
  
    public int size() {  
        return size;  
    }  
  
  
    public boolean isEmpty() {  
        return size == 0;  
    }  
  
    /**  
     * 打印链表  
     */  
    public void print() {  
        ListNode current = sentinel.next;  
        System.out.print("head->");  
        while (current != sentinel) {  
            System.out.print(current.item + "->");  
            current = current.next;  
        }  
        System.out.println("tail");  
    }  
  
  
    public static void main(String[] args) {  
        DLList<Integer> list = new DLList<>();  
        list.addFirst(10);  
        list.addFirst(20);  
        list.addFirst(30);  
        list.removeLast();  
        list.print();  
  
        list.insert(0, 0);  
        list.insert(999, 2);  
        list.print();  
        System.out.println(list.getFirst());  
        System.out.println(list.getLast());  
        System.out.println(list.get(0));  
    }  
  
  
}
```

```java
package lecture05;  
  
import static com.google.common.truth.Truth.assertThat;  
import static org.junit.Assert.assertThrows;  
  
import org.junit.Before;  
import org.junit.Test;  
  
import java.util.NoSuchElementException;  
  
public class DLListTest {  
    private DLList<Integer> emptyList;  
    private DLList<Integer> filledList;  
  
    @Before  
    public void setup() {  
        emptyList = new DLList<>();  
  
        filledList = new DLList<>();  
        filledList.addLast(10);  
        filledList.addLast(20);  
        filledList.addLast(30);  
    }  
  
    /* 初始化测试 */    @Test  
    public void testConstructor() {  
        assertThat(emptyList.size()).isEqualTo(0);  
        assertThat(emptyList.sentinel.next).isEqualTo(emptyList.sentinel);  
        assertThat(emptyList.sentinel.prev).isEqualTo(emptyList.sentinel);  
    }  
  
    /* 添加操作测试 */    @Test  
    public void testAddFirst() {  
        emptyList.addFirst(10);  
        assertThat(emptyList.getFirst()).isEqualTo(10);  
        assertThat(emptyList.size()).isEqualTo(1);  
  
        emptyList.addFirst(20);  
        assertThat(emptyList.getFirst()).isEqualTo(20);  
        assertThat(emptyList.size()).isEqualTo(2);  
    }  
  
    @Test  
    public void testAddLast() {  
        emptyList.addLast(50);  
        assertThat(emptyList.getLast()).isEqualTo(50);  
        assertThat(emptyList.size()).isEqualTo(1);  
  
        emptyList.addLast(60);  
        assertThat(emptyList.getLast()).isEqualTo(60);  
        assertThat(emptyList.size()).isEqualTo(2);  
    }  
  
    @Test  
    public void testInsert() {  
        // 头部插入  
        filledList.insert(5, 0);  
        assertThat(filledList.getFirst()).isEqualTo(5);  
  
        // 中间插入  
        filledList.insert(25, 2);  
        assertThat(filledList.get(2)).isEqualTo(25);  
  
        // 尾部插入  
        filledList.insert(40, 5);  
        assertThat(filledList.getLast()).isEqualTo(40);  
    }  
  
    /* 查询操作测试 */    @Test  
    public void testGetOptimizedTraversal() {  
        // 创建 5 元素链表 [0,1,2,3,4]        DLList<Integer> list = new DLList<>();  
        for (int i = 0; i < 5; i++) {  
            list.addLast(i);  
        }  
  
        // 验证前向遍历（index=1 < 5/2=2.5）  
        assertThat(list.get(1)).isEqualTo(1);  
  
        // 验证后向遍历（index=3 >= 2.5）  
        assertThat(list.get(3)).isEqualTo(3);  
    }  
  
    @Test  
    public void testEdgeGet() {  
        assertThat(filledList.get(0)).isEqualTo(10);  // 头部元素  
        assertThat(filledList.get(2)).isEqualTo(30);  // 尾部元素  
    }  
  
    /* 删除操作测试 */    @Test  
    public void testRemoveFirst() {  
        assertThat(filledList.removeFirst()).isEqualTo(10);  
        assertThat(filledList.size()).isEqualTo(2);  
        assertThat(filledList.getFirst()).isEqualTo(20);  
    }  
  
    @Test  
    public void testRemoveLast() {  
        assertThat(filledList.removeLast()).isEqualTo(30);  
        assertThat(filledList.size()).isEqualTo(2);  
        assertThat(filledList.getLast()).isEqualTo(20);  
    }  
  
    @Test  
    public void testRemoveAll() {  
        filledList.removeFirst();  
        filledList.removeFirst();  
        filledList.removeFirst();  
        assertThat(filledList.size()).isEqualTo(0);  
    }  
  
    /* 异常测试 */    @Test  
    public void testEmptyListExceptions() {  
        assertThrows(NoSuchElementException.class, () -> emptyList.getFirst());  
        assertThrows(NoSuchElementException.class, () -> emptyList.getLast());  
        assertThrows(NoSuchElementException.class, () -> emptyList.removeFirst());  
        assertThrows(NoSuchElementException.class, () -> emptyList.removeLast());  
    }  
  
    @Test  
    public void testInvalidIndexExceptions() {  
        // 测试非法插入位置  
        assertThrows(IndexOutOfBoundsException.class,  
                () -> filledList.insert(100, -1));  
        assertThrows(IndexOutOfBoundsException.class,  
                () -> filledList.insert(100, 4));  
  
        // 测试非法访问索引  
        assertThrows(IndexOutOfBoundsException.class,  
                () -> filledList.get(-1));  
        assertThrows(IndexOutOfBoundsException.class,  
                () -> filledList.get(3));  
    }  
  
    /* 综合测试 */    @Test  
    public void testIntegration() {  
        DLList<String> list = new DLList<>();  
  
        // 空链表验证  
        assertThat(list.size()).isEqualTo(0);  
  
        // 添加元素  
        list.addFirst("Apple");  
        list.addLast("Banana");  
        list.insert("Cherry", 1);  
  
        // 验证状态  
        assertThat(list.size()).isEqualTo(3);  
        assertThat(list.getFirst()).isEqualTo("Apple");  
        assertThat(list.get(1)).isEqualTo("Cherry");  
        assertThat(list.getLast()).isEqualTo("Banana");  
  
        // 删除操作  
        assertThat(list.removeFirst()).isEqualTo("Apple");  
        assertThat(list.removeLast()).isEqualTo("Banana");  
  
        // 最终状态  
        assertThat(list.size()).isEqualTo(1);  
        assertThat(list.getFirst()).isEqualTo("Cherry");  
    }  
}
```
1. 增加insert, isEmpty, get, getFrist, getLast等功能
2. 增加index和empty的特殊情况判断 抛异常
3. DeepSeek 帮我生成了测试代码
4. 注意为了测试 我把private改为了public

完善AList
```java
package lecture07;  
  
import java.util.NoSuchElementException;  
  
/**  
 * Array based list. * * @author Josh Hug  
 */  
public class AList<T> {  
  
    public T[] items;  
    private int size;  
  
    final int NEW_SIZE = 6;  
    final double USAGE_RATION = 0.25;  
  
    /**  
     * Creates an empty list.     */    public AList() {  
        items = (T[]) new Object[NEW_SIZE];  
        size = 0;  
    }  
  
    public void insert(T x, int index) {  
        if (index < 0 || index > size) {  
            throw new IndexOutOfBoundsException("Invalid position");  
        }  
        if (size == items.length) {  
            resize(size * 2);  
        }  
        System.arraycopy(items, index, items, index + 1, size - index);  
        items[index] = x;  
        size++;  
    }  
  
    public void addFirst(T x) {  
        if (size == items.length) {  
            resize(size * 2);  
        }  
        System.arraycopy(items, 0, items, 1, size);  
        items[0] = x;  
        size++;  
    }  
  
    /**  
     * Inserts X into the back of the list.     */    public void addLast(T x) {  
        if (size == items.length) {  
            resize(size * 2);  
        }  
        items[size++] = x;  
    }  
  
    private void resize(int capacity) {  
        T[] a = (T[]) new Object[capacity];  
        System.arraycopy(items, 0, a, 0, size);  
        items = a;  
    }  
  
    /**  
     * Returns the item from the back of the list.     */    public T getLast() {  
        if (isEmpty()) {  
            throw new NoSuchElementException("AList is empty");  
        }  
        return items[size - 1];  
    }  
  
    /**  
     * Gets the ith item in the list (0 is the front).     */    public T get(int i) {  
        if (i < 0 || i > size) {  
            throw new IndexOutOfBoundsException("Invalid position");  
        }  
        return items[i];  
    }  
  
    /**  
     * Returns the number of items in the list.     */    public int size() {  
        return size;  
    }  
  
    /**  
     * Deletes item from back of the list and     * returns deleted item.     */    public T removeLast() {  
        T item = items[size - 1];  
        items[size - 1] = null;  
        size--;  
        if (size <= items.length * USAGE_RATION) {  
            resize(items.length / 2);  
        }  
        return item;  
    }  
  
    public void print() {  
        for (T item : items) {  
            System.out.print(item + " ");  
        }  
        System.out.println();  
    }  
  
    public boolean isEmpty() {  
        return size == 0;  
    }  
  
    public static void main(String[] args) {  
        AList<Integer> aList = new AList<>();  
        aList.addFirst(10);  
        aList.addFirst(20);  
        aList.addLast(30);  
        aList.insert(100, 2);  
        aList.insert(200, 0);  
        aList.print();  
        System.out.println(aList.removeLast());  
        aList.print();  
        aList.addLast(11);  
        aList.addLast(22);  
        aList.addLast(33);  
        aList.addLast(44);  
        aList.print();  
        System.out.println(aList.removeLast());  
        System.out.println(aList.removeLast());  
        System.out.println(aList.removeLast());  
        System.out.println(aList.removeLast());  
        System.out.println(aList.removeLast());  
        aList.print();  
    }  
}
```
1. 增加insert, isEmpty, get, getFrist, getLast等功能
2. 增加index和empty的特殊情况判断 抛异常
3. 测试通不过 因为那个强制转换的问题

好 现在我们已经完善完了我们的DLList和AList
```java
public class WordUtils {  
    public static String longest(DLList<String> list) {  
        int maxDex = 0;  
        for (int i = 0; i < list.size(); i += 1) {  
            String longestString = list.get(maxDex);  
            String thisString = list.get(i);  
            if (thisString.length() > longestString.length()) {  
                maxDex = i;  
            }  
        }  
        return list.get(maxDex);  
    }  
  
    public static void main(String[] args) {  
        DLList<String> dlList=new DLList<>();  
        dlList.addLast("alk");  
        dlList.addLast("AAAAA");  
        dlList.addLast("insert a world");  
  
        System.out.println(longest(dlList));  
    }  
}
```
如果有一个获取最长String的方法  是关于传入SLList参数的
how do we make this method work for AList as well?
第一个想法可能是要再复制一遍  改一下参数
```java
public static String longest(SLList<String> list){}

public static String longest(AList<String> list){}
```
这叫overloading 重载  -- 相同函数名 不同参数
问题是 我们有大量相同的代码  如果出现了错误 需要两个地方都改

引出了Interface Inheritance 接口继承
![Pasted image 20250310192425.png|500](/img/user/accessory/Pasted%20image%2020250310192425.png)
步骤1：为通用列表上位词定义一个类型——我们将选择名称List61B。
步骤2：指定SLList和AList是该类型的下位词。
新的List61B是Java所称的接口。它本质上是一个契约，规定了列表必须能够做什么，但它没有为这些行为提供任何实现。
```java
package lecture08;  
  
public interface List61B<T> {  
    public void insert(T x, int index);  
  
    public void addFirst(T x);  
  
    public void addLast(T x);  
  
    public T getFirst();  
  
    public T getLast();  
  
    public T get(int index);  
  
    public int size();  
  
    public T removeLast();  
  
    public boolean isEmpty();  
}
```

a relationship-defining word: implements.
`public class AList<Item> implements List61B<Item>{...}`
![Pasted image 20250310193320.png|500](/img/user/accessory/Pasted%20image%2020250310193320.png)
点击实现方法后
![Pasted image 20250310193425.png|300](/img/user/accessory/Pasted%20image%2020250310193425.png)
在子类中实现所需函数时，最好（实际上在61B中是必需的）在方法签名上方包含@Override标签。
值得注意的是，即使你不包含这个标签，你仍然在重写该方法。所以从技术上讲，你不必包含它。然而，包含这个标签就像一个安全措施，它通过提醒编译器你打算重写这个方法来保护你作为程序员。你可能会问，这有什么帮助呢？嗯，这有点像有一个校对员！编译器会告诉你过程中是否出错。
假设你想重写 addLast 方法。如果你拼写错误，不小心写成了 addLsat 怎么办？如果你不包含 @Override 标签，那么你可能不会发现这个错误，这可能会使调试过程更加困难和痛苦。但是，如果你包含 @Override，编译器会停止并提示你在程序运行之前修复你的错误。
所以好处是  提醒  + 检查拼写错误

而且一般对于函数的注释 只写在interface

现在前面的WordUtils就可以给AList和DLList用了
```java
package lecture08;  
  
import lecture05.DLList;  
import lecture07.AList;  
  
public class WordUtils {  
    public static String longest(List61B<String> list) {  
        int maxDex = 0;  
        for (int i = 0; i < list.size(); i += 1) {  
            String longestString = list.get(maxDex);  
            String thisString = list.get(i);  
            if (thisString.length() > longestString.length()) {  
                maxDex = i;  
            }  
        }  
        return list.get(maxDex);  
    }  
  
    public static void main(String[] args) {  
        DLList<String> dlList=new DLList<>();  
        dlList.addLast("alk");  
        dlList.addLast("AAAAA");  
        dlList.addLast("insert a world");  
        System.out.println(longest(dlList));  
  
        AList<String> aList=new AList<>();  
        aList.addLast("alk");  
        aList.addLast("AAAAA");  
        aList.addLast("insert a world");  
        System.out.println(longest(aList));  
  
  
    }  
}
```

**Method Overriding vs. Overloading**
![Pasted image 20250310194700.png|500](/img/user/accessory/Pasted%20image%2020250310194700.png)

**Interface Inheritance**
接口继承指的是子类subclass继承超类superclass所有方法/行为的关系。例如，在上下位词和上位词部分中我们定义的List61B类，接口包含所有方法签名，但不包含实现。子类需要实际提供这些实现。
这种继承也是多代的。这意味着如果我们有一个很长的超类/子类关系谱系，如图4.1.1所示，AList不仅继承了List61B的方法，还继承了它之上所有类的方法，一直到最高的超类，也就是AList继承自Collection。

 **Implementation Inheritance**
前面我们写的是只是方法声明  需要在subclass实现
Java还提供了实现继承 -- 不仅仅继承空白标签  还会继承一些实现
```java
public default void print() {  
    for (int i = 0; i < size(); i++) {  
        System.out.print(get(i) + " ");  
    }  
    System.out.println();  
}
```
但是这个方法好像比较慢  尤其是对于 DLList
其实可以单独在DLList写个更好地  -- 覆盖superclass的方法
![Pasted image 20250310201632.png|500](/img/user/accessory/Pasted%20image%2020250310201632.png)

Question
```java
List61B<Integer> someList =new DLList<>();  
someList.addFirst(1);  
someList.addFirst(2);  
someList.addLast(2);  
someList.print();
```
调用哪个print？ 
事实证明调用的是重写的DLList中的方法

**Static Type vs. Dynamic Type**
Every variable in Java has a "compile-time type", a.k.a. "static type";
声明之后就没法改变了

Variables also have a  "run-time type", a.k.a. dynamic type
这是在实例化 比如说 new 所指定的类型   =  所指向对象的类型（运行的谁的函数？）

![Pasted image 20250310202837.png|600](/img/user/accessory/Pasted%20image%2020250310202837.png)

![Pasted image 20250310202955.png|500](/img/user/accessory/Pasted%20image%2020250310202955.png)

