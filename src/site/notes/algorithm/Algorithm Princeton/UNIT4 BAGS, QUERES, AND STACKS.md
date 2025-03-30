---
{"dg-publish":true,"permalink":"/algorithm/Algorithm Princeton/UNIT4 BAGS, QUERES, AND STACKS/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-17T15:04:22.209+08:00","updated":"2025-03-30T15:32:30.309+08:00"}
---


![[13StacksAndQueues.pdf]]
### stacks and queue introduce
the stack and queue, differ in the way in which the item to be removed is chosen.
- stack LIFO
- queue FIFO
![Pasted image 20250117151739.png](/img/user/accessory/Pasted%20image%2020250117151739.png)
Our sub text today is all about modular programming.
The idea is to completely separate the interface and the implementation.
So when we have these types of data structures and data types that are precisely defined, like stacks and queues ans so forth, what we weant to do is completely separate the details of the implementation form the client. The client can have many different implementations from which to choose, but the client code should only perform the basic operations.
The implementation, on the other hand, can't know the details of the client needs. All it's supposed to do is implement those operations.In other way, many clients can reuse the same implementation. 
So this allows use to create modular, reusable libraries of algorithms and data structure that we can use to build more complicated algorithms and data structures.

### stacks
![Pasted image 20250117152755.png](/img/user/accessory/Pasted%20image%2020250117152755.png)

the first implementation is to use linked-list.
![Pasted image 20250117153025.png](/img/user/accessory/Pasted%20image%2020250117153025.png)

analysis of performance
have no loop
![Pasted image 20250117153243.png](/img/user/accessory/Pasted%20image%2020250117153243.png)



array implementation
![Pasted image 20250117153727.png](/img/user/accessory/Pasted%20image%2020250117153727.png)
Now there's a fundamental defect in using an array and that is that you have to declare the size of the array ahead of time and then so the stack has a certain capacity.

But we do have to worry in Java about a problem called Loitering(对象游离) and that is the idea that we have references to an object in our array implementation in the stack array when we're not really using it. So when we decrement that value N, there's still a pointer to the thing that we took off the stack in that array. Even though we know we're not using it, the Java system doesn't know that.
![Pasted image 20250117154333.png](/img/user/accessory/Pasted%20image%2020250117154333.png)



### resizing arrays
first thing you might think of is, when the client pushes a new item onto stack, increase the size of the array by 1, and when it pops, decrease the size of the array by 1.
but it's too expensive to do that.
The reason is that you have to create a new array, size one bigger, and copy all the items to that new array.
Inserting first N items takes time proportional to $N^2$

So the well-known technique for doing that, called repeated doubling.
If array is full, create a new array of twice the size, and copy items.
![Pasted image 20250117185355.png|400](/img/user/accessory/Pasted%20image%2020250117185355.png)

Inserting first N items takes time proportional to N
And the reason is that you only create a new array every time it doubles. But by the time that it doubles, you've inserted that many items into the stack. So on average, it's like adding a cost of one to each operation. So if you just calculate the cost of inserting the first N items, you're going to have instead of the sum of the integers from to 1 to N, you're going to have the sum of the powers of 2 from 1 to N. And that'll give a total cost of about 3N.
![Pasted image 20250117185723.png|500](/img/user/accessory/Pasted%20image%2020250117185723.png)
So that's called amortized analysis(平摊分析), where we consider the total cost average over all operations.

shrink array?
the first we consider is half size of array when array is one-half full.
But there is one phenomenon called thrashing(抖动)
![Pasted image 20250117190044.png|500](/img/user/accessory/Pasted%20image%2020250117190044.png)
If the client happens to do push-pop-push-pop alternating when the array if full, then it's going to be doubling, having, doubling, having. Creating new arrays on every operation.
each operation takes time proportional to N.

the efficient solution is to wait until the array gets one-quarter full before you have it.
![Pasted image 20250117190305.png|400](/img/user/accessory/Pasted%20image%2020250117190305.png)

- So the invariant of that is that the array is always between 25% and 100% full.
- the every time you resize, you're already paid for it in an amortized sense by interesting, pushing or popping.

![Pasted image 20250117190719.png](/img/user/accessory/Pasted%20image%2020250117190719.png)
use less memory than linked-list stack.


So, a question is what are the tradeoffs between using a resizing array versus a linked list?

for the linked lists, every operations takes constant time in the worst case, that's a guarantee.
but we have use a little extra time and space to deal with the links. So it's going to be slower.

resizing-array implementation. we have a good amortized time, so total averaged over the whole process is good. We have less wasted space and probably faster implementation of each operation.

