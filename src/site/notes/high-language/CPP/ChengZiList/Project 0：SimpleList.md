---
{"tags":["project","ChengZiList"],"dg-publish":true,"permalink":"/high-language/CPP/ChengZiList/Project 0：SimpleList/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-28T12:54:28.282+08:00","updated":"2025-04-29T22:00:09.626+08:00"}
---


### Task1: 克隆仓库 并 运行
**克隆仓库**
转到此处[New repository](https://github.com/new)在您的账户下创建新的存储库。选择一个名称（例如`ChengZiList-yourname）
在您的电脑上克隆情栀凉橙的ChengZiList仓库
```bash
git clone https://github.com/QingZhiLiangCheng/ChengZiList.git ChengZiList-QingZhiLiangCheng
```
接下来将情栀凉橙的ChengZiList镜像到您自己的ChengZiList存储库. 假设您的GitHub名称是`student`,仓库名称是`ChengZiList-yourname`
```bash
cd ChengZiList-QingZhiLiangCheng

# if you pull / push over HTTPS
git push https://github.com/student/ChengZiList-yourname.git main

# if you pull / push over SSH
git push git@github.com:student/ChengZiList-yourname.git main
```
现在可以删除情栀凉橙的仓库的克隆
```shell
cd ..

# if you are linux or macOS
rm -rf ChengZiList-QingZhiLiangCheng

# if you are windows
rmdir /s /q ChengZiList-QingZhiLiangCheng
```
将您自己的仓库克隆到您的计算机
```shell
# If you pull / push over HTTPS
git clone https://github.com/student/ChengZiList-yourname.git

# If you pull / push over SSH
git clone git@github.com:student/ChengZiList-yourname.git
```
将情栀凉橙的存储库添加为第二个远程仓库。这允许您从情栀凉橙的存储库中检索更改
```shell
git remote add QingZhiLiangCheng https://github.com/QingZhiLiangCheng/ChengZiList.git
```
验证
```bash
$ git remote -v
QingZhiLiangCheng https://github.com/QingZhiLiangCheng/ChengZiList.git (fetch)
QingZhiLiangCheng https://github.com/QingZhiLiangCheng/ChengZiList.git (push)
origin  https://github.com/student/ChengZiList-yourname.git (fetch)
origin  https://github.com/student/ChengZiList-yourname.git (push)
```
现在，您可以根据需要从情栀凉橙的存储库中提取更改
```bash
git pull QingZhiLiangCheng main
```
我建议搭建在Ubuntu或者是macOS上开发 如果您用的是Windows其实也没问题(我用的是Ubuntu hhh)
请大家遵守代码规范，我使用的是Google C++代码规范 [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) 当然国内Google C++代码规范可能用的比较少？ 遵循别的开发规范也可以 但是一定要尽量遵守开发规范

**Build**
如果您用的是Ubuntu (建议)
```bash
mkdir build
cd build
cmake ..
make
```

**运行example_test测试**
如果您用的是Ubuntu(建议) 在shell中运行
```shell
cd build
make example_test -j$(nproc)
./test/example_test
```
您也可以在CLion中运行调试配置处 选择或配置`example_test` 然后运行；或者前往`/test/example_test` 点击左侧的运行按钮运行单个测试
不管哪种方式 测试通过证明环境没有问题
那就可以正式开始啦！
### Task 2: SimpleList
您将在`src/simple_list.h`中实现一个简单的不能再简单的链表，链表是一种常见的线性数据结构，由一系列节点组成，每个节点包含两部分，数据域和指针域
您需要实现一个`SimpleList`类,并包含两个成员变量:整形类型的`data_` 和`SimpleList* next_` 设置成public的
现在事实上您可以在`src/min.cpp`中通过下面的语句构建一个简单的链表
```cpp
SimpleList* simple_list=new SimpleList;  
simple_list->data_=1;  
simple_list->next_=new SimpleList;  
simple_list->next_->data_=10;  
std::cout<<simple_list->next_->data_<<std::endl;
```
可以在网站[Python Tutor code visualizer: Visualize code in Python, JavaScript, C, C++, and Java](https://pythontutor.com/visualize.html#mode=edit)查看过程可视化 但是要记得把`simple_list.h`的代码也复制进去
![Pasted image 20250428140608.png|500](/img/user/accessory/Pasted%20image%2020250428140608.png)
需要您实现完成以下任务
- 无参构造函数
 - 有参构造 传入data next默认为nullptr  
- 有参构造 依次传入data和next  
- 试一下这两个写成一个有参构造函数？

**运行测试**
您需要先前往`test/simple_list_test`中将ifdef和endif标签去掉
您可以使用测试框架测试 我们将GTest用于单元测试用例 您可以从命令行单独编译和运行每一个测试(如果您是Ubantu的话)
```bash
cd build
make simple_test -j
./test/simple_list_test
```
在CLion中配置运行调试配置处 配置 `simple_list_test` 点击运行也可以
运行通过即意味着Project 0通过啦 🥰  可以开始正式的Project 1的学习了！！

**提交您的代码**
您可以将自己的代码提交到自己的git仓库 不要提交到我的git仓库啊