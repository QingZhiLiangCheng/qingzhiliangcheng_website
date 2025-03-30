---
{"week":"第五周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 09 Machine-Level Programming V：Advanced Topics/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-09T14:54:53.108+08:00","updated":"2025-03-30T14:55:44.371+08:00"}
---


![[09-machine-advanced.pdf]]

### Memory Layout
![Pasted image 20250312080324.png|500](/img/user/accessory/Pasted%20image%2020250312080324.png)
这个内存结构 后面还会学 -- virtual memory address
我们的64位机器  按说能处理64位  但从这个内存layout能看出来 0x0007FFFFFFFFFFF实际上 可以用的只有47位2进制位
但事实上 仅仅是47位  我们也没有这么大的DRAM

栈：在最顶部  从高地址 向  低地址 增长
大多数系统的栈的大小是8MB
在Linux系统上可以通过limit指令来查看
![Pasted image 20250312081008.png|500](/img/user/accessory/Pasted%20image%2020250312081008.png)
能看到stack size = 8192kb 也就是8mb
这意味着如果使用一个大于8MB的栈指针去访问内存 -- 会产生 segmentation fault 段错误

Test区 往下更下放的地方是程序存放代码的地方  来自于可执行文件  在将Linking会用到这一部分 这个存放可执行程序的区域 叫做 text segment  文本段

Data区 是 存放程序开始时分配的数据的地方  声明的全局变量都在这个数据段中

Heap  用来存放malloc或相关的函数申请的变量  这些变量在程序运行的时候会动态变化 它从一个很小的分配开始  如果每次都通过malloc申请小空间但没有释放  就会向着高地址一直增加

Shared Libraries  也是存放代码的  不过存放的是类似printf 和 malloc 这样的库函数  -- Linking

example
![Pasted image 20250312082412.png|500](/img/user/accessory/Pasted%20image%2020250312082412.png)
![Pasted image 20250312082431.png|500](/img/user/accessory/Pasted%20image%2020250312082431.png)
通过反汇编 gdb  查看地址
能发现  小的数组空间分配在了 粉色Data区域这一侧  而 大的数组分配在了Stack限制的地方  如果继续malloc 往中间增长 -- 如果没有空间了malloc会返回0
但是不知道为什么是往中间增长  可能是linux的优化？

### Buffer Overflow
缓冲区溢出
![Pasted image 20250312083115.png|500](/img/user/accessory/Pasted%20image%2020250312083115.png)
当i超过2的时候就会污染d的值  再增长会段错误

在存储字符串的时候   可能会出现很多有关缓冲区溢出的问题
因为我们可能不会事先知道字符串多大 -- 会开很大的空间
引发这个问题的罪魁祸首之一 是 那些存储字符串但不检查边界情况的库函数
例子之一就是gets函数  它做的其实是扫描输入的字符串并寻找代表一行结束的字符
![Pasted image 20250312083641.png|500](/img/user/accessory/Pasted%20image%2020250312083641.png)
如果我传入的指针是已经分配好大小的缓冲区指针 但是字符串中没有遇到EOF或者\n 就会一直持续下去  就会造成缓冲区溢出
所以现在的编译器会警告你 这是一个不安全的函数   这个函数写于70年代  那个时候还不考虑安全问题
同样的函数还有strcpy函数  两个参数 源地址和目标地址   但是函数复制过程中不知道目标地址的缓冲区有多大
scanf也有这个问题  传递%s 参数  他会读取一个字符串并存储在某个地方  但是它既不知道传递的字符串多长 也不知道目标缓冲区多大

example
![Pasted image 20250312084818.png|500](/img/user/accessory/Pasted%20image%2020250312084818.png)
23位 和 24位 怎么来的？
从汇编中能看出来
![Pasted image 20250312084957.png|500](/img/user/accessory/Pasted%20image%2020250312084957.png)
在汇编中能看出来为缓冲区分配了多少空间 -- 0x18 -- 24位
最后一位需要时/0

