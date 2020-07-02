---
title: Merge-Sort
date: 'March 25, 2020'
hascode: true
hasmath: false
author: Hchyeria
description: 巧用 Merge Sort 解决一些难题
tags:
  - Algorithm
  - Sort
abbrlink: 27188
---

Merge Sort 应该对大部分人来说是小菜一碟。分分钟就写出来了。但是 Merge Sort 也能变得很难，难点在它的精髓。
那么 Merge Sort 的精髓是什么？是递归分治？是每对元素只比较一次？是稳定排序？
以上都是，哈哈哈。但是要吃透还是很难的。下面我们来看几道题就懂了

## Merge Sort 倒着来
先来个开胃的。
怎样实现 "ABCDE12345" -> "A1B2C3D4E5"？
可能大家都会 "A1B2C3D4E5" -> "ABCDE12345"，sort 一下就好了，但是怎么反过来呢？
先想5分钟。
好，5分钟到了。看标题，就是倒着来 Merge Sort。
注意：
* 奇偶数的情况
* 交换完，必须保证始终是配对的
上 code

```java
public String backMergeSort(String input) {
    if (input == null || input.length() <= 1) {
        return input;
    }
    char[] in = input.toCharArray();
    convert(in, 0, in.length - 1);
    return new String(in, 0, in.length);
}

private void convert(char[] input, int left, int right) {
    if (right - left <= 1) {
        return;
    }
    int size = right - left + 1;
    int mid = left + size / 2;
    int leftMid = left + size / 4;
    int rightMid = leftMid + size / 2;
    reverse(input, leftMid, mid - 1);
    reverse(input, mid, rightMid - 1);
    reverse(input, leftMid, rightMid - 1);
    convert(input, left, left + 2 * (leftMid - left) - 1);
    convert(input, left + 2 * (leftMid - left), right);
}

private void reverse(char[] input, int left, int right) {
    while (left < right) {
        char temp = input[left];
        input[left++] = input[right];
        input[right--] = temp;
    }
}
```

## Count of Smaller Numbers After Self
[LeetCode 315 Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self)
经典题目。这道题也可以用 Segment Tree 和 Binary Indexed Tree 来做，这里就只贴 Merge Sort 的解法。
```java
class Solution {
    public List<Integer> countSmaller(int[] nums) {
        List<Integer> res = new ArrayList<>();
        if (nums == null || nums.length == 0) {
            return res;
        }
        int n = nums.length;
        int[] helper = new int[n];
        int[] indexArray = new int[n];
        
        for (int i = 0; i < n; ++i) {
            indexArray[i] = i;
            res.add(0);
        }
        mergeSort(nums, 0, n - 1, res, indexArray, helper);
        
        return res;
    }
    
    private void mergeSort(int[] nums, int start, int end, List<Integer> res, 
                           int[] indexArray, int[] helper) {
        if (start >= end) {
            return;
        }
        int mid = start + (end - start) / 2;
        mergeSort(nums, start, mid, res, indexArray, helper);
        mergeSort(nums, mid + 1, end, res, indexArray, helper);
        merge(nums, start, mid, end, res, indexArray, helper);
    }
    
    private void merge(int[] nums, int start, int mid, 
                       int end, List<Integer> res, int[] indexArray, int[] helper) {
        System.arraycopy(indexArray, start, helper, start, end - start + 1);
        int left = start;
        int right = mid + 1;
        int p = start;
        
        while (left <= mid) {
            if (right > end || nums[helper[left]] <= nums[helper[right]]) {
                indexArray[p++] = helper[left];
                res.set(helper[left], res.get(helper[left]) + right - (mid + 1));
                left++;
            } else {
                indexArray[p++] = helper[right++];
            }
        }
    }
    // Time Complexity: O(n * log(n))
    // Space Complexity: O(n)
}
```
是不是非常巧妙

