---
{"dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Information Storage/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-10-01T20:03:06.287+08:00","updated":"2025-04-11T21:21:13.265+08:00"}
---


## Hexadecimal Notation
通常情况下，程序把内存视为一个非常大的数组，而这个非常大的数组是有一个个字节组成的，每个字节都由唯一的数字来表示，称之为*address*（地址）
所有地址的集合叫做*virtual address space*（虚拟地址空间，前面提到过）
![Pasted image 20241001222731.png|500](/img/user/accessory/Pasted%20image%2020241001222731.png)
我们主要提取出其中一个字节来研究
字节是信息存储的一个基本单元
一个字节*Byte*由8个小的*byte*位组成
![Pasted image 20241001222944.png|500](/img/user/accessory/Pasted%20image%2020241001222944.png)
每个位的值有两种状态，0或者1
当全为0时，为min值：0  当全为1时，为max值，十进制为255
有个东西叫位模式
所谓的位模式，我感觉就是一位一位的数，其实就是最最底层的二进制，这一串01010代码可能是个真正的数，也可能是个字母，也可能是个图像，这只是一堆二进制形式的东西，所以位模式的含义就是把声音，图像等等变成一位一位的模式。
但是如果我们直接用二进制就变得特别冗长 用十进制又难以转换为01 所以计算机的设计者最终选择了使用十六进制。十六进制的好处在于一位十六进制数正好对应四位二进制那样子
其实作为计算机的学生，十六进制也算是比较熟悉了
![Pasted image 20241002191600.png|500](/img/user/accessory/Pasted%20image%2020241002191600.png)
在C语言中，十六进制数是以0x开头的
![Pasted image 20241002191735.png|500](/img/user/accessory/Pasted%20image%2020241002191735.png)
有关进制转换（包含小数的进制转换）见[[CSAPP Computer-System-A-Program-Perspective/进制转换\|进制转换]]
## Data Size
在上一章，我们提到过*word size*（字长）的概念 
字长决定了*virtual address space*（虚拟内存地址空间）的最大值
具体来说，如果电脑的系统的字长为w，那么虚拟内存地址空间的地址大小就是从0到2<sup>w</sup> -1
现在我们使用的电脑其实都是64位字长的了，在之前小时候还见到过32位的机器。
对于32位的机器，虚拟地址空间最大为4GB
对于64位的机器，虚拟地址空间最大为16EB

| word size | virtual address space   |
| --------- | ----------------------- |
| w bit     | 0~2<sup>w</sup>-1                  |
| 32bit     | 0~2<sup>32</sup>-1 4GB  |
| 64bit     | 0~2<sup>64</sup>-1 16EB |
在32位机器变为64位机器变化的过程中，涉及到了一些程序的迁移。
而对于大多数的64位机器都可以运行32位机器的程序，这属于一种*backward compatibility*(向后兼容)
例如，一个prog.c的程序可以通过下列的命令在32位机器或者64位机器上运行
```Shell
linux> gcc -m32 prog.c
```
但是下面的命令只能运行在64位机器上
```Shell
linux> gcc -m64 prog.c
```
->所以说我们说一个程序是“32位程序”还是“64位程序”并不是因为是在哪个机器上，而是说这个程序是如何编译的。

