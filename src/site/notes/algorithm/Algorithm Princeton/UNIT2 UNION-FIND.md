---
{"dg-publish":true,"permalink":"/algorithm/Algorithm Princeton/UNIT2 UNION-FIND/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-14T09:51:14.779+08:00","updated":"2025-03-30T15:32:20.927+08:00"}
---


![[15UnionFind.pdf]]
### dynamic connectivity
union find problem---- a set of algorithms for solving the so-called dynamic connectivity problem.
- Quick Find
- Quick Union

the steps that we'll develop a useful algorithm.

The first steps is to model the problem.
	try to understand what are the main elements of the problem that need to be solved. Then we will find some algorithm  to solve the problems. But in many cases,the first algorithm we come up with would be fast enough and maybe it fits in memory, we will go ahead and use it.
	but in many other cases maybe it's not fast enough,or there's not enough memory. we should do it try to figure out why,find a way to address whatever's causing the problem,find a new algorithm and iterate until we're satisfied.


the union find-----to find is there a path connecting the two objects
![Pasted image 20250112170420.png|400](/img/user/accessory/Pasted%20image%2020250112170420.png)
the study is answer the question,is there a path? not to find the path.

the union algorithm's application
- photos: Pixels
- network: computers
- social network: people
- computer chip: transistors
- Elements in a mathematical set. 
- Variable names in Fortran program.
- Metallic sites in a composite system

we assume "is connected to " is an equivalence relation:
- p->p  can connective themselves
- if p->q   q->p
- p->q  q->r  p->r
????  离散数学上的等价：自反性  对称性  传递性

connection divide into subsets called connected components(连通分量)
A connected component is a maximal set of objects that's mutually connected.
![Pasted image 20250112171452.png|200](/img/user/accessory/Pasted%20image%2020250112171452.png)
the algorithms will gain efficiency by maintaining connected components and using that knowledge to efficiently answer the query that's they're presented.

the implementing the operations:
- union command: replace components containing two objects with their union.
- find: check if the two objects in the same component.
![Pasted image 20250112171939.png](/img/user/accessory/Pasted%20image%2020250112171939.png)

API:
![Pasted image 20250112172052.png|400](/img/user/accessory/Pasted%20image%2020250112172052.png)
![Pasted image 20250113092353.png|700](/img/user/accessory/Pasted%20image%2020250113092353.png)


### quick-find
In this,we look at our first implementation of an algorithm for solving dynamic connectivity problem called,Quick-find.----this is a so called eager algorithm(这是一种贪心算法)

the data structure we use is an integer array.  if p and q connected they have the same id.
example:
	![Pasted image 20250113092931.png](/img/user/accessory/Pasted%20image%2020250113092931.png)

so the find funciton is to check if p and q have the same id.

the union function is to merge components containing p and q,change all entries whoes is equals is `id[p] to id[q]`.
	but that is a bit of a problem when we have a huge number of objects.

![Pasted image 20250113093706.png|600](/img/user/accessory/Pasted%20image%2020250113093706.png)

some detail about the algorithm:
	- both the initialized and union operations invloved the forloop that go through the entire array.  O(n)
	- find is easy  O(1)

but the union is too expensive.
if you have n objects and n union commands  is O($n^2$)



my Implemention

```java
import java.util.Scanner;  
public class Main{  
    public static void main(String[] args) {  
        Scanner scanner=new Scanner(System.in);  
        int n=scanner.nextInt();  
        QuickFindUF quickFindUF=new QuickFindUF(n);  
  
        while(true){  
            int p=scanner.nextInt();  
            int q=scanner.nextInt();  
            if(!quickFindUF.connected(p,q)) {  
                quickFindUF.union(p, q);  
                quickFindUF.print();  
            }  
        }  
    }  
}
```

```java
public class QuickFindUF {  
    private int[] id;  
  
    public QuickFindUF(int n){  
        id=new int[n];  
        for(int i=0;i<n;i++){  
            id[i]=i;  
        }  
    }  
  
    public boolean connected(int p,int q){  
        return id[p]==id[q];  
    }  
  
    public void union(int p,int q){  
        int pValue=id[p];  
        int qValue=id[q];  
        for(int i=0;i<id.length;i++){  
            if(id[i]==qValue){  
                id[i]=pValue;  
            }  
        }  
    }  
  
    public void print(){  
        for(int a:id)  
            System.out.print(a+" ");  
        System.out.println();  
    }  
}
```

