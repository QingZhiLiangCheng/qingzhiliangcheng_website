---
{"dg-publish":true,"tags":["LCU数据库"],"permalink":"/DataBase Systems/LCU Database System/SQL 语句/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-20T11:36:28.694+08:00","updated":"2025-04-23T08:22:03.493+08:00"}
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
**建立索引**
![Pasted image 20250422203804.png|400](/img/user/accessory/Pasted%20image%2020250422203804.png)
<表名>：要建立索引的基本表的名字
索引可以建立在该表的一列或多列上，各列之间使用逗号分隔
每个<列名>后面还可以用<次序>指定索引值的排列次序，可选ASC-升序（默认）或DESC-降序
UNIQUE：表明此索引的每一个索引值只对应唯一的数据记录
CLUSTER：表示需要建立聚簇索引
**修改索引**
![Pasted image 20250423074552.png|500](/img/user/accessory/Pasted%20image%2020250423074552.png)
**删除索引**
![Pasted image 20250423074605.png|300](/img/user/accessory/Pasted%20image%2020250423074605.png)

### 数据查询
#### Select 语句
![Pasted image 20250423074940.png|500](/img/user/accessory/Pasted%20image%2020250423074940.png)

- 单表查询
	- 选择表中的若干列
		- 查询指定列: `SELECT Sname,Sage from Student;`
		- 查询全部列: * 作为通配符表示全部 `SELECT * from Student;`
		- 查询经过计算的值 SELECT子句的`<目标列表达式>`不仅可以是属性列，还可以是表达式，具体有
			- 算数表达式: `SELECT Sname,2022-Sage from Student;`
			- 字符串常量: `SELECT Sname,LOWER(Sdept) from student;`
			- 列别名: `SELECT Sname `姓名`,Sage `年龄` from student;`
	- 选择表中的若干行
		- 取消重复行 DISTINCT: `SELECT DISTINCT Sno from SC;`
		- 查询满足条件的元组: ![Pasted image 20250423075722.png|500](/img/user/accessory/Pasted%20image%2020250423075722.png)
			- 比较大小: `SELECT Sno,Grade from SC WHERE Grade > 85;`
			- 确定范围: `SELECT Sname,Sage from student WHERE Sage BETWEEN 19 AND 20;`
			- 确定集合: `SELECT Sname,Sdept from student WHERE Sdept IN('MA','CS');`
			- 字符匹配:
				- 可以 = 代替like !=代替not like
				- %代替多个字符
				- `_`只能代替一个字符
			- 转移字符: `\`
			- 空值: `SELECT Sno Cno FROM SC WHERE Grade IS NULL;`
			- 多重条件查询
				- `AND`和 `OR`来联结多个查询条件
				- `AND`的优先级高于`OR`
				- 可以用括号改变优先级
	- Order By 子句
		- ASC - 升序(默认) `SELECT Sno,Grade from SC WHERE Cno='3' ORDER BY Grade DESC;`
		- DESC - 降序 `SELECT * FROM student ORDER BY Sdept,Sage DESC;
	- 聚集函数
		- 计数 `COUNT (DISTINCT|ALL) *` , `COUNT([DISTINCT|ALL) <列名>`
			- `SELECT COUNT(Sno) Num FROM SC;`
			- `SELECT COUNT(DISTINCT Sno) Num FROM SC;`
		- 计算总和 `SUM([DISTINCT|ALL]<列名>`
		- 计算平均值 `AVG([DISTINCT|ALL]<列名>`
		- 最大最小值 `MAX([DISTINCT|ALL]<列名>`, `MIN([DISTINCT|ALL]<列名>`
	- GROUP BY
		- 分组目的是为了细化聚集函数的作用对象：若未分组，聚集函数将会作用于整个查询结果；若分组，聚集函数将会作用于每一个组，也即每一个组都有一个函数值
		- 需要注意：WHERE子句作用于整个表或视图，从中选择出满足条件的元组；HAVING短语作用于组，从中选择满足条件的组
		- `SELECT Cno,Count(Sno) FROM sc GROUP BY Cno;`
		- `SELECT Cno,Count(Sno) FROM sc GROUP BY Cno HAVING Count(Sno) > 1;`
- 连接查询
	- 等值连接和非等值连接: 在where子句写入连接条件
		- `SELECT student.*,sc.* FROM student,sc WHERE student.Sno=sc.Sno;`
		- `SELECT Student.Sno,Sname FROM student,sc WHERE student.Sno=sc.Sno AND //连接条件 Cno='2' AND Grade > 80; //其他限定条件`
	- 自身连接: 比如查先修课
		- `SELECT ONE.Cno,TWO.Cpno FROM Course ONE,Course TWO WHERE ONE.Cpno=TWO.Cno;`
	- JOIN
		- INNER JOIN: 关键字在表中存在至少一个匹配时返回行 ![Pasted image 20250423082009.png|300](/img/user/accessory/Pasted%20image%2020250423082009.png) `SELECT Sno,sc.Cno,Grade,course.Cno,Cname,Cpno,Ccredit FROM sc INNER JOIN course ON(sc.Cno=course.Cno);` ![Pasted image 20250423082156.png|500](/img/user/accessory/Pasted%20image%2020250423082156.png)
		- 