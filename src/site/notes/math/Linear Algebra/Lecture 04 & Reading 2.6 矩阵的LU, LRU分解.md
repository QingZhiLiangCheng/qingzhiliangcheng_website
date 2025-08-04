---
{"dg-publish":true,"permalink":"/math/Linear Algebra/Lecture 04 & Reading 2.6 矩阵的LU, LRU分解/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-04T10:26:11.536+08:00","updated":"2025-08-04T11:22:08.767+08:00"}
---

以一种新的思路审视高斯消元 
在[[math/Linear Algebra/Lecture 02 & Reading 2.2, 2.3 矩阵消元法求解方程组\|Lecture 02 & Reading 2.2, 2.3 矩阵消元法求解方程组]]中其实提到了矩阵进行消元法，本质上就是进行了行变换，而进行行交换的过程，相当于在A矩阵上左乘好多个E，最终变成了U
所以能看出来A和U是有关系的，这个关系其实就是L，也就是那些E的综合，这其实也可以算是一种更快的消元法
假设这是一个一般的2by2矩阵
$$
A=\begin{bmatrix}2 & 1 \\ 8 &7\end{bmatrix}
$$
消元的过程 就是左乘一个$E_{21}$  即$E_{21}A=U$
$$
\begin{bmatrix}1 & 0 \\ -4 &1\end{bmatrix}
\begin{bmatrix}2 & 1 \\ 8 &7\end{bmatrix}=
\begin{bmatrix}2 & 1 \\ 0 &3\end{bmatrix}
$$
而我们要找A和U的联系 也就是说$A=LU$找L
首先能看出来L和E是逆的关系
消元矩阵的逆很好求，因为消元矩阵本身就是行变换，其实就是把行变换逆回去 $E_{21}^{-1}=L=\begin{bmatrix}1 & 0 \\ 4 &1\end{bmatrix}$
也就是$A=LU$
$$
\begin{bmatrix}2 & 1 \\ 8 &7\end{bmatrix}=\begin{bmatrix}1 & 0 \\ 4 &1\end{bmatrix}\begin{bmatrix}2 & 1 \\ 0 &3\end{bmatrix}
$$
你会发现这就是一个上三角和下三角的相乘！
L矩阵上的对角线都是1 U矩阵上的对角线都是主元，有些时候我们会把主元单独拿出来，也就是所说的LRU分解
$$
\begin{bmatrix}2 & 1 \\ 8 &7\end{bmatrix}=\begin{bmatrix}1 & 0 \\ 4 &1\end{bmatrix}\begin{bmatrix}2 & 0 \\ 0 &3\end{bmatrix}
\begin{bmatrix}1 & \frac{1}{2} \\ 0 &1\end{bmatrix}
$$

推广到3by3
$E_{32}E_{31}E_{21}A=U$ 找$A=LU$实际上就是去找$(E_{32}E_{31}E_{21})^{-1}$，之前讲过了总体的逆= 分别求逆逆序相乘，也就是$L=E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}$
其实这里的核心思想就是把消元的反向操作封装进了一个下三角矩阵L
那为什么采用L的形式不用E的形式呢 -- 这是因为我们在进行行变换的时候，进行E21的时候其实是改变了第二行的结果的，也就是说用第二行给第三行消元的时候，这个行不再是A的行2了，而是U的行2，所以我们可以改变顺序，把U都放一边
![Pasted image 20250804111142.png|500](/img/user/accessory/Pasted%20image%2020250804111142.png)

这样我们就只需要记录校园的结果和倍数(倍数写入L) 就不需要记录A了
