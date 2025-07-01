---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 01 paper-1： Lakehouse： A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics(M.Armbrust, et al., CIDR 2021)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-06-28T16:34:33.903+08:00","updated":"2025-07-01T15:34:45.627+08:00"}
---

![[armbrust-cidr21.pdf]]

这篇论文认为，我们目前的传统数据仓库架构将会被一种新的架构模式——Lakehouse所取代，并且论述了Lakehouse的创新点和如何影响数据库管理领域的，最终通过TPC-DS测试(这是评估数据仓库查询性能的标准测试) 结果说明其能与当前流行的主流云数据库想媲美。
在文章的abstract部分，其实就已经很明了的说明了Lakehouse的三个核心特征
- 基于开放的、可直接访问的数据格式。如Apache Requet. Apache Parquet 是一种专为高效存储和处理大规模数据而设计的开源列式存储格式，广泛应用于大数据系统（如 Spark、Hive、Presto、Trino、Snowflake、Lakehouse 等），在CMU15445中我们也学习过列存储的压缩，效率比较高。
- 支持机器学习和数据科学
- 具有先进的性能表现

Lakehouse可以解决传统数据库存在的一些关键问题，换句话说就是传统数据库的缺点，以及Lakehouse的优点
- data staleness(数据陈旧)
- reliability(可靠性)
- total cost ofownership(TCO, 拥有成本高)
- data lock-in(数据锁定)
- limited use-case support(应用场景有限)

至于什么是传统的数据库，上面的这五个名词到底是什么意思，在文章的后面一一都进行了介绍。


**第一代数据分析平台 (first generation data analytics platforms)**
首先这是data warehousing哈，不是数据库
- 目的: DSS(决策支持), BI(商业智能)，换句话说, 就是帮助企业做决策
- 做法: collecting data from operational databases into centralized warehouses. 从各个业务操作形数据库中收集数据，统一存储到集中式的数据仓库中。 所谓的operational databases就是我们平时说的这些企业中用的数据库，比如说订单，库存等等.
- 优点: 第一代数据仓库使用的是schema-on-write的方式 -- 写入之前就预先定义好数据的结构，当然这样可以让后续的BI分析更加高效，因为在插入的时候就已经经过了清洗 转换 符合业务的要求, 这也算是一个优点吧我感觉
- 挑战: 第一代数据仓库面临着两个大的问题: 计算资源和存储资源绑定, 不支持非结构化数据
	- 计算和存储绑定: 通常企业都是在内部部署数据仓库，自己买服务器等等(我之前也见过), 这就有两个问题，其一是随着时间的增长，数据会不断增长(当然我感觉企业会选择删除嘛？但重要的肯定不会啊), 其二是必须应对用户访问高峰，也就是哪怕平时有部分资源是闲置的，也要一直付费  -> 成本高 资源利用率低
	- 不支持非结构化数据, 传统的数据库处理的内容都是数字，字符串，日期等等，但现代业务中很多PDF文档，图像，语音等等就显得无能为力了。

**第二代数据分析平台(second generation data analytics platforms)**
第二代数据分析平台将原始数据存入了Data Lake(数据湖).
数据湖是一种较低成本的存储系统, 通过file API来管理数据，使用的也是前面所提到的通用的开放的文件格式Apache Parquest, 这里还提到了一种叫ORC, 这两种都是列式存储格式，非常适合大数据分析
最早是从Apache Hadoop开始的，采用的是Hadoop的分布式文件系统(HDFS)，后文也会提到，这是一种本地的分布式文件系统, 这里的主要思想就是，不在乎数据是什么，先存进去再说
schema-on-read架构，这与第一代仓库使用的schema-on-write架构不同，schema-on-read架构是读取数据时才解析结构，好处就是灵活低成本存储任何数据(包括非结构化), 坏处就是数据质量，数据处理，数据治理的问题还得给后面的环节。
具体的做法就是一小部分数据会从Data Lake中扔进(ETLed)下游的数据仓库中, 在这里文中举了一个例子是是Teradata.  
首先ELTed是什么？  -- Extract(提取) - Transform(转换) - Load(加载)
我查了一下Teradata，其实Teradata是第一代数据分析平台的代表作之一，所以说第二代数据分析平台最终还是ELT进传统仓库，才能被BI工具使用
但是 数据湖中的数据可以被机器学习平台等各种分析引擎直接访问

**could data lacks**
2015年开始，从本地Hadoop(HDFS)像云端迁移, 出现了一种更主流的架构two-tier architecture(数据湖+数据仓库的两层架构)
选择云存储的好处在于
- 数据持久性
- 地理复制: 在多个数据中心备份
- 成本低

