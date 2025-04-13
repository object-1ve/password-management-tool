// 查询密码数据
export async function getPasswords() {
    try {
    console.log("Fetching passwords...");
    const passwords = await (window as any).api.safeQuery(
        'SELECT * FROM passwords ORDER BY updateTime DESC', 
        []
    );
    console.log('Passwords:', passwords);
    return passwords || [];
    } catch (error) {
    console.error('查询密码失败:', error);
    throw error;
    }
}

function getLocalTimestamp(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0'); // 补零函数
    
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` + 
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 插入新密码（带自定义时间格式）
export async function insertPassword(passwordData: {
    username: string,
    password: string,
    url?: string,
    remark?: string
}) {
    try {
    const timestamp = getLocalTimestamp();  // 使用新时间格式
    
    const result = await (window as any).api.safeQuery(
        `INSERT INTO passwords 
        (username, password, url, remark, updateTime, createTime)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
        passwordData.username,
        passwordData.password,
        passwordData.url || null,
        passwordData.remark || null,
        timestamp,  // updateTime
        timestamp   // createTime
        ]
    );
    
    console.log('插入成功，ID:', result.lastInsertRowid);
    return result;
    } catch (error) {
    console.error('插入失败:', error);
    throw error;
    }
}

export async function deletePassword(id:string) {
    try {    
    const result = await (window as any).api.safeQuery(
        `DELETE FROM passwords WHERE id = ?`,
        [
            id,  
        ]
    );
    
    console.log('删除成功，ID:', result);
    return result;
    } catch (error) {
    console.error('删除失败:', error);
    throw error;
    }
}

export async function updatePassword(id: string, passwordData: {
    username: string,
    password: string,
    url?: string,
    remark?: string,
    updateTime?: string
}) {
    try {
        const timestamp = getLocalTimestamp();  // 使用统一的时间格式
        
        const result = await (window as any).api.safeQuery(
            `UPDATE passwords SET 
                username = ?, 
                password = ?, 
                url = ?, 
                remark = ?, 
                updateTime = ?
            WHERE id = ?`,
            [
                passwordData.username,
                passwordData.password,
                passwordData.url || null,
                passwordData.remark || null,
                timestamp,
                id
            ]
        );
        
        console.log('更新成功，ID:', id);
        return result;
    } catch (error) {
        console.error('更新失败:', error);
        throw error;
    }
}
export async function importFromTxtFile(filePath: string) {
    const content = await (window as any).api.readFile(filePath, 'utf-8')
    return content
}
export async function insertPasswordFromTextFile(passwordData:{
    username: string,
    password: string,
    url?: string,
    remark?: string,
    updateTime?: string,
    createTime?: string
}) {
    try {
    // const timestamp = getLocalTimestamp();  // 使用新时间格式
    
    const result = await (window as any).api.safeQuery(
        `INSERT INTO passwords 
        (username, password, url, remark, updateTime, createTime)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
        passwordData.username,
        passwordData.password,
        passwordData.url || null,
        passwordData.remark || null,
        passwordData.updateTime,  
        passwordData.createTime
        ]
    );
    
    console.log('插入成功，ID:', result.lastInsertRowid);
    return result;
    } catch (error) {
    console.error('插入失败:', error);
    throw error;
    }
}
// export async function writeToClipboard(text: string) {
//     try {
//         await (window as any).api.writeToClipboard(text);
//         console.log('复制成功:', text);
//         return true;
//     } catch (error) {
//         console.error('复制失败:', error);
//         throw error;
//     }
// }