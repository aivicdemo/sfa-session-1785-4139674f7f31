import { generateReportMetadata } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - レポートメタデータ生成', () => {
  test('SCEN-470: レポート生成時刻が正しく記録される', () => {
    // テスト実行時刻を基準時刻として記録
    const testExecutionTime = new Date('2026-08-01T08:09:40.805Z');
    const baselineTimestamp = testExecutionTime.getTime();

    // AIRecommendationEngineのスタブを定義
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客業種「金融」×商談段階「初回提案」の成功パターンを適用',
        confidenceScore: 85,
        successPatternId: 'SP-FIN-001',
        reasoning: '過去3件の類似案件で成約率95%を達成'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 新規案件データ（入力パラメータ）
    const proposalInput = {
      customerId: 'CUST-20260801-001',
      customerIndustry: 'finance',
      customerSize: 'large',
      dealStage: 'initial_proposal',
      dealAmount: 5000000,
      dealTimeline: '2026-09-30',
      contactPerson: 'Yamada Taro',
      proposalTopic: 'Digital transformation consulting'
    };

    // レポートメタデータ生成処理を実行
    const generatedReport = generateReportMetadata(proposalInput, aiRecommendationEngineStub);

    // 期待結果の検証
    // 1. 生成されたレポートオブジェクトが存在すること
    expect(generatedReport).toBeDefined();

    // 2. 生成時刻フィールドが存在すること
    expect(generatedReport.generatedAt).toBeDefined();

    // 3. 生成時刻がISO 8601形式であること
    expect(generatedReport.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // 4. 生成時刻がテスト実行時刻から±2秒以内の精度で一致すること
    const generatedTimestamp = new Date(generatedReport.generatedAt).getTime();
    const timeDifference = Math.abs(generatedTimestamp - baselineTimestamp);
    expect(timeDifference).toBeLessThanOrEqual(2000); // ±2秒 = 2000ミリ秒

    // 5. レポートメタデータがレポートファイルメタデータテーブルに保存される際も同じタイムスタンプが使用されていることを検証
    expect(generatedReport.fileMetadata).toBeDefined();
    expect(generatedReport.fileMetadata.createdAt).toBe(generatedReport.generatedAt);

    // 6. 推奨内容が正しく含まれていること
    expect(generatedReport.recommendation).toBeDefined();
    expect(generatedReport.recommendation.recommendedApproach).toBe(
      '顧客業種「金融」×商談段階「初回提案」の成功パターンを適用'
    );
    expect(generatedReport.recommendation.confidenceScore).toBe(85);

    // 7. AIRecommendationEngineの generateRecommendation メソッドが呼び出されたことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20260801-001',
        customerIndustry: 'finance',
        dealStage: 'initial_proposal'
      })
    );
  });
});