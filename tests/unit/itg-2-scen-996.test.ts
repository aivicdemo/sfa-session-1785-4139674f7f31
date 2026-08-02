import { recordOperationLogs } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-996: 購買結果記録・営業データ統合機能 - 操作ログに複数件記録される場合に全ての監査証跡が記録される", async () => {
    const inputLogs = [
      {
        userId: "user_001",
        operationType: "CREATE",
        timestamp: "2024-01-15T10:30:00Z",
        changeContent: "顧客マスタ新規作成: 顧客ID=CUST_0001",
      },
      {
        userId: "user_002",
        operationType: "UPDATE",
        timestamp: "2024-01-15T10:45:00Z",
        changeContent: "顧客情報更新: 顧客ID=CUST_0002, 住所変更",
      },
      {
        userId: "user_003",
        operationType: "MERGE",
        timestamp: "2024-01-15T11:00:00Z",
        changeContent: "重複顧客統合: CUST_0003とCUST_0004を統合",
      },
    ];

    const result = await recordOperationLogs(inputLogs);

    expect(result.recordedCount).toBe(3);
    expect(result.logs).toHaveLength(3);

    result.logs.forEach((log, index) => {
      expect(log.userId).toBe(inputLogs[index].userId);
      expect(log.operationType).toBe(inputLogs[index].operationType);
      expect(log.timestamp).toBe(inputLogs[index].timestamp);
      expect(log.changeContent).toBe(inputLogs[index].changeContent);
      expect(log.auditId).toBeDefined();
      expect(typeof log.auditId).toBe("string");
      expect(log.auditId.length).toBeGreaterThan(0);
    });

    const auditIds = result.logs.map((log) => log.auditId);
    const uniqueAuditIds = new Set(auditIds);
    expect(uniqueAuditIds.size).toBe(3);
  });
});