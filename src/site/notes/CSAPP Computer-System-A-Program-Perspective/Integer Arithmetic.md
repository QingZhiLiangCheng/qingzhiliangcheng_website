---
{"dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Integer Arithmetic/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-10-08T22:24:27.604+08:00","updated":"2025-04-12T10:15:42.620+08:00"}
---


## Unsigned Addition
我们有两个integer x和y。如果这两个数有w位，那么x和y分别可以表示的数的最小值为0，最大值为$2^w-1$。如图表示的是对于4个bit位的x和y相加的函数图
![Pasted image 20241011195703.png|500](/img/user/accessory/Pasted%20image%2020241011195703.png)
对于4个bit位的x和y能表达的数最大值为15，但相加却达到了30，而30的二进制位远超出了4个bit位。
对于这种w位的数加上另一个数我们需要w+1个字节的情况，会造成*word size inflation*（溢出）
有一些语言比如python可以进行任意大小的算数（但当然是在内存限制之内），但对于大多数语言，编程语言支持固定大小的算数。比如C语言最高只能开到long long，当两个数的运算结果超出long long的时候，就会出现溢出的现象，所以有一类算法叫[[algorithm/大数处理\|大数处理]]是专门来进行大数之间的运算的。

我们定义一个*operation*（运算符）$+_w^u$来表示unsigned和w位。来表示加法的运算公式。
这里先通过一个例子理解一下，如果最大限制为4位，x为9【1001】，y为12【1100】两个数相加结果为21【10101】就超出了4位，只能截取后四位，前面也提到过可以用取模运算，在这里是对16取模，所以得到的其实是5。
$$
x+_w^uy=
\begin{cases}
x+y & x+y<2^w &Normal\\
x+y-2^w & 2^w\leq x+y<2^{w+1} & Overflow
\end{cases}
$$
注意的是公式中用到了-2<sup>w</sup>，因为加法好像只能多一位出去，隔离掉相当于-2<sup>w</sup>
![Pasted image 20241011202152.png|500](/img/user/accessory/Pasted%20image%2020241011202152.png)
这张图很形象的表示了word-size为4时，Normal值和Overflow后得到的值的结果

## Two's-Complenment Addition
对于integer x和y 满足$-2^{w-1} \leq x,y \leq 2^{w-1}-1$，其和的范围为$-2^w \leq x+y \leq 2^w-2$
满足如下公式
$$
x+^t_wy=
\begin{cases}
x+y-2^w & 2^{w-1}\leq x+y & PostiveOverflow\\
x+y & -2^{w-1}\leq x+y< 2^{w-1} & Normal\\
x+y+2^w & x+y<-2^{w-1} & Negative overflow
\end{cases}
$$
> The w-bit tow's-complement sum of two numbers has exact same bit-level representation as the unsigned sum.In fact,most computers use the same machine instruction to perform either unsigned or signed addition.

由于有符号的补码和无符号的编码方式有着相同的位模式，二进制之间的运算是不变的，所以我们可以先把有符号补码看做是无符号编码来进行运算，然后再转换成二进制补码的形式。
$$
x+^t_wy=U2T_w(T2U_w(x)+^u_wT2U_w(y))
$$
简单来说其实就是只是解释方式不一样，我们在二进制层面进行的其实就是无符号当时的运算，等到需要解释成有符号的时候，再转换回来就好了
![Pasted image 20241012204032.png|500](/img/user/accessory/Pasted%20image%2020241012204032.png)
## Additive Inverse
CSAPP原书中提到了一个*addition inverse*（加法逆元）的概念，其实本质上就是有点像相反数（有符号当然叫相反数，但是这里也包括无符号）
事实上就是对于一个x，满足$x+x'=0$
在这里就有一个很简单的思想就是对于y-x其实就是$y+x'$

