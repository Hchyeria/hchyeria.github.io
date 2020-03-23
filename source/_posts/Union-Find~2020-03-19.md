---
title: Union Find
hascode: true
hasmath: true
author: Hchyeria
description: 并查集算法
tags:
  - Algorithm
  - Data Structure
date: September 4, 2019
abbrlink: 57807
---

这几天忙着做专业课程设计2。学习了很多有意思的算法和数据结构。在此记录一下。
这篇是关于 Union-Find（并查集）。

## Intro
Union-Find is a special tree structure (child point to parent), fast to check the connect in a network.
Method:
1. union(p, q)		  -> 	O(h)
2. isConnected(p, q)  ->    O(h)
Worse case, it may be union to a linked list, so we should use **size** to optimize.

### Optimize size
`size[i]`: represents the size of a union find set. But use size may be uncorrected in some situations, for example, the tree with smaller size but has large depth. So we can use `height` to decide which one to merge.

### Optimize rank
`rank[i]`: represent the height of a union find set
```java
public void unionElements(int p, int q) {
    int pRoot = find(p);
    int qRoot = find(q);
    if (pRoot == qRoot) {
        return;
    }
    
    if (rank[pRoot] < rank[qRoot]) {
        parent[pRoot] = qRoot;
    } else if (rank[qRoot] < rank[pRoot]) {
        parent[qRoot] = pRoot;
    } else { // rank[pRoot] == rank[qRoot]
        parent[qRoot] = pRoot;
        rank[pRoot] += 1; // notation!
    }
}
```
### Path Compression
1. union(p, q)		    -> 	    O(log\*n) --> log* : iterated logarithm 
2. isConnected(p, q)    ->      O(log\*n)

