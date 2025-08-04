---
{"dg-publish":true,"permalink":"/math/Linear Algebra/Lecture 04 & Reading 2.6 矩阵的LU, LRU分解/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-08-04T10:26:11.536+08:00","updated":"2025-08-04T12:08:26.171+08:00"}
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
那为什么采用L的形式不用E的形式呢 -- 这是因为用E的逆矩阵(L的形式)做乘法更简单
我们在进行行变换的时候，进行E21的时候其实是改变了第二行的结果的，也就是说用第二行给第三行消元的时候，这个行不再是A的行2了
![Pasted image 20250804111142.png|500](/img/user/accessory/Pasted%20image%2020250804111142.png)
![Pasted image 20250804113551.png|500](/img/user/accessory/Pasted%20image%2020250804113551.png)
上面图三个方块中前两个矩阵对应的就是$E_{31}^{-1}E_{32}^{-1}$ ，依然是利用左乘的特性，第二个矩阵的第一行的两倍加第三行的1倍
从上面的例子中我们可以看出基本变换矩阵的逆矩阵在相乘的时候，由于其操作的是不同行或者同行但是不同列上的元素，所以基本矩阵的逆矩阵在相乘的时候只会影响矩阵中对角线以外的非零的元素
正是由于上面这个优良的特性，保证了我们在得到基本变换矩阵的逆矩阵的时候，求解这些矩阵的乘法的结果的时候，可以直接将相应的元素做一个“堆叠”，即保证对角线元素不变其余元素相加，即可得到最终的结果。而不用去进行复杂的矩阵乘法运算
可以体会一下差别
![Pasted image 20250804113754.png|500](/img/user/accessory/Pasted%20image%2020250804113754.png)
![Pasted image 20250804114233.png](/img/user/accessory/Pasted%20image%2020250804114233.png)

LU分解的本质上就是提前对A进行了行变换，也就是高斯消元的过程(这个过程的复杂度是3次的)，但是LU分解却通过L(而不是E,为什么 上面说了) 存下了消元倍数的几何，以至于可以用在不同的b上
如果对于Ax=b，需要根据b来求信息x，每次b都是不同的，A是固定的，这个时候可以先把A进行LU分解，然后通过LU来求解x 比 直接用A来求解效率高
因为$AX=LUX=L(UX)=b \Rightarrow LY=b, Y=UX$
![Pasted image 20250804114713.png](/img/user/accessory/Pasted%20image%2020250804114713.png)
由于左乘时行变换，而前面的行的后面元素都是0 所以自上向下求解的时候省了很多东西，比如说y1事实上只需要b1和L11就能求出来，而y2 需要b1 b2
也就是说，一共操作 $1+2+...+n = \frac{n(n+1)}{2} \approx \frac{n^2}{2}$
![Pasted image 20250804115226.png](/img/user/accessory/Pasted%20image%2020250804115226.png)
从下往上算 也是$\frac{n^2}{2}$次  也就说一共用了$n^2$次 即$O(n^2)$

A的消元次数
![Pasted image 20250804115439.png](/img/user/accessory/Pasted%20image%2020250804115439.png)
用第一行给其他n-1行消元 计算次数是n(n-1) n-1是n-1行，n是每一行n个数加减法
那总共$n(n-1)+(n-1)(n-2)(n-3) +... + 2 * 1 \approx n^2+(n-1)^2+...+2^2+1=\frac{1}{3}n^3$
然后同样要对b操作并回带
其实LU操作就是提前消元并存储 省了之后的$O(n^3)$的复杂度






