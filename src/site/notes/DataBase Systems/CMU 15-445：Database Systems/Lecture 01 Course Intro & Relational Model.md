---
{"week":"第一周","dg-publish":true,"tags":["week1","cmu15445"],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Lecture 01 Course Intro & Relational Model/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-01-20T09:31:02.481+08:00","updated":"2025-04-19T09:54:22.199+08:00"}
---


### ppt
![[01-introduction.pdf]]

he says:
And the most important thing you get to understand is I really only care about two things in my entire life. The first one is my wife and my biological daughter and the second one databases.
hhhh

This course is about the design/implementation of database management systems (DBMSs)

---

databases is a collection of data that's somehow inter-related together, that's meant to model some aspect of the real world.
if you have a university,
the database is the data that represents the students of the courses they take.
the database system is the software that's going to manage that database.

if we create a database that models a digital music store to keep track of artists and albums. we have a very simple model where we just have a a table or file that represents artists and then a collection of data represents the albums that they produce.
so a really simple system we could build for this would just be to store the artists and the albums information in two separate files.  -----   artist.csv  and  albums.csv
we just have to open the file line by line and try to find the data.
![Pasted image 20250120100708.png](/img/user/accessory/Pasted%20image%2020250120100708.png)
if we want to get the "GZA", we only need a python code.
![Pasted image 20250120100927.png](/img/user/accessory/Pasted%20image%2020250120100927.png)
this a database, and it not a really database system. but this is a way to interact with the database.
this a bad idea.
this querying is liner time.
and it's not safe.

some questions:
- how do we ensure that the artist is the same for each album entry?
- what if somebody overwrites the album year with an invalid string?
- what if there are multiple artists on an album?
- what happens if we delete an artist that has albums?  how do I make sure I delete all his albums? it's not a connect.
- this is python code, If I have a new application I want to use the same fils but I'm going to write it in rust code. I must write the basically the same logic do how to parse parse the file and jump to what offset.

-> so a database management system is going to be a piece of software, that's going to expose an api to your application code, that allows you to store and analyze and manipulate data in database.

A general-purpose DBMS supports the definition, creation, querying, update, and administration of databases in accordance with some data model

A data model is a collection of concepts for describing the data in a database. 
A schema is a description of a particular collection of data, using a given data model.

Ted Codd first devised the relational model in 1969
The key tenets:
1. Store database in simple data structes---- relations.
2. Physical storage left up the DBMS implementation.
	so no longer do you have to define I want to start my data as a tree or manage a hash table or columns or a row store. you just say here's my relation here's my attrubutes and the database system can try to make the best decision of how it actually wants to store it 
3. Access the data through the high-level language. just say what you want to do, and the database figure out the best way to do that.

a relation is an unordered set that contain the relationship of attributes that represent entities.
a tuple is the mainifestation of a bunch of attribute values. that are collected together representing an entity.
n-ary releation = table with n columns
关系就是就是整个表 
而tuple就是其中一条（一行）数据  组成的一个对象

the way we're going to identify unique tuples is through what is called the primary key.
the primary key is going to be some set of attrbutes one or more.
![Pasted image 20250120105519.png|400](/img/user/accessory/Pasted%20image%2020250120105519.png)

a foreign key specifies that an attibute from one relation has to map to a tuple in another relation.
we can't just put the artist id in there because we can't store a array.
so we need a way to have this mapping -----  the cross reference table
![Pasted image 20250120105915.png](/img/user/accessory/Pasted%20image%2020250120105915.png)

![Pasted image 20250120111443.png](/img/user/accessory/Pasted%20image%2020250120111443.png)
we have two ways.
and this chapter only introduce the first one.

![Pasted image 20250120111535.png|300](/img/user/accessory/Pasted%20image%2020250120111535.png)

wc 一阶谓词逻辑
![Pasted image 20250120111718.png|500](/img/user/accessory/Pasted%20image%2020250120111718.png)
![Pasted image 20250120112016.png|400](/img/user/accessory/Pasted%20image%2020250120112016.png)
![Pasted image 20250120112147.png|400](/img/user/accessory/Pasted%20image%2020250120112147.png)
![Pasted image 20250120112300.png|400](/img/user/accessory/Pasted%20image%2020250120112300.png)
![Pasted image 20250120112328.png|400](/img/user/accessory/Pasted%20image%2020250120112328.png)
![Pasted image 20250120112428.png|400](/img/user/accessory/Pasted%20image%2020250120112428.png)
![Pasted image 20250120112521.png|400](/img/user/accessory/Pasted%20image%2020250120112521.png)


The relational model is independent of any query language implementation.
SQLis the de facto standard (many dialects).
![Pasted image 20250120112932.png](/img/user/accessory/Pasted%20image%2020250120112932.png)

具体见学校课程