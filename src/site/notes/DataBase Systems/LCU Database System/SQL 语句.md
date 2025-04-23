---
{"dg-publish":true,"tags":["LCU数据库"],"permalink":"/DataBase Systems/LCU Database System/SQL 语句/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-20T11:36:28.694+08:00","updated":"2025-04-23T21:03:39.555+08:00"}
---

### Demo Overview
一个可以执行的SQL语句的网址(但需要科学上网) 可以去体会一下这些语句
网址：https://onecompiler.com/ 可以选择一个你喜欢的任意的数据库, PostgreSQL, MySQL, SQLServer, SQLite ... 都可以
可以顺着课本的例子顺序敲一下
如果只想练query语句 直接在前面加上这些建表语句就可以
```SQL
-- 创建Student表
CREATE TABLE Student (
    Sno VARCHAR(10) PRIMARY KEY,
    Sname VARCHAR(50),
    Sex CHAR(2),
    Birthdate DATE,
    Smajor VARCHAR(50)
);

-- 插入Student数据
INSERT INTO Student (Sno, Sname, Sex, Birthdate, Smajor) VALUES
('20180001', '李勇', '男', '2000-03-08', '信息安全'),
('20180002', '刘晨', '女', '1999-09-01', '计算机科学与技术'),
('20180003', '王敏', '女', '2001-08-01', '计算机科学与技术'),
('20180004', '张立', '男', '2001-01-08', '计算机科学与技术'),
('20180005', '陈新奇', '男', '2001-11-01', '信息管理与信息系统'),
('20180006', '赵明', '男', '2000-06-12', '数据科学与大数据技术'),
('20180007', '王佳佳', '女', '2001-12-07', '数据科学与大数据技术');

-- 创建Course表
CREATE TABLE Course (
    Cno VARCHAR(10) PRIMARY KEY,
    Cname VARCHAR(50),
    Ccredit INT,
    Cpmno VARCHAR(10),
    FOREIGN KEY (Cpmno) REFERENCES Course(Cno)
);

-- 插入Course数据
INSERT INTO Course (Cno, Cname, Ccredit, Cpmno) VALUES
('81001', '程序设计基础与C语言', 4, NULL),
('81002', '数据结构', 4, '81001'),
('81003', '数据库系统概论', 4, '81002'),
('81004', '信息系统概论', 4, '81003'),
('81005', '操作系统', 4, '81001'),
('81006', 'Python语言', 3, '81002'),
('81007', '离散数学', 4, NULL),
('81008', '大数据技术概论', 4, '81003');

-- 创建SC表
CREATE TABLE SC (
    Sno VARCHAR(10),
    Cno VARCHAR(10),
    Grade INT,
    Semester INT,
    Teachingclass VARCHAR(10),
    PRIMARY KEY (Sno, Cno),
    FOREIGN KEY (Sno) REFERENCES Student(Sno),
    FOREIGN KEY (Cno) REFERENCES Course(Cno)
);

-- 插入SC数据
INSERT INTO SC (Sno, Cno, Grade, Semester, Teachingclass) VALUES
('20180001', '81001', 85, 20192, '81001-01'),
('20180001', '81002', 96, 20201, '81002-01'),
('20180001', '81003', 87, 20202, '81003-01'),
('20180002', '81001', 80, 20192, '81001-02'),
('20180002', '81002', 98, 20201, '81002-01'),
('20180002', '81003', 71, 20202, '81003-02'),
('20180003', '81001', 81, 20192, '81001-01'),
('20180003', '81002', 76, 20201, '81002-02'),
('20180004', '81001', 56, 20192, '81001-02'),
('20180004', '81002', 97, 20201, '81002-02'),
('20180005', '81003', 68, 20202, '81003-01');
```
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
```SQL
CREATE TABLE Student(
  Sno char(8) primary key not null,
  Sname char(6) not null,
  Ssex char(2) not null
);

SELECT * FROM student;
```

