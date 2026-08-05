import { extractAndJudgeSuccessFailureFactors } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-998
  test("成功要因・失敗要因の抽出と承認基準判定機能 - 要因データが業務上の最大規模（1000件以上）を含むとき処理が完了する", async () => {
    // テストデータ: 成功要因1000件、失敗要因500件（合計1500件）を準備
    const successFactorCount = 1000;
    const failureFactorCount = 500;
    const totalFactorCount = successFactorCount + failureFactorCount;

    const successFactors = Array.from({ length: successFactorCount }, (_, i) => ({
      id: `success_${i + 1}`,
      type: "success" as const,
      description: `Success factor ${i + 1}: Effective sales approach`,
      occurrenceCount: Math.floor(Math.random() * 100) + 1,
      conversionRate: Math.random() * 0.5 + 0.5,
      timestamp: "2024-01-15T10:00:00Z",
    }));

    const failureFactors = Array.from({ length: failureFactorCount }, (_, i) => ({
      id: `failure_${i + 1}`,
      type: "failure" as const,
      description: `Failure factor ${i + 1}: Missed opportunity`,
      occurrenceCount: Math.floor(Math.random() * 50) + 1,
      conversionRate: Math.random() * 0.3,
      timestamp: "2024-01-15T10:00:00Z",
    }));

    const allFactors = [...successFactors, ...failureFactors];

    const input = {
      factorData: allFactors,
      approvalThreshold: 0.75,
      processingTimeoutMs: 30000,
    };

    // 成功要因・失敗要因の抽出処理を実行（処理時間を測定）
    const startTime = Date.now();
    const result = await extractAndJudgeSuccessFailureFactors(input);
    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;

    // 処理時間がタイムアウト値（30秒）以内であることを確認
    expect(processingTimeMs).toBeLessThan(30000);

    // 抽出された全1500件の要因データが正確に分類されたことを確認
    expect(result.totalProcessedFactors).toBe(totalFactorCount);
    expect(result.successFactorCount).toBe(successFactorCount);
    expect(result.failureFactorCount).toBe(failureFactorCount);

    // 承認基準判定ロジックが正常に完了したことを確認
    expect(result.status).toBe("completed");

    // レスポンスが期待される形式を持つことを確認
    expect(result).toEqual({
      status: "completed",
      totalProcessedFactors: totalFactorCount,
      successFactorCount: successFactorCount,
      failureFactorCount: failureFactorCount,
      processingTimeMs: expect.any(Number),
      approvalJudgment: {
        approved: true,
        reason: expect.any(String),
      },
      persistenceResult: {
        success: true,
        recordCount: totalFactorCount,
        timestamp: expect.any(String),
      },
    });

    // データベースに全件のレコードが正常に保存されていることを確認
    expect(result.persistenceResult.success).toBe(true);
    expect(result.persistenceResult.recordCount).toBe(totalFactorCount);

    // 承認基準判定が要因の質と量に基づいて正常に実行されたことを確認
    expect(result.approvalJudgment.approved).toBe(true);
  });
});