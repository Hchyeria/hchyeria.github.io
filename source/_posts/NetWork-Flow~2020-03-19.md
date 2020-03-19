---
title: NetWork Flow
hascode: true
hasmath: false
author: Hchyeria
description: 网络流算法
tags:
  - Algorithm
  - Graph
date: September 3, 2019
abbrlink: 6331
---
这几天忙着做专业课程设计2。学习了很多有意思的算法和数据结构。在此记录一下。
这篇是关于 NetWork-Flow（网络流）。
啥是网络流呢，网上有很多教程，这里我就不赘诉了。直接上题目。
## Question
网络流:宇宙旅行
题目要求
在走遍了地球上的所有景点以后，旅游狂人开始计划他的宇宙旅行项目。经过谨慎调查，他目前掌握了一张各卫星空间站可以临时容纳的旅客人数的列表。当旅客从一个星球飞往另一个星球时，需要在若干卫星空间站临时停靠中转，而这些空间站不能接待任何旅客驻留，旅客必须立刻转乘另一艘飞船离开，所以空间站不能接待超过自己最大容量的旅客流。为了估计预算，现在旅游狂人需要知道终点星球的接待站应该设计多大容量，才能使得每艘飞船在到达时都可以保证让全部旅客下船。
输入要求：
输人由若干组测试数据组成。
每组测试数据的第1行包含旅行的起点星球和终点星球的名称和一个不超过500的正整数N(N为0标志全部测试结束，不要对该数据做任何处理)。
接下来的N 行里，数据格式为： source, destination, capacity，其中 source 和 destination 是卫星空间站的名称或起点、终点星球的名称，正整数 capacity 是飞船从 source 到 dest­nation —次能运载的最大旅客流量。每个名称是由 A 〜Z 之间 3 个大写字母组成的字符串，例如ZJU。
测试数据中不包含任何到达起点星球的信息以及任何从终点星球出发的信息。
输出要求：
对每一组测试，在一行里输出终点星球接待站应具有的最小容量，使得每艘飞船在到达时都可以保证让全部旅客下船。
输入例子：
EAR MAR 8 
EAR AAA 300
EAR BBB 200 
AAA BBB 100 
AAA CCC 300 
BBB DDD 200 
AAA DDD 400 
CCC MAR 200 
DDD MAR 300 
EAR MAR 8 
EAR AAA 300 
AAA BBB 400 
EAR DDD 200 
AAA DDD 100 
AAA CCC 300 
DDD BBB 200 
CCC MAR 200 
BBB MAR 300 
ABC DEF 0
输出例子：
500
500

## Solution
这道题还得写个生成大量测试数据的程序脚本。
我觉得代码注释已经很详细了。
```python
# -*- coding:utf-8 -*-
"""
    Network flows: the universal tour
    Question 3
    Author: Hchyeria
"""
import queue

# 定义图的边的类
class Edge:
    def __init__(self, u: int, v: int, w: int):
        self.u = u
        self.v = v
        self.w = w


# 运用 Dinik 网络流算法解决
# 比起传统的 Ff 算法 Dinik 算法能够利用 图的deep的概念 选择增广路径的时候只能选择 deep 递增的一条
# 优化了寻找增广路径的算法
# 该算法理论时间复杂度可以达到 O(n*2)
# 但本题经过了一些性能优化 实际上运行的效果不错 速度也快
# 具体优化的细节:
# 1：当前弧优化; 对于一些已经找过的节点 它的前面几条路径已经访问过了 那么我们再次访问到这个节点
#     的时候可以从没有访问过的路径开始 减少每次循环的次数
# 2: 多路增广优化; 利用递归 将相对节点的所有路径的流相加之后 再让该节点的流减去相加后的流 避免一条一条的减 浪费时间
# 3: 炸点优化; 当这个节点可流的流量已经为 0 了 直接让其对应 deep 变为 -2 让广度优先寻找增广路径的时候不可能再访问到它
#     相当于把这个节点隔绝掉一样
class Dinik:
    def __init__(self, s: int, t: int, n: int):
        # 起点
        self.s = s
        # 终点
        self.t = t
        # 节点总数
        self.n = n
        # 最大流
        self.max_flow = 0
        # 存储边数据
        self.edge_array = []
        # 图的信息 用 graph[u][v] 可以访问到对应边的数组下标 edge_array[graph[u][v]]
        # graph[u][v] ^ 1  可以访问到对应边的临边的数组下标edge_array[graph[u][v] ^ 1]
        self.graph = [[]]*n
        # 储存深度信息
        self.deep = []

    # 添加节点的函数
    def add(self, u: int, v: int, w: int):
        # edge_array存储所有边的信息 临边的权重为0
        # 边必须以偶数开始 临边存储在相邻位置 才能用 异或1 取到临边信息
        self.edge_array.append(Edge(u, v, w))
        self.edge_array.append(Edge(v, u, 0))
        size = len(self.edge_array)
        # grapg保存下标信息
        if self.graph[u]:
            self.graph[u].append(size-2)
        else:
            self.graph[u] = [size - 2]

        if self.graph[v]:
            self.graph[v].append(size - 1)
        else:
            self.graph[v] = [size - 1]

    # 广度优先遍历图 更新 deep 信息
    # 并返回能否找到增广路径
    # 也就是有没有路到从起点到终点
    def bfs(self):
        # 每次都需要重新设置 deep
        self.deep = [0] * self.n
        # 利用队列的先进先出的特点 方便实现广度优先遍历
        q = queue.Queue()
        # 起点深度为 1
        self.deep[self.s] = 1
        q.put(self.s)
        while not q.empty():
            ptr = q.get()
            size = len(self.graph[ptr])
            for i in range(size):
                edg = self.edge_array[self.graph[ptr][i]]
                if not self.deep[edg.v] and edg.w > 0:
                    # 将相邻的节点深度加1
                    self.deep[edg.v] = self.deep[edg.u] + 1
                    q.put(edg.v)
        # 返回能否找到增广路径
        return self.deep[self.t] > 0

    # Dinik 算法核心
    # min_flow 代表当前路径的最小容量
    def dfs(self, x, min_flow, cur):
        # 如果找到终点 或者 当前最小流量已经为 0 了 直接返回 min_flow
        if x == self.t or min_flow == 0:
            return min_flow
        # 保存流量值
        fl = 0
        # 遍历节点分支的路径
        for i in range(cur[x], len(self.graph[x])):
            # 当前弧优化 记录下次从没有访问过的开始遍历
            cur[x] = i
            if not min_flow:
                break
            edg = self.edge_array[self.graph[x][i]]
            # Dinik 算法 路径必须是深度递增的
            if self.deep[edg.v] == self.deep[edg.u] + 1 and edg.w:
                # 多路增广优化
                child_flow = self.dfs(edg.v, min(min_flow, edg.w), cur)
                # 当前边权重- 反边+
                self.edge_array[self.graph[x][i]].w -= child_flow
                self.edge_array[self.graph[x][i] ^ 1].w += child_flow
                min_flow -= child_flow
                fl += child_flow
        # 炸点优化
        if not fl:
            self.deep[x] = -2
        return fl

    # 找出最大流函数
    def find_max_flow(self):
        res = 0
        # 当还有增广路径 说明还可以增流 继续找
        while self.bfs():
            cur = [0]*len(self.edge_array)
            res += self.dfs(self.s, float("inf"), cur)
        return res
```
网络最大流算法还能解决一些配对问题，通过图建模转化为网络流算法。
[Github 源码地址](https://github.com/Hchyeria/some-data-structure-and-algorithm)