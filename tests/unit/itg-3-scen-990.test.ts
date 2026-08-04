import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-990
  test("FileStorageAdapter の uploadRecommendationReport が API エラーを返すとき、推奨内容が HTML 形式で画面表示される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-12345",
        proposedApproach: "顧客の経営課題に対応した段階的な導入提案",
        confidenceScore: 85,
        rationale: {
          customerProfile: {
            industry: "製造業",
            companySize: "大企業",
            currentChallenge: "DX推進における組織体制の整備",
          },
          successPatternMatches: [
            {
              patternId: "pat-001",
              matchScore: 0.92,
              description: "同規模・同業種での成功事例",
            },
          ],
          recommendedTimingReason: "購買シグナル：複数部門からの検討要望が増加",
          riskFactors: [
            {
              riskId: "risk-001",
              severity: "medium",
              description: "内部抵抗勢力の存在",
            },
          ],
        },
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("HTTP 500: Internal Server Error"))
        .mockRejectedValueOnce(new Error("HTTP 503: Service Unavailable"))
        .mockRejectedValueOnce(new Error("Connection timeout")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const retryDelays: number[] = [];
    const originalSetTimeout = global.setTimeout;
    const mockSetTimeout = jest.fn((callback, delay) => {
      retryDelays.push(delay as number);
      return originalSetTimeout(callback, delay);
    });
    global.setTimeout = mockSetTimeout as any;

    const recommendationData = {
      customerId: "cust-001",
      dealCondition: {
        dealId: "deal-001",
        customerIndustry: "製造業",
        dealAmount: 5000000,
        proposedProducts: ["Product A", "Product B"],
      },
    };

    let htmlOutput: string | null = null;
    let errorMessageDisplayed: string | null = null;

    try {
      const result = await generateRecommendation(
        recommendationData,
        mockAIEngine,
        mockFileStorageAdapter,
        (html: string) => {
          htmlOutput = html;
        },
        (errorMsg: string) => {
          errorMessageDisplayed = errorMsg;
        }
      );

      // 期待結果 (1): 最大2回の再試行がスケジュール通りに実行される
      expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
        3
      );
      expect(retryDelays).toContainEqual(3000);
      expect(retryDelays).toContainEqual(10000);

      // 期待結果 (2): HTML形式への変換処理が実行される
      expect(htmlOutput).not.toBeNull();
      expect(typeof htmlOutput).toBe("string");
      expect(htmlOutput).toContain("<html");
      expect(htmlOutput).toContain("</html>");

      // 期待結果 (3): 推奨内容がHTML形式で表示され、ダウンロード可能な状態
      expect(htmlOutput).toContain("顧客の経営課題に対応した段階的な導入提案");
      expect(htmlOutput).toContain("85");
      expect(htmlOutput).toContain("製造業");
      expect(htmlOutput).toContain("大企業");

      // 期待結果 (4): エラーメッセージが表示される
      expect(errorMessageDisplayed).toContain("レポート生成に失敗しました");
      expect(errorMessageDisplayed).toContain("画面上で推奨内容を確認するか");
      expect(errorMessageDisplayed).toContain("後ほど再度お試しください");
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });
});