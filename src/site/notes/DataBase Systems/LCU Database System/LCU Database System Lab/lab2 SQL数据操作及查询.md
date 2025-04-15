---
{"dg-publish":true,"tags":[],"permalink":"/DataBase Systems/LCU Database System/LCU Database System Lab/lab2 SQL数据操作及查询/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-14T14:07:04.241+08:00","updated":"2025-04-14T17:30:01.683+08:00"}
---

连接数据库见前面几篇笔记
### Task 1:  为StudentDB插入数据
> 要求:
> 使用INSERT语句将教材P82表中的数据添加到数据库STUDENTDB中

StudentDB就是[[DataBase Systems/LCU Database System/LCU Database System Lab/lab1 模式定义与数据完整性操作\|lab1 模式定义与数据完整性操作]]中在本地创建的数据库 远程服务器中也有
课本P82页的表 我猜这个表数据库所有的信息其实是课本P40页的表
![Pasted image 20250414143702.png|500](/img/user/accessory/Pasted%20image%2020250414143702.png)
有需要看电子书的我放在了网盘 https://pan.baidu.com/s/1pzAJqBN0LuXk838H7WnD5Q?pwd=QZLC 提取码: QZLC
有外键注意插入顺序
#### Step 1: 为student表插入数据
StudentDB的student表  经过上一个lab student表如下图所示
![Pasted image 20250414143124.png|500](/img/user/accessory/Pasted%20image%2020250414143124.png)
这里注意多了一个sage的属性 需要自己算 课本中是用了Kingbase的内置函数 -- 我用了SQL Server的内置函数来计算age `DATEDIFF(YEAR, '2000-03-08', GETDATE())`
在lab1 Task5 Step8中是禁用了当时Step5插入的检查约束
如果只执行Insert语句不行 在执行一遍前面的禁用语句就行(或者直接去删掉那个约束hhh)  **我为了避免麻烦 后来直接删了**
```SQL
ALTER TABLE student2023406313
NOCHECK CONSTRAINT CK_student2023406313_sdept;

GO

INSERT INTO student2023406313 (sno, sname, ssex, sage, sdept,birthday)
VALUES 
('20180001', '李勇', '男', DATEDIFF(YEAR, '2000-03-08', GETDATE()), '信息安全','2000-03-08'),
('20180002', '刘晨', '女', DATEDIFF(YEAR, '1999-09-01', GETDATE()), '计算机科学与技术','1999-09-01'),
('20180003', '王敏', '女', DATEDIFF(YEAR, '2001-08-01', GETDATE()), '计算机科学与技术', '2001-08-01'),
('20180004', '张立', '男', DATEDIFF(YEAR, '2000-01-08', GETDATE()), '计算机科学与技术', '2000-01-08'),
('20180005', '陈新奇', '男', DATEDIFF(YEAR, '2001-11-01', GETDATE()), '信息管理与信息系统','2001-11-01'),
('20180006', '赵明', '男', DATEDIFF(YEAR, '2000-06-12', GETDATE()), '数据科学与大数据技术', '2000-06-12'),
('20180007', '王佳佳', '女', DATEDIFF(YEAR, '2001-12-07', GETDATE()), '数据科学与大数据技术', '2001-12-07');
```
![Pasted image 20250414150403.png](/img/user/accessory/Pasted%20image%2020250414150403.png)

<font color="#ff0000">这里面有个坑 会提示被截断了  因为 “计算机科学与技术” 中文汉字占两个字符 而sdept只有char(15) 所有只能存到“技”字 我这里直接开char(20) 还有个数据科学与大数据技术hhh</font>

![Pasted image 20250414150726.png|500](/img/user/accessory/Pasted%20image%2020250414150726.png)

插入成功后可以通过右击选择前1000行来查看插入的信息
![Pasted image 20250414150803.png](/img/user/accessory/Pasted%20image%2020250414150803.png)

<font color="#ff0000">然后你会发现还有一个坑 birthday是 datetime类型  这里应该用 date类型更合适一些</font>
改完见下图
![Pasted image 20250414151313.png|400](/img/user/accessory/Pasted%20image%2020250414151313.png)