记住下面call_echo里面标红的这个地址 --  这是调用返回的地址
![Pasted image 20250312090651.png|500](/img/user/accessory/Pasted%20image%2020250312090651.png)
23位
![Pasted image 20250312092907.png|500](/img/user/accessory/Pasted%20image%2020250312092907.png)
![Pasted image 20250312092724.png|500](/img/user/accessory/Pasted%20image%2020250312092724.png)
![Pasted image 20250312093053.png|500](/img/user/accessory/Pasted%20image%2020250312093053.png)
是从rsp指针倒着存回去的  30是0的ASCII码
字符串 最后一个 是/0 -- 是null   ASCII码为0 刚好占了缓冲区的最后一位

25位的时候
![Pasted image 20250312093539.png|500](/img/user/accessory/Pasted%20image%2020250312093539.png)
当超过23位的时候 其实就开始破坏返回地址了

24位的时候
![Pasted image 20250313090556.png|500](/img/user/accessory/Pasted%20image%2020250313090556.png)
破坏地址了  并且调到了一个奇怪的地方哪里  但其实有时候会崩溃 有时候不会崩溃
![Pasted image 20250313090708.png|500](/img/user/accessory/Pasted%20image%2020250313090708.png)
在我的电脑上事实上是分配了0x10个空间 是 16个字符
但我输到第12位就挂了 不知道为啥

我不知道gcc运行的哪种优化  我干脆直接下载了他的那个文件
然后objdump了
![Pasted image 20250313091818.png|500](/img/user/accessory/Pasted%20image%2020250313091818.png)

![Pasted image 20250313092000.png|500](/img/user/accessory/Pasted%20image%2020250313092000.png)
在24位的时候溢出了

**Code Injection Attacks**
![Pasted image 20250313092550.png|500](/img/user/accessory/Pasted%20image%2020250313092550.png)
代码注入攻击
就是用任何东西可以填充缓冲区  简单来说 就是 填充的东西是一些代码  并且填充到改变返回地址 -- 本来要返回到P函数的  然后返回到了 填充进去的那些东西的地址 而刚刚好是个代码或可执行文件 -- 就会运行别的东西

怎么免受攻击？
1. 使用更安全的方式来编写代码  比如用fgets来代替gets
	fgets有一个参数指示的就是程序最多读取多少字节
	除此之外
	![Pasted image 20250313093916.png|500](/img/user/accessory/Pasted%20image%2020250313093916.png)
2. Randomized stack offsets
	栈随机化  地址空间随机化
	每次程序运行的时候 它的地址都是变化的
	随机分配一块空间 -- 每次程序运行的随机变量是不一样的
	每次分配的空间的大小也可能不一样
	这里有一个例子
	![Pasted image 20250313095340.png|500](/img/user/accessory/Pasted%20image%2020250313095340.png)
	这个例子中有全局变量 有malloc分配到堆区上的变量  有栈上的局部变量 code区上的unless
	![Pasted image 20250313095719.png|500](/img/user/accessory/Pasted%20image%2020250313095719.png)
	有些地址不变 有些地址在变化
	global变量的地址不变
	呃呃我的为什么都在变？
	在课程中 global和code 地址是不变的
3. Stack Canaries
	系统会以栈溢出的错误返回 上面的那个例子
	gcc Implementation: -fstack-protector
	![Pasted image 20250313102115.png|500](/img/user/accessory/Pasted%20image%2020250313102115.png)
	![Pasted image 20250313102529.png|500](/img/user/accessory/Pasted%20image%2020250313102529.png)
	在8位的地方设置了一个值  是从一个特殊的寄存器拿出来的
	然后系统做的就是从Canary那里取出值--然后和寄存器里比较 来判断是否溢出
### Unions
Union -- 联合体  声明跟 struct很像
但实际上完全不同
Union是使用占用空间最大的域的大小来分配内存
只会使用多值中的一个
![Pasted image 20250313103309.png|500](/img/user/accessory/Pasted%20image%2020250313103309.png)
