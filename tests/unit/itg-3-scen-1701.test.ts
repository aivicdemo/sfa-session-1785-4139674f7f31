import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1701
  test("レポート生成・出力機能 - S3アップロード失敗時、再試行実行後に代替処理（HTML形式で画面表示）が実行される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        dealId: "DEAL-20240115-001",
        customerId: "CUST-9876",
        customerName: "テスト顧客法人",
        customerIndustry: "製造業",
        customerScale: "大企業",
        dealStage: "初期商談",
        proposalApproach: "経営課題解決型アプローチ",
        successPatternMatchRate: 87,
        recommendationReason:
          "過去の類似案件（顧客業種：製造業、規模：大企業、課題：DX推進）において本提案アプローチの成功率が87%。顧客の経営目標と投資額が標準範囲内で適合性が高い。",
        recommendationConfidenceScore: 85,
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("S3 connection failed"))
        .mockRejectedValueOnce(new Error("S3 access denied"))
        .mockRejectedValueOnce(new Error("S3 upload timeout")),
    };

    const dealCondition = {
      dealId: "DEAL-20240115-001",
      customerId: "CUST-9876",
      customerName: "テスト顧客法人",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealStage: "初期商談",
      budget: 5000000,
      timelineWeeks: 12,
    };

    const result = await generateRecommendationReport(
      dealCondition,
      mockRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.status).toBe("fallback_html_displayed");
    expect(result.retryAttempts).toBe(2);
    expect(result.htmlContent).toContain("テスト顧客法人");
    expect(result.htmlContent).toContain("製造業");
    expect(result.htmlContent).toContain("大企業");
    expect(result.htmlContent).toContain("経営課題解決型アプローチ");
    expect(result.htmlContent).toContain("87");
    expect(result.htmlContent).toContain(
      "過去の類似案件（顧客業種：製造業、規模：大企業、課題：DX推進）において本提案アプローチの成功率が87%。顧客の経営目標と投資額が標準範囲内で適合性が高い。"
    );
    expect(result.htmlContent).toContain("85");
    expect(result.notificationMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );
    expect(result.isBrowserSaveable).toBe(true);
    expect(result.htmlContent).toMatch(/<html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);
  });
});