O(log\*n) ~= O(1), faster than O(log(n))
```java
private int find(int p) {
    if (p < 0 && p >= parent.length) {
        throw new IllegalArgumentException("p is out of bound.");
    }
    while (p != parent[p]) {
        parent[p] = parent[parent[p]];
        p = parent[p];
    }
    return p;
}
```
another path compression: compress set to a 2 height of tree
```java
private int find(int p) {
    if (p > 0 && p >= parent.length) {
        throw new IllegalArgumentException("p is out of bound.")
    }
    if (p != parent[p]) {
        parent[p] = find(parent[p]);
    }
    return p;
}
```
## Question
### 课设的题目
题目要求
“熊猫烧香”是在网络中传播的一种著名病毒，因为图标是一只可爱的熊猫而得名。该病毒比较难以处理的一个原因是它有很多变种。
现在某实验室的网络就不幸感染了这种病毒。从下图中可以看到，实验室的机器排列为一个M行N列的矩阵，每台机器只和它相邻的机器直接相连。开始时有T台机器被感染，每台遭遇的熊猫变种类型都不同，分别记为Type1，Type2，… Typer，每台机器都具有一定级别的防御能力，将防御级别记为L(0 < L <1000）。
“熊猫烧香”按照下列规则迅速在网络中传播：
* 病毒只能从一台被感染的机器传到另一台没有被感染的机器。
* 如果一台机器已经被某个变种的病毒感染过，就不能再被其他变种感染。
* 病毒的传播能力每天都在增强。第1天，病毒只能感染它可以到达的、防御级别为1的机器，而防御级别大于1的机器可以阻止它从自己处继续传播。第D天，病毒可以感染它可以到达的、防御级别不超过D的机器，而只有防御级别大于的机器可以阻止它从自己处继续传播。
* 在同一天之内，Type1变种的病毒先开始传播，感染所有它可能感染的机器，然后是Type2变种、Type3变种……依次进行传播。
用一个矩阵表示网络中机器的状态，用负整数-L表示未被感染的、防御级别为L的机器，正整数Typei表示该机器被Typei类型的病毒变种感染，则初始状态有矩阵：
\begin{bmatrix}
1 & -3 & -2 & -3 \\\
-2 & -1 & -2 & 2 \\\
-3 & -2 & -1 & -1
\end{bmatrix}
病毒传播1天后，1号变种无法传播，2号变种攻下了第3行中2台防御级别为1的机器，矩阵变为
\begin{bmatrix}
1 & -3 & -2 & -3 \\\
-2 & -1 & -2 & 2 \\\
-3 & -2 & 2 & 2
\end{bmatrix}
第2天，1号变种攻下了所有未被感染的、防御级别为1或2的机器，2号变种则无事可做，因为它唯一可以接触到的未被感染的机器，其防御级别是3。这时矩阵变为：
\begin{bmatrix}
1 & -3 & 1 & -3 \\\
1 & 1 & 1 & 2 \\\
-3 & 1 & 2 & 2
\end{bmatrix}
第3天,1号病毒继续发威，攻下了剩下的3台防御级别为3的机器，则整个网络全被感染，矩阵变为
\begin{bmatrix}
1 & 1 & 1 & 1 \\\
1 & 1 & 1 & 2 \\\
1 & 1 & 2 & 2
\end{bmatrix}
本题的任务是：当整个网络被感染后，计算有多少台机器被某个特定变种所感染。
输入要求：
输入由若干组测试数据组成。
每组数据的第1行包含2个整数M和N(1<=M，N<=500），接下来是一个M*N的矩阵表示网络的初始感染状态，其中的正、负整数的意义如题目描述中所定义。
下面一行给出一个正整数Q，是将要查询的变种的个数。接下去的Q行里，每行给出一个变种的类型。
当M或N为0时，表示全部测试结束，不要对该数据做任何处理。
输出要求：
对每一组测试，在一行里输出被某个特定变种所感染的机器数量。
输入例子：
3 4
1 -3 -2 -3
-2 -1 -2 2
-3 -2 -1 -1
2
1
2
0 0
输出例子：
9
3

这道题有多种解法广度优先 O(M\*N\*L)，修改 Dijkstra 算法 O(MNlog(MN))，并查集 O(MNlog\*(MN))。
并查集的实现。
```python
# 并查集算法(没带路径压缩)
class DisjointSet:
    def __init__(self, n: int):
        self.disjoint_set = [-1] * n

    # 找寻该节点的根节点
    def find_root(self, x):
        # 如果值小于 0 返回下标
        # 否则继续寻找 知道小于 0 为止
        if self.disjoint_set[x] < 0:
            return x
        next_x = x
        while self.disjoint_set[next_x] >= 0:
            next_x = self.disjoint_set[next_x]
        return next_x

    # 合并
    def union(self, root1, root2):
        # 如果root2 的集合数目更多
        # 将 root1 指向 root2 即可
        if self.disjoint_set[root2] < self.disjoint_set[root1]:
            self.disjoint_set[root1] = root2
        else:
            # 否则 如果相同 self.disjoint_set[root1] -1
            if self.disjoint_set[root2] == self.disjoint_set[root1]:
                self.disjoint_set[root1] -= 1
            # 将 root2 指向 root2 即可
            self.disjoint_set[root2] = root1

    # 为了第 7 题 新增的方法
    # 熊猫病毒感染合并的时候 不需要比较哪个集合的数目多
    # 之间强制合并 指向病毒 即可
    def force_union(self, root1, root2):
        self.disjoint_set[root2] = root1
```
```python
# 定义表示每台计算机类
class Entry:
    def __init__(self, m, n, val):
        self.m = m
        self.n = n
        self.val = val
        self.next = None

    def __repr__(self):
        return repr((self.m, self.n, self.val))


class Nimaya:
    def __init__(self, m, n):
        # 使用矩阵存储图
        self.graph = [[0 for clo in range(n)] for row in range(m)]
        # 图的行数和列数
        self.m = m
        self.n = n
        # 引用第四题写好的 并查集 类
        self.union_find_set = DisjointSet(m * n)
        # 病毒最多的天数感染全部
        self.max_day = -99999
        # 储存病毒信息
        self.virus = []

    # 添加函数
    def add(self, m, n, val):
        self.graph[m][n] = val
        # 如果是病毒 添加到数组
        if val > 0:
            for i in range(len(self.virus)):
                if val == self.virus[i].val:
                    root1 = self.union_find_set.find_root(self.virus[i].m * self.n +self.virus[i]. n)
                    root2 = self.union_find_set.find_root(m * self.n + n)
                    self.union_find_set.union(root1, root2)
                    return
            self.virus.append(Entry(m, n, val))
        else:
            # 根据计算机的防御级别 找出最大的防御级别即是最多需要的天数
            self.max_day = max(self.max_day, abs(val))

    # 获取某一台电脑或者病毒 附近没有被病毒感染的函数
    def get_adjacent(self, m, n):
        # 注意四边的边界情况即可
        res = []
        if m != 0:
            if not self.is_virused(m - 1, n):
                res.append((m - 1, n))
        if n != 0:
            if not self.is_virused(m, n - 1):
                res.append((m, n - 1))
        if m != (self.m - 1):
            if not self.is_virused(m + 1, n):
                res.append((m + 1, n))
        if n != self.n - 1:
            if not self.is_virused(m, n + 1):
                res.append((m, n + 1))
        return res

    # 分组 防御级别相同的为一组 并为这个组选择一个虚拟根节点
    def group(self, m, n, visited):
        # 递归结束条件 所有的节点都已经访问过
        if 0 not in visited:
            return
        visited[m * self.n + n] = 1
        adjacent = self.get_adjacent(m, n)
        root1 = self.union_find_set.find_root(m * self.n + n)
        # 循环附近的节点
        for item in adjacent:
            x, y = item
            root2 = self.union_find_set.find_root(x * self.n + y)
            # 如果虚拟根节点不相等
            if root1 != root2:
                # 如果防御能力相同并且 是电脑 则合并
                if self.graph[x][y] == self.graph[m][n] and self.graph[m][m] < 0:
                    self.union_find_set.union(root1, root2)
            # 如果节点没有被访问过 递归该节点
            if not visited[x * self.n + y]:
                self.group(x, y, visited)

    # 判断是否被病毒感染的函数
    # 比较该节点的虚拟根节点是否指向其中一种病毒即可
    def is_virused(self, m, n):
        root2 = self.union_find_set.find_root(m * self.n + n)
        for virus in self.virus:
            root1 = self.union_find_set.find_root(virus.m * self.n + virus.n)
            if root1 == root2:
                return True
        return False

    # 感染函数
    def infect(self):
        # 按照病毒的种类排序 小的先开始感染
        temp = sorted(self.virus, key=lambda x: x.val)
        self.virus = temp
        # 从第一天开始 最多不超过 最大防御级别的天数
        for day in range(1, self.max_day+1):
            for virus in self.virus:
                ptr = virus
                val = virus.val
                # 找出该病毒感染过的所有节点
                temp = list(
                    filter(
                        lambda item: self.union_find_set.find_root(item[0]) == (virus.m * self.n + virus.n),
                        enumerate(self.union_find_set.disjoint_set)
                    ))
                # 挨个开始感染
                for index, p in temp:
                    t_n = index % self.n
                    t_m = (index - t_n)//self.n
                    root1 = self.union_find_set.find_root(t_m * self.n + t_n)
                    adjacent = self.get_adjacent(t_m, t_n)
                    for item in adjacent:
                        x, y = item
                        root2 = self.union_find_set.find_root(x * self.n + y)
                        # 如果还没有被感染
                        if not self.is_virused(x, y):
                            # 并且防御级别小于天数 则该电脑可以被感染
                            if abs(self.graph[x][y]) <= day:
                                self.union_find_set.force_union(root1, root2)
                                self.graph[x][y] = val
                                # 加入到感染数组
                                temp.append((x * self.n + y, val))

    # 获取指定哪种病毒种类的个数
    def get_virus_res(self, type_name):
        # 自需要找出 并查集里面根节点指向该病毒的节点 即可
        for virus in self.virus:
            val = virus.val
            if val == type_name:
                x, y = virus.m, virus.n
                break
        temp = list(
            filter(
                lambda item: self.union_find_set.find_root(item[0]) == (x*self.n + y),
                enumerate(self.union_find_set.disjoint_set)
            ))
        # 返回长度
        return len(temp)
```

### LeetCode
#### 827 Making A Large Island
[827 Making A Large Island](https://leetcode.com/problems/making-a-large-island/)
实际上这道题还有更好的解法，这里只是做一个并查集的练习。
```java
class Solution {
    // I just want practice union find set
    // actually, this method isn't good
    // we can change grid node value to their index (index id partition identify id)
    // and use Hash map to store the size
    // both can be done in DFS
    // then loop every 0
    private static class UnionFind {
        int[] parent;
        int[] rank;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; ++i) {
                parent[i] = i;
            }
        }
        // with path compression
        int find(int index) {
            while (parent[index] != index) {
                parent[index] = parent[parent[index]];
                index = parent[index];
            }

            return index;
        }
        
        boolean isConnected(int x, int y) {
            return find(x) == find(y);
        }
        
        void union(int x, int y) {
            int p = find(x);
            int q = find(y);
            if (rank[p] < rank[q]) {
                parent[p] = q;
            } else if (rank[p] > rank[q]) {
                parent[q] = parent[p];
            } else {
                parent[p] = q;
                rank[q] += 1;
            }
        }
        
    }
    
    private int m;
    private int n;
    private static final int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    public int largestIsland(int[][] grid) {
        m = grid.length;
        n = grid[0].length;
        UnionFind unionFind = new UnionFind(m * n);
        int globalMax = 0;
        Set<Integer> visited = new HashSet<>();
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1
                    && !visited.contains(i * n + j)) {
                    int size = dfs(grid, visited, unionFind, i, j);
                    map.put(unionFind.find(i * n + j), size);
                    globalMax = Math.max(globalMax, size);
                }
            }
        }
        
        
       for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 0) {
                    int curSize = 0;
                    // need set to deduplicate
                    Set<Integer> seen = new HashSet<>();
                    for (int[] d : dirs) {
                        int x = i + d[0];
                        int y = j + d[1];
                        if (isArea(x ,y) 
                            && grid[x][y] == 1) {
                            int root = unionFind.find(x * n + y);
                            if (!seen.contains(root)) {
                                curSize += map.get(root);
                                seen.add(root);
                            }
                        }
                    }
                    curSize++;
                    globalMax = Math.max(globalMax, curSize);
                }
            }
        }
        return globalMax;
    }
    
    private int dfs(int[][] grid, Set<Integer> visited, 
                    UnionFind unionFind, int x, int y) {
        int count = 1;
        visited.add(x * n + y);
        for (int[] d : dirs) {
            int i = x + d[0];
            int j = y + d[1];
            if (isArea(i ,j)
                && grid[i][j] == 1
                && !visited.contains(i * n + j)) {
                count += dfs(grid, visited, unionFind, i, j);
                unionFind.union(x * n + y, i * n + j);
            } 
        }
        
        return count;
    }
    
    private boolean isArea(int x, int y) {
        return x >= 0 && x < m && y >= 0 && y < n;
    }
    
}
```
#### 	128	Longest Consecutive Sequence
[LeetCode 128 Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)
```java
class Solution {
    // Solution 1: HashMap
    public int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        Map<Integer, Integer> map = new HashMap<>();
        int sum = 0, res = 0;
        for (int num : nums) {
            if (map.containsKey(num)) {
                continue;
            }
            int left = map.getOrDefault(num - 1, 0);
            int right = map.getOrDefault(num + 1, 0);
            sum = left + right + 1;
            res = Math.max(res, sum);
            
            if (left > 0) {
                map.put(num - left, sum);
            }
            if (right > 0) {
                map.put(num + right, sum);
            }
            map.put(num, sum);
        }
        return res;
    }
    // Time = O(n)
    // Space = O(n)

    private static class UnionFind {
        int[] parent;
        
        UnionFind(int n) {
            parent = new int[n];
            Arrays.fill(parent, -1);
        }
        
        void union(int i, int j) {
            int m = find(i);
            int n = find(j);
            if (parent[m] <= parent[n]) {
                parent[m] += parent[n];
                parent[n] = m;
            } else {
                parent[n] += parent[m];
                parent[m] = n;
            }
        }
        
        int find(int i) {
            while (parent[i] >= 0) {
                int temp = parent[i];
                if (parent[temp] < 0) {
                    i = temp;
                    break;
                }
                parent[i] = parent[temp];
                i = parent[i];
            }
            return i;
        }
        
        int maxSize() {
            int res = 0;
            for (int i : parent) {
                res = Math.min(res, i);
            }
            return -res;
        }
        
    }
    // Solution 2: UnionFind
    public int longestConsecutive2(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        Map<Integer, Integer> map = new HashMap<>();
        int n = nums.length;
        UnionFind unionFind = new UnionFind(n);
        for (int i = 0; i < n; ++i) {
            if (map.containsKey(nums[i])) {
                continue;
            }
            map.put(nums[i], i);
            Integer left = map.get(nums[i] - 1);
            if (left != null) {
                unionFind.union(i, left);
            }
            Integer right = map.get(nums[i] + 1);
            if (right != null) {
                unionFind.union(i, right);
            }
        }
        return unionFind.maxSize();
    }

    // Time = O(n * log*(n))
    // Space = O(n)
}
```

#### 
[LeetCode 305 Number of Islands II](https://leetcode.com/problems/number-of-islands-ii)
```java
public class Solution {
    /**
     * @param n: An integer
     * @param m: An integer
     * @param operators: an array of point
     * @return: an integer array
     */
     
    private static class UnionFind {
        int[] parent;
        int count;
        
        UnionFind(int n) {
            parent = new int[n];
        }
        
        void addLand(int i) {
            if (parent[i] > 0) {
                return;
            }
            parent[i] = i;
            count++;
        }
        
        int find(int i) {
            while (parent[i] != i) {
                parent[i] = parent[parent[i]];
                i = parent[i];
            }
            return i;
        }
        
        void union(int i, int j) {
            int q = find(i);
            int p = find(j);
            if (q != p) {
                parent[q] = p;
                count--;
            }
        } 
        
        int numberOfLand() {
            return count;
        }
        
        boolean isLand(int i) {
            return parent[i] > 0;
        }
    }
    
    private static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    private int row, col;
    public List<Integer> numIslands2(int n, int m, Point[] operators) {
        // write your code here
        if ((n == 0 && m == 0) || operators == null || operators.length == 0) {
            return Collections.emptyList();
        }
        row = n;
        col = m;
        UnionFind uf = new UnionFind(row * col + 1);
        List<Integer> res = new ArrayList<>();
        for (Point p : operators) {
            int position = p.x * col + p.y + 1;
            uf.addLand(position);
            
            for (int[] d : DIRS) {
                int x = p.x + d[0];
                int y = p.y + d[1];
                if (isArea(x, y) && uf.isLand(x * col + y + 1)) {
                    uf.union(position, x * col + y + 1);
                } 
            } 
            res.add(uf.numberOfLand());
        }
        
        return res;
    }
    
    private boolean isArea(int x, int y) {
        return x >= 0 && x < row && y >= 0 && y < col;
    }

    // Time = O(n * 4 * log*(n))
    // Space = O(n)
}
```

[Github 源码地址](https://github.com/Hchyeria/some-data-structure-and-algorithm)