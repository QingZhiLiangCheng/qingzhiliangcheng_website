---
{"dg-publish":true,"tags":[],"permalink":"/DataBase Systems/LCU Database System Lab/SQL Server, SSMS Navcat DataGrip安装配置/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-09T13:35:57.918+08:00","updated":"2025-04-09T22:16:04.199+08:00"}
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
不要点使用Microsoft更新检查 下一步
继续下一步
![Pasted image 20250409194817.png|500](/img/user/accessory/Pasted%20image%2020250409194817.png)
这里本来选中的 去掉之后 下一步
功能选择 然后下一步
![Pasted image 20250409194911.png|500](/img/user/accessory/Pasted%20image%2020250409194911.png)

再下一步
![Pasted image 20250409195007.png|500](/img/user/accessory/Pasted%20image%2020250409195007.png)
这里本来是手动的 我改成自动了
![Pasted image 20250409195137.png|500](/img/user/accessory/Pasted%20image%2020250409195137.png)
选择混合模式 设置密码 然后添加当前用户
然后下一步 然后点击安装就行

如果出现防火墙警告的情况(忘了在哪里会出现了)
1. 打开"高级安全 Windows 防火墙"(Win+R 输入 WF.msc)
2. 在左边栏中，左键点击“入站规则”，然后在右边栏中单击“新建规则”。
3. 选择端口然后 下一步,选择“TCP”,然后在下面"特定本地端口"处输入SQLserver的端口号(默认1433)



### 可视化工具选择一 SSMS
安装SSMS
当然也可以使用Navcat
我建议使用SSMS 因为实验室环境是这个 而且SSMS是微软自己出的工具(虽然因为Visual Studio太占内存了我不太喜欢他们家的东西hhh)
下载网址: [下载 SQL Server Management Studio （SSMS） | Microsoft Learn](https://learn.microsoft.com/zh-cn/ssms/download-sql-server-management-studio-ssms#download-ssms)
![Pasted image 20250409213517.png|400](/img/user/accessory/Pasted%20image%2020250409213517.png)
除了选择安装地址 无脑下一步
如果需要可以在设置里面却换成中文
**连接数据库**
连接本地数据库
![Pasted image 20250409221553.png|400](/img/user/accessory/Pasted%20image%2020250409221553.png)

连接

### 其他可视化工具 Navcat/ DataGrip
Navcat比较好用 DataGrip是Jetbrain的 不过我感觉DataGrip上千条数据之后容易卡 个人不太推荐
Navicat下载地址: [Navicat | Download Navicat Premium 14-day trial versions for Windows, macOS and Linux](https://www.navicat.com/en/download/navicat-premium)
除了选择安装地址 一路下一步就行
然后最重要的是要破解一下
补丁我放到百度网盘了: