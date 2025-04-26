---
{"dg-publish":true,"tags":["LCU操作系统"],"permalink":"/Operating System/LCU Operating System/Lab1 单处理器系统进程调度/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-12T16:39:06.370+08:00","updated":"2025-04-26T15:37:26.672+08:00"}
---

Lab1主要模拟单处理器的进程调度
其实进程调度算法有很多种 比如FCFS（先来先服务），SPF（短进程优先），RR（时间片轮转法），优先级算法等
在Lab1中其实是用了优先级算法 然后再思考题中提到了一个时间片轮转法

### 优先级算法介绍
希望调度程序能从就绪队列中选择最高优先级的进程进行运行，这称为最高优先级（Highest Priority First, HPF）调度算法。
进程的优先级可以分为，静态优先级或动态优先级：
- 静态优先级：创建进程时候，就已经确定了优先级了，然后整个运行时间优先级都不会变化；
- 动态优先级：根据进程的动态变化调整优先级，比如如果进程运行时间增加，则降低其优先级，如果进程等待时间（就绪队列的等待时间）增加，则升高其优先级，也就是随着时间的推移增加等待进程的优先级。
该算法也有两种处理优先级高的方法，非抢占式和抢占式：
- 非抢占式：当就绪队列中出现优先级高的进程，运行完当前进程，再选择优先级高的进程。
- 抢占式：当就绪队列中出现优先级高的进程，当前进程挂起，调度优先级高的进程运行。

在Lab1中 模拟的是动态优先级 抢占式的最高优先级算法 每次执行优先数-1

### 代码分析与过程
在lab1 中 假定系统有五个进程 每个进程用一个进程控制块PCB来表示
当然注意事实上PCB中有好多东西 这里只是一个简单的模拟
```c
struct pcb {
    char name[10];  
    char state;  
    int super;  
    int ntime;  
    int rtime;  
    struct pcb* link;  
}*ready=NULL,*p
```
- name: 进程名 - 进程的标识
- state: 状态 - 就绪‘R’ or 结束'E'
- super: 进程优先级 -- 优先数大的先执行
- ntime: 进程总运行时间 -- 单位通常是时间片
- rtime: 进程已经运行的时间
- link: 指向下一个进程控制卡的指针 最后一个进程中的指针为“0”

全局变量
- ready：指向就绪队列的头节点。
- p：当前正在运行的进程指针。

在lab1给的程序中  需要我们输入进程的信息
```c
void input() /* 建立进程控制块函数*/  
{  
    int i,num;  
    printf("\n 请输入进程数量?");  
    scanf("%d",&num);  
    for(i=0;i<num;i++)  
    {  
        printf("\n 进程号No.%d:\n",i);  
        p=getpch(PCB);  
        printf("\n 输入进程名:");  
        scanf("%s",p->name);  
        printf("\n 输入进程优先数:");  
        scanf("%d",&p->super);  
        printf("\n 输入进程运行时间:");  
        scanf("%d",&p->ntime);  
        printf("\n");  
        p->rtime=0;p->state='w';  
        p->link=NULL;  
        sort(); /* 调用sort函数*/  
    }  
}
```
在最后是调用了`sort`函数进行排序 将五个进程按照给定的优先数从小到大连成队列 而lab1的要求就是补全这个sort函数的代码
<font color="#4bacc6">这里注意一下 其实我觉着最好是实现个堆 使用堆排序 时间复杂度会低 但是由于给定的代码中其实已经实现了一个链表的形式 而且里面其实还有一个space函数 是用来算整个链表长度的 里面调用了一个while循环 时间复杂度已经是O(n)了 所以这里sort函数实现一个简单的链表的插入排序就行</font>
从main函数来看
```c
void main() {
    int len, h = 0;
    char ch;
    input(); // 输入进程信息
    len = space(); // 获取就绪队列长度
    while ((len != 0) && (ready != NULL)) {
        ch = getchar();
        h++;
        printf("\n The execute number:%d \n", h);
        p = ready; // 取出队首进程
        ready = p->link; // 更新就绪队列
        p->link = NULL;
        p->state = 'R'; // 设置为运行状态
        check(); // 查看当前状态
        running(); // 模拟运行
        printf("\n 按任一键继续......");
        ch = getchar();
    }
    printf("\n\n 进程已经完成.\n");
    ch = getchar();
}
```
在输入进程完信息后 然后获取队列长度 然后开始进行模拟
所以对于实验指导书给出的例子,输入完进程信息的状态是这样的
![lab1 1(1) 1.png](/img/user/accessory/lab1%201(1)%201.png)
然后通过space函数获取队列长度
```c
int space()  
{  
    int l=0; PCB* pr=ready;  
    while(pr!=NULL)  
    {  
        l++;  
        pr=pr->link;  
    }  
    return(l);  
}
```
只要队列长度不为0 也就是队列不为空的时候 就要一直循环调度
具体的调度过程就是
```c
p = ready; // 取出队首进程
ready = p->link; // 更新就绪队列
p->link = NULL;
p->state = 'R'; // 设置为运行状态
check(); // 查看当前状态
running(); // 模拟运行
```

