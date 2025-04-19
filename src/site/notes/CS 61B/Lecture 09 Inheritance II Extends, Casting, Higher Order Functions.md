---
{"week":"第四周","dg-publish":true,"tags":["cs61b","week4"],"permalink":"/CS 61B/Lecture 09 Inheritance II Extends, Casting, Higher Order Functions/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-11T20:13:14.200+08:00","updated":"2025-04-19T09:50:59.074+08:00"}
---


继续讨论 Inheritance(继承)
last lecture 讲的  只能继承 空白的函数声明  然后自己实现  -- interface  接口  implement
this lecture build RotatingSLList 能够使用 SLList的所有方法  但多一个 rotateRight方法
一个类变成另一个类的下位词 -- extend
Example: Suppose we have `[5, 9, 15, 22]`. After rotateRight: `[22, 5, 9, 15].`
```java
package lecture09;  
  
import lecture05.DLList;  
  
public class RotatingDLList<T> extends DLList<T> {  
  
    public void rotateRight(){  
        T item = removeLast();  
        addFirst(item);  
    }  
    public static void main(String[] args) {  
        RotatingDLList<Integer> rotatingDLList =new RotatingDLList<>();  
        rotatingDLList.addFirst(10);  
        rotatingDLList.addFirst(20);  
        rotatingDLList.addFirst(30);  
        rotatingDLList.addFirst(40);  
        rotatingDLList.print();  
        rotatingDLList.rotateRight();  
        rotatingDLList.print();  
  
  
    }  
}
```
Because of extends, RotatingSLList inherits all members of SLList:
- All instance and static variables.
- All methods.
- All nested classes.
- Constructors are **not** inherited!

another example: VengefulSLList
- Remembers all Items that have been destroyed by removeLast.
- Has an additional method printLostItems(), which prints all deleted items.

```java
package lecture09;  
  
import lecture05.DLList;  
  
public class VengefulDLList<T> extends DLList<T> {  
    DLList<T> lostItems;  
  
    public VengefulDLList() {  
        lostItems = new DLList<>();  
    }  
  
    @Override  
    public T removeLast() {  
        T lostItem = super.removeLast();  
        lostItems.addLast(lostItem);  
        return lostItem;  
    }  
  
    public void printLostItems() {  
        lostItems.print();  
    }  
  
    public static void main(String[] args) {  
        VengefulDLList<Integer> vs1 = new VengefulDLList<Integer>();  
        vs1.addLast(1);  
        vs1.addLast(5);  
        vs1.addLast(10);  
        vs1.addLast(13);      /* [1, 5, 10, 13] */  
        vs1.removeLast();     /* 13 gets deleted. */  
        vs1.removeLast();     /* 10 gets deleted. */  
        System.out.print("The fallen are: ");  
        vs1.printLostItems(); /* Should print 10 and 13. */  
    }  
}
```

- 父对象的引用  super
- 加了新的属性  --  新的构造函数   如果不加 会报错 lostItems is null  并为实例化  没有 addLast方法

事实上在我们调用下面这段代码的时候  Java的规则是会调用superclass的构造函数
```java
public VengefulDLList() {  
    lostItems = new DLList<>();  
} 
```
可以通过debug来证明这件事儿
![Pasted image 20250311215619.png|500](/img/user/accessory/Pasted%20image%2020250311215619.png)
一定要注意  如果不写super()也会 隐式调用父类的构造方法

如果想写另一个带参数的构造函数
![Pasted image 20250311220107.png|500](/img/user/accessory/Pasted%20image%2020250311220107.png)
Java会默认调用空参的构造函数 -- 所以必须写super(x)


**The Object Class**
![Pasted image 20250311220348.png|500](/img/user/accessory/Pasted%20image%2020250311220348.png)
之前写AList的时候用到过Object
事实上Object是一切类的父类   隐式的成为Object的父类
Object Methods
![Pasted image 20250311220536.png|500](/img/user/accessory/Pasted%20image%2020250311220536.png)

**Is-a vs. Has-A**
extends 是 一种 is-a 关系
但很多时候 被错误用于 has-a关系
example: stack in Java
在Java中 stack继承了list  这是在说 stack is a list. stack继承了list的get方法等等  但是stack的实际方法只有pop和push  有一个 get方法会很奇怪
所以事实上 stack should has a list
用list来存储stack中的数据
所以正确的方法 或许是这样
![Pasted image 20250311221440.png|500](/img/user/accessory/Pasted%20image%2020250311221440.png)
![Pasted image 20250311221452.png|500](/img/user/accessory/Pasted%20image%2020250311221452.png)
笑死我了 这张图很形象了

