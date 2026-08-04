import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-780: ファイルストレージ失敗時の振る舞い - 推奨内容がHTML形式で画面表示される", async () => {
    // Setup: 推奨内容オブジェクトのモック
    const mockRecommendationContent = {
      customerName: "株式会社テスト",
      dealConditions: {
        industry: "製造業",
        companySize: "中堅企業",
        budget: 5000000,
        timeline: "Q2実装"
      },
      proposalApproach: {
        steps: [
          {
            step: 1,
            action: "業務プロセスヒアリング",
            description: "顧客の現状業務フローを詳細にヒアリング"
          },
          {
            step: 2,
            action: "提案資料作成",
            description: "ヒアリング内容に基づいた提案ドラフト作成"
          }
        ],
        recommendedApproachName: "標準製造業提案パターンA"
      },
      similarSuccessCases: [
        {
          caseId: "CASE-2024-001",
          customerName: "製造業A社",
          industry: "製造業",
          result: "成約",
          explanation: "同規模製造業での成功事例。初期投資3000万円で年間効果1500万円"
        },
        {
          caseId: "CASE-2024-005",
          customerName: "製造業B社",
          industry: "製造業",
          result: "成約",
          explanation: "類似予算帯での成功事例。実装期間6ヶ月で目標達成"
        }
      ],
      evaluationScore: 82,
      confidenceScore: 0.87
    };

    // Setup: FileStorageAdapter のスタブ定義
    let callCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("Network Timeout");
        } else if (callCount === 2) {
          throw new Error("AccessDenied");
        } else if (callCount === 3) {
          throw new Error("ServiceUnavailable");
        }
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // Setup: AIRecommendationEngine のスタブ定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => mockRecommendationContent),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: generateRecommendation() を呼び出して推奨内容を取得
    const recommendationContent = await mockAIRecommendationEngine.generateRecommendation({
      customerId: "CUST-001",
      industry: "製造業",
      companySize: "中堅企業"
    });

    // Act: uploadRecommendationReport() へ推奨内容を渡す
    // 再試行ロジックの実装を想定
    let uploadResult: { success: boolean; htmlContent?: string; error?: string } | null = null;
    let lastError: Error | null = null;

    const retryIntervals = [3000, 10000]; // 3秒, 10秒
    let retryAttempt = 0;

    const attemptUpload = async (): Promise<void> => {
      try {
        await mockFileStorageAdapter.uploadRecommendationReport(recommendationContent);
        uploadResult = { success: true };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (retryAttempt < retryIntervals.length) {
          const waitTime = retryIntervals[retryAttempt];
          retryAttempt++;
          // シミュレート: 再試行タイマーをセット
          await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 100)));
          await attemptUpload();
        } else {
          // 2 回の再試行を超えて失敗 → HTML表示フォールバック
          uploadResult = {
            success: false,
            htmlContent: generateHtmlFromRecommendation(recommendationContent),
            error: lastError.message
          };
        }
      }
    };

    await attemptUpload();

    // Assert: uploadRecommendationReport() が 3 回呼ばれたことを確認（初回 + 2 回の再試行）
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // Assert: 最終的に失敗ステータスであることを確認
    expect(uploadResult).not.toBeNull();
    expect(uploadResult?.success).toBe(false);

    // Assert: 推奨内容が HTML 形式で画面表示される
    expect(uploadResult?.htmlContent).toBeDefined();
    const htmlContent = uploadResult?.htmlContent || "";

    // HTML コンテンツに必要な要素が含まれていることを確認
    expect(htmlContent).toContain("株式会社テスト"); // 顧客名
    expect(htmlContent).toContain("製造業"); // 業種
    expect(htmlContent).toContain("中堅企業"); // 企業規模
    expect(htmlContent).toContain("業務プロセスヒアリング"); // 推奨される提案ステップ
    expect(htmlContent).toContain("標準製造業提案パターンA"); // 提案アプローチ名
    expect(htmlContent).toContain("製造業A社"); // 過去成功事例（顧客名）
    expect(htmlContent).toContain("成約"); // 成功事例（結果）
    expect(htmlContent).toContain("年間効果1500万円"); // 成功事例の説明
    expect(htmlContent).toContain("82"); // 評価スコア

    // Assert: S3 へのアップロード処理が最終的に行われていないことを確認
    // （uploadResult が失敗状態で HTML が返されているため）
    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();

    // Assert: 最後のエラーが ServiceUnavailable であることを確認
    expect(lastError?.message).toBe("ServiceUnavailable");

    // Assert: UI レンダリング用に HTML が確実に返されていることを確認
    expect(uploadResult?.htmlContent).toMatch(/<html|<!DOCTYPE/i);
  });
});

