---
{"dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 21 Network Programming：Part I/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-04T14:22:23.312+08:00","updated":"2025-08-04T16:59:44.100+08:00"}
---

![[21-netprog1.pdf]]

大部分网络系统都是基于 Client-Server 模型编写的：主要思路就是你想要使用某项服务，然后客户端client对服务器server发出一个请求Request，服务器在本地做一些事情来处理这些请求，从数据库检索信息，然后返回信息
因为我学过Springboot和Vue，所以对前后端的网络传输 这一部分还是比较熟悉的 但是Client-Server并不只局限于这里，他还有很多别的角度
从硬件的角度来看
网络和计算机之间的接口叫做NIC或者叫网络接口卡
![Pasted image 20250804144000.png|500](/img/user/accessory/Pasted%20image%2020250804144000.png)
有趣的是这对于你的计算机来说像一个IO设备，实际上，UNIX用于网络处理的api，使它看起来像个文件，突然想起来了Unix的只学本质"Everything is File."
实际对disk上写入数据和读出数据跟对网络的操作是相似的，对于网络来说，是通过向一个叫做网络的虚拟文件写入和读取数据来实现的

**Computer Networks**
A networks is a hierachical system of boxes and wires orgnized by geographical proximity. -- 网络是一个由“盒子”和“线缆”构成的层次化系统，这些“盒子”可以是主机、路由器、交换机等设备，“线缆”可以是物理网线、光纤，甚至是无线连接
The idea of a network is a collection of systems that are referred to as hosts. -- 网络是一些被称为主机的系统的集合，网络上的主机能够通过某种通信结构相互交流
大多数网络被划分为LAN(Local Area Network, 局域网) -- 小区域内的 比如学校，公司；更大的区域的网络称为WAN(Wide Area NetWord, 广域网) -- 可以覆盖城市或者更大的区域
通过运营商 -- 接入商业互联网
internet和Internet的区别 -- internet是指的互联网这一总体概念；Internet指的是我们一直都知道并使用的一个具体例子，依据一定的原理和协议

**Lowest Level: Ethernet Segment**
大部分低级网络都是有Ethernet(以太网)支持的
我们所熟悉的有线的以太网的例子就是有一根线连接到某种box上，通常那个盒子被称为hubs(集线器)，一个以太网就是一组计算机(hosts)通过网线连接到一个集线器上
集线器就像一个中继器，无论什么东西从一台电脑进入它，然后可以广播到所有与它连接的机器上
最开始 以太网是没人用一根网线接入这种"共享"
但现在我们使用无线网，无线网就像一个集线器，在房间里发送的所有数据包，都使用相同的无线电频率，相同的信道，然后会有一个协议用于检测，两条报文是否被同时发出而相互干扰；无线网可能最多只能扩展到同时让100台不同的host通信，因为他们共享一个信道
有线通信和他的区别在于，在这个盒子上(事实上实际上被称为路由器或交换机) 它不会像所有人广播，而是猜测这条报文是发送到特定的主机的嘛，然后发送到特定的主机上

**Next Level: internets**
an internets 指的是通过路由器把这些局域网连接起来
![Pasted image 20250804150658.png|500](/img/user/accessory/Pasted%20image%2020250804150658.png)
路由器基于特定的协议规则

我们可能最终连接的是一大堆分布在世界各地的主机
![Pasted image 20250804150901.png|500](/img/user/accessory/Pasted%20image%2020250804150901.png)
神奇的路由器系统，会把报文从一个地方传递到另一个地方，基于已知地址的寻址模式，通过多个路由器，集线器，从一个端点传输到另一个端点


有不同的厂商 是怎么协同工作的 -- Protocol(协议)
这些协议包含什么呢？
name schema(命名规则) & dilivery mechanism(传递机制)
如果有一条较长的报文，会切分成许多单独的数据包，发送出去
![Pasted image 20250804151501.png|500](/img/user/accessory/Pasted%20image%2020250804151501.png)
把报文从主机A发往另一个主机B，实际上发生的就是传递数据包，数据包中有一部分数据，数据包通信就是在数据包上附上一个包头，包头包含确切的路由信息。数据包在发送过程的不同阶段，会有不同数量的包头，而且他们所使用的协议不是完全相同的。网卡或适配器负责发送出去 另一边 接收 剥离

**Global IP Internet**
Internet有一些特殊的协议
- IP(Internet Protocol): 定义了命名主机的方法，发送包的方法；处于底层的IP并不能保证包被成功传递；尽力而为，如果在某个节点还是完好的话，就继续往下发送
- UDP协议 -- 一个在比IP所在层高一小层的小软件
- TCP(Transmission Control Protocol) -- 可靠 在IP层之上，可能会切成小包发送，如果一个数据包没有被送达，就会重复直到被送达；可能到达的顺序不同 还需要排序