```sql
CREATE TABLE SC (
    Sno VARCHAR(10),
    Cno VARCHAR(10),
    Grade INT,
    Semester INT,
    Teachingclass VARCHAR(10),
    PRIMARY KEY (Sno, Cno), //注意这里！！！！！
    FOREIGN KEY (Sno) REFERENCES Student(Sno),
    FOREIGN KEY (Cno) REFERENCES Course(Cno)
);
```


**修改表**
![Pasted image 20250422200642.png|500](/img/user/accessory/Pasted%20image%2020250422200642.png)

- `ADD`：用于增加新列，新的列级完整性约束条件和新的表级完整性约束条件
- `DROP COLUMN`：用于删除表中的列
- `DROP CONSTRAINT`：用于删除指定的完整性约束条件
- `ALTER COLUMN`：用于修改原有的列定义

**删除表**
```SQL
DROP TABLE <表名> [RESTRICT|CASCADE]；
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
	- JOIN ![Pasted image 20250423082738.png](/img/user/accessory/Pasted%20image%2020250423082738.png)
		- INNER JOIN: 关键字在表中存在至少一个匹配时返回行  `SELECT Sno,sc.Cno,Grade,course.Cno,Cname,Cpno,Ccredit FROM sc INNER JOIN course ON(sc.Cno=course.Cno);` 
		- LEFT JOIN: 以左表为标准，若右表中无匹配，则填NULL  `SELECT Sno,sc.Cno,Grade,course.Cno,Cname,Cpno,Ccredit FROM sc LEFT JOIN course ON(sc.Cno=course.Cno);` 
		- RIGHT JOIN: 以右表为标准，若左表中无匹配，则填NULL `SELECT Sno,sc.Cno,Grade,course.Cno,Cname,Cpno,Ccredit FROM sc RIGHT JOIN course ON(sc.Cno=course.Cno);`
		- FULL JOIN: 结合了LEFT JOIN和RIGHT JOIN `SELECT Sno,sc.Cno,Grade,course.Cno,Cname,Cpno,Ccredit FROM sc FULL JOIN course ON(sc.Cno=course.Cno);`
	- 嵌套查询
		-  子查询的SELECT语句不能使用`ORDER BY`子句
		- 嵌套查询往往可以转换为对应的连接运算
		- 带有in的子查询 `SELECT student.Sno,Sname,Sdept FROM student WHERE Sdept IN (SELECT Sdept FROM student WHERE Sname='刘晨');`
		- 带有比较运算符的子查询 `SELECT Sno,Sname,Sdept FROM student WHERE Sdept = (SELECT Sdept FROM student WHERE Sname='刘晨');`
		- 两个概念: 不相关子查询 vs. 相关子查询
			- 不相关子查询：子查询的查询条件不依赖于父查询
			- 相关子查询：子查询的查询条件依赖于父查询
		- 带有ANY 或  ALL的子查询 ![Pasted image 20250423142403.png|400](/img/user/accessory/Pasted%20image%2020250423142403.png) ![Pasted image 20250423142431.png](/img/user/accessory/Pasted%20image%2020250423142431.png) 
		- 带有EXISTS查询的子查询: 存在量词
			- 需要注意的是，一些带有EXISTS和NOT EXISTS谓词的子查询不能被其他形式的子查询等价替换；但是所有带IN谓词，比较运算符，ANY和ALL谓词的子查询都可以用带EXISTS谓词的子查询替换
	- 集合查询
		- 并 UNION
		- 交 INTERSECT
		- 差EXCEPT
- INSERT
	- 插入元组 ![Pasted image 20250423204249.png|500](/img/user/accessory/Pasted%20image%2020250423204249.png) `INSERT INTO student VALUES('201215126','张成民','男',18,'CS');` `INSERT INTO student(Sno,Sname,Ssex,Sdept,Sage) VALUES('201215128','陈冬','男','IS',18);` ...
	- 插入子查询结果![Pasted image 20250423204507.png](/img/user/accessory/Pasted%20image%2020250423204507.png)
- UPDATE![Pasted image 20250423204517.png](/img/user/accessory/Pasted%20image%2020250423204517.png)
	- 修改一个元组的值 `UPDATE student set Sage=22 WHERE Sno='201215121';`
	- 修改多个元组的值 `UPDATE student set Sage=Sage+1;`
	- 带子查询的修改语句 `UPDATE sc SET Grade=0 WHERE Sno IN ( SELECT Sno FROM student WHERE Sdept='CS' );`
- DELETE![Pasted image 20250423204628.png|600](/img/user/accessory/Pasted%20image%2020250423204628.png)
	- 删除一个元组的值 `DELETE FROM student WHERE Sno='201215128'；`
	- 删除多个元组的值 `DELETE FROM SC；`
	- 带子查询的删除语句 `DELETE FROM sc WHERE Sno IN (SELECT Sno FROM student WHERE Sdept='CS');`

### 课本
![Pasted image 20250423145025.png|400](/img/user/accessory/Pasted%20image%2020250423145025.png)
1. 查询全体学生的学号和姓名
2. 查询全体学生的姓名 学号 主修专业
3. 查询全体学生的详细记录
4. 查询全体学生的姓名及其年龄
5. 查询全体学生的姓名 出生日期 和 主修专业
6. 查询选修了课程的学生学号
7. 查询主修计算机科学与技术专业全体学生的姓名
8. 查询2000年及2000年后出生的所有学生的姓名及其性别
9. 查询考试成绩不及格的学生的学号
10. <font color="#f79646">查询年龄在20-23岁范围内的学生的姓名 出生日期和 主修专业</font>
11. 查询年龄不在20-23岁范围内的学生的姓名 出生日期和 主修专业
12. <font color="#f79646">查询计算机科学技术与技术专业和信息安全专业的学生的姓名及其性别</font>
13. 查询非计算机科学技术与技术专业和信息安全专业的学生的姓名及其性别
14. 查询学号为20180003的学生的详细情况
15. 查询所有姓刘的学生的姓名 学号和性别
16. 查询2018级学生的学号和姓名
17. 查询课程号为81开头，最后一位是6的课程名称和课程号
18. 查询所有不姓刘的同学的姓名、学号和性别
19. 某些学生选修课程后没有参加考试，所以有选课记录但没有考试成绩。查询缺少成绩的学生的学号和相应的课程号。
20. 查所有有成绩的学生的学号和选修的课程号
21. 查询主修计算机科学与技术专业，在2000年(包括2000年)以后出生的学生的学号、姓名和性别。
22. 查询选修了81003号课程的学生的学号及其成绩，查询结果按分数的降序排列
23. <font color="#f79646">查询全体学生选修课程情况，查询结果先按照课程号升序排列，同一课程中按成绩降序排列。</font>
24. 查询学生总人数
25. 查询选修了课程的学生人数
26.  计算修选81001号课程的学生平均分数
27. 计算修选81001号课程的学生最高分数
28. 查询学号为20180003的学生选修课程的总学分数
29. 求各个课程号及选修该课程的人数
30. 查询平均成绩大于或等于90分的学生学号和平均成绩
31. <font color="#f79646">查询选修数据库系统概论课程且成绩排名在前10名的学生的学号</font>。
32. <font color="#f79646">查询平均成绩排名在第3~7名的学生的学号和平均成绩。</font>
33. 查询每个学生的学号、姓名、性别、出生日期、主修专业及该学生选修课程的课程号与成绩。
34. 查询选修81002号课程且成绩在90分以上的所有学生的学号和姓名。
35. <font color="#4bacc6">查询每一门课的间接先修课(即先修课的先修课)</font>
36. 查询与“刘晨”在同一个主修专业的学生学号、姓名和主修专业。
37. 查询选修了课程名为“信息系统概论”的学生的学号和姓名。
38. 找出每个学生超过他自己选修课程平均成绩的课程号。
39. 查询非计算机科学与技术专业中比计算机科学与技术专业任意一个年龄小(出生日期晚)的学生的姓名、出生日期和主修专业。
40. 查询非计算机科学与技术专业中比计算机科学与技术专业所有学生年龄都小(出生日期晚)的学生的姓名及出生日期。
41. 查询所有选修了81001号课程的学生姓名。
42. 查询没有选修81001号课程的学生姓名
43. <font color="#f79646">查询选修了全部课程的学生姓名</font>
44. <font color="#f79646">查询至少选修了学生20180002选修的全部课程的学生的学号</font>
45. 查询计算机科学与技术专业的学生及年龄不大于19岁(包括等于19岁)的学生。
46. 查询2020年第2学期选修了课程81001或81002的学生
47. 查询计算机科学与技术专业的学生与年龄不大于19岁的学生的交集。
48. 查询既选修了课程81001又选修了课程81002的学生。就是查询选修课程81001的学生集合与选修课程81002的学生集合的交集。
49. 查询计算机科学与技术专业的学生与年龄不大于19岁的学生的差集。
50. ...

```sql
1. SELECT sno,sname FROM student;
2. SELECT sno as "学号",sname as "姓名", Smajor as "主修专业" FROM student;
3. SELECT * FROM Student;
4. 11
5. select Sname, Birthdate, Smajor from Student;
6. SELECT DISTINCT sno from sc;
7. SELECT sname from Student where Smajor = '计算机科学与技术'
8. SELECT sname, sex from Student where Birthdate>='2000-01-01';
9. SELECT DISTINCT sno from sc where Grade<60;
10. SELECT Sname, Birthdate, Smajor FROM Student WHERE EXTRACT(YEAR FROM AGE(CURRENT_DATE, Birthdate)) BETWEEN 20 AND 23;
11. SELECT Sname, Birthdate, Smajor FROM Student WHERE EXTRACT(YEAR FROM AGE(CURRENT_DATE, Birthdate)) NOT BETWEEN 20 AND 23;
12. SELECT sname, sex from Student where Smajor in ('计算机科学与技术', '信息安全')
13. SELECT sname, sex from Student where Smajor not in ('计算机科学与技术', '信息安全')
14. SELECT * from Student where sno like '20180003'
15. select Sname,Sno,sex from Student where sname like '刘%';
16. select sno, sname from student where sno like '2018____'
17. select cname, cno from Course where cno like '81__6'
18. select Sname,Sno,sex from Student where sname not like '刘%';
19. select cno,sno from sc where Grade IS NULL;
20. select cno,sno from sc where Grade IS NOT  NULL;
21. select sno,sname,sex from Student where Smajor='计算机科学与技术' and Birthdate>'2000-01-01';
22. SELECT sno,Grade from sc where cno = '81003' order by grade DESC
23. SELECT * from sc order by cno ASC, Grade DESC // 不能用and
24. SELECT Count(*) from Student;
25. SELECT Count(DISTINCT sno) from sc;
26. SELECT Average(grade) from sc where cno = '81001';
27. SELECT MAX(Grade) from sc where cno = '81001'; 
28. SELECT SUM(grade) from sc where sno = '20180003'
29. SELECT cno,COUNT(*) from sc group by cno;
30. SELECT sno,AVG(grade) from sc group by sno having AVG(grade)>=90
31. SELECT sno,grade from sc,Course where Cname='数据库系统概论' order by grade limit 10;
32. SELECT sno,avg(grade) from sc group by sno order by avg(grade) limit 5 offset 2
33. SELECT s.*,sc.cno,sc.grade from Student as s left join SC on s.sno=sc.sno;
34. select s.sno,Sname from sc left join  student as s on s.sno = sc.sno where cno='81002' and Grade>=90;
35. SELECT a.cno,a.Cpmno,b.cno,b.Cpmno from course as a left join course as b on a.Cpmno = b.cno where b.Cpmno is not NULL;
36. select * from student where Smajor = (select Smajor from student where sname= '刘晨') and sname <> '刘晨'
37. select sno,sname from student where sno in (select sno from sc where cno in (select cno from course where cname='信息系统概论'))
38. select * from sc inner join (select sno,avg(grade) as grade from sc group by sno) as a on sc.sno = a.sno and sc.grade > a.grade ;
39. SELECT sname,Birthdate,Smajor from Student where Birthdate>any(SELECT Birthdate from student where Smajor='计算机科学与技术') and Smajor<>'计算机科学与技术'
40. SELECT sname,Birthdate,Smajor from Student where Birthdate>ALL(SELECT Birthdate from student where Smajor='计算机科学与技术') and Smajor<>'计算机科学与技术'
41. select sname from student where sno in (select sno from sc where cno='81001')
42. select sname from student where sno not in (select sno from sc where cno='81001')
43. SELECT S.Sname FROM Student S JOIN SC ON S.Sno = SC.Sno GROUP BY S.Sname, S.Sno HAVING COUNT(DISTINCT SC.Cno) = (SELECT COUNT(*) FROM Course);
44. ...
```

### 试题
#### 17年期中考试题
> [!abstract]
> 7.SQL语言具有数据操作功能，SQL语言的一次查询的结果是一个
> A.数据项
> B.记录
> C.元组
> D.关系
> 
> 8.有学生关系：学生(学号,姓名,年龄)，对学生关系的查询语句如下：
>   SELECT学号
>   FROM学生
>   WHERE年龄>20 AND 姓名LIKE ‘%伟’；
> 如果要提高该语句的查询效率，应该建索引的属性是（  ）
> A.学号
> B.姓名
> C.年龄
> D.(学号，姓名)
> 
> 10.在某个数据库中建立了表person(no,name,sex,birthday)，no为表的主码,表中已有的记录如下所示：
> No   Name  Sex   Birthday
> 1    张丽丽  女   1967/05/07
> 4    李方    女   1970/04/14
> 6    王安    男    1982/10/27
> 以下四个语句中能够正确执行的插入操作是
> A.INSERT INTO person VALUES(6,’王中’,’男’,’1964/03/08’)
> B.INSERT INTO person(name,sex) VALUES(‘王中’,’男’)
> C.INSERT INTO person VALUES(2,’男’,’王中’,’1964/03/08’)
> D.INSERT INTO person(no,sex) VALUES(2,’男’)
> 
> 12.修改数据的关键词应使用的语句是
> A.INSERT
> B.SELECT
> C.DELETE
> D.UPDATE
> 
> 15.在SQL中，与“NOT IN”等价的操作符是
> A.<>ALL
> B.<>SOME
> C.=SOME
> D.=ALL
> 
> 17.在SQL中，下列涉及空值的操作，不正确的是
> A.AGE IS NULL
> B.AGE IS NOT NULL
> C.AGE = NULL
> D.NOT (AGE IS NULL)
> 
> 19.关系代数中的Π（投影）运算符对应SELECT语句中的以下哪个子句?
> A.SELECT
> B.FROM
> C.WHEHE
> D.GROUP BY
> 
> 设有一个仓库管理系统的关系模型如下：
> 仓库（仓库号，城市，面积）；
> 职工（职工号，姓名，工资，仓库号），外码：仓库号；
> 供应商（供应商号，供应商名，地址）；
> 订购单（订单号，职工号，供应商号，订购日期），外码：职工号，供应商号。
> 用SQL语言实现下列3-12题的操作要求。
> 
> <font color="#f79646">3.把对职工表的查询和对工资的修改权限授权给用户zhang</font>
> <font color="#f79646">4.只收回用户zhang对职工表中工资的修改权限。</font>
> 5.检索在广州的所有供应商信息。
> 6.求所有工资不多于1210元的职工所管理仓库的平均面积。
> 7.查询自2019年7月1日以来的所有订单号、职工号、供应商号，并按职工号降序排列。
> 8.检索今年10月1日至12月31日期间，没有订购天津供应商商品的订单号。
> 10.插入一个新的仓库元组（WH3，上海，280）
> 11.删除仓库号为“WH2”的仓库信息
> 12.给低于所有职工平均工资的职工提高5%的工资


~~C~~ <font color="#f79646">D</font> C D D A C A 
```sql
3. grant select, updata(工资) on table 职工 to zhang
4. revoke updata(工资) on table 职工 from zhang
5. SELECT * from 供应商 where 地址 = '广州'
6. SELECT AVG(面积) from 仓库 where 仓库号 in (select DISTINCT 仓库号 from 职工 where 工资<1210)
7. SELECT 订单号,职工号, 供应商号 from 订购单 where 订购日期 > '2019-07-01' order by 职工号 DESC;
8. SELECT 订单号 from 订购单 where 供应商号<>(SELECT 供应商号 from 供应商 where 供应商名='天津') and 订购日期 between '2025-10-01' and '2025-12-31';
9. 重了
10. INSERT INTO 仓库 VALUES (WH3,'上海',280);
11. DELETE FROM 仓库 where 仓库号 = 'WH2';
12. UPDATE 职工 set 工资 = 工资 * 1.05;
```

#### 11—12学年第2学期期末考试 A卷
> [!todo]
> 7．在SELECT语句中，与关系代数中运算符σ对应的是（  ）子句。
> A．SELECT   B．FROM   C．WHERE   D．GROUP BY
> ![Pasted image 20250423200132.png](/img/user/accessory/Pasted%20image%2020250423200132.png)
> 用SQL语言完成下面操作：
> 3．<font color="#f79646">查询所有课程都及格的学生信息。</font>
> 4．统计每一门课程的最高分、最低分和平均分。
> 5．查询选修了高等数学课程的学生的个人信息。
> 6．向数据库中添加一个学生信息。
> 
> |        |          |        |        |        |
> | ------ | -------- | ------ | ------ | ------ |
> | **学号** | **姓  名** | **年龄** | **性别** | **籍贯** |
> | 98606  | 郭大力      | 20     | 男      | 湖南     |
> 
> 7．<font color="#f79646">在SC表的sno上创建一个外键。</font>
> 8．<font color="#c0504d">查询所有学生中平均成绩最高的那个学生的学号</font>

C
```SQL
3. SELECT * from student where sno in (select sno from sc group by sno having MIN(grade)>=60)；
4. SELECT cno,MIN(grade),MAX(grade),AVG(grade) from sc group by cno;
5. SELECT * from student where sno in (select sno from sc where cno=(select cno from course where cname = '高等数学'));
6. INSERT INTO student VALUES('98606','郭大力',20,'男','湖南')
7. ALTER TABLE sc ADD CONSTRAINT fk sno foreign key(sno) references student(sno);
8. SELECT sno from sc group by sno order by AVG(grade) DESC LIMIT 1
```
可能出现同分的情况 所以不建议用LIMIT
```sql
select sno from sc group by sno
having avg(grade) >= all(select avg(grade) from sc group by SNO);
```

#### 11—12学年第2学期期末考试 B卷
> [!success]
> 13．SQL语言中，修改表结构的语句是
> A．CREATE     B．SELECT     C．UPDATE    D．ALTER
> 已知SPJ数据库中4张表的关系模式如下：
> S(sno，sname，scity )            --供应商表：供应商编号，名称，所在地
> P( pno，pname，color，weight )       --零件表：零件编号，名称，颜色，重量
> J( jno，jname，jcity )                --工程表：工程编号，工程名称，所在地
> SPJ( sno，pno，jno，qty)        --供应关系表：供应商号，零件号，工程号，供应量
> 3．查询S3供应商供应的零件号码pno和零件名称pname。
> 4．把S1供应商所在地由“天津”改为“上海”。
> 5．<font color="#c0504d">授予用户U1查询、修改S表的权限，并允许该用户再转授权限给其他用户。</font>
> 6．创建视图preder描述重量大于12的零件的零件号pno和零件名称pname。
> 7．在SPJ表中，把 sno设置为外键。
> 8．查询出来使用了“上海”产的零件的工程号jno和工程名称jname。


D
```SQL
3. SELECT p.pno,p.pname from p,spj where p.pno = spj.pno and sjp.sno ='S3';
4. UPDATE S set city = '上海' where city = '天津'
5. grant select, update on s to u1 with grant option
6. create view preder as select pno , pname from p where weight>12
7. ALTER TABLE SPJ ADD CONSISTRAINT fk foreign key (sno) reference S(sno)
8. SELECT j.jno,j.jname from j,s,spj where j.jno=spj.jno and s.sno=spj.sno and  s.city='上海'; //好多好多答案
```