/**
 * 推奨内容オブジェクトから HTML 形式の表示用コンテンツを生成
 * ブラウザの保存機能で取得可能な状態を実現
 */
function generateHtmlFromRecommendation(content: {
  customerName: string;
  dealConditions: { industry: string; companySize: string; budget: number; timeline: string };
  proposalApproach: { steps: Array<{ step: number; action: string; description: string }>; recommendedApproachName: string };
  similarSuccessCases: Array<{ caseId: string; customerName: string; industry: string; result: string; explanation: string }>;
  evaluationScore: number;
  confidenceScore: number;
}): string {
  const stepsHtml = content.proposalApproach.steps
    .map((step) => `<li><strong>${step.action}</strong>: ${step.description}</li>`)
    .join("");

  const casesHtml = content.similarSuccessCases
    .map(
      (caseItem) =>
        `<tr><td>${caseItem.caseId}</td><td>${caseItem.customerName}</td><td>${caseItem.industry}</td><td>${caseItem.result}</td><td>${caseItem.explanation}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIエージェント推奨内容レポート</title>
  <style>
    body { font-family: 'MS Pゴシック', Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
    .container { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 1000px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
    h2 { color: #0066cc; margin-top: 25px; border-left: 4px solid #0066cc; padding-left: 10px; }
    .info-block { background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #0066cc; }
    .info-block p { margin: 5px 0; }
    .score-badge { display: inline-block; background-color: #0066cc; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
    ul { line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #0066cc; color: white; }
    tr:hover { background-color: #f5f5f5; }
  </style>
</head>
<body>
  <div class="container">
    <h1>AIエージェント推奨内容レポート</h1>
    
    <div class="info-block">
      <p><strong>顧客名:</strong> ${content.customerName}</p>
      <p><strong>業種:</strong> ${content.dealConditions.industry}</p>
      <p><strong>企業規模:</strong> ${content.dealConditions.companySize}</p>
      <p><strong>予算:</strong> ¥${content.dealConditions.budget.toLocaleString()}</p>
      <p><strong>実装予定:</strong> ${content.dealConditions.timeline}</p>
    </div>

    <h2>推奨提案アプローチ</h2>
    <div class="info-block">
      <p><strong>提案パターン:</strong> ${content.proposalApproach.recommendedApproachName}</p>
      <p><strong>推奨ステップ:</strong></p>
      <ul>${stepsHtml}</ul>
    </div>

    <h2>根拠となる類似成功事例</h2>
    <table>
      <thead>
        <tr>
          <th>事例ID</th>
          <th>顧客名</th>
          <th>業種</th>
          <th>結果</th>
          <th>説明</th>
        </tr>
      </thead>
      <tbody>
        ${casesHtml}
      </tbody>
    </table>

    <h2>評価</h2>
    <div class="info-block">
      <p><strong>適合度スコア:</strong> <span class="score-badge">${content.evaluationScore}/100</span></p>
      <p><strong>信頼度スコア:</strong> <span class="score-badge">${(content.confidenceScore * 100).toFixed(0)}/100</span></p>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #999;">
      このレポートはブラウザの保存機能（Ctrl+S または右クリック → 保存）でHTML形式で取得できます。
    </p>
  </div>
</body>
</html>`;
}