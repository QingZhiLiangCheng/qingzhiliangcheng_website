---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 02 Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-12T11:54:58.043+08:00","updated":"2025-07-15T20:15:20.123+08:00"}
---



![[Lecture-02-Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023).pdf]]

这是2023年的一篇论文
### Abstract
这篇论文主要对Rarquet和ORC两个主流开源列式存储格式进行了实验分析
Rarquet和ORC最初都是为Hadoop设计的，我查了一下Hadoop,是2006年诞生的用于大数据存储和处理的开源框架，主要用于分布式海量数据的存储和并行计算 而论文中提到的这个列存储格式是大约2010年代初为Hadoop生态设计的
但是从那时到现在 无论是硬件(CPU/SSD/GPU)还是工作负载(机器学习/实时查询)都发生了巨大变化，旧格式无法充分利用这些新特性。
这篇论文重新审视了Parquet和ORC这两个开源列式格式，深入内部结构，设计了一套基准测试来评估这两种格式在不同负载下的性能和存储效率，发现了一些优点，即有利于现代硬件和现实世界数据分布的方面设计选择
- 默认使用字典编码
- 在整数算法中优先考虑解码速度而不是压缩率
- 块压缩作为可选
- 嵌入更细粒度的辅助数据结构

同时，在实验中也发现了在GUP和机器学习场景下的设计问题
为此，作者提出了一些未来格式设计的建议，以适应现代技术趋势

### Introduce
