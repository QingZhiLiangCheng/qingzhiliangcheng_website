---
{"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/Lecture 06 并发控制：同步/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-08T23:20:16.525+08:00","updated":"2025-08-09T02:11:50.848+08:00"}
---

**today's agenda**
- 典型的同步问题: 生产者-消费者；哲学家吃饭
- 同步的实现方法: 信号量，条件变量

### 线程同步
什么叫同步？ -- 两个或两个以上随时间变化的量在变化过程中保持一定的相对关系
比如手机, 电脑, 云端 会同步

并发程序中的同步 -- 很难同步 -- 这里的同步的概念宽泛了一点 -- 在某个时间点共同达到互相已知的状态
e.g., one: 等我洗个头就吃饭 & another: 等我打完这局游戏就吃饭
同步就是说 两个人约定好一个时间点，先完成的就要等

可不可能编写一个程序 -- 来实现这种协议？ -- 就是说两个人都要执行吃饭这个操作，但是要等到一个人洗完头，一个人打完游戏才会达成一致

最重要的同步问题 -- 生产者-消费者问题
![Pasted image 20250808233959.png|500](/img/user/accessory/Pasted%20image%2020250808233959.png)

生产者和消费者不能随便打印括号 -- 而是通过同步达成一致后 达到能够打出合法括号的效果
其实括号匹配问题就是我生成一个左括号就扔进队列(或者是栈，或者是一个"包")，但是注意要包里面有空位才能往里放，同时打印右括号要去包里看看有没有左括号匹配
这类似有一个出题人一直在出题，然后把题扔到一个包里，然后做题的人做完了就去包里拿一个新题来做
有一个问题是，我们在解决这个问题的时候，有没有可能用一个类似自旋锁的方式来解决？
因为很自然的能想到 不能好多个人一起伸手进包里 所以其实一个人想要拿题 是先护着包（加锁）hh题是我的 然后取题目；同样出题人也是先加锁 再放题
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/pc.c
```

```c
#include "thread.h"  
#include "thread-sync.h"  
  
int n, count = 0;  
mutex_t lk = MUTEX_INIT();  
  
void Tproduce() {  
  while (1) {  
retry:  
    mutex_lock(&lk);  
    if (count == n) {  
      mutex_unlock(&lk);  
      goto retry;  
    }  
    count++;  
    printf("(");  
    mutex_unlock(&lk);  
  }  
}  
  
void Tconsume() {  
  while (1) {  
retry:  
    mutex_lock(&lk);  
    if (count == 0) {  
      mutex_unlock(&lk);  
      goto retry;  
    }  
    count--;  
    printf(")");  
    mutex_unlock(&lk);  
  }  
}  
  
int main(int argc, char *argv[]) {  
  assert(argc == 2);  
  n = atoi(argv[1]);  
  setbuf(stdout, NULL);  
  for (int i = 0; i < 8; i++) {  
    create(Tproduce);  
    create(Tconsume);  
  }  
}
```
这一小段代码就是刚刚的描述：Produce就是出题人，他做的就是`mutex_lock` 其实就是拿起包护住，然后看一下满没满，如果满了就`mutex_unlock`把包放回去然后一直自旋等到不满，如果没满就放入题(代码里是打印左括号)然后放下包；同样consume是完全对称的；16个线程

压力测试
```python
wget https://jyywiki.cn/pages/OS/2022/demos/pc-check.py
```
![Pasted image 20250809000448.png](/img/user/accessory/Pasted%20image%2020250809000448.png)
本质上就是数个数是否符合我们定义的深度
![Pasted image 20250809000622.png|450](/img/user/accessory/Pasted%20image%2020250809000622.png)

![Pasted image 20250809000652.png|450](/img/user/accessory/Pasted%20image%2020250809000652.png)

### 条件变量 万能同步方法
缺陷 -- 不管包是空还是满 每个线程都会拿过来看看 这是因为我们的互斥锁，本身就是独占性的
![Pasted image 20250809001646.png|300](/img/user/accessory/Pasted%20image%2020250809001646.png)
其实我们之前sum.c中就有一个同步，join就是一个同步，这里其实是等两个线程都执行完的意思，这就好比老师上课，可能是老师先到(先join)，但是要等学生到齐；或者学生先到齐了，老师才到(join)； -- 不同的线程的时间都不太一样 同步是先执行完的等待达到那个时间点
所以Join就相当于
```c
while(!terminated_all)//等到所有都终止 否则自旋
```
按照这个写法，其实上面的代码可以写成同样的
![Pasted image 20250809002725.png|500](/img/user/accessory/Pasted%20image%2020250809002725.png)
其实我们发现同步问题其实有个共性 就是上一把锁，然后看一下条件是否满足，如果满足就继续操作，如果不满足就等 -- 所以如果操作系统要提供一个API -- 把自旋改为睡眠
![Pasted image 20250809003109.png|500](/img/user/accessory/Pasted%20image%2020250809003109.png)
也就是改成这样 如果不满足条件就睡下 等待唤醒 而这就是条件变量
![Pasted image 20250809003217.png|400](/img/user/accessory/Pasted%20image%2020250809003217.png)
用条件变量实现生产者和消费者
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/pc-cv.c
```

