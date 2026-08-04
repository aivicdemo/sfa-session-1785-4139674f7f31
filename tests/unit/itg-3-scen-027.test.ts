import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-027: [normal] 学習データ量・品質検証機能 - 学習データ件数が最小要件未満の場合に推論実行が保留される
  test('学習データ件数が最小要件未満の場合、推論実行が保留され代替動作で応答する', () => {
    const insufficientTrainingData = Array.from({ length: 5 }, (_, i) => ({
      dealId: `deal_${i}`,
      customerId: `customer_${i}`,
      industry: 'Manufacturing',
      dealAmount: 100000 + i * 10000,
      result: i % 2 === 0 ? 'won' : 'lost',
      createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    }));

    const newDealCondition = {
      customerId: 'cust_new_001',
      customerName: 'Acme Corp',
      industry: 'Manufacturing',
      companySize: 'large',
      estimatedBudget: 500000,
      dealStage: 'initial_contact',
    };

    const result = generateRecommendation(
      newDealCondition,
      insufficientTrainingData,
      {
        minTrainingDataCount: 10,
        qualityThreshold: 0.8,
      }
    );

    expect(result.status).toBe(202);
    expect(result.internalStatus).toBe('PENDING_DATA_VALIDATION');
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0]).toHaveProperty('pattern');
    expect(result.recommendations[0]).toHaveProperty('relevanceScore');
    expect(result.recommendations[0]).toHaveProperty('simplifiedReasoning');
    expect(result.recommendations[0].simplifiedReasoning).toBeTruthy();
    expect(result.externalApiCalled).toBe(false);
    expect(result.sourceType).toBe('PATTERN_MASTER');
    expect(result.recommendations[0].relevanceScore).toBeGreaterThanOrEqual(
      result.recommendations[1].relevanceScore
    );
    expect(result.recommendations[1].relevanceScore).toBeGreaterThanOrEqual(
      result.recommendations[2].relevanceScore
    );
  });
});