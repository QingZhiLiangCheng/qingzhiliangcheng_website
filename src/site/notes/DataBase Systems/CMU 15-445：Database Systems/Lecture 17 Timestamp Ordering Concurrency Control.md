---
{"tags":["cmu15445","week11"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 17 Timestamp Ordering Concurrency Control/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-19T16:13:11.416+08:00","updated":"2025-04-22T17:00:09.955+08:00"}
---

![[17-timestampordering.pdf]]

### Last Class
![Pasted image 20250422162535.png|400](/img/user/accessory/Pasted%20image%2020250422162535.png)
这个例子是假设我们知道andy的记录在tuple 1, 所以我们给table加IS锁, 给 tuple1加S锁(其实是用了两个锁 如果我不知道andy的记录在哪里 我就需要从tuple1开始一个一个加s锁 所以 完全有理由只给table加S锁)
而IS锁的好处 就是 我可以同时加IX锁 也就是说 我可以同时对table的一部分进行read而对另一部分进行write
![Pasted image 20250422162941.png|450](/img/user/accessory/Pasted%20image%2020250422162941.png)
所以有了意向锁 有了更多的空间来灵活处理事务 如果我们知道存在一个索引或者新纪录的位置已知的情况下 那么这里就体现出优势了
事实上这里并没有将索引所谓单独的访问路径展示 但一般理论表明 数据的组织资源层次结构并不必然是树状的 可能是一个有向无环图(DAG) 但是思路类似

作为应用程序开发者 通常不会手动获取这些锁；SQL语句提供了允许锁定整个表的操作 但并不推荐这么做 这些锁 会在系统的适当节点中被获取
![Pasted image 20250422164901.png|500](/img/user/accessory/Pasted%20image%2020250422164901.png)
只允许共享锁和独占锁

行级锁
![Pasted image 20250422165737.png|500](/img/user/accessory/Pasted%20image%2020250422165737.png)`SELECT * FROM <table> WHERE <qualification> FOR UPDATE;`。这条语句不仅执行查询，还会对匹配的元组（行）设置排他锁。这意味着其他事务在当前事务完成或释放锁之前不能修改这些行。
同时给了相容性矩阵

