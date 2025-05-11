---
{"tags":["Java"],"dg-publish":true,"permalink":"/high-language/Java/异常与Java API/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-05-07T08:26:26.275+08:00","updated":"2025-05-07T08:42:50.312+08:00"}
---

异常类都继承自java.lang包下的（） 
A、Error类 
B、Exception类
C、Throwable类 
D、IOError类

在Java中，所有异常类都继承自`java.lang`包下的`Throwable`类。`Exception`类和`Error`类都是`Throwable`的子类。通常，`Exception`用于表示程序应该捕获的异常条件，而`Error`则用于指示严重的错误，通常不期望程序去捕获和处理这些错误

正则表达式

  
下列Matcher类的常用方法中，从目标字符串的第一个字符开始匹配,若匹配成功则返回true的方法是（）
A、boolean find()
B、int start()
C、boolean lookingAt()
<font color="#f79646">D、boolean matcher()</font>

下面对Throwable类常用的方法的功能描述错误的是（） 
A、String getMessage()方法返回异常的消息字符串 
B、String toString()方法返回异常的简单信息描述 
C、void printStackTrace()方法获取异常类名和异常信息以及异常出现在程序中的位置,把信息输出到控制台 
<font color="#f79646">D、String toString()方法返回异常的消息字符串</font>

StringBuffer类
String类
StringBuilder类
StringBuffer是线程安全的，StringBuilder不是线程安全的
BigInteger类  
LocalDate类
Date类
NumberFormat类
`static NumberFormat getInstance(Locale i）` 返回指定语言环境的通用数字格式的方法
Integer类
Math类
Runtime类
用于返回Java虚拟机的处理器个数 `maxMemory()`
Period类
`Period` 类在 Java 中用于表示年、月、日的时间段，它并不支持直接转换为纳秒级别的精度