```c
#include "thread.h"  
#include "thread-sync.h"  
  
int n, count = 0;  
mutex_t lk = MUTEX_INIT();  
cond_t cv = COND_INIT();  
  
void Tproduce() {  
  while (1) {  
    mutex_lock(&lk);  
    if (count == n) {  
      cond_wait(&cv, &lk);  
    }  
    printf("("); count++;  
    cond_signal(&cv);  
    mutex_unlock(&lk);  
  }  
}  
  
void Tconsume() {  
  while (1) {  
    mutex_lock(&lk);  
    if (count == 0) {  
      pthread_cond_wait(&cv, &lk);  
    }  
    printf(")"); count--;  
    cond_signal(&cv);  
    mutex_unlock(&lk);  
  }  
}  
  
int main(int argc, char *argv[]) {  
  assert(argc == 2);  
  n = atoi(argv[1]);  
  setbuf(stdout, NULL);  
  for (int i = 0; i < 8; i++) {  
    create(Tproduce);  
    create(Tconsume);  
  }  
}
```
这列注意 cv其实就是个条件，有点像一个全局变量的条件，用来通知对方条件满足了可以醒来
另外要注意在睡下的时候会释放锁，醒来后会接着上锁 所以最后还要释放锁
但这个算法是错的😅hh
![Pasted image 20250809004531.png|500](/img/user/accessory/Pasted%20image%2020250809004531.png)
为什么？
但你会发现一个生产者一个消费者的时候工作的挺好的，一但多了就不行
去找发生bug的最小条件 -- 发现一个生产者 两个消费者就会出bug
这是因为我们只有一个条件变量 -- 消费者把消费者唤醒了hh
![Pasted image 20250809005548.png|500](/img/user/accessory/Pasted%20image%2020250809005548.png)
嗷嗷这里是执行完打印都会运行一次唤醒 -- 其实对方也不一定在休眠啊
这里的核心是不能同类唤醒 所以得用两个变量 -- 嗷嗷这就是为什么之前我学课本的时候一个full一个empty？
当然最保险的正确打开方式是
```c
void Tproduce() {
  while (1) {
    mutex_lock(&lk);
    while (!(count != n)) {
      cond_wait(&cv, &lk);
    }
    //确保了醒来一定count != n
    printf("("); count++;
    //cond_signal(&cv);
    cond_broadcast(&cv);
    mutex_unlock(&lk);
  }
}
```
改成while是防止虚假唤醒，因为前面提到了可能同类唤醒的时候并不满足条件 所以醒来再检查一次 更保险
如果用一个 `cv` 同时表示“缓冲区不满”和“缓冲区不空”两个条件，那就唤醒所有人，让他们自己检查条件 不满足条件的会再次while运行
这是万能的同步方式 -- 当然他的性能可能没有用cond_signal和两个变量那么好 -- 因为他唤醒了所有的


### 信号量
![Pasted image 20250809012531.png|500](/img/user/accessory/Pasted%20image%2020250809012531.png)

![Pasted image 20250809012556.png|500](/img/user/accessory/Pasted%20image%2020250809012556.png)
更衣室其实就是那个等待队列 而手环其实就是一个个数资源的工具
在进一步 如果我们能变出一个手环来 也就是其实把更衣室的容量是扩大了
这就引出了信号量机制
信号量一个P一个V 实际上是扩展了互斥锁
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/sem.py
```

```python
def P(self, tid):  
    if self.token > 0:  
        self.token -= 1  
        return True  
    else:  
        self.waits = self.waits + tid  
        return False
```
P: 互斥锁是只有一个手环(只有拿到手环 才能进去) 不过P这里是好多手环，是一个计时器叫token，P就是上锁的时候，如果有超过一个手环就-1 然后返回ture；否则就放到等待队列中水平 等到别人把他唤醒
```python
def V(self):  
    if self.waits:  
        self.waits = self.waits[1:]  
    else:  
        self.token += 1
```
V: 变出一个手环来 如果有人在等这个手环 就不会把手环给管理员 而是唤醒一个等待的进程;如果没人等 手环就++
所以PV操作其实就是一个锁 -- 只不过是互斥锁 那个钥匙 变成了多个 同时还有一个等待队列 可以直接唤醒
![Pasted image 20250809014705.png|400](/img/user/accessory/Pasted%20image%2020250809014705.png)
两个信号量 empty是说包里有空位 V是创建空位
小心 == 因为并不是像互斥锁那么配对 而是凭空创造的

可以去听2023年的课 讲了一节课的信号量

### 哲学家吃饭问题
![Pasted image 20250809015451.png|500](/img/user/accessory/Pasted%20image%2020250809015451.png)
失败的尝试
![Pasted image 20250809020340.png|500](/img/user/accessory/Pasted%20image%2020250809020340.png)
可能会发生死锁 就是所有人都发拿起左边的叉子 结果都在等
核心思想是每个人必须一次性拿两把叉子
万能方法 -- 可以用条件变量
![Pasted image 20250809020626.png|500](/img/user/accessory/Pasted%20image%2020250809020626.png)
先上一把互斥锁 -- 都别动 看看左手有没有叉子 右手有没有叉子 如果左右手都有 就拿吃饭 -- 吃完了上锁把叉子还回去

还有一种思路是 有个服务员 服务员来决定