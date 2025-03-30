---
{"week":"第一周","dg-publish":true,"permalink":"/CSAPP Computer-System-A-Program-Perspective/Lecture 02 03 Bits, Bytes, and Integer/","dgPassFrontmatter":true,"noteIcon":"","created":"2024-12-24T20:46:25.253+08:00","updated":"2025-03-30T14:39:45.032+08:00"}
---


some numbers together that are positive and get negative result
->So you need to learn the bit level representation of numbers
looking the corner cases when overflow

Everything is bits
Why?
	- can use electronic implementation
		low voltage: 0   range of value  maybe 0V~2V
		high voltage: 1 maybe 0.9V~1.1V
	- is easier to store

4 binary bits group ---- hexdecimal（base 16）
Byte=8bits

data representation
	in C
	![Pasted image 20250101190213.png|300](/img/user/accessory/Pasted%20image%2020250101190213.png)
	especially the long double which I didn't know ago
	epsecially notice the long, different in 32-bit and 64 bit
	especially notice the pointer.   connect with address ! -----  connected with word size

boolean algebra
	![Pasted image 20250101192305.png|400](/img/user/accessory/Pasted%20image%2020250101192305.png)
	biitwise

 the | and ||
	 || aren't thinking about bitwise
	 is something that's either true or flase ----- 0 is false and 1 is  true
	 || have a feature is early termination.
is not doing bitwise operation it's just trying to create true and false. it's interpreting arguments be there ture or false and returning either true or false. but when it return true is 1 and not other number. such as `0x69 || 0x55 -> 0x01` ,and this can early termination.

shift operations
	![Pasted image 20250101193701.png|400](/img/user/accessory/Pasted%20image%2020250101193701.png)
	use of a lot
	I use it on the linkedList implementation.
	a curious feature is have one left shifts but two right shift.
	---- logic shift and the arthmetic shift.
		should understand how negative numbers get respresented in a machine can understand the left shifts.

Encoding Integers
have two kinds of integers
- Unsigned
- two's complement
the core is two equations
![Pasted image 20250101194652.png|400](/img/user/accessory/Pasted%20image%2020250101194652.png)
for unsigned,we just add up the sum of the weighted bits
the only difference for two's complement is the sign bit
-> we have the same bit pattern, but we can get two different numbers in unsigned and the two's complement.

numberic ranges
for unsigned values: min is all 0 --- 0  and max is all 1 ----- $2^w-1$
for two's complement values:
	min: the first bit is 1 and other is 0:$-2^{w-1}$
	max: the first bit is 0 and other is one: $2^{w-1}-1$
	a especially value: all 1 : -1
![Pasted image 20250101201616.png|400](/img/user/accessory/Pasted%20image%2020250101201616.png)
noticed that UMax=2 * TMax+1   -----  left shift by one position
basically  use two's complement number in machine
but the address use the unsigned numbers

because the unique and common bit pattern
so we can jump between signed and unsigned
![Pasted image 20250101202933.png|400](/img/user/accessory/Pasted%20image%2020250101202933.png)

![Pasted image 20250101204131.png|300](/img/user/accessory/Pasted%20image%2020250101204131.png)
this is a future   unsigned value - 16  is signed value.
![Pasted image 20250101205357.png|400](/img/user/accessory/Pasted%20image%2020250101205357.png)
this is a funciton and it's mapping relationship

in python and java we wouldn't consider that,but C is one of a few languages where unsigned is actually explicit datatype.

- if there is a mix of unsigned and signed in single expression, signed values implicitly cast to unsigned.
![Pasted image 20250101211104.png|400](/img/user/accessory/Pasted%20image%2020250101211104.png)
a typical example  is this.
is said that
	- both of the number are signed, then it will do as a signed case
	- either of them is unsigned, it will convert the other one to be an unsigned number and do the operation.

a property:
	for two's complement: the absolute value of the TMax compare with the TMin $\lvert TMax \rvert=\lvert TMin\rvert-1$  
	the negetive is more negtive
	because the case you have the 0
	for 10...000 to 1...1 have half of range is occupied by the negative numbers,another half of range is 0 and positive  numbers
	-> a pain is use the abs can lead to overflow.

a interesting  thing is that we have a loop is `for(int i=n-1;i>=0;i--)`
	if the i were declared  as being unsigned,  the loop will go forever what would most likely happen is ----- i would go from zero to being UMax
	maybe 0-1 is 111...111 in two's compoent , but in loop i is declared as unsigned

another interesting thing is a loop is `for(int i=n-1;i-sizeof(char)>=0;i--)`
	because of the funciton sizeof's return is unsigned,so it will convert the i to unsigned number, so the loop will endless and crashing

-> so we should avoid about signed versus unsigned arithmetic