And so for some clients, maybe that makes a difference. Perhaps you wouldn't want to use a resizing-array implementation at the moment that your plane's coming in for a landing. You wouldn't want it to all of a sudden not implement some operation quickly. If you need that kind of order, maybe in an internet switch where packets are coming through at a great rate, you wouldn't want to be in a situation where you're missing some data because something got slow all of a sudden. So that's a tradeoff that the client can make. If I want that guarantee, if I want to be sure that every operation's going to be fast, I'll use a linked list. And if I don't need that guarantee, if I just care about the total amount of time, I'll probably use the resizing-array because the total will be much less, because individual operations are fast. So even with these simple data structures, we have really important tradeoffs that actually make a difference in lots of practical situations.


### queues
![Pasted image 20250119134405.png](/img/user/accessory/Pasted%20image%2020250119134405.png)
![Pasted image 20250119135835.png|500](/img/user/accessory/Pasted%20image%2020250119135835.png)


![Pasted image 20250119135953.png](/img/user/accessory/Pasted%20image%2020250119135953.png)

### generics
Next we're going to consider addressing another fundamental defect in the implementations we've considered so far that those implementations are only good for strings.

there we maybe need to implemented stackOfStrings, stackOfURLs, stackOfInts, stackOfVans.
the first consider maybe is to implement a separate stack class for each type of data that we're using. we need to copy that code and chage the data type.
Unfortunately that situation at the beginning of Java where stuck with that are plenty of programming language where basically we're stuck with that.

the second:
![Pasted image 20250119141503.png|500](/img/user/accessory/Pasted%20image%2020250119141503.png)

the third attempt
uses generics.
![Pasted image 20250119141544.png](/img/user/accessory/Pasted%20image%2020250119141544.png)
![Pasted image 20250119141903.png](/img/user/accessory/Pasted%20image%2020250119141903.png)

With arrays, it doesn't quite work and again all programming languages and, you know, many programming languages nowadays have difficulties with this and Java's got a particular difficulty.
but java not allow generic array creation.

so we need to create an array of objects and then we cast it down to an array of items.
![Pasted image 20250119142349.png|400](/img/user/accessory/Pasted%20image%2020250119142349.png)
but the use cast down is not a good code. and java will give the warning message.
![Pasted image 20250119142523.png|500](/img/user/accessory/Pasted%20image%2020250119142523.png)

the details.
we need use the java wrapper object type, example the integer


### interators
there's another facility that java provides that leads to very elegant compact client code that's definitely worthwhile to add to our basic data types and that's iteration.
what we want to do is to allow the client to iterate through the items in the collection. But we dont't have the client to know whether we're using an array or link list or whatever internal representation we might have in mind. It's not relevant to the client.
Java provide a nice a solution to this called iteration.
so we're going to do is look at how to make our stack and queue implement the iterable interface.

what is an Iterable?
has a method that returns an Interator.
![Pasted image 20250119143945.png|400](/img/user/accessory/Pasted%20image%2020250119143945.png)

what is the interator?
has methods hasNext() and next()
![Pasted image 20250119144048.png|400](/img/user/accessory/Pasted%20image%2020250119144048.png)

It seems like a lot of baggage to carry around and the reason that we do it, why do we go to the trouble doing it is that we can, if we have a data structure that's iterable we can use a very compact and elegant client code in Java, the so called for-each statement.
![Pasted image 20250119144203.png](/img/user/accessory/Pasted%20image%2020250119144203.png)

stack interator
![Pasted image 20250119145351.png](/img/user/accessory/Pasted%20image%2020250119145351.png)

![Pasted image 20250119145456.png](/img/user/accessory/Pasted%20image%2020250119145456.png)


a structure bug
![Pasted image 20250119145625.png](/img/user/accessory/Pasted%20image%2020250119145625.png)
the order is not matter


### applications
fist thing to mention is that often the kinds of data types and data structures that we implement or found in a Java library. So, that's true

so why not just use those? Why use our own implementations?
the problem is often in such library code is kind of designed by committee phenomenon that more and more operations get added and the API bacome too broad or bloated.
the most problem is the real problem is that when you do that you can't know much about the performance or you can't assume much about the performance.

stack applicaitons
- stack are usually fundamental underlying computation because they implement, reurison and so.
- you use stack often everyday when you wrote, use the Back button in the Web browser, the place that you're been are saved on a stack.
- the compilers implement funciton is using stacks.
	when there's a funciton call the whole local environment is pushed and then along with the return address and then the funcion returned is pop the return address in the local environment.
- two-stack algorithm for arithmetic expression ecaluation. ---- Dijkstra
	![Pasted image 20250119163244.png](/img/user/accessory/Pasted%20image%2020250119163244.png)
