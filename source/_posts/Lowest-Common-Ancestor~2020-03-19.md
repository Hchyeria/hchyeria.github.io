---
title: Lowest Common Ancestor
hascode: true
hasmath: false
author: Hchyeria
description: 树的最近公共祖先
tags:
  - Algorithm
  - Tree
date: September 6, 2019
abbrlink: 47224
---
这几天忙着做专业课程设计2。学习了很多有意思的算法和数据结构。在此记录一下。
这篇是关于 Lowest Common Ancestor。

## Question
题目要求
某个太空神秘国度中有很多美丽的小村，从太空中可以望见，小村间有路相连，更精确一点说，任意两村之间有且仅有一条路径。
小村A中有位年轻人爱上了自己村里的美丽姑娘。每天早晨，姑娘都要去小村B里的面包房工作，傍晚6点回到家。年轻人终于决定要向姑娘表白，他打算在小村C等着姑娘路过的时候把爱慕说出来。问题是，他不能确定小村C是否在小村B到小村A之间的路径上。你可以帮他解决这个问题吗？
输入要求：输入由若干组测试数据组成。
每组数据的第1行包含一正整数 N(1<=N<=50000），代表神秘国度中小村的个数，每个小村即从0到 N-1 编号。接下来有N-1行输人，每行包含一条双向道路的两个端点小村的编号，中间用空格分开。
之后一行包含一正整数 M(1<=M<=500000），代表着该组测试问题的个数。接下来M行，每行给出 A、B、C 三个小村的编号，中间用空格分开。
当N为0时，表示全部测试结束，不要对该数据做任何处理。
输出要求：对每一组测试给定的 A、B、C，在一行里输出答案
即：如果C在A和B之间的路径上，输出 Yes，否则输出 No
输入例子：
3
0 1
1 2
3
0 2 1
1 2 0
1 2 1
0
输出例子：
注意：该题目应设计大规模的测试数据，所以用C语言中的 scanf 和 printf 做输入输出会比用 cin 和 cout 快，可以避免因为输入输出而超时
这道题其实可以转化为求最近公共祖先。

## Solution
### Primary
我们一般就最近公共祖先的方法，如下:
[LeetCode 236 Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) {
            return root;
        }
        return left == null ? right : left;
    }
}
```
但是这道题用了比较特殊的方法求。

### Special
两个问题：
1. 如何快速判断一个点是否是另外一个点的祖先？
2. 如果 C 是 A、B 两点的共同祖先，如何快速判断它是否是最低的?

对于第一个问题，可以用深度优先搜索遍历一遍，记录每个节点的入栈时间及出栈时间，然后判断其包含关系。
例如：下图是一棵深度优先搜索树，每个节点左下角的数字表示第一次访问该节点即入栈时间，右下角数字表示离开该节点即出栈时间。要判断点A是否是点C的祖先，只要判断区间 [1，20] 是否包含了区间 [4，15]，因此每次判断的复杂度是 O（1）的。
<div align=center><img class="post-img-middle" src="/posts/47224/1.png" />
<div align=center class="img-undertext">DFS 入栈及出栈时间<div class="img-undertext-divi">

对于第二个问题，例如要判断 A 是否是 G 和 J 的最低公共祖先，其实就是看是否有比A更低的祖先，如果有则说明A不是最低的。由于 A 下面还有 C 这个节点，因此可以得出 A 不是 G 和 J 的最低公共祖先，而C则找不到这样的一个儿子节点，因此它是最低的。
很自然想到的方法是遍历 A 的所有儿子节点，逐个判断它是否是 G 和 J 的公共祖先。但是这样有可能退化成 O(N) 的复杂度。
仔细观察这棵深度优先搜索树，又可以发现一个非常有趣的规律：
如果从左到右列出A的四个儿子节点 B、C、D、E的入栈时间及出栈时间：[2，3]、[4,15]、[16,17]、[18,19]，不难发现这个区间数列是递增的。于是得到了一个更快的方法：只要在这个递增的区间数列中 Binary Search 是否有 [6,12] 这个区间即可（6是G的人栈时间，12是J的出栈时间），因此复杂度就降到了 O(log2N)。

```python
import queue
from collections import deque

import math

# 定义节点类
# 节点有 入栈 in_stack 和出栈 out_stack 的时间信息
# next 数组 记录邻接节点
# val 记录村落编号
class Node:
    def __init__(self, val):
        self.in_stack = 0
        self.out_stack = 0
        self.next = []
        self.val = val

    def __repr__(self):
        return repr((self.val, self.in_stack, self.out_stack))