计算机和编译器支持多种数据格式，使用不同的方式来编码数据 比如说*integer*和*floating point*应该就是不同的编码方式叭？后面章节应该会介绍的
在C语言中，支持整数，浮点数等多种数据格式，下表是C语言中各个数据类型在不同系统中占用的字节数
![Pasted image 20241002214421.png|500](/img/user/accessory/Pasted%20image%2020241002214421.png)
从表中我们可以看出来，C语言中的integer包括*signed*（有符号类型）和*unsigned*（无符号类型）
有符号类型当然就包括*negative*（负数），zero，*positive*（正数）
值得注意的是里面的char类型，也是包括有符号和无符号两种，这也说明char其实是可以存一位的integer的。除此之外，我们看到char类型一般我们认为是有符号的，除非特意的声明
我们可以看到其实在32位和64位机器中，有些类型所占用的字节发生了变化，为了防止这种不知道变化，C99提出了一种固定大小的数据类型，比如说`int32_t` `int64_t`分别是4字节和8字节，而且不区分在哪个系统中。
C语言中的*floating point* 有*single precision*（单精度）的float和*double precision*（双精度）的double，分别占中4个字节和8个字节
除此之外，我们看到表格中还提到了*pointer*（指针）的占用内存，指针一般是占用整个字长，其实也好理解，因为指针的本质存的就是一个地址
但是值得注意的一个问题是，随着32位机器向着64位机器迁移，可能会出现原来有的人代码用int4个字节存的是32位那时候的指针（也是4个字节）但是一旦迁移到64位机器，指针占用的字节由4字节变成了8字节，int无法放8位的数据，这样就会报错
## Addressing and Byte Ordering
我们注意到，在所有的机器中，几乎所有的对象都是多字节的，比如说int占4个字节，这就需要搞清楚两个问题：
- 对象的地址是什么？
- 如何在内存中对地址进行排序？
首先，我们需要知道，我们把每个字节用唯一的数字来标识，叫做*address*（地址）这也就意味着，int类型的数据其实是占用了4个连续的数字标识的。
所以我们规定：多字节对象被存储为连续字节序列，对象的地址由所使用的字节的最小地址给出！
其实不仅仅是对于int，double这样的类型，数组也是这样的
我们通常使用数组的第一个元素的地址来表示整个数组的地址。
![Pasted image 20241004105915.png|500](/img/user/accessory/Pasted%20image%2020241004105915.png)
这是我通过CLion查看`int a=5`的内存视图。图中两位数位一个字节的，从图中的小横线就能看出来。
<font color="#c0504d">为什么是两位？</font>
首先这是十六进制的表示方法，05是十六进制的5，之所以两位是因为一个字节也就是Byte是由8个byte构成的，我们上面也提到过，所以说一个字节的范围呢是0-255,十六进制刚好1位对应4位二进制，这就是说最大为FF，刚好是两位。
除此之外，其实这个地址的排序也是用的十六进制，上面提到过，所以说我们看到每一行的开头是50,60这样子，每一行有16个字节
而int所占用的事实上是从5c到5f这四个，但是我们`&a`输出的是5c，这也验证了上面的约定。
```cpp
#include<iostream>  
int main(){  
   int a[]={5,6,7};  
   std::cout<<a<<std::endl;  
}
```
对于数组a的内存空间如下图
![Pasted image 20241004110649.png|500](/img/user/accessory/Pasted%20image%2020241004110649.png)
是从54到5f，3个int的大小，但是a存储的事实上是第一个元素也就是第一个int的地址，而第一个int的地址看的是第一个字节，所以说是54。也是变相印证了上面的说法
对于表示对象的字节排序，常见的有两种约定，即*big endian*（大端法）和*little endian*（小端法）
![Pasted image 20241004135222.png|500](/img/user/accessory/Pasted%20image%2020241004135222.png)
大多数Intel兼容机采用小端法的形式，大多数IBM和Oracle采取的是大端法的形式
Android（from Google）和IOS（from Apple）都是小端法
由于大多数的应用程序字节序列对程序员来说是不可见的，这就会造成一些问题。
当远程连接的时候，如果大端法的机器通过网络传送数据给小端法的机器，这就会造成数据的错误。
解决这个问题的方法就是外网络应用程序编写的代码必须遵循已建立的字节排序约定，确保发送机将其内部表示转换成网络标准，接收机再将网络标准转换成自己的内部表示。

