import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-704: 営業活動ログ内の活動日時が null のとき時系列分析がエラーになる", () => {
    // Arrange: 営業担当者ID「SA001」のテストデータを準備
    const salesRepId = "SA001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");

    // 営業活動ログテーブルのレコード: レコード1は活動日時=2024-01-15、レコード2は活動日時=null、レコード3は活動日時=2024-01-20
    const salesActivityLogs = [
      {
        id: "LOG001",
        salesRepId: "SA001",
        activityDateTime: new Date("2024-01-15T10:00:00Z"),
        activityType: "visit",
        customerId: "CUST001",
        description: "Initial contact"
      },
      {
        id: "LOG002",
        salesRepId: "SA001",
        activityDateTime: null,
        activityType: "phone_call",
        customerId: "CUST002",
        description: "Follow-up call"
      },
      {
        id: "LOG003",
        salesRepId: "SA001",
        activityDateTime: new Date("2024-01-20T14:30:00Z"),
        activityType: "proposal",
        customerId: "CUST001",
        description: "Proposal submission"
      }
    ];

    // Act & Assert: 関数呼び出しでエラーが発生することを検証
    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        salesRepId,
        analysisStartDate,
        analysisEndDate,
        salesActivityLogs
      })
    ).toThrow(/活動日時がnull/);
  });
});