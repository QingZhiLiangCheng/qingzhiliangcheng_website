---
{"tags":["LCU操作系统"],"dg-publish":true,"permalink":"/Operating System/LCU Operating System/Lab2 动态资源分配实验/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-26T16:05:27.659+08:00","updated":"2025-04-26T19:53:23.771+08:00"}
---

Lab2 主要是 模拟 银行家算法 最后主要是补全了一个safe函数

### 银行家算法介绍
银行家算法的核心在于先试探 虚拟分配给该进程资源 然后通过安全性算法判断分配后的系统是否处于安全状态 若不安全则试探作废 让进程继续等待
什么是安全状态？
若在某一时刻，系统能按某种进程顺序如${P_1,P_2,...,P_n}$为每个进程分配其所需的资源 直至最大需求 使每个进程均可顺利完成 则称此时系统的状态为安全状态
银行家算法的实质就是要设法保证系统动态分配资源后不进入不安全状态，以避免可能产生的死锁

### 银行家算法分析
#### 银行家算法使用的主要数据结构
- 可利用资源向量  `int Available[j]` -- j为资源的种类。`Available[x]=k`代表了x类资源的数量为k。它帮助确定是否有足够的资源来满足进程的请求。
- 最大需求矩阵 `int Max[i][j]` -- `i`代表进程的数量，`j`代表资源种类的数量。`Max[i][j]`表示第`i`个进程对第`j`种资源的最大需求量。
- 分配矩阵`int Allocation[i][j]` --  `Allocation[i][j]`表示第`i`个进程当前已经被分配的第`j`种资源的数量。通过比较`Allocation`和`Max`，可以计算出还需要多少资源才能使进程完成其任务。
- 需求矩阵  `int need[i][j]= Max[i][j]- Allocation[i][j]` -- `need[i][j]`表示为了完成任务，第`i`个进程还需要额外获得的第`j`种资源的数量。它是通过从`Max`中减去`Allocation`对应的值来计算得到的。
- 申请各类资源数量 `int  Request i[j]`  -- 这个数组表示某个特定进程（假设为第`i`个进程）请求的各种资源的数量。例如，如果进程`i`请求资源`j`的数量，则会更新`Request i[j]`。这个数组用于模拟进程对资源的请求操作。

#### 安全性算法使用的主要数据结构
- 工作向量 `int Work[x]` -- 初始时等于`Available`数组，表示系统目前可用于分配给进程的资源总量。在算法执行过程中，随着资源被分配给进程，`Work`会相应减少。
- 完成标记`int Finish[y]` --  用来标记每个进程是否已经完成

在代码中体现为
```c
const int x=10,y=10;   //常量，便于修改

int Available[x];      //各资源可利用的数量

int Allocation[y][y];  //各进程当前已分配的资源数量

int Max[y][y];  //各进程对各类资源的最大需求数

int Need[y][y]; //尚需多少资源

int Request[x]; //申请多少资源

int Work[x]; //工作向量，表示系统可提供给进程继续运行所需的各类资源数量

int Finish[y]; //表示系统是否有足够的资源分配给进程，1为是

int p[y];  //存储安全序列

int i,j;   //i表示进程，j表示资源

int n,m;  //n为进程i的数量,m为资源j种类数

int l=0;   //l用来记录有几个进程是Finish[i]=1的，当l=n是说明系统状态是安全的

int counter=0;
```

#### 算法执行步骤
**初始化信息**
- 设置各种资源可利用的数量
- 各个进程已分配的各个资源的数量
- 各个进程对各个资源的最大需求量

