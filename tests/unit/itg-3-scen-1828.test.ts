import { generateRecommendationWithReasoningRecord } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1828: 推奨根拠情報の統合機能 - 根拠情報に営業担当者のユーザーIDが正確に記録される', async () => {
    const userId = 'USR-SALES-20250801-001';
    const customerId = 'CUST-12345';
    const industry = 'IT';
    const budget = '500万円';
    const implementationTimeline = '2025年Q4';

    const callTimestamp = new Date('2025-08-01T10:30:00Z');

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20250801-001',
        proposedApproach: 'クラウド統合ソリューションの段階的導入',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-IT-001',
          matchScore: 0.92,
          successRate: 0.88,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'IT業種で500万円予算、2025年Q4導入の案件は過去12件中10件が成約しており、クラウド統合ソリューションの採用率が高い。営業担当者の過去成功パターンと一致。'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 0.89,
        riskFactors: ['実装体制の確保', '既存システム連携'],
      }),
    };

    const databaseStub = {
      saveRecommendationReasoning: jest.fn().mockResolvedValue({
        id: 'REC-REASON-20250801-001',
        recommendation_id: 'REC-20250801-001',
        user_id: userId,
        customer_id: customerId,
        reasoning_text:
          'IT業種で500万円予算、2025年Q4導入の案件は過去12件中10件が成約しており、クラウド統合ソリューションの採用率が高い。営業担当者の過去成功パターンと一致。',
        similar_patterns: [
          {
            patternId: 'PAT-IT-001',
            matchScore: 0.92,
            successRate: 0.88,
          },
        ],
        applicability_score: 0.89,
        recorded_at: '2025-08-01T10:30:00Z',
      }),
      queryRecommendationReasoning: jest.fn().mockResolvedValue({
        id: 'REC-REASON-20250801-001',
        recommendation_id: 'REC-20250801-001',
        user_id: userId,
        customer_id: customerId,
        reasoning_text:
          'IT業種で500万円予算、2025年Q4導入の案件は過去12件中10件が成約しており、クラウド統合ソリューションの採用率が高い。営業担当者の過去成功パターンと一致。',
        similar_patterns: [
          {
            patternId: 'PAT-IT-001',
            matchScore: 0.92,
            successRate: 0.88,
          },
        ],
        applicability_score: 0.89,
        recorded_at: '2025-08-01T10:30:00Z',
      }),
    };

    const result = await generateRecommendationWithReasoningRecord(
      {
        userId,
        customerId,
        industry,
        budget,
        implementationTimeline,
      },
      aiEngineStub,
      databaseStub,
      callTimestamp
    );

    expect(result.recordedUserID).toBe('USR-SALES-20250801-001');
    expect(result.recommendationId).toBe('REC-20250801-001');
    expect(result.proposedApproach).toBe('クラウド統合ソリューションの段階的導入');
    expect(result.confidenceScore).toBe(85);

    const recordedReasoning = result.reasoningRecord;
    expect(recordedReasoning.user_id).toBe('USR-SALES-20250801-001');
    expect(recordedReasoning.customer_id).toBe('CUST-12345');
    expect(recordedReasoning.recommendation_id).toBe('REC-20250801-001');
    expect(recordedReasoning.applicability_score).toBe(0.89);

    const recordedTimestamp = new Date(recordedReasoning.recorded_at);
    const timeDiffMs = Math.abs(
      recordedTimestamp.getTime() - callTimestamp.getTime()
    );
    expect(timeDiffMs).toBeLessThanOrEqual(1000);

    expect(databaseStub.saveRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendation_id: 'REC-20250801-001',
        user_id: 'USR-SALES-20250801-001',
        customer_id: 'CUST-12345',
      })
    );

    const dbQueryResult = await databaseStub.queryRecommendationReasoning(
      'REC-20250801-001'
    );
    expect(dbQueryResult.user_id).toBe('USR-SALES-20250801-001');
    expect(dbQueryResult.recommendation_id).toBe('REC-20250801-001');
  });
});