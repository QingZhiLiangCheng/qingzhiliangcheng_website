---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 02 Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-12T11:54:58.043+08:00","updated":"2025-07-24T17:44:58.077+08:00"}
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
在之前已经出现了列式存储并且广泛应用于数据分析领域 因为
- Irrelevant attribute skipping(跳过无关属性)
- Efficient data compression(高效压缩)
- Vectorized query processing(向量化查询处理)

在2010s，当时很多公司每天都会产生PB级别的数据，需要高效的处理引擎，各类组织开始开源大数据处理引擎，在paper中提到的有
- Hive: 最早将SQL转换为Hadoop MapReduce作业，适合批处理
- Impala: Cloudera 推出，支持实时交互式查询，比 Hive 快得多
- Spark：内存计算引擎，支持批处理、流处理、机器学习等场景。
- Presto（Trino）：Facebook 开发的分布式 SQL 引擎，可跨多种存储系统执行查询（如 Hive、Kafka、S3）。

为了让不同基于Hadoop的查询引擎支架能够共享数据，有提出了开放的列式存储格式，如Parquet和ORC，现在这两个格式已经成为data lake和data warehouse的真实标准
但是Rarquet和ORC都是2013年的格式，已经过去了10年了，在这十年以来，硬件和层面都发生了巨大的变化
- 持久存储器的性能提高了几个数量级
- data lake兴起，云存储兴起，在云存储中高宽带，高延迟
- 软件方面学术界提出了很多新的轻量级的压缩方案以及索引和过滤技术

除此之外，作者发现已有的存储格式的研究主要集中在
- 测量基于Hadoop的查询引擎的端到端的性能，所谓的端到端，是从发出SQL查询，到查询引擎调度，读取数据，数据处理，最终返回结果这一整个流程的耗时，作者提出这种方法混合了多个因素，比如引擎优化的差异，网络延迟等等；
- 这些研究没有对列存储格式的设计决策进行深入的分析和权衡；
- 使用了不符合真实世界的数据集，在之前的研究中，大多数使用的都是人工合成的工作负载，没有考虑到真实世界的数据倾斜，所谓数据倾斜就是世界上产生的数据不是均匀分布的，而是出现倾斜的，比如说有90%的商品属于食品类的商品

所以作者提出这篇paper的主要任务是: 分析常见的列存储文件格式，保留优点，改进缺点，并为下一代存储设计提供思路
- 使用真实的数据集
- 对Parquet和ORC的主要组成部分进行了全面的分析
	- Encoding(编码方式)
	- Block Compression(块压缩)
	- Metadata Organization(元数据组织)
	- Indexing and Filtering(索引与过滤)
	- Nested Data Modeling(嵌套数据建模)
- 如何高效地支持常见的机器学习工作负载  --  对GPU是否友好

研究结果发现
- Finding 1:
	- Parquet的文件大小占优势：原因是its aggressive dictionary encoding，换句话说就是Parquet的字典编码更激进，就是说重复次数稍微多一点就用字典编码
	- Parquet的列解码更快 -- 因为Parquet具有更简单的整数编码算法
	- ORC在selection pruning(选择性修剪)方面更有效 -- 因为ORC的zone map具有更细的粒度 -- zone map是什么？ -- 一种索引结构，记录每一块数据的某一列的最大值和最小值，比如谓词搜索范围是x>500，而某个zone的最大值是300，就可以直接跳过这个区域
- Finding 2: 现实世界的数据集中，大多数列具有较小的唯一值 -- 换句话说其实就好比有好多条数据，但是选项就这个几个，比如就几十个省份，就这么多科目 -- 这是非常适合使用字典压缩的 -- 就好比男用1 女用0差不多 -- 所以说压缩，字典编码 的算法的效率 就是关键
- Finding 3: 使用更快的解码方案来降低计算成本与追求更积极的压缩来节省IO更好 -- 一定要用压缩，但是要做好一个取舍 要好解码 这比压缩率更高更重要  -- 这其实也是 现在计算比存储的一个思想 在Finding4中其实也提到了
- Finding 4: Parqet和ORC的辅助结构太简陋，比如zone Map和Bloom Filter等…… 其实这在CMU15445中都提到过，不管是Zone Map还是Bloom Filter -- 这其实也是空间换时间的一个思想，again，现在计算比存储更看中
- Finding 5: 当前格式对机器学习负载支持不好 -- 常见的ML负载其实包括
	- 训练阶段的高维特征访问 -- 效果不佳
	- 向量检索中的Top-k相似性搜索(向量点积或余弦相似度) -- 效率低
	- GPU加速训练 -- 当前格式并行单元太少 无法充分利用GPU


