import { recordRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠記録機能', () => {
  test('SCEN-2360: 推奨根拠が新規に記録されるとき根拠履歴にレコードが追加される', async () => {
    // Arrange
    const mockAIEngineResponse = {
      recommendationId: 'REC-20240115-001',
      reasoning: '過去3件の類似案件で同じ顧客規模・業種での成功パターンを確認。提案タイミングは商談開始から平均21日後が最適。',
      patternScore: 0.87,
      timestamp: new Date('2024-01-15T11:30:00Z').toISOString(),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockAIEngineResponse),
    };

    const input = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-20240115-789',
      dealAmount: 5000000,
      dealConditions: {
        industry: '金融',
        companySize: '中堅企業',
        purchaseHistory: ['商品A', '商品B'],
      },
      recommendationContent: '初回提案は経営課題分析ワークショップから開始し、顧客ニーズの深堀りを優先',
      recordedAt: new Date('2024-01-15T11:30:00Z').toISOString(),
    };

    const expectedRecord = {
      recommendationId: 'REC-20240115-001',
      dealId: 'DEAL-20240115-789',
      reasoningText: '過去3件の類似案件で同じ顧客規模・業種での成功パターンを確認。提案タイミングは商談開始から平均21日後が最適。',
      recordedTimestamp: new Date('2024-01-15T11:30:00Z').toISOString(),
      patternScore: 0.87,
    };

    const mockDatabase = {
      recordedHistories: [] as typeof expectedRecord[],
      insertReasoningHistory: function(record: typeof expectedRecord) {
        this.recordedHistories.push(record);
        return record;
      },
      queryReasoningHistory: function(filters: { dealId: string }) {
        return this.recordedHistories.filter(r => r.dealId === filters.dealId);
      },
    };

    // Act
    const result = await recordRecommendationReasoning(
      input,
      mockAIEngine,
      mockDatabase
    );

    // Assert
    expect(result).toEqual({
      success: true,
      recordedRecommendationId: 'REC-20240115-001',
      dealId: 'DEAL-20240115-789',
    });

    const queriedRecords = mockDatabase.queryReasoningHistory({
      dealId: 'DEAL-20240115-789',
    });

    expect(queriedRecords).toHaveLength(1);

    const recordedEntry = queriedRecords[0];
    expect(recordedEntry.recommendationId).toBe('REC-20240115-001');
    expect(recordedEntry.dealId).toBe('DEAL-20240115-789');
    expect(recordedEntry.reasoningText).toBe(
      '過去3件の類似案件で同じ顧客規模・業種での成功パターンを確認。提案タイミングは商談開始から平均21日後が最適。'
    );
    expect(recordedEntry.recordedTimestamp).toBe('2024-01-15T11:30:00Z');
    expect(recordedEntry.patternScore).toBe(0.87);
    expect(recordedEntry.patternScore).toBeGreaterThanOrEqual(0.0);
    expect(recordedEntry.patternScore).toBeLessThanOrEqual(1.0);
  });
});