import time

# timestamp = int(time.time())
# print(timestamp)
timestamp = 1751617572

# 转换为本地时间的结构化对象
local_time = time.localtime(timestamp)

# 格式化为字符串（年-月-日 时:分:秒）
formatted_time = time.strftime("%Y-%m-%d %H:%M:%S", local_time)

print(formatted_time)  # 输出：2025-07-04 15:12:30（根据时区可能有差异）