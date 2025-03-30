---
{"dg-publish":true,"permalink":"/LCU principles of computer composition/专题二：编码类问题之Cache映射题/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-12-02T20:14:01.164+08:00","updated":"2025-03-30T15:10:12.248+08:00"}
---


这部分题目主要就是分析cache不同的映射方法 设计主存地址格式
相关的映射方法以及知识见[[LCU principles of computer composition/高速缓冲存储器\|高速缓冲存储器]]

![Pasted image 20241224104355.png](/img/user/accessory/Pasted%20image%2020241224104355.png)


![Pasted image 20241224104415.png](/img/user/accessory/Pasted%20image%2020241224104415.png)
主存地址 Cache地址多少位 这就不用说了  容量是跟多少位有关系的
![Pasted image 20241224104829.png|400](/img/user/accessory/Pasted%20image%2020241224104829.png)
主存和Cache装多少块也很简单---其实就是用各自的容量除以块长
![Pasted image 20241224104622.png|500](/img/user/accessory/Pasted%20image%2020241224104622.png)

事实上 主存可装入的块数 如果不采用任何映射方式的话（或者采用的是全相联映射）那就是把所有的一起编码   然后主存格式就是哪个块的哪个里面的地方  那么就是13位+4位  刚好也就是主存的17位
Cache 128块  编地址的话 用 7位   其实这128块编码7位 + 快内地址  也刚好就是 Cache地址的11位
如果采用的直接映射，意思是拿着Cache当尺子 把 主存又分成了好多块 那么事实上 主存被Cache分成的一组中的每个块的编码也就是7位   那么事实上直接映射的Cache块地址为7位
剩下的部分用17-11或者用17-7-4事实上就是标识是哪一组的  其实就是主存容量 除以 Cache容量 的组数 的编码   只不过二进制的幂次相加减而已
![Pasted image 20241224105405.png|500](/img/user/accessory/Pasted%20image%2020241224105405.png)
如果采用的是组相连 那么就先把Cache块分组  得到组的那个地址编码 其他都一样啊

![Pasted image 20241224105608.png|400](/img/user/accessory/Pasted%20image%2020241224105608.png)


总结一下：
主存字块标记的计算
- 可以用主存容量除以Cache容量 ---- 事实上就是看的有多少组Cache
- 再确定完了Cache块地址  快内地址后  做减法
Cache块地址的计算：
- 跟Cache的块数的编码是一样的
- 其实就是Cache总地址长度-快内地址的长度

一定要标记好啊 
- 主存字块标记
- Cache块地址 or  Cache组地址
- 字块内地址
如果直接给你地址，，去截取对应的位数就行了

这样总结感觉就变得比较简单了