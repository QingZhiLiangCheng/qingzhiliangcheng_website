---
{"tags":["project","cmu15445","bustub"],"dg-publish":true,"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Project 2 Hash Index (fall2023)/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-04-30T23:10:47.890+08:00","updated":"2025-05-04T16:11:15.256+08:00"}
---

### Task 1 - Read/Write Page Guards
task 1 要实现三个类 分别是BasicPageGuard, ReadPageGuard, WritePageGuard.
在这里名字似乎BasicPageGuard是基类 但这里bustub源码中并没有用继承 他们之间属于has-a的关系 BasicPageGuard是ReadPageGuard与WritePageGuard的成员
同时 ReadPageGuard与WritePageGuard是BasicPageGuard的友元类 -- 可以访问BasicPageGuard的任意成员
为什么实现这三个类？
Project 1中实现了Buffer Pool, Buffer Pool以页为基本单位，对外提供内存资源。页被封装为Page，Page具有一个十分重要的属性：`pin_count_`，表示正在使用该Page的线程数量
`pin_count_`非0时，Buffer Pool无法驱逐该Page，也就是无法从磁盘加载数据到内存。显而易见的是：如果程序出现意外，某个Page的pin_count_永不为0，轻则降低DBMS的运行速度，重则使系统崩溃，无法加载数据。也可以说，这是一种资源泄漏。
C++如何解决资源泄漏？一个经典的例子：使用智能指针解决内存泄漏。智能指针依赖于RAII机制：利用对象的生命周期，在构造函数中获取资源，在析构函数中释放资源。而我们要实现的PageGuard只使用了RAII的一部分：在析构函数中释放资源。同时还提供了手动释放资源的接口，以提高DBMS在并发环境下的运行效率。
PageGuard函数实现
对于每个类实现
- 移动构造函数
- 移动赋值函数
- `Drop()`：手动释放资源，并放弃对资源的管理权提前释放，不用等到 Guard 生命周期结束就释放页面
- 析构函数

> [!todo]
> You will need to implement the following functions for all `BasicPageGuard`, `ReadPageGuard` and `WritePageGuard`.
> - `PageGuard(PageGuard &&that)`: Move constructor.
> - `operator=(PageGuard &&that)`: Move operator.
> - `Drop()`: Unpin and/or unlatch.
> - `~PageGuard()`: Destructor.

这里有好多我没听过或者不熟悉的术语
[[high-language/CPP/右值引用 移动语义\|右值引用 移动语义]]

**Move Constructor**
```cpp
class BasicPageGuard {
 public:
  BasicPageGuard(BasicPageGuard &&that) noexcept;
 private:  
  friend class ReadPageGuard;  
  friend class WritePageGuard;  
  
  [[maybe_unused]] BufferPoolManager *bpm_{nullptr};  
  Page *page_{nullptr};  
  bool is_dirty_{false};  
};
```

![Pasted image 20250503223151.png|600](/img/user/accessory/Pasted%20image%2020250503223151.png)
所以我们把that的值赋给this后 还有把that清空
```cpp
BasicPageGuard::BasicPageGuard(BasicPageGuard &&that) noexcept {  
  bpm_ = that.bpm_;  
  page_ = that.page_;  
  that.page_ = nullptr;  
  that.bpm_ = nullptr;  
  this->is_dirty_ = that.is_dirty_;  
}
```

ReadPageGuard和 WritePageGuard的和BasicPageGuard的相似
![Pasted image 20250503223249.png|550](/img/user/accessory/Pasted%20image%2020250503223249.png)

```cpp
class ReadPageGuard {  
 private:  
 // You may choose to get rid of this and add your own private variables.  
 BasicPageGuard guard_;
};
```

```cpp
ReadPageGuard::ReadPageGuard(ReadPageGuard &&that) noexcept { 
	guard_ = std::move(that.guard_); 
};
```
其实就是用了个`std::move` 这个函数主要就是变成右值的
同理
```cpp
WritePageGuard::WritePageGuard(WritePageGuard &&that) noexcept { 
	guard_ = std::move(that.guard_);
}
```

**Move operator**
移动赋值函数 事实上就是对=的一个重载
要先释放this的资源 然后将that的复制给this
![Pasted image 20250503223801.png|500](/img/user/accessory/Pasted%20image%2020250503223801.png)

