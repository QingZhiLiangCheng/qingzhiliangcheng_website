---
{"tags":["project","cmu15445","bustub"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Project 2 Hash Index (fall2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-30T23:10:47.890+08:00","updated":"2025-05-01T14:33:53.946+08:00"}
---

### Task 1 - Read/Write Page Guards
task 1 要实现三个类 分别是BasicPageGuard, ReadPageGuard, WritePageGuard.
在这里名字似乎BasicPageGuard是基类 但这里bustub源码中并没有用继承 他们之间属于has-a的关系 BasicPageGuard是ReadPageGuard与WritePageGuard的成员
同时 ReadPageGuard与WritePageGuard是BasicPageGuard的友元类 -- 可以访问BasicPageGuard的任意成员
为什么实现这三个类？
Project 1中实现了Buffer Pool, Buffer Pool以页为基本单位，对外提供内存资源。页被封装为Page，Page具有一个十分重要的属性：`pin_count_`，表示正在使用该Page的线程数量
pin_count_非0时，Buffer Pool无法驱逐该Page，也就是无法从磁盘加载数据到内存。显而易见的是：如果程序出现意外，某个Page的pin_count_永不为0，轻则降低DBMS的运行速度，重则使系统崩溃，无法加载数据。也可以说，这是一种资源泄漏。
C++如何解决资源泄漏？一个经典的例子：使用智能指针解决内存泄漏。智能指针依赖于RAII机制：利用对象的生命周期，在构造函数中获取资源，在析构函数中释放资源。而我们要实现的PageGuard只使用了RAII的一部分：在析构函数中释放资源。同时还提供了手动释放资源的接口，以提高DBMS在并发环境下的运行效率。
PageGuard函数实现
对于每个类实现
- 移动构造函数
- 移动赋值函数
- `Drop()`：手动释放资源，并放弃对资源的管理权
- 析构函数

> [!todo]
> You will need to implement the following functions for all `BasicPageGuard`, `ReadPageGuard` and `WritePageGuard`.
> - `PageGuard(PageGuard &&that)`: Move constructor.
> - `operator=(PageGuard &&that)`: Move operator.
> - `Drop()`: Unpin and/or unlatch.
> - `~PageGuard()`: Destructor.

这里有好多我没听过或者不熟悉的术语
[[high-language/CPP/右值引用 移动语义\|右值引用 移动语义]]