#### Step 2: 为Course表插入数据
![Pasted image 20250414153617.png|500](/img/user/accessory/Pasted%20image%2020250414153617.png)
有一个坑 得给cno和cpno变成char(5)类型
然后插入数据
```SQL
INSERT INTO course2023406313 (Cno, Cname, Ccredit, Cpno)
VALUES 
('81001', '程序设计基础与C语言', 4, NULL),
('81002', '数据结构', 4, '81001'),
('81003', '数据库系统概论', 4, '81002'),
('81004', '信息系统概论', 4, '81003'),
('81005', '操作系统', 4, '81001'),
('81006', 'Python语言', 3, '81002'),
('81007', '离散数学', 4, NULL),
('81008', '大数据技术概论', 4, '81003');
```
![Pasted image 20250414153952.png|500](/img/user/accessory/Pasted%20image%2020250414153952.png)

![Pasted image 20250414154021.png](/img/user/accessory/Pasted%20image%2020250414154021.png)

#### Step 3: 为SC表插入数据
![Pasted image 20250414154130.png|500](/img/user/accessory/Pasted%20image%2020250414154130.png)

需要先给SC表插入两列 semester: char(5) 和 teachingclass: char(8)
![Pasted image 20250414154529.png|500](/img/user/accessory/Pasted%20image%2020250414154529.png)
```SQL
INSERT INTO sc2023406313(Sno, Cno, Grade, Semester, teachingclass)
VALUES 
('20180001', '81001', 85, '20192', '81001-01'),
('20180001', '81002', 96, '20201', '81002-01'),
('20180001', '81003', 87, '20202', '81003-01'),
('20180002', '81001', 80, '20192', '81001-02'),
('20180002', '81002', 98, '20201', '81002-01'),
('20180002', '81003', 71, '20202', '81003-02'),
('20180003', '81001', 81, '20192', '81001-01'),
('20180003', '81002', 76, '20201', '81002-02'),
('20180004', '81001', 56, '20192', '81001-02'),
('20180004', '81002', 97, '20201', '81002-02'),
('20180005', '81003', 68, '20202', '81003-01');
```

![Pasted image 20250414154749.png|500](/img/user/accessory/Pasted%20image%2020250414154749.png)

![Pasted image 20250414154808.png|400](/img/user/accessory/Pasted%20image%2020250414154808.png)

### Task 2:  为SPJDB插入数据
> 要求:
> 将教材P70表中的数据添加到数据库SPJDB中. 体会执行插入操作时检查实体完整性规则、参照完整性规则和用户定义完整性规则的效果.

整个表不在70页  在65页
![Pasted image 20250414160705.png|700](/img/user/accessory/Pasted%20image%2020250414160705.png)
#### Step 1: 为S表插入数据
![Pasted image 20250414161001.png|600](/img/user/accessory/Pasted%20image%2020250414161001.png)
```SQL
INSERT INTO S2023406313(SNO, SNAME, STATUS, CITY)
VALUES 
('S1', '精益', 20, '天津'),
('S2', '盛锡', 10, '北京'),
('S3', '东方红', 30, '北京'),
('S4', '丰泰盛', 20, '天津'),
('S5', '为民', 30, '上海');
```
![Pasted image 20250414161232.png|500](/img/user/accessory/Pasted%20image%2020250414161232.png)

![Pasted image 20250414161257.png](/img/user/accessory/Pasted%20image%2020250414161257.png)

#### Step 2: 为P表插入数据
![Pasted image 20250414161408.png|500](/img/user/accessory/Pasted%20image%2020250414161408.png)
```SQL
INSERT INTO P2023406313 (PNO, PNAME, COLOR, WEIGHT)
VALUES 
('P1', '螺母', '红', 12),
('P2', '螺栓', '绿', 17),
('P3', '螺丝刀', '蓝', 14),
('P4', '螺丝刀', '红', 14),
('P5', '凸轮', '蓝', 40),
('P6', '齿轮', '红', 30);
```
![Pasted image 20250414161436.png|400](/img/user/accessory/Pasted%20image%2020250414161436.png)
![Pasted image 20250414161532.png|400](/img/user/accessory/Pasted%20image%2020250414161532.png)

