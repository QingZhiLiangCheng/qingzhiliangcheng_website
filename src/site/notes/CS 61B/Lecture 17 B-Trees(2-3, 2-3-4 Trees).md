---
{"week":"第七周","dg-publish":true,"tags":[],"permalink":"/CS 61B/Lecture 17 B-Trees(2-3, 2-3-4 Trees)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-03-28T09:39:03.320+08:00","updated":"2025-04-09T14:34:01.147+08:00"}
---

### Binary Search Trees
**Tree Height**
In the best case, our tree will have height Θ(logN), whereas in the worst case our tree has a height of Θ(N)
最坏的情况是一直是左子树或者右子树

Consider the following statements about BSTs. Which of the following are true?
1. The worst-case height of a BST is Θ(N).
2. BST height is O(N).
3. BST height is O($N^2$).

事实上这三个说法都对
但是第一个说法是更准确的
Θ(N)给出的是upper bound 和 lower bound之间  --  只能表示线性关系
而O(N) O是上界 所以可能意味着线性 对数 平方根 或者 常数

但是我们一般都是用O的原因是
1. 我们一般会选择最小的上限
2. 更广泛的陈述 -- 二分查找O(log N)是对的  但说Θ(logN)就不对 因为Θ(logN)只能表示线性关系 但二分查找有时候是常数
3. 有时候确切的运行时间是不确定的或者说很难确定 -- 这种情况下 我们一般会使用O提供一个广义的上限

### B-Tree Operations
**Height and Depth**