```cpp
auto BasicPageGuard::operator=(BasicPageGuard &&that) noexcept -> BasicPageGuard & {  
  Drop();  
  bpm_ = that.bpm_;  
  page_ = that.page_;  
  that.page_ = nullptr;  
  that.bpm_ = nullptr;  
  this->is_dirty_ = that.is_dirty_;  
  return *this;  
}
```
在释放this的资源的时候 其实是用到了Drop函数 Drop函数也是我们在Task1应该实现的一个函数 作用就是释放资源
![Pasted image 20250503223934.png|550](/img/user/accessory/Pasted%20image%2020250503223934.png)
it should tell the BPM that we are done using this page 主要说的就是我们要通知BufferPool 我们已经使用完成 pin_count_应该减一了 而BufferPool中在Project1中实现的unpin的那个函数应该是UnpinPage
所以Drop函数就是要调用UnpinPage 然后 置空
```cpp
void BasicPageGuard::Drop() {  
  if (bpm_ != nullptr && page_ != nullptr) {  
    bpm_->UnpinPage(page_->GetPageId(), is_dirty_);  
  }  
  bpm_ = nullptr;  
  page_ = nullptr;  
}
```
ReadPageGuard的和ReadPageGuard的移动赋值函数 与 BasicPageGuard的移动复制函数类似 也是调用各自的Drop函数然后赋值
```cpp
auto ReadPageGuard::operator=(ReadPageGuard &&that) noexcept -> ReadPageGuard & {  
  Drop();  
  guard_ = std::move(that.guard_);  
  return *this;  
}

auto WritePageGuard::operator=(WritePageGuard &&that) noexcept -> WritePageGuard & {  
  Drop();  
  guard_ = std::move(that.guard_);  
  return *this;  
}
```
只不过这里ReadPageGuard和WritePageGuard的Drop函数跟BasicPageGuard的不太一样
主要是多了一个释放写锁或者是读锁 那这个锁是什么时候加的呢 是在BufferPool中调用这个page的时候加的  所以后面还在Project1 FetchPage的基础上 实现了FetchPageBasic, FetchPageRead, FetchPageWrite.  或者是将BasicPageGuard升级的时候 最初，你可能使用 BasicPageGuard 来暂时持有这些页面 但现在明确现在是Read或者Write 也要加锁


![Pasted image 20250503224741.png|500](/img/user/accessory/Pasted%20image%2020250503224741.png)
```cpp
void ReadPageGuard::Drop() {  
  if (guard_.page_ != nullptr) {  
    guard_.page_->RUnlatch();  
  }  
  guard_.Drop();  
}
```

![Pasted image 20250503224710.png|500](/img/user/accessory/Pasted%20image%2020250503224710.png)
```cpp
void WritePageGuard::Drop() {  
  if (guard_.page_ != nullptr) {  
    guard_.page_->WUnlatch();  
  }  
  guard_.is_dirty_ = true;  
  guard_.Drop();  
}
```
记得write一定是脏页

**Destructor**
析构函数很简单  就是 Drop

**Upgrade**
给BasicPageGuard升级成WritePageGuard和ReadPageGuard
最初 我们可能使用BasicPageGuard来暂时持有这些页面 但当我们确认这些页面确实只需要被读取时 就需要调用UpgradeRead方法
```cpp
auto BasicPageGuard::UpgradeRead() -> ReadPageGuard {  
  if (page_ != nullptr) {  
    page_->RLatch();  
  }  
  auto read_page_guard = ReadPageGuard(bpm_, page_);  
  bpm_ = nullptr;  
  page_ = nullptr;  
  return read_page_guard;  
}
```
注意要加读锁 然后把basic的值赋给read后 释放basic
同样的 当我们确认这些页面确实只需要被write的时候 就需要调用UpgradeWrite方法来升级页面
```cpp
auto BasicPageGuard::UpgradeWrite() -> WritePageGuard {  
  if (page_ != nullptr) {  
    page_->WLatch();  
  }  
  auto write_page_guard = WritePageGuard(bpm_, page_);  
  bpm_ = nullptr;  
  page_ = nullptr;  
  return write_page_guard;  
}
```

