---
{"dg-publish":true,"tags":["LCU数据库"],"permalink":"/DataBase Systems/LCU Database System/LCU Database System Lab/lab1 模式定义与数据完整性操作/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-10T08:51:41.473+08:00","updated":"2025-04-19T10:00:18.178+08:00"}
---


### 连接数据库
**连接本地服务器**
可能需要点信任服务器证书
![Pasted image 20250409221553.png|400](/img/user/accessory/Pasted%20image%2020250409221553.png)

**连接远程服务器**
服务器ip地址   10.200.7.129（实验室和宿舍都可以访问）
登录账户和密码相同，3班为dbuser202303，对应数据库db202303；4班为dbuser202304、对应数据库db202304；5班为dbuser202305，对应数据库db202305；6班为dbuser202306，对应数据库db202306
![Pasted image 20250409223038.png|400](/img/user/accessory/Pasted%20image%2020250409223038.png)

在远程数据库中 只能访问自己班里的数据库 别的数据库没有权限 比如我就没法访问5班的数据库
![Pasted image 20250410085741.png|400](/img/user/accessory/Pasted%20image%2020250410085741.png)


### Task1: 创建数据库
> 要求: 
> 使用Management Studio图形界面创建studentdb数据库，使用SQL语句创建spjdb

在左侧的对象资源管理器中“数据库”上点右键，新建数据库，指定数据库名studentdb和各项参数如路径等，确定。
在上方工具条中点“新建查询”，新打开窗口中输入如下SQL语句：`create database spjdb`然后点“执行”

#### Setp1： 创建studentdb数据库
先尝试在远程服务器上创建
![Pasted image 20250410090010.png|300](/img/user/accessory/Pasted%20image%2020250410090010.png)

数据库名称使用studentdb**加自己的学号**
![Pasted image 20250410090714.png](/img/user/accessory/Pasted%20image%2020250410090714.png)
服务器没的数据库没给我们权限
![Pasted image 20250410090736.png|500](/img/user/accessory/Pasted%20image%2020250410090736.png)
所以创建数据库这一步 需要我们在自己的本地环境上实现
还是上述过程
![Pasted image 20250410090817.png](/img/user/accessory/Pasted%20image%2020250410090817.png)

#### Step2: 创建spjdb数据库
也是需要再自己环境上完成
点击新建查询
![Pasted image 20250410090931.png|400](/img/user/accessory/Pasted%20image%2020250410090931.png)

然后输入SQL语句
```SQL
create database spjdb2023406313
```

注意 老师为了防止抄袭 **要求用自己的学号 + SQL语句截图**
![Pasted image 20250410091056.png](/img/user/accessory/Pasted%20image%2020250410091056.png)

执行 可能执行完需要刷新一下
![Pasted image 20250410091408.png](/img/user/accessory/Pasted%20image%2020250410091408.png)

### Task2: 使用SQL语句创建表
> 要求:
> 在studentdb数据库中**新建查询，使用SQL语句**创建以下3个表，同时完成数据完整性的定义（实体完整性、参照完整性和用户定义的域完整性）。注意创建完成后需要刷新当前数据库的表目录。

注意: 建表的时候我建议在本地和远程服务器上都建立一个(因为老师可能会去看远程服务器)
#### Step1: 创建student表
| 主码  | 列名    | 数据类型     | 宽度  | 小数位 | 空否  | 取值范围  | 备  注 |
| --- | ----- | -------- | --- | --- | --- | ----- | ---- |
| Pk  | sno   | char     | 9   |     | N   |       | 学号   |
|     | sname | char     | 10  |     | N   |       | 姓名   |
|     | ssex  | char     | 2   |     | Y   |       | 性别   |
|     | sage  | smallint |     |     | Y   | 不小于12 | 年龄   |
|     | sdept | char     | 15  |     | Y   |       | 系名   |

![Pasted image 20250410092402.png](/img/user/accessory/Pasted%20image%2020250410092402.png)
别建错地方了 或者用
```SQL
USE studentdb2023406313; 
GO
```

```SQL
CREATE TABLE student2023406313 (
    sno CHAR(9) NOT NULL PRIMARY KEY,      -- 学号（主键）
    sname CHAR(10) NOT NULL,               -- 姓名
    ssex CHAR(2),                          -- 性别（允许空）
    sage SMALLINT CHECK (sage >= 12),      -- 年龄（不小于12）
    sdept CHAR(15)                         -- 系名（允许空）
);
```

