---
{"dg-publish":true,"permalink":"/math/Linear Algebra/Lecture 05 & Reading 2.7, 3.1 转置 对称 置换 向量空间/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-06T13:01:58.768+08:00","updated":"2025-08-09T17:07:04.162+08:00"}
---


### 转置
转置 说白了就是 行向量变成列向量 列向量变成行向量 或者说 按照对角线反转
$$
A=\begin{bmatrix}1 & 2 &3 \\ 0 & 0 &4  \end{bmatrix},
A^T = \begin{bmatrix}1 & 0 \\ 2 & 0 \\  3 & 4 \end{bmatrix}
$$
也就是说原来A是三个列向量的排列，转置之后变成了三个行向量的排列；A原来是两个行向量的排列，转置之后变成了两个列向量的排列
如果用数学语言来描述转置的话，就是
$$
(A^T)_{ij} = A_{ji}
$$
**和的转置 = 转置的和**
由于向量加法就是对应分量相加，所以矩阵的加法就是对应元素相加，很直接，我们可以转置A+B得到$(A+B)^T$,也可以分别转置再相加$A^T+B^T$，效果是一样的，即
$$
(A+B)^T = A^T+B^T
$$

**乘积的转置**
有意思的是乘积AB的转置
$$
(AB)^T = B^TA^T
$$
理解这个问题的一个好的方法是理解为什么是反序
我们先把B看做一个列向量的情况，也就是说$(Ax)^T = x^TA^T$ ，你会发现Ax是A左乘作用于x的行或者是x作用于A的列，比如
$$
Ax=\begin{bmatrix}1 & 2 \\ 3 & 4 \\ 1 &3  \end{bmatrix}
\begin{bmatrix}1 \\ 2 \end{bmatrix}
$$
可以看作是对A的第一列的1倍和第二列的2倍的结果，也可以看作是对x的第一行1倍与第二行2倍相加作为结果第一行... x的第一行的1倍与x的第二行的3倍相加作为结果的第三行 -- 但总之 最后是一个列向量 -- 转置之后是个行向量
这和$A^T$作用与$x^T$的列 与 $x^T$ 作用于 $A^T$的行的效果是一样的
$$
x^TA^T=\begin{bmatrix}1 & 2\end{bmatrix}
\begin{bmatrix}1 &3&1\\ 2&4&3 \end{bmatrix}
$$
其实直接用矩阵的乘积的公式 写出来回更加的直观
同样的，我们可以把一个B矩阵看做是列向量或者行向量的排列组合，而矩阵乘法的结果就相当于单独作用于某个列向量或者行向量然后再排列组合 -- 所以说对于矩阵B的结果是一样的

**逆的转置 = 转置的逆**
$$
(A^{-1})^T = (A^T)^{-1}
$$
这个其实就更好理解了$A^{-1}A=I \Rightarrow (A^{-1}A)^T=I^T$
而$I^T=I$, $(A^{-1}A)^T = A^T(A^{-1})^T$即 $A^T(A^{-1})^T = I$
$\rightarrow A^T和(A^{-1})^T$ 互逆 即$(A^{-1})^T = (A^T)^{-1}$

### 对称
一种特殊的矩阵满足$A^T = A$ 称为对称矩阵
对于一个普通的矩阵R，$R^TR$是一个对称矩阵
从运算上其实不难发现
$$
R^T R = \begin{bmatrix}
1 & 3 & 5 \\
2 & 4 & 6
\end{bmatrix}
\begin{bmatrix}
1 & 2 \\
3 & 4 \\
5 & 6
\end{bmatrix}=
\begin{bmatrix}
& R^T{row1} \cdot R{col2}  \\
R^T{row2} \cdot R{col1} & \\
\end{bmatrix}
$$
更合理的证明
$$
(R^TR)^T
=R^T(R^T)^T
=R^TR
$$

### 置换矩阵
Permutations P: execute row exchanges.
置换矩阵其实就是左乘进行行变换的矩阵，其实右乘就是列变换，我记得这一部分在当时我第一次学的时候叫做初等矩阵
![Pasted image 20250806140643.png](/img/user/accessory/Pasted%20image%2020250806140643.png)
本质上其实就是交换了单位矩阵I的行或者列
这里我们上个Lecture中的A=LU其实是假设了A没有进行变换的
那如果有行变换的话，其实在对A的消元过程中就涉及到了E中穿插着P比如$E...PE..PEA$这样子，其实E是最后都逆过去都变成了L，就剩下了P在左边，所以更一搬的情况是 而且多个P作用在一起还是个置换矩阵啊
$$
PA=LU
$$
### 向量空间
等我看完了Chapter3.1再整理吧
一起整理在[[math/Linear Algebra/Lecture 06 & Reading 3.1, 3.2 向量空间与子空间 列空间 零空间\|Lecture 06 & Reading 3.1, 3.2 向量空间与子空间 列空间 零空间]]