![lab1 2.png](/img/user/accessory/lab1%202.png)

然后调用了check函数 主要是通过disp函数查看当前运行和就绪队列状态
```c
void check() /* 建立进程查看函数 */{  
    PCB* pr;  
    printf("\n **** 当前正在运行的进程是:%s",p->name); /*显示当前运行进程*/  
    disp(p);  
    pr=ready;  
    printf("\n ****当前就绪队列状态为:\n"); /*显示就绪队列状态*/  
    while(pr!=NULL)  
    {  
        disp(pr);  
        pr=pr->link;  
    }  
}

void disp(PCB * pr) /*建立进程显示函数,用于显示当前进程*/  
{  
    printf("\n qname \t state \t super \t ndtime \t runtime \n");  
    printf("|%s\t",pr->name);  
    printf("|%c\t",pr->state);  
    printf("|%d\t",pr->super);  
    printf("|%d\t",pr->ntime);  
    printf("|%d\t",pr->rtime);  
    printf("\n");  
}
```
然后调用了running函数模拟进程运行
```c
void running() /* 建立进程就绪函数(进程运行时间到,置就绪状态*/  
{  
    (p->rtime)++;  
    if(p->rtime==p->ntime)  
        destroy(); /* 调用destroy函数*/  
    else  
    {  
        (p->super)--;  
        p->state='w';  
        sort(); /*调用sort函数*/  
    }  
}
```
running函数主要是通过给已运行时间+1, 降低优先数来模拟整个进程运行过程 然后放回队列(需要重新排序)
当然如果已运行时间=总运行时间 那么就销毁这个pcb
![lab1 3(2) 1.png](/img/user/accessory/lab1%203(2)%201.png)

**当然这里你最后P2插回去到底是在P4前面还是P4后面 跟你的排序算法的实现有关系 都行**

### 实现Sort函数
把指导书的代码复制进来 会有一些小问题
第一个问题就是main函数返回值要改为int
第二个问题是实验书中给了个`<conio.h>`的头文件 当时我报错了
![c630bafbf0d1a640eff4cfa8a3222de.png](/img/user/accessory/c630bafbf0d1a640eff4cfa8a3222de.png)
我查了一下 这个头文件 -- `<conio.h>` 是一个头文件，主要用于 **DOS 和 Windows 环境下的控制台输入输出操作**。它提供了一些非标准的函数，用于处理键盘输入和屏幕输出。这些函数在早期的 C 语言开发中（特别是在 Turbo C 或 Borland C++ 等编译器中）非常常见，但在现代操作系统（如 Linux、macOS）或标准 C 编译器（如 GCC）中并不被支持。
hhh我的CLion是Ubuntu Linux环境下的
可以把我的环境换回来
![Pasted image 20250412203148.png|500](/img/user/accessory/Pasted%20image%2020250412203148.png)
但是我没换 因为后来我发现这个头文件没用到hhh
第三个问题是运行的时候 CLion的控制台不输出 当然如果是VS 他直接弹出的就是终端
**Solution1:  把下面这个地方勾一下就行** 
![Pasted image 20250412203356.png|400](/img/user/accessory/Pasted%20image%2020250412203356.png)
![Pasted image 20250412174328.png|500](/img/user/accessory/Pasted%20image%2020250412174328.png)
但是如果你用的是Clion的MinGW那个环境 -- 那么可能输出的是乱码
![Pasted image 20250412203608.png|500](/img/user/accessory/Pasted%20image%2020250412203608.png)
因为CLion里面默认是UTF-8编码 改为GDK就好了
如果用的Linux的那个环境 就不用改编码
**Soluton2: 直接用cmd**
![Pasted image 20250412203716.png|650](/img/user/accessory/Pasted%20image%2020250412203716.png)


**实现sort代码**
```c
void sort() {  
    PCB *first, *second;  
    int insert = 0;  
    if ((ready == NULL) || (p->super > ready->super)) {  
        p->link = ready;  
        ready = p;  
    } else {  
        first = ready;  
        second = first->link;  
        while (second != NULL) {  
            if (p->super > second->super) {  
                p->link = second;  
                first->link = p;  
                insert = 1;  
                break;  
            }  
            first = first->link;  
            second = second->link;  
        }  
        if (insert == 0) {  
            first->link = p;  
        }  
    }  
}
```