但其余架构和第二代数据平台完全相同
事实证明，这是现在最主流的架构，几乎所有的世界前五百强企业都在用

**The Challenges of two-tier architecture**
虽然当前主流数据架构看上去很便宜，但是问题是他多了一个步骤(先ELT到data lack，在ELT到data warehouse)，这会导致复杂，延迟，多了一个可能出错的环节的问题。除此之外，事实证明，对于机器学习等高级分析来说，data lake和data warehouse都不是理想的解决方案
现在的主流的two-tier architecture有下面的问题(这也是不是理想方案的原因):
- Reliability(可靠性差): 在data lack 和 data warehouse 中ELT，导致数据可能不会完全一致
- Data staleness(数据不新鲜): 这是延迟导致的，这个延迟可能长达数天，并且原文引用了数据做为依据
- Limited support for advanced analytics(难以支持高级分析). 这里的核心问题是企业希望仓库数据进行机器学习，用来预测一些东西。但是传统仓库不支持直接建模。那么现在其实就有两种选择：
	- 其一是把数据导出为文件，比如CSV，再交给ML系统处理，那就又多了一步ETL
	- 其二是直接对data lake进行分析 就失去了仓库的优势功能
- total cost of ownership(总拥有成本高): 用户要付两份钱，一份是data lake中的数据，一份是复制到warehouse中的数据；除此之外，ETL的成本也是一个问题。商业数据库的专有格式的数据锁定导致了迁移也会耗费巨大的成本。

**straw-man solution**
文中还提到了一种稻草人式的解决方案，主要思想是完全去掉数据湖，把所有的数据存进一个”存算分离”的现代化数据仓库。
所谓的稻草人的意思就是看起来能解决问题，但实际缺不太可行的方案
文中给出了不太可行的原因
- 还是无法很好的管理非结构化数据
- 无法提供快速直接的数据访问能力

所以，最终引出了this paper所提出来的architecture -- Lakehouse

In this paper, we discuss the following technical question:  
is it possible to turn data lakes based on standard open data formats, such as Parquet and ORC, into high-performance systems that can provide both the performance and management features of data warehouses and fast, direct I/O from advanced analytics workloads?
核心的问题就是，基于开放格式的数据湖，改造一种高性能系统，使其具备数据仓库的性能和管理能力，又满足高级分析任务的快速IO要求
换句话说就是，拥有
- 数据仓库的能力(ACID, 高性能查询)
- 数据湖的能力(结构化，非结构化数据，便宜)
- 机器学习 数据科学的能力(快速，直接读写原始数据)


![Pasted image 20250701105420.png](/img/user/accessory/Pasted%20image%2020250701105420.png)


文章中说认为Lakehouse的时机成熟，并且列举了三个原因来解释为什么现在是Lakehouse架构发展的最佳时机，其实这也对应了本文中心思想的第一句，是说 认为目前的传统数据仓库架构将会被一种新的架构模式——Lakehouse所取代这个观点。
**Reason 1: Reliable data management on data lakes**
传统data lake的问题：管理"文件堆" --> 所以缺乏数据仓库具备的高级功能(如事务管理，回滚， 零克隆拷贝)
新技术Delta Lake & Apache Iceberg的出现: 给Parquet/ORC加了事务层和元数据管理 -> data lake 具备了像数据仓库一样的写入原子性等等 -> in other words, data lake 像 仓库一样可靠了
所以说带来的改进就是 lakehouse中的ETL步骤会变少，因为分析人员可以直接, 轻松访问data lake中的原始表
**Reason 2: Support for machine learning and data science**
首先一点，由于机器学习系统本身就支持直接读取Parquet, ORC等数据湖中的开放格式，所以Lakehouse天然就适合机器学习。
此外，现在多数系统采用DataFrame作为操作数据的抽象，通过声名性DataFrame API，可以在ML工作负载中执行数据访问的查询优化。也就是说，Lakehouse可以将SQL优化能力带给ML，使得训练更快
**Reason 3: SQL performance**
传统仓库 vs. Lakehouse
- 传统数据仓库(Redshift, Snowflake)内部是专有格式，意味着可以彻底优化底层
- Lakehouse用的是开放格式(Parquet, ORC)，劣势

文章提到的Solution是可以通过一系列优化技术
- 维护辅助数据
- 改进文件布局和分区策略

来大大提升在Rarquet/ORC上的SQL查询性能

但是文章到目前为止还没有说是哪些优化技术
除此之外，我觉得辅助数据 可能是一些索引，或者聚合函数所要用的哪些统计信息等等，以及一些元数据