---
{"dg-publish":true,"tags":["project","cmu15445","bustub"],"permalink":"/DataBase Systems/CMU 15-445：Database Systems/Project 1 Buffer Pool/","dgPassFrontmatter":true,"noteIcon":"","created":"2025-02-21T22:07:27.013+08:00","updated":"2025-05-23T18:40:07.702+08:00"}
---

> [!info]
> 2025.05.01 在基本学完了整个课程后 回来感觉很多地方都通了 站在全局的角度 发现当时写的笔记和画的图有很多错误的地方 遂重写

Project1 网址  [15445.courses.cs.cmu.edu.fall2023.project1](https://15445.courses.cs.cmu.edu/fall2023/project1/)
代码一定要遵守google C++ 规范 https://google.github.io/styleguide/cppguide.html#General_Naming_Rules
提交方法及代码规范见[[DataBase Systems/CMU 15-445：Database Systems/环境配置 下载代码  提交项目 代码规范\|环境配置 下载代码  提交项目 代码规范]]

### Overview
Project1是实现的整个BufferPool的机制 其实写到最后才会突然顿悟整个机制 说实话一开始我有个疑问是Task 1 的LRUK为啥没用到Page hhh
最后 你会发现 整个BufferPool的思路是这样的:
BufferPool是在内存中malloc出来的一块空间 以Page为度量 分成了一个一个frame 同时 在内存中维护了一个page table(类似于OS中的page table) 类似于一个hash table记录着page所在的frame槽位(即page_id, frame_id对)
![project 1 overview 1 1.png|550](/img/user/accessory/project%201%20overview%201%201.png)
这里的思想是 如果有query想需要一个page的数据 需要查看Page Table来确定这个page是否已经在内存中 如果在 就直接获取到这个page的位置 为这个page的worker(threader)数加1 
如果不在 就需要将这个page从disk从提取出来放入空闲frame中 然后将Page Table中记录连接
![project 1 overview 2.png|550](/img/user/accessory/project%201%20overview%202.png)
![project 1 overview 3.png|550](/img/user/accessory/project%201%20overview%203.png)
如果BufferPool满了 就需要使用页面置换算法将page从BufferPool置换出去 如果这个page是脏页需要写回disk 在课上其实讲了好多置换算法 而Project1实现的是LRUK算法

但其实 真正在实现的时候 由于模块化的思想 整个项目的结构是这样的
![1746103790669.jpg](/img/user/accessory/1746103790669.jpg)

```cpp
class BufferPoolManager {
private:  
 /** Number of pages in the buffer pool. */  
 const size_t pool_size_;  
 /** The next page id to be allocated  */  
 std::atomic<page_id_t> next_page_id_ = 0;  
  
 /** Array of buffer pool pages. */  
 Page *pages_;  
 /** Pointer to the disk sheduler. */  
 std::unique_ptr<DiskScheduler> disk_scheduler_ __attribute__((__unused__));  
 /** Pointer to the log manager. Please ignore this for P1. */  
 LogManager *log_manager_ __attribute__((__unused__));  
 /** Page table for keeping track of buffer pool pages. */  
 std::unordered_map<page_id_t, frame_id_t> page_table_;  
 /** Replacer to find unpinned pages for replacement. */  
 std::unique_ptr<LRUKReplacer> replacer_;  
 /** List of free frames that don't have any pages on them. */  
 std::list<frame_id_t> free_list_;  
 /** This latch protects shared data structures. We recommend updating this comment to describe what it protects. */  
 std::mutex latch_;
}；
```
在实现过程中 bustub的源码把我们逻辑上所表示的所有的frame分成了两类 存有page的在`Page *pages_`中 其中可以通过`frame_id`来通过指针运算来找到位置；另一部分是空槽位 用的list来存储的`frame_id`
由于模块化的思想 bustub将有关置换策略的部分抽象成了LRUKReplacer类 LRUKRepalcer干的其实只是决定替换哪个page的工作---不考虑为何需要替换 不考虑何时替换 所以其实代码中LRUKReplacer并没有涉及到Page类 而是通过LRUKNode 更像一个标签表示一些信息(比如k，比如能否置换等等)
将page与disk真正交互的部分抽象成了DiskScheduler和DiskManager类, 其中真正read和write的其实是DiskManager

### Task 1 - LRU-K Replacement Policy
#### Approach1: k-distance && timestamp
首先需要明确什么是LRU算法   LRU-K算法
然后需要明确源代码给的LRUKReplacer 和 LRUKNode 各个属性代表了什么
```cpp
 class LRUKReplacer
 private:  
  // TODO(student): implement me! You can replace these member variables as you like.  
  // Remove maybe_unused if you start using them.  
  [[maybe_unused]] std::unordered_map<frame_id_t, LRUKNode> node_store_;  
  [[maybe_unused]] size_t current_timestamp_{0};  
  [[maybe_unused]] size_t curr_size_{0};  
  [[maybe_unused]] size_t replacer_size_;  
  [[maybe_unused]] size_t k_;  
  [[maybe_unused]] std::mutex latch_;  
};
```
- `node_store_`
	类型为`std::unordered_map<frame_id_t, LRUKNode>`，用于存储每个帧（`frame_id`）对应的`LRUKNode`节点。每个节点记录该帧的历史访问时间戳（用于计算k-distance）和是否可被替换（evictable）的状态
- `current_timestamp_` 
	类型为`size_t`，表示全局递增的时间戳。每次页面被访问时，时间戳会递增，用于记录访问发生的顺序
- **`curr_size_`**  
	类型为`size_t`，表示当前`LRUKReplacer`中可被替换（evictable）的帧数量。只有被标记为可替换的帧才会被计入此值
- **`replacer_size_`**  
    类型为`size_t`，表示`LRUKReplacer`的最大容量（即缓冲池的总帧数）。该值与缓冲池大小一致
-  **`k_`**  
    类型为`size_t`，表示LRU-K算法中的参数K。它决定了计算k-distance时需要考虑的最近访问次数（例如，K=2表示记录最近两次访问时间）
-  **`latch_`**  
    类型为`std::mutex`，用于多线程环境下的互斥锁，保证对`LRUKReplacer`的操作是线程安全的

```cpp
class LRUKNode {  
 private:  
  /** History of last seen K timestamps of this page. Least recent timestamp stored in front. */  
  // Remove maybe_unused if you start using them. Feel free to change the member variables as you want.  
  [[maybe_unused]] std::list<size_t> history_;  
  [[maybe_unused]] size_t k_;  
  [[maybe_unused]] frame_id_t fid_;  
  [[maybe_unused]] bool is_evictable_{false};  
};
```
以下是 `LRUKNode` 类中各个成员属性的含义及其在 **LRU-K 替换策略**中的作用：
1. **`history_`**
	**类型**: `std::list<size_t>` **作用**:  存储该帧（`frame_id`）**最近 `K` 次访问的时间戳**，按时间顺序排列： **最旧的访问时间戳**在列表的**前端**（`front()`）。**最新的访问时间戳**在列表的**后端**（`back()`）。**LRU-K 关键逻辑**: 当需要计算帧的 `k-distance`（用于淘汰决策）时，若访问次数 `< K`，`k-distance` 设为 `+∞`；否则取 `history_` 前端的倒数第 `K` 个时间戳（即 `history_.front()`）。 每次访问时，新的时间戳会被插入到 `history_` 的末尾，若长度超过 `K`，则删除最旧的时间戳（即 `history_.pop_front()`）。
2. **`k_`**
	**类型**: `size_t`  **作用**:  表示该节点对应的 **LRU-K 算法的参数 `K`**，即需要跟踪的访问次数。 **意义**:- 控制 `history_` 的最大长度（最多保留 `K` 个时间戳）。- 在插入新时间戳时，若 `history_.size() == K`，需删除最旧的时间戳以维持长度。
 3. **`fid_`**
	 **类型**: `frame_id_t`  **作用**:  存储该节点对应的**缓冲池帧的唯一标识符**（即帧的 ID）。**意义**:在替换时，通过 `fid_` 可以快速定位到具体的帧进行淘汰。
 4. **`is_evictable_`** 
	 **类型**: `bool`（默认 `false`） **作用**:  标记该帧**是否可被替换**（evictable）。**关键逻辑**:- 只有 `is_evictable_ == true` 的帧才会参与淘汰决策。- 若一个帧被“固定”（例如正在被事务使用），则设为 `false`，避免被意外替换。

整体示意图
这是我做完了之后整理 画的示意图
![project1 task1 LRUK1(1).png](/img/user/accessory/project1%20task1%20LRUK1(1).png)
这里用的是面向对象的思想  LRUKRepalcer干的其实只是计算k-distance决定替换哪个page的工作---不考虑为何需要替换 不考虑何时替换   这都是buffer pool该干的事情
这里的思想是 在LRUKReplace类中维护了LRUKNode  LRUKNode 存着frameID 事实上frameID是跟某个page是一一对应的 但是不同的时刻的page可能不一样
通过维护时间戳timestamp来计算k-distance
当page被调用  就在对应的LRUKNode中存储此时的时间戳timestamp  然后timestamp加1
这里维护的`history_`只存储k个时间戳  因为我们算法淘汰的是淘汰 k-distance 最大的页面（即倒数第 K 次访问时间最久远的页面），也就是history的front的timestamp与现在timestamp距离最大的那个page   -- 当然如果不足k 次  k-distance为无穷大
同级处理  若多个页面的k-distance相同   淘汰访问最早的页面
Task1 要求
- `Evict(frame_id_t* frame_id)` : Evict the frame with largest backward k-distance compared to all other **evictable** frames being tracked by the `Replacer`. Store the frame id in the output parameter and return `True`. If there are no evictable frames return `False`.
- `RecordAccess(frame_id_t frame_id)` : Record that given frame id is accessed at current timestamp. This method should be called after a page is pinned in the `BufferPoolManager`.
- `Remove(frame_id_t frame_id)` : Clear all access history associated with a frame. This method should be called only when a page is deleted in the `BufferPoolManager`.
- `SetEvictable(frame_id_t frame_id, bool set_evictable)` : This method controls whether a frame is evictable or not. It also controls `LRUKReplacer`'s size. You'll know when to call this function when you implement the `BufferPoolManager`. To be specific, when pin count of a page reaches 0, its corresponding frame is marked evictable and replacer's size is incremented.
- `Size()` : This method returns the number of evictable frames that are currently in the `LRUKReplacer`.

**Evict函数**
![Pasted image 20250223172320.png](/img/user/accessory/Pasted%20image%2020250223172320.png)

分解任务：
**frame with less than k historical references is given +inf as  its backward k-distance.**
获取最大的k-distance   如果访问记录 也就是node 的`history_`(`history_`记录所有时间戳--每加入一个page 时间戳+1)  如果`history_`的长度不足k 就需要设为+inf
```cpp
auto LRUKReplacer::GetDistance(LRUKNode &node) -> size_t {  
  size_t distance;  
  if (node.GetHistory().size() < k_) {  
    distance = std::numeric_limits<size_t>::max();  
  } else {  
    distance = current_timestamp_ - node.GetHistory().front();  
  }  
  return distance;  
}
```

**If multiple frames have inf backward k-distance, then evict frame with earliest timestamp based on LRU**
如果k-distance相同  就找最早一次访问
```cpp
if (k_distance > max_k_distance) {  
  evict_id = node.first;  
  max_k_distance = k_distance;  
  earliest_timestamp = lruk_node.GetEarliestTimestamp();  
} else if (k_distance == max_k_distance) {  
  if (lruk_node.GetEarliestTimestamp() < earliest_timestamp) {  
    evict_id = node.first;  
    earliest_timestamp = lruk_node.GetEarliestTimestamp();  
  }  
}
```

```cpp
auto LRUKNode::GetEarliestTimestamp() -> size_t { return history_.front(); }
```

**Successful eviction of a frame should decrement the size of replacer and remove the frame's access history.**
成功驱逐后 应该干什么: 调整Replacer的size    清楚页面的所有记录
其实对应的就是LRUKReplacer的`curr_size_--` ，`node_store_`删除对应的frame id的记录
```cpp
node_store_.erase(evict_id);  
curr_size_--;
```

**Store the frame id in the output parameter and return `True`. If there are no evictable frames return `False`.**
保存frame id   返回bool值

Evit函数流程图
![projec1 task1 evict1 png.png|450](/img/user/accessory/projec1%20task1%20evict1%20png.png)
整体代码
```cpp
auto LRUKReplacer::Evict(frame_id_t *frame_id) -> bool {  
  // 上锁  
  std::lock_guard<std::mutex> lock_guard(latch_);  
  
  size_t max_k_distance = 0;  
  frame_id_t evict_id = -1;  
  size_t earliest_timestamp = std::numeric_limits<size_t>::max();  
  
  for (auto &node : node_store_) {  
    LRUKNode lruk_node = node.second;  
    if (!lruk_node.IsEvictable()) {  
      continue;  
    }  
  
    size_t k_distance = GetDistance(lruk_node);  
    if (k_distance > max_k_distance) {  
      evict_id = node.first;  
      max_k_distance = k_distance;  
      earliest_timestamp = lruk_node.GetEarliestTimestamp();  
    } else if (k_distance == max_k_distance) {  
      if (lruk_node.GetEarliestTimestamp() < earliest_timestamp) {  
        evict_id = node.first;  
        earliest_timestamp = lruk_node.GetEarliestTimestamp();  
      }  
    }  
  }  
  if (evict_id == -1) {  
    return false;  
  }  
  
  *frame_id = evict_id;  
  node_store_.erase(evict_id);  
  curr_size_--;  
  return true;  
}
```

**RecordAccess函数**
![Pasted image 20250223200043.png](/img/user/accessory/Pasted%20image%2020250223200043.png)
分解任务：
**create a new entry for access history if frame id has not been seen before.**
如果frameID 不在 我们创建一个新的entry  为的是能够access history
这就涉及到access的本质是什么？
是在对page或者说node 插入当前的时间戳
```cpp
if (node_store_.find(frame_id) == node_store_.end()) {  
  node_store_.insert(std::make_pair(frame_id, LRUKNode(k_, frame_id)));  
}  
  
LRUKNode &node = node_store_[frame_id];  
  
node.AddAccessTimestamp(current_timestamp_);
```
**If frame id is invaild (ie. larger than `replacer_size_`), throw an exception**
验证合法性
```cpp
void LRUKReplacer::VaildFrameID(frame_id_t frame_id) {  
  if (frame_id < 0 || static_cast<size_t>(frame_id) > replacer_size_) {  
    throw std::invalid_argument("Invalid frame id");  
  }  
}
```
**除此之外 应该考虑清楚access的本质是什么？**
我们本质上是对每个page维护了一个`history_`的list  我们是维护的时间戳来表示k
**所以我的`history_`最好维护在size<=k 所以涉及到 如果超出k怎么办？**
```cpp
if (node.GetHistory().size() > k_) {  
  node.GetHistory().pop_front();  
}
```
**在插入之后 要做 时间戳的更新**
```cpp
current_timestamp_++;
```

函数流程图
![Project1 Task1  RecordAccess png.png|400](/img/user/accessory/Project1%20Task1%20%20RecordAccess%20png.png)

整体代码
```cpp
void LRUKReplacer::RecordAccess(frame_id_t frame_id, [[maybe_unused]] AccessType access_type) {  
  std::lock_guard<std::mutex> lock_guard(latch_);  
  // 检查合法性  
  VaildFrameID(frame_id);  
  
  if (node_store_.find(frame_id) == node_store_.end()) {  
    node_store_.insert(std::make_pair(frame_id, LRUKNode(k_, frame_id)));  
  }  
  
  LRUKNode &node = node_store_[frame_id];  
  
  node.AddAccessTimestamp(current_timestamp_);  
  
  if (node.GetHistory().size() > k_) {  
    node.GetHistory().pop_front();  
  }  
  
  current_timestamp_++;  
}
```
**SetEvictable 函数**
![Pasted image 20250223193619.png](/img/user/accessory/Pasted%20image%2020250223193619.png)

分解任务：
**If a frame was previously evictable and is to be set to non-evictable, then size shoud decrement. If a frame was previously non-evictable and is to be set to evictable, then size should increment.**
如果帧以前可移除  设置为不移除的时候 大小应递减
如果帧以前不可移除  设置为移除的时候  大小硬递增
**如果相等呢？**  不用管
这里指的是`curr_size_`  目前可被替换的数量
```cpp
if (prev_evictable == set_evictable) {  
  return;  
}  
if (prev_evictable && !set_evictable) {  
  curr_size_--;  
} else if (!prev_evictable && set_evictable) {  
  curr_size_++;  
}
```

**If frame id is invaild, throw an exception or about the process.**
判断frameID的合法性 与最大容量比
整体代码
```cpp
void LRUKReplacer::SetEvictable(frame_id_t frame_id, bool set_evictable) {  
  std::lock_guard<std::mutex> lock_guard(latch_);  
  VaildFrameID(frame_id);  
  auto it = node_store_.find(frame_id);  
  if (it == node_store_.end()) {  
    return;  
  }  
  
  bool prev_evictable = it->second.IsEvictable();  
  if (prev_evictable == set_evictable) {  
    return;  
  }  
  if (prev_evictable && !set_evictable) {  
    curr_size_--;  
  } else if (!prev_evictable && set_evictable) {  
    curr_size_++;  
  }  
  
  it->second.SetEvictable(set_evictable);  
}
```

**remove函数**
![Pasted image 20250223213808.png](/img/user/accessory/Pasted%20image%2020250223213808.png)
Note that this is different from evicting a frame,   which always remove the frame with largest backward k-distance. This function removes specified frame id,  no matter what its backward k-distance is. 
**If Remove is called on a non-evictable frame, throw an exception or abort the process.** 
如果non-evictable 抛异常
```cpp
if (!it->second.IsEvictable()) {  
  throw std::logic_error("Cannot remove non-evictable frame");  
}
```
**If specified frame is not found, directly return from this function.**
```cpp
if (it == node_store_.end()) {  
  return;  
}
```
要想明白 删除的时候 都要干什么
```cpp
node_store_.erase(frame_id);  
curr_size_--;
```

整体代码
```cpp
void LRUKReplacer::Remove(frame_id_t frame_id) {  
  std::lock_guard<std::mutex> lock_guard(latch_);  
  auto it = node_store_.find(frame_id);  
  if (it == node_store_.end()) {  
    return;  
  }  
  if (!it->second.IsEvictable()) {  
    throw std::logic_error("Cannot remove non-evictable frame");  
  }  
  node_store_.erase(frame_id);  
  curr_size_--;  
}
```

**Size 函数**
![Pasted image 20250223214459.png](/img/user/accessory/Pasted%20image%2020250223214459.png)
Size就很简单了  返回大小就行
提交至gradescope 
![bae821a59ca5ab064f046c8fa2675c4.png|200](/img/user/accessory/bae821a59ca5ab064f046c8fa2675c4.png)
代码文件
![[lru_k_replacer approach1 c.h]]
![[lru_k_replacer approach1 cpp.cpp]]

#### Approach2: history_list && lru_list
![Pasted image 20250223214610.png](/img/user/accessory/Pasted%20image%2020250223214610.png)
对于replacer给的成员变量中 说  可以自己替换member
我突然想起来可以用上课讲的MySQL那种形式  一种近似的LRUK算法  但是好像不用考虑K和timestamp  而是维护了两个链表或者说队列
![Pasted image 20250223214739.png|600](/img/user/accessory/Pasted%20image%2020250223214739.png)
但是这种方法肯定会跟LRUK的算法不一样  MySQL采用的类LRUK方法只要是重新调用就进入 Young list

但是也可以用这个思路  就是我们不用去维护timestamp  而是 去维护 一个lru list 和 history list就可以了   记录调用次数  当调用次数超过k的时候就移入lru list:

**LRU-K 替换策略，一句话总结就是永远优先踢掉没有达到 K 次访问的元素，否则对于已经达到 K 次访问的元素按照 LRU 踢出**
[p297-o_neil.pdf](https://www.cs.cmu.edu/~natassa/courses/15-721/papers/p297-o_neil.pdf) 原论文给出了一个 Backward K-distance 的概念如下
![Pasted image 20250227082645.png|300](/img/user/accessory/Pasted%20image%2020250227082645.png)
可见对于没有访问至少 K 次的元素，其距离为正无穷，所以会被优先踢出。当存在多个这样的元素时，原论文指出可采用某种二级策略。**本实验材料提示此时我们应踢出访问记录最早的元素，也就是采用 FIFO 而非 LRU**
在超过K次访问的元素中采用的是LRU提出

| ​**场景**​      | ​**history list & lru list策略**​ | ​**k-distance 策略**​    | ​**是否一致**​ |
| ------------- | ------------------------------- | ---------------------- | ---------- |
| 存在未达 K 次页面    | 按 FIFO 淘汰最早进入的未达 K 次页面          | 按 FIFO 淘汰最早进入的未达 K 次页面 | 是          |
| 所有页面均达 K 次    | 按 LRU 淘汰最久未访问页面                 | 按 k-distance（等价 LRU）淘汰 | 是          |
| 混合场景（未达 + 已达） | 优先淘汰未达 K 次页面                    | 优先淘汰未达 K 次页面           | 是          |

所以根本没有去计算k-distance  没有去维护 timestamp

整体示意图 我画图的时候写的是page 其实真代码中是一个一个LRUKNode 只不过能对应成page
![Project1 Task 1 LRUK2.png|600](/img/user/accessory/Project1%20Task%201%20LRUK2.png)

如果要插入或者 移除的话 就是这样  优先按FIFO排除page8
![Project1 Task1 LRUK2 2.png|600](/img/user/accessory/Project1%20Task1%20LRUK2%202.png)

greater k中的page如果再次访问
![Project1 Task1 LRUK2 3(1).png|600](/img/user/accessory/Project1%20Task1%20LRUK2%203(1).png)


ListNode的成员变量改为了：
```cpp
class LRUKNode {  
 public:  
  /** History of last seen K timestamps of this page. Least recent timestamp stored in front. */  
  // Remove maybe_unused if you start using them. Feel free to change the member variables as you want.  
  [[maybe_unused]] size_t hit_count_{0};  
  [[maybe_unused]] std::list<frame_id_t>::iterator pos_;  
  [[maybe_unused]] bool is_evictable_{false};  
};
```
- `hit_count_` 记录访问次数  与k比较
- `pos_` 位置记录了一个`iterator` --  C++文档中  `std::list` 的 `iterator` 不会因为其他元素的移动插入删除操作而失效 还能表示正确的位置
- `is_evictable_`: 与之前一样

```cpp
class LRUKReplacer {
private:  
 // TODO(student): implement me! You can replace these member variables as you like.  
 // Remove maybe_unused if you start using them.  
 [[maybe_unused]] std::list<frame_id_t> history_list_;  
 [[maybe_unused]] std::list<frame_id_t> lru_list_;  
 [[maybe_unused]] std::unordered_map<frame_id_t, LRUKNode> entries_;  
 [[maybe_unused]] size_t curr_size_{0};  
 [[maybe_unused]] size_t replacer_size_;  
 [[maybe_unused]] size_t k_;  
 [[maybe_unused]] std::mutex latch_;
 }
```
- `history_list_` 存储访问次数未超过k的节点
- `lru_list_` 存储访问次数超过k的节点
- `entries_`   跟以前一样  一个键值对 -- frame_id 与 LRUKNode对应
- `curr_size_ `  `replacer_size_`   `k_  latch_` 跟以前都一样

**RecordAccess 函数**
```cpp
void LRUKReplacer::RecordAccess(frame_id_t frame_id, [[maybe_unused]] AccessType access_type) {  
  // 上锁  
  std::scoped_lock<std::mutex> lock(latch_);  
  // 合法性 特殊情况判断  
  if (frame_id > static_cast<int>(replacer_size_)) {  
    throw std::invalid_argument("Invalid frame_id");  
  }  
  
  size_t new_count = ++entries_[frame_id].hit_count_;  
  if (new_count == 1) {  
    // 新插入  
    history_list_.emplace_front(frame_id);  
    entries_[frame_id].pos_ = history_list_.begin();  
  } else {  
    /*if (new_count > 1 && new_count < k_) {  
      // 在history list中转移  
      history_list_.erase(entries_[frame_id].pos_);      history_list_.emplace_front(frame_id);      entries_[frame_id].pos_ = history_list_.begin();    } else*/    if (new_count == k_) {  
      // 转移  
      history_list_.erase(entries_[frame_id].pos_);  
      lru_list_.emplace_front(frame_id);  
      entries_[frame_id].pos_ = lru_list_.begin();  
    } else if (new_count > k_) {  
      // 在lru list中转移  
      lru_list_.erase(entries_[frame_id].pos_);  
      lru_list_.emplace_front(frame_id);  
      entries_[frame_id].pos_ = lru_list_.begin();  
    }  
  }  
}
```
值得注意的是 在`history_list_`中采用的是FIFO 所以当$1<k<n$时 不需要移动
其实在上面的方法中也是这样  当$1<k<n$的时候  k-distance始终是+inf   比较时间的时候看的是`history_.front()`  所以还是看的最早插入时间  --  所以我们维护链表的时候不需要移动
代码示意图
![Project1 Task1 LRUK2 4.png|400](/img/user/accessory/Project1%20Task1%20LRUK2%204.png)

**Evit函数**
```cpp
auto LRUKReplacer::Evict(frame_id_t *frame_id) -> bool {  
  // 上锁  
  std::scoped_lock<std::mutex> lock(latch_);  
  
  bool page_find = false;  
  
  if (!history_list_.empty()) {  
    // FIFO history list  
    // 淘汰 末尾 第一个 evictable 为 false的  
    for (auto it = history_list_.rbegin(); it != history_list_.rend(); ++it) {  
      if (entries_[*it].is_evictable_) {  
        *frame_id = *it;  
        history_list_.erase(std::next(it).base());  
        page_find = true;  
        break;  
      }  
    }  
  }  
  
  if (!page_find && !lru_list_.empty()) {  
    for (auto it = lru_list_.rbegin(); it != lru_list_.rend(); ++it) {  
      if (entries_[*it].is_evictable_) {  
        *frame_id = *it;  
        lru_list_.erase(std::next(it).base());  
        page_find = true;  
        break;  
      }  
    }  
  }  
  
  if (page_find) {  
    entries_.erase(*frame_id);  
    --curr_size_;  
    return true;  
  }  
  return false;  
}
```

**Remove 函数**
```cpp
void LRUKReplacer::Remove(frame_id_t frame_id) {  
  // 上锁  
  std::scoped_lock<std::mutex> lock(latch_);  
  // 合法性 特殊情况判断  
  if (frame_id > static_cast<int>(replacer_size_)) {  
    throw std::invalid_argument("Invalid frame_id");  
  }  
  if (entries_.find(frame_id) == entries_.end()) {  
    return;  
  }  
  
  if (!entries_[frame_id].is_evictable_) {  
    throw std::logic_error("can't remove this frame");  
  }  
  if (entries_[frame_id].hit_count_ < k_) {  
    history_list_.erase(entries_[frame_id].pos_);  
  } else {  
    lru_list_.erase(entries_[frame_id].pos_);  
  }  
  --curr_size_;  
  entries_.erase(frame_id);  
}
```

**SetEvictable 函数**
```cpp
void LRUKReplacer::SetEvictable(frame_id_t frame_id, bool set_evictable) {  
  // 上锁  
  std::scoped_lock<std::mutex> lock(latch_);  
  // 合法性 特殊情况判断  
  if (frame_id > static_cast<int>(replacer_size_)) {  
    throw std::invalid_argument("Invalid frame_id");  
  }  
  if (entries_.find(frame_id) == entries_.end()) {  
    return;  
  }  
  bool current_evictable = entries_[frame_id].is_evictable_;  
  if (!current_evictable && set_evictable) {  
    curr_size_++;  
  } else if (current_evictable && !set_evictable) {  
    curr_size_--;  
  }  
  entries_[frame_id].is_evictable_ = set_evictable;  
}
```

提交gradescope
![Pasted image 20250227151824.png|200](/img/user/accessory/Pasted%20image%2020250227151824.png)

文件代码
![[lru_k_replacer approach2 cpp.cpp]]
![[lru_k_replacer approach2 c.h]]


### Task 2 - Disk Scheduler
在Task2 首先要弄清楚的就是Disk Scheduler, DiskRequest, Channel, Disk manager 之间的关系
首先DiskRequest是一个载体  是存储的一些关于请求的信息   在源代码中是 一个 结构体
```cpp
/**  
 * @brief Represents a Write or Read request for the DiskManager to execute. */struct DiskRequest {  
  /** Flag indicating whether the request is a write or a read. */  
  bool is_write_;  
  
  /**  
   *  Pointer to the start of the memory location where a page is either:   *   1. being read into from disk (on a read).   *   2. being written out to disk (on a write).   */  char *data_;  
  
  /** ID of the page being read from / written to disk. */  
  page_id_t page_id_;  
  
  /** Callback used to signal to the request issuer when the request has been completed. */  
  std::promise<bool> callback_;  
};
```

`is_write_` 用来区分写还是读
`data_`  是个char类型的指针 -- 指向内存中的一个位置  写入这个位置 或者读取这个位置
`page_id_` 页面id  标识正在从磁盘读取或写入磁盘的页面
`callback_`  这是一个`std::promise<bool>`类型的回调函数，用于在请求完成后向请求发起者发出信号。使用`std::promise`和其关联的`std::future`机制
后面会详细谈到`std::promise`和其关联的`std::future`机制

Channel 其实就是一个封装好了的队列   请求FIFO 
Disk Schedule是管理这个队列的    而 真正进行write 和 read操作的是由Disk Manager完成的
Disk Scheduler, Disk manager, Channel关系图
![Project1 Task2 1.png|150](/img/user/accessory/Project1%20Task2%201.png)

```cpp
class DiskScheduler {  
 public:
 private:  
  /** Pointer to the disk manager. */  
  DiskManager *disk_manager_ __attribute__((__unused__));  
  /** A shared queue to concurrently schedule and process requests. When the DiskScheduler's destructor is called,  
   * `std::nullopt` is put into the queue to signal to the background thread to stop execution. */  Channel<std::optional<DiskRequest>> request_queue_;  
  /** The background thread responsible for issuing scheduled requests to the disk manager. */  
  std::optional<std::thread> background_thread_;  
};
```

- **disk_manager_**: 这是一个指向`DiskManager`对象的指针，用于与磁盘管理器进行交互。注意，这里使用了`__attribute__((__unused__))`属性标记，这通常意味着在某些编译环境下这个变量可能不会被用到，但在当前上下文中它是为了保持灵活性和扩展性而定义的。
- **request_queue_**: 这是一个共享队列，类型为`Channel<std::optional<DiskRequest>>`。此队列用于并发地调度和处理请求。`Channel`在这里作为一种线程安全的方式，允许不同线程之间安全地传递数据。当`DiskScheduler`的析构函数被调用时，会向队列中放入一个`std::nullopt`值，以此通知后台线程停止执行。`std::optional<DiskRequest>`的使用允许队列中的元素可以是有效的`DiskRequest`或者为空（如信号停止）。
- **background_thread_**: 这是一个可选的标准库线程对象（`std::optional<std::thread>`），代表负责将计划好的请求发送给磁盘管理器的后台线程。使用`std::optional`允许该成员在某些情况下不存在（例如，在`DiskScheduler`实例化但未启动后台线程时）。这种设计提供了更大的灵活性，使得`DiskScheduler`可以根据需要启动或不启动后台线程。

除此之外 还得多少看一下Channel和disk manager的函数

在代码中  用到了一个`std::promise`和`std::future`机制
![Project1 Task2 2.png|500](/img/user/accessory/Project1%20Task2%202.png)

 **为什么需要它们？**
假设没有 `future` 和 `promise`，在多线程场景中：
- ​**问题1**：线程 A 如何获取线程 B 的计算结果？  
    （比如用户线程如何知道磁盘 I/O 何时完成？）
- ​**问题2**：线程 B 抛出异常时，线程 A 如何捕获？  
    （比如磁盘写入失败时如何通知调用方？）
- ​**问题3**：如何避免轮询检查结果造成的 CPU 浪费？  
    （需要一种高效的等待机制）
`future` 和 `promise` 通过以下方式解决这些问题：
- ​**自动同步**：`future.get()` 会阻塞线程，直到结果可用。
- ​**异常传播**：如果 `promise` 设置异常，`future` 会抛出该异常。
- ​**无需轮询**：通过条件变量实现高效等待。
以一个DiskScheduler的例子
用户线程提交请求
```cpp
// 用户线程（例如 BufferPoolManager）
std::promise<bool> prom;          // 创建 promise
auto future = prom.get_future();   // 获取关联的 future

// 构造磁盘请求（写页）
DiskRequest req{
    .is_write_ = true,
    .page_id_ = 42,
    .data_ = buffer,
    .callback_ = std::move(prom)   // 将 promise 移入请求
};

// 提交请求到调度器
disk_scheduler.Schedule(std::move(req));

// 阻塞等待操作完成（通过 future）
future.wait(); 
if (future.get()) { 
    std::cout << "写入成功！"; 
}
```

后台处理
```cpp
// DiskScheduler 的后台线程
void DiskScheduler::StartWorkerThread() {
    while (true) {
        auto req = request_queue_.Pop(); // 从队列取出请求
        
        try {
            // 执行磁盘操作（例如写页）
            disk_manager_->WritePage(req->page_id_, req->data_);
            
            // 设置操作结果为成功
            req->callback_.set_value(true); 
        } catch (...) {
            // 捕获异常并传递到 future
            req->callback_.set_exception(std::current_exception());
        }
    }
}
```
而我们写的其实就是后台处理 的一部分

测试代码中
```cpp
auto promise1 = disk_scheduler->CreatePromise();  // 写操作的 Promise
auto future1 = promise1.get_future();              // 关联的 Future

auto promise2 = disk_scheduler->CreatePromise();  // 读操作的 Promise
auto future2 = promise2.get_future();            // 关联的 Future
```
promise其实好像是跟着构造函数创建出来的
有了promise就能通过`get_future()`创建这个promise关联的future
```cpp
ASSERT_TRUE(future1.get());
```
future.get() 就是在阻塞等在结果

代码很简单
**Schedule函数**
![Pasted image 20250302093201.png|500](/img/user/accessory/Pasted%20image%2020250302093201.png)
要求 调度一个请求供DiskManager执行 --  什么算是调度请求呢？
放入queue中就可以
```cpp
void DiskScheduler::Schedule(DiskRequest r) { request_queue_.Put(std::make_optional(std::move(r))); }
```
因为Get Put都用了`std::move`  所以我也用了`std::move`
![Pasted image 20250302093529.png](/img/user/accessory/Pasted%20image%2020250302093529.png)
`std::move` 是 C++11 引入的一个标准库工具，它用于将对象的状态（资源）“转移”给另一个对象，而不需要进行深层的复制。这通过将对象转换为右值引用实现，从而允许资源以较低的开销从一个对象转移到另一个对象。需要注意的是，`std::move` 并不会移动任何东西，它只是一个强制转换操作，它告诉编译器可以将该对象当作一个右值来处理，进而可能应用移动语义或启用资源转移
移动语义是 C++11 的一项特性，旨在减少不必要的拷贝操作，特别是对于那些拥有动态分配内存或其他稀缺资源的对象。通过移动构造函数和移动赋值运算符，程序可以在某些情况下避免深拷贝，直接转移资源的所有权，从而提高性能。

**StartWorkerThread函数**
![Pasted image 20250302093731.png|700](/img/user/accessory/Pasted%20image%2020250302093731.png)
线程在哪？  在队列中放着  -- 不停从队列中取出请求
执行请求是Disk Manager的事儿 -- 调用相关函数和方法就行了
什么时候结束？  --  当调用析构函数的时候
![Pasted image 20250302093959.png|500](/img/user/accessory/Pasted%20image%2020250302093959.png)
所以我们的判断条件就是遇到`nullopt`
```cpp
void DiskScheduler::StartWorkerThread() {  
  while (true) {  
    auto request_opt = request_queue_.Get();  
    if (!request_opt.has_value()) {  
      break;  
    }  
    DiskRequest req = std::move(request_opt.value());  
  
    if (req.is_write_) {  
      disk_manager_->WritePage(req.page_id_, req.data_);  
    } else {  
      disk_manager_->ReadPage(req.page_id_, req.data_);  
    }  
    req.callback_.set_value(true);  
  }  
}
```

提交gradescope  通过了有关DiskSchduler的内容
![Pasted image 20250302094201.png|200](/img/user/accessory/Pasted%20image%2020250302094201.png)

### Task 3 -  Buffer Pool Manager
**NewPage**
![Pasted image 20250501205848.png|600](/img/user/accessory/Pasted%20image%2020250501205848.png)
NewPage的作用是在缓冲池中创建一个新的页面，如果成功创建了页面，将新的页面 ID 赋值给传入的 `page_id` 指针。如果没有可用的帧（frame）可以用来存放新页面（即所有帧都已经被使用并且不能被替换，比如它们正在被其他操作使用，称为 "pinned"），则返回 `nullptr`。
具体步骤：
You should pick the replacement frame from either the free list or the replacer (always find from the free list first), and then call the AllocatePage() method to get a new page id. If the replacement frame has a dirty page, you should write it back to the disk first. You also need to reset the memory and metadata for the new page.
Remember to "Pin" the frame by calling replacer.SetEvictable(frame_id, false). so that the replacer wouldn't evict the frame before the buffer pool manager "Unpin"s it.
Also, remember to record the access history of the frame in the replacer for the lru-k algorithm to work.

Step1: You should pick the replacement frame from either the free list or the replacer (always find from the free list first)
如果`free_list_`中还有位置(不为空) 就弹出一个`frame_id`作为page即将进入bufferPool的槽位 并且可以通过`pages_+frame_id`通过指针运算找到该放入的地址； 如果`free_list_`中没有位置了 意味着BufferPool满了 就需要通过`raplacer`返回一个要替换的掉的槽位的位置
```cpp
if (!free_list_.empty()) {  
  frame_id = free_list_.back();  
  free_list_.pop_back();  
  page = pages_ + frame_id;  
} else {  
  if (!replacer_->Evict(&frame_id)) {  
    return nullptr;  
  }  
  page = pages_ + frame_id;  
}
```

Step2:  If the replacement frame has a dirty page, you should write it back to the disk first
如果替换出来的page是dirty page 就需要写磁盘
这里要通过Disk Scheduler 写回 需要构建好一个DiskRequest 然后通过`disk_scheduler_->Shedule`写回
```cpp
if (page->IsDirty()) {  
  auto promise = disk_scheduler_->CreatePromise();  
  auto future = promise.get_future();  
  disk_scheduler_->Schedule({true, page->GetData(), page->GetPageId(), std::move(promise)});  
  future.get();  
  page->is_dirty_ = false;  
}
```
然后记得修改page_table中的内容  新的page的pageID主要是通过AllocatePage()函数调用的 并更新page和replacer
```cpp
*page_id = AllocatePage();  
page_table_.erase(page->GetPageId());  
page_table_.emplace(*page_id, frame_id);  
page->page_id_ = *page_id;  
page->pin_count_ = 1;  
page->ResetMemory();  
replacer_->RecordAccess(frame_id);  
replacer_->SetEvictable(frame_id, false);
```

可以把这些功能抽象出private函数

**FetchPage**
![Pasted image 20250502134650.png|600](/img/user/accessory/Pasted%20image%2020250502134650.png)
从缓冲池中获取请求的页面。如果需要从磁盘加载页面但没有可用帧来放置新页面（所有帧都被占用且不能被替换），则返回 `nullptr`
其实跟NewPage很像  就是多了一个先从BufferPool中找到操作（实质上是从page table找）
如果在BufferPool中 那很简单 就是更新一下说明又有一个worker在用就好了
如果不在BufferPool中 那就和NewPage很像了 唯一不同的是不需要用AllocatePage()函数分配一个pageID

**UnpinPage**
![Pasted image 20250502145458.png|600](/img/user/accessory/Pasted%20image%2020250502145458.png)
从缓冲池中取消固定目标页面。如果给定的 `page_id` 不在缓冲池中或其固定计数（pin count）已经是 0，则返回 `false`
```cpp
auto BufferPoolManager::UnpinPage(page_id_t page_id, bool is_dirty, [[maybe_unused]] AccessType access_type) -> bool {  
  if (page_id == INVALID_PAGE_ID) {  
    return false;  
  }  
  // ! if exist  
  std::scoped_lock lock(latch_);  
  if (page_table_.find(page_id) != page_table_.end()) {  
    // ! get page  
    auto frame_id = page_table_[page_id];  
    auto page = pages_ + frame_id;  
    // ! set dirty  
    if (is_dirty) {  
      page->is_dirty_ = is_dirty;  
    }  
    // ! if pin count is 0  
    if (page->GetPinCount() == 0) {  
      return false;  
    }  
    // ! decrement pin count  
    page->pin_count_ -= 1;  
    if (page->GetPinCount() == 0) {  
      replacer_->SetEvictable(frame_id, true);  
    }  
    return true;  
  }  
  return false;  
}
```

**FlashPage**
![Pasted image 20250502145751.png|600](/img/user/accessory/Pasted%20image%2020250502145751.png)
用是将指定 ID 的页面从缓冲池刷新（flush）到磁盘中
```cpp
auto BufferPoolManager::FlushPage(page_id_t page_id) -> bool {  
  if (page_id == INVALID_PAGE_ID) {  
    return false;  
  }  
  std::scoped_lock lock(latch_);  
  if (page_table_.find(page_id) == page_table_.end()) {  
    return false;  
  }  
  // ! get page  
  auto page = pages_ + page_table_[page_id];  
  // ! write back  
  auto promise = disk_scheduler_->CreatePromise();  
  auto future = promise.get_future();  
  disk_scheduler_->Schedule({true, page->GetData(), page->GetPageId(), std::move(promise)});  
  future.get();  
  // ! clean  
  page->is_dirty_ = false;  
  return true;  
}
```


![Pasted image 20250502151018.png|400](/img/user/accessory/Pasted%20image%2020250502151018.png)
