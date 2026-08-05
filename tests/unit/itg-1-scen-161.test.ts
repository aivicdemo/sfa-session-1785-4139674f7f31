import { extractStagesFromProcessDefinition } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-161
  test("[normal] 営業プロセス標準書のシステム要件変換機能 - 営業プロセス標準書から0個のステージを抽出して、空のステージリストが生成される", () => {
    const mockProcessDefinition = {
      id: "proc_001",
      name: "営業プロセス標準書",
      version: "1.0",
      stages: [],
      createdAt: new Date("2024-01-15T11:00:00Z"),
      updatedAt: new Date("2024-01-15T11:00:00Z"),
    };

    const result = extractStagesFromProcessDefinition(mockProcessDefinition);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});