![Pasted image 20250410092331.png|500](/img/user/accessory/Pasted%20image%2020250410092331.png)
刷新之后 会发现多一个表
![Pasted image 20250410092520.png](/img/user/accessory/Pasted%20image%2020250410092520.png)

在远程数据库同样操作

#### Step2: 创建courser表

| 主码  | 列名      | 数据类型     | 宽度  | 小数位 | 空否  | 备  注 |
| --- | ------- | -------- | --- | --- | --- | ---- |
| Pk  | cno     | Char     | 4   |     | N   | 课程号  |
|     | cname   | Char     | 20  |     | Y   | 课程名称 |
|     | cpno    | Char     | 4   |     | Y   | 先行课号 |
|     | ccredit | smallint |     |     | Y   | 学分   |

操作跟上边一样
```SQL
-- 切换到目标数据库 studentdb
USE studentdb2023406313;
GO

-- 创建 Course 表
CREATE TABLE course2023406313 (
    cno CHAR(4) NOT NULL PRIMARY KEY,  -- 课程号，主键，非空
    cname CHAR(20) NULL,               -- 课程名称，允许为空
    cpno CHAR(4) NULL,                 -- 先行课号，允许为空
    ccredit SMALLINT NULL              -- 学分，允许为空
);
GO
```

![Pasted image 20250410092902.png|400](/img/user/accessory/Pasted%20image%2020250410092902.png)
![Pasted image 20250410093039.png](/img/user/accessory/Pasted%20image%2020250410093039.png)

![Pasted image 20250410093136.png](/img/user/accessory/Pasted%20image%2020250410093136.png)

#### Step3: 创建sc表
![Pasted image 20250410093627.png](/img/user/accessory/Pasted%20image%2020250410093627.png)
```SQL
CREATE TABLE sc2023406313 (
    sno CHAR(9) NOT NULL,       -- 学号（外键）
    cno CHAR(4) NOT NULL,       -- 课程号（外键）
    grade DECIMAL(5,1) NULL,    -- 成绩（0-100）

    CONSTRAINT PK_sc2023406313 PRIMARY KEY (sno, cno),

    CONSTRAINT FK_sc_student2023406313 
        FOREIGN KEY (sno) REFERENCES student2023406313(sno),
    
    CONSTRAINT FK_sc_course2023406313 
        FOREIGN KEY (cno) REFERENCES course2023406313(cno),

    CONSTRAINT CK_grade2023406313 
        CHECK (grade BETWEEN 0 AND 100)
);
```

![Pasted image 20250410095746.png](/img/user/accessory/Pasted%20image%2020250410095746.png)

这里报错好像没事 他不认识这个  我发现如果把三个表的语句放到一起 这里就不报错了 因为我是一个表一个表建的 所以这里他找不到student表和course表
但是我看了一下建完的sc表 没啥问题
![Pasted image 20250410100011.png|400](/img/user/accessory/Pasted%20image%2020250410100011.png)

在远程数据库操作相同

### Task3: 使用图形化界面创建表
> 要求:
> 在spjdb数据库中**使用图形界面**创建以下4个表，同时完成数据完整性的定义（实体完整性、参照完整性和用户定义的域完整性）

![Pasted image 20250410101648.png|500](/img/user/accessory/Pasted%20image%2020250410101648.png)
远程服务器的spjdb没有权限  只能用自己的本地环境
建在远程服务器的db202306中也行
#### Step1: 创建S表（供应商信息表）

| 主码  | 列名     | 数据类型     | 宽度  | 小数位 | 空否  | 取值范围 | 备  注  |
| --- | ------ | -------- | --- | --- | --- | ---- | ----- |
| Pk  | sno    | char     | 2   |     | N   |      | 供应商号  |
|     | sname  | char     | 10  |     | N   |      | 供应商名称 |
|     | status | smallint |     |     | Y   | 大于0  | 供应商状态 |
|     | city   | char     | 10  |     | Y   |      | 所在城市  |

