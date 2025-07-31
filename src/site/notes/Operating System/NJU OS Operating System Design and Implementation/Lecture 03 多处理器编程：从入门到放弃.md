---
{"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/Lecture 03 多处理器编程：从入门到放弃/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-31T16:04:15.667+08:00","updated":"2025-07-31T17:32:51.849+08:00"}
---

- [x] 阅读章节: OSTEP Chapter 25, 26, 27

---
### 入门
问题: 多处理器时代，[[Operating System/NJU OS Operating System Design and Implementation/Lecture 02 操作系统上的程序\|Lecture 02 操作系统上的程序]]将的状态机的视角有什么变化?
前面讲的都是单线程，那怎么变成多线程 -> 并发程序的状态机模型

OSTEP对于并发的定义

> Concurrent: existing, happening, or done _at the same time_.
> 
> In computer science, concurrency refers to the ability of different parts or units of a program, algorithm, or problem to be executed out-of-order or in partial order, without affecting the final outcome.

并且书中也提到了为什么将并发
- 操作系统是最早的并发程序之一
- 今天遍地都是 多处理器系统

并发的基本单位：线程Thread

其实从状态机的视角很容易能想到，如果我们有多个执行流什么需要多复制几份
在我们的状态机中，对于C语言的状态机，在虚拟内存中(因为在CSAPP中我学过)，有放全局变量的地方，有堆区malloc可以在堆区申请空间，有栈区-栈帧, 寄存器, PC提供函数调用等
那其实很简单很自然的能想到，栈帧上的东西是局部变量，是自己的
所以在状态机中，是共享的全局变量，堆区，每个线程有自己的栈帧链
图
那怎么执行？并发体现在哪里？
外面像是有一个选择器，可以选择这个状态是t1执行还是t2执行；如果选择线程1执行，那就是把全局状态（全局变量和heap）+自己的局部状态当做是一个单线程的程序执行
链表变成树了 -- 每一部还是不确定的  蝴蝶效应？
图

**简单的thread.h API**
老师为大家封装了一个超级好用的线程API
```cpp
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdatomic.h>
#include <assert.h>
#include <unistd.h>
#include <pthread.h>

#define NTHREAD 64
enum { T_FREE = 0, T_LIVE, T_DEAD, };
struct thread {
  int id, status;
  pthread_t thread;
  void (*entry)(int);
};

struct thread tpool[NTHREAD], *tptr = tpool;

void *wrapper(void *arg) {
  struct thread *thread = (struct thread *)arg;
  thread->entry(thread->id);
  return NULL;
}

void create(void *fn) {
  assert(tptr - tpool < NTHREAD);
  *tptr = (struct thread) {
    .id = tptr - tpool + 1,
    .status = T_LIVE,
    .entry = fn,
  };
  pthread_create(&(tptr->thread), NULL, wrapper, tptr);
  ++tptr;
}

void join() {
  for (int i = 0; i < NTHREAD; i++) {
    struct thread *t = &tpool[i];
    if (t->status == T_LIVE) {
      pthread_join(t->thread, NULL);
      t->status = T_DEAD;
    }
  }
}

__attribute__((destructor)) void cleanup() {
  join();
}
```


```bash
wget https://jyywiki.cn/pages/OS/2022/demos/thread.h
```

这里面有两个核心的API，一个是create(), create是创建一个线程，创建一个入口函数是fn的线程（create的参数的类型是`void*` 函数指针）fn函数接受一个int的tid-线程号 -- create逻辑上做的就是上一个状态的pc+1了，然后又建立了一个新的状态链（tid=n，PC=0）
图
另一个函数叫join(), 假设T1执行了join, 在有其他线程未执行完时死循环，否则返回
记得编译的时候要额外加一个 -lpthread

接下来就是创建一个多线程的Hello World -- thread-hello.c
```c
#include "thread.h"
void Ta() { while (1) { printf("a"); } } 
void Tb() { while (1) { printf("b"); } } 

int main() { 
	create(Ta); 
	create(Tb); 
}
```


```bash
 gcc -Og thread-hello.c  -o thread-hello.out
 ./thread-hello.out
 ```
 就会得到一个一直循环交替输出ab的结果，而且每次输出的个数都不一样
其实能看到create(Ta)和create(Tb)虽然是来个死循环，但是交替在执行，其实这里Ta可能放到了CPU1上，Tb可能放在了CPU2上

如果把Ta和Tb中的printf删掉 然后运行起来
![Pasted image 20250731170317.png|600](/img/user/accessory/Pasted%20image%2020250731170317.png)
会发现thread-hello.out使用的cpu超过了100%
如果多创建几个呢？ 创建4个 会占用到400%
![Pasted image 20250731170557.png|600](/img/user/accessory/Pasted%20image%2020250731170557.png)

这些所有的东西在同一地址空间里吗？
比如 我可以把一个线程定义一个局部变量，然后把这个局部变量存到一个全局变量里，然后看能不能其他线程能不能访问这个指针呢
共享内存了嘛？

如何证明线程确实共享内存 -- shm-test.c
```c
#include "thread.h"

int x = 0;

void Thello(int id) {
  usleep(id * 100000);
  printf("Hello from thread #%c\n", "123456789ABCDEF"[x++]);
}

int main() {
  for (int i = 0; i < 10; i++) {
    create(Thello);
  }
}
```


![Pasted image 20250731171726.png|500](/img/user/accessory/Pasted%20image%2020250731171726.png)

同样也能证明独立堆栈

同样的通过strace能看到哪个系统调用创建了线程
```bash
strace ./thread-hello.out
```

里面有个clone系统调用

这里的thread.h 线程库的背后 其实就是OSTEP中提到的POSIX Threads的封装

### 放弃1: 原子性
可怕的事情在逼近 -- 如果两个线程同时执行x++， 结果还对嘛
