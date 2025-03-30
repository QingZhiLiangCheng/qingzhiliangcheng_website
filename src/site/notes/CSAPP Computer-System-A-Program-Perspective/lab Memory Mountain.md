---
{"week":"第六周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/lab Memory Mountain/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-20T14:19:02.913+08:00","updated":"2025-03-30T15:03:46.992+08:00"}
---

下载代码地址
[15-213: Introduction to Computer Systems / Schedule Fall 2015](https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html)
Cache Memory那一节的 tar下载
进入memory mountain
```bash
cd "/mnt/d/情栀凉橙/csapp/12-cache-memories/mountain"
```
运行相关代码
```bash
gcc -c clock.c -o clock.o
gcc -c  fcyc2.c -o fcyc2.o
gcc -c mountain.c -o mountain.o
gcc clock.o fcyc2.o mountain.o -o run
./run
```

得到相关的数据
我运行了两遍
不知道为啥第三遍 突然第一个数据变成八千多了  下午运行的时候还是一万多？ 可能跟开的东西多少有关系？
![newplot (3) 1.png|400](/img/user/accessory/newplot%20(3)%201.png)
![newplot (4).png|400](/img/user/accessory/newplot%20(4).png)

但能看出来我的图是凸着往下走的   而当时课程的图是凹着往下走的
-> 我的cpu性能更好
