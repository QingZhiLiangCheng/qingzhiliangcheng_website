---
{"week":"第四周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 07 Machine-Level Programming III：Procedures/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-02T20:03:02.404+08:00","updated":"2025-03-30T14:55:27.664+08:00"}
---


![[07-machine-procedures.pdf]]

今天讨论的是 procedure  --  这是一个统一的术语  --  可以是一个function, procedure,  or an object-oriented programming a method.

我们讲述的过程虽然是基于x86硬件及其运行方式  -- 但也采取了一套被普遍承认的约定 -- ABI

what dose on in procedure?
在C中 也很复杂
第一个概念是  control  --  在我们的例子中  将展示一个过程P调用一个过程Q -- 在P中调用Q的时候 程序要以一种方式进入Q -- 当执行到它的退出点时  程序需要以某种方式回到P
并不是回到P的任何地方都可以 -- 必须恰好在P调用Q后的位置 -- 所以我们需要记录返回位置的信息

第二个问题是 data   --  怎么传输参数？ 
x必须以某种方式记录下来  使得在Q内  程序有权访问其信息
同样的  当Q想要返回一个值时  P也将用相同的方式利用该值  所以我们必须规定一些关于如何回传数据的约定

最后一点，在一个函数中可能有一些局部数据 -- 需要分配一些空间 -- 如何分配空间？ 如何确保正确分配？
在C语言中  我们需要确保返回的局部数据所分配的空间应该被释放掉
突然想起了 值传递的原理

### Stack Structure
how do we pass control to a function?
stack
stack is just a region of the normal memory.
程序用栈来管理过程调用与返回的状态
在栈中  程序传递潜在信息  控制信息  和 数据   并分配本地数据
通过栈来调用 是因为 栈 符合过程调用和返回的整个想法的实质

在x86中的栈
开始地址实际上是一个编号非常高的地址  当栈生长时 更多的数据分配给栈--通过递减栈指针来完成
栈指针只是一个常规指针 %rsp   -- its value is the address of the current top of the stack
![Pasted image 20250303193137.png|500](/img/user/accessory/Pasted%20image%2020250303193137.png)
pushq Src
popq Src
只适用于8字节操作数

### Passing Control
通过一个例子讲了procedure control flow(流程)
![Pasted image 20250303201911.png|500](/img/user/accessory/Pasted%20image%2020250303201911.png)
之所以用反汇编  -- 是因为能看见地址

procedure call: call label
![Pasted image 20250303202001.png|500](/img/user/accessory/Pasted%20image%2020250303202001.png)
假设执行到了 callq 指令
这里我忘记了%rip寄存器的作用
`%rip` 寄存器，全称为 "Instruction Pointer"（指令指针），在x86-64架构中用于指向即将执行的下一条指令的位置。它存储了当前程序执行到的地址，即下一个将要执行的机器码指令的内存地址。
当处理器执行了一条指令   %rip的值会自动更新为下一条指令的地址  从而设置program counter  使得处理器知道接下来要执行哪些指令
call指令 其实在这里 干了两件事儿
第一件事儿是  改变了 %rip的值  使得 call label 能够jump到 label
第二件事儿是  将下一条指令的地址 在例子中就是400549 压入栈  --  %rsp也相应的要减小8
![Pasted image 20250303202447.png|500](/img/user/accessory/Pasted%20image%2020250303202447.png)

继续执行mult2这个函数
![Pasted image 20250303202612.png|500](/img/user/accessory/Pasted%20image%2020250303202612.png)
遇到 ret  或者retq  返回
pop出刚刚存的address
然后改变%rip  从而改变pc   jump回来
![Pasted image 20250303202708.png|500](/img/user/accessory/Pasted%20image%2020250303202708.png)

注意 call和ret并不是procedure的全部  只是 控制部分
### Passing Data
其实我们之前已经见到过一些  比如说参数传递
在ABI中 规定了  第几个参数传给哪个register   返回值传给哪个register
![Pasted image 20250303203056.png|500](/img/user/accessory/Pasted%20image%2020250303203056.png)
前6个参数要求放到这些寄存器中
这里的参数要求是正数或指针类型
浮点类型的参数是另外一组单独的寄存器来传递的
超过6个会放入stack中内存中

### Managing local data
用到一些本地数据 怎么办？
如果不能保存在rigister 放入栈帧
引入了一个概念 叫  stack frame  (栈帧)
在递归函数时 每个函数调用都会创建一个新的“实例” -- 实例 指的是函数的一次单独的执行过程
每个实例的状态， 这里涉及到状态，在NJU的Operating System中当时学到了一个everything is static machine的观点  --  每个实例的状态会包括 参数arguments  局部变量local variables，返回指针 return pointer
而这些所有的实例和状态  会被存储在栈帧中
当调用一个函数的时候  我们认为无论在代码中还有多少其他函数  在这一时刻都被冻结了  也就是说 只有一个函数在运行 假设我们使用的是单线程的运行模型  那么我们事实上可以再栈上分配当前函数需要的任意多的空间 当函数返回时 不需要保留有关该函数和状态的任何信息

