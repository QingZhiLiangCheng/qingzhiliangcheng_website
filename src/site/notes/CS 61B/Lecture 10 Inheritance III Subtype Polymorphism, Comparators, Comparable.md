---
{"week":"第四周","dg-publish":true,"tags":["cs61b","week4"],"permalink":"/CS 61B/Lecture 10 Inheritance III Subtype Polymorphism, Comparators, Comparable/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-12T14:21:13.375+08:00","updated":"2025-04-19T09:51:04.751+08:00"}
---


**In this lecture**
- Reviewing Dynamic Method Selection -- 回顾动态方法选择
- Defining Subtype Polymorphism and contrasting it against Explicit Higher Order Functions 定义子类型多态性 并将其与显式高阶函数进行对比
- 了解类型多态的应用
	- Comparators 
	- Comparables

**Subtype Polymorphism**
providing a single interface to entitles of different types.

**Subtype Polymorphism vs.  Higher Order Functions**
使用显式高阶函数方法，您有一种通用的方式来打印出两个对象中较大的一个。相比之下，在子类型多态方法中，对象本身会做出选择。调用的 largerFunction 取决于 x 和 y 实际上是什么。

today's goal: the one true max function
![Pasted image 20250313185329.png|500](/img/user/accessory/Pasted%20image%2020250313185329.png)

![Pasted image 20250314080538.png|500](/img/user/accessory/Pasted%20image%2020250314080538.png)
第一个框没有问题  任何类都是Object的子类
最后一个框也没有问题  max的返回值是Object -- 强制转换  编译不报错 但是危险
问题是第二个框  > 号 怎么知道怎么比两只Dog的大小

第一个反应可能是给Dog专门写一个maxDog的方法
```java
public static Dog maxDog(Dog[] dogs) {
    if (dogs == null || dogs.length == 0) {
        return null;
    }
    Dog maxDog = dogs[0];
    for (Dog d : dogs) {
        if (d.size > maxDog.size) {
            maxDog = d;
        }
    }
    return maxDog;
}
```
但是如果出现了maxCat ……  就要重新复制代码

在Python或C++中，可以重新定义>运算符的工作方式，使其应用于不同类型时能以不同的方式工作。不幸的是，Java不具备这种能力。相反，我们转向接口继承来帮助我们

**Solution: Comparables**
我们可以创建一个接口，保证任何实现类，例如Dog，都包含一个比较方法，我们称之为compareTo。
![Pasted image 20250314081530.png|400](/img/user/accessory/Pasted%20image%2020250314081530.png)

```java
public interface OurComparable {  
    public int compareTo(Object o);  
}
```
为什么返回值是int
We will define its behavior like so:
- Return -1 if `this` < o.
- Return 0 if `this` equals o.
- Return 1 if `this` > o.
给Dog 加上 implement OurComparable -- 这是说Dog is 比较的对象

![Pasted image 20250314083223.png|400](/img/user/accessory/Pasted%20image%2020250314083223.png)
这就是我们说的static type，编译器认得是Object（即使我们知道一定是Dog）Object不一定有size  所有我们要强制转化一下
```java
@Override  
public int compareTo(Object o) {  
    Dog otherDog = (Dog) o;  
    if(this.size<otherDog.size){  
        return -1;  
    }else if(this.size==otherDog.size){  
        return 0;  
    }else {  
        return 1;  
    }  
}
```

所以说max函数就变成了
```java
public static OurComparable max(OurComparable[] items) {  
    int maxDex = 0;  
    for (int i = 0; i < items.length; i += 1) {  
        int cmp=items[i].compareTo(items[maxDex]);  
        if (cmp>0) {  
            maxDex = i;  
        }  
    }  
    return items[maxDex];  
}
```

可以简化一下compareTo函数
```java
@Override  
public int compareTo(Object o) {  
    Dog otherDog = (Dog) o;  
    return this.size - otherDog.size;  
}
```

小结
我们通过compareTo实现了对任意类型的max --  不同的类型写自己的不同的比较大小的方法 -- 这就是多态

**the issues with ourComparable**
1. 使用了强制转换cast
2. 到目前为止 只有Dog 类 使用我们的 compareTo  如果想让所有类型用 integer String  可能要重写整个Java库

事实上是Java有自己的 Comparable
![Pasted image 20250314085613.png|500](/img/user/accessory/Pasted%20image%2020250314085613.png)

```java
public class Dog implements Comparable<Dog> {  
    public String name;  
    public int size;  
  
    public Dog(String name, int size) {  
        this.name = name;  
        this.size = size;  
    }  
  
    public void bark() {  
        System.out.println("name:" + name);  
    }  
  
    @Override  
    public int compareTo(Dog otherDog) {  
        return this.size - otherDog.size;  
    }  
}
```

```java
public static Comparable max(Comparable[] items) {  
    int maxDex = 0;  
    for (int i = 0; i < items.length; i += 1) {  
        int cmp=items[i].compareTo(items[maxDex]);  
        if (cmp>0) {  
            maxDex = i;  
        }  
    }  
    return items[maxDex];  
}
```

**Comparators**
We've just learned about the comparable interface, which imbeds into each Dog the ability to compare itself to another Dog. Now, we will introduce a new interface that looks very similar called `Comparator`.
自然顺序 - 用于指特定类的 compareTo 方法中隐含的排序。
举个例子，正如我们之前所说，Dogs 的自然排序是根据 size 的值定义的。 如果我们想以不同于自然顺序的方式对 Dogs 进行排序，例如按名称的字母顺序排序，该怎么办？
Java 的方法是使用 Comparator。 由于 comparator 是一个对象，我们将通过在 Dog 内部编写一个实现 Comparator 接口的嵌套类来使用 Comparator。

**注意在Java中 实现了Comparable 固定的排序方法 就是自然排序 其他的都是非自然排序**

Comparator接口里面有什么?
```java
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

The rule for `compare` is just like `compareTo`:
- Return negative number if o1 < o2.
- Return 0 if o1 equals o2.
- Return positive number if o1 > o2.

给Dog按String 首字母排序

注意compare方法两个参数  所以 这并不是Dog该有的一个函数  就是说没法 dog1.compare -- 所以我们需要建一个单独的所谓的狗比较机
但是这个比较器像是狗的一个特征

请注意，我们将 NameComparator 声明为一个静态类。这是一个细微的差别，但我们这样做是因为我们不需要实例化 Dog 来获得一个 NameComparator。

```java
package lecture10;  
  
import java.util.Comparator;  
  
public class Dog implements Comparable<Dog> {  
    public String name;  
    public int size;  
  
    private static class NameComparator implements Comparator<Dog> {  
        public int compare(Dog a, Dog b) {  
            return a.name.compareTo(b.name);  
        }  
    }  
  
    public Dog(String name, int size) {  
        this.name = name;  
        this.size = size;  
    }  
  
    public void bark() {  
        System.out.println("name:" + name);  
    }  
  
    @Override  
    public int compareTo(Dog otherDog) {  
        return this.size - otherDog.size;  
    }  
  
  
    public static Comparator<Dog> getNameComparator() {  
        return new NameComparator();  
    }  
  
}
```

事实上 我们可以实现好多个非自然排序
like
![Pasted image 20250314092216.png|600](/img/user/accessory/Pasted%20image%2020250314092216.png)