---
{"tags":["CMU15721"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-721 Advanced Database Systems/Lecture 01 paper-2：The Composable Data Management System Manifesto(P.Pedreira, et al., VLDB 2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-04T18:29:16.749+08:00","updated":"2025-07-04T22:42:26.200+08:00"}
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

