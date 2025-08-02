---
{"dg-publish":true,"permalink":"/math/Linear Algebra/Lecture 01 & Book 2.1 线性方程的几何理解与矩阵/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-07-25T17:17:01.452+08:00","updated":"2025-07-28T11:25:28.134+08:00"}
---

2.1实际上是讨论了对简单的n个方程n个未知数的两种不同的视角：row picture, column picture, 并且介绍了方差与矩阵之间的关系
我们首先看一个 两个方程两个未知数 的情况
$$
\begin{align}
x-2y=1\\
3x+2y=11
\end{align}
$$
row picture的视角是 我们之前所学过的 two lines meeting at a single point(the solution).
![Pasted image 20250728110957.png|300](/img/user/accessory/Pasted%20image%2020250728110957.png)
这其实是一种数形结合的思想吧，满足x-2y=1方程的所有点的几何在xy平面上表现的形式其实就是一条直线，同理，3x+2y=11也是一条直线，那么两条直线的交点的坐标就是既满足x-2y=1又满足3x+2y=11的(x,y) 也就是方程的解

column picture的视角是从 "vector equation" 的角度
$$
x\begin{bmatrix}1\\3\end{bmatrix} + y\begin{bmatrix}-2\\2\end{bmatrix}=
\begin{bmatrix}1\\11\end{bmatrix}=
b
$$
而这种若干向量按比例相加其实就是向量的线性组合
我们不难发现这个组合的结果应该是(3,1)
![Pasted image 20250728111517.png|400](/img/user/accessory/Pasted%20image%2020250728111517.png)

我们把方程左边的向量排列 叫做 方程的 coefficient matrix(系数矩阵)

$$
\begin{align}
A=\begin{bmatrix}1 & -2\\3 & 2\end{bmatrix}\\
Ax=b\\
\begin{bmatrix}1 & -2\\3 & 2\end{bmatrix}
\begin{bmatrix}x\\y\end{bmatrix}=
\begin{bmatrix}1\\11\end{bmatrix}
\end{align}
$$
其实我们把(3,1)带进去得到的就是
$$
\begin{bmatrix}1 & -2\\3 & 2\end{bmatrix}
\begin{bmatrix}3\\1\end{bmatrix}=
\begin{bmatrix}1\\11\end{bmatrix}
$$
这是一个标准的矩阵乘法
而对于矩阵乘法 其实也对应着row和column两种视角
对于row picture的视角，其实是点乘，或者说左行，是对(1,3)行做了变换
对于column picture的视角，实际上就是线性组合
这点在前面的[[math/Linear Algebra/Chapter 1 Introduce to Vectors\|Chapter 1 Introduce to Vectors]]其实提到了

下面其实是看了一个Three Equations in Three Unknowns的情况
$$
\begin{align}
x+2y+3z=6\\
2x+5y+2z=4\\
6x-3y+z=2
\end{align}
$$
row picture:
![Pasted image 20250728112245.png|500](/img/user/accessory/Pasted%20image%2020250728112245.png)
其实上升到三维对于找三条平面的交点  就已经比较困难了
相比之下，column picture的视角就很简单很多，是对三个三维向量的 向量加法
![Pasted image 20250728112435.png|400](/img/user/accessory/Pasted%20image%2020250728112435.png)
同样的

![Pasted image 20250728112510.png|400](/img/user/accessory/Pasted%20image%2020250728112510.png)
![Pasted image 20250728112521.png|500](/img/user/accessory/Pasted%20image%2020250728112521.png)