### Background and Related Work
2010年初，随着大数据生态兴起，出现了一批开源文件格式
最早出现的是Apache Hadoop的两款row-oriented formats, SequenceFile和Avro. SequenceFile是以键值对的形式组织数据；Avro是一种基于Json schema的数据格式
但同时出现了好多column-oriented的数据库系统，比如C-Store(MIT的列存储数据库原型), MonetDB, VectorWise... 
2011年，Facebook/Meta发布了首个开源列式存储格式 -- RCFile，是一种列式存储和行式存储的折中 -- 先按行分区 每个分区再按列存储
2013年，Meta在RCFile的基础上做了改进，参考了PAX模型，推出了ORC文件格式 -- PAX是一种混合存储模式；同年，Twitter和Cloudera联合发布了Parquet. Parquet参考了PAX模型和Dremel的record-shredding and assembly算法，Dremel是Google提出的一种超大规模分析平台，可以支持嵌套字段（比如嵌套Json）压缩展开
之后，Parquet和ORC都被列入Apache基金会顶级项目，变成了当时主流的标准。目前主流的数据处理平台入Hive, Presto, Trino, Spark都是基于Parquet和ORC的，甚至有自己格式的数据库如Google BigQuery, Amazon RedShift, Snowflake也都支持
其实华为也有一种列存储格式叫CarbonData，但是与Spark集成的太过密集，很多研究在测试的时候都没把他作为一种通用的文件格式来测试，因为他比较受限于Spark；但是新的研究发现确实是不如Parquet和ORC.
另外，随着发展，各个科技公司开发了专用于自己的列存储格式，其实这是发展的必然趋势，这种趋势在计算机体系结构课程[[Computer Architecture/ETH Zurich 苏黎世联邦理工学院 Digital Design and Computer Architecture/lecture 01 Introduction and Basics\|lecture 01 Introduction and Basics]]中也提到过，Tesla为自己的自动驾驶设计了专门的芯片，指令集，系统等等，为的就是完全高效利用
- Capactior是Google内部使用的一种列式存储格式，用于BigQuery和Napa等多个系统
- Youtube针对其评论，视频源数据等结构复杂的数据设计了Artus，用于Youtube的Procella分布式数据库
- Alpha是Meta推出的格式 -- 专为机器学习训练设计

Arrow是一种列式的内存格式，他的主要思想是在内存中进行列式存储，不需要序列化或者反序列化，对于Parquet和ORC来说他们更像是压紧了，而且这个压缩是按块压缩的，所以拿到内存中是解压缩然后哪里面的数据，而对于Arrow来说，本来就在内存中按列存储好了的，更像是一种传输格式，并不是长期磁盘存储设计的格式，所以这篇paper并没有评估Arrow
然后文中提到了最近的Lakehouse趋势，只是加了层 不改变存储格式，lakehouse基本的架构已经很熟悉了 详见[[DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 01 paper-1： Lakehouse： A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics(M.Armbrust, et al., CIDR 2021)\|Lecture 01 paper-1： Lakehouse： A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics(M.Armbrust, et al., CIDR 2021)]]
在高性能计算HPC中，还有一类专门的科学数据存储格式，比如HDF5, BP5, NetCDF, Zarr等广泛应用于科学模拟，气候建模，基因组等领域，主要是针对复杂数据，可能是多层次组织之类的数据，通常是多维数组存储，而不是按列示存储，不支持列示存储特性，所以数据库很少使用