![Pasted image 20250410101830.png](/img/user/accessory/Pasted%20image%2020250410101830.png)
在写完列名和类型后就可以对列进行一些操作了
![Pasted image 20250410104955.png|500](/img/user/accessory/Pasted%20image%2020250410104955.png)
可以在这里加备注说明
**设置主键**
**Choice1: 可以右键创建主键**
![Pasted image 20250410102108.png|600](/img/user/accessory/Pasted%20image%2020250410102108.png)
**Choice2: 在右上角提示栏**
![Pasted image 20250410102433.png|500](/img/user/accessory/Pasted%20image%2020250410102433.png)

![Pasted image 20250410102246.png|500](/img/user/accessory/Pasted%20image%2020250410102246.png)


**新建约束**
![Pasted image 20250410102636.png|400](/img/user/accessory/Pasted%20image%2020250410102636.png)
注意命名规范和约束表达式的写法
![Pasted image 20250410103251.png|500](/img/user/accessory/Pasted%20image%2020250410103251.png)
设置完后按Ctrl+S保存 并 设置表名
![Pasted image 20250410103548.png|400](/img/user/accessory/Pasted%20image%2020250410103548.png)

#### Step2: 创建P（零件信息表）

| 主码  | 列名     | 数据类型     | 宽度  | 小数位 | 空否  | 取值范围 | 备  注 |
| --- | ------ | -------- | --- | --- | --- | ---- | ---- |
| Pk  | pno    | char     | 2   |     | N   |      | 零件号  |
|     | pname  | char     | 10  |     | N   |      | 零件名称 |
|     | color  | char     | 2   |     | Y   |      | 颜色   |
|     | weight | smallint |     |     | Y   | 大于0  | 重量   |

操作跟Step1相同
![Pasted image 20250410104411.png|500](/img/user/accessory/Pasted%20image%2020250410104411.png)
![Pasted image 20250410104438.png](/img/user/accessory/Pasted%20image%2020250410104438.png)

#### Step3: 创建J（工程项目表）

| 主码  | 列名    | 数据类型 | 宽度  | 小数位 | 空否  | 取值范围 | 备  注   |
| --- | ----- | ---- | --- | --- | --- | ---- | ------ |
| Pk  | jno   | char | 2   |     | N   |      | 工程项目号  |
|     | jname | char | 10  |     | N   |      | 工程项目名称 |
|     | city  | char | 10  |     | Y   |      | 所在城市   |

![Pasted image 20250410104731.png|500](/img/user/accessory/Pasted%20image%2020250410104731.png)

![Pasted image 20250410104802.png](/img/user/accessory/Pasted%20image%2020250410104802.png)

#### Step4: 创建SPJ（供应情况表）
![Pasted image 20250410104829.png](/img/user/accessory/Pasted%20image%2020250410104829.png)
**涉及到联合主键和外键的可视化创建**
**联合主键的创建**: 选中多行 然后创建主键
![Pasted image 20250410105324.png|400](/img/user/accessory/Pasted%20image%2020250410105324.png)
**外键的创建**
选择关系
![Pasted image 20250410105421.png|300](/img/user/accessory/Pasted%20image%2020250410105421.png)
注意命名规范 然后点击表和列规范
![Pasted image 20250410105814.png|400](/img/user/accessory/Pasted%20image%2020250410105814.png)
![Pasted image 20250410110045.png|500](/img/user/accessory/Pasted%20image%2020250410110045.png)

然后完成另外两个外键就好了
![Pasted image 20250410110340.png](/img/user/accessory/Pasted%20image%2020250410110340.png)

### Task4: 架构（Schema）和用户权限
这个需要在自己的本地环境完成
#### Step1: 添加用户并授予建表权限
```SQL
CREATE LOGIN st WITH PASSWORD='chengzi'
CREATE USER st FOR LOGIN st
GRANT create table to st
```

![Pasted image 20250410111140.png](/img/user/accessory/Pasted%20image%2020250410111140.png)
这三句话的意思 在服务器级别创建一个登录名 st 然后再当前数据库创建一个用户st, 关联登录名st 然后授予用户st创建表的权限

#### Step2: 创建架构Production和Person
```SQL
create schema Production2023406313；      --架构命名不能以数字开头
create schema Person2023406313  AUTHORIZATION  st；
```
注意这里有个坑是只能一句一句执行 两句一起运行会报错 
![Pasted image 20250410112018.png](/img/user/accessory/Pasted%20image%2020250410112018.png)
**Solution1: 可以用GO隔开**
![Pasted image 20250410113508.png](/img/user/accessory/Pasted%20image%2020250410113508.png)
**Solution2: 也可以一句一句运行**
![Pasted image 20250410112110.png|400](/img/user/accessory/Pasted%20image%2020250410112110.png)

