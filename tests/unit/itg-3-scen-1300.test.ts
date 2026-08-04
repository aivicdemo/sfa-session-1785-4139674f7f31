import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1300
  test("推奨レポート生成・保存機能 - Amazon S3アップロード失敗時にHTML形式で画面表示可能な状態が返却される", async () => {
    // 入力データ: 有効な推奨内容（提案アプローチ、根拠、推奨スコア等を含む）
    const recommendationData = {
      dealId: "DEAL-20240115-001",
      customerId: "CUST-00012345",
      proposalApproach: "経営層への価値提案型アプローチ",
      basis: [
        {
          type: "success_pattern",
          description: "類似顧客での成功事例：同業種・同規模での提案採用率85%",
          weight: 0.4,
        },
        {
          type: "customer_signal",
          description: "購買シグナル：予算確保・決裁者承認待ち状態",
          weight: 0.35,
        },
        {
          type: "timing_analysis",
          description: "最適タイミング：Q1予算執行期間",
          weight: 0.25,
        },
      ],
      recommendationScore: 87,
      patternRanking: [
        {
          rank: 1,
          patternName: "段階的導入型提案",
          matchScore: 92,
          adoptionRate: 0.88,
        },
        {
          rank: 2,
          patternName: "一括導入型提案",
          matchScore: 78,
          adoptionRate: 0.65,
        },
        {
          rank: 3,
          patternName: "POC検証型提案",
          matchScore: 71,
          adoptionRate: 0.58,
        },
      ],
      generatedAt: "2024-01-15T11:00:00Z",
    };

    // FileStorageAdapterのスタブ：アップロード失敗をシミュレート
    let uploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadAttemptCount++;
        if (uploadAttemptCount === 1) {
          // 初回失敗：403 Forbidden
          await new Promise((resolve) => setTimeout(resolve, 100)); // 非同期処理を模擬
          throw new Error("403 Forbidden: Access Denied");
        } else if (uploadAttemptCount === 2) {
          // 1回目再試行失敗：タイムアウト
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error("ETIMEDOUT: Request timeout after 30s");
        } else if (uploadAttemptCount === 3) {
          // 2回目再試行失敗：503 Service Unavailable
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error("503 Service Unavailable");
        }
        throw new Error("Unexpected upload attempt");
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 推奨レポート生成・保存機能を実行
    const result = await generateRecommendationReport(
      recommendationData,
      mockFileStorageAdapter
    );

    // 検証1: uploadが初回含めて3回試行されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // 検証2: contentTypeが'text/html'であること
    expect(result.contentType).toBe("text/html");

    // 検証3: htmlBodyに推奨内容がHTMLマークアップされた状態であること
    expect(result.htmlBody).toContain("<html>");
    expect(result.htmlBody).toContain("</html>");
    expect(result.htmlBody).toContain("経営層への価値提案型アプローチ");
    expect(result.htmlBody).toContain("推奨スコア: 87");
    expect(result.htmlBody).toContain("段階的導入型提案");
    expect(result.htmlBody).toContain("92");
    expect(result.htmlBody).toContain("88%");

    // 検証4: isLocalDisplayFallbackフラグがtrueであること
    expect(result.isLocalDisplayFallback).toBe(true);

    // 検証5: エラー情報が付与されていること
    expect(result.errorCode).toBeDefined();
    expect(result.errorMessage).toBeDefined();
    expect(result.errorCode).toMatch(/S3|Upload|Failure/i);
    expect(result.errorMessage).toContain("503 Service Unavailable");

    // 検証6: ブラウザの保存機能で取得可能な状態であること
    // （htmlBodyが有効なHTML文字列であり、contentTypeが'text/html'である）
    expect(typeof result.htmlBody).toBe("string");
    expect(result.htmlBody.length).toBeGreaterThan(100);
  });
});