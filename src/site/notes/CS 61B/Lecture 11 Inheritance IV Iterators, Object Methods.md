---
{"week":"第四周","dg-publish":true,"permalink":"/CS 61B/Lecture 11 Inheritance IV Iterators, Object Methods/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-13T14:27:44.206+08:00","updated":"2025-03-30T15:27:52.230+08:00"}
---


### Iterators
today's goal: ArraySet
- add(value): Add the value to the ArraySet if it is not already present.
- contains(value): Checks to see if ArraySet contains the key.
- size(): Returns number of values

实现了一个简单的ArraySet -- 没有写扩容和缩容
```java
package lecture11;  
  
public class ArraySet<T> {  
    private T[] items;  
    private int size;  
  
    public ArraySet() {  
        items = (T[]) new Object[100];  
        size = 0;  
    }  
  
    public boolean contains(T x) {  
        for (int i = 0; i < size; i += 1) {  
            if (items[i].equals(x)) {  
                return true;  
            }  
        }  
        return false;  
    }  
  
    public void add(T x) {  
        if (x == null) {  
            throw new IllegalArgumentException("can't add null");  
        }  
        if (contains(x)) {  
            return;  
        }  
        items[size] = x;  
        size += 1;  
    }  
  
    public int size() {  
        return size;  
    }  
  
    public static void main(String[] args) {  
        ArraySet<Integer> aset = new ArraySet<>();  
        aset.add(5);  
        aset.add(23);  
        aset.add(42);  
    }  
}
```

Java中也存在set  而且支持增强for循环 -- 引出来了this lecture要介绍的内容  -- iterator迭代器
对于增强for循环 可以翻译成右边的代码
![Pasted image 20250315104811.png|500](/img/user/accessory/Pasted%20image%2020250315104811.png)

iterator就相当于一个小巫师
hasNext是问 这个地方还有东西嘛 -- 有还能输出嘛那个意思
![Pasted image 20250315105811.png|500](/img/user/accessory/Pasted%20image%2020250315105811.png)
![Pasted image 20250315105821.png|500](/img/user/accessory/Pasted%20image%2020250315105821.png)
next实际上是干了两件事
	- 第一件事是大声喊出 5
	- 第二件事是移动到下一个元素 -- 无论是什么类型

注意最后的时候
![Pasted image 20250315110130.png|500](/img/user/accessory/Pasted%20image%2020250315110130.png)


```java
public Iterator<T> iterator() {  
    return new ArraySetIterator();  
}
```

写ArraySetIterator -- 不算是单独的类更像是一个属性
```java
private class ArraySetIterator{  
  
}
```
java不认为ArraySetIterator是一个`Iterator<Integer>`返回类 
所以应该说 ArraySetIterator is Iterator --- implements
```java
private class ArraySetIterator<T> implements Iterator<T>{  
  
    @Override  
    public boolean hasNext() {  
        return false;  
    }  
  
    @Override  
    public T next() {  
        return null;  
    }  
}
```
然后就是写内部逻辑
我们需要一个巫师的位置
```java
private class ArraySetIterator implements Iterator<T> {  
  
    private int index;  
  
    ArraySetIterator() {  
        index = 0;  
    }  
  
    @Override  
    public boolean hasNext() {  
        return index<size;  
    }  
  
    @Override  
    public T next() {  
       T returnItem = items[index];  
       index++;  
       return returnItem;  
    }  
}
```

```java
public static void main(String[] args) {  
    ArraySet<Integer> aset = new ArraySet<>();  
    aset.add(5);  
    aset.add(23);  
    aset.add(42);  
  
    /*for(int x:aset){  
        System.out.println(x);    }*/  
    Iterator<Integer> seer= aset.iterator();  
    while(seer.hasNext()){  
        int x=seer.next();  
        System.out.println(x);  
    }  
}
```
使用右边的代码 已经可以输出了
现在及时实现了右边的代码  用增强for循环还是不被允许
![Pasted image 20250315123011.png|500](/img/user/accessory/Pasted%20image%2020250315123011.png)
这是因为Java不知道aset有迭代器方法
所以我们得告诉Java   ArraySet is 一个有迭代器方法的类
需要继承
```java
public class ArraySet<T> implements Iterable<T>{
//eee
}
```

### Object Methods
todays
- toString
- equals

**toString()**
默认的 Object 类的 toString() 方法会打印对象在内存中的位置。这是一个十六进制字符串。
没有toString方法回去看父类的toString方法 -- 就是打印内存中的位置
像 Arraylist 和 java 数组这样的类有它们自己重写的 toString() 方法版本。这就是为什么当您使用 Arraylist 并为其编写测试时，错误总是会以一种友好的格式返回列表，像这样 (1, 2, 3, 4)，而不是返回内存位置。
![Pasted image 20250315154709.png|400](/img/user/accessory/Pasted%20image%2020250315154709.png)

所以我们需要
```java
@Override  
public String toString(){  
    String x="[";  
    for(T i:this){  
        x+=i.toString()+" ";  
    }  
    x+="]";  
    return x;  
}
```
但是有个问题 += 这样构建字符串 底层每次都是创建一个新字符串 然后把之前的每个字符复制到新字符串  this is slow
使用StringBuilder类 you can continue appending to the same string object instead of creating a new one each time.
```java
@Override  
public String toString(){  
    StringBuilder stringBuilder=new StringBuilder("[");  
    for(T i:this){  
        stringBuilder.append(i.toString()).append(" ");  
    }  
    stringBuilder.append("]");  
    return stringBuilder.toString();  
}
```

**== vs. equals**
在Java中 == 使用的是判断的bit是否相同--就是地址是否相同 -- 之前讲过的黄金法则
equals 是语义上的平等 
![Pasted image 20250315160157.png|500](/img/user/accessory/Pasted%20image%2020250315160157.png)
![Pasted image 20250315160209.png|500](/img/user/accessory/Pasted%20image%2020250315160209.png)


```java
public static void main(String[] args) {  
    ArraySet<Integer> aset = new ArraySet<>();  
    aset.add(5);  
    aset.add(23);  
    aset.add(42);
    ArraySet<Integer> arraySet = new ArraySet<>();  
    arraySet.add(5);  
    arraySet.add(23);  
    arraySet.add(42);  
    System.out.println(arraySet==aset);  
    System.out.println(arraySet.equals(aset));  
}
```
事实上会打印两个false
原因在于我们还没有去重写ArraySet的equals方法  那么就会继承父类的equals方法
![Pasted image 20250315160926.png|400](/img/user/accessory/Pasted%20image%2020250315160926.png)
而父类其实就是Object类  Object类的equals方法是这么写的
![Pasted image 20250315161003.png|400](/img/user/accessory/Pasted%20image%2020250315161003.png)
事实上就是 ==

在实现重写equals方法之前 需要在深入理解一下什么是this
**this: Address of current Object**
所以说  使用 return(this == obj) 不对

这里用了一个新的语法 o instanceof ArraySet  -  是说 o是一个ArraySet的实例化对象嘛？
example
![Pasted image 20250315161822.png|500](/img/user/accessory/Pasted%20image%2020250315161822.png)
```java
@Override  
public boolean equals(Object obj) {  
    if (obj instanceof ArraySet otherArraySet) {  
        if (this.size != otherArraySet.size) {  
            return false;  
        }  
        for (T i : this) {  
             if(!otherArraySet.contains(i)){  
                 return false;  
             }  
        }  
        return true;  
    }  
    return false;  
}
```
