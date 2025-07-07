import { ElMessage } from "element-plus";

export interface Instruction {
    id?: number;
    keys: string | string[];
    functions: string;
    remarks?: string;
    last_used_time: number | null;
}

function getLocalTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

export async function getInstructions(): Promise<Instruction[]> {
    try {
        const instructions = await (window as any).api.safeQuery(
            "SELECT * FROM instructions ORDER BY last_used_time DESC",
            []
        );
        return instructions || [];
    } catch (error) {
        ElMessage.error("查询指令失败");
        throw error;
    }
}

export async function addInstruction(
    instruction: Omit<Instruction, "id">
): Promise<number> {
    try {
        const timestamp = getLocalTimestamp();
        const keysStr = Array.isArray(instruction.keys)
            ? instruction.keys.join("+")
            : instruction.keys;
        const result = await (window as any).api.safeQuery(
            `INSERT INTO instructions (keys, functions, remarks, last_used_time) VALUES (?, ?, ?, ?)`,
            [keysStr, instruction.functions, instruction.remarks || null, timestamp]
        );
        ElMessage.success({
            message: "添加指令成功",
            duration: 1000,
        });
        return result.lastInsertRowid;
    } catch (error) {
        ElMessage.error("添加指令失败");
        throw error;
    }
}

export async function updateInstruction(
    instruction: Instruction
): Promise<void> {
    try {
        const timestamp = getLocalTimestamp();
        const keysStr = Array.isArray(instruction.keys)
            ? instruction.keys.join("+")
            : instruction.keys;

        await (window as any).api.safeQuery(
            `UPDATE instructions SET keys = ?, functions = ?, remarks = ?, last_used_time = ? WHERE id = ?`,
            [
                keysStr,
                instruction.functions,
                instruction.remarks || null,
                timestamp,
                instruction.id,
            ]
        );
        ElMessage.success({
            message: "更新指令成功",
            duration: 1000,
        });
    } catch (error) {
        ElMessage.error("更新指令失败");
        throw error;
    }
}

export async function deleteInstruction(id: number): Promise<void> {
    try {
        await (window as any).api.safeQuery(
            `DELETE FROM instructions WHERE id = ?`,
            [id]
        );
        ElMessage.success({
            message: "删除指令成功",
            duration: 1000,
        });
    } catch (error) {
        ElMessage.error("删除指令失败");
        throw error;
    }
}

export async function batchImportInstructions(
    instructions: Instruction[]
): Promise<void> {
    try {
        await (window as any).api.safeQuery("BEGIN TRANSACTION", []);

        for (const instruction of instructions) {
            const timestamp = instruction.last_used_time || getLocalTimestamp();
            const keysStr = Array.isArray(instruction.keys)
                ? instruction.keys.join("+")
                : instruction.keys;
            await (window as any).api.safeQuery(
                `INSERT INTO instructions (keys, functions, remarks, last_used_time) VALUES (?, ?, ?, ?)`,
                [keysStr, instruction.functions, instruction.remarks || null, timestamp]
            );
        }

        await (window as any).api.safeQuery("COMMIT", []);
        ElMessage.success({
            message: `成功导入 ${instructions.length} 个指令`,
            duration: 1000,
        });
    } catch (error) {
        await (window as any).api.safeQuery("ROLLBACK", []);
        ElMessage.error("批量导入失败");
        throw error;
    }
}

export async function copyToClipboard(content: string): Promise<void> {
    try {
        await (window as any).api.writeToClipboard(content);
        ElMessage.success({
            message: "已复制到剪贴板",
            duration: 1000,
        });
    } catch (error) {
        ElMessage.error("复制失败");
        throw error;
    }
}

export async function pasteFromClipboard(): Promise<string> {
    try {
        const content = await (window as any).api.readFromClipboard();
        return content;
    } catch (error) {
        ElMessage.error("粘贴失败");
        throw error;
    }
}