### quick-union
the quick-find is to slow.
the first attempt is an alternative called,Quick-union.
call lazy approach to algorithm design where we try to avoid doing work until we have to.

we use the same strucutre.
but the array have a different interpretation.
we think of that as representing a set of trees that's called a forest. 
![Pasted image 20250113100759.png](/img/user/accessory/Pasted%20image%2020250113100759.png)

each entry in the array is going to contain a reference to its parent in the tree.

so
the find is to check if p and q have the same root.---this is need some computation
but the union operation is very easy.---only one value change.
	example: union (3,5)
	![Pasted image 20250113101433.png](/img/user/accessory/Pasted%20image%2020250113101433.png)

![Pasted image 20250113101822.png](/img/user/accessory/Pasted%20image%2020250113101822.png)

log n??

but is n
![Pasted image 20250113102002.png|600](/img/user/accessory/Pasted%20image%2020250113102002.png)
the tree can get tall

```java
public class QuickUnionUF {  
    private int[] id;  
  
    public QuickUnionUF(int n){  
        id=new int[n];  
        for(int i=0;i<n;i++)  
            id[i]=i;  
    }  
  
    public int getRoot(int q){  
        int i=id[q];  
        while(i!=id[q])  
            i=id[i];  
        return i;  
    }  
  
  
    public boolean connected(int p,int q){  
        return getRoot(p)==getRoot(q);  
    }  
  
    public void union(int p,int q){  
        int pRoot=getRoot(p);  
        int qRoot=getRoot(q);  
        id[pRoot]=qRoot;  
    }  
  
    public void print(){  
        for(int a:id){  
            System.out.print(a+" ");  
        }  
        System.out.println();  
    }  
  
}
```


### improvements
we have look at the quick-find and quick-union algorithms. Both of which are easy to implement. But simly can't support a huge dynamic connectivity problems.

a very effective improvment,it's called weighting.
the idea is to when implementing the quick union algorithm take steps to avoid having tall trees.
we want to try to do is avoid putting the large tree lower, we should keep track of the number of the objects in each tree.
we will maintain balance by making sure that we link the root of the smaller tree to the root of the large tree.----- we always put the smaller tree lower.
example:
	![Pasted image 20250114095954.png](/img/user/accessory/Pasted%20image%2020250114095954.png)
	9 is smaller,so 9 in lower.
	![Pasted image 20250114100024.png](/img/user/accessory/Pasted%20image%2020250114100024.png)

 ![Pasted image 20250114100151.png](/img/user/accessory/Pasted%20image%2020250114100151.png)
in implementation
we need ana extra array, that for each item, gives the number of objects in the tree routed at the item.
the find operation is identical to quick-union.
the union root we need to link root of smaller tree to root of large tree. and update the size array.
![Pasted image 20250114100443.png|400](/img/user/accessory/Pasted%20image%2020250114100443.png)
`why is sz[j]+=sz[i]`  in the first, i think the big and smaller is said height.  but it is the number of elements.

$log_2 N$ 
depth of any node x is at most lgN
why is it true that the depth of any node x is,at most, log base two of N?  x is depth
the key to understanding that is to, take a look at exactly when does the depth of any node increase?
![Pasted image 20250114101128.png|200](/img/user/accessory/Pasted%20image%2020250114101128.png)
increase by 1 when tree t1 containing x is merged into another tree t2
the size of tree containing x at least doubles since t2>=t1
哦哦 这里是看的t1  t1和t2 连接 必然深度加1  size至少翻倍
So, that's the key because that means that the size of the tree containing x can double at most log N times because if you start with one and double log N times, you get N and there's only N nodes in the tree
他的意思是想要深度加1就得翻倍  从一个节点开始   翻倍 深度加1  但是只有n个节点 所以只能加倍lgn次

![Pasted image 20250114102122.png|300](/img/user/accessory/Pasted%20image%2020250114102122.png)

improvement2: path compression
set the id of each examined node to point to that root.
![Pasted image 20250114102337.png|300](/img/user/accessory/Pasted%20image%2020250114102337.png)

