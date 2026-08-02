import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-268
  test("統合判定履歴が複数件のとき、全ての履歴が判定結果に反映される", () => {
    const customerA = {
      id: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
    };

    const customerB = {
      id: "CUST-002",
      name: "山田太郎",
      email: "yamada@example.com",
    };

    const integrationHistory = [
      {
        judgmentDateTime: new Date("2024-01-10T10:00:00Z"),
        judgmentStatus: "重複の可能性あり",
        similarityScore: 85,
        judgedBy: "担当者A",
      },
      {
        judgmentDateTime: new Date("2024-01-15T14:30:00Z"),
        judgmentStatus: "重複確定",
        similarityScore: 85,
        judgedBy: "担当者B",
      },
      {
        judgmentDateTime: new Date("2024-01-20T09:15:00Z"),
        judgmentStatus: "統合完了",
        similarityScore: 85,
        judgedBy: "マネージャーC",
      },
    ];

    const result = detectDuplicateCustomers(
      customerA,
      customerB,
      integrationHistory
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.judgmentHistories).toHaveLength(3);

    expect(result.judgmentHistories[0]).toEqual({
      judgmentDateTime: new Date("2024-01-10T10:00:00Z"),
      judgmentStatus: "重複の可能性あり",
      similarityScore: 85,
      judgedBy: "担当者A",
    });

    expect(result.judgmentHistories[1]).toEqual({
      judgmentDateTime: new Date("2024-01-15T14:30:00Z"),
      judgmentStatus: "重複確定",
      similarityScore: 85,
      judgedBy: "担当者B",
    });

    expect(result.judgmentHistories[2]).toEqual({
      judgmentDateTime: new Date("2024-01-20T09:15:00Z"),
      judgmentStatus: "統合完了",
      similarityScore: 85,
      judgedBy: "マネージャーC",
    });

    expect(result.finalStatus).toBe("統合完了");
  });
});