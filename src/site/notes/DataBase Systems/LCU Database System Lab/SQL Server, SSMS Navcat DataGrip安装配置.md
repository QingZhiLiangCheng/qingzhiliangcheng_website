---
{"dg-publish":true,"permalink":"/DataBase Systems/LCU Database System Lab/SQL Server, SSMS Navcat DataGrip安装配置/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-09T13:35:57.918+08:00","updated":"2025-04-10T10:41:39.632+08:00"}
---

### SQL Server安装
SQL Server下载地址: [SQL Server 2022 | Microsoft Evaluation Center](https://www.microsoft.com/zh-cn/evalcenter/download-sql-server-2022)
选择自定义安装 更改位置
![Pasted image 20250409184911.png|500](/img/user/accessory/Pasted%20image%2020250409184911.png)

选择好安装位置后 点安装
翻个墙速度会更快
安装完成后会蹦出下面这个画面
![Pasted image 20250409194133.png|500](/img/user/accessory/Pasted%20image%2020250409194133.png)
选择安装 -- 全新SQL Server独立安装或现有安装添加功能
![Pasted image 20250409194224.png|500](/img/user/accessory/Pasted%20image%2020250409194224.png)
我选的developer 然后下一步
![Pasted image 20250409194453.png|500](/img/user/accessory/Pasted%20image%2020250409194453.png)
接受 下一步
**不要点使用Microsoft更新检查 下一步**
继续下一步
这里本来选中的 去掉之后 下一步
![Pasted image 20250409194817.png|500](/img/user/accessory/Pasted%20image%2020250409194817.png)
功能选择 然后下一步
![Pasted image 20250409194911.png|500](/img/user/accessory/Pasted%20image%2020250409194911.png)

再下一步

这里本来是手动的 我改成自动了 然后下一步
![Pasted image 20250409195007.png|500](/img/user/accessory/Pasted%20image%2020250409195007.png)
选择混合模式 设置密码 然后添加当前用户
然后下一步 然后点击安装就行
![Pasted image 20250409195137.png|500](/img/user/accessory/Pasted%20image%2020250409195137.png)


如果出现防火墙警告的情况(忘了在哪里会出现了)
1. 打开"高级安全 Windows 防火墙"(Win+R 输入 WF.msc)
2. 在左边栏中，左键点击“入站规则”，然后在右边栏中单击“新建规则”。
3. 选择端口然后 下一步,选择“TCP”,然后在下面"特定本地端口"处输入SQLserver的端口号(默认1433)



### 可视化工具选择一 SSMS
安装SSMS
当然也可以使用Navcat
我建议使用SSMS 因为实验室环境是这个 而且SSMS是微软自己出的工具(虽然因为Visual Studio太占内存了我不太喜欢他们家的东西hhh)
下载网址: [下载 SQL Server Management Studio （SSMS） | Microsoft Learn](https://learn.microsoft.com/zh-cn/ssms/download-sql-server-management-studio-ssms#download-ssms)
一定下中文版中文版中文版！！！
![Pasted image 20250409213517.png|400](/img/user/accessory/Pasted%20image%2020250409213517.png)
除了选择安装地址 无脑下一步
**连接数据库**
连接数据库之前先启动服务
- 法一: cmd 管理页运行 运行`net start mssqlserver`
- 法二:  在开始菜单中搜索_SQL Server配置管理器_，右键点击并选择“以管理员身份运行”。在配置管理器中，找到并右键点击需要启动的SQL Server服务，选择“启动”。
连接本地服务器
可能需要点信任服务器证书
![Pasted image 20250409221553.png|400](/img/user/accessory/Pasted%20image%2020250409221553.png)

连接远程服务器
服务器ip地址   10.200.7.129（实验室和宿舍都可以访问）
登录账户和密码相同，3班为dbuser202303，对应数据库db202303；4班为dbuser202304、对应数据库db202304；5班为dbuser202305，对应数据库db202305；6班为dbuser202306，对应数据库db202306
![Pasted image 20250409223038.png|400](/img/user/accessory/Pasted%20image%2020250409223038.png)



### 其他可视化工具 Navcat/ DataGrip
Navcat比较好用 DataGrip是Jetbrain的 不过我感觉DataGrip上千条数据之后容易卡 个人不太推荐
Navicat下载地址: [Navicat | Download Navicat Premium 14-day trial versions for Windows, macOS and Linux](https://www.navicat.com/en/download/navicat-premium)
除了选择安装地址 一路下一步就行
然后最重要的是要破解一下
补丁我放到百度网盘了:  https://pan.baidu.com/s/1Zylc2bBdJRNFO2xwUDkzrw?pwd=QZLC 提取码: QZLC 