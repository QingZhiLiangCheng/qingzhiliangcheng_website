---
{"week":"第三周","dg-publish":true,"tags":["week3","csapp"],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 06 Machine-Level Programming II：Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-26T07:40:05.903+08:00","updated":"2025-04-19T09:53:04.080+08:00"}
---


![[06-machine-control.pdf]]

Lecture06介绍了机器级变成的基本原理 -- 主要思想是通过访问寄存器得到一些状态 -- 突然让我想起了NJU的老师讲的都是状态机（那门课好像还是得看）

this lecture   指令的执行顺序 如何利用这些技术来实现 分支 循环语句
- control: condition codes
- conditional branches
- loops
- switch statements

### control: condition codes
![Pasted image 20250226075709.png|600](/img/user/accessory/Pasted%20image%2020250226075709.png)
新机器 新引入了8个  %r8 - %r15
%rsp寄存器  特别--告诉你程序执行到哪了-- 栈指针
%rip   当前正在执行指令的地址
condition code  都是一位标志 条件操作的基础
![Pasted image 20250226080243.png|600](/img/user/accessory/Pasted%20image%2020250226080243.png)
有好多指令可以设置condition code
比如 cmpq
cmpq Src2, Src1  就像减法指令几乎一样    但是cmp操作不会真的做减法得到操作  而是设置四个条件标志 
![Pasted image 20250226080931.png|600](/img/user/accessory/Pasted%20image%2020250226080931.png)

一个特例  test指令唯一的目的是设置条件标志
如果只有一个数的时候 就想看看这个数的大小 比如看看这个数的正负  -- testq
本质上执行的按位与
![Pasted image 20250226081232.png|500](/img/user/accessory/Pasted%20image%2020250226081232.png)
可以用两个相同的参数
`testq %rax, %rax`，这种用法实际上是非常常见的。这种情况下，指令会对同一个寄存器或内存位置进行按位与操作。由于任何数和其自身进行按位与操作的结果都是其自身，这个操作的主要目的是设置CPU的状态标志，而不是修改原值。
通过这种方式可以检查寄存器 `%rax` 的值是否为0。执行完这条指令后，可以根据零标志（Zero Flag, ZF）的状态来判断。如果 `%rax` 为0，则ZF会被设置为1；否则，ZF会被清0。

reading Conditional codes
一系列set指令 --  区别在于基于的条件
set指令的作用是将单个寄存器的<u>单个字节</u>设置为1或0
判断是否置于0和1 -- 根据现在条件码的值  就是刚刚说的条件
![Pasted image 20250226082052.png|500](/img/user/accessory/Pasted%20image%2020250226082052.png)

单个字节--事实上每个寄存器 都可以将其最低位字节设置为0 或 1
![Pasted image 20250226082504.png|400](/img/user/accessory/Pasted%20image%2020250226082504.png)

example
![Pasted image 20250226085335.png|500](/img/user/accessory/Pasted%20image%2020250226085335.png)

![Pasted image 20250226085308.png|500](/img/user/accessory/Pasted%20image%2020250226085308.png)
注意通常第一个参数是%rdi   第二个参数是%rsi
注意cmp反转顺序了
al只占了1个字节 其他7个字节怎么办？ 有一个具有单字节到四字节的零扩展的mov指令
eax其实只是低32位置 x86有个奇怪的地方 任何计算结果是32位的结果 --会把寄存器的其余32位设置为0

### Conditional branches
条件语句 最简单的情况  可能是if和else
实际上有两种实现方式 -- 先学习通用的传统方式 -- 再学习更特别的新方式 -- 然后进行比较
**传统方式**
传统的方式是使用我们熟知的跳转指令
jump instructions  可以 让你从任何地方跳转到其他地方  既可以跳过某些指令  也可以跳回到之前的某些位置或任何位置
有两种跳转方式
- 无条件跳转  unconditional jump  想跳转的时候就可以跳转
- 条件跳转 conditional jump   条件码满足时才会跳转
![Pasted image 20250227210821.png|500](/img/user/accessory/Pasted%20image%2020250227210821.png)

![Pasted image 20250227214441.png|500](/img/user/accessory/Pasted%20image%2020250227214441.png)
蓝色和红色部分在c代码和汇编中是一一对应的
像L4这种  如果你给出一个名称紧跟着是冒号  --  左边的东西L4叫做标签label
只在汇编代码中可见   实际上并不在目标代码中

![Pasted image 20250227214316.png|500](/img/user/accessory/Pasted%20image%2020250227214316.png)
在我得到的汇编中   直接用了地址
我们以蓝色代码为例
参数 %rdi - x  %rsi - y
`movq %rdi, %rax` 将x 移入rax
`subq %rsi, %rax` x-y  放入%rax
我们发现先比较了x和y的代码  然后决定执行是否跳转  如果不跳转就执行蓝色代码ret
如果跳转 就执行红色代码  最后也能ret
函数返回值必须存在%rax寄存器中，所以必须得把一部分数据先放进%rax

![Pasted image 20250228074904.png|500](/img/user/accessory/Pasted%20image%2020250228074904.png)
C语言有个特殊的地方 就是能转换成汇编的语序 -- 在NJU的课程中叫做simpleC
在C语言中我们可以用go to语句设置标签 -- 但平时编程不建议用
我觉得下面的代码或许更好？
```cpp
long absdiff_j(long x, long y)
{
    long result;
    int ntest = x <= y;
    if (ntest) goto Else;
    result = x-y;
    return result;
 Else:
    result = y-x;
    return result;
}
```

![Pasted image 20250228075813.png|500](/img/user/accessory/Pasted%20image%2020250228075813.png)

但是如果不是return  我们还有别的语句的话 那就只能用上面老师ppt里面的方式了
```cpp
long absdiff_j(long x, long y)
{
    long result;
    int ntest = x <= y;
    if (ntest) goto Else;
    result = x-y;
    goto Done;
 Else:
    result = y-x;
 Done:
    return result;
}
```

可是我的gcc生成的还是那样
![Pasted image 20250228080300.png|500](/img/user/accessory/Pasted%20image%2020250228080300.png)
挺神奇的

总结一下就是
![Pasted image 20250228080539.png|500](/img/user/accessory/Pasted%20image%2020250228080539.png)

这就是jump instruction的方式 也是 unconditional moves的方式
但存在一个问题  就是现在的cpu都是流水线技术 -- 遇到branch就得等着if决定跳转哪里
不过现在的cpu会预测  而且98%都不会错

但有一种更好地优化方法是-- conditional moves
但前提是两个分支好算 且 代码量小 --- 直接运行两个分支  就可以预取if 并且知道结果 决定替不替换结果
事实证明确实会节省时间

![Pasted image 20250228081702.png|200](/img/user/accessory/Pasted%20image%2020250228081702.png)

还是absdiff那个例子
![Pasted image 20250228083721.png|500](/img/user/accessory/Pasted%20image%2020250228083721.png)
```shell
gcc -O1 absdiff.c -o absdiff
```
O1等级优化
![Pasted image 20250228083608.png|500](/img/user/accessory/Pasted%20image%2020250228083608.png)

如果执行任意分支结果可能改变其他状态的状态 --我们不希望使用conditional move
```cpp
val = x > 0 ? x*=7 : x+=3;
```
指针可能为空  所以不想去解引用
```cpp
val = p ? *p : 0;
```

### Loops
c语言中有三种循环
- for循环
- while循环
- do-while循环 --- 一般不用
但是好讲 好研究 所以先讲 **do while**
![Pasted image 20250228084618.png|500](/img/user/accessory/Pasted%20image%2020250228084618.png)
因为我没有用过do-while 所以这里先解释一下什么是do-while
```cpp
do {
    // 循环体代码
    更新条件变量;
} while (条件表达式);
```

|**特性**​|​**do-while循环**​|​**while循环**​|
|---|---|---|
|​**执行顺序**​|先执行循环体，再判断条件|先判断条件，再决定是否执行循环体|
|​**最少执行次数**​|至少1次|可能0次（条件初始为假时）|
|​**适用场景**​|必须执行一次后再判断的场景|条件判断优先于执行的场景|
特殊的地方在于要先执行一次
换成 simple C 或者说 goto version 很好换

顺便说一下这个函数是用来求二进制表示中1的个数的
主要通过 `x & 0x1` 跟1 与运算   ` x >>= 1` 右移 -- 顶掉最低位
C code 版本
![Pasted image 20250228090742.png|500](/img/user/accessory/Pasted%20image%2020250228090742.png)

Simple C 版本
![Pasted image 20250228091013.png|500](/img/user/accessory/Pasted%20image%2020250228091013.png)

![Pasted image 20250228091027.png|500](/img/user/accessory/Pasted%20image%2020250228091027.png)

**while循环**
general while translation 1
![Pasted image 20250228091422.png|500](/img/user/accessory/Pasted%20image%2020250228091422.png)
![Pasted image 20250228091743.png|500](/img/user/accessory/Pasted%20image%2020250228091743.png)
C code
![Pasted image 20250228092212.png|500](/img/user/accessory/Pasted%20image%2020250228092212.png)

`test` 指令的底层行为是：  **对两个操作数执行按位与（AND）操作**，并根据结果设置条件码（Condition Codes）​**，但不会保留计算结果**​（即不会修改操作数的值）。
在 `test %rdi, %rdi` 中：实际效果**：等价于检查 `%rdi` 的值是否为 `0`（因为任何数与自身按位与的结果仍为自身，而 `0 & 0 = 0`）。
`jne`（Jump if Not Equal）的行为依赖**零标志（ZF）​**：
- ​若 `ZF = 0`（即 `%rdi ≠ 0`）：触发跳转，返回到地址 `1174` 继续执行循环体。
- ​若 `ZF = 1`（即 `%rdi = 0`）：不跳转，退出循环，执行后续的 `ret` 指令。

第一次直接跳转到执行判断的地方  从第二次开始就顺着执行到判断的地方

![Pasted image 20250228094349.png|500](/img/user/accessory/Pasted%20image%2020250228094349.png)
use O1优化
![Pasted image 20250228094417.png|500](/img/user/accessory/Pasted%20image%2020250228094417.png)
本质上是先判断一次  然后决定执不执行do-while循环 如果ture当然就是do-while循环
![Pasted image 20250228094545.png|500](/img/user/accessory/Pasted%20image%2020250228094545.png)

```
 test   %rdi,%rdi       ; 检查输入x是否为0
 je     1186 <pcount_while+0x1d> ; 若x=0，直接跳转到返回0的路径
 ```
1186 就是直接把0 给eax 然后返回
如果 x不为0
```
mov    %rdi,%rdx       ; 复制x到临时寄存器%rdx
and    $0x1,%edx       ; %edx = x & 0x1（取最低位）
add    %rdx,%rax       ; result += 最低位值（0或1）
shr    %rdi            ; x >>= 1（右移一位）
jne    1177 <pcount_while+0xe> ; 若x≠0，继续循环
```

### For Loop Form
![Pasted image 20250228100951.png|500](/img/user/accessory/Pasted%20image%2020250228100951.png)
for循环有四步   有一个init初始化   有一个测试test   有一个规则进行更新来继续循环  然后是body
![Pasted image 20250228120434.png|500](/img/user/accessory/Pasted%20image%2020250228120434.png)

```asm
endbr64              ; 控制流完整性指令
mov    $0x0,%edx     ; 初始化结果计数器 %edx = 0
mov    $0x0,%ecx     ; 初始化循环计数器 %ecx = 0
jmp    1189 <pcount_for+0x20> ; 跳转到循环条件检查
```

```asm
mp    $0x3f,%rcx    ; 比较i是否≤63（0x3f=63）
jbe    1179 <pcount_for+0x10> ; 若i≤63，继续循环
```

```asm
mov    %rdi,%rbx     ; 备份x到%rbx
shr    %cl,%rbx      ; 将x右移i位（%cl是%ecx的低8位）
and    $0x1,%ebx     ; 取最低位（x >> i & 0x1）
add    %rbx,%rdx    ; 结果累加：result += (bit)
add    $0x1,%rcx     ; 循环计数器i += 1
```

在组成上就很想一个while循环
![Pasted image 20250228150159.png|500](/img/user/accessory/Pasted%20image%2020250228150159.png)

O1 可能会跳过初始化  变成一个do-while
![Pasted image 20250228150419.png|500](/img/user/accessory/Pasted%20image%2020250228150419.png)


### Switch Statements
![Pasted image 20250228150745.png|500](/img/user/accessory/Pasted%20image%2020250228150745.png)
c语言中有一个奇怪的特性  就是如果没有break  会继续往下执行
hhhh   历史语言最糟糕的设计之一
由于一种奇怪的原因   他们甚至将这种设计保留在了java和其他语言中
其实我们知道 如果不想用switch 可以使用if-else
但其实底层switch 并不是 if-else
![Pasted image 20250228181726.png|500](/img/user/accessory/Pasted%20image%2020250228181726.png)
code block   串联
我们要做的是将所有这些代码块编译成一串总代码  并将他们存储在内存的某些位置  加载内存能得到这些code blocks 
然后建一张table  -- jump table  该表的某一项都描述了一个代码块的起始位置  按照case标签顺序排序
有点像array index  可以通过 index  找到数组中的哪一个

![Pasted image 20250228224608.png|500](/img/user/accessory/Pasted%20image%2020250228224608.png)
第三个参数放在了 rdx
x与6比较 是因为有6个case
这里用了ja  ja是jump above  跳转到了 L8 -- 默认行为
ja是无符号数比较  --  意味着如果比较的结果是负数（无符号数会变得很大） -- 那么会跳转到默认行为   因为大于6  就跳转到默认行为
最后一句是核心 --  对标记进行索引 并取出一个地址  然后跳转地址
![Pasted image 20250228225351.png|500](/img/user/accessory/Pasted%20image%2020250228225351.png)
quad是一个声明  表示这儿需要一个8字节的值 并且该值应该匹配任何地址
![Pasted image 20250228225849.png|500](/img/user/accessory/Pasted%20image%2020250228225849.png)
![Pasted image 20250228230000.png|500](/img/user/accessory/Pasted%20image%2020250228230000.png)

![Pasted image 20250228230009.png|500](/img/user/accessory/Pasted%20image%2020250228230009.png)
![Pasted image 20250301143347.png|500](/img/user/accessory/Pasted%20image%2020250301143347.png)
![Pasted image 20250301143358.png|500](/img/user/accessory/Pasted%20image%2020250301143358.png)
![Pasted image 20250301144101.png|400](/img/user/accessory/Pasted%20image%2020250301144101.png)


```asm
switch_eg:
    movq    %rdx, %rcx       ; 保存第三个参数（rdx）到 rcx
    cmpq    $6, %rdi         ; 比较第一个参数（rdi）与 6
    ja      .L8              ; 若 rdi > 6，跳转到默认分支 .L8
    jmp     *.L4(,%rdi,8)    ; 跳转表：根据 rdi 值跳转到对应 case
```
