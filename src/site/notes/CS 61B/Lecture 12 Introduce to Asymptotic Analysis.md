---
{"week":"第五周","dg-publish":true,"permalink":"/CS 61B/Lecture 12 Introduce to Asymptotic Analysis/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-16T17:01:09.204+08:00","updated":"2025-03-30T15:27:53.945+08:00"}
---

跟普林斯顿 [[algorithm/Algorithm Princeton/UNIT3 Analysis of Algorithm\|UNIT3 Analysis of Algorithm]]撞了 感觉

其实我觉得普林斯顿可能讲的更好 是从历史来讲的怎么简化的

可能他讲的更细
efficiency
- time
- memory

![Pasted image 20250317151022.png|500](/img/user/accessory/Pasted%20image%2020250317151022.png)
```java
public static boolean dup1(int[] A) {  
    for (int i = 0; i < A.length; i += 1) {  
        for (int j = i + 1; j < A.length; j += 1) {  
            if (A[i] == A[j]) {  
                return true;  
            }  
        }  
    }  
    return false;  
}
```

```java
public static boolean dup2(int[] A) {  
    for (int i = 0; i < A.length - 1; i += 1) {  
        if (A[i] == A[i + 1]) {  
            return true;  
        }  
    }  
    return false;  
}
```

which better
第一个想到的方法 可能是 Clock Time
课程这里有一段代码 是建立一个秒表  然后不断翻倍array的size  不断计算运行时间
```java
public static void main(String[] args) {  
    int testSize = 1000;  
    double lastTestReturnTime = 0.0;  
    while (lastTestReturnTime < 10) {  
        int[] arr = new int[testSize];  
        for (int j = 0; j < testSize; j++) {  
            arr[j] = j;  
        }  
        Stopwatch s = new Stopwatch();  
        boolean b = dup1(arr);  
        double newTime = s.elapsedTime();  
        System.out.println("Test of size " + testSize + " completed. Time elapsed: " + newTime + " seconds");  
        testSize *= 2;  
        lastTestReturnTime = newTime;  
    }  
}
```
这里用到了一个Stopwatch中的elapsedTime的方法
我查了查 这是普林斯顿的那个库  幸好 之前看过Princeton的课程
![Pasted image 20250317153504.png|350](/img/user/accessory/Pasted%20image%2020250317153504.png)
导入操作很娴熟了都 这里就不多说了
dup1: 运行的时候有一段时间是在创建数组 可能会比较慢-- 但是秒表只是计算的dup1的方法
![Pasted image 20250317153602.png|400](/img/user/accessory/Pasted%20image%2020250317153602.png)
dup2: 
![Pasted image 20250317153735.png|400](/img/user/accessory/Pasted%20image%2020250317153735.png)

![Pasted image 20250317163322.png|500](/img/user/accessory/Pasted%20image%2020250317163322.png)
如果学过Algorithm Analysis的话 其实就知道  O(n^2) 其实是 数据量增加1倍 times变为4倍
![Pasted image 20250317163537.png|500](/img/user/accessory/Pasted%20image%2020250317163537.png)
两倍

但是时间会跟不同的机器有关系 而且会跟这个时候系统运行的其他东西多少有点关系 --  但是倍数一般不管在哪个机器上 都不会变得 都是这么多倍

第二个方法是计算每件事的次数
有点开始设计数学角度
N=10000
![Pasted image 20250317163926.png|500](/img/user/accessory/Pasted%20image%2020250317163926.png)
如果想具体知道怎么计算的  需要去看[[algorithm/Algorithm Princeton/UNIT3 Analysis of Algorithm\|UNIT3 Analysis of Algorithm]]那里有公式
- Good: 与机器无关
- Bad: 麻烦
![Pasted image 20250317164246.png|500](/img/user/accessory/Pasted%20image%2020250317164246.png)

什么算好?
最大输入尺寸 -- 其实就是上界 或者说 最坏程度
![Pasted image 20250317165143.png|500](/img/user/accessory/Pasted%20image%2020250317165143.png)
![Pasted image 20250317165156.png|500](/img/user/accessory/Pasted%20image%2020250317165156.png)

-> dup2 > dup1

简化
Simplification 1: Consider only the worst cases.
Simplification 2: Eliminate low order terms
	忽略较低的项  --  其实就是高数里面的抓大头
Simplification 3: Eliminate multiplicative constants
	忽略系数
Simplification 4: Combine all operations
![Pasted image 20250317170248.png|500](/img/user/accessory/Pasted%20image%2020250317170248.png)
简化好仍然 -- 符合实验值

**Analysis of Nested For Loops (Based on Exact Count)**
尝试不去构建这个表格 -> 能不能看出来
![Pasted image 20250317171148.png|300](/img/user/accessory/Pasted%20image%2020250317171148.png)
里面的这一部分跟N没有关系 -- 看做一个时间单位
跑多少步
![Pasted image 20250317171213.png|500](/img/user/accessory/Pasted%20image%2020250317171213.png)
其实倒三角能一眼看出来 大约$\frac{n^2}{2}$  也可以精确计算

**Big-Theta**
![Pasted image 20250317190135.png|400](/img/user/accessory/Pasted%20image%2020250317190135.png)

**Big O and Big Omega**
![Pasted image 20250317190233.png|400](/img/user/accessory/Pasted%20image%2020250317190233.png)

![Pasted image 20250317190244.png|400](/img/user/accessory/Pasted%20image%2020250317190244.png)
一个上界 一个下界？
