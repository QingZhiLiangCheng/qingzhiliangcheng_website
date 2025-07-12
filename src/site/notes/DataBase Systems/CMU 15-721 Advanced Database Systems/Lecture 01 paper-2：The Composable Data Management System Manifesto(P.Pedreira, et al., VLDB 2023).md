---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 01 paper-2：The Composable Data Management System Manifesto(P.Pedreira, et al., VLDB 2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-04T18:29:16.749+08:00","updated":"2025-07-12T11:52:04.530+08:00"}
---



![[p2679-pedreira.pdf]]


### Abstrct
背景/问题: 数据管理系统DMS不断专业化，细分化，但是软件开发方式(其实指的是数据系统的开发方式)并没有跟上专业话的速度。
带来的后果 文章中叫做solid landscape(信息孤岛), 具体来说就是 每个系统都作为一个整体在维护，文章中称为monoliths(单体架构), 无法复用. 
对于开发者来说就是 重复造轮子，每个团队都需要从头开发，从存储层，调度器，执行器，优化器……自己写，其实我觉得说的有点严重，其实我知道的在CMU15445是有提到过写个数据库可以从Postgres或者别的什么数据库开始写的，但是其实文章想突出的就是，孤立是说我从Postgres开始写的数据库里面的东西，别的数据库作为基地开发的数据库就用不了
而对于用户来说，面临着好多种不兼容的SQL, NoSQL方言，每个系统的API, 功能, 语义不相同，都要重复学
所以这篇文章的核心观点就是呼吁大家 统一起来，将DBS分解成可复用，模块化的components(组件), 换句话说就是，他想达到的最终的效果是，对于开发者来说 每个模块专注好一个事情，可以用DuckDB的执行器+Velox的执行计划+Arrow的内存格式，对于user来说，只需要记好一套标准就好
当然文章在Abstract一开始提了一嘴 很多公司的开源项目最近已经开始在不同层面推动模块化
我查了一下，结果如下

|模块功能|开源项目|作用|
|---|---|---|
|内存格式|Apache Arrow|统一列式内存表示|
|查询表示|Substrait|统一逻辑计划格式|
|执行引擎|Velox、DataFusion、Acero|可嵌入式、高效的执行器|
|存储层|Parquet、Delta Lake、Iceberg|标准化数据文件格式|
|编排|Arrow Flight、LakeSoul|数据通信协议、Lakehouse|

### Introduce
由于one size does not fit all的理念，出现了大量专用的数据库，每种数据库只适用于一种workload(工作负载)
但文中提到虽然工作负载，需求，运行环境发生了巨大的改变，但是我们开发数据库的方式没有改变，仍然是垂直整合的大型单体系统（monoliths），也就是说，每个系统都是从头到尾开发的
但是问题是每一个数据库系统其实核心结构都是类似的，文章总结了下面的通用逻辑组件
- a language fontend(语言前端): 将用户输入解释为内部格式
- an intermediate representation(IR, 中间表示): 通常是逻辑查询计划或者是物理查询计划, 用于表示查询的结构
- a query optimizer(查询优化器): 将原始的查询计划变换为更高效的形式
- an execution engine(执行引擎)
- an execution runtime(运行环境)

除此之外，文章也提到不仅逻辑相似，实现这些组件所用的数据结构和算法也大同小异
比如
- 操作型数据库的SQL前端和数据仓库的SQL前端基本一样。
- 传统列式数据库的表达式求值引擎和流处理引擎的求值引擎差异不大。
- 各种数据库中对字符串、日期、数组、JSON 的处理函数也都非常相似。

作者认为，是时候进行paradigm shift(范式转换)了
文中设想将数据库系统拆解为更模块化，可复用的modular stack(组件栈), 可以
- 加快新系统开发速度
- 降低维护成本
- 给用户提供统一体验
- 通过明确模块之间的 API 接口、职责划分，数据库软件将更容易适配新的底层硬件（如 GPU、TPU、FPGA、NPU 等新型加速器），跟上硬件演进
- 特别是对于执行引擎和语言前端来说，不管是transactional systems(事务处理系统), analytic systems(分析型系统), stream processing(流处理系统), machine learning workloads(机器学习系统) 都能提供一致的用户体验和语义

**Why Now？**
- 云计算的普及和计算与存储的分离 -- 后面这个计算与存储分离实际上就是Paper1提到的Lakehouse的架构
- 由于计算和存储分离，所以只需要关注于计算，所以厂商更加注重服务的交付，这个时候很多开源大数据技术和开放的标准应运而生
	- Apache Arrow: 统一内存数据表示; ORC/Parquet: 列式存储格式; Hudi/ Iceberg: 表格数据的增量更新和版本管理
- Velox, Substrait, Ibis这些项目的发展, 这些项目的特点是可以复用已有组件

**Contributions**
- 强调可组合性的重要性，并认为现在就是推动范式转变的最佳时机
-  总结现有的项目, 重要性/影响, 未来需要改进的地方
- 提出了一个新的可组合数据系统的参考架构，并重点讨论了其中尚未受到足够关注、但对实现模块化和复用至关重要的部分。同时，指出了尚未解决的问题和需要深入研究的方向。

### Composability in Data Management
**什么是可组合性？**
将复杂的系统分成一组组相对独立的小组件，目标让每个组件都能独立工作, 独立开发, 复用, 测试
在开发组件过程中，要尽量把复杂细节藏在内部 , 窄接口

**可组合性的好处**
- Engineering Efficiency(工程效率提高)
	- 不再重复造轮子
	- 开发更专注
- Faster innovation(加速创新)
	- 大公司: 代码基数小, 减少维护负担，专注新特性
	- 小公司: not need to be re-developed, decreases time-to-make.
- Coevolution(软硬件协同进化)
	- 当前碎片化严重，硬件厂商很难统一支持数据库加速, 也不赚钱
	- 如果统一使用一个“物理层” 就能开发专用芯片
- Better user experience

**实现可组合性面临的挑战**
- Learning curve(学习曲线): 很多库或框架学习成本高
- Developer bias(开发者偏见): 倾向自己写，不愿意读别人的
- Time-to-market fallacy: 认为自己写个原型就能快速上线
- Close fit(组件不完全适配)

### A Modular Data Stack
推动 "模块化数据栈"架构: 这个架构中语言组件和执行组件更解耦
![Pasted image 20250711161247.png|500](/img/user/accessory/Pasted%20image%2020250711161247.png)
语言组件负责生成IR, SQL, Non-SQL都会通过语言组件转换为IR(中间形式), 而且这个过程是与语言无关，与系统无关的。
生成的IR进入Query Optimizer, Optimizer使用通用框架生成IR fragments(IR片段, 每个IR片段都是可执行的), 这些片段可以独立调度执行
Execution(执行引擎) 处理IR片段, 提高通用且高效的storage primitives(存储原语)，如列式格式、行式格式、索引、扫描等
excution runtime负责协调整个系统: 包括 作业部署, 状态监控, 故障处理, 资源管理, 分布式调度

作者的主张是
- 几乎所有的数据系统都可以映射为这种架构，即使某些系统确实某些组件，但整体结构仍然成立
- 不同系统之间的相似性远大于差异性

后面paper中陆续介绍了每部分的现状，主流开源项目，以及如何适配这个模块化数据栈的架构

### Language Frontend
前端是最容易实现模块化的部分，输入输出明确，接口简单清晰
目前开源的项目: GoogleSQL -> ZetaSQL, CoreSQL,以及DuckDB复用PostgresSQL的parser，这些项目本质上都使用了C/C++实现的parser(语法分析器)和analyzer(语义分析器)，使用了Flex, Bison, ANTLR等工具来构建，都说明开源系统之间共享parser的做法可行。
此过程通常需要实现用于表、列和函数签名解析（用于类型绑定）的API, 类型绑定(type binding), 其实对于Binder, 在CMU15445中就学过，其实就是将词语绑定在数据库实体上，这些实体可能体现为各种C++类, 在这个过程中，对于`SELECT name FROM user WHERE age>30;`中，系统要知道user表有没有name和age列，age>30是否类型匹配……
除了词法分析(tokenization)，语法分析(parsing)，类型绑定(type binding)，mordern language frontend还需要支持一下功能
- Semantic Types(语义类型)
- Type-checkd Macros(带类型检查的宏)
- IDE Interoperability(IDE互操作性)
- Non-SQL

#### Semantic Types
传统的数据库的类型如常见的Int, Varchar, Date都是结构层面的数据类型，只要数据类型兼容就会被运行，因为传统的数据库无法知道这些字段的业务含义，而Semantic Types就是数据所负担的语义或者说是业务含义，可以一些不必要的麻烦
**Ability1: 避免不同语义的数据类型错误比较**
```SQL
-- 假设 UserID 和 DeviceID 都是 INT 类型
SELECT * FROM logs WHERE UserID = DeviceID;
```
这个SQL语句的UserID和DeviceID都是int类型，那么这句话在传统数据库中语法是正确的，类型绑定也正确，所以会执行并返回结果
但事实上语义上是错误的，没有比较意义，有了Semantic Types, language frontend就能识别这种语义冲突，在编译器/编写时直接报错或者发出警告, 避免逻辑漏洞
**Ability2: 单位不一致导致的错误操作**
```SQL
-- timestamp_ms: 毫秒
-- timestamp_sec: 秒
SELECT * FROM events WHERE timestamp_ms = timestamp_sec;
```
对于这两个字段都是BIGINT类型，但事实上我们知道一个表示的毫秒一个表示的是秒，加入Semantic Types, Language Frontend的静态检查就会提醒事实上这两个字段的含义表示的单位是不同的

#### Type Checked Macros
在现代数据库中如BigQuery, Snowflake, Redshift，SQL查询往往非常庞大，特别实在多表连接(join), 多层子查询(nested subqueries), 复杂条件, 多步骤ETL或数据建模中.... 而Language Frontend的一个高级功能是SQL Macro(SQL 宏), 是一种对大SQL查询的一种静态抽象机制
SQL宏有点类似于C/C++中的`#define`，可以定义一些复杂的重复片段，抽象出来，像模块一样复用，最终会在IR阶段展开称为完整的SQL

#### IDE Interoperability
language frontend暴露API给IDE使用，IDE插件开发者就能做出更智能的SQL编辑体验，实现Syntax Highlighting(语法高亮), Token Prediction(预测), Static Type Checking(检查), Autocompletion(自动补全), 而实现这些功能的背后 就是parser和analyzer的预测然后通过API传递，以营造出了IDE和数据库使用的是一个language frontend，在IDE中看到的提示，错误，补全和数据库运行时一致
其中，ZetaSQL就被用在Google BigQuery中，提供只能编辑功能

#### Non-SQL APIs
SQL是一种声明式语言，适合表达要什么，而不是怎么做，所以在机器学习，数据处理等语言或者程序中，SQL并不友好，这其实也是Paper1 Lakehouse所提到的一个问题
其实很大的一个问题是可能是要拼接字符串，我之前写代码就拼接过字符串，其实很麻烦 而且还会出一些问题 比如SQL注入的问题
为了避免拼接SQL字符串，人们设计了DataFrame类似的API(如Pandas, Spark DataFrame, dplyr等, 其实我觉着Springboot中的Mybtis Plus的那种形式也算吧), 通过另一种方法来表示相同的意思和计算
```python
# SQL
SELECT name FROM users WHERE age > 30;

# DataFrame
users.where("age > 30").select("name")
```
但是现在市面上的Non-SQL APIs有个问题是不兼容，而下面的数据库的方言, 接口 也不同

Ibis这个项目的做法是讲Pandas/ DataFrame风格代码翻译成SQL，但作者认为这种中间人的架构并不是好的解决方案。
好的解决方案是采用统一的IR驱动架构，Spark将SparkSQL和DataFrame(PySpark)都能转换成同一个IR，然后将IR直接传入执行引擎，而执行引擎不需要考虑来源
所以未来ORM(Object-Relational Mapping, 对象映射关系)是否能够绕过SQL，直接转为IR，还是一个需要探索的问题 -- 这个问题的思考方法是这样的现在的ORM是将对象/类自动转换为SQL，然后调用数据库，说白了本质上就是SQL的生成器+封装器，未来执行引擎都只吃统一的 IR，那 ORM / 框架不必再输出 SQL，而可以直接输出 IR, 那么其实ORM框架也会变成一种语言前端

### Intermediate Representation
