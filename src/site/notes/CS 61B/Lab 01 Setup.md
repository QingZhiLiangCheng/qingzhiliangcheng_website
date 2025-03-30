---
{"dg-publish":true,"permalink":"/CS 61B/Lab 01 Setup/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-06T15:54:58.228+08:00","updated":"2025-03-30T15:27:31.714+08:00"}
---


官方文档：[Lab 01: Setup | CS 61B Spring 2024](https://sp24.datastructur.es/labs/lab01/)
参考文档：[Lab 1: IntelliJ, Java, git | AJohn Blog](https://ajohn.top/cs61b/m9ov5uds/)
由于Java课使用了华为云的代码托管
所以我先建立了华为云的代码仓库
https://codehub.devcloud.cn-north-4.huaweicloud.com/51257dbf8a21492f89da2942785a5ec8/CS61B-lab.git
加远程  为了拉取课程代码
```shell
git remote add skeleton https://github.com/Berkeley-CS61B/skeleton-sp24.git
```

查看是否添加成功
```bash
git remote -v
```

![Pasted image 20250306160034.png](/img/user/accessory/Pasted%20image%2020250306160034.png)

从远程获取起始代码  作用是从名为skeleton的存储库中获取所有远程文件  并复制到当前文件中
```bash
git pull skeleton main
```

其实这是整个课程的代码啊

我推不上去 ee 没办法了  

所以后来决定建一个github仓库用于gradescope提交代码
然后用华为云的仓库 在建一个项目  一个lab一个lab往上推

记得加上依赖 用的是普林斯顿算法课的那个库啊 hhh  我看了三章了
![Pasted image 20250306165351.png](/img/user/accessory/Pasted%20image%2020250306165351.png)

提交的时候用github仓库
![Pasted image 20250306170508.png|500](/img/user/accessory/Pasted%20image%2020250306170508.png)
呃呃sp24和 sp21的题不一样
没法用gradescope评分了  伯克利大学只提供了21年的gradescope评分