呃呃这个报错不用管 运行成功了
![Pasted image 20250410112332.png|400](/img/user/accessory/Pasted%20image%2020250410112332.png)

![Pasted image 20250410113737.png|300](/img/user/accessory/Pasted%20image%2020250410113737.png)
两个架构的区别是:
- Prodection架构没有指定所有者用户: 默认是dbo
- Person架构制定了所有者为用户st -- 意味着st对Person架构下的对象拥有完全控制权

#### Step3: 使用st身份连接到本地服务器
![Pasted image 20250410112640.png|400](/img/user/accessory/Pasted%20image%2020250410112640.png)

#### Step4: 运行查询观察结果
在st身份新登录的服务器运行SQL语句
![Pasted image 20250410113819.png](/img/user/accessory/Pasted%20image%2020250410113819.png)

```SQL
create table Person2023406313.t1(id int,name char(10))    --成功

create table Production2023406313.t1(id int,name char(10)) -- 失败 why？
```
![Pasted image 20250410113905.png|400](/img/user/accessory/Pasted%20image%2020250410113905.png)

创建 `Person.t1` 表： 成功，因为用户 `st` 是 `Person` 架构的所有者。
创建 `Production.t1` 表： 失败，因为用户 `st` 不是 `Production` 架构的所有者，也没有对该架构的权限

### Task5: 修改表结构
> 修改表结构，具体要求如下：
> (1) 将表course的cname列的数据类型改为varchar(40).
> (2) 为表student增加一个新列: birthday(出生日期), 类型为datetime, 默认为空值.
> (3) 将表sc中的grade列的取值范围改为小于等于150的正数.
> (4) 为Student表的“Sex”字段创建一个缺省约束，缺省值为’男’
> (5)为“Sdept”字段创建一个检查约束，使得所在系必须是’CS’、’MA’或’IS’之一。
> (6)为Student表的“Sname”字段增加一个唯一性约束
> (7)为SC表建立外键,依赖于Student表的fk_S_c约束。
> (8)禁止启用Student表的“Sdept”的CHECK约束ck_student。

记得这里因为我在本地和远程服务器都建表了 所以 两个地方都需要改
#### Step1: 修改course表的cname列
将表course的cname列的数据类型改为varchar(40)
**Choice1: SQL语句**
```SQL
ALTER TABLE course2023406313
ALTER COLUMN cname VARCHAR(40);
```
![Pasted image 20250410115115.png|400](/img/user/accessory/Pasted%20image%2020250410115115.png)

**Choice2: 可视化操作**
![Pasted image 20250410114332.png|300](/img/user/accessory/Pasted%20image%2020250410114332.png)
![Pasted image 20250410114407.png|500](/img/user/accessory/Pasted%20image%2020250410114407.png)
记得保存
![Pasted image 20250410115153.png|500](/img/user/accessory/Pasted%20image%2020250410115153.png)
很有可能报错  所以说修改的本质是删除重新创建？
Solution: 菜单栏->工具->选项->设计器->表设计器和数据库设计器，右侧面板，取消勾选“阻止保存要求重新创建表的更改”。
![Pasted image 20250410115346.png|550](/img/user/accessory/Pasted%20image%2020250410115346.png)
在保存 就成功了
#### Step2: 为student表新增列
为表student增加一个新列: birthday(出生日期), 类型为datetime, 默认为空值.
**Choice 1: SQL**
```SQL
ALTER TABLE student2023406313 ADD birthday DATETIME NULL;
```
![Pasted image 20250410125205.png|400](/img/user/accessory/Pasted%20image%2020250410125205.png)
**Choice 2: 可视化**
![Pasted image 20250410125234.png|500](/img/user/accessory/Pasted%20image%2020250410125234.png)
可视化操作的时候记得保存
**确认是否成功**
![Pasted image 20250410133121.png](/img/user/accessory/Pasted%20image%2020250410133121.png)
#### Step3: 修改sc表中grade取值范围
将表sc中的grade列的取值范围改为小于等于150的正数.
**Choice 1: SQL**
SQL Server不支持修改  只能删除再创建
```SQL
ALTER TABLE sc2023406313 DROP CONSTRAINT chk_grade_range;

ALTER TABLE sc2023406313
ADD CONSTRAINT chk_grade_range
CHECK (grade >= 0 AND grade <= 150);
```
![Pasted image 20250410130712.png|400](/img/user/accessory/Pasted%20image%2020250410130712.png)
**Choice 2: 可视化**
设计 -> 右击检查约束
![Pasted image 20250410130641.png|500](/img/user/accessory/Pasted%20image%2020250410130641.png)
可视化操作的时候记得保存

