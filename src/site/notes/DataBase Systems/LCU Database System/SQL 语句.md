---
{"dg-publish":true,"tags":["LCU数据库"],"permalink":"/DataBase Systems/LCU Database System/SQL 语句/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-20T11:36:28.694+08:00","updated":"2025-04-22T20:38:12.831+08:00"}
---

### SQL语句
要注意
- 目前，没有任何一个数据库系统能够支持SQL标准的所有概念和特性
- 许多软件厂商对SQL基本命令集还进行了不同程度的扩充和修改

#### SQL特点
- 综合统一
- 非过程化
- 面向集合的操作方式
- 以同一种语法结构提供多种使用方式

#### 基本数据类型
![Pasted image 20250422191939.png|600](/img/user/accessory/Pasted%20image%2020250422191939.png)
常用的就那几个


#### 模式的定义和删除
**定义模式**
```sql
CREATE SCHEMA <模式名> AUTHORIZATION <用户名>
```
- **如果没有指定 <模式名>， 那么<模式名>隐含为<用户名>**
- 定义模式本质是定义了一个**命名空间**
- 创建模式的同时也可以创建其它东西：`CREATE SCHEMA <模式名> AUTHORIZATION <用户名> [<表定义子句> | <视图定义子句> | <授权定义子句>]`

**删除模式**
```SQL
DROP SCHEMA <模式名><CASCADE|RESTRICT>
```
- `CASCADE`：表示**级联**，也即删除模式时会删除该模式中所有数据库对象
- `RESTRICT`：表示**限制**，也即在删除时如果该模式下定义了其它对象，则拒绝

#### 表的定义 删除 修改
**定义表**
![Pasted image 20250422195051.png|500](/img/user/accessory/Pasted%20image%2020250422195051.png)

- 建表的同时通常还可以定义与该表有关的完整性约束条件
- 如果完整性约束条件涉及该表的多个属性列，则必须定义在表级上，否则既可以在列级上也可以在表级上

**修改表**
![Pasted image 20250422200642.png|500](/img/user/accessory/Pasted%20image%2020250422200642.png)

- `ADD`：用于增加新列，新的列级完整性约束条件和新的表级完整性约束条件
- `DROP COLUMN`：用于删除表中的列
- `DROP CONSTRAINT`：用于删除指定的完整性约束条件
- `ALTER COLUMN`：用于修改原有的列定义

**删除表**
```SQL
DROP TABLE <表明> [RESTRICT|CASCADE]；
```
- **选择`RESTRICT`**：欲删除的基本表不能被其他表的约束所引用（比如CHECK、FOREIGN KEY等）、不能有视图、不能有触发器（trigger），不能有存储过程或函数等
- **选择`CASCADE`**：没有限制条件，所有相关依赖对象连同基本表一起删除

#### 索引的建立与删除
用户可以根据应用环境的需要在基本表上建立一个或多个索引，类型有
- 顺序文件上的索引
- B+树索引
- 散列索引
- 位图索引
索引虽然能加快查询速度，但也有缺点
- 需要占用一定的存储空间
- 会提高查询速度但是会降低更新速度

![Pasted image 20250422203804.png|400](/img/user/accessory/Pasted%20image%2020250422203804.png)


