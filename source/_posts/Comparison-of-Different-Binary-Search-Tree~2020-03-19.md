---
title: Comparison of Different Binary Search Tree
hascode: true
hasmath: false
author: Hchyeria
description: 普通的二叉搜索树、AVL树、伸展树( Splay Tree)插入删除的效率比较。
tags:
  - Algorithm
  - Tree
date: September 2, 2019
abbrlink: 32481
---
这几天忙着做专业课程设计2。学习了很多有意思的算法和数据结构。在此记录一下。
这篇是关于 Binary Search Tree。
# BinarySearchTree
利用二叉搜索树的特点。左子树比节点小，右子树比节点大的原则。在每次插入操作时，比较需要插入的值与根节点的值，如果需要插入的值比根节点的值
小，则移到左子树，与左子树的根节点进行比较。反之，如果需要插入的值比根节点的值大，则向右移动，与右子树的根节点进行比较。如果相同，则什么也不
做之间返回。重复上述操作。直到已经到达了叶子节点，左右子树都为空。则根据需要插入的值与该叶子节点
的值的大小比较，加在左子树或者右子树下。
```python
# 定义一个 TreeNode 类 保存树的节点信息
# 包括自身的数值 和 左右孩子节点信息
class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left = None
        self.right = None

    def __repr__(self):
        return repr(self.val)


# 定义一个 BinarySearchTree 类
# 可以进行删除和插入操作
class BinarySearchTree:
    def __init__(self, root=None):
        self.root = root

    def insert(self, value: int):
        self.root = insert(value, self.root)

    def delete(self, value: int):
        self.root = delete(value, self.root)


# 插入函数
def insert(value: int, root):
    new_node = TreeNode(value)
    # 如果还没有根节点 让新插入的节点成为根节点
    if root is None:
        root = new_node
    else:
        # 如果已经有根节点
        # 让新插入的值与节点的值进行比较
        # 如果新插入的节点值小 指针向左孩子移动
        # 如果新插入的节点值大 指针向右孩子移动
        ptr = root
        # 缓存找到的新插入的节点的父节点用
        parent = None
        while ptr and new_node.val != ptr.val:
            parent = ptr
            ptr = ptr.left if new_node.val < ptr.val else ptr.right
        # 如果找到和新插入节点值相同的节点 则不继续执行直接返回
        if not ptr:
            # 没有相同的值
            # 如果新插入的节点的值小于父节点 则将其作为父节点的左孩子
            # 反之 则作为右孩子
            if new_node.val < parent.val:
                parent.left = new_node
            else:
                parent.right = new_node
    return root


# 删除函数
def delete(value: int, root):
    # 如果还没有根节点 直接返回
    if not root:
        return
    # 递归找到和指定的要删除的值相同的节点
    # 如果值比节点的值大 则指针向右移
    # 反之 则向左移
    if root.val < value:
        root.right = delete(value, root.right)
    elif root.val > value:
        root.left = delete(value, root.left)
    else:
        # 找到节点后 有三种情况
        # 1. 节点同时有左孩子和右孩子
        # 2. 节点只有一个孩子
        # 3. 节点没有孩子
        if root.left and root.right:
            # 如果是第1种情况 找到节点右孩子的最小的值 将这个值赋给节点 再将其删除
            current = root.right
            # 找到最小的节点
            while current.left:
                current = current.left
            root.right = delete(current.val, root.right)
            root.val = current.val
        else:
            # 如果是后2种情况
            # 只有一个子树 则让其的根节点成为节点
            # 没有孩子 直接赋为 None
            root = root.left if root.left else root.right
    return root
```

