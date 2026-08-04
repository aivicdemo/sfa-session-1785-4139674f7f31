import { generatePersuasionMaterial } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 経営層向け説得資料生成", () => {
  test("SCEN-1982: ファイルアップロード失敗時にHTML形式で説得資料内容が画面表示される", async () => {
    // AIRecommendationEngineスタブ: 正常に推奨内容を返却
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalSummary: "提案の戦略的価値",
        keyPoints: [
          "経営課題の解決による売上向上",
          "運用コスト削減効果",
        ],
        businessImpact: {
          roi: 250,
          paybackMonths: 12,
        },
        riskFactors: ["導入時間", "ユーザー教育"],
        recommendedActions: [
          "段階的な導入",
          "専任チームの配置",
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: "類似企業5社の成功事例に基づき、本提案は経営目標達成に最適",
      }),
    };

    // FileStorageAdapterスタブ: S3アップロード失敗を返す
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValue(new Error("Network timeout")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const customerInfo = {
      companyName: "顧客企業A",
      businessChallenge: "デジタル変革による営業効率化",
      budget: 5000000,
      decisionTimeline: "3ヶ月以内",
    };

    const proposalContent = {
      productName: "営業支援プラットフォーム",
      proposedApproach: "クラウドベースのCRM導入",
      expectedOutcome: "営業効率25%向上",
      implementationPeriod: "6ヶ月",
    };

    const result = await generatePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
    );

    // ファイルアップロード失敗後、HTMLフォーマットの説得資料が画面表示される
    expect(result.deliveryMethod).toBe("html_display");

    // ユーザー向けメッセージが含まれている
    expect(result.userMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.userMessage).toMatch(/画面上で推奨内容を確認/);
    expect(result.userMessage).toMatch(/後ほど再度お試しください/);

    // 生成された説得資料の完全な内容がHTML形式で整形されている
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toMatch(/<html/);
    expect(result.htmlContent).toMatch(/<body/);
    expect(result.htmlContent).toMatch(/顧客企業A/);
    expect(result.htmlContent).toMatch(/デジタル変革による営業効率化/);
    expect(result.htmlContent).toMatch(/提案の戦略的価値/);
    expect(result.htmlContent).toMatch(/経営課題の解決による売上向上/);
    expect(result.htmlContent).toMatch(/運用コスト削減効果/);
    expect(result.htmlContent).toMatch(/ROI: 250%/);
    expect(result.htmlContent).toMatch(/回収期間: 12ヶ月/);
    expect(result.htmlContent).toMatch(/導入時間/);
    expect(result.htmlContent).toMatch(/ユーザー教育/);
    expect(result.htmlContent).toMatch(/段階的な導入/);
    expect(result.htmlContent).toMatch(/専任チームの配置/);
    expect(result.htmlContent).toMatch(/営業支援プラットフォーム/);
    expect(result.htmlContent).toMatch(/クラウドベースのCRM導入/);
    expect(result.htmlContent).toMatch(/営業効率25%向上/);
    expect(result.htmlContent).toMatch(/類似企業5社の成功事例に基づき/);

    // ブラウザの「名前を付けて保存」機能で保存可能な状態
    expect(result.htmlContent).toMatch(/<!DOCTYPE html/);
    expect(result.htmlContent).toMatch(/<\/html>/);
    expect(result.mimeType).toBe("text/html");

    // 最大2回の再試行が実行されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      3,
    ); // 初回 + 再試行2回

    // AIエージェントから推奨内容が取得されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning,
    ).toHaveBeenCalled();

    // S3アップロードが最終的に失敗したため、downloadUrlは生成されない
    expect(result.downloadUrl).toBeUndefined();
  });
});