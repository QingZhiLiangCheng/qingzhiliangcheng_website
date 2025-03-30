---
{"dg-publish":true,"permalink":"/algorithm/Algorithm Princeton/UNIT3 Analysis of Algorithm/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-16T12:17:30.332+08:00","updated":"2025-03-30T15:32:26.343+08:00"}
---


![[14AnalysisOfAlgorithms.pdf]]
the first step is to be able to make some observations about the running.

for example    3-Sum problem
Give N distinct integers, how many triples sum to exactly zero?
![Pasted image 20250116122930.png|500](/img/user/accessory/Pasted%20image%2020250116122930.png)
![Pasted image 20250116123024.png|500](/img/user/accessory/Pasted%20image%2020250116123024.png)
So that's a brute force algorithm that is a fine method for solving 3-Sum problem, now what we're interested in is how much time does this take as a function of n?
the frist function is use a clock  and java have a stopwatch class in the standard library.
![Pasted image 20250116123402.png|200](/img/user/accessory/Pasted%20image%2020250116123402.png)

![Pasted image 20250116123529.png|300](/img/user/accessory/Pasted%20image%2020250116123529.png)

![Pasted image 20250116123607.png|500](/img/user/accessory/Pasted%20image%2020250116123607.png)
Hit a curve like this and actually whats science usually do because of some many problems fall into out of this  class is do the plot as a lg,lg plot.
And the slope of the straight line is the key to what's going on. In this case, the slope of the straight line is three and so you can run what's called a regression to fit a late, the straight line through the data points.
if you get a stright line and the slope is b, then your funciton s proportional to  $a N^b$, that's called the power law.
this model helps us do predictions without inversting the expense to run the experiments.

in fact,
your algorithm and input data  determines exponent b in power law.
and your hardware(CPU, memory,cache,...), software, system determines constant a in power law.


### mathmatical models
in last section, gives us a way to predict performance but it really doesn't help us understand what the algorithms are going. So next, we're going to look at the mathmatical model, a way to get a better concept of what's really happending.

Knuth said we can calculate the total runing time of a program by identifying all the basic operations, figuring out the cost, figuring out the frequency of execution, and summing up the cost times frequency for all the operatrions.
from Knuth, we know that in principle,we can get accurate mathematical models for the performance of algorithms or program in operation.

some time we'll just postulate that it's some constant.
Like,if you're going to allocate a array of size N, it takes time proportional to N, cN

example: 1-Sum
	![Pasted image 20250116130004.png|400](/img/user/accessory/Pasted%20image%2020250116130004.png)
example: 2-Sum
	![Pasted image 20250116130130.png|500](/img/user/accessory/Pasted%20image%2020250116130130.png)
Turing said maybe we should just count the ones that are most expensive.

so the first simplication is to use some basic operation that's maybe the most expensive and or and or the one that's executed the most often.

the second simplification is, hat we're going to ignore low order order terms in the formulas that we derive.
![Pasted image 20250116131137.png](/img/user/accessory/Pasted%20image%2020250116131137.png)
and the idea is, when N is large in a formula like this,the N cube term is much much higher than the N term or 16---- 其实就是抓大头

so the example 2-sum problem
![Pasted image 20250116131600.png](/img/user/accessory/Pasted%20image%2020250116131600.png)

for the 3-sum problem
![Pasted image 20250116131644.png](/img/user/accessory/Pasted%20image%2020250116131644.png)

![Pasted image 20250116131824.png](/img/user/accessory/Pasted%20image%2020250116131824.png)


### order-of-growth classifications
Really a great number of the algorithms that we consider are described by these few functions and that are plotted here.
![Pasted image 20250117131423.png|400](/img/user/accessory/Pasted%20image%2020250117131423.png)
1, log N, N, NlogN, $N^2$, $N^3$, $2^N$
Normally we'll say the running time of the algorithm is proportional to N logN. That means we that we think that our hypothesis is that the running time is tilde C N log N

![Pasted image 20250117131830.png](/img/user/accessory/Pasted%20image%2020250117131830.png)

![Pasted image 20250117132737.png](/img/user/accessory/Pasted%20image%2020250117132737.png)

an $N^2 logN$ algorithm for 3-Sum
- Step1: Sort the N (distinct) numbers.
- Step2: For each pair of numbers `a[i] and a[j] `, binary search for  `-(a[i]+a[j])`

### theory of algorithms
one problem is that the inputs can cause the performance of the algorithm to vary widely.
So we often have to think about different ways of analyzing the algorithm deeping on the input. So, the running time is going to be somewhere between that the bast case and the worst case.
best case is the lower bound.----- easiest input
worst case is the upper bound----- most difficult input


Well we need to, someway to model, what we mean by random for the problem that we're solving but there is a lot of situations  where we can do that and then we have a way to predict performance even when the input might vary widely.
![Pasted image 20250117134335.png](/img/user/accessory/Pasted%20image%2020250117134335.png)

![Pasted image 20250117134645.png](/img/user/accessory/Pasted%20image%2020250117134645.png)

 - Big Theta:
	 $\Theta$ is just the way to describe the order of growth. $\Theta(N^2)$ is kind of short had for anything $N^2$. It's bounded above and below by constant time $N^2$ and that's what we really use to classify algorithms.
- Big Oh:
	it's the upper bounds on performance. When we say $O(n^2)$, we mean that it's less than some constant time $N^2$ as N grows.
- Big Omega:
	it's the lower bounds.   $\Omega$ 

### memory
now we have to talk about the memory requirements of our programs as well.

typical memory usage for primitive types and arrays.
![Pasted image 20250117141824.png|200](/img/user/accessory/Pasted%20image%2020250117141824.png)
spcial in arrays.
![Pasted image 20250117141844.png|300](/img/user/accessory/Pasted%20image%2020250117141844.png)
there is a certain amount of overhead for making an array and then if there's N items it's whatever the cost of the primitive type times N.

![Pasted image 20250117142054.png|300](/img/user/accessory/Pasted%20image%2020250117142054.png)
but there's extra terms for the overhead.


Now a lot of our programs use objects like Linklys and so forth, so we also have to factor in object overhead.
 The cost of reference and also there's padding built-in typical implementations to make it so that each objects has to use a multiple of 8 bytes.
 ![Pasted image 20250117142430.png|600](/img/user/accessory/Pasted%20image%2020250117142430.png)
 ![Pasted image 20250117142508.png](/img/user/accessory/Pasted%20image%2020250117142508.png)

- Primitive type: 4 bytes for int, 8 bytes for double, ...
- Object reference: 8 bytes
- Array:24bytes + memory for each array entry.
- Object: 16bytes + memory for each instance variable + 8 if inner class
- Padding: round up to multiple of 8 bytes.

