---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 02 Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-12T11:54:58.043+08:00","updated":"2025-07-28T17:06:52.406+08:00"}
---



![[Lecture-02-Paper-1：An Empirical Evaluation of Columnar Storage Formats (X. Zeng, et al., VLDB 2023).pdf]]

这是2023年的一篇论文，这篇论文是Andy老师写的唉 Andy老师的全称叫Andrew Pavlo，这是他在学术和正式出版物中的署名，Andy是Andrew的常见昵称，在教学、演讲、网站、社交媒体等更轻松的场合，他经常用的是 Andy Pavlo.
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

### Feature Taxonomy
在这一节，会介绍Parquet和ORC的一些特征，对于每个特征，都会介绍Parquet和ORC的共同设计，然后介绍直接的差异
![Pasted image 20250728132943.png](/img/user/accessory/Pasted%20image%2020250728132943.png)
但是值得注意的一个点是，我们论文中的说法可能会跟Parquet和ORC的一些说法不同，但本质上是一样的
![Pasted image 20250728133525.png](/img/user/accessory/Pasted%20image%2020250728133525.png)
比如对于论文中Row Group，在Parquet和ORC中的叫法不同，但本质上都是一种将tuple先按行分配再按列分配，而那个按行分配 就是分成了 行组 Row Group
包括对于Zone Map，Parquet和ORC中的叫法和实现方法也是有差别的，但本质上最后的效果是一个东西

> [!tip] Feeling
> 另外，这里我多说一嘴，在3.1的时候，其实是提到了PAX格式，vectorized query processing(向量化查询处理) ，包括一直在提的zone map，现在看的时候都会记起来在CMU15445中都学过，啊啊啊啊啊啊啊 就很奇妙的感觉  我以为我把学了的东西都还给Andy老师了 但是碰到的时候我却知道
> 

Parquet和ORC的示意图
![Pasted image 20250728134652.png](/img/user/accessory/Pasted%20image%2020250728134652.png)