![Pasted image 20250804152816.png|500](/img/user/accessory/Pasted%20image%2020250804152816.png)
客户端和服务器都是以应用程序的形式在主机上对应的端点被实现的，使用的软件和库是用户态和内核态共同运行的

IPv4 IPv6
IP是一个32位的地址对TCP也适用，4个十进制数，比如128.2.203.170  每个数只能表示0-255，事实上他们以一种叫网络字节序的顺序被传递和存储，这种顺序是一种大端字节序列
这四段字节都代表了不同层次的信息 比如这里的128.2就是CMU
解决大量需要IP的问题，扩展到128位 -- IPv6

**IP Address**
![Pasted image 20250804153846.png|500](/img/user/accessory/Pasted%20image%2020250804153846.png)
但机器是小端法 需要转换
点分十进制格式书写
![Pasted image 20250804154047.png](/img/user/accessory/Pasted%20image%2020250804154047.png)
需要api转换16进制和点分十进制

**Internet Domain Names**
![Pasted image 20250804154221.png|600](/img/user/accessory/Pasted%20image%2020250804154221.png)
如何从域名映射到IP地址的？ -- DNS

**Domain Naming System(DNS)**
它的核心管理模块在上面树的最顶层，对于每一层都有一个非常大的计算机集群用于跟踪所有映射到这些一级域名的IP地址
可以把DNS想象成一个给你特定映射的大型数据库，给他一个域名，他就会返回一个或多个IP地址
事实上可以通过程序nslookup或dig来探测dns 给域名 得到IP
![Pasted image 20250804155137.png](/img/user/accessory/Pasted%20image%2020250804155137.png)
给你分配到哪个服务器是由DNS决定的

**Internet Connection**
网络连接 利用的主要方式 TCP 一台主机创建一个通向另一台主机的连接，他们可以通过给对方发送任意长度的字节流实现相互间的通信，连接就是两台主机间的交流，连接的每一段都是一个socket, socket 包含了 IP地址 和 端口号 16-bit的integer称作port(端口号) 需要它是因为当我和一台特定的机器通信时, 它会提供不同的服务比如SSH服务FTP服务等等服务，不同的服务通过端口号进行区分
特别的，在客户端上的端口是动态分配的，叫做临时端口

![Pasted image 20250804160128.png|500](/img/user/accessory/Pasted%20image%2020250804160128.png)

内核态需要区分来到这台机器的不同连接
![Pasted image 20250804160232.png|500](/img/user/accessory/Pasted%20image%2020250804160232.png)

**Socket**
Socket其实是逻辑层面上的一个端点，从应用程序的角度，可以把它看做一个文件描述符
Socket是许多结构体(其实就是一层抽象)
其中有一个叫做sockaddr, 本质上只是一个16字节长的东西，唯一特殊的地方是前两个字节指明了这个socket是什么类型的，比如是TCP socket？还是IPv6 socket……
![Pasted image 20250804163057.png|600](/img/user/accessory/Pasted%20image%2020250804163057.png)
还有一个结构体叫`sockaddr_in` 用于IPv4 socket，包含了关于端口(16 bits, 两字节) ，关于IP(4字节) 可以看作是sockaddr的一个子类
![Pasted image 20250804163417.png|600](/img/user/accessory/Pasted%20image%2020250804163417.png)

这是程序员对client-server系统的完整流程的理解
![Pasted image 20250804163524.png|600](/img/user/accessory/Pasted%20image%2020250804163524.png)
最上方的getaddrinfo相当于是整个流程的开端，实际上是用于查找从域名到IP地址的映射
客户端和服务器要做的第一步都是通过调用socket函数来创建连接，它只在整个程序内部起作用，不适用操作系统，也不往网络上发任何内容，只是创建一个socket
![Pasted image 20250804164323.png|500](/img/user/accessory/Pasted%20image%2020250804164323.png)
比如例子中的`AF_INET`是告诉我们这是一个32位的IPv4地址, `SOCK_STREAM`表明了这是一个TCP连接 返回了一个 int类型，之前讲过socket实际上是一个文件描述符，有一些整数，特别是一些很小的整数，是指代一些底层的文件
bind函数 bind会调用socket函数返回的文件描述符，然后提供一个sockaddr，提供地址长度，bind函数是一个内核函数，指定这个程序到底要运行哪种服务
listen函数会把socket改为监听，告诉内核这将作为服务器端
accept函数 表明我已经准备好连接请求了 返回另一个文件描述符 通过它进行通信
connet函数 创建一个客户端到服务器的连接
![Pasted image 20250804165606.png](/img/user/accessory/Pasted%20image%2020250804165606.png)
Server上的第二个点(红色的那个)就是accept函数返回的另一个文件描述符，这样做的原因是想与多个client通信
真正的通信操作是通过rio开头的这些函数，这些都是内核中安全的IO函数
当完成通信的时候，client会发送一个请求，然后服务器读取文件会有一个EOF标志，就明白这个特定的连接结束了