# AVLTree
AVLTree 比普通二叉搜索树，除了满足左子树比根节点小，右子树比根节点大的原则外，还要求每个节点都要保持平衡。因此在插入和删除操作时，需要检
查是否保持平衡，否则进行旋转调整。进行旋转额外开销了时间。但是能让查找的平均时间复杂度降低到 O（log n）左右。检查是否平衡，以及进行旋转操作是程序设计的核心也是难点。由于需要保证每个节点的高度平衡，故这里用到了递归的方法，来保证每个节点的平衡。但是递归有个缺点就是，如果插入的节点已经存在，还是需要递归栈的调用。
```python
# 定义一个 TreeNode 类 保存树的节点信息
# 包括自身的数值 和 左右孩子节点信息
# 额外一个 height 信息 因为需要判断树是否平衡
class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left = None
        self.right = None
        self.height = 0


# 定义一个 AVLTree 类
# 可以进行删除和插入操作
class AVLTree:
    def __init__(self, root=None):
        self.root = root

    def insert(self, value):
        self.root = insert(value, self.root)

    def delete(self, value: int):
        self.root = delete(value, self.root)


# 获取高度的函数 空子树为 -1 之后往上逐渐加1
def get_height(node):
    return -1 if not node else node.height


# 返回 左子树与右子树 高度之差
def check_height(node):
    if node.left and node.right:
        return get_height(node.left) - get_height(node.right)
    elif node.left:
        return get_height(node.left) + 1
    elif node.right:
        return -(get_height(node.right) + 1)
    return 0


# 更新高度信息
def upload_height(node):
    node.height = max(get_height(node.left), get_height(node.right)) + 1


# 右旋
# 左子树与节点交换 左子树的右子树变成节点的左子树
# 更新左子树与节点的高度
def rotate_with_left(node):
    left_child = node.left
    node.left = left_child.right
    left_child.right = node
    upload_height(node)
    upload_height(left_child)
    return left_child


# 左旋
# 右子树与节点交换 右子树的左子树变成节点的右子树
# 更新右子树与节点的高度
def rotate_with_right(node):
    right_child = node.right
    node.right = right_child.left
    right_child.left = node
    upload_height(node)
    upload_height(right_child)
    return right_child


# 先左旋再右旋
# 出现在节点的右子树的左子树高出一截
def double_rotate_left(node):
    node.left = rotate_with_right(node.left)
    return rotate_with_left(node)


# 先右旋再左旋
# 出现在节点的左子树的右子树高出一截
def double_rotate_right(node):
    node.right = rotate_with_left(node.right)
    return rotate_with_right(node)


# 检查是否不平衡 需要旋转
def rotate(node):
    # 空节点直接返回
    if not node:
        return
    # 获取节点左子树与右子树高度之差
    point = check_height(node)
    # 如果平滑 只需要更新高度信息
    if abs(point) < 2:
        upload_height(node)
    # 左子树比右子树高
    elif point == 2:
        # 再检查左子树的 左子树与右子树的高度查
        # 如果左子树的 右子树高 应该进行双旋转
        if check_height(node.left) == -1:
            node = double_rotate_left(node)
        else:
            # 否则 只需要一次右旋
            node = rotate_with_left(node)
    # 右子树比左子树高
    elif point == -2:
        # 再检查右子树的 左子树与右子树的高度查
        # 如果右子树的左子树高 应该进行双旋转
        if check_height(node.right) == 1:
            node = double_rotate_right(node)
        else:
            # 否则 只需要一次左旋
            node = rotate_with_right(node)
    return node


# 插入函数
def insert(value, node):
    # 如果不存在次节点 直接将新节点作为次节点
    if not node:
        return TreeNode(value)
    # 递归插入
    # 值比节点大 递归右子树
    # 反之 递归左子树
    if node.val < value:
        node.right = insert(value, node.right)
    if node.val > value:
        node.left = insert(value, node.left)
    # 检查是否平衡
    return rotate(node)


# 删除操作时 如果同时有左子树和右子树
# 可以找到左子树最大的节点 和 右子树最小的节点 与要删除的节点进行替换
# 到底应该找哪个 需要在不破坏的平衡的条件下 判断最高的那边
# 寻找合适的删除节点
def find_replace_node(node):
    # 左边高 找左子树最大的节点
    if check_height(node) > 0:
        current = node.left
        while current.right:
            current = current.right
    # 否则 右子树最小的节点
    else:
        current = node.right
        while current.left:
            current = current.left
    return current


# 删除函数
def delete(value, node):
    # 递归找到 与值相同的节点
    if not node:
        return
    if node.val < value:
        node.right = delete(value, node.right)
    elif node.val > value:
        node.left = delete(value, node.left)
    else:
        # 如果同时有左右子树
        # 找到不破坏平衡的节点 删除
        if node.left and node.right:
            target = find_replace_node(node)
            node = delete(target.val, node)
            node.val = target.val
        else:
            node = node.left if node.left else node.right
        # 检查是否平衡
    return rotate(node)
```
# 伸展树(Splay Tree)
伸展树是二叉查找树的一种改进数据结构。它考虑到局部性原理，为了使整个查找时间更小，需要每次查找节点之后对树进行重构，把被查找的节点搬移到
树根进行自调整。所有基本操作的平均复杂度仍为 O（log n）。伸展树程序实现的核心在于‘伸展’ 即需要将查找过的节点向上旋转到根节点。
```python
# 定义一个 TreeNode 类 保存树的节点信息
# 包括自身的数值 和 左右孩子节点 父节点信息
class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left = self.right = self.parent = None


# 定义一个 BinarySearchTree 类
# 可以进行删除 插入 和 查找操作
# 其中都需要将目标节点旋转到根节点
class SplayTree:
    def __init__(self, root=None):
        self.root = root

    # 查找函数
    def find(self, value):
        current = self.root
        # 找到相同的或者到边缘 停止循环
        if not current:
            return
        while True:
            if current.val > value:
                if not current.left:
                    break
                current = current.left
            elif current.val < value:
                if not current.right:
                    break
                current = current.right
            else:
                break
        # 将该节点伸展到根节点
        self.root = splay(self.root, current)
        # 返回是否找到
        return current.val == value

    def insert(self, value: int):
        self.root = insert(self.root, value)

    def delete(self, value: int):
        # 删除之前 先找一下是否存在 并且伸展该节点
        if not self.find(value):
            return
        self.root = delete(self.root)

    def merge(self, tree):
        self.root = merge(self.root, tree)
        return self


# 旋转函数 左旋和右旋
def rotate(root, node):
    p = node.parent
    if not p:
        return root
    # 如果节点是父节点的左孩子
    # 右旋
    if p.left == node:
        p.left = temp = node.right
        node.right = p
    else:
        # 否则 左旋
        p.right = temp = node.left
        node.left = p
    # 改变父节点的指向
    node.parent = p.parent
    p.parent = node
    temp.parent = p
    # 改变父亲的父亲的孩子指向
    if node.parent:
        if node.parent.left == p:
            node.parent.left = node
        else:
            node.parent.right = node
    return root


# 伸展函数
# 把目标节点伸展到根节点
def splay(root, node):
    # 如果不是根节点 继续伸展
    while node.parent:
        p = node.parent
        g = p.parent
        # 如果存在爷爷 需要进行两次旋转
        if g:
            # 如果 父亲和节点和同在一侧 即父亲是爷爷的左孩子 节点的父亲的左孩子
            # 或者 父亲是爷爷的右孩子 节点的父亲的右孩子 则先旋转父亲再旋转节点
            # 如果不是在同一侧
            # 节点需要进行两次旋转
            root = rotate(root, p if (p == g.left) == (node == p.left) else node)
        root = rotate(root, node)
    return root


# 插入函数
def insert(root, value):
    current = root
    node = None
    # 如果还没有根节点 将新插入的节点作为根节点
    if not current:
        root = node
        return root
    # 循环找到合适的插入位置
    while True:
        # 值小于节点值 向左移 反之 向右移
        if current.val > value:
            # 如果左孩子已经为空了 找到位置 中断循环
            if not current.left:
                # 插入到左子树
                node = TreeNode(value)
                current.left = node
                node.parent = current
                # 伸展该节点
                root = splay(root, node)
                break
            # 如果还存在左子树 再继续找位置
            current = current.left
        if current < value:
            # 如果右孩子已经为空了 找到位置 中断循环
            if not current.right:
                # 插入到右子树
                node = TreeNode(value)
                current.right = node
                node.parent = current
                # 伸展该节点
                root = splay(root, node)
                break
            # 如果还存在右子树 再继续找位置
            current = current.right
    return root


# 删除函数
def delete(root):
    # 如果存在的前提下
    # 该节点已经伸展到根节点了
    ptr = root
    # 如果同时有左孩子和右孩子
    # 将左子树的根节点作为新的根节点
    # 找到左子树最大的节点
    if ptr.left and ptr.right:
        left_node = ptr.left
        root = left_node
        while left_node.right:
            left_node = left_node.right
        # 将原来根节点的右子树 变成次节点的右子树
        left_node.right = ptr.right
        ptr.right.parent = left_node
    else:
        root = ptr.left if ptr.left else ptr.right
    root.parent = None
    return root


# 因为第二题会用到合并两个集合 所以增加了一个 merge 函数
def merge(root, tree):
    if not root and not tree:
        return
    if not tree or root:
        return root if root else tree.root
    tree = tree.root
    ptr = root
    while True:
        if tree.val < root.val:
            if not ptr.left:
                ptr.left = tree
                tree.parent = ptr
                root = splay(root, tree)
                break
            ptr = ptr.left
        else:
            if not ptr.right:
                ptr.right = tree
                tree.parent = ptr
                root = splay(root, tree)
                break
            ptr = ptr.right
    return root
```
# Test
要求测试对N个不同整数进行下列操作的效率：
* 按递增顺序插入N个整数，并按同样顺序删除
* 按递增顺序插人N个整数，并按相反顺序删除
* 按随机顺序插入N个整数，并按随机顺序删除
要求N从1000到10000取值，并以数据规模N为横轴，运行时间为纵轴，画出3种不同数据结构对应的操作效率比较图。

# Conclusion
三种二叉查找树都是比较典型的。其中普通的二叉搜索树，缺点比较明显，就是在呈递增插入节点的时候，节点始终比较前一个大，就会造成没有左子树。
二叉树实际上就会退化成数组。当递增删除的时候，每次删除的恰好是根节点，所以速度比较快。但是，当倒过来删除的时候，为了找到该节点，指针会一直顺
着右子树往下移，直到移到最后一个。这种操作是非常费时间的，随着数据规模的增长愈发明显。三种情况下，随机插入和删除的效率比较好。
AVL 平衡树相比普通二叉平衡树，能够让树的高度不超过（logn2）+ 1。能够有效的发挥二叉搜索树的优势，每次查找的平均复杂度O（log n）。但是，相应的，
必须为保持平衡付出相应的代价，每次插入和删除都要检查并且进行旋转操作费时。当进行随机插入和删除试，优势不是很明显。伸展树应该试表现最好的。每次查找的节点，都会被伸展到根节点。无论是递增还是反过来，下一个元素都紧挨着上一个元素。而上一个元素已经被移到根节点，下一个元素就能够好操作了。在随机插入和删除时，局部性原理优势有所下降。

[Github 源码地址](https://github.com/Hchyeria/some-data-structure-and-algorithm)