在栈中 我们需要为每个调用且未返回的过程 保留一个栈帧
一个栈帧由两个指针界定  一个%rsp 栈顶指针   另一个是%rbp基指针
但是%rbp是一个可选指针  特别是我们后面看到的代码中一般都不用rbp
![Pasted image 20250305142050.png|500](/img/user/accessory/Pasted%20image%2020250305142050.png)

example yoo who amI
![Pasted image 20250305142206.png|500](/img/user/accessory/Pasted%20image%2020250305142206.png)
递归性能不好的一个原因就是 不断深入  占用空间越来越多
很多系统限制了栈的最大深度 所以 可能会崩溃
好处是 形成了深层递归时 每一层都有 由自己管理的局部状态

**Linux Stack Frame**
![Pasted image 20250305143105.png|500](/img/user/accessory/Pasted%20image%2020250305143105.png)
事实上系统中的satck frame应该是这样的
现在要把前面讲的Passing Control, Passing data都混进来

界面上面的 caller frame -- 调用者栈帧
调用者栈帧 还存了一些arguments  这些arguments是超过第七个参数  才存在栈中 这是传递给被调用者的参数
return address 就是前面在passing control中提到的 返回的时候 调到的下一条要执行的指令的那个地址

下面这部分叫current stack frame 当前栈帧 也是被调用者栈帧
如果用了%rbp的话 会存old %rbp的值  使得返回的时候 可以跳回去
local variables 如果 不能保存在register，就会保存在栈帧中
除此之外还会保存一些上下文 --  以便在返回时恢复

example
![Pasted image 20250305152144.png|500](/img/user/accessory/Pasted%20image%2020250305152144.png)
![Pasted image 20250305152158.png|500](/img/user/accessory/Pasted%20image%2020250305152158.png)
这个例子是一个call_incr函数 调用了incr函数
这里先分析一下incr函数   incr函数一个很有意思的地方是 参数是一个指针类型
换句话说 p事实上是一个地址  而这一串地址会被放入rdi寄存器
val被放入%rsi寄存器
函数执行过程 很好理解

call_incr函数  一个很重要的地方是 一上来要准备参数
这里要注意 v1 不是放到register 或者说不只是放到register中  因为register中没有地址  下面incr函数我们要传入的是一个地址
所以我们要在栈中申请空间放15213

`subq $16, %rsp` 这里要注意的有两个点
其一是 rsp是减小的   其二是 事实上开的空间往往比要存的东西大 -- 因为内存具有某种对齐机制
`movq $15213, 8(%rsp)`   `8(%rsp)`表示的是相对于栈指针寄存器（`%rsp`）当前值的一个偏移量。
这里是先改变的rsp 后放入的

![Pasted image 20250305153942.png|500](/img/user/accessory/Pasted%20image%2020250305153942.png)
后面两句完成了函数参数的构造
这里注意`movl $3000, %esi` 只设置了低32位  高32位自动设为0
编译器喜欢这么干的原因是movel比moveq少一个字节

后面就是把incr的计算结果压入栈中  然后 移入rax寄存器 后  再运算返回

**Register Saving Conversation**
caller---callee
![Pasted image 20250305162104.png|500](/img/user/accessory/Pasted%20image%2020250305162104.png)
答案是rdx会被覆盖

所以会有一些约定
caller saved 调用者保存 --提前保存旧rdx的值
callee saved 被调用者保护 -- 所有函数之间的约定  如果某个函数想要更改某个寄存器 他需要做的是先把它存储起来  放入栈中  然后返回之前  恢复到原来的状态
![Pasted image 20250305163343.png|500](/img/user/accessory/Pasted%20image%2020250305163343.png)
![Pasted image 20250305163448.png|500](/img/user/accessory/Pasted%20image%2020250305163448.png)
rbp比较特殊   如果不作为 基值存储器的时候   会作为callee-saved temporary
最微妙的是 他俩可以混合起来一起工作呃呃

**call-saved example**
![Pasted image 20250305163941.png|500](/img/user/accessory/Pasted%20image%2020250305163941.png)
要把x放到rdi存起来  因为返回的时候还要用到   这就是所谓的 call-saved storage

### Illustration of Recursion
put all of them together
look some example of recursion
![Pasted image 20250305185546.png|500](/img/user/accessory/Pasted%20image%2020250305185546.png)
还是 之前统计 二进制中1的个数 --  只不过这次是递归函数
