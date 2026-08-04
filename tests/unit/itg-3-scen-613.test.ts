import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-613: [normal] 推奨レポート生成・保存機能 - 推奨内容がExcel形式で生成されAmazon S3にアップロードされる", async () => {
    // ===== SETUP: AIRecommendationEngine のスタブ =====
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-2024-001",
        proposalApproach: "顧客のコスト削減ニーズに対し、既存システムとの統合提案を推奨",
        confidenceScore: 87,
        reasoning: [
          {
            factor: "顧客業種マッチング",
            weight: 0.3,
            evidenceScore: 0.9,
            pastSuccessCount: 12,
          },
          {
            factor: "予算規模適合性",
            weight: 0.25,
            evidenceScore: 0.8,
            pastSuccessCount: 8,
          },
          {
            factor: "導入タイミング",
            weight: 0.45,
            evidenceScore: 0.85,
            pastSuccessCount: 15,
          },
        ],
        riskFactors: ["導入期間の長期化", "競合製品の台頭"],
        proposedActions: [
          {
            action: "初回ヒアリング実施",
            recommendedTiming: "2024-01-22",
            priority: 1,
          },
          {
            action: "提案資料初版提示",
            recommendedTiming: "2024-01-29",
            priority: 2,
          },
        ],
      }),
    };

    // ===== SETUP: FileStorageAdapter のスタブ =====
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: "reports/2024-01/REC-2024-001-recommendation.xlsx",
        etag: '"a1b2c3d4e5f6g7h8"',
        uploadedAt: "2024-01-15T11:00:00Z",
        fileSize: 8192,
      }),
    };

    // ===== INPUT: テスト対象関数の入力データ =====
    const inputParams = {
      dealId: "DEAL-2024-0042",
      customerId: "CUST-0001234",
      customerName: "ABC Manufacturing Co., Ltd.",
      industry: "製造業",
      companySize: "中堅企業",
      dealAmount: 5000000,
      dealStage: "提案検討段階",
      dealDescription: "ERPシステム導入による業務効率化",
    };

    // ===== EXECUTION: 推奨レポート生成関数を呼び出し =====
    const result = await generateRecommendationReport(
      inputParams,
      mockRecommendationEngine,
      mockFileStorageAdapter
    );

    // ===== VERIFY: AIRecommendationEngine.generateRecommendation が呼び出されたことを確認 =====
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: "DEAL-2024-0042",
        customerId: "CUST-0001234",
        industry: "製造業",
        companySize: "中堅企業",
      })
    );

    // ===== VERIFY: FileStorageAdapter.uploadRecommendationReport が呼び出されたことを確認 =====
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // ===== VERIFY: アップロード時のパラメータ検証 =====
    const uploadCallArgs = mockFileStorageAdapter.uploadRecommendationReport.mock
      .calls[0][0];
    expect(uploadCallArgs.fileFormat).toBe("Excel");
    expect(uploadCallArgs.fileFormat).toMatch(/Excel|xlsx/);
    expect(uploadCallArgs.fileSize).toBeGreaterThan(0);

    // ===== VERIFY: 生成されたレポートファイルサイズが5KB以上であることを確認 =====
    expect(uploadCallArgs.fileSize).toBeGreaterThanOrEqual(5120);

    // ===== VERIFY: レポートメタデータの検証 =====
    expect(uploadCallArgs.metadata).toEqual(
      expect.objectContaining({
        dealId: "DEAL-2024-0042",
        customerId: "CUST-0001234",
        customerName: "ABC Manufacturing Co., Ltd.",
        recommendationId: "REC-2024-001",
      })
    );

    // ===== VERIFY: ファイルキーがレスポンスに含まれることを確認 =====
    expect(result.fileKey).toBe(
      "reports/2024-01/REC-2024-001-recommendation.xlsx"
    );

    // ===== VERIFY: ETag がレスポンスに含まれることを確認 =====
    expect(result.etag).toBe('"a1b2c3d4e5f6g7h8"');

    // ===== VERIFY: アップロード完了メッセージの確認 =====
    expect(result.status).toBe("completed");
    expect(result.message).toMatch(/推奨レポートが正常に生成・保存されました/);

    // ===== VERIFY: Excelファイルに格納されるべき内容の検証 =====
    expect(uploadCallArgs.reportContent).toEqual(
      expect.objectContaining({
        recommendationId: "REC-2024-001",
        proposalApproach: "顧客のコスト削減ニーズに対し、既存システムとの統合提案を推奨",
        confidenceScore: 87,
        reasoning: expect.arrayContaining([
          expect.objectContaining({
            factor: "顧客業種マッチング",
            weight: 0.3,
            evidenceScore: 0.9,
          }),
        ]),
        riskFactors: expect.arrayContaining(["導入期間の長期化"]),
        proposedActions: expect.arrayContaining([
          expect.objectContaining({
            action: "初回ヒアリング実施",
            recommendedTiming: "2024-01-22",
            priority: 1,
          }),
        ]),
      })
    );

    // ===== VERIFY: 生成されたレポートがファイルサイズの期待値を満たしていることを確認 =====
    expect(result.fileSize).toBe(8192);
    expect(result.fileSize).toBeGreaterThanOrEqual(5120);

    // ===== VERIFY: ファイルキーが適切な形式であることを確認 =====
    expect(result.fileKey).toMatch(/\.xlsx$/);
    expect(result.fileKey).toMatch(/REC-2024-001/);
  });
});