### Unsigned Addition Inverse
根据相反数的定义需要满足$x+x'=0$，但是涉及到一个问题，x和$x'$都是非负数，那么$x'$怎么表示呢？
我们看这样一个例子：
```cpp
#include<iostream>  
int main()  
{  
    unsigned char a=255;  
    unsigned char b=1;  
    unsigned char c=a+b;  
    printf("%d",c);  
  
}
```
他的运行结果是
![Pasted image 20241012215249.png|500](/img/user/accessory/Pasted%20image%2020241012215249.png)
我们发现是由于$a+b=2^w$,造成了overleaf溢出，所造成截断结果为0.
这就可以用到这里面
所以$x+x'=2^w=0$
所以对于$-^u_wx$有
$$
-^u_wx=
\begin{cases}
x& x=0\\
2^w-x & x\ge 0
\end{cases}
$$
### Two's-Complement Negation
这里需要注意的是，有符号数是不对称的，所以我们唯一要注意的就是$x=TMin_w$的情况，由于$\left| TMin_w \right|=\left| TMax_w \right|+1$ ,所以我们只能通过overleaf的方法来找他的最小值。


|     | 1   | 0   | 0   | 0   | ……  | 0   | $-2^{w-1}$ |
| --- | --- | --- | --- | --- | --- | --- | ---------- |
| +   | 1   | 0   | 0   | 0   | ……  | 0   | $-2^{w-1}$ |
| 1   | 0   | 0   | 0   | 0   | ……  | 0   | $-2^w$     |
但是由于只有w位，所以这样得到的结果是0
所以说
$$
\begin{gather} 
TMin_w + TMin_w = 0 \\
\end{gather}
$$
所以有
$$
-^t_wx=\begin{cases}
-x & x>TMin_w\\
TMin_w&x=TMin_w
\end{cases}
$$

## Unsigned Multiplicaiton
对于$0\leq x,y \leq 2^w-1$是w bit的无符号数，$x \times y$ 的取值在于0和$(2^w-1)^2=2^{2w}-2^{w+1}+1$,乘法的结果肯定是远远大于w字节的，我们只截取后面的，所以有
$$
x*^u_w=(x \cdot y)mod 2^w
$$

## Tow's-Complement Multiplication
对于$-2^{w-1}\leq x,y \leq 2^{w-1}-1$，$x \cdot y$的取值范围为$-2^{w-1} \cdot (2^{w-1}-1)=-2^{2w-2}+2^{w-1}$和$-2^{w-1} \cdot -2^{w-1}=2^{2w-2}$ 这也绝对超出了w位的，所以也是通过取模截取后面w位
但是值得注意的是，对于有符号数的补码 我们一直是采用的 无符号数的原码的时候来进行的二进制操作
$$
x*_w^ty=U2T((x \cdot y)mod2^w)
$$

这里我们发现无论是对于无符号的乘法还是有符号的乘法，其实对于二进制的操作都是一样的，只不过就是有符号的多了一步转为用补码解释的这么一个过程。
所以对于$\vec x$和$\vec y$ length都为w。$x=B2T_w(\vec x),x'=B2U_w(\vec x),y=B2T_w(\vec y),y'=B2U_w(\vec y)$有
$$
T2B_w(x*^t_wy)=U2B_w(x'*_w^uy')
$$

## Multiplying by Constants
历史上，许多机器上的整数乘法指令相当慢，需要10个或者更多的*clock cycles*(时钟周期)，但是对于其他的运算，比如加法，减法，移位运算，只需要1个时钟周期。
所以，编译器会采用一些方法来优化乘法运算，比如说通过*shift*（移位）和*addition*(加法)来替换*constant*（常数）

> 小Notes  时钟周期
> 时钟周期（Clock Cycle）是计算机系统中用来衡量处理器或其他数字电路操作速度的基本单位。它是指处理器时钟在一轮完整周期中所花费的时间。时钟周期的长短直接影响计算机的处理速度和性能。
> 在一个时钟周期内，处理器可以执行特定的操作（如取指、解码、执行等）。不同的指令可能需要不同数量的时钟周期才能完成。

#### Multiplication by a power of 2
x乘以2 就对应x<<1 左移1位
x乘以4 就对应x<<2 左移2位
...
x乘以$2^k$ 就对应x<<k 左移k位

书中通过数学公式证明了移位运算

