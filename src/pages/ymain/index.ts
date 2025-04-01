

async function getData() {
try {
    console.log("Fetching data...");
    const users = await (window as any).api.safeQuery(
    'SELECT * FROM users ORDER BY id DESC', []
    );
    console.log('Users:', users);
    return users;
} catch (error) {
    console.error('查询数据失败:', error);
    throw error; // 或者返回空数组/默认值
}
}

// 确保DOM加载完成后再绑定事件
document.addEventListener('DOMContentLoaded', () => {
const btn = document.getElementById('queryDataBtn');
if (btn) {
    btn.addEventListener('click', async () => {
    try {
        await getData();
    } catch {
        alert('查询数据失败，请检查控制台');
    }
    });
} else {
    console.warn('未找到查询按钮');
}
});