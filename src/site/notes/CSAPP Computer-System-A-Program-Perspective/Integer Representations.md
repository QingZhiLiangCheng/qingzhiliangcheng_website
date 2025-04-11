---
{"dg-publish":true,"tags":[],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Integer Representations/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-10-05T17:29:59.406+08:00","updated":"2025-04-11T21:21:20.502+08:00"}
---


文章中介绍了两种byte来编码integer的情况：
- 只能表示*nonnegative number* 非负数
- 表示*negative，zero，positive number* 负数 零 正数

##  Integral Data Types
C语言提供了很多种整数的类型，比如说int short long等等
下面这张图是各种类型在32位机器上的取值范围
![Pasted image 20241007220819.png|500](/img/user/accessory/Pasted%20image%2020241007220819.png)
这张图是在64位机器上的取值范围
![Pasted image 20241007220921.png|500](/img/user/accessory/Pasted%20image%2020241007220921.png)
总体来说，没种类型其实都是基于关键字char、short、long来指定大小（因为这几个关键字所建的类型的字节是不同的），然后又通过了unsigned来表示所表示的数是非负的，或者是如果默认的话，是可以为负数。
但其实我们发现，真正与机器相关的其实只有long，在32位程序上使用4字节，在64位程序上使用8字节。

## Unsigned Encodings
我们首先来看一下无符号的编码
我们考虑一个w位的整数数据类型，我们写一个位向量$\vec{x}=[x{w-1} ,x_{w-2},...,x_0]$在编码的方式中，每一个$x_i$都有值0或者1，都有一个权重是$2^i$ 。其实就是类似位权法 。
我们使用一个函数B2U来表示一个长度为w的0、1串是如何映射到无符号数的
$$
B2U_w(\vec x)= x_{w-1} \times 2^{w-1}+x_{w-2}\times 2^{w-2}+...+x_0\times 2^0 =\sum_{i=0}^{w-1}x_i2^i
$$
其实这个映射过程还是比较好理解的
![Pasted image 20241007224323.png|500](/img/user/accessory/Pasted%20image%2020241007224323.png)
> 但是书上还是讲了Principle：Uniqueness of unsigned encoding
> <font color="#c0504d">Function B2U is a bijection</font>

*bijection* 双射哈哈哈双向映射 在高数第一节课学的映射
其实就是函数B2U<sub>w</sub>将每个长度为w的位向量映射到$0 - 2^w-1$之间的唯一数，它有一个逆函数，我们称之为U2B<sub>w</sub> 可以将0~2<sup>w</sup>-1范围内的每一个数映射到w位的唯一模式 

## Two‘s-Complement Encodings
计算机中对于有符号数的编码都采用*two’s-complement*（补码）的形式
同样的，我们还是采用$\vec{x}=[x{w-1} ,x_{w-2},...,x_0]$来表示二进制数
采用补码方式编码的二进制数与有符号数之间的转化过程如下所示：
$$
B2T_w(\vec x)= x_{w-1} \times -2^{w-1}+x_{w-2}\times 2^{w-2}+...+x_0\times 2^0 =-x_{w-1}\times2^{w-1}+\sum_{i=0}^{w-2}x_i2^i
$$
我们可以看到跟无符号的主要区别在第一位
第一位为*sign bit*(符号位)，当最高位为0的时候表示非负数，当最高位为1时，表示是负数。
这里我们要了解负权重的概念，而不能简单的看做一个符号。
![Pasted image 20241008130502.png|500](/img/user/accessory/Pasted%20image%2020241008130502.png)
其实我觉得从这张图就可以看的很清楚。
由于符号位的权重是$2^3$也就是8，所以一旦最高位为1，证明为-8也就是图中的灰色条。
这个时候其他的负数其实是有其他位往回拽的，如果后三位为111，也只能拽到-1
最大的正数就是0111为7，最小的负数1000为-8
这也就是为什么int值的取值范围两边正数和负数不对称的原因。


这里总结一下。分别来看一下有符号数和无符号数在不同位上的最大最小值
![Pasted image 20241008153232.png|500](/img/user/accessory/Pasted%20image%2020241008153232.png)
首先第一张图是无符号数在不同位上的最大值，其实也比较好理解，二进制全是1 十六进制全为F就是其最大值
![Pasted image 20241008164443.png|500](/img/user/accessory/Pasted%20image%2020241008164443.png)
第二张图是对于有符号数在不同位上的最大值。由于二进制第一位为符号位，所以说其他位都为1时，为最大值。在十六进制中相对应的就是第一位为7，因为第一位为01111111，其他位为F
![Pasted image 20241008164654.png|500](/img/user/accessory/Pasted%20image%2020241008164654.png)
第三张图是有符号在不同位上的最小值。都是符号位为1，其他位为0
<font color="#c0504d">值得注意的是，对于-1这个值，在有符号编码中是全为1的二进制数表示，这与无符号值的最大值可能是一样的。</font>
在C语言标准中，其实并没有要求用补码来表示有符号数
但是几乎所有的机器都是用补码来表示有符号数的
![Pasted image 20241008165038.png|600](/img/user/accessory/Pasted%20image%2020241008165038.png)
这里有一个例子，第一行是short类型的16位二进制，第二行是权重。
在这个例子中，与-12345（补码）有着相同位模式的无符号数是53191。

突然想起来之前遇到的一个问题
```cpp
#include<iostream>  
using namespace std;  
int main(){  
    unsigned short a=-12345;  
    cout<<a<<endl;  
}
```
这段代码输出的结果呢是：53191
![Pasted image 20241008165500.png|500](/img/user/accessory/Pasted%20image%2020241008165500.png)
这就说明其实机器在存入内存空间之前其实就已经转换成了二进制数，所以说并不知道这串二进制数其实是补码的编码方式，但由于打印的时候，我们认为a中的数据为无符号类型，所以打印出来的时候按照的是无符号的编码方式，所以打印出来就是53191

## Conversions between Signed and Unsigned
C语言标准中是允许不同的数值在不同数据类型之间进行转换的。
```cpp
#include<iostream>  
using namespace std;  
int main(){  
    unsigned short a=-12345;  
    cout<<(short)a<<endl;  
}
```
其实通过强制转换，就能输出-12345
在C语言中，还可以使用%d %u 其实也是进行了强制转换
```cpp
#include<stdio.h>  
int main(){  
    short a=-1234;  
    printf("%d %u",a,a);  
}
```
![Pasted image 20241008192110.png|500](/img/user/accessory/Pasted%20image%2020241008192110.png)
不知道为啥 出来的不是short的长度
`a` 的类型是 `short`，但是在 `printf` 中，使用 `%d` 和 `%u` 输出时，`a` 会被提升为 `int` 类型。这是因为在表达式中，所有小于 `int` 的类型（如 `short` 和 `char`）在算术运算和函数调用时会被提升到 `int` 类型。
这里注意一下，d表示的是decimal（十进制），u就是unsigned无符号的
<font color="#c0504d">虽然出来的数不一样，但是其实本质上的位模式并没有变，只是解释这些位的方式改变了。</font>
这也更加深入理解了什么是位模式，位模式就是一位一位排列的一种方式。

书中提到了一种数学化的方法来表达上面的观点
首先定义了两个函数$U2B_w$和$T2B_w$，他们将数字映射为无符号或者二进制补码形式的位表示。
也就是说我给一个整数$0 \leq x \leq UMax_w$，我们都能通过$U2B_w$映射成其位模式，
给我一个整数$TMin_w \leq x \leq TMax_w$ ,可以通过$T2B_w$映射其位模式。
我们定义一个function$T2U_w$
$$
T2U_w(x)=B2U_w(T2B_w(x))
$$
该函数传入一个$TMin_w \leq x \leq TMax_w$ 的数，生成一个$0 \leq x \leq UMax_w$的数，也就是说输入的是一个有符号的整数，转换成一个无符号的整数。
事实上本质上是位模式不变，解释方式，可以看做对应法则在改变。
相似的有
$$
U2T_w(x)=B2T_w(U2B_w(x))
$$
用例子来说就是$T2U_{16}(-12345)=53191$ ,且$U2T_{16}(53191)=-12345$ ,本质上是底层其实用16进制表示位模式都是0xCFC7。
这里面需要注意一个地方，就是12345+53191=$2^{16}$ 。这其实是一个性质。

这样其实我们就能知道计算机实现有符号到无符号的转换的一个逻辑，即
$$
T2U_w(x) = 
\begin{cases} 
x+2^w & x<0 \\
x &  x \geq 0 \\ 
\end{cases}
$$
值得注意的是，看似是加法，其实x是个负数，其实还是上面的加法准则
比如53191=-12345+2<sup>16</sup> 。
*Derivation*(导出)
通过上面的$B2U_w(\vec x)$ 和$U2B_w(\vec x)$的不同，可以发现其实从0~w-2项都一样，唯一不同的是w-1那一项
$$
B2U_w(\vec x)-B2T_w(\vec x)=x_{w-1}(2^{w-1}--2^{w-1})=x_{w-1}2^w
$$
移项后
$$
B2U_w(\vec x)=B2T_w(\vec x)+x_{w-1}2^w
$$
将$T2B_w(x)$作为自变量带入$B2T_w(\vec x)$所以就有如下的式子
$$
T2U_w(x)=B2U(T2B_w(x))=B2T_w(T2B_w(x))+x_{w-1}2^w=x+x_{w-1 }2^w
$$
书中画了两个很形象的图来表示上面的这些转换
![Pasted image 20241008220143.png|500](/img/user/accessory/Pasted%20image%2020241008220143.png)
如果反过来，
$$
U2T_w(u)=
\begin{cases}
u & u\leq TMax_w\\
u-2^w &u>TMax_w
\end{cases}
$$
![Pasted image 20241008220629.png|500](/img/user/accessory/Pasted%20image%2020241008220629.png)
$$
U2T_w(u)=-u_{w-1}+u
$$
## Signed versus Unsigned in C
前面也提到过，在C语言中，虽然标准中没有说明对于有符号数的表示，但是几乎所有的机器都使用二进制补码，比如说12345或者0x1A2B都被默认视为有符号类型，如果想使用无符号类型，后面应该加上U或者u
C语言是允许unsigned和signed之间相互转换的，虽然说C语言被没有明确规定这种转换是什么，但是事实上几乎所有的系统都是使用上面提出的公式这种手段$U2T_w$和$T2U_w$来进行转换。其实自己也可以写个小程序试试

在C语言中支持强制转换 *explicit casting*
```cpp
int tx,ty;
unsigned ux,uy;
tx=(int) ux;
uy=(unsigned) ty;
```
当然也支持隐式转换
```cpp
int tx,ty;
unsigned ux,uy;
tx= ux;
uy= ty;
```

由于C语言中有符号量和无符号量这两种，可能会出现一些非直观的行为
比如下面的代码：
```cpp
#include "iostream"  
int main(){  
    int a=-1;  
    unsigned int b=0;  
    if(a<b)  
        std::cout<<"-1<0";  
    else  
        std::cout<<"-1>0";  
}
```
这段代码的结果是：
![Pasted image 20241008222139.png|500](/img/user/accessory/Pasted%20image%2020241008222139.png)
原因是<font color="#c0504d">C语言会隐式的将所有符号数强制转换成无符号数来执行运算</font>
实际上表达的是$2^{32}-1$与0的大小

将一个较小数据类型转换成较大数据类型的时候，可以保持数值的不变。
我们将unsigned char类型转换成unsigned short类型，其中unsigned char占8个bit位置，unsigned short b占16个bit位，对于无符号数的转换比较简单，只需要在扩展的数位进行补零即可。
我们称之为*zero extension*（零扩展）。
![Pasted image 20241011191430.png|500](/img/user/accessory/Pasted%20image%2020241011191430.png)
对于有符号的数据，在扩展的时候要看正负数
如果是正数 扩展的都补0
如果是负数 扩展的都补1
![Pasted image 20241011191729.png|500](/img/user/accessory/Pasted%20image%2020241011191729.png)
我们再来看一下较大的数据类型转换成较小数据类型的情况
在int转换成short类型的时候，高16位数据被丢弃，留下低16位的数据
```cpp
#include<iostream>  
int main()  
{  
    int x=53191;  
    short y=(short)x;  
    std::cout<<y<<std::endl;  
}
```
通过这个程序也能验证这个问题。
![Pasted image 20241011192651.png|500](/img/user/accessory/Pasted%20image%2020241011192651.png)

对于无符号数进行转换的时候这个阶段操作，比如我们想得到k位，截断前w-k位，可以使用取模运算
![Pasted image 20241011193048.png|500](/img/user/accessory/Pasted%20image%2020241011193048.png)
图中有一个10进制类比的例子

对于有符号数的阶段主要是先用无符号的规则进行取模截断 然后再转换成有符号数。简单来说就是先改大小再改符号。而且在符号数和无符号数直接的转换会导致一些错误（上面提到过）
