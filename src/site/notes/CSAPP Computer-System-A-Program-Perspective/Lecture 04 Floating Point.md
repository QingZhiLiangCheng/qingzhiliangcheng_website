---
{"week":"第二周","dg-publish":true,"tags":["week2","csapp"],"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 04 Floating Point/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-13T16:09:18.605+08:00","updated":"2025-04-19T09:52:57.801+08:00"}
---


### fractional binary numbers
like the fractional decimal numbers
![Pasted image 20250113161857.png|300](/img/user/accessory/Pasted%20image%2020250113161857.png)
in the left point, we have bit positions to representing powers-of-2
and to the right of the binary point, we have $2^{-1}$...

there's limitations in this kind of representation,first of all we can only represent rational numbers of the from x/$2^k$ 
other numbers have repeating bit representations, but the finite number of bits that we have in a computer system.
another limitations is only have w bits.  to store very large numbers? or very small but high precision numbers?

### IEEE Floating Point
numerical form: 
$$
(-1)^s \times M  \times 2^E
$$
is nubmer like a scientific notation
- s is a sign bit: determines whether number is negative or positive.
- significand m: a fractional value in range between 1.0 and 2.0
- exponent E: weights value by power of two.

IEEE floating two different kinds of floating-point 
- single precision:32bits
- double precision: 64bits
- funky intel extenden precision: 80 bits
![Pasted image 20250113164448.png|500](/img/user/accessory/Pasted%20image%2020250113164448.png)

normalized value is all the values where the exp field is not equal to all 0 and not equal to all 1

the exponent E is encoded as this biased(偏置) value which is the called exp, the exponent E is exp-bias,   is all positive.
the bias is $2^{k-1}-1$ ,where k is number of exponent bits.

if we encode the exponent E using this bias representation, the samllest negative exponent is represented by all zeros. And the largest exponent is represented by 01...1
so if we were just to compare the bits, using a just some kind of unsigned representation, just comparing the bits, treating it as an unsigned number,so we can just compare two floating-point  numbers just as unsigned.

so we always normalized M is 1.xxxx and then we adjust the exponent accordingly

the bits of xxxx  is the right of the binary point right, there's always this implied one, we donn't encode it. it's a little trick just to get it one more bit for free.
- so the smallest fractal is all zeros, but M=1.0
- the largest frac is all one, but M=2.0-e

summary for normalized values
$0 \leq Exp \leq 255$
$-127 \leq E \leq 128$ 

when we want to represent numbers closer to zero, the normalized value limits.
so there is a values called denormalized values.
its condition is exp is all zero. and there're no implied one.
for denormalized values, E=1-bias(instead of E=0-bias)
and in there have +0 and -0

and some special values
- exe is all one and frac is all zeros: ∞
- exp is all one and frac is not zero: NaN,which is mean not a number.

![Pasted image 20250116143900.png](/img/user/accessory/Pasted%20image%2020250116143900.png)

### Examples and properties
![Pasted image 20250116144139.png|300](/img/user/accessory/Pasted%20image%2020250116144139.png)
 ![Pasted image 20250116144156.png](/img/user/accessory/Pasted%20image%2020250116144156.png)
 when add 1 ,the value add $\frac{1}{512}$
 if you get the spirit, you get this nive smooth transition from denorm to normalize.

why the bias is $2^{k-1}-1$ ?
	because we want 0 in the middle of the E

![Pasted image 20250116145252.png](/img/user/accessory/Pasted%20image%2020250116145252.png)

we can see that value are very dense around zero, and the every time you increase the exponent by one,  the numbers are spaced twice as far apart as the previous.

### multiplication
floating point operations: basic idea
if we have two floating point, and we add them to together there's no guarantee that we'll be able to fit all those bits.
so the basic idea is 
- first compute exact result
- use the technique call rounding to get it to fit into the of the available bits.


Rounding
In IEEE have four types of rounding
- Towards zero
- Round down
- Round up
- Nearest Even

the defult case, which is the only one route we're really going to consider, which is round to the nearest even.
![Pasted image 20250116150227.png](/img/user/accessory/Pasted%20image%2020250116150227.png)
the idea in nearest even is:
四舍六入五偶哈哈哈

closer look at round-to-even
the reason we do this the reason they chose this is that statistically
if we would image, we have a uniform distribution of sort of numbers, they're going to round up or down about 50% of the times, so there won't be a statistical bias rounding up or down one way or the other.

![Pasted image 20250116150944.png](/img/user/accessory/Pasted%20image%2020250116150944.png)
we can do the same thing with binary fractional numbers as well.


![Pasted image 20250116151208.png](/img/user/accessory/Pasted%20image%2020250116151208.png)
but if the M>=2, we should shift M and change the E
if trhe E out of range, overflow
if the m has too many bits, we have to use round to even.


### Floating Point Addition
![Pasted image 20250116151611.png](/img/user/accessory/Pasted%20image%2020250116151611.png)

a very interesting  thing is the floats aren't really reals.
the big thing with addition is that it doesn't  associate.(不具备结合性)
if you're trying to add and subtract really bit numbers with really little numbers, we will run into this problem of non associativity
example
`(3.14+1e10)-1e10=0, 3.14+(1e10-1e10)=3.14`

the multiple  is's not associative
it doesn't distribute over addition


### Floating Point in C
- float---IEEE single precision 
- double----IEEE double precision 

in the casting between unsigned and two's components, the cast never change the bit representation, it just changed the way that how the ALU manipulated those bits. it's usually just how were interpreting and how we're viewing those values.

However, when we do cast between floats and ints and dobules, the bit representation changes.so it maybe has a dramatic effect on the actually bits.
- double/float->int: truncate the fractional part and give us the integer part.
- int->float: integer is 32bits.  but the frac in float only have 21bits. so it will have some rounding.
