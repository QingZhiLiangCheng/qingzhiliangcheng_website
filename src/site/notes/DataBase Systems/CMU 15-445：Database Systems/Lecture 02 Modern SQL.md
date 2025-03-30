---
{"week":"第一周","dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 02 Modern SQL/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-21T13:08:37.398+08:00","updated":"2025-03-30T15:17:02.274+08:00"}
---


![[02-modernsql 1.pdf]]
sql history
![903fa4b609b0c9492333b3d8477537e.png](/img/user/accessory/903fa4b609b0c9492333b3d8477537e.png)
![f2e9f61290791d465cb9534164535ab.png](/img/user/accessory/f2e9f61290791d465cb9534164535ab.png)
发现了一个很无知的事情  我们都年circle    大佬念 sequel 而且年sequel是有原因的

这是2023版的ppt   sql又更新了
![Pasted image 20250121132607.png](/img/user/accessory/Pasted%20image%2020250121132607.png)

deviates from the sql standard the most: mysql
But more recently, they have a flag where you can make it be more strict and try to be more closer to the SQL standard, but for the longest time, they do a bunch of weird things.

today's agenda
![Pasted image 20250121133114.png|300](/img/user/accessory/Pasted%20image%2020250121133114.png)
- aggregations --- 聚合
- group by  ---- 分组

Another theme about what we'll talk about is the goal of writing SQL statement often time is to try to do all the computation on the database server itself within one overarching SQL query.
Meanning we don't want to have do a select, get some data back into a Python grogram or something, then operate on it and then push it back and do more queries.
we want to try to do everything we can on the server side inside the database system.
Bacause we want to be able to push the query to the data, not pull the data to the query.

today's simple example database
![Pasted image 20250121134121.png](/img/user/accessory/Pasted%20image%2020250121134121.png)
```sql
CREATE TABLE student (
    sid INT PRIMARY KEY,
    name VARCHAR(255),
    login VARCHAR(255),
    age INT,
    gpa DECIMAL(3, 1)
);

CREATE TABLE course (
    cid VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE enrolled (
    sid INT,
    cid VARCHAR(20),
    grade CHAR(1),
    FOREIGN KEY (sid) REFERENCES student(sid),
    FOREIGN KEY (cid) REFERENCES course(cid)
);

INSERT INTO student (sid, name, login, age, gpa) VALUES
(53666, 'Kanye', 'kanye@cs', 44, 4.0),
(53688, 'Bieber', 'jbieber@cs', 27, 3.9),
(53655, 'Tupac', 'shakur@cs', 25, 3.5);

INSERT INTO course (cid, name) VALUES
('15-445', 'Database Systems'),
('15-721', 'Advanced Database Systems'),
('15-826', 'Data Mining'),
('15-799', 'Special Topics in Databases');

INSERT INTO enrolled (sid, cid, grade) VALUES
(53666, '15-445', 'C'),
(53688, '15-721', 'A'),
(53688, '15-826', 'B'),
(53655, '15-445', 'B'),
(53666, '15-721', 'C');
```
#### aggregates
aggregate funciton are a way to compute some mathematical computation on a squence of data, or a bag of tuples, and you're basically gonna coalesce it down into a single value.
![Pasted image 20250121134425.png|500](/img/user/accessory/Pasted%20image%2020250121134425.png)
a example like this, let's day we want to get off for the students, we want to count the number of students, so have a login where the login ends with @cs
so the function is 
```SQL
SELECT COUNT(login) AS cnt FROM student WHERE login LIKE '%@cs'
```
that's equivalent,
```sql
SELECT COUNT(*) AS cnt FROM student WHERE login LIKE '%@cs'
```
because it's just counting the number of entries.
the data system should be smart enough to realize, don't care what the expression is inside of the count.

we can have multiple aggregates in a single select outout.
```sql
SELECT AVG(gpa),COUNT(sid) FROM student WHERE login LIKE '%@cs'
```

import thing to understand though, with aggregation, since you're trying to coalesce down multiple tuples to a single scalar value, you can't reference anything in the select output that isn't part of the aggregate.
so we can't select the average GPA after you join the students table, the enrolled table, and then also spit out the course ID of the enrolled table.
so we need group by

#### group by
where you're going to project tuples into buckets based on whatever the parameters are in the group by clause, and then compute the avarge on the each individual bucket.
```sql
SELECT AVG(s.gpa), e.cid
	FROM enrolled AS e JOIN student AS s
		on e.sid = s.sid
GROUP BY e.cid
```
![Pasted image 20250121143420.png](/img/user/accessory/Pasted%20image%2020250121143420.png)
so the import thing is you have to have anything that's not part of an aggregation has to appear in the group by clause.
![Pasted image 20250121144324.png|500](/img/user/accessory/Pasted%20image%2020250121144324.png)
![Pasted image 20250121143818.png](/img/user/accessory/Pasted%20image%2020250121143818.png)

but mySQL used to let you do this in some cases


```SQL
SELECT AVG(s.gpa), e.cid FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
```
![1737445947946.jpg|400](/img/user/accessory/1737445947946.jpg)
![Pasted image 20250121144502.png](/img/user/accessory/Pasted%20image%2020250121144502.png)
postgres doesn't let you do this.