**FetchPage**
现在我们通过PageGuard持有该页面（管理资源的生命周期和控制访问） 我们需要实现几个封装了FetchPage 功能的函数，它们会返回不同类型的 PageGuard（如 ReadPageGuard、WritePageGuard），而不是直接返回裸指针或基础页面对象 同时通过ReadPageGuard和WritePageGuard明确表示了不同的锁需求 简化了并发控制
```cpp
auto BufferPoolManager::FetchPageBasic(page_id_t page_id) -> BasicPageGuard {  
  auto page = FetchPage(page_id);  
  return {this, page};  
}  
  
auto BufferPoolManager::FetchPageRead(page_id_t page_id) -> ReadPageGuard {  
  auto page = FetchPage(page_id);  
  if (page != nullptr) {  
    page->RLatch();  
  }  
  return {this, page};  
}  
  
auto BufferPoolManager::FetchPageWrite(page_id_t page_id) -> WritePageGuard {  
  auto page = FetchPage(page_id);  
  if (page != nullptr) {  
    page->WLatch();  
  }  
  return {this, page};  
}
```

**NewPage**
同理 我们要封装NewPage
```cpp
auto BufferPoolManager::NewPageGuarded(page_id_t *page_id) -> BasicPageGuard {  
  auto page = NewPage(page_id);  
  return {this, page};  
}
```

### Task 2 - Extendible Hash Table Pages
Task2 主要是实现了Extendible Hash Table的主要结构
![Pasted image 20250503104407.png|500](/img/user/accessory/Pasted%20image%2020250503104407.png)
主要分为三部分
- Hash Table Header Page
- Hash Table Directory Page
- Hash Table Bucket Page

每个`Extendible Hash Table`有且仅有一张Header Page，根据hash值的**高位**，指向不同Directory Page。Directory Page将根据hash值的**低位**，指向不同的Bucket Page。Bucket Page则是实际存储数据的结构。
在Task2中所有的Hash Table Page的结构 都禁止了**构造，拷贝与移动**相关成员函数。只暴露了Init接口用来对成员进行初始化
从Task2的测试用例中能发现 Hash Table Page是随着Task1写的PageGuarded创建的
![Pasted image 20250503134724.png|600](/img/user/accessory/Pasted%20image%2020250503134724.png)
然后调用的As/AsMut方法 获取的是Page对象的data
![Pasted image 20250503134824.png](/img/user/accessory/Pasted%20image%2020250503134824.png)
其中As是获取当前页面只读的类型  AsMut是获取当前页面可写类型
所以每个Hash Table Page都对应着一个Page. Hash Table Page实际使用的资源为`Page.data_`.

整个构成是这样的
我觉得有点像地址的编址一样
将Hash值的前max_depth_位作为directory的索引 
对于每一个directory page其实又有一个一个local depth和global depth
低global depth位作为索引来找到bucket 也就是说意味着有$2^{global depth}$个bucket 而低local depth位相同的数据会放到同一个bucket
当bucket满了的时候就要分成两个bucket -- local depth+1 而local depth 的最高位为0还是1 刚刚就分到了新的两个桶 当local depth = global depth的时候 还想分裂 就得需要增加global depth的位数 来得到更多的索引 更多的桶的个数

#### Hash Table Header Page
```cpp
 class ExtendibleHTableHeaderPage {  
 private:  
  page_id_t directory_page_ids_[HTABLE_HEADER_ARRAY_SIZE];  
  uint32_t max_depth_;  
};
```
说白了Header Page就是将data的高位作为索引 高位的不同来确定指向了哪个directory page
- `directory_page_ids_`数组：存储Directory Page的id值
- `max_depth_`：数组的最大深度，数组的实际长度为`1 << max_depth_`