**Encapsulation**
封装
When building large programs, our enemy is complexity.
我们在前面的实现中 使用了一些方法来减少复杂性
- layers of abstraction
- hide information
- ...

封装 就是 说 你有一个对象 他的实现是完全隐藏的 也就说 如果你想跟这个对象交互的唯一方法 就是一个接口 或 一组公共的方法

**Implementation Inheritance Breaks Encapsulation**
![Pasted image 20250312142918.png|500](/img/user/accessory/Pasted%20image%2020250312142918.png)
![Pasted image 20250312142946.png|500](/img/user/accessory/Pasted%20image%2020250312142946.png)
这里有两个Dog类的实现 对于Dog类来说  其实没有什么区别  都能运行起来
但是如果有一个Dog类的subclass -- VerboseDog -- 有时候会出现问题

对于第一种实现方法
重写barkMany方法 -- 在barkMany方法中 循环调用了父类的bark方法（继承过来的）
输出就是 bark bark bark
![Pasted image 20250312142747.png|500](/img/user/accessory/Pasted%20image%2020250312142747.png)
但是对于第二种实现方法
我重写覆盖了barkMany  barkMany调用bark  而bark调用barkMany 这个时候的barkMany是我新的barkMany（VerboseDog）的barkMany -- 然后就会再次调用bark  陷入循环
![Pasted image 20250312142807.png|500](/img/user/accessory/Pasted%20image%2020250312142807.png)
这就是典型的 实现继承 破坏了 封装
这是实现继承的一些潜在的危险 --- 不过我觉得有点奇怪  应该自己写代码过程中不会出现这种情况

**Type Checking and Casting**
编译的时候 编译的是 Static Type   编译器通过Static Type检查 就能运行
在运行的时候 才会看Dynamic Type  能不能找到想用的方法
![Pasted image 20250312145105.png|600](/img/user/accessory/Pasted%20image%2020250312145105.png)

![Pasted image 20250312145044.png|500](/img/user/accessory/Pasted%20image%2020250312145044.png)
事实上由于dlList的Static Type就是Static Type 所以事实上找不到printLostItems方法

使用 new 关键字的表达式具有指定的编译时类型。示例：
`SLList<Integer> sl = new VengefulSLList<Integer>();`  
右侧 (RHS) 表达式的编译时类型是 VengefulSLList。
VengefulSLList 是 SLList，因此允许赋值。
`VengefulSLList<Integer> vsl = new SLList<Integer>();`  
右侧表达式的编译时类型是 SLList。
SLList 不一定是 VengefulSLList，因此会导致编译错误。

方法调用时的编译类型等于其声明的类型
`public static Dog maxDog(Dog d1, Dog d2) { … }`
```java
Poodle frank  = new Poodle("Frank", 5);
Poodle frankJr = new Poodle("Frank Jr.", 15);

Dog largerDog = maxDog(frank, frankJr);
Poodle largerPoodle = maxDog(frank, frankJr);
```
最后一句错误
假设我真的知道最后一句的Dog 是 Poodle 怎么办
**Casting** 强制转换
但是很危险


**Higher Order Functions**
higher order function, which is a function takes in another fuction as data.
一个函数将另一个函数作为数据

在python中
![Pasted image 20250313144216.png|500](/img/user/accessory/Pasted%20image%2020250313144216.png)
但是在Java中 并没有函数作为参数的说法
can use an interface instead. 可以把函数包装在类中扔给参数

Java会有一点冗长
Java 7 and earlier 是这样的
```java
public interface IntUnaryFunction {  
    int apply(int x);  
}
```

```java
public class TenX implements IntUnaryFunction{  
  
    @Override  
    public int apply(int x) {  
        return 10*x;  
    }  
}
```

```java
public class HoFDemo {  
    public static int doTwice(IntUnaryFunction f,int x){  
        return f.apply(f.apply(x));  
    }  
  
    public static void main(String[] args) {  
        IntUnaryFunction tenX=new TenX();  
        System.out.println(doTwice(tenX,2));  
    }  
}
```

在Java8或更高版本 -- 可以引用函数
```java
public class Java8HofDemo {  
    public static int tenX(int x) {  
        return 10*x;  
    }  
    public static int doTwice(Function<Integer, Integer> f, int x) {  
        return f.apply(f.apply(x));  
    }  
    public static void main(String[] args) {  
        int result = doTwice(Java8HofDemo::tenX, 2);  
        System.out.println(result);  
    }  
}
```