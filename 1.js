function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 月份从0开始
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 示例：
// 1751617572000
const ts = 1751617572000; // 当前时间戳（毫秒）
console.log (ts)
console.log(formatTimestamp(ts)); // 输出示例：2025-07-04 16:25:18