Header Page的大小是固定的，它最多只能存储`(1 << max_depth_)`个Directory Page.当我们有值需要放入哈希表时，获取hash(key)的二进制**最高max_depth_位**作为索引，再从header中对应位置去找到directory
对于操作其实蛮简单的
**Init**
就是类似于构造函数一样的一个函数
```cpp
void ExtendibleHTableHeaderPage::Init(uint32_t max_depth) {  
  max_depth_=max_depth;  
  auto size=MaxSize();  
  for (uint32_t i = 0; i < size; i++) {  
    directory_page_ids_[i] = INVALID_PAGE_ID;  
  }  
}
```
用到了MaxSize函数来计算大小 事实上就是2的max_depth次幂 用移位操作就可以
```cpp
auto ExtendibleHTableHeaderPage::MaxSize() const -> uint32_t { 
	return 1 << max_depth_; 
}
```
**HashToDirectoryIndex**
获取该键哈希对应的目录索引，如位深度为2，32位哈希值为0x5f129982，最高有效位前2位为01，应该返回01  注意一下判断特殊条件就可以
```cpp
auto ExtendibleHTableHeaderPage::HashToDirectoryIndex(uint32_t hash) const -> uint32_t {  
  if (max_depth_ == 0) {  
    return 0;  
  }  
  return hash >> (sizeof(uint32_t) * 8 - max_depth_);  
}
```
**GetDirectoryPageId**
获取在指定索引处的值 注意判断一下不要超出最大索引就行
```cpp
auto ExtendibleHTableHeaderPage::GetDirectoryPageId(uint32_t directory_idx) const -> uint32_t {  
  if (directory_idx >= this->MaxSize()) {  
    return INVALID_PAGE_ID;  
  }  
  return this->directory_page_ids_[directory_idx];  
}
```
**SetDirectoryPageId**
设置directory page_id在指定索引处的值 同样记得判断索引不要越界
```cpp
void ExtendibleHTableHeaderPage::SetDirectoryPageId(uint32_t directory_idx, page_id_t directory_page_id) {  
  if (directory_idx >= this->MaxSize()) {  
    return;  
  }  
  directory_page_ids_[directory_idx] = directory_page_id;  
}
```
### Hash Table Directory Page
directory中有两个depth：
- Global Depth：若global depth为n，那么这个Directory就有$2^n$个entry（相当于指向$2^n$个bucket）
- Local Depth：若local depth为n，则在这个对应的bucket下，每个元素的key的最后n位都相同

类似header中获取下一级页的索引，directory获取hash(key)的二进制最低`global_depth_`位作为索引。那local depth的作用是什么呢？
这就要说到可拓展哈希中的插入和删除操作了。简单来说，在可拓展哈希表中，目录directory的大小是可以变化的（只要不超过最大容量限制）。目录中可能有多个entry映射到同一个bucket。当需要插入时，如果这个bucket还没有满时，可以直接插入；否则，需要将这个bucket分裂成两个bucket（或者说，将这个bucket中的一部分移动到另一个bucket中），并且这个bucket对应的local depth + 1，这样相比之前就多了一位二进制位去识别bucket

```cpp
 class ExtendibleHTableDirectoryPage {
 private:  
  uint32_t max_depth_;  
  uint32_t global_depth_;  
  uint8_t local_depths_[HTABLE_DIRECTORY_ARRAY_SIZE];  
  page_id_t bucket_page_ids_[HTABLE_DIRECTORY_ARRAY_SIZE];  
};
```
- `global_depth_`: 当前目录的全局深度 意味着有$2^{globaldepth}$个bucket
- `local_depths_[HTABLE_DIRECTORY_ARRAY_SIZE]`: 一个数组存储的是每个bucket的`local_depth`, 低`local_depth`相同的数据会放到一个bucket中
- `bucket_page_ids_[HTABLE_DIRECTORY_ARRAY_SIZE]`: 每个bucket page的page id

**Init**
初始化
```cpp
void ExtendibleHTableDirectoryPage::Init(uint32_t max_depth) {  
  max_depth_ = max_depth;  
  global_depth_ = 0;  
  std::fill(local_depths_, local_depths_ + (1 << max_depth), 0);  
  std::fill(bucket_page_ids_, bucket_page_ids_ + (1 << max_depth), INVALID_PAGE_ID);  
}
```
用的是指针运算将整个数组都初始化
**HashToBucketIndex**
`auto HashToBucketIndex(uint32_t hash) const -> uint32_t` 获取键对应的哈希桶索引
若global depth为n，那么这个Directory就有$2^n$个entry（相当于指向$2^n$个bucket）
这里用到了Mask掩码的内容 在CSAPP中提到过
```cpp
auto ExtendibleHTableDirectoryPage::HashToBucketIndex(uint32_t hash) const -> uint32_t {  
  return hash & GetGlobalDepthMask();  
}
```
所谓掩码就是0为不重要 1为重要 0就是可以不相同 1就是相同 比如子网掩码 与掩码&运算可以保留掩码中为1的位的值
而这里的掩码就是`global_depth_`个1  意味着去hash的低`global_depth_`位
```cpp
auto ExtendibleHTableDirectoryPage::GetGlobalDepthMask() const -> uint32_t {  
  auto depth = global_depth_;  
  return (1 << depth) - 1;  
}
```
同样的 其实还有一个GetLocalDepthMask函数 比较相似
```cpp

```