在CSAPP这本书中，是做了这么一个实验。
它在以下的系统中运行了试验程序
![Pasted image 20241004161733.png|500](/img/user/accessory/Pasted%20image%2020241004161733.png)
```cpp
#include<stdio.h>  
  
typedef unsigned char *byte_pointer;  
  
void show_bytes(byte_pointer start, size_t len) {  
    int i;  
    for (i = 0; i < len; i++) {  
        printf(" %.2x", start[i]);  
    }  
    printf("\n");  
}  
  
void show_int(int x) {  
    show_bytes((byte_pointer) &x, sizeof(int));  
}  
  
void show_float(float x) {  
    show_bytes((byte_pointer) &x, sizeof(float));  
}  
  
void show_pointer(void *x) {  
    show_bytes((byte_pointer) &x, sizeof(void *));  
}  
  
void text_show_bytes(int val) {  
    int ival = val;  
    float fval = (float) ival;  
    int *pval = &ival;  
    show_int(ival);  
    show_float(fval);  
    show_pointer(pval);  
}
```
这段程序主要是通过typedef将`unsigned char*` 类型重命名为`byte_pointer`。
这里首先先说一下指针，在Clion中是趋向于让`*` 跟着后面的变量名。但是我更趋向于让`*` 跟着前面的类型名，在VS中也确实是这样的。
比如下面的代码：
```cpp
#include "iostream"  
using namespace std;  
int main(){  
    int a=10;  
    int* b=&a;  
    cout<<b<<endl;  
    cout<<*b<<endl;  
}
```
我更趋向的理解是b是一个`int*` 类型的指针，指针呢本质其实就是地址，存的是a的地址，第七行的`*b`中的`*`是解引用的意思，就是拿出b这个地址中的值。
书中的试验程序核心主要是*show_bytes* 主要是接受一个字节指针 `start` 和一个长度 `len` 作为参数。函数通过循环遍历从 `start` 指向的内存地址开始的 `len` 个字节，并以十六进制格式（每个字节占两位）打印每个字节的值。
他的巧妙之处在于通过强制转换向编译器表名，程序将指针视为指向字节序列，而不是原始的数据（比如说1234）。通俗来说就是比如1234这个数，我取值得到的是最前面的字节的地址（前面的约定），这个时候强制转换成指针，来读取这个字节中的数据，然后通过for循环，和sizeof(T)把这个类型所有字节中的数据都读出来
其实就是像我们之前图片中CLion中内存视图中看到的格式那样输出
得到的结果如下图所示：
![Pasted image 20241004163214.png|500](/img/user/accessory/Pasted%20image%2020241004163214.png)
最后运行的结果我们发现，Linux32，Windows，Linux64是little endian
而Sun系统是big endian
![Pasted image 20241004110649.png|500](/img/user/accessory/Pasted%20image%2020241004110649.png)
我们Clion中的内存视图也确实如此，注意是little endian应该是0x00000005！！！
但是值得注意的是，指针值完全不同，不同的机器/操作系统是使用不同存储分配约定，但是需要注意的是32位的Linux的指针值为4字节地址，而64位的为8字节地址，这也与指针地址与字长一样大这一约定相吻合

还有一个需要注意的点是，对于integer和float point的地址中，有一段是重合的，这个巧合后续章节也会有讲解。
![Pasted image 20241004163920.png|500](/img/user/accessory/Pasted%20image%2020241004163920.png)
## Representing String
C语言中的字符串其实是一个char数组，这个数组是以`\0`结尾的
```cpp
#include<stdio.h>  
#include<string.h>  
int main() {  
    char str[]="hello";  
}
```
当我们在CLion中开调试工具打断点，可以明确看到`\0`的存在
![Pasted image 20241004202607.png|300](/img/user/accessory/Pasted%20image%2020241004202607.png)
所谓的`\0`其实就是个转义字符，也就是ASCII码的第一个数，也就是0，表示的是空字符，也就是null
ASCII码表第一条是这样的

