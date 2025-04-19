---
{"week":"第一周","dg-publish":true,"tags":["cs61b","week1"],"permalink":"/CS 61B/Lecture 02 Defining and Using Classes/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-03T14:20:22.407+08:00","updated":"2025-04-19T09:49:54.300+08:00"}
---


![[[61B SP24] Lecture 2 - Defining and Using Classes.pdf]]
官方notes: [2. Defining and Using Classes | CS61B Textbook](https://cs61b-2.gitbook.io/cs61b-textbook/2.-defining-and-using-classes)

### Classes in Java
![Pasted image 20250303142519.png|500](/img/user/accessory/Pasted%20image%2020250303142519.png)
这是上一节课所学到的东西
给Dog建立了一个makeNoise方法  然后再DogLauncher调用它
但是问题是并不是所有的狗的叫声都是一样的
我们假设狗的叫声跟狗的体型有关系
![Pasted image 20250303150121.png](/img/user/accessory/Pasted%20image%2020250303150121.png)
Idea报错 无法从static上下文引用非static字段 weightInPounds
如果给weightInPounds设置为static  默认运行时yipyipyip  因为weightInPounds 加了static后 默认创建int是0

课程中演示是去掉了makeNoise方法的static 这个时候右边又报错
![Pasted image 20250303150517.png](/img/user/accessory/Pasted%20image%2020250303150517.png)

现在的代码的意思是  狗类的通用问题  how do dogs make noise？
但我们现在想要的是特定的狗 make noise
类可以被实例化 只有实例才可以保存数据
所以我们需要创建狗的实例
![Pasted image 20250303151035.png](/img/user/accessory/Pasted%20image%2020250303151035.png)

A class that uses another class is sometimes called a "client" of that class, i.e. `DogLauncher` is a client of `Dog`. Neither of the two techniques is better: Adding a main method to `Dog` may be better in some situations, and creating a client class like `DogLauncher` may be better in others. The relative advantages of each approach will become clear as we gain additional practice throughout the course.

一些关键观察和术语：
- 在Java中，对象是任何类的实例。
- Dog类有自己的变量，也称为实例变量或非静态变量。这些变量必须在类内部声明，不像Python或Matlab等语言，可以在运行时添加新变量。
- 我们在Dog类中创建的方法没有使用static关键字。我们称这样的函数为实例方法或非静态方法。
- 要调用makeNoise方法，我们必须先使用new关键字实例化一个Dog，然后让特定的Dog叫。换句话说，我们调用的是d.makeNoise()而不是Dog.makeNoise()。
- 一旦对象被实例化，它可以被赋值给一个适当类型的已声明变量，例如d = new Dog();
- 类的变量和方法也称为类的成员。
- 类的成员通过点符号访问。

**Class Methods vs. Instance Methods**
**static vs. non-static**
Java allows us to define two types of methods:
- Class methods, a.k.a. static methods.
- Instance methods, a.k.a. non-static methods.

**differentce of static methods with non-static methods?**
- 当method是static的时候  对多有的狗都通用 这是How do dogs make noise?的问题
  为了使用静态方法，我们使用之前看到的类名来调用它
- 如果method是non-static的   non-static特定于一只狗怎么发出声音的
  引用了自己的实体变量
  使用实体调用

**似乎non-static methods更强大  Why static Methods？**
有些时候类根本就不会被实例化  比如说有一个类叫Math
![Pasted image 20250303152001.png|500](/img/user/accessory/Pasted%20image%2020250303152001.png)

sometimes, classes may have a mix of static and non-static methods.
写一个static version 和 non-static version的 maxDog methods
```java
public static Dog maxDog(Dog d1, Dog d2) {  
    if (d1.weightInPounds > d2.weightInPounds) {  
        return d1;  
    } else {  
        return d2;  
    }  
}
```

```java
public class DogLauncher {  
    public static void main(String[] args) {  
        Dog smallDog = new Dog(10);  
        smallDog.makeNoise();  
  
        Dog bigDog = new Dog(100);  
  
        Dog larger = Dog.maxDog(smallDog, bigDog);  
        System.out.println(larger.weightInPounds);  
    }  
}
```

```java
public Dog maxDog(Dog d){  
    if(this.weightInPounds>d.weightInPounds){  
        return this;  
    }else{  
        return d;  
    }  
}
```

```java
Dog dog = smallDog.maxDog(larger);  
System.out.println(dog.weightInPounds);
```

有种cpp友元函数  还有两种不同的重载的那种感觉了 

**Exercise 1.2.1**: What would the following method do? If you're not sure, try it out.
```java
public static Dog maxDog(Dog d1, Dog d2) {
    if (weightInPounds > d2.weightInPounds) {
        return this;
    }
    return d2;
}
```


**Static Variables**
有时类拥有静态变量是有用的。这些是固有于类本身的属性，而不是实例。例如，我们可能会记录狗的科学名称（或双名法）是“Canis familiaris”：
```java
public class Dog {
    public int weightInPounds;
    public static String binomen = "Canis familiaris";
    ...
}
```
Static variables should be accessed using the name of the class rather than a specific instance, e.g. you should use `Dog.binomen`, not `d.binomen`.

`public static void main(String[] args)`
With what we've learned so far, it's time to demystify the declaration we've been using for the main method. Breaking it into pieces, we have:
- `public`: So far, all of our methods start with this keyword.
- `static`: It is a static method, not associated with any particular instance.
- `void`: It has no return type.
- `main`: This is the name of the method.
- `String[] args`: This is a parameter that is passed to the main method.

**command line arguments**
main是有Java解释器本身调用的  提供这些参数的任务在于解释器  通常值得命令行参数
```java
public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println(args[0]);
    }
}
```

```shell
$ java ArgsDemo these are command line arguments
these
```

In the example above, `args` will be an array of Strings, where the entries are {"these", "are", "command", "line", "arguments"}
### Interactive Debugging
use IntelliJ's build-in
之前就会  没啥写的