| $x_{w-1}$ | $x_{w-2}$ | ... | $x_{0}$ |     |     |     |
| --------- | --------- | --- | ------- | --- | --- | --- |
| $x_{w-1}$ | $x_{w-2}$ | ... | $x_{0}$ | 0   | ... | 0   |
$$
B2U_w(x)=x_{w-1}\cdot 2^{w-1}+x_{w-2}\cdot 2^{w-2}+...+x_0\cdot 2^0=\sum_{i=0}^{w-1}x_i2^i
$$
加入左移w位
$$
B2U_{w+k}(x)=x_{w-1}\cdot 2^{w-1+k}+x_{w-2}\cdot 2^{w-2+k}+...+x_0\cdot 2^k=\sum_{i=0}^{w-1}x_i2^i\cdot 2^k
$$
#### Multiplication by a simple constants
比如说$x\times 14$,对于14来说$14=2^3+2^2+2^1$,事实上compiler进行的是$(x<<3)+(x<<2)+(x<<1)$
更快地，可能是$(x<<4)-(x<<1)$
所以对于一个01串
$$
[(0...0)(1...1)(0...0)...(1...1)]
$$
假设对于一串连续的1和0，假设左边为n，后边为m
比如说14为$[(0...0)(111)(0)]$，其中n=3，m=1
那么就有
$$
\begin{gather}
From A:(x<<n)+(x<<(n-1))+...+(x<<m) \\
From B:(x<<(n+1))-(x<<m)
\end{gather}
$$

### Dividing by Powers of 2
对于除法2的幂也可以用移位来实现，不过出发用的是右移
![Pasted image 20241017194226.png|600](/img/user/accessory/Pasted%20image%2020241017194226.png)
但是右移运算法存在一个问题是，对于无符号数采用的是逻辑右移，而有符号数采用的是算术右移
![Pasted image 20241017195018.png|500](/img/user/accessory/Pasted%20image%2020241017195018.png)
整数的除法，会遇到除不尽的情况，总是朝0的方向进行舍入
比如说3.14向零舍入的结果是3，-3.14向零舍入的结果是-3
```cpp
#include<iostream>  
int main()  
{  
    int a=3.14;  
    int b=-3.14;  
    std::cout<<a<<std::endl;  
    std::cout<<b<<std::endl;  
}
```
![Pasted image 20241017201304.png|500](/img/user/accessory/Pasted%20image%2020241017201304.png)

#### Unsigned division by a power of 2
下面的就是为了描述为什么是右移

| $x_{w-1}$ | $x_{w-2}$ | ... | $x_k$     | $x_{k-1}$ | ... | 0     |
| --------- | --------- | --- | --------- | --------- | --- | ----- |
| 0         | ...       | 0   | $x_{w-1}$ | $x_{w-2}$ | ... | $x_k$ |

对于一个数$[x_{w-1},x_{w-2},...,x_0]$,取k使得$0\leq k<w$,设x'是前w-k位，即$[x_{w-1},x_{w-2},...,x_k]$,设x''为剩下的k位，即$[x_{k-1},...,x_0]$。
我们发现有如下的式子
$$
x=2^kx'+x''
$$
由于x''的大小在0和$2^k$之间，所以当x除以$2^k$的时候，有
$$
\frac{x}{2^k}=x'+\frac{x''}{2^k}
$$
第二项就小于1，其实就是要舍去的小数部分，答案就是x'
这个效果是和右移运算法相同的。

#### Two's-complement divison by a power of 2
首先上面也提到了，对于二进制补码的右移运算包含两种，如果是正数，就是第一位是0的时候，他的右移运算和无符号没有什么区别。
如果是负数，会进行算数右移，是往前补1
下面是正常的移位得到的结果
![Pasted image 20241017213358.png|500](/img/user/accessory/Pasted%20image%2020241017213358.png)
但是存在一个问题，就是我们的规则上面也提到过，是往0靠近。也就是说我想得到的应该是-771而不是-772.
为了解决这个问题， 所以我们设置了一种*biasing*偏置，偏置的值等于1左移k位减去1，即
$$
(x+(1<<k)-1)>>k
$$
总结来说就是
```cpp
(x<0 ? x+(1<<k)-1:x)>>k
```

<font color="#ff0000">值得注意的是，很遗憾，我们不能用除以2的幂的方法来表示除以任意常数k的除法</font>
这与乘法是不同的！！！