![Pasted image 20250114102359.png|300](/img/user/accessory/Pasted%20image%2020250114102359.png)

![Pasted image 20250114102515.png|400](/img/user/accessory/Pasted%20image%2020250114102515.png)
the algorithm is close to linear.  and it can prove that there is no linear algorithms
```java
public class QuickUnionImprovement {  
    private int[] id;  
    private int[] sz;  
  
    public QuickUnionImprovement(int n) {  
        id = new int[n];  
        sz = new int[n];  
        for (int i = 0; i < n; i++) {  
            id[i]=i;  
            sz[i]=1;  
        }  
    }  
  
    public int getRoot(int p){  
        while(p!=id[p]){  
            id[p]=id[id[p]];  
            p=id[p];  
        }  
        return p;  
    }  
  
    public boolean connected(int p,int q){  
        return getRoot(p)==getRoot(q);  
    }  
  
    public void union(int p,int q){  
        int pId=id[p];  
        int qId=id[q];  
  
        if(sz[pId]<sz[qId]){  
            id[pId]=qId;  
            sz[q]+=sz[p];  
        }else{  
            id[qId]=pId;  
            sz[p]+=sz[q];  
        }  
    }  
  
    public void print(){  
        for(int a:id){  
            System.out.print(a+" ");  
        }  
        System.out.println();  
    }  
}
```

### applications
we talk about dynamic connectivity in networks,
the important one is in image processing for understanding how to label areas in images.
In part2, we can learn Kruskal's minimum spanning tree algorithm, which is a graph processing algorithm which use Union-Find as a subroutine.

Percolation----a pyhsical phenomenon
![Pasted image 20250114162151.png](/img/user/accessory/Pasted%20image%2020250114162151.png)
![Pasted image 20250114162308.png](/img/user/accessory/Pasted%20image%2020250114162308.png)

You can think of for electricity. You could think of a vacant site as being a conductor and, and a block site as being insulated. And so if there's a conductor from top to bottom then the thing conducts electricity. Or, you could think of it as, as water flowing through a porous substance of some kind. Where a vacant side is just empty and a block side has got some material, and either the water flows through from top to bottom, or not. Or you could think of a social network where it's people connected and either there's a c onnection between two people or not and these are a way not to get from one group of people to another communicating through that social network.

![Pasted image 20250114162536.png|300](/img/user/accessory/Pasted%20image%2020250114162536.png)
when it's low. it's not going to percolate. When it's high,it is going to percolate. And actually, the threshold between when it percolates and when it doesn't percolate is very sharp.

there no one know what the value p is. so we need to have comes from a computational model, where we run simulations to try and determine the value of that probability. And thoes simulations are only enable be fast union find algorithms.

we're going to run is called a so called Monte Carlo simulation.
where we initialize the whole grid to be block all black and then we randomly fill in open sites.And we keep going. And every time we add an open site, we check to see if it makes the system percolate. And we keep going until we get to a point where the system percolates.. And we can show that the vacancy percentage at the time that it percolates is an estimate of this threshold value. So what we want to do is run this experiment millions of times, which we can do in a computer, as long as we can, efficiently do the calculation of does it percolate or not. That's a Monte Carlo simulation, a computational problem that gives us a solution to this, scientifc problem where, mathematical problems nobody knows how to solve yet.

the detial
- create an object for each item
![Pasted image 20250114163433.png|500](/img/user/accessory/Pasted%20image%2020250114163433.png)
- connet them together 
![Pasted image 20250114163541.png|500](/img/user/accessory/Pasted%20image%2020250114163541.png)
- check iff any site on bottom row in connected to site on top row.
![Pasted image 20250114163656.png|500](/img/user/accessory/Pasted%20image%2020250114163656.png)
	is O(n2)

our solution is to have a virtual top site and a virtual bottom site.
we only need check if the vitrual top site and virtual bottom site connection.
![Pasted image 20250114163917.png|500](/img/user/accessory/Pasted%20image%2020250114163917.png)

![Pasted image 20250114163931.png|500](/img/user/accessory/Pasted%20image%2020250114163931.png)
up to 4 calls to union, the key is iff have open around the site.

backwash的问题     不能用虚拟尾结点相连  也就是说 4 * 4的 1,1 1,2 1,3 1,4 通了  4,3不能有