---
{"dg-publish":true,"permalink":"/Operating System/NJU OS Operating System Design and Implementation/Lecture 04 多处理器编程：理解并发程序执行/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-02T10:40:31.062+08:00","updated":"2025-08-02T11:55:50.107+08:00"}
---

上节课是讲了第一个并发程序，第一个线程库，第一个并发程序的状态机
怎么理解并发程序: 画状态机
### 画状态机理解并发程序
互斥算法 -- 互斥：保证两个线程不能同时执行一段代码
插入神秘代码 使得之前的sum.c 能够正常工作 -- 比如通过lock()和unlock()包裹，阻止sum++的并发 
一个失败的尝试
```c
int locked = UNLOCK; 
void critical_section() { 
	retry: 
		if (locked != UNLOCK) { 
			goto retry; 
		}
	 locked = LOCK; 
	 // critical section 
	 
	 locked = UNLOCK; 
}
```
这段代码大致是说，有一个全局的变量locked是一把锁，然后每个程序检查locked是不是LOCK，也就是说是不是有人得到这把锁了，如果得到了就goto retry一直回去等，否则就自己用这把锁 执行完之后 变释放锁
但是错误的原因是 处理器默认不保证 load + store 的原子性

**Peterson算法**
![Pasted image 20250802112653.png|500](/img/user/accessory/Pasted%20image%2020250802112653.png)
只有两个人
其实这个算法的精髓在于如果AB都想上厕所 都会举旗子 然后都会贴标签 但是由于贴的是对方的名字 A说让B上吧 然后B说让A上吧 这个时候加入A先贴B后贴，B会覆盖掉A的标签，表现出来的就是A先上吧
换句话说，如果是自己的名字，说明对方比你后贴标签，把你贴的标签覆盖了，你比对方先贴，所以你可以先上厕所
证明这个算法的一个好的方式就是写一个程序 画状态机
```c
// wget https://jyywiki.cn/pages/OS/2022/demos/peterson-simple.c



#include "thread.h"

#define A 1
#define B 2

atomic_int nested;
atomic_long count;

void critical_section() {
  long cnt = atomic_fetch_add(&count, 1);
  assert(atomic_fetch_add(&nested, 1) == 0);
  atomic_fetch_add(&nested, -1);
}

int volatile x = 0, y = 0, turn = A;

void TA() {
    while (1) {
/* PC=1 */  x = 1;
/* PC=2 */  turn = B;
/* PC=3 */  while (y && turn == B) ;
            critical_section();
/* PC=4 */  x = 0;
    }
}

void TB() {
  while (1) {
/* PC=1 */  y = 1;
/* PC=2 */  turn = A;
/* PC=3 */  while (x && turn == A) ;
            critical_section();
/* PC=4 */  y = 0;
  }
}

int main() {
  create(TA);
  create(TB);
}
```

类似这样的图

![Pasted image 20250802113950.png|350](/img/user/accessory/Pasted%20image%2020250802113950.png)
### (自动)画状态机理解并发程序
python写好的model-checker
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/model-checker.py
```

试试威力
```bash
wget https://jyywiki.cn/pages/OS/2022/demos/mutex-bad.py
wget https://jyywiki.cn/pages/OS/2022/demos/peterson-flag.py
```

![Pasted image 20250802115527.png|500](/img/user/accessory/Pasted%20image%2020250802115527.png)

然后如果写一个展示的程序编程html 就会展示整个图