**GetBucketPageId and SetBucketPageId** 
```cpp
auto ExtendibleHTableDirectoryPage::GetBucketPageId(uint32_t bucket_idx) const -> page_id_t {  
  return bucket_page_ids_[bucket_idx];  
}  
  
void ExtendibleHTableDirectoryPage::SetBucketPageId(uint32_t bucket_idx, page_id_t bucket_page_id) {  
  bucket_page_ids_[bucket_idx] = bucket_page_id;  
}
```

**GetSplitImageIndex**
分裂桶，并返回新的桶索引
分裂之后事实上是新增的那一位 通过0 和 1 来区分两个桶的位置
- 假设Bucket的local_depth：2，bucket_idx：01
- 分裂成两个Bucket后：old_bucket_idx：001 new_bucket_idx：101

```cpp
auto ExtendibleHTableDirectoryPage::GetSplitImageIndex(uint32_t bucket_idx) const -> uint32_t {  
  return bucket_idx ^ (1 << (local_depths_[bucket_idx] - 1));  
}
```

**IncrGlobalDepth**
目录全局深度加一
增加 global_depth 要做的就是拷贝一份原有的 buckets， 如 bucket_idx 00 分裂为 000 和 100， 把 00 的内容拷贝一份到 100 中即可
```cpp
void ExtendibleHTableDirectoryPage::IncrGlobalDepth() {  
  if (global_depth_ > max_depth_) {  
    return;  
  }  
  for (int i = 0; i < 1 << global_depth_; ++i) {  
    bucket_page_ids_[(1 << global_depth_) + i] = bucket_page_ids_[i];  
    local_depths_[(1 << global_depth_) + i] = local_depths_[i];  
  }  
  global_depth_++;  
}
```

**DecrGlobalDepth**
目录全局深度减一
```cpp
void ExtendibleHTableDirectoryPage::DecrGlobalDepth() {  
  if (global_depth_ <= 0) {  
    return;  
  }  
  global_depth_--;  
}
```

**CanShrink()**
如果目录可以收缩(即可以减少全局深度)返回true
检查所有的 bucket 的 local_depth， 如果都比 global depth 要小， 就可以缩小 global_depth.
```cpp
auto ExtendibleHTableDirectoryPage::CanShrink() -> bool {  
  if (global_depth_ == 0) {  
    return false;  
  }  
  for (uint32_t i = 0; i < Size(); i++) {  
    if (local_depths_[i] == global_depth_) {  
      return false;  
    }  
  }  
  return true;  
}
```

**其他几个函数**
```cpp
auto ExtendibleHTableDirectoryPage::Size() const -> uint32_t { return 1 << global_depth_; }  
  
auto ExtendibleHTableDirectoryPage::GetLocalDepth(uint32_t bucket_idx) const -> uint32_t {  
  return local_depths_[bucket_idx];  
}  
  
void ExtendibleHTableDirectoryPage::SetLocalDepth(uint32_t bucket_idx, uint8_t local_depth) {  
  local_depths_[bucket_idx] = local_depth;  
}  
void ExtendibleHTableDirectoryPage::IncrLocalDepth(uint32_t bucket_idx) {  
  if (local_depths_[bucket_idx] < global_depth_) {  
    ++local_depths_[bucket_idx];  
  }  
}  
void ExtendibleHTableDirectoryPage::DecrLocalDepth(uint32_t bucket_idx) {  
  if (local_depths_[bucket_idx] > 0) {  
    --local_depths_[bucket_idx];  
  }  
}  
auto ExtendibleHTableDirectoryPage::GetMaxDepth() const -> uint32_t { return max_depth_; }
```