## Count of Range Sum
[LeetCode 327 Count of Range Sum](https://leetcode.com/problems/count-of-range-sum)
同样，其实和上面的是一道题，换了个马甲
```java
class Solution {
    public int countRangeSum(int[] nums, int lower, int upper) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int n = nums.length;
        // pay attention, must n + 1
        // otherwise, will miss the case , the first i sum
        // the first i sum is preSum[i], not need to -preSum[j], j < i
        long[] preSum = new long[n + 1];
        for (int i = 0; i < n; ++i) {
            preSum[i + 1] = i == 0 ? nums[i] : preSum[i] + nums[i];
        }
        long[] helper = new long[n + 1];
        return mergeSort(preSum, 0, n, lower, upper, helper);
    }

    private int mergeSort(long[] sum, int start, int end, int lower, int upper, long[] helper) {
        if (start >= end) {
            return 0;
        }
        int mid = start + (end - start) / 2;
        int left = mergeSort(sum, start, mid, lower, upper, helper);
        int right = mergeSort(sum, mid + 1, end, lower, upper, helper);
        return merge(sum, start, mid, end, lower, upper, helper) + left + right;
    }

    private int merge(long[] sum, int start, int mid, int end, int lower, int upper, long[] helper) {
        int left = start, right = mid + 1, p = mid + 1, k = mid + 1, t = start;
        System.arraycopy(sum, start, helper, start, end - start + 1);
        int count = 0;
        while (left <= mid) {
            while (k <= end && helper[k] - helper[left] < lower) ++k;
            while (p <= end && helper[p] - helper[left] <= upper) ++p;
            while (right <= end && helper[right] < helper[left]) {
                sum[t++] = helper[right++];
            }
            sum[t++] = helper[left++];
            count += p - k;
        }

        return count;
    }
    // Time = O(n * log(n))
    // Space = O(n helper, preSum + log(n) call-stack)
}
```

## Reverse Pairs
[LeetCode 493 Reverse Pairs](https://leetcode.com/problems/reverse-pairs)
依然是相似的类型
```java
class Solution {
    public int reversePairs(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int n = nums.length;
        int[] helper = new int[n];
        return mergeSort(nums, 0, n - 1, helper);
    }
    
    private int mergeSort(int[] nums, int start, int end, int[] helper) {
        if (start >= end) {
            return 0;
        }
        int res  = 0;
        int mid = start + (end - start) / 2;
        res += mergeSort(nums, start, mid, helper);
        res += mergeSort(nums, mid + 1, end, helper);
        System.arraycopy(nums, start, helper, start, end - start + 1);
        int l = start, r = mid + 1;
        int p = start, t = mid + 1;
        long temp = 0L; // 2 * helper[t] maybe overflow
        while (l <= mid) {
            // can't write like this
            // int t = end;
            // while (t > mid && ((temp = 2L * helper[t]) >= helper[l])) {
            //     t--;
            // }
            // res += t - mid;
            // because t is monotonic changed, during while loop
            // if we use t--, we should initial t as end every loop
            // the time will be n^2, will cause TLE
            while (t <= end && ((temp = 2L * helper[t]) < helper[l])) {
                t++;
            }
            if (t > mid + 1) {
                res += t - (mid + 1);
            }
            while (r <= end && helper[r] < helper[l]) {
                nums[p++] = helper[r++];
            }
            nums[p++] = helper[l++];
        }
        return res;
    }
    // Time = O(n * log(n))
    // Space = O(n + log(n))
}
```
## Max Sum of Rectangle No Larger Than K
比较难的一道题，Merge Sort 在里面只是一个 helper function。更难的还有其他的知识点，下次有机会再说吧。
```java
class Solution {
    // Solution 1: use TreeSet to do Binary Search
    public int maxSumSubmatrix(int[][] matrix, int k) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        int row = matrix.length, col = matrix[0].length;
        int m = Math.min(row, col);
        int n = Math.max(row, col);
        boolean isColBig = n == col;
        long[] sum = new long[n + 1];
        int res = Integer.MIN_VALUE;
        TreeSet<Long> set = new TreeSet<>();
        for (int i = 0; i < m; ++i) {
            long[] preSum = new long[n];
            for (int j = i; j < m ; ++j) {
                set.clear();
                set.add(0L);
                for (int p = 0; p < n; ++p) {
                    preSum[p] += isColBig ? matrix[j][p] : matrix[p][j];
                    sum[p + 1] = sum[p] + preSum[p];
                    Long cur = set.ceiling(sum[p + 1] - k);
                    if (cur != null) {
                        res = Math.max(res, (int) (sum[p + 1] - cur));
                        if (res == k) {
                            return k;
                        }
                    }
                    set.add(sum[p + 1]);
                }
            }
        }
        return res;
    }
    // min = min(m, n), max = max(m, n)
    // Time = O(min ^ 2 * max*loh(max))
    // Space = O(max)
    
    // Solution 2: use mergeSort
    public int maxSumSubmatrix2(int[][] matrix, int k) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }
        int row = matrix.length, col = matrix[0].length;
        int m = Math.min(row, col);
        int n = Math.max(row, col);
        boolean isColBig = n == col;
        long[] sum = new long[n + 1];
        int res = Integer.MIN_VALUE;
        long[] helper = new long[n + 1];
        for (int i = 0; i < m; ++i) {
            long[] preSum = new long[n];
            for (int j = i; j < m ; ++j) {
                long sub = Integer.MIN_VALUE;
                long curMax = Integer.MIN_VALUE;
                for (int p = 0; p < n; ++p) {
                    preSum[p] += isColBig ? matrix[j][p] : matrix[p][j];
                    sum[p + 1] = sum[p] + preSum[p];

                    sub = Math.max(sub + preSum[p], preSum[p]);
                    curMax = Math.max(curMax, sub);
                }
                if (curMax <= k) {
                    res = Math.max(res, (int) curMax);
                } else {
                    res = Math.max(res, mergeSort(sum, 0, n, k, helper));
                }
                if (res == k) {
                    return k;
                }
            }
        }
        return res;
    }
    
    private int mergeSort(long[] sum, int start, int end , int k, long[] helper) {
        if (start >= end) {
            return Integer.MIN_VALUE;
        }
        int mid = start + (end - start) / 2;
        int left = mergeSort(sum, start, mid, k, helper);
        if (left == k) {
            return k;
        }
        int right = mergeSort(sum, mid + 1, end, k, helper);
        if (right == k) {
            return k;
        }
        int l = start, r = mid + 1;
        int p = start, t = mid + 1;
        System.arraycopy(sum, start, helper, start, end - start + 1);
        int res = Math.max(left, right);
        while (l <= mid) {
            while (t <= end && helper[t] - helper[l] <= k) {
                t++;
            }
            if (t - 1 > mid) {
                res = Math.max(res, (int) (helper[t - 1] - helper[l]));
                if (res == k) {
                    return k;
                }
            }
            while (r <= end && helper[r] < helper[l]) {
                sum[p++] = helper[r++];
            }
            sum[p++] = helper[l++];
        }
        return res;
    }
    // min = min(m, n), max = max(m, n)
    // Time = O(min ^ 2 * max*log(max))
    // Space = O(max + log(max))
}
```
不得不赞叹 Merge Sort 真是太牛逼了。它的思想也值得借鉴。