->算出了各个进程对各个资源的需求量
```cpp
void chushihua() {  
    cout << "输入进程的数量: ";//从此开始输入有关数据  
    cin >> n;  
    cout << "输入资源种类数: ";  
    cin >> m;  
    cout << endl << "输入各种资源当前可用的数量( " << m << " 种): " << endl;  
    for (j = 0; j < m; j++) {  
        cout << "输入资源 " << j << " 可利用的数量Available[" << j << "]: ";  
        cin >> Available[j]; //输入数字的过程...  
        Work[j] = Available[j];      //初始化Work[j]，它的初始值就是当前可用的资源数  
    }  
  
    cout << endl << "输入各进程当前已分配的资源数量Allocation[" << n << "][" << m << "]: " << endl;  
    for (i = 0; i < n; i++) {  
        for (j = 0; j < m; j++) {  
            cout << "     输入进程 " << i << " 当前已分配的资源 " << j << " 数量: ";  
            cin >> Allocation[i][j];  
        }  
        cout << endl;  
        Finish[i] = 0;//初始化Finish[i]  
    }  
  
    cout << endl << "输入各进程对各类资源的最大需求Max[" << n << "][" << m << "]: " << endl;  
    for (i = 0; i < n; i++) {  
        for (j = 0; j < m; j++) {  
            cout << "   输入进程 " << i << " 对资源 " << j << " 的最大需求数: ";  
            cin >> Max[i][j];  
            if (Max[i][j] >= Allocation[i][j]) //若最大需求大于已分配，则计算需求量  
                Need[i][j] = Max[i][j] - Allocation[i][j];  
            else  
                Need[i][j] = 0;//Max小于已分配的时候，此类资源已足够不需再申请  
        }  
        cout << endl;  
    }  
    cout << endl << "初始化完成" << endl;  
}
```
呃呃我也不知道为啥实验报告上竟然还用拼音命名。。。。

**银行家算法**
算法流程如图 其实对着代码还蛮好理解的
![lab2.png](/img/user/accessory/lab2.png)

