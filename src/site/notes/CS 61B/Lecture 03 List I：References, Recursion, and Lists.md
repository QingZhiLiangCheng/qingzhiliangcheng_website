---
{"week":"第二周","dg-publish":true,"tags":["cs61b","week2"],"permalink":"/CS 61B/Lecture 03 List I：References, Recursion, and Lists/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-04T19:40:48.805+08:00","updated":"2025-04-19T09:50:15.533+08:00"}
---


![[[61B SP24] Lecture 3 - Lists 1_ References, Recursion, and Lists.pdf]]

在Lecture03的上半部分 通过一个The Mystery of the Walrus的例子 引出了 Reference和Reference的内存存储机制
![Pasted image 20250304203855.png|500](/img/user/accessory/Pasted%20image%2020250304203855.png)
我们可以使用这个可视化网站跟踪整个过程[Java Visualizer](https://cscircles.cemc.uwaterloo.ca//java_visualize/#mode=display)
最终的答案是
![Pasted image 20250304204018.png|400](/img/user/accessory/Pasted%20image%2020250304204018.png)

想要弄明白这个问题
首先要弄明白数据在内存上是怎么存储的
这就要回到CSAPP中学过的内容了

All information in your computer is stored in _memory_ as a sequence of ones and zeros. Some examples:
- 72 is often stored as 01001000
- 205.75 is often stored as 01000011 01001101 11000000 00000000
- The letter H is often stored as 01001000 (same as 72)
- The true value is often stored as 00000001
One interesting observation is that both 72 and H are stored as 01001000. This raises the question: how does a piece of Java code know how to interpret 01001000?
The answer is through types! For example, consider the code below:
In Java, there are 8 primitive types: byte, short, int, long, float, double, boolean, and char. Each has different properties

在这里 定义声明赋值 其实跟C++是如出一辙的
lecture03 中 简单介绍了一下  这里我就不再阐述了

现在来回答上面的Mystery of the Walrus这个问题
这个问题的关键是 **The Golden Rule of Equals (GRoE)**
It turns out our Mystery has a simple solution: When you write `y = x`, you are telling the Java interpreter to copy the **bits** from x into y.
所以说在Mystery of the Walrus的第二部分 --  其实就是把x中的bit原封不动的copy给了y 只不过这里面的bit表示的刚好就是x本身的值

而对于第一部分的答案 涉及到Reference Types引用类型
不属于八大基本类型的其他类型在java中都是引用类型
引用类型当实例化的时候就会得到对于实例的引用
在执行这段代码的时候  实际上是在内存中找到了一块空间用来放这个对象
然后返回了这个对象的地址 -- 存放的位置
![Pasted image 20250304205038.png|500](/img/user/accessory/Pasted%20image%2020250304205038.png)
![Pasted image 20250304205431.png|500](/img/user/accessory/Pasted%20image%2020250304205431.png)
![Pasted image 20250304205515.png|500](/img/user/accessory/Pasted%20image%2020250304205515.png)
![Pasted image 20250304205527.png|500](/img/user/accessory/Pasted%20image%2020250304205527.png)
这里插一句 如果只是声明 不赋值  可能只是一些0和1
这也就是可视化网站中为什么用了box和pointer指向了同一个位置的原因
![Pasted image 20250304205713.png|300](/img/user/accessory/Pasted%20image%2020250304205713.png)

**Parameter Passing**
参数传递
When you pass parameters to a function, you are also simply copying the bits. In other words, the GRoE also applies to parameter passing. Copying the bits is usually called "pass by value". In Java, we **always** pass by value.
![Pasted image 20250305080200.png|500](/img/user/accessory/Pasted%20image%2020250305080200.png)
其实跟cpp一样  值传递的那个原理
pass by value
**Exercise 2.1.1**: Suppose we have the code below:
```java
public class PassByValueFigure {
    public static void main(String[] args) {
           Walrus walrus = new Walrus(3500, 10.5);
           int x = 9;

           doStuff(walrus, x);
           System.out.println(walrus);
           System.out.println(x);
    }

    public static void doStuff(Walrus W, int x) {
           W.weight = W.weight - 100;
           x = x - 5;
    }
}
```
Does the call to `doStuff` have an effect on walrus and/or x? Hint: We only need to know the GRoE to solve this problem.
![Pasted image 20250305080836.png|500](/img/user/accessory/Pasted%20image%2020250305080836.png)
核心在于由于walrus是引用类型 是 地址  所以传进函数的也是那个 实体的地址 -- 所以箭头还是指向那个地方

**Instantiation of Arrays**
array同样是引用类型  同样需要new 来实例化
![Pasted image 20250305081621.png|600](/img/user/accessory/Pasted%20image%2020250305081621.png)


Similar to =, we can think of the == operator in terms of bits. Whenever we write `x==y` we are asking Jafa to compare the literal bits in memory boxes `x` and `y`.
```java
int[] x = new int[]{0, 1, 2, 95, 4};
int[] y = new int[]{0, 1, 2, 95, 4};
System.out.println(x == y); #false
```

This code will print false, since `x` and `y` each contain the 64 bit address of two different arrays in memory, albeit two arrays which happen to contain the same information. If we want to compare the two content of the two arrays, we can use Arrays.equals instead, e.g.
```java
int[] x = new int[]{0, 1, 2, 95, 4};
int[] y = new int[]{0, 1, 2, 95, 4};
System.out.println(Arrays.equals(x, y)); #true
```
原因很简单  因为这个问题的核心  在于x == y比较的地址  而这是new了两个不同的array  在不同的地方

**IntList and Linked Data Structures**
后面就讲list的编写了  其实我已经很熟悉了  但还是跟着敲了一下
主要是想看看 可视化网站中的样子

目前 只是一个简单的list 虽然我觉得写的并不好
```java
public class IntList {  
    public int first;  
    public IntList rest;  
  
    public static void main(String[] args) {  
        IntList L = new IntList();  
        L.first=5;  
        L.rest=null;  
          
        L.rest=new IntList();  
        L.rest.first=10;  
    }  
      
}
```

但是我们能看到的一点是  当new一个新的IntList的时候 first默认是0  rest 默认是null
![Pasted image 20250305082913.png|600](/img/user/accessory/Pasted%20image%2020250305082913.png)

加了一个构造函数  然后反向构造回去了
```java
public class IntList {  
    public int first;  
    public IntList rest;  
  
    public IntList(int f, IntList r){  
        first=f;  
        rest=r;  
    }  
    public static void main(String[] args) {  
        IntList L = new IntList(15,null);  
        L=new IntList(10,L);  
        L=new IntList(5,L);  
          
    }  
  
}
```
![Pasted image 20250305083417.png|500](/img/user/accessory/Pasted%20image%2020250305083417.png)
![Pasted image 20250305083440.png|500](/img/user/accessory/Pasted%20image%2020250305083440.png)

对于size方法 课程里面写了一个递归类型的  一个非递归类型的
```java
/** Return the size of the list using... recursion! */
public int size() {
    if (rest == null) {
        return 1;
    }
    return 1 + this.rest.size();
}
```
![Pasted image 20250305084057.png|500](/img/user/accessory/Pasted%20image%2020250305084057.png)
真的把整个递归过程都画出来了
```java
/** Return the size of the list using no recursion! */
public int iterativeSize() {
    IntList p = this;
    int totalSize = 0;
    while (p != null) {
        totalSize += 1;
        p = p.rest;
    }
    return totalSize;
}
```
![Pasted image 20250305084247.png|500](/img/user/accessory/Pasted%20image%2020250305084247.png)