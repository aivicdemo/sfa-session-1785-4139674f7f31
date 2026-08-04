import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-323: 推奨履歴の記録機能 - 同じ推奨内容で2回実行したとき、2つの独立した履歴レコードが生成される', async () => {
    // AIRecommendationEngineのスタブを設定
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-2024-001',
        proposalApproach: 'クラウド導入による業務効率化の提案',
        reasoningBasis: '顧客の予算1000万円と導入期間3ヶ月の制約から、段階的導入アプローチが最適と判定',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    // 1回目の推奨リクエスト実行
    const firstRequestTimestamp = new Date('2024-01-15T10:00:00Z');
    const firstResult = await recordRecommendationHistory(
      {
        customerId: 'CUST-001',
        dealCondition: '予算1000万円、導入期間3ヶ月',
        industry: 'IT',
        companySize: '中企業',
      },
      mockRecommendationEngine,
      firstRequestTimestamp
    );

    expect(firstResult).toBeDefined();
    expect(firstResult.historyId).toBeDefined();
    expect(firstResult.customerId).toBe('CUST-001');
    expect(firstResult.recommendationContent).toEqual({
      recommendationId: 'REC-2024-001',
      proposalApproach: 'クラウド導入による業務効率化の提案',
      reasoningBasis: '顧客の予算1000万円と導入期間3ヶ月の制約から、段階的導入アプローチが最適と判定',
    });
    expect(firstResult.createdAt).toEqual(firstRequestTimestamp);

    const firstHistoryId = firstResult.historyId;
    const firstTimestamp = firstResult.createdAt;

    // 100ミリ秒以上の待機
    await new Promise(resolve => setTimeout(resolve, 100));

    // 2回目の推奨リクエスト実行（同じ顧客ID・同じ商談条件）
    const secondRequestTimestamp = new Date('2024-01-15T10:00:00.150Z');
    const secondResult = await recordRecommendationHistory(
      {
        customerId: 'CUST-001',
        dealCondition: '予算1000万円、導入期間3ヶ月',
        industry: 'IT',
        companySize: '中企業',
      },
      mockRecommendationEngine,
      secondRequestTimestamp
    );

    expect(secondResult).toBeDefined();
    expect(secondResult.historyId).toBeDefined();
    expect(secondResult.customerId).toBe('CUST-001');
    expect(secondResult.recommendationContent).toEqual({
      recommendationId: 'REC-2024-001',
      proposalApproach: 'クラウド導入による業務効率化の提案',
      reasoningBasis: '顧客の予算1000万円と導入期間3ヶ月の制約から、段階的導入アプローチが最適と判定',
    });
    expect(secondResult.createdAt).toEqual(secondRequestTimestamp);

    const secondHistoryId = secondResult.historyId;
    const secondTimestamp = secondResult.createdAt;

    // 履歴テーブル検証
    // 2つのレコードの履歴IDが異なること
    expect(firstHistoryId).not.toBe(secondHistoryId);

    // 2つのレコードのタイムスタンプが異なること（2回目が1回目より後）
    expect(secondTimestamp.getTime()).toBeGreaterThan(firstTimestamp.getTime());

    // 2つのレコードの推奨内容が同一であること
    expect(firstResult.recommendationContent).toEqual(secondResult.recommendationContent);
    expect(firstResult.recommendationContent.proposalApproach).toBe(
      secondResult.recommendationContent.proposalApproach
    );
    expect(firstResult.recommendationContent.reasoningBasis).toBe(
      secondResult.recommendationContent.reasoningBasis
    );

    // 2つのレコードの作成日時フィールドが両方とも有効な値で埋まっていること
    expect(firstResult.createdAt).toBeInstanceOf(Date);
    expect(secondResult.createdAt).toBeInstanceOf(Date);
    expect(firstResult.createdAt.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    expect(secondResult.createdAt.toISOString()).toBe('2024-01-15T10:00:00.150Z');

    // 推奨エンジンが2回呼び出されたことを確認
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(2);
  });
});