#### Step 3: 为J表插入数据
![Pasted image 20250414161927.png|500](/img/user/accessory/Pasted%20image%2020250414161927.png)
```SQL
INSERT INTO J2023406313(JNO, JNAME, CITY)
VALUES 
('J1', '三建', '北京'),
('J2', '一汽', '长春'),
('J3', '弹簧厂', '天津'),
('J4', '造船厂', '天津'),
('J5', '机车厂', '唐山'),
('J6', '无线电厂', '常州'),
('J7', '半导体厂', '南京');
```
![Pasted image 20250414161821.png|500](/img/user/accessory/Pasted%20image%2020250414161821.png)
![Pasted image 20250414162446.png](/img/user/accessory/Pasted%20image%2020250414162446.png)
#### Step 4: 为SPJ表插入数据
![Pasted image 20250414162620.png|500](/img/user/accessory/Pasted%20image%2020250414162620.png)
```SQL
INSERT INTO SPJ2023406313 (SNO, PNO, JNO, QTY)
VALUES 
('S1', 'P1', 'J1', 200),
('S1', 'P1', 'J3', 100),
('S1', 'P1', 'J4', 700),
('S1', 'P2', 'J2', 100),
('S2', 'P3', 'J1', 400),
('S2', 'P3', 'J2', 200),
('S2', 'P3', 'J4', 500),
('S2', 'P3', 'J5', 400),
('S2', 'P5', 'J1', 400),
('S2', 'P5', 'J2', 100),
('S3', 'P1', 'J1', 200),
('S3', 'P3', 'J1', 200),
('S4', 'P5', 'J1', 100),
('S4', 'P6', 'J3', 300),
('S4', 'P6', 'J4', 200),
('S5', 'P2', 'J4', 100),
('S5', 'P3', 'J1', 200),
('S5', 'P6', 'J2', 200),
('S5', 'P6', 'J4', 500);
```
![Pasted image 20250414162821.png|400](/img/user/accessory/Pasted%20image%2020250414162821.png)
![Pasted image 20250414162911.png](/img/user/accessory/Pasted%20image%2020250414162911.png)

### Task 3: 级联层叠删除
> 要求: 
> 删除student表中学号为201215121的学生，体会执行删除操作时检查参照完整性规则的效果.将参照完整性中的删除规则改为“级联(层叠)”(CASCADE)，重新删除该学生信息。

![Pasted image 20250414165244.png|500](/img/user/accessory/Pasted%20image%2020250414165244.png)
<font color="#ff0000">呃呃根本就没有 这里建议改成20180005</font>
因为20180005在sno表和sc表都存在
![Pasted image 20250414171248.png|400](/img/user/accessory/Pasted%20image%2020250414171248.png)
![Pasted image 20250414171356.png|400](/img/user/accessory/Pasted%20image%2020250414171356.png)
#### Approach 1: SQL
如果直接运行下列语句会发现报错 -- 是因为如果 student 表的 sno 被sc选课表的外键引用，且外键的删除规则为默认的 NO ACTION，则删除操作会失败，并报错
```SQL
DELETE FROM student WHERE sno = '201810005';
```
![Pasted image 20250414165421.png](/img/user/accessory/Pasted%20image%2020250414165421.png)
我的这个外键叫`FK_sc_student2023406313` 用SQL语句 需要删除这个外键 然后创建一个新的满足 级联层叠删除的
```SQL
-- 删除原有外键约束
ALTER TABLE sc2023406313 DROP CONSTRAINT FK_sc_student2023406313;

-- 重新创建外键约束并启用级联删除
ALTER TABLE sc2023406313 
ADD CONSTRAINT FK_sc_student2023406313 
FOREIGN KEY (sno) 
REFERENCES student2023406313(sno) 
ON DELETE CASCADE;

DELETE FROM student2023406313 WHERE sno = '20180005';
```
![Pasted image 20250414170746.png|500](/img/user/accessory/Pasted%20image%2020250414170746.png)
然后你会发现 sc表和student表中有关2018005的都删掉了
![Pasted image 20250414171142.png|400](/img/user/accessory/Pasted%20image%2020250414171142.png)
![Pasted image 20250414171206.png|400](/img/user/accessory/Pasted%20image%2020250414171206.png)
#### Approach 2: SSMS
如果直接选择删除 也是会报错
![Pasted image 20250414165716.png](/img/user/accessory/Pasted%20image%2020250414165716.png)
![Pasted image 20250414165742.png|500](/img/user/accessory/Pasted%20image%2020250414165742.png)
![Pasted image 20250414165801.png|400](/img/user/accessory/Pasted%20image%2020250414165801.png)
Soluton: 
![Pasted image 20250414171853.png|400](/img/user/accessory/Pasted%20image%2020250414171853.png)
将删除规则设置为级联
![Pasted image 20250414172338.png|500](/img/user/accessory/Pasted%20image%2020250414172338.png)
记得ctrl s 保存
然后执行删除操作


