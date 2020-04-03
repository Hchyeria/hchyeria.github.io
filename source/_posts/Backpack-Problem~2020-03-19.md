---
title: Backpack Problem
hascode: true
hasmath: false
author: Hchyeria
description: 总结一波背包问题的动态规划解法
tags:
  - Algorithm
  - Dynamic Programming
date: 'December 2, 2019'
abbrlink: 11971
---
## Backpack (0-1 knapsack problem)
[LintCode 92 Backpack](https://www.lintcode.com/problem/backpack/description)
单次选择，最大体积。
**Question**
Given n items with size Ai, an integer m denotes the size of a backpack. How full you can fill this backpack?
**Notice**
You can not divide any item into small pieces.
**Example**
If we have 4 items with size [2, 3, 5, 7], the backpack size is 11, we can select [2, 3, 5], so that the max size we can fill this backpack is 10. If the backpack size is 12. we can select [2, 3, 7] so that we can fulfill the backpack.
You function should return the max size we can fill in the given backpack.
**Challenge**
O(n x m) time and O(m) memory.
O(n x m) memory is also acceptable if you do not know how to optimize memory.

这个比较简单。直接上 Code。
这里将 2D-array 优化到了 1D-array。需要**倒序内层循环**。
在第 i 层循环初 dp[j] 存的相当于 dp[i - 1][j] 的值，因为在更新dp[j]时用到了 dp[j - A[i]], 由于**内层循环倒序**
dp[j - A[i]] 未更新，代表了dp[i-1][j - A[i]]，也就是 Old 的值。
```java
public int backPack(int m, int[] A) {
    if (m <= 0) {
        return m;
    }
    
    if (A == null || A.length == 0) {
        return 0;
    }
    int n = A.length;
    boolean[] dp = new boolean[m + 1];
    dp[0] = true;
    
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = m; j >= 0; --j) {
            if (j - A[i - 1] >= 0) {
                dp[j] = dp[j] || dp[j - A[i - 1]];
            }
            if (dp[j]) {
                res = Math.max(res, j);
            }
        }
    }
    return res;
}
```
## Backpack II (0-1 knapsack problem)
单次选择，最大价值。出现了，经典背包问题。
[LintCode 125 Backpack II](https://www.lintcode.com/problem/backpack-ii/description)
最基础的背包问题，特点是：每种物品仅有一件，可以选择放或不放，也即0 or 1。
子问题定义状态：即 F[i, v] 表示前 i 件物品放入一个容量为 v 的背包可以获得 的最大价值
其状态转移方程便是： F[i, v] = max{F[i − 1, v], F[i − 1, v − Ci ] + Wi}

```java
// 1D DP space Optimized
public int backPackII(int m, int[] A, int[] V) {
    if (m == 0 || A == null || A.length == 0
        || V == null || V.length == 0) {
        return 0;
    }
    int n = A.length;
    int[] dp = new int[m + 1];
    
    for (int i = 1; i <= n; ++i) {
        for (int j = m; j >= 0; --j) {
            if (j - A[i - 1] >= 0) {
                dp[j] = Math.max(dp[j], dp[j - A[i - 1]] + V[i - 1]);
            }
        }
    }
    return dp[m];
}
```

## Backpack III (unbounded knapsack problem (UKP))
[完全背包问题](https://www.lintcode.com/problem/backpack-iii/description)
**Description**
Givenn_kind of items with size Aiand value Vi(each item has an infinite number available) and a backpack with size_m. What's the maximum value can you put into the backpack?
You cannot divide item into small pieces and the total size of items you choose should smaller or equal to m.
**Example**
Given 4 items with size[2, 3, 5, 7]and value[1, 5, 2, 4], and a backpack with size10. The maximum value is15.

将其视为多重背包变形，每种物品取的上限是 m / A[i]。
可以无限使用物品, 就失去了 last i, last unique item 的意义: 因为可以重复使用. 所以可以转换一个角度:
1. 用 i 种 物品, 拼出 j 大小, 并且满足题目条件 (max value)。 这里因为item i可以无限次使用, 所以考虑使用了多少次K。
2. k虽然可以无限, 但是也被 k \* A[i] 所限制: 最大不能超过背包大小。
dp[i][j]: 前i种物品, fill weight j 的背包, 最大价值是多少。
dp[i][j] = max {dp[i - 1][j - k\*A[i-1]] + k\*V[i-1]}, k >= 0, k <= j / A[i-1]

Time: O(nmk)
如果k = 0 或者 1, 其实就是 Backpack II: 0-1背包，拿或者不拿
### 时间复杂度优化
优化时间复杂度, 通过画图或者数学公式递推发现:
所计算的 (dp[i - 1][j - k\*A[i - 1]] + k \* V[i - 1]) ，其实跟同一行的 dp[i][j-A[i-1]] 那个格子相比, 就多出了 V[i-1]
所以没必要每次都 loop over k times
简化: dp[i][j] 其中一个可能就是: dp[i][j - A[i - 1]] + V[i - 1]
Time: O(mn)
Space: O(mn)
### 空间复杂度优化
空间优化到1维数组
根据上一个优化的情况, 画出 2 rows 网格
发现 dp[i][j] 取决于: 
1. dp[i - 1][j]
2. dp[i][j - A[i - 1]]
其中: dp[i - 1][j] 是上一轮 (i-1) 的结算结果, dp[i][j - A[i - 1]] 是这轮已经算好的结果。所以我们只需要**正序内层循环**即可。
Time: O(mn)
Space: O(m)

```java
/**
Optimization1: 
- Optimise time:
- by draw dp array grid 
- dp[i - 1][j - k*A[i - 1]] + k * V[i - 1] actually equal to dp[i][j - A[i - 1]] + V[i - 1]
- so it's not necessary to loop k times
- Optimise Space:
- can compress to 1-D array
*/

public class Solution {
    // optimise time
    public int backPackIII(int[] A, int[] V, int m) {
        if (A == null || A.length == 0 || m == 0) {
            return 0;
        }

        int n = A.length;
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= m; ++j) {
                dp[i][j] = dp[i - 1][j];
                if (j - A[i - 1] >= 0) {
                    dp[i][j] = Math.max(dp[i][j], dp[i][j - A[i - 1]] + V[i - 1]);
                }
            }
        }
        return dp[n][m];
    }

    // optimise space
    public int backPackIII2(int[] A, int[] V, int m) {
        if (A == null || A.length == 0 || m == 0) {
            return 0;
        }

        int n = A.length;
        int[] dp = new int[m + 1];
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= m; ++j) {
                if (j - A[i - 1] >= 0) {
                    dp[j] = Math.max(dp[j], dp[j - A[i - 1]] + V[i - 1]);
                }
            }
        }
        return dp[m];
    }
}
```
详细可以参考[这篇文章](https://aaronice.gitbooks.io/lintcode/content/dynamic_programming/backpack-iii.html)

## Backpack IV (UKP) / Coin Change II
**Description**
[LeetCode 518 Coin Change 2](https://leetcode.com/problems/coin-change-2/)
Given n items with size nums[i] which an integer array and all positive numbers, no duplicates. An integer target denotes the size of a backpack. Find the number of possible fill the backpack.
Each item may be chosen unlimited number of times

```java
public int change(int amount, int[] coins) {
        if (coins == null) {
            return 0;
        }
        
        int n = coins.length;
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= amount; ++j) {
                if (j - coins[i - 1] >= 0) {
                    dp[j] += dp[j - coins[i - 1]];    
                }
                
            }
        }
        return dp[amount];
        
    } 
    // Time = O(m * n)
    // Space = O(n)
```
## Backpack V (0/1 Knapsack Problem)
单次选择, 装满可能性总数
[LintCode 563 Backpack V](https://www.lintcode.com/problem/backpack-v/description)
```java
public int backPackV(int[] nums, int target) {
        // write your code here
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int n = nums.length;
        int[] dp = new int[target + 1];
        
        dp[0] = 1;
        for (int i = 1; i <= n; ++i) {
            for (int j = target; j >= 0; --j) {
                if (j - nums[i - 1] >= 0) {
                    dp[j] += dp[j - nums[i - 1]];
                }
            }
        }
        return dp[target];
    }
```
## Backpack VI / Combination Sum IV
重复选择, 不同排列, 装满可能性总数
[LeetCode 377 Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)
```java
    // dp
    // dp[i] = dp[i - A[0]] + dp[i - A[1]] ... + dp[i - A[n]], A[0..n] <= i
    // can't pick the first number then pick second number
    // because the order is not matter 
    // (1, 1, 2), (1, 2, 1) regarded as different result not one
    // so we should try each number at each loop
    public int combinationSum4(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int n = nums.length;
        int[] dp = new int[target + 1];
        dp[0] = 1;
         
        for (int i = 1; i <= target; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i >= nums[j]) {
                    dp[i] += dp[i - nums[j]];
                }
            }
        }
        return dp[target];
    }

    // Time = O(n * target)
    // Space = O(target)
```


## Backpack VII (bounded knapsack problem (BKP))
[800. Backpack IX](https://www.lintcode.com/problem/backpack-ix/description)
