import {
  integrateRecommendationReasons
} from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1827: 推奨根拠情報の統合機能 - 複数の根拠情報が一度に統合記録される', () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockResolvedValueOnce({
          recommendationId: 'rec-001',
          approachName: '顧客A向けアプローチ1',
          approachDescription: '初期接触から信頼構築重視'
        })
        .mockResolvedValueOnce({
          recommendationId: 'rec-002',
          approachName: '顧客B向けアプローチ2',
          approachDescription: '経営層への価値提案重視'
        })
        .mockResolvedValueOnce({
          recommendationId: 'rec-003',
          approachName: '顧客C向けアプローチ3',
          approachDescription: 'ROI最適化重視'
        }),
      findSimilarPatterns: jest.fn()
        .mockResolvedValueOnce({
          patternId: 'pat-001',
          similarCaseIds: ['case-101', 'case-102'],
          matchScore: 0.87
        })
        .mockResolvedValueOnce({
          patternId: 'pat-002',
          similarCaseIds: ['case-201', 'case-202'],
          matchScore: 0.92
        })
        .mockResolvedValueOnce({
          patternId: 'pat-003',
          similarCaseIds: ['case-301', 'case-302'],
          matchScore: 0.78
        }),
      explainRecommendationReasoning: jest.fn()
        .mockResolvedValueOnce({
          explanation: '類似顧客の成功事例から導出した提案アプローチ'
        })
        .mockResolvedValueOnce({
          explanation: '経営層向け説得資料の生成実績から推奨'
        })
        .mockResolvedValueOnce({
          explanation: '購買タイミング最適化の成功パターンに合致'
        }),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({
          relevanceScore: 0.91
        })
        .mockResolvedValueOnce({
          relevanceScore: 0.88
        })
        .mockResolvedValueOnce({
          relevanceScore: 0.83
        })
    };

    // 3件の異なる商談条件を準備
    const dealConditions = [
      {
        dealConditionId: 'dc-001',
        customerId: 'cust-A',
        dealType: 1,
        customerIndustry: '製造業',
        customerScale: 'large',
        dealStage: 'initial_contact'
      },
      {
        dealConditionId: 'dc-002',
        customerId: 'cust-B',
        dealType: 2,
        customerIndustry: '金融業',
        customerScale: 'large',
        dealStage: 'proposal_stage'
      },
      {
        dealConditionId: 'dc-003',
        customerId: 'cust-C',
        dealType: 3,
        customerIndustry: '小売業',
        customerScale: 'medium',
        dealStage: 'negotiation'
      }
    ];

    const batchProcessId = 'batch-20240115-001';
    const recordTimestamp = new Date('2024-01-15T11:00:00Z');

    // Act: 推奨根拠情報統合機能を実行
    const result = integrateRecommendationReasons(
      dealConditions,
      mockAIEngine,
      batchProcessId,
      recordTimestamp
    );

    // Assert: 各AIエンジンメソッドが3回ずつ呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // Assert: 3件の根拠情報が正確に統合記録されたことを確認
    expect(result).toHaveLength(3);

    // 第1件の根拠情報検証
    expect(result[0]).toEqual({
      reasonId: expect.stringMatching(/^reason-\d{4}$/),
      dealConditionId: 'dc-001',
      batchProcessId: 'batch-20240115-001',
      recommendationApproach: '顧客A向けアプローチ1',
      similarPatternIds: ['case-101', 'case-102'],
      explanationText: '類似顧客の成功事例から導出した提案アプローチ',
      relevanceScore: 0.91,
      sourceMethodName: 'generateRecommendation,findSimilarPatterns,explainRecommendationReasoning,evaluatePatternRelevance',
      recordedAt: new Date('2024-01-15T11:00:00Z')
    });

    // 第2件の根拠情報検証
    expect(result[1]).toEqual({
      reasonId: expect.stringMatching(/^reason-\d{4}$/),
      dealConditionId: 'dc-002',
      batchProcessId: 'batch-20240115-001',
      recommendationApproach: '顧客B向けアプローチ2',
      similarPatternIds: ['case-201', 'case-202'],
      explanationText: '経営層向け説得資料の生成実績から推奨',
      relevanceScore: 0.88,
      sourceMethodName: 'generateRecommendation,findSimilarPatterns,explainRecommendationReasoning,evaluatePatternRelevance',
      recordedAt: new Date('2024-01-15T11:00:00Z')
    });

    // 第3件の根拠情報検証
    expect(result[2]).toEqual({
      reasonId: expect.stringMatching(/^reason-\d{4}$/),
      dealConditionId: 'dc-003',
      batchProcessId: 'batch-20240115-001',
      recommendationApproach: '顧客C向けアプローチ3',
      similarPatternIds: ['case-301', 'case-302'],
      explanationText: '購買タイミング最適化の成功パターンに合致',
      relevanceScore: 0.83,
      sourceMethodName: 'generateRecommendation,findSimilarPatterns,explainRecommendationReasoning,evaluatePatternRelevance',
      recordedAt: new Date('2024-01-15T11:00:00Z')
    });

    // Assert: 各根拠情報が異なるreasonIdを保有していることを確認
    const reasonIds = result.map(r => r.reasonId);
    expect(new Set(reasonIds).size).toBe(3);

    // Assert: すべての根拠情報が同一のbatchProcessIdを保有していることを確認
    expect(result.every(r => r.batchProcessId === 'batch-20240115-001')).toBe(true);

    // Assert: すべての根拠情報のrelevanceScoreが0.0～1.0の範囲内であることを確認
    expect(result.every(r => r.relevanceScore >= 0.0 && r.relevanceScore <= 1.0)).toBe(true);

    // Assert: すべての根拠情報のrecordedAtが同じ秒内に記録されていることを確認
    const recordedTimes = result.map(r => r.recordedAt.getTime());
    const timeDiffMax = Math.max(...recordedTimes) - Math.min(...recordedTimes);
    expect(timeDiffMax).toBeLessThan(1000); // 1秒以内
  });
});