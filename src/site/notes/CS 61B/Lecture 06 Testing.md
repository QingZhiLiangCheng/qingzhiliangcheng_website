---
{"week":"第三周","dg-publish":true,"tags":["cs61b","week3"],"permalink":"/CS 61B/Lecture 06 Testing/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-08T08:54:56.805+08:00","updated":"2025-04-19T09:50:32.182+08:00"}
---


![[[61B SP24] Lecture 6 - Testing.pdf]] 

之前来检查代码 是通过别人准备好的test 或者是 提交gradescope 或者 coursera 来得到分数
this lecture will discuss how you can write tests
the old way:
![Pasted image 20250308090517.png|500](/img/user/accessory/Pasted%20image%2020250308090517.png)

now:
![Pasted image 20250308092144.png|400](/img/user/accessory/Pasted%20image%2020250308092144.png)

一种思路是 对数组排序 然后写一个for循环来对比两个数组是否相同  然后再main函数中调用这个函数
for循环在每个函数里面都需要写  而且  在main里面测试  很臃肿 不雅

我们只需要写一个unit test  前人帮我们写好了一些代码
Unit testing frameworks do the hard work for us.
- Example: JUnit (pre-sp23), AssertJ, and Truth (sp23 to present).
- Less tedious, even fun.

在lecture使用的是 Truth -- google的一个库
在lecture中是用了班助写的一个方差的函数
在以往的lecture和24sp的Testbook中用的是实现一个Selection Sort

Selection sort consists of three steps
-   Find the smallest item.
- Move it to the front.
- Selection sort the remaining N-1 items (without touching the front item).

这里插一嘴  insertion sort就是shi哈哈哈
排序过程见  [Sorting Algorithms Animations | Toptal®](https://www.toptal.com/developers/sorting-algorithms)

有一个思路是先不看代码 或者 不写代码  写一个测试  然后再去写代码通过测试
我的代码结构和lecture中的不太一样  我是个maven项目  maven项目好像要求路径需要一样
而且我需要加maven依赖
```xml
<dependencies>  
    <dependency>
        <groupId>com.google.truth</groupId>  
        <artifactId>truth</artifactId>  
        <version>1.1.2</version>  
    </dependency>
</dependencies>
```

```java
package lecture06;  
import static com.google.common.truth.Truth.assertThat;  
  
public class MySortTest {  
    public static void testSort() {  
        String[] input = {"rawr", "a", "zaza", "newway"};  
        String[] expected = {"a", "newway", "rawr", "zaza"};  
        MySort.sort(input);  
        assertThat(input).isEqualTo(expected);  
    }  
}
```

加入`@Test`  现在还不需要去考虑这是什么意思  就是个注解
![Pasted image 20250308094323.png|500](/img/user/accessory/Pasted%20image%2020250308094323.png)

要删掉static  才会出去那个绿色小三角
![Pasted image 20250308094441.png|500](/img/user/accessory/Pasted%20image%2020250308094441.png)

由于什么也没实现  所以 运行失败
![Pasted image 20250308094548.png|600](/img/user/accessory/Pasted%20image%2020250308094548.png)

Step1 Find the smallest item.  === 实现FindSmallest和testFindSmallest
![Pasted image 20250308100234.png|500](/img/user/accessory/Pasted%20image%2020250308100234.png)
When you're programming and get stuck on an issue like this that is easily describable, it's probably best to turn to a search engine. For example, we might search "less than strings Java" with Google. Such a search might yield a Stack Overflow post like [this one](https://stackoverflow.com/questions/5153496/how-can-i-compare-two-strings-in-java-and-define-which-of-them-is-smaller-than-t).
One of the popular answers for this post explains that the `str1.compareTo(str2)` method will return a negative number if `str1 < str2`, 0 if they are equal, and a positive number if `str1 > str2`.
Incorporating this into our code, we might end up with:
```java
/** Returns the smallest string in x. 
  * @source Got help with string compares from https://goo.gl/a7yBU5. */
public static String findSmallest(String[] x) {
    String smallest = x[0];
    for (int i = 0; i < x.length; i += 1) {
        int cmp = x[i].compareTo(smallest);
        if (cmp < 0) {
            smallest = x[i];
        }
    }
    return smallest;
}
```
用@source 在代码中标清楚来源

Step2 Swap
```java
public static void swap(String[] x, int a, int b) {  
    String temp = x[a];  
    x[a] = x[b];  
    x[b] = temp;  
}
```

```java
@Test  
public void testSwap() {  
    String[] input = {"i", "have", "an", "egg"};  
    int a = 0;  
    int b = 2;  
    String[] expected = {"an", "have", "i", "egg"};  
  
    MySort.swap(input, a, b);  
    assertThat(expected).isEqualTo(input);  
}
```

这个老师好喜欢用递归啊
然后改了一下下findSmallest
```java
package lecture06;  
  
public class MySort {  
    /**  
     * Sorts strings destructively.     */    public static void sort(String[] x) {  
        sort(x, 0);  
    }  
  
    private static void sort(String[] x, int start) {  
        if (start == x.length) {  
            return;  
        }  
        int smallestIndex = findSmallest(x, start);  
        swap(x, start, smallestIndex);  
        sort(x, start + 1);  
    }  
      
    /**  
     * Returns the smallest string in x.     */    public static int findSmallest(String[] x, int start) {  
        int smallestIndex = start;  
        for (int i = start; i < x.length; i += 1) {  
            int cmp = x[i].compareTo(x[smallestIndex]);  
            if (cmp < 0) {  
                smallestIndex = i;  
            }  
        }  
        return smallestIndex;  
    }  
  
    public static void swap(String[] x, int a, int b) {  
        String temp = x[a];  
        x[a] = x[b];  
        x[b] = temp;  
    }  
}
```

```java
package lecture06;  
  
import org.junit.Test;  
  
import static com.google.common.truth.Truth.assertThat;  
  
  
public class MySortTest {  
    @Test  
    public void testSort() {  
        String[] input = {"rawr", "a", "zaza", "newway"};  
        String[] expected = {"a", "newway", "rawr", "zaza"};  
        MySort.sort(input);  
        assertThat(input).isEqualTo(expected);  
    }  
  
  
    @Test  
    public  void testFindSmallest() {  
        String[] input = {"i", "have", "an", "egg"};  
        int expected = 2;  
  
        int actual = MySort.findSmallest(input, 0);  
        assertThat(actual).isEqualTo(expected);  
  
        String[] input2 = {"there", "are", "many", "pigs"};  
        int expected2 = 2;  
  
        int actual2 = MySort.findSmallest(input2, 2);  
        assertThat(actual2).isEqualTo(expected2);  
    }  
  
  
    @Test  
    public void testSwap() {  
        String[] input = {"i", "have", "an", "egg"};  
        int a = 0;  
        int b = 2;  
        String[] expected = {"an", "have", "i", "egg"};  
  
        MySort.swap(input, a, b);  
        assertThat(expected).isEqualTo(input);  
    }  
  
    public static void main(String[] args) {  
  
    }  
}
```