**运行结果**
![Pasted image 20250412204704.png](/img/user/accessory/Pasted%20image%2020250412204704.png)
### 思考题
#### Question 1
要求: 若实验内容中，在修改优先数时增加下列原则：进程等待的时间超过某一时限时增加其优先数，参考上述例程，写出程序。
我觉得最简单的做法就是给pcb加一个`wait_time_`域来记录等待时长并与一个常量`TIME_LIMIT`比较 实时更新优先数即可
```c
struct pcb {
    char name[10];  
    char state;  
    int super;  
    int wait_time_;
    int ntime;  
    int rtime;  
    struct pcb* link;  
}*ready=NULL,*p
```

什么时候更新`wait_time_`?
根据代码不难发现 在main函数中 `p->link = NULL;` 的时候 将要上CPU的进程拿出进程队列 在`Running函数`最后执行了`Sort函数` 将p进程放回了进程队列 -> 所以应该在 `p->link = NULL;`之后 `Sort函数` 之前 更新`wait_time_`
具体操作
```cpp
void UpdateWaitTime() {  
    PCB *pr = ready;  
    while (pr != nullptr) {  
        if (++pr->wait_time_ > TIME_LIMIT) {  
            pr->super++;  
            pr->wait_time_ = 0;  
        }  
        pr = pr->link;  
    }  
}
```
**Question: super++之后要不要重置等待时间？**  不知道哈哈哈
#### Question 2
要求: 若采用基于时间片轮转的调度算法模拟进程调度，试设计算法与程序。
**时间片轮转(RR)调度算法**
时间片轮转(RR)调度算法: 用于分时系统中的进程调度。每次调度时，总是选择就绪队列的队首进程，让其在CPU上运行一个系统预先设置好的时间片。一个时间片内没有完成运行的进程，返回到绪队列末尾重新排队，等待下一次调度。
给每个进程固定的执行时间，根据进程到达的先后顺序让进程在单位时间片内执行，执行完成后便调度下一个进程执行，时间片轮转调度不考虑进程等待时间和执行时间，属于抢占式调度。优点是兼顾长短作业；缺点是平均等待时间较长，上下文切换较费时。适用于分时系统。
**程序设计**
我使用的是C++ 遵询的是Google C++规范 文档: [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)
```cpp
class PCB {  
public:  
    int pid_;  
    int arrival_time_;  
    int run_time_;  
    int used_cpu_time_{0};  
    int status_{0}; // 0-waiting, 1-running, 2-completed  
  
    PCB(int pid, int arrival_time, int run_time) : pid_(pid), arrival_time_(arrival_time), run_time_(run_time) {}  
};
```

```cpp
class RR {  
public:  
    RR(int rr) : rr_(rr) {};
private:  
    std::list<PCB *> pcbs_;  
    std::deque<PCB *> pcb_deque_; // 进程队列  
    int current_time_{0};  
    int rr_;  //时间片
};
```

核心代码
```cpp
void RunScheduler() {  
    pcbs_.sort([](const PCB *a, const PCB *b) {  
        return a->arrival_time_ < b->arrival_time_;  
    });  
    pcb_deque_.push_back(pcbs_.front());  
    current_time_ = pcbs_.front()->arrival_time_;  
    pcbs_.pop_front();  
    while (!pcbs_.empty() || !pcb_deque_.empty()) {  
        PCB *current_pcb = pcb_deque_.front();  
        pcb_deque_.pop_front();  
        current_pcb->used_cpu_time_ += std::min(rr_, current_pcb->run_time_ -  
                                                     current_pcb->used_cpu_time_);  
        current_time_ += std::min(rr_, current_pcb->run_time_ -  
                                       current_pcb->used_cpu_time_);  
  
        while (!pcbs_.empty() && pcbs_.front()->arrival_time_ <= current_time_) {  
            pcb_deque_.push_back(pcbs_.front());  
            pcbs_.pop_front();  
        }  
  
  
        Display(current_pcb);  
  
  
        if(current_pcb->used_cpu_time_ < current_pcb->run_time_) {  
            pcb_deque_.push_back(current_pcb);  
        }  
    }  
}
```

需要注意的几个点
- 要给pcbs排序 -- 因为不一定输入的就一定按照到达的时间排好了
- `used_cpu_time_` 取的是 时间片和 剩余时间的最小值
- 要注意我实现的这个是先到达的process先放入了队列 然后才是下CPU的process
- 我没去该status hhh  因为我发现好像不需要
- 我默认是假设A的arrive_time为0 run_time为1 我默认current_time的时候 A还在CPU上 下一刻（多一点点）接着就下来了

运行结果
![Pasted image 20250426152750.png](/img/user/accessory/Pasted%20image%2020250426152750.png)