#### Hash Table Bucket Page
Bucket Page是真正存储键值对的地方
具体的类名是ExtendibleHTableBucketPage，有三个成员：
`size_`：用来表示array_数组的大小
`max_size_`：用来表示array_数组的最大大小，即容量
`array_`数组：实际存储数据的地方，元素的类型为pair<KeyType, ValueType>
需要注意：ExtendibleHTableBucketPage是一个类模板：
```cpp
template <typename KeyType, typename ValueType, typename KeyComparator>  
class HashTableBucketPage {
 private:  
  //  For more on BUCKET_ARRAY_SIZE see storage/page/hash_table_page_defs.h  
  char occupied_[(BUCKET_ARRAY_SIZE - 1) / 8 + 1];  
  // 0 if tombstone/brand new (never occupied), 1 otherwise.  
  char readable_[(BUCKET_ARRAY_SIZE - 1) / 8 + 1];  
  // Flexible array member for page data.  
  MappingType array_[1];  
};
```
其中第三个模版参数为比较器 重载了opertor类 但要主要返回的是-1 1 0
**Init**
初始化
```cpp
template <typename K, typename V, typename KC>  
void ExtendibleHTableBucketPage<K, V, KC>::Init(uint32_t max_size) {  
  max_size_ = max_size;  
  size_ = 0;  
}
```

**Lookup**
查找key,如果找到了把`key(array[i],first)`对应的值`(array[i].second)`赋给value，返回true
```cpp
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::Lookup(const K &key, V &value, const KC &cmp) const -> bool {  
  for (uint32_t i = 0; i < size_; ++i) {  
    if (cmp(array_[i].first, key) == 0) {  
      value = array_[i].second;  
      return true;  
    }  
  }  
  return false;  
}
```

**Insert**
插入键值对
```cpp
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::Insert(const K &key, const V &value, const KC &cmp) -> bool {  
  if (IsFull()) {  
    return false;  
  }  
  for (uint32_t i = 0; i < size_; ++i) {  
    if (cmp(array_[i].first, key) == 0) {  
      return false;  
    }  
  }  
  array_[size_++] = std::make_pair(key, value);  
  return true;  
}
```

**Remove**
删除键值对
```cpp
auto ExtendibleHTableBucketPage<K, V, KC>::Remove(const K &key, const KC &cmp) -> bool {  
  for (uint32_t i = 0; i < size_; ++i) {  
    if (cmp(array_[i].first, key) == 0) {  
      // 找到键并删除  
      for (uint32_t j = i + 1; j < size_; ++j) {  
        array_[j - 1] = array_[j];  
      }  
      size_--;  
      return true;  
    }  
  }  
  return false;  
}
```

**其他几个函数**
```cpp
template <typename K, typename V, typename KC>  
void ExtendibleHTableBucketPage<K, V, KC>::RemoveAt(uint32_t bucket_idx) {  
  for (uint32_t i = bucket_idx; i <= size_; ++i) {  
    array_[i] = array_[i + 1];  
  }  
  size_--;  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::KeyAt(uint32_t bucket_idx) const -> K {  
  return EntryAt(bucket_idx).first;  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::ValueAt(uint32_t bucket_idx) const -> V {  
  return EntryAt(bucket_idx).second;  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::EntryAt(uint32_t bucket_idx) const -> const std::pair<K, V> & {  
  return array_[bucket_idx];  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::Size() const -> uint32_t {  
  return size_;  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::IsFull() const -> bool {  
  return size_ == max_size_;  
}  
  
template <typename K, typename V, typename KC>  
auto ExtendibleHTableBucketPage<K, V, KC>::IsEmpty() const -> bool {  
  return size_ == 0;  
}  
  
template <typename KeyType, typename ValueType, typename KeyComparator>  
void ExtendibleHTableBucketPage<KeyType, ValueType, KeyComparator>::Clear() {  
  size_ = 0;  
}
```

### Task 3 -  Extendible Hashing Implementation & Task 4 - Concurrency Control
开始真正的完整的实现Extendible Hashing的操作 真正获取到hash值 选择适合的PageGuard依次持有Header Page, Directory Pgae, Bucket Page来完成相关的操作

