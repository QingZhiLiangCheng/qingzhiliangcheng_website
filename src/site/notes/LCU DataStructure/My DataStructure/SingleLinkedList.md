---
{"dg-publish":true,"permalink":"/LCU DataStructure/My DataStructure/SingleLinkedList/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-07T17:57:41.461+08:00","updated":"2025-07-08T00:19:05.561+08:00"}
---

链表
什么是链表？
从虚拟内存 64位 48位(int a =10 验证, 分析内存视图) 各个分区 介绍到 数组扩容  到 链表
![Pasted image 20241004135222.png|500](/img/user/accessory/Pasted%20image%2020241004135222.png)
大多数Intel兼容机采用小端法的形式，大多数IBM和Oracle采取的是大端法的形式
Android（from Google）和IOS（from Apple）都是小端法

链表有data域和next域  
地址在C++中的体现: 指针 
写好class SimpleIntList的代码 先不用在外面建类 记得先设置成public
讲指针的时候以数组为例 然后推广到为什么用了SimpleIntList* next_;
然后说明 new出来的是个指针
写一点示例代码  然后去可视化网站跑一遍
```cpp
#include <iostream>  
using namespace std;  
class SimpleLinkedList{  
public:  
    SimpleLinkedList* next_;  
    int data_;  
};  
  
int main() {  
    SimpleLinkedList* simpleLinkedList = new SimpleLinkedList();  
    simpleLinkedList->data_ = 10;  
    simpleLinkedList->next_ = new SimpleLinkedList();  
  
    simpleLinkedList->next_->data_=20;  
  
}
```

借此讲一下函数的调度机制 最好的例子是值传递
从可视化和汇编的角度讲一下
%rdi, %rsi, %rdx  %rsp 栈顶指针   另一个是%rbp基指针  %rip放的是下一条指令的地址

加构造函数
```cpp
#include <iostream>  
using namespace std;  
class SimpleLinkedList{  
public:  
    SimpleLinkedList(int data, SimpleLinkedList* next):data_(data),next_(next){};  
    SimpleLinkedList()= default;  
    SimpleLinkedList* next_{};  
    int data_{};  
};  
  
int main() {  
    SimpleLinkedList* simpleLinkedList = new SimpleLinkedList(15, nullptr);  
    simpleLinkedList = new SimpleLinkedList(10,simpleLinkedList);  
    simpleLinkedList = new SimpleLinkedList(5,simpleLinkedList);  
  
    cout<<simpleLinkedList->data_;  
}
```

丑陋, 限制
我们尝试去通过5个改进去把他变成一个优雅 接近现代语言的单链表实现 但还是Int
**Improvent 1: 模块化**
节点 组成 链表
建立链表 记得说明为什么直接在.h里面写代码
```cpp
class IntNode{  
public:  
    IntNode(int data, IntNode* next):data_(data),next_(next){};  
    int data_;  
    IntNode* next_;  
};
```

```cpp
class SingleIntLinkedList{  
public:  
    SingleIntLinkedList(int data){  
        first_ = new IntNode(data, nullptr);  
    }  
    IntNode* first_;  
};
```

为什么好
因为隐藏了空连接的细节 不对用户暴露

addFirst 和 getFirst
```cpp
void AddFirst(int data){  
    first_ = new IntNode(data,first_);  
}  
  
int GetFirst(){  
    return first_->data_;  
}
```

体会SimpleIntLinkedList和SingleIntLinkedList的区别
SingleIntLinkedList的优点在于更像一个中间人 帮你进入数据结构

**Improvent 2: Public vs. Private**
现在SingleIntLinkedList可以绕过 直接访问里面的Node

**Improvement 3: Nested Classed**
内部类

实现Size()和GetLast()
```cpp
int Size(){  
    IntNode* p = first_;  
    int sz = 0;  
    while(p != nullptr) {  
        sz++;  
        p = p->next_;  
    }  
    return sz;  
}
```
 画图
 说明也可以p.next != nullptr 但是看好少算了一个
 然后说也可以用递归 展示一下就行
```cpp
int Size(IntNode* node){  
    if(node->next_ == nullptr) {  
        return 1;  
    }  
    return 1+ Size(node->next_);  
}  
  
int Size(){  
    return Size(first_);  
}
```
记得强调Overload

```cpp
void AddLast(int data){  
    IntNode* p= first_;  
    while(p->next_!= nullptr){  
        p=p->next_;  
    }  
    p->next_ = new IntNode(data, nullptr);  
}
```

**Improvement 4: Caching**
缺点 都要遍历一遍
设计到时间复杂度 O(n)
对于Size来说 加一个变量
说白了就是空间换时间 均摊到了每一个加加减减的操作 均摊等到数组在讲
而且size属性是可以放到中间人上面的 有体现了中间人的好处
改代码

addLast其实我觉着可以用一个tail一直标注最后一个节点 现在我们先不考虑 其实那样有一个小特例的情况 下个视频再说

有个隐藏的bug
就是我建立空list的时候 再调用addLast
p.next的时候错了
就需要特殊情况判断
```java
/**  
 * Add x to the end of the list. * * @param x  
 */  
public void addLast(int x) {  
    size++;  
    if(size==0){  
        first=new IntNode(x,null);  
        return;  
    }  
    IntNode p = first;  
    while (p.next != null) {  
        p = p.next;  
    }  
    p.next = new IntNode(x, null);  
}
```

问题是加上特殊情况判断可能显得代码变的复杂 更长
而且每当我们增加功能的时候 可能都要加上特殊情况判断  而且可能在bug出现之前我们并不能意识到有特殊情况

一个好的方法是使用头结点

**Improvent**
```java
package lecture04;  
  
public class SLList {  
  
    private class IntNode {  
        public int item;  
        public IntNode next;  
  
        IntNode(int item, IntNode next) {  
            this.item = item;  
            this.next = next;  
        }  
    }  
  
    private int size;  
  
    private IntNode sentinel;  
  
    public SLList(int item) {  
        sentinel = new IntNode(0, null);  
        sentinel.next = new IntNode(item, null);  
        size = 1;  
    }  
  
    public SLList() {  
        sentinel = new IntNode(0, null);  
        size = 0;  
    }  
  
    /**  
     * adds item x front of the list.     *     * @param x  
     */  
    public void addFirst(int x) {  
        size++;  
        sentinel.next = new IntNode(x, sentinel.next);  
    }  
  
    /**  
     * return the front item from the list.     *     * @return  
     */  
    public int getFirst() {  
        return sentinel.next.item;  
    }  
  
    /**  
     * Add x to the end of the list.     *     * @param x  
     */  
    public void addLast(int x) {  
        size++;  
        IntNode p = sentinel;  
        while (p.next != null) {  
            p = p.next;  
        }  
        p.next = new IntNode(x, null);  
    }  
  
    public int size() {  
        return size;  
    }  
  
    public static void main(String[] args) {  
        SLList slList = new SLList();  
        slList.addLast(1222);  
        slList.addFirst(10);  
        System.out.println(slList.getFirst());  
        System.out.println(slList.size());  
        slList.addLast(100);  
        System.out.println(slList.size());  
    }  
}
```

主要说明可以放0或者 也可以放size 我感觉放size还挺好的