![Pasted image 20250121144555.png](/img/user/accessory/Pasted%20image%2020250121144555.png)
mysql doesn't le you do it.
but if go to the traditional mode
![Pasted image 20250121144708.png](/img/user/accessory/Pasted%20image%2020250121144708.png)
it let out do it.
it so bad.  because the sql is mean it's the average GPA for all courses but it spit any one of them course id.

![Pasted image 20250121144913.png](/img/user/accessory/Pasted%20image%2020250121144913.png)
the sqlite do it.

![Pasted image 20250121145013.png](/img/user/accessory/Pasted%20image%2020250121145013.png)
the oracle didn't do it.

![Pasted image 20250121145055.png](/img/user/accessory/Pasted%20image%2020250121145055.png)
duckdb doesn't let it.

so the differnt systems are doing different things.

#### having
if we want to start filtering on these aggregation the aggregate columns you're generating.
![Pasted image 20250121151112.png](/img/user/accessory/Pasted%20image%2020250121151112.png)
we can't do that. because at this point when the system is actually calculating the query it's computing aggregation as it goes along it can't doesn't know what the final result is.
so we use the having
it telling the system okay formative aggregation is which is basically telling the system okey formative aggregation is produce the output that's defined in the select statement and then apply this additional filter.
简单来说就是and放在那里不合适  在聚合完之前不知道结果   只能通过having 语句 在聚合完之后在select的结果上加入过滤器

SQL 查询的逻辑处理顺序如下：
1. **FROM**：从指定的表中选择数据。
2. **JOIN**：根据条件连接其他表。
3. **WHERE**：过滤行，只保留满足条件的行。
4. **GROUP BY**：将数据分组。
5. **HAVING**：过滤分组后的结果，只保留满足条件的分组。
6. **SELECT**：选择列并计算表达式。
7. **ORDER BY**：对最终结果排序。
![Pasted image 20250121151747.png](/img/user/accessory/Pasted%20image%2020250121151747.png)
this is actually not correct either in some cases I don't think the SQL stand unless you do this either right because even though I have an alias up here for average GPA the data system can say I don't know what this is.
the mysql allow, but postgres doesn't let it. For postagres, we must aggregation again.
![Pasted image 20250121152002.png](/img/user/accessory/Pasted%20image%2020250121152002.png)

问题在于 `HAVING` 子句中的 `avg_gpa` 是一个别名，这个别名在select中定义的，它在 `HAVING` 子句执行时还没有被计算出来。因此，你需要直接使用聚合函数 `AVG(s.gpa)` 而不是别名 `avg_gpa`

the data system should be smart enough to recognize that this average the GAP is the same as that average GPA up there.
我不信 专门去试了一下 结果真的可以
![Pasted image 20250121153320.png|400](/img/user/accessory/Pasted%20image%2020250121153320.png)


#### String Operations
![Pasted image 20250121154050.png|500](/img/user/accessory/Pasted%20image%2020250121154050.png)
string data types the SQL standard specifies that the case of the strings within the values because I don't mean the strings and the select statements I mean like the actual data you're storing that they should be case sensitive and that you when you want to have in your SQL statement constant strings you want to use single quotes.
postgres SQL server and Oracle follolw the standard
MySQL is be default case insensitive

![Pasted image 20250121180325.png](/img/user/accessory/Pasted%20image%2020250121180325.png)
![Pasted image 20250121180524.png](/img/user/accessory/Pasted%20image%2020250121180524.png)

LIKE is used for really primitive string matching or pattern matching
use % to represent a wild card -----  inculidng empty strings.

SQL-92 defines stirng functions

SQL standard define the || operator for concatenating two or more strings together.
![Pasted image 20250121181324.png|500](/img/user/accessory/Pasted%20image%2020250121181324.png)
![Pasted image 20250121181455.png](/img/user/accessory/Pasted%20image%2020250121181455.png)

#### DATE / TIME operations
SQL standard have multiple ways to define the data types and time stamps
and different calendar 
postgres:
![Pasted image 20250121182403.png](/img/user/accessory/Pasted%20image%2020250121182403.png)
mysql:
![Pasted image 20250121182348.png](/img/user/accessory/Pasted%20image%2020250121182348.png)
8-1=7 30-1=29 so 729
![Pasted image 20250121182648.png](/img/user/accessory/Pasted%20image%2020250121182648.png)

如果从今天开始构建一个数据库 一般选择从postgres开始


#### window functions
![Pasted image 20250121183758.png](/img/user/accessory/Pasted%20image%2020250121183758.png)
![Pasted image 20250121184008.png](/img/user/accessory/Pasted%20image%2020250121184008.png)
![Pasted image 20250121184020.png](/img/user/accessory/Pasted%20image%2020250121184020.png)
![Pasted image 20250121184101.png](/img/user/accessory/Pasted%20image%2020250121184101.png)

#### nested queries
allows you to have a query inside of a query
```sql
SELECT name FROM student WHERE sid IN (SELECT sid From enrolled)
```
the nested queries are notoriously difficult for database systems to optimize 

![Pasted image 20250121185330.png](/img/user/accessory/Pasted%20image%2020250121185330.png)
![Pasted image 20250121185400.png|500](/img/user/accessory/Pasted%20image%2020250121185400.png)
 

![[02-modernsql node.pdf]]