#### Step4: 缺省约束
为Student表的“Sex”字段创建一个缺省约束，缺省值为’男’
**Choice 1: SQL**
```SQL
ALTER TABLE student2023406313
ADD CONSTRAINT df_ssex_default DEFAULT '男' FOR ssex;
```
![Pasted image 20250410131322.png|500](/img/user/accessory/Pasted%20image%2020250410131322.png)
**Choice 2: 可视化**
如果之前有默认约束 记得删除
![Pasted image 20250410131430.png|500](/img/user/accessory/Pasted%20image%2020250410131430.png)
可视化操作的时候记得保存
**确认是否成功**
![Pasted image 20250410133425.png|400](/img/user/accessory/Pasted%20image%2020250410133425.png)

#### Step5: 检查约束
为“Sdept”字段创建一个检查约束，使得所在系必须是’CS’、’MA’或’IS’之一。
**Choice 1: SQL**
```SQL
ALTER TABLE student2023406313 ADD 
CONSTRAINT chk_sdept_values 
CHECK (sdept IN ('CS', 'MA', 'IS'));
```
![Pasted image 20250410131807.png|400](/img/user/accessory/Pasted%20image%2020250410131807.png)
**Choice 2: 可视化**
![Pasted image 20250410132326.png|400](/img/user/accessory/Pasted%20image%2020250410132326.png)
可视化操作的时候记得保存
**确认是否成功**
![Pasted image 20250410133619.png](/img/user/accessory/Pasted%20image%2020250410133619.png)

#### Step6:  唯一性约束
 为Student表的“Sname”字段增加一个唯一性约束
 **Choice 1: SQL**
 ```SQL
 ALTER TABLE student2023406313 ADD CONSTRAINT UQ_Sname UNIQUE (Sname);
```
![Pasted image 20250410133752.png](/img/user/accessory/Pasted%20image%2020250410133752.png)
**Choice 2: 可视化**
在表设计视图中，右键单击空白区域，选择 **索引/键**。
![Pasted image 20250410133854.png|400](/img/user/accessory/Pasted%20image%2020250410133854.png)
在弹出的 **索引/键** 对话框中，点击左上角的 **添加** 按钮。在右侧的属性窗口中：类型选择 `唯一键`。列：点击右侧的省略号按钮（`...`），在弹出的对话框中选择 `Sname` 字段。名称框中为约束指定一个有意义的名称（例如 `UQ_Sname`）
![Pasted image 20250410134146.png|500](/img/user/accessory/Pasted%20image%2020250410134146.png)
**确认**
![Pasted image 20250410134239.png|400](/img/user/accessory/Pasted%20image%2020250410134239.png)
#### Step7: 外键
为SC表建立外键,依赖于Student表的fk_S_c约束。
？？？
我之前都建立了建表的时候

#### Step8: 禁止启用约束
禁止启用Student表的“Sdept”的CHECK约束ck_student。
我当时创建的时候叫`CK_student2023406313_sdept`
```SQL
ALTER TABLE student2023406313
NOCHECK CONSTRAINT CK_student2023406313_sdept;
```
![Pasted image 20250410134937.png|500](/img/user/accessory/Pasted%20image%2020250410134937.png)

### Task6: 建立索引
> 要求：
> 分别建立以下索引(如果不能成功建立,请分析原因)
> (1) 在student表的sname列上建立普通降序索引.
> (2) 在course表的cname列上建立唯一索引.
> (3) 在sc表的sno列上建立聚集索引.
> (4) 在spj表的sno(升序), pno(升序)和jno(降序)三列上建立一个普通索引.