```cpp
//银行家算法函数  
void bank() {  
    cout << endl << "进程申请分配资源：" << endl;  
  
    int k = 0;  //用于输入进程编号  
    bool r = false;  // 初值为假，输入Y继续申请则置为真  
    do {//输入请求  
        cout << "输入申请资源的进程(0-" << n - 1 << "): ";  
        cin >> k;  
        cout << endl;  
        while (k > n - 1) //输入错误处理  
        {  
            cout << endl << "输入错误，重新输入：" << endl;  
            cout << endl << "输入申请资源的进程(0--" << n - 1 << "): ";  
            cin >> k;  
            cout << endl;  
        }  
        cout << endl << "输入该进程申请各类资源的数量: " << endl;  
        for (j = 0; j < m; j++) {  
            do {  //do……while 循环判断申请输入的情况  
                cout << "进程 " << k << " 申请资源[" << j << "]的数量:";  
                cin >> Request[j];  
                cout << endl;  
                if (Request[j] > Need[k][j]) {  //申请大于需求量时出错，提示重新输入（贷款数目不允许超过需求数目）  
                    cout << "申请大于需要量!" << endl;  
                    cout << "申请的资源" << j << "的数量为" << Request[j] << ",大于进程" << k << "对该资源需求量"  
                         << Need[k][j] << "。" << endl;  
                    cout << "重新输入!" << endl;  
                } else   //先判断是否申请大于需求量，再判断是否申请大于可利用量  
                if (Request[j] > Available[j]) {  //申请大于可利用量， 应该阻塞等待？……    ？？？  
                    cout << "\n没有那么多资源，目前可利用资源" << j << "数量为" << Available[j] << ",本次申请不成功，进程等待!"  
                         << endl;  
                    Finish[k] = 0;  //该进程等待  
                    goto ppp;  //goto语句 跳转，结束本次申请  
                }  
            } while (Request[j] > Need[k][j]);  //Request[j]>Available[j]||  
        }  
        //改变Avilable、Allocation、Need的值  
        for (j = 0; j < m; j++) {  
            Available[j] = Available[j] - Request[j];  
            Allocation[k][j] = Allocation[k][j] + Request[j];  
            Need[k][j] = Need[k][j] - Request[j];  
            Work[j] = Available[j];  
        }  
        //判断当前状态的安全性  
        safe();  //调用安全性算法函数  
        if (l < n) {  
            l = 0;  
            cout << "\n试分配后，状态不安全,所以不予分配!恢复原状态" << endl;  
            //恢复数据  
            for (j = 0; j < m; j++) {  
                Available[j] = Available[j] + Request[j];  
                Allocation[k][j] = Allocation[k][j] - Request[j];  
                Need[k][j] = Need[k][j] + Request[j];  
                Work[j] = Available[j];  
            }  
            for (i = 0; i < n; i++)  
                Finish[i] = 0;  //进程置为未分配状态  
        } else {  
            l = 0;  
            cout << "\n申请资源成功!!!" << endl;  
            for (j = 0; j < m; j++) {  
                if (Need[k][j] == 0);  
                else {     //有一种资源还没全部申请到，则该进程不可执行，不能释放拥有的资源  
                    l = 1;   //置l为1，作为判断标志  
                    break;  
                }  
            }  
            if (l != 1) { //进程可以执行，则释放该进程的所有资源  
                for (j = 0; j < m; j++) {  
                    Available[j] = Available[j] + Allocation[k][j];  
                    Allocation[k][j] = 0;  
                }  
                cout << "该进程已得到所有需求资源，执行后将释放其所有拥有资源！" << endl;  
            }  
            l = 0;  //归零  
            cout << "\n安全的状态!" << endl;  
            cout << "安全序列为:   ";  
            cout << endl << "进程" << "(" << p[0] << ")";  //输出安全序列，考虑显示格式，先输出第一个  
            Finish[0] = 0;  
            for (i = 1; i < n; i++) {  
                cout << "==>>" << "进程" << "(" << p[i] << ")";  
                Finish[i] = 0; //所有进程置为未分配状态  
            }  
            cout << endl << endl;  
        }  
        show();  //显示当前状态  
        ppp:   //申请大于可利用量， 应该阻塞等待,结束本次资源申请，GOTO 语句跳转至此  
        cout << endl << "是否继续申请资源(y/n) ?";  
        char *b = new char;  //输入y/n，判断是否继续申请    <<endl        cin >> b;  
        cout << endl;  
        cout << "-------------------------------------------" << endl << endl;  
        cout << endl;  
        if (*b == 'y' || *b == 'Y')  
            r = true;  
        else {  
            r = false;  //输入非 Y 则令 R =false            jieshu();  //调用结束函数  
        }  
    } while (r == true);  
}
```

**安全性算法**
safe函数的核心在于 循环遍历每一个进程 检查是否可以完成 如果可以全部完成 即为安全
```cpp
// 安全性算法函数  
void safe() {  
    while (l < n) { // l 表示找到的安全进程数  
        bool found = false; // 标记是否找到满足条件的进程  
        for (i = 0; i < n; i++) {  
            if (Finish[i] == 0) { // 如果进程 i 尚未完成  
                bool canAllocate = true; // 假设可以分配  
                for (j = 0; j < m; j++) {  
                    if (Need[i][j] > Work[j]) { // 如果某种资源不足  
                        canAllocate = false;  
                        break;  
                    }  
                }  
                if (canAllocate) { // 如果所有资源都满足需求  
                    for (j = 0; j < m; j++) {  
                        Work[j] += Allocation[i][j]; // 释放资源  
                    }  
                    Finish[i] = 1; // 标记该进程已完成  
                    p[l++] = i; // 将进程加入安全序列  
                    found = true; // 找到一个满足条件的进程  
                }  
            }  
        }  
        if (!found) { // 如果一轮循环没有找到满足条件的进程  
            break; // 系统不安全，退出循环  
        }  
    }  
}
```

finish和worker在初始化的时候已经初始化好了
遍历每个进程 判断是否能够完成 -- 主要是通过判断某种资源是否不足

运行结果
![Pasted image 20250426195321.png](/img/user/accessory/Pasted%20image%2020250426195321.png)
