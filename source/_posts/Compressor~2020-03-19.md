---
title: Compressor Algorithm
hascode: true
hasmath: false
author: Hchyeria
description: 压缩技术领域的 Huffman 算法和 LZ77 算法
tags:
  - Algorithm
date: June 9, 2019
abbrlink: 62841
---
博主最近完成了程序设计实践3。选择的题目是编写一个压缩软件。借此机会学习了Huffman 算法和 LZ77 算法。

## Huffman 压缩算法
### Huffman 编码介绍
Huffman编码就是一种效率很高的编码方式，该方法完全依据字符出现概率来构造异字头的平均长度最短的码字。
相比较使用固定长度的**定长编码**方式，使用**变长的编码**方式能够节省很多空间。而使用变长编码可能会导致歧义，比如字母 a 用0表示，字母b用1表示，字母 c 用01表示，那么 abc 可以表示为0101，而0101可以解析成 cab，abab，这就会引起分歧。于是又引入了**前缀码**的概念。前缀码定义：任何一个字符的编码都不能是其它任何字符的编码的前缀。Huffman 编码就是一种能够使用最短的位数来编码文件的前缀码 。
Huffman编码需要牺牲一部分体积来储存 Huffman 编码树的信息。
### 如何构建 Huffman 编码树
Huffman 编码为每个字母分配编码，编码长度取决于在被压缩文件中对应字母的出现的频率，也就是权重（weight）。Huffman 编码树是满二叉树，有最小外部路径权重。每一个叶节点对应于一个字母，叶节点的权重就是对应的字母出现的频率。下图将解释一下什么是最小外部路径权重，并且 Huffman 编码的过程。
<div align=center><img class="post-img-big" src="/posts/62841/1.png" />
<div align=center class="img-undertext">最小外部路径权重<div class="img-undertext-divi">

构建Huffman编码树的算法过程：
1. 创建n个初始化的 Huffman 树（只有一个叶子点），叶节点纪录对应的字母和该字母出现的频率（weight）
2. 按照 weight 从小到大对所有的Huffman树进行排序，取出其中 weight 最小的两棵树，构造一个新的 Huffman树，新的 Huffman 树的 weight 等于两棵子树的 weight 之和，然后再加入到原来的 Huffman 树数组当中
3. 反复上面的ii操作，直到该数组当中只剩下一棵Huffman树，那么最后剩下来的那棵 Huffman 树就是我们构造好的Huffman编码树
<div align=center><img class="post-img-big" src="/posts/62841/2.png" />
<div align=center class="img-undertext">构建过程<div class="img-undertext-divi">

## LZ77 压缩算法
### 几个术语介绍
lookahead buffer 等待编码的区域。search buffer 已经编码的区域，搜索缓冲区。滑动窗口指定大小的窗，包含“搜索缓冲区”（左） + “待编码区”（右）。游标 cursor 编码位置
### 编码过程
**主要步骤：**
1. 设置游标为输入流的开始
2. 在待编码区查找搜索缓冲区中的最大匹配字符串
3. 如果匹配命中，输出(偏移值, 匹配长度)，窗口向前滑动匹配长度大小
4. 如果没有匹配未命中，输出(0, 0, 待编码区的第一个字符)，窗口向前滑动一个单位
5. 如果待编码区不为空，回到步骤2

