---
{"tags":["LCU操作系统"],"dg-publish":true,"permalink":"/Operating System/LCU Operating System/专题九：PV操作/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-06-18T21:38:03.404+08:00","updated":"2025-06-25T07:36:11.271+08:00"}
---

我对PV操作的理解
![720c51a64fa95befd502365932f1164.jpg|500](/img/user/accessory/720c51a64fa95befd502365932f1164.jpg)
- P申请资源 V释放资源
- P++ ， V--
- 互斥就是将互斥的那个操作用P(mutex), V(mutex) 给加起来
- 同步就是一条时间线那样的我感觉 P2等待V2释放资源
- 我感觉P操作还有一个判断的作用 比如判断有没有empty  其实也是等待有empty释放
- 注意while
- 适当写注释 比如对谁互斥访问

记住semaphore的拼写啊





假定有三个进程R、W1、W2共享一个缓冲区Buffer。进程R读入数据放到缓冲区Buffer中；若缓冲区中的数为奇数，则进程W1将其取出显示；若缓冲区中的数为偶数，则进程W2将其取出显示。对它们有如下的限制条件：
缓冲区中每次只能存放一个数
只有当缓冲区中没有数，或W1或W2将数取走后，进程R才可以将新读入的数放到缓冲区中。
进程W1或W2对每次存入缓冲区中的数只能显示一次，且W1和W2都不能从空缓冲区中取数。
假定开始缓冲区为空，利用记录型信号量及wait、signal操作写出三个并发进程的正确工作程序。
is 生产者消费者的变式
生产者消费者问题 要有mutex, 要有empty, full
```c
// 生产者
while (true) {
    item = produce_item();  // 生产一个数据项
    P(empty);              // 等待有空位
    P(mutex);              // 进入临界区
    put_item_into_buffer(item);  // 放入缓冲区
    V(mutex);              // 离开临界区
    V(full);               // 增加一个已用缓冲区
}

// 消费者
while (true) {
    P(full);               // 等待有数据可取
    P(mutex);              // 进入临界区
    item = remove_item_from_buffer();  // 取出数据
    V(mutex);              // 离开临界区
    V(empty);              // 增加一个空缓冲区
    consume_item(item);    // 消费数据
}
```

现有一个文件F，供进程共享。把进程分为A，B两组，规定同组的进程可以同时读文件F，但当有A组（或B组）的进程在读文件时不允许B组（或A组）的进程读文件。试用记录型信号量及其wait、signal操作实现两组进程对文件的正确访问。
（1） 定义使用的信号量、变量并说明及含义；（3分）
（2） 对两组进程进行描述。（8分）
这是读者和写者问题的变式
先看标准的读者和写者问题的模版
![1050ca9ef9b0dd521b4fac01db55d45.jpg|500](/img/user/accessory/1050ca9ef9b0dd521b4fac01db55d45.jpg)

![50092ee25747fef83210f9e17f70e67.jpg|500](/img/user/accessory/50092ee25747fef83210f9e17f70e67.jpg)


一条小河上有一座独木桥，规定每次只允许一个人过桥。现河东和河西都有相等的人数在等待过桥，为了使两边的人都有同样的过桥机会，规定某边的一个人过桥后要让另一边的一个人过桥，即两边的人交替过桥。如果把每个过桥者看做一个进程，为保证安全，用PV操作来管理。
写出应定义的信号量及其初值。
假定开始时让河东的一个人先过桥，然后交替过桥。请用适当的PV操作，达到上述管理要求。
 gei