远程服务器和本地服务器都能操作
#### Step1: 建立普通降序索引
在student表的sname列上建立普通降序索引.
**Choice1: SQL**
```SQL
CREATE INDEX IX_Student_Sname_Desc 
ON student2023406313 (sname DESC);
```
![Pasted image 20250410135638.png|500](/img/user/accessory/Pasted%20image%2020250410135638.png)
**Choice2: 可视化**
选择student2023406313表->右击设计->右击选择索引/键
![Pasted image 20250410140047.png](/img/user/accessory/Pasted%20image%2020250410140047.png)
可视化的时候记得保存
**确认是否成功**
![Pasted image 20250410140243.png|300](/img/user/accessory/Pasted%20image%2020250410140243.png)

#### Step2: 唯一索引
在course表的cname列上建立唯一索引.
**Choice1: SQL**
```SQL
CREATE UNIQUE INDEX UQ_Course_Cname ON course2023406313 (cname);
```
![Pasted image 20250410140504.png|500](/img/user/accessory/Pasted%20image%2020250410140504.png)
**Choice2: 可视化**
![Pasted image 20250410140616.png|500](/img/user/accessory/Pasted%20image%2020250410140616.png)
可视化的时候记得保存
**确认是否成功**
![Pasted image 20250410140654.png|400](/img/user/accessory/Pasted%20image%2020250410140654.png)

#### Step3: 聚集索引
在sc表的sno列上建立聚集索引.
```SQL
CREATE CLUSTERED INDEX IX_SC_Sno_Clustered ON SC2023406313 (sno);
```
![Pasted image 20250410140927.png](/img/user/accessory/Pasted%20image%2020250410140927.png)
因为聚集索引(聚簇索引)已经存在了  这是随着主键创建的
![Pasted image 20250410141053.png|500](/img/user/accessory/Pasted%20image%2020250410141053.png)

#### Step4: 多列普通索引
在spj表的sno(升序), pno(升序)和jno(降序)三列上建立一个普通索引.
**Choice1: SQL**
```SQL
CREATE UNIQUE INDEX IX_SPJ_Sno_Pno_Jno
ON spj2023406313 (Sno ASC, Pno ASC, Jno DESC);
```
![Pasted image 20250410141400.png|600](/img/user/accessory/Pasted%20image%2020250410141400.png)
**Choice2: 可视化**
![Pasted image 20250410141533.png|600](/img/user/accessory/Pasted%20image%2020250410141533.png)
可视化的时候记得保存
**确认是否成功**
![Pasted image 20250410141604.png](/img/user/accessory/Pasted%20image%2020250410141604.png)

### Task7: 有索引与无索引性能对比
在“新建查询”窗口下，复制如下全部代码，直接点“执行”，在消息窗口的最下面，可以看到有索引和无索引的查询耗时
```SQL
create table TableIndex

( ID int identity(1,1),

DataValue decimal(18,2)

)

go

/*---向TestIndex数据库表中插入20000条数据---*/

declare @r numeric(15,8)

declare @n int

set @n =1

while(1=1)

   begin

set @r = rand()

insert into  TableIndex (DataValue) values(@r)

set @n = @n + 1

    if(@n>20000)

break

   end

Go

/*---查询插入的数据---*/

select * from TableIndex

Go

/*----------------无索引查询-------------------*/

/*---计算开始时间---*/

set nocount on

declare @d datetime

set @d = getDate()

/*---查询DataValue值在0.3~0.9的数据---*/

select * from TableIndex

where DataValue between 0.3 and 0.9

/*---显示查询所需时间---*/

declare @time int

set @time = datediff(ms,@d,getDate())

print '无索引查询耗时：'+ convert(varchar(10),@time)

/*---------------添加索引-------------------*/

/*---为DataValue列添加索引---*/

if exists(select name from sysindexes where name = 'IX_DataValue')

drop index TableIndex.IX_DataValue   --删除索引

/*---添加索引---*/

create clustered index IX_DataValue

on TableIndex(DataValue)

with fillfactor = 30

Go

/*----------------有索引查询-------------------*/

/*---计算开始时间---*/

set nocount on

declare @d datetime

set @d = getDate()

/*---查询DataValue值在0.3~0.9的数据---*/

select * from TableIndex with(index=IX_DataValue)

where DataValue between 0.3 and 0.9

/*---显示查询所需时间---*/

declare @time int

set @time = datediff(ms,@d,getDate())

print '有索引查询耗时：'+ convert(varchar(10),@time)
```
![Pasted image 20250410141844.png](/img/user/accessory/Pasted%20image%2020250410141844.png)