```python
import math
from bitarray import bitarray


class LZ77Compressor:

    # 设置 window_size 上限
    MAX_WINDOW_SIZE = 400
    # 保存输出流`
    output_buffer = None

    def __init__(self, window_size=20):
        # 初始化需要传入 window_size 参数 默认为20
        self.window_size = min(window_size, self.MAX_WINDOW_SIZE)
        # 待匹配窗口大小
        self.lookahead_buffer_size = 15

    def canculateRate (self, input_file_path, debug=False):
        print("Canculateing LZ77......")
        # 获取文件名称 类型(扩展名)
        input_file_name, input_file_type = input_file_path.split('/')[-1].split('.')
        # 游标位置
        i = 0
        # 定义输出 bitarray 流
        output_buffer = bitarray(endian='big')

        # 读取文件
        try:
            with open(input_file_path, 'rb') as input_file:
                data = input_file.read()
        except IOError:
            print('Could not open input file ...')
            raise
        input_file.close()
        # 获取文件总字节数
        pre_len = len(data)
        # 标识文件是用何种压缩算法 h 代表 Huffman l 代表 LZ77
        output_buffer.frombytes('l'.encode('utf-8'))
        # 储存文件的扩展名信息
        output_buffer.frombytes(input_file_type.encode('utf-8'))
        # 补充扩展名信息到 4 bytes
        while len(output_buffer) < 40:
            output_buffer.frombytes(b'0')
        # 当游标没有超出总字节数范围 继续编码
        while i < pre_len:
            # 调用 findLongestMatch() 返回 最长匹配的 偏移量 和 长度 信息
            match = self.findLongestMatch(data, i)

            if match:
                # 添加 1 bit flag 信息为 b'1' 代表匹配命中 12 bits 偏移量信息 4 bits 长度信息
                # 这里为了节约空间 待匹配窗口大小 self.lookahead_buffer_size 已经定义为 15 那么长度信息 4 bits 就够用了
                # 剩余的 4 bits 可以分配给 偏移量信息 使用 节省空间

                (longestMatchDistance, longestMatchLength) = match
                output_buffer.append(True)
                output_buffer.frombytes((longestMatchDistance >> 4).to_bytes(1, byteorder='big'))
                output_buffer.frombytes((((longestMatchDistance & 0x0f) << 4) | longestMatchLength).to_bytes(1, byteorder='big'))

                if debug:
                    print("<1, %i, %i>" % (longestMatchDistance, longestMatchLength))
                # 游标移动匹配的长度
                i += longestMatchLength

            else:
                # 添加 1 bit flag 信息为 b'0' 代表匹配未命中 跟着 8 bits 的未匹配字符信息
                output_buffer.append(False)
                output_buffer.frombytes(data[i].to_bytes(1, byteorder='big'))
                # 如果 debug=True 打印调试信息
                if debug:
                    print("<0, %s>" % data[i])
                # 游标移动 1 个单位
                i += 1

        # 用 0 填充 output_buffer 使它成为8的倍数
        output_buffer.fill()
        # 保留self.output_buffer属性 以便 compress() 函数使用
        self.output_buffer = output_buffer
        # 返回压缩率
        after_len = len(output_buffer)
        fraction = (after_len / (pre_len*8)) * 100
        return fraction

    def compress(self, input_file_path, output_file_path=None):
        print("Compressing ......")
        # 获取文件名称 类型(扩展名)
        input_file_name, input_file_type = input_file_path.split('/')[-1].split('.')
        # 如果没有计算过并且保留self.output_buffer输出流 则执行canculateRate操作
        if not self.output_buffer:
            self.canculateRate(input_file_path)
        # 写入文件 如果提供了 output_file_path 就在提供的 output_file_path 下写入 如果没有就同在 input_file_path 当前目录下写入文件
        if output_file_path:
            output_file_path_final = output_file_path + (
                "" if output_file_path[-1] == "/" else "/") + input_file_name + ".hchy"
        else:
            output_file_path_final = '/'.join(input_file_path.split('/')[0:-1]) + "/" + input_file_name + ".hchy"
        try:
            with open(output_file_path_final, 'wb') as output_file:
                output_file.write(self.output_buffer.tobytes())
                print("File was LZ77 compressed successfully and saved to output path %s" % output_file_path_final)
                # 输出成功 关闭输出流
                output_file.close()
                return None
        except IOError:
            print('Eroor! Could not write to output file path %s' % output_file_path_final)
            raise

    def decompress(self, input_file_path, output_file_path=None):
        print("Decompressing ......")
        # 获取文件名称 类型(扩展名)
        input_file_name, input_file_type = input_file_path.split('/')[-1].split('.')
        # 如果类型(扩展名)不是 hchy 则不是本软件压缩的文件无法解压缩
        if input_file_type == "hchy":
            # 定义读取文件的 bitarray 流
            data = bitarray(endian='big')
            # 定义输出流
            output_buffer = []

            # 读取文件
            try:
                with open(input_file_path, 'rb') as input_file:
                    data.fromfile(input_file)
            except IOError:
                print('Could not open input file ...')
                raise
            # 删除前面 1 byte 记录压缩算法类型的信息
            del data[0:8]
            # 取出前面 4 bytes 的扩展名信息 再删除
            type_byte = data[0:32].tobytes()
            del data[0:32]
            type_name = type_byte.decode('utf-8')
            # 除去不需要的为了填充为 4 bytes 的 0字符信息
            raw_index = type_name.find('0')
            if raw_index >= 0:
                type_name = type_name[0:raw_index]
            # 获取文件总的bit数
            pre_len = len(data)
            # 当大于 1 byte 继续解码
            while len(data) >= 9:
                # 打印解压进度消息
                process = ((pre_len - len(data))/pre_len)*100
                print("process %.2f%% ..." % process)
                # 取出标志匹配是否命中的标志位 若未命中 直接写入后面的 8 bits 字符信息
                # 若命中 则根据 12 bits 偏移量 和 4 bits 长度 信息 获取字符信息
                flag = data.pop(0)

                if not flag:
                    # 写入后面的 8 bits 字符信息 再删除
                    byte = data[0:8].tobytes()
                    output_buffer.append(byte)
                    del data[0:8]
                else:
                    # 获取后面的 两个 Bytes 再删除
                    byte1 = int.from_bytes(data[0:8].tobytes(), "big")
                    byte2 = int.from_bytes(data[8:16].tobytes(), "big")
                    del data[0:16]

                    # 偏移处理 获取 偏移量 和 长度 信息
                    distance = (byte1 << 4) | (byte2 >> 4)
                    length = (byte2 & 0x0f)

                    for i in range(length):
                        output_buffer.append(output_buffer[-distance])
            # 连接 bytes list
            out_data = b''.join(output_buffer)
            # 输出文件 如果提供了 output_file_path 就在提供的 output_file_path 下写入 如果没有就同在 input_file_path 当前目录下写入文件
            if output_file_path:
                output_file_path_final = output_file_path + ("" if output_file_path[-1] == "/" else "/") + input_file_name+ "." + type_name
            else:
                output_file_path_final = '/'.join(input_file_path.split('/')[0:-1]) + "/" + input_file_name + "." + type_name
            try:
                with open(output_file_path_final, 'wb') as output_file:
                    output_file.write(out_data)
                    print('File was decompressed successfully and saved to output path %s' % output_file_path_final)
                    # 输出成功 关闭输出流
                    output_file.close()
                    return None
            except IOError:
                print('Could not write to output file path %s' % output_file_path_final)

                raise
        else:
            print("Error file type! It isn't .hchy. So can't be decompressed")

    def findLongestMatch(self, data, current_position):
        """
        获取最大匹配字符串函数
        """
        # 待匹配字符串末端
        end_of_buffer = min(current_position + self.lookahead_buffer_size, len(data) + 1)

        long_match_distance = -1
        long_match_length = -1

        # 只有子字符串长度大于等于 2 才执行
        # 因为 未命中的 8 bits 压缩比 16 bits 的要好
        for j in range(current_position + 2, end_of_buffer):

            start_index = max(0, current_position - self.window_size)
            # 待匹配的子字符串
            substring = data[current_position:j]

            for i in range(start_index, current_position):
                # 可能会重复匹配 当待匹配的子字符串长度大于游标位置与偏移量指针距离
                repetitions = int(len(substring) / (current_position - i))
                # 重复匹配完后剩下的 也是没有重复匹配情况下的
                last = len(substring) % (current_position - i)
                # 匹配到的字符串
                matched_string = data[i:current_position] * repetitions + data[i:i + last]
                # 匹配成功 不断更新最大值
                if matched_string == substring and len(substring) > long_match_length:
                    long_match_distance = current_position - i
                    long_match_length = len(substring)
        # 匹配成功 返回 偏移量 和 长度 信息
        if long_match_distance > 0 and long_match_length > 0:
            return long_match_distance, long_match_length
        return None

```

## 源码
[Github 源码地址](https://github.com/Hchyeria/Compressor-software)
