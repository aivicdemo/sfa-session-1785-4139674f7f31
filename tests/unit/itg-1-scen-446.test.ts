import { analyzeCustomerContactPatterns } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-446
  test("顧客対応記録が1件のみ入力された場合、1件のパターンが標準プロセスと比較される", () => {
    const salesPersonId = "SP001";
    const contactRecords = [
      {
        customerId: "C001",
        customerName: "A社",
        contactDateTime: new Date("2024-01-15T10:00:00Z"),
        contactContent: "初回提案",
        result: "次回アポ予定",
      },
    ];

    const standardProcess = [
      "初回接触",
      "ニーズ確認",
      "提案",
      "クローズ",
    ];

    const result = analyzeCustomerContactPatterns({
      salesPersonId,
      contactRecords,
      standardProcess,
    });

    expect(result.analysisCount).toBe(1);
    expect(result.currentStage).toBe("初回提案段階");
    expect(result.progressPercentage).toBe(25);
    expect(result.completedStages).toBe(1);
    expect(result.totalStages).toBe(4);
    expect(result.recommendedNextAction).toBe("ニーズ確認の実施");
  });
});