# 定义一个图类
# 村落之间任意两个都有一条路可以连通
# 实际上就是一颗树 特殊的图
class Graph:
    def __init__(self, n):
        self.root = Node
        # 储存所有节点信息
        self.node = [None for i in range(n)]

        # 储存深度信息
        # 便于能够过滤一些邻接节点
        self.deep = [0] * n

    # 添加节点的函数
    def add(self, u: int, v: int):
        # 如果不存在 则创建一个
        if not self.node[u]:
            self.node[u] = Node(u)
        if not self.node[v]:
            self.node[v] = Node(v)
        # 添加相应节点的邻接节点
        if self.node[v] not in self.node[u].next:
            self.node[u].next.append(self.node[v])
        if self.node[u] not in self.node[v].next:
            self.node[v].next.append(self.node[u])

    # 广度优先设置深度信息
    def bfs(self):
        # 利用队列的先进先出的特点 方便实现广度优先遍历
        q = queue.Queue()
        # 起点深度为 1
        self.deep[self.node[0].val] = 1
        q.put(0)
        while not q.empty():
            ptr = q.get()
            front = self.node[ptr]
            first = self.node[ptr].next
            # 将还没有深度值的子节点的深度值更新
            for item in first:
                if not self.deep[item.val]:
                    self.deep[item.val] = self.deep[front.val] + 1
                    q.put(item.val)

    # 设置 出入栈 的时间
    def set_stack_time(self):
        # 利用 deque 实现
        my_stack = deque()
        set_stack_time(0, my_stack, 1, self.deep, self.node)

    # 判断 c 是否在 a b 路径上
    def judge_same(self, a, b, c):
        # 如果等于其中一个 返回 True
        if c == a or c == b:
            return True
        # 取出 a b c 的入栈出栈时间值
        a_in = self.node[a].in_stack
        a_out = self.node[a].out_stack
        b_in = self.node[b].in_stack
        b_out = self.node[b].out_stack
        c_in = self.node[c].in_stack
        c_out = self.node[c].out_stack
        c_deep = self.deep[self.node[c].val]
        # 保证 a 始终在左边
        if a_in > b_in:
            b_out, a_out = a_out, b_out
            b_in, a_in = a_in, b_in
        # 考虑边缘情况 如果 a b 紧邻 那么 c 肯定不在 ab 路径上 返回 False
        if a_in == b_in - 1:
            return False
        # 如果  c 是 a 的祖先节点 并且不是 b 的祖先节点 返回 True
        if c_in < a_in and c_out < b_in:
            return True
        # 如果  c 是 b 的祖先节点 并且不是 a 的祖先节点 返回 True
        if c_in > a_out and c_out > b_out:
            return True
        # 如果 c 是 a b 的共同祖先节点
        # 那么 c 必须是最近的共同祖先节点 才能返回 True
        # 我们只需证明 c 的子节点里面 没有 ab 的共同祖先节点 即可
        elif c_in < a_in and c_out > b_out:
            # 过滤掉深度值不够的节点 即不是 c 的子节点的节点
            array = list(filter(
                lambda x: self.deep[x.val] > c_deep,
                self.node[c].next
            ))
            # 因为子节点入栈出栈时间区间也是呈递增的 可以使用二分查找
            return True if binary_search(a_in, b_out, array) else False
        # 考虑边缘情况 当 b 是 a 的祖先的时候 即 a b c 呈一条直线
        elif c_in > a_in and c_in < b_in:
            return True
        else:
            return False


# 递归调用 深度优先 返回 count 值为下一个节点所用
# count 是用来递增的记录节点的出栈和入栈值
def set_stack_time(index, my_stack, count, deep, node_array):
    # 获取当前节点 如果是空直接返回 count
    node = node_array[index]
    if not node:
        return count
    # 更新当前节点的入栈值 并且 count + 1
    node.in_stack = count
    count += 1
    # 压入栈中
    my_stack.append(node)
    front = node.next
    parent_deep = deep[node.val]
    # 循环取出邻接节点
    for item in front:
        # 当邻接节点的深度值更大才进行递归
        if deep[item.val] > parent_deep:
            # 递归调用 邻接节点
            count = set_stack_time(item.val, my_stack, count, deep, node_array)
    # 出栈
    temp = my_stack.pop()
    # 更新出栈时间值 并且 count + 1
    temp.out_stack = count
    count += 1
    # 返回 count 值
    return count


# 二分查找 每次搜索范围减半
def binary_search(a_in, b_out, array):
    left = 0
    right = len(array) - 1
    mid = left + ((right - left) // 2)
    while left <= right:
        mid_node = array[mid]
        m_in = mid_node.in_stack
        m_out = mid_node.out_stack
        # 如果存在 ab的共同祖先节点 返回 False
        if m_in < a_in and m_out > b_out:
            return False
        elif m_out < a_in:
            left = mid + 1
        else:
            right = mid - 1
    # 没有找到 返回 True
    return True
```
[Github 源码地址](https://github.com/Hchyeria/some-data-structure-and-algorithm)