Sign Extension
- for two's compoent
- copying the sign bit to the left
![Pasted image 20250111155414.png|400](/img/user/accessory/Pasted%20image%2020250111155414.png)
an example:
	1110    is   $-2^3+2^2+2^1=-8+4+2$
	1 1110  is $-2^4+2^3+2^2+2^1=-16+8+4+2$
	a thing we can see -8 to 8 and -16
	giving it twice the weight turing it what wes the sign bit into a positive number
	don't change the net effect of the sum
	in other word, the purple body of the X and X' is the same value

Sign Truncating
- for unsigned similar to mod some power of 2 
	11011  = 1+2+8+16=27
	1011=11
	27 mod $2^4$
- for unsigned
	10011 = -13
	0011 =3

 unsigned addition
 if you take two numbers that range between up the maximum value of an unsigned number value add them 
that in pricinple you might need to get an extra bit to represent that sum
so we must drop it and pretend it doesn't exit
![Pasted image 20250112084319.png|500](/img/user/accessory/Pasted%20image%2020250112084319.png)
this no warning and error, this is just it happen silently
it like mod $2^w$
![Pasted image 20250112084739.png|500](/img/user/accessory/Pasted%20image%2020250112084739.png)
two 4bit number: if we add them it will 30
what we do is sort of create a cliff,when you roll over from 15 to 16 instead it drops all the way down to 0,is called overflow
so we will build up the maximum value here will be 14,which is 30-16

two's complement addition
it's bit add too
1101+0101=(1)0010  is -3+5=2  is right
1101+1010=(1)0111   -3+-6=7 it become positive and that's referred to as a negetive overflow
0111+0101=1100 we get the negative number     positive overflow
![Pasted image 20250112085905.png|300](/img/user/accessory/Pasted%20image%2020250112085905.png)


![Pasted image 20250112090024.png|300](/img/user/accessory/Pasted%20image%2020250112090024.png)


multiplication
unsigned:
w->2w bits
also mod look at the low bits
two's components:
overflow: two positive numbers can get negetive returns

power-of-2 multiply with shift: shift is  esaier than multiple  
and the resaon of that as an optimization is historically the multiplication instruction took a lot longer than a shift instruction  
one clock cycle to do a shift, and used to be like 11 12 13 clock cycles to do a multiplication,but in mordern compluter is maybe use three clock to do that multiple
the compiler has its own kind of judgement calls on when is it more efficient to substitute one up for another

in fact unsigned power-of-2 divide with shift
but the only thing is what if the number you have is not actually divisible by that power-of-2
it will be round it down round it toward 0
for two's components, we'll keep that sign bit
rounding toward a more negative number than the true thing
we will add a bit and do the shift then
	a example: 1101----- -3
	1101+1=1110  -> shift
	1111   -1
logicial shift

negate a number
the standard way is what's called complement and increment
	a example: 1010    -6
	0101+1=0110 ---- 6
	1001+1=1010  ----6


why should I use unsigned?
maybe we should just banished unsigned numbers from the universe, and only allow two's tomplement, and that's exactly the rule that was adopted for example in Java
the only trick did was they put in a triple right shift(>>>), mean logic shift and >> is arithmetic  shift

Representations in memory, pointers, strings
we use the 64-bit machines, an addresss is represented in 64 bits, but the fact the maximum address you're allowed to use in current machines is a 47bits, but $2^{47}$ is only a pretty bit numbers.
1TB=$2^{40}$bit
we have not the size of the DRAM
this is a resonable restriction, but the point is that logically your program thinks that it has a of that many bytes
and in fact what happens is that the operating system only allows certain regions within that memory  to be referenced
and other regions if you try to access them it will create a it will signal an error what they call a sagementation fault(段错误)
-> memory system is works in virtual memory
we always think the memory is a big array,but in reality it's shuffling between different regions of your memory, and even between your memory and your disk drive on your computer to make it implement this particualr.
and that's all handled as I said by the operating system by the computer hardware.

word size
if we using GCC is the standard compiler, we can specify either I want it to be 64bit code or 32 bit code as a flag, it will actually generate two different kinds of object code as a rusult.
the point is the dardware itself doesn't necessarily define what the word size is, it's a combination of the hardware and the compiler that determines

we can group those into blocks of words of different word sizes, and the way we do that is usually be assuming that the addresss of the word is the lowest value address in it.

another detail is if a word has multiple bytes in it, what order should those bytes be should it be the ?
- little endian order
- big endian order
all of the x86 is little-endian
![Pasted image 20250112101115.png|400](/img/user/accessory/Pasted%20image%2020250112101115.png)


representing strings
where the final bytes is 0 note called null terminator
there's more modern characters  codes too that can represent non English alphabet, example Unicode, but the C standard  only use ASCII format