| Bin<br><br>(二进制) | Oct<br><br>(八进制) | Dec<br><br>(十进制) | Hex<br><br>(十六进制) | 缩写/字符     | 解释  |
| ---------------- | :--------------: | ---------------- | ----------------- | --------- | --- |
| 0000 0000        |        00        | 0                | 0x00              | NUL(null) | 空字符 |
其实用const char* 其实本质上还是个数组，最后也是`\0`结尾的
比如说上述代码中hello在内存视图中是这样的：
![Pasted image 20241004202830.png|500](/img/user/accessory/Pasted%20image%2020241004202830.png)
68就是h的ASCII码，但是值得注意的是，最后是以00结尾的，也就是null
## Pepresenting Code
```cpp
int sum(int x,int y){
	return x + y;
}
```
这段函数在我们上面提到的四个机器上进行运行，得到了具有以下字节表示的机器代码：
![Pasted image 20241004203351.png|400](/img/user/accessory/Pasted%20image%2020241004203351.png)
我们发现不同机器的指令编码是不同的，所以说不是二进制兼容的，二进制代码很少能够跨机器和系统移植。
## Introduction to Boolean Algebra
二进制是计算机编码、存储和操作信息的核心，围绕着0和1已经演化出了复杂的数学体系。
数学家George Boole（乔治布尔）通过将逻辑值true和false编码成二进制的1和0，设计出了Boolean algebra（布尔代数），作为逻辑推理的基本原则
![Pasted image 20241005132416.png|500](/img/user/accessory/Pasted%20image%2020241005132416.png)
首先，布尔运算中的~代表逻辑运算中的*NOT*，就是非，$\neg$ 运算，成为取反
第二种运算 布尔运算中的& 代表逻辑运算中的*AND*（与），就是$\land$ 运算，两个参数如果有一个为0，那么结果为0
第三种布尔运算中的| 代表逻辑运算中的*OR*（或），就是$\lor$运算，当两个参数都为0时，结果才为0
第四种布尔运算中的^ 代表逻辑运算中的*exclusive-or*（异或），就是$\oplus$运算，当两个参数同为0或者同为1时，异或运算的结果为0
![Pasted image 20241005133216.png|500](/img/user/accessory/Pasted%20image%2020241005133216.png)
## Bit-Level Operations in C
位级操作
C语言中存在一个特性就是支持按位进行布尔运算，叫*bit-level operations*（位级操作）下面是一些例子。
位级操作最好的办法就是把十六进制转换成二进制表示，燃弧按位进行相应的运算，最后再转换成16进制
![Pasted image 20241005133300.png|500](/img/user/accessory/Pasted%20image%2020241005133300.png)
位级操作的一个常见用途是实现掩码操作。
<span style="background:#fff88f">掩码是什么？</span>
	其实在很多地方有掩码，我们可能听到过子网掩码，子网掩码比如说255.255.255.0的意思是说前面三位ip地址是一样的，第四位可以不一样。所以说掩码其实就是一个二进制数，包含了一组特定的组合的一种位模式，比如说一个掩码可以是11110000，其中1就是要选择或者要关注的位，而0就是不需要关注的位。这就可以用在很多领域和地方。比如说在图像处理中，我只想要关注这个图片的某一个区域，就可以用到掩码。
通过位运算，我们还可以得到特定的位序列，比如对于操作数`0x89 ab cd ef`，如果想要得到该操作数的最低有效字节的值，可以很巧妙的通过&运算，&上`0x00 00 00 FF`，这样就可以得到最低有效字节`0x000000EF`
为什么是F呢因为F是11111111而0是00000000标志着如果是0就说明不关注，结果就是0 如果是1就说明关注，所以11111111其实就是把ef完全复制了一遍。！！

## Logical Operations in C
除了Bit-Level Operations之外，C语言还提供了一组*Logical Operations*（逻辑运算）。
其实就是我们平时用到的`&&` `||`和`！`等运算。值得注意的是，这个和位级运算比较像，要注意区分
对于逻辑运算的结果只有true和false两种
比如下面的例子：
![Pasted image 20241005171035.png|200](/img/user/accessory/Pasted%20image%2020241005171035.png)
值得注意的是，比如说下面的表达式
```cpp
if(a && 5/a)
```
如果a的结果就是false 那么会直接认为是false 就不去计算5/a了，这样其实也有效避免了5/0的情况
## Shift Operations in C
除此之外，C语言还提供了*Shift Operations* （移位运算）
移位运算我当时在实现链表找index节点的时候，参考Java LinkedList源码用到过，Java的源码是通过移位运算来判断index是处于前半段链表还是后半段链表，其实就是除以2了
为什么是除以2呢  这就需要来看一下左移运算符和右移运算符到底是什么了
### 左移运算
对于八位二进制数，比如说01100011，左移一位就是就是丢弃最高的1位，并在右端补一个0。

| 0   | 1   | 1   | 0   | 0   | 0   | 1   | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1   | 1   | 0   | 0   | 0   | 1   | 1   | <font color="#c0504d">0</font>   |
左移一位看起来就像是乘以2一样，左移n位就是乘以n
但是注意在上面这个例子中，n只能取0~8
### 右移运算
右移运算包括*Logical Right Shift*逻辑右移和*Arithmetic Right Shift*算数右移
逻辑右移就是跟左移相反
算数右移 当操作数的最高位是0的时候，算数右移与逻辑右移没有区别
但当操作数的最高位是1的时候，左端需要补1
<font color="#c0504d">值得注意的是，C语言标准中没有明确规定有符号数应该使用哪一种类型的右移方式，但事实上，几乎所有的编译器以及机器的组合都是对有符号数使用了算数右移，而对于无符号数，右移一定是用了逻辑右移</font>
<font color="#f79646">Java是对这个事情做了明确的定义!!</font>
```Java
x>>k  //arithmetic right shift
x>>>k //logical right shift
```
