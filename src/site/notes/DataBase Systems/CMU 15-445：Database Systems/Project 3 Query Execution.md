---
{"tags":["bustub","project","cmu15445"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Project 3 Query Execution/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-05-15T20:21:35.866+08:00","updated":"2025-05-16T15:55:20.812+08:00"}
---

### Overview
我写的时候感觉还挺难的这部分 涉及到的类比较多 而且不知道为什么要这样操作……
P在 Project 3 中，我们需要实现一系列 Executors(算子)，以及为 Optimizer 添加新功能
- Task1：Access Method Executors. 包含 SeqScan、Insert、Delete、IndexScan 四个算子。
- Task2：Aggregation and Join Executors. 包含 Aggregation、NestedLoopJoin、NestedIndexJoin 三个算子。
- Task3：Sort + Limit Executors and Top-N Optimization. 包含 Sort、Limit、TopN 三个算子，以及实现将 Sort + Limit 优化为 TopN 算子。
- Leaderboard Task：为 Optimizer 实现新的优化规则，包括 Hash Join、Join Reordering、Filter Push Down、Column Pruning 等等，让三条诡异的 sql 语句执行地越快越好。

也正是因为CMU课程组搭好了大部分的架子 所以我们要去阅读弄明白里面的结构和联系😭
此外 Bustub提供了Live Shell: [BusTub Shell](https://15445.courses.cs.cmu.edu/fall2023/bustub/)
#### 一条SQL语句的执行
![Pasted image 20250515212425.png](/img/user/accessory/Pasted%20image%2020250515212425.png)
![Pasted image 20250515203322.png](/img/user/accessory/Pasted%20image%2020250515203322.png)
上面分别是Lecture14中的图和官方文档提供的bustub的架构图
一条SQL语句的执行将经历五个模块: Parser, Binder, Planner, Optimizer, Executors
**Parser**
一条 sql 语句，首先经过 Parser 生成一棵抽象语法树 AST。生成的过程有点像编译器和编译原理（但是我现在还没有学过编译原理的知识。Parser不是数据库的核心部分，一般都采用第三方库。在chi写的文档中或者在bustub的源码中发现bustub采用了`libpg_query`库将sql语句parse为AST
**Binder**
简单来说，Binder的任务就是将AST中的词语绑定在数据库实体上。比如：
```sql
SELECT name From student;
```
其中SELECT和FROM是关键字，name和student是标识符。Binder遍历AST，将这些词语绑定到相应的实体上。在bustub中实体就体现为各种C++类。最终的结果是一颗bustub可以直接理解的树 叫bustub AST
![Pasted image 20250516075656.png](/img/user/accessory/Pasted%20image%2020250516075656.png)
Binder会在catalog里面查`__mock_table_1`的信息，将`__mock_table_1`绑定到具体的实体表上(`table_oid=0`)。与此同时，将 `select *` 中的 `*` 展开成可以查到的所有列。这就完成了整个 binding 的过程。
**Planner**
Planner 递归遍历 Binder 产生的 BusTub AST，产生一个初步的查询计划
![Pasted image 20250516082535.png](/img/user/accessory/Pasted%20image%2020250516082535.png)
其实生成的原理的查询计划是

其实使用了三个算子
- NestedLoopJoin算子
- Projection算子
- Seqscan算子

这里注意一个地方，我们在Lecture中学的其实是planner生成logical plan node，然后通过optimizer做多步优化产生physical plan node。但是 BusTub 只是个教学项目，所以我们只有 physical plan node. 比如说在上面这个例子中，planner直接join plan成了NestedLoopJoin.


**Optimizer**
对Planner生成的计划进行优化 生成优化后的最终查询计划
![Pasted image 20250515205205.png](/img/user/accessory/Pasted%20image%2020250515205205.png)
Optimizer 主要有两种实现方式
1. Rule-based. Optimizer 遍历初步查询计划，根据已经定义好的一系列规则，对 PlanNode 进行一系列的修改、聚合等操作。例如我们在 Task 3 中将要实现的，将 Limit + Sort 合并为 TopN。这种 Optimizer 不需要知道数据的具体内容，仅是根据预先定义好的规则修改 Plan Node。
2. Cost-based. 这种 Optimizer 首先需要读取数据，利用统计学模型来预测不同形式但结果等价的查询计划的 cost。最终选出 cost 最小的查询计划作为最终的查询计划。

Bustub 的 Optimizer 采用第一种实现方式
![Pasted image 20250516083326.png](/img/user/accessory/Pasted%20image%2020250516083326.png)
还是上面的例子，在经过Optimizer后，事实上将NestedLoopJoin在optimizer中改写成了HashJoin或者NestedIndexJoin. 对应的是哈希表和b+tree两种形式 在lecture中都讲过
**Executor**
在拿到 Optimizer 生成的具体的查询计划后，就可以生成真正执行查询计划的一系列算子了。算子也是我们在 Project 3 中需要实现的主要内容。生成算子的步骤很简单，遍历查询计划树，将树上的 PlanNode 替换成对应的 Executor.
算子的执行模型也大致分为三种 lecture中提到的
1. Iterator Model，或 Pipeline Model，或火山模型。每个算子都有 `Init()` 和 `Next()` 两个方法。`Init()` 对算子进行初始化工作。`Next()` 则是向下层算子请求下一条数据。当 `Next()` 返回 false 时，则代表下层算子已经没有剩余数据，迭代结束。可以看到，火山模型一次调用请求一条数据，占用内存较小，但函数调用开销大，特别是虚函数调用造成 cache miss 等问题。
2. Materialization Model 所有算子立即计算出所有结果并返回。和 Iterator Model 相反。这种模型的弊端显而易见，当数据量较大时，内存占用很高。但减少了函数调用的开销。比较适合查询数据量较小的 OLTP workloads。
3. Vectorization Model. 对上面两种模型的中和，一次调用返回一批数据。利于 SIMD 加速。目前比较先进的 OLAP 数据库都采用这种模型。
Bustub采用的是火山模型

此外，算子的执行方向也有两种:
4. Top-to-Bottom. 从根节点算子开始，不断地 pull 下层算子的数据。
5. Bottom-to-Top. 从叶子节点算子开始，向上层算子 push 自己的数据。
Bustub 采用 Top-to-Bottom
![Pasted image 20250322161802.png](/img/user/accessory/Pasted%20image%2020250322161802.png)

#### 整体结构
**Catlog**
BusTub有一个Catlog。Catlog提供了一系列API，例如CreateTable(), GetTable(), CreateIndex(), GetIndex()等等。Catlog事实上是两部分，一部分是维护了table的hashmap，保存了table id和table name到table info的映射关系, 其中table id是由Catlog在新建table时自动分配的, table name由用户指定。另一部分是维护了index的hashmap, 保存了index oid和table name, index name到index info的映射关系
为什么存了table和index： 因为我们操作记录的时候，比如说插入新记录，不仅需要将记录插入到表中，还需要将相应的索引条目插入到索引中
**Table Info**
table info中包含了一张table的metadata, 其中由schema, name, id和指向table heap的指针。系统的其他部分想要访问一张表的流程是要先使用name `auto GetTable(const string &table_name) const -> TableInfo *`或者id`auto GetTable(table_oid_t table_oid) const -> TableInfo *`从Catalog得到table info, 然后再访问table info中的table heap(table heap是管理table数据的结构，后面会提到)
其实一开始我不太理解schema是什么意思，看源码其实能看到 schema实际上就是Tuple中column的格式 表示这张表有哪几列
**Table Heap**
table heap是管理table数据的结构，包含 `InsertTuple()`、`MarkDelete()` 一系列 table 相关操作
其实看源码不难发现事实上table heap并不本身存储tuple的各种数据，tuple的数据存在了table page中，而table heap存储的是table page的page id, 其中包括first page id和last page id，并通过Project 1的buffer pool和Project 2中实现的PageGuard来操作的tuple。
**Table page**
table page是实际上存储table数据的结构 每一个tuple都由RID唯一标识，RID 由 page id + slot num 构成。tuple 由 value 组成，value 的个数和类型由 table info 中的 schema 指定。`Tuple(vector<Value> values, const Schema *schema);` 其中 value则存了内容本身和类型。虽然在构造函数中传入的是values和schema，但是最终是把这些内容变成了字节序列放到了`vector<char> data_`中
**Index Info**
在Catlog中 ，可以获取到一个表对应的所有IndexInfo，IndexInfo中包含着索引的信息，包括name, key schema, index oid, index, key size...  其中比较重要的是key schema是构建索引的列的结构， `index_` 是个智能指针，指向的是真正的索引Index类对象
**Index**
Index类实际上就是一个抽象类，提供了三个虚函数，在bustub中，我们的索引有两种，一种是hash index，一种是b+tree index。所以Index实际上有两个子类，一个是ExtendibleHashIndex, 一个是 BPlusTreeIndex. 在fall2023的课程中，我们用的是ExtendibleHashIndex，用的是我们Project2实现的可扩展哈希
**Executor**
executor 本身并不保存查询计划的信息，应该通过 executor 的成员 plan 来得知该如何进行本次计算，例如 SeqScanExecutor 需要向 SeqScanPlanNode 询问自己该扫描哪张表。
当执行器需要从表中获取数据时，如果查询计划中包含索引扫描操作，执行器会通过索引来快速定位数据。
- 执行器根据查询计划确定需要使用的索引。获取索引的元数据，包括索引键的模式和表列的映射关系。
- 根据查询条件和索引的元数据，构建索引键。这通常涉及到从查询条件中提取列值，并根据索引键的模式进行转换。
- 调用索引的 `ScanKey` 方法，传入构建好的索引键和一个结果 RID 向量
- 索引会根据键值查找对应的记录，并将找到的 RID 存储在结果向量中
- 使用结果向量中的 RID，从缓冲池中查找对应的页。如果页不在缓冲池中，则从磁盘加载到缓冲池。
- 从页中读取数据并创建 `Tuple` 对象

### Task 1 - Executors
**SeqScan**