#### Format Layout
首先，Parquet和ORC都使用的PAX(Partition Attributes Across)格式, 这是一种混合存储格式，结合了行存储和列存储的优点，其实这在CMU15445的基础课程中学过[[DataBase Systems/CMU 15-445：Database Systems/Lecture 05 Storage Models & Compression#storage models\|Lecture 05 Storage Models & Compression#storage models]]，当时学的时候是介绍到了行存储(N-array Storage Model(NSM), row storage), 纯列存储(Decomposition Storage Model(DSM), column storage), 以及Hybrid Storage Model: Partition Attributes Across(PAX)，而且当时Andy老实说过说现在所说的列存储都是指的第三种PAX，而且还举到了Parquet和ORC的例子，只不过当时我不知道这是啥
总之，这里的核心思想是行存储和列存储的一种结合，表首先被划分为多个行组(row group), 每组包含多各行，然后在row group内部按列划分，形成了列块(column chunk).
这样的结构的优点在于不会向行存储那样引入额外的无用数据，因为有meta-data会标记每个列数据的偏移量，也不会像纯列存储那样数据不相邻。
而且PAX格式很适合vectorized query processing(向量化查询处理)，所谓的vectorized query processing, 其实就是数据在语法树中的传输是成批成批流动的，这种方式在[[DataBase Systems/CMU 15-445：Database Systems/Lecture 12 Query Execution Part 1\|Lecture 12 Query Execution Part 1]]中提到过，当时提到了Iterator Model, Materialization Models以及Vectorization Model. Iteractor Model的核心思想是一行一行的流，Materialization Models的思想是一整个表扔进去，而Vectorization Model是行组行组的那样
对于Parquet和ORC来说，都会对每个块先做lightweight encoding(轻量级编码), 在使用general-purpose block compression algorithms(通用块压缩算法)进行处理. 对于Encoding的处理，其实在[[DataBase Systems/CMU 15-445：Database Systems/Lecture 05 Storage Models & Compression#column-level\|Lecture 05 Storage Models & Compression#column-level]]中提到过一些方法，比如run-length encoding, bit-packing encoding, bitmap encoding, delta encoding, incremental encoding, dictionary encoding... 论文中前面是一直在提dictionary encoding. 在做完encoding之后，会进行compression, 以减少磁盘使用
Parquet和ORC的文件入口都是footer，这里说的是整个文件好多个Row Group外的footer, footer中会存很多meta-data(元数据)，包括表模式(table schema)(其实这个我们在CMU15445的Project中体会过), tuple count, row group meta-data, 每个column chunk的偏移量，以及zone maps for each column chunk等等，能看到图中Parquet和ORC的结构是不太一样的。
按图上的说法，对于Parquet是所有的Row Group外有一个footer，footer里面存了整个文件的metadata(比如table schema，row group的offset)同时在这里面还存了每个Row Group的metadata，然后每个Row Group中存放这每个column chunk的metadata，比如说offset, zone maps等等，这里的核心关键在于它是存在一起了
![Pasted image 20250728152257.png|500](/img/user/accessory/Pasted%20image%2020250728152257.png)
而ORC是有总的footer，但是每个column chunk的metadata是存在了对应的row group中
![Pasted image 20250728152534.png|500](/img/user/accessory/Pasted%20image%2020250728152534.png)

zone maps在这里已经不算是第一次提到了，zone map在[[DataBase Systems/CMU 15-445：Database Systems/Lecture 12 Query Execution Part 1\|Lecture 12 Query Execution Part 1]]中提到过
![Pasted image 20250327133943.png|500](/img/user/accessory/Pasted%20image%2020250327133943.png)
本质上就是会整合一些信息，来达到可以跳过这个column chunk的效果
Difference 1: Row Group大小的定义不同 -- Parquet按行数来定义row group的大小，比如论文中提到的例子是1M行一个row group；而ORC是使用固定的物理存储大小来定义row group，比如64MB作为一个row group -- Parquet的想法是保证行数进而保证vectorized query processing,但是如果一个表的属性特别多的话，这个row group的内存占用的会很大；而ORC的想法是保证内存的使用，但可能会因为表的属性多而导致条目不足
Difference 2: 压缩单元与zone mao的映射不同 -- Parquet是压缩单元和zone map单位是对应的，但ORC的压缩单元和zone map是独立设计  -- ORC能更灵活的单独控制压缩效果，但是可能值会跨边界

#### Encoding
首先lightweight compression是为了减少磁盘占用和降低网络传输成本
Parquet和ORC都支持Dictionary Encoding, Run-Lengh Encoding, Bitpacking
默认情况下，Parquet对每一列都积极的应用Dictionary Encoding,而不关注数据类型，而ORC只对字符串应用
Parquet对整数进行Dictionary Encoding的好处是可以将大值压缩，比如一个整数类型好多位100000000这样，且出现次数很多，通过Dictionary Encoding就会变成一个小的数；但是造成的结果是，可能会影响到Delta Encoding和Frame-of-Reference Encoding(POR)的第二次压缩
这里提到了Delta Encoding和POR, Dleta Encoding在[[DataBase Systems/CMU 15-445：Database Systems/Lecture 05 Storage Models & Compression#delta encoding\|Lecture 05 Storage Models & Compression#delta encoding]]中提到了，如下图
![Pasted image 20250206153946.png](/img/user/accessory/Pasted%20image%2020250206153946.png)
Dleta Encoding本质上是一种数据关系的差值，是一种相邻元素的差值，而POR是一种对于基准值（基准值是选出来的，对于异常特殊的值，比如说很大的值会单独存储）的差值，但本质上都是一种数据关系，而通过Dictionary Encoding可能会损失这种数据关系原来是连续递增 `[100, 101, 102, 103]`，编码后变成 `[2, 0, 3, 1]`，就没法通过Delta Encoidng和POR进行压缩了，所以说Parquet只能通过Bitpacking和RLE来进一步压缩Dictionary Encoding后的数据
Parquet和ORC对Dictionary Encoding存在着不同的策略，因为字典的建立需要占据一定的空间，所以Parquet和ORC都设置了一定的临界点。对于Parquet来说，他的核心是在于限制字典的总大小不能超过1MB（默认）如果NDV(number of different value)高，说明数据分散，如果建出来的字典大小超过1MB就会放弃；而ORC的策略是通过判断NDV Ratio，所谓的NDV Ratio是NDV与总行数的比值，如果不同的值占比太高，比如ORC的默认阈值可能是0.8，那就不适用字典压缩
刚刚上面提到了，Parquet由于对整数也采用了Dictionary Encoding，所以二次压缩只能采用RLE和Bitpacking，那选择哪一种呢？ Parquet采取的方式是比较重复次数是否超过8次，如果超过8次，就是用RLE，但是值得注意的是，作者在论文中说他们发现这个8是个硬编码，也就意味着并不可调，说明这可能是他们找到的最优的数值了
而ORC不同于Parquet，他没有对整数采用Dictionary Encoding, 所以他对整数的编码存在着四种方式，RLE, Bitpacking, Delta Encoding, POR. 在ORC中是存在一种规则驱动的贪心算法来决定在不同子序列中的最优压缩方式，规则是这样的
从序列的开始，使用一个最大值为512的look-ahead buffer(前瞻缓冲区)用来判断这段子序列使用何种方式
- 如果子序列中存在3-10个重复值，使用RLE
- 如果连续相同的值超过10个，或者值是单调递增递减，就是用Delta Encoding
- 对于即不重复也不单调的，如果没有异常值就用bitpacking
- 其他的使用PFOR或者其变体

总结一下就是ORC的编码方式多样，且效果可能会更好，但是解码慢，因为是多种编码混合使用的，需要先去找元数据查看这一段子序列是何种编码方式

#### Compression
Parquet和ORC都支持block compression(块级压缩)，通用的块压缩算法的特点在于类型不可知，所以说直接就把数据当纯字节流压缩了
大多数块压缩算法包含配置“压缩级别”的参数，以在压缩比和压缩/解压缩速度之间进行权衡，Parquet是把这个调整旋钮暴露给用户了可以选择不同的粒度进行压缩，而ORC只有两个选项，一个是optimize for speed(快但是压缩率低)，optimize for compression(压得小但慢)
有一个很有意思的事情是作者最后发现在现代硬件下，列式存储使用block compression对查询性能的帮助不大，甚至可能变差。因为压缩的只是原始字节，而不是列内部结构，对于本来通过encoding就压缩的很好的数据，解压，解码就变成了两次工作，在后文作者证明了这个结论

#### Type System
Parquet只支持以小组primitive types，如INT32, FLOAT, BYTE_ARRAY, 其他类型比如INT8, DATE, TIMESTAMP都是映射到原始类型上实现的，比如INT8实际上可能就存储为INT32，这样的type system比较简单，统一，紧凑，而且可以统一在INT32上做一些很好的压缩
而ORC的做法是INT8, INT16, TIMESTAMP, BOOLEAN等都有自己专属的reader, writer, encoder, decoder全套的实现，有点是可以对特定的类型进行优化，但是这样实现比较臃肿，系统更复杂
两者在complex types都支持struct(比如Json), List, Map. 但是Parquet不支持Union但是ORC支持. Union允许同一列具有不同的类型，在动态schema或者数据不一致的环境下，可能有优点，比如我们的Json日志中其中有一个是event_value，在Parquet下可能一开始只是浮点数，但是后期可能还要保存或者想变成字符串，那么Parquet就需要手动更改schema，而ORC支持`Union<TypeA, TypeB>`
并且有研究表明，如果如果 Parquet 支持 `Union`，可以更好地优化其内部的 Dremel 模型(一种嵌套数据表示和解析方式)