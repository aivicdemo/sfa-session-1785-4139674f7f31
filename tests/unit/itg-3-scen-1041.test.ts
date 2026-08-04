import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の妥当性評価 - 評価スコア1.0時の最高優先度設定', () => {
  // SCEN-1041
  test('評価スコアが1.0の場合、最高優先度で推奨される', () => {
    // Arrange: テスト用の新規案件データを準備
    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト企業',
      industry: '製造業',
      companySize: 500,
      dealCondition: {
        dealId: 'DEAL-20240115-0001',
        dealName: '新規案件_テスト企業_2024年Q1',
        dealAmount: 5000000,
        dealStage: 'proposal_preparation',
        dealCloseDate: new Date('2024-03-31T23:59:59Z'),
      },
      customerNeed: {
        businessChallenge: '生産効率の向上',
        budget: 5000000,
        timeframe: '3ヶ月以内',
      },
    };

    // AIRecommendationEngineのスタブ: evaluatePatternRelevanceは常にスコア1.0を返す
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern: unknown, dealData: unknown) => ({
        score: 1.0,
        isApplicable: true,
        matchDetails: {
          customerIndustryMatch: 0.95,
          dealAmountMatch: 0.98,
          timeframeMatch: 1.0,
        },
      })),
      generateRecommendation: jest.fn((dealData: unknown) => ({
        recommendationId: 'REC-20240115-001',
        dealId: newDealData.dealCondition.dealId,
        proposalApproach: '既存顧客の成功パターンを適用した提案',
        estimatedAdoptionProbability: 0.92,
      })),
      findSimilarPatterns: jest.fn(() => [
        {
          patternId: 'PAT-MANUF-001',
          description: '製造業向け生産効率化提案',
          successRate: 0.89,
          applicabilityScore: 1.0,
        },
      ]),
      explainRecommendationReasoning: jest.fn((recommendation: unknown) => ({
        explanation: '過去5件の類似案件で100%の採用率を達成しており、本案件の顧客属性・予算・タイムフレームすべてが完全に合致しています。',
        keyFactors: ['業種一致', '予算適合', 'タイミング最適', '過去成功例'],
      })),
    };

    // Act: 推奨支援システムのメイン処理を呼び出し
    const result = evaluatePatternRelevance(
      newDealData.dealCondition,
      newDealData,
      mockAIEngine
    );

    // Assert: 評価スコアが1.0であり、最高優先度が設定されていることを確認
    expect(result.evaluationScore).toBe(1.0);
    expect(result.priorityLevel).toBe('HIGHEST');
    expect(result.priorityRank).toBe(1);

    // Assert: 推奨一覧内での順序を確認（複数の推奨が返却される場合）
    if (Array.isArray(result.recommendationList) && result.recommendationList.length > 0) {
      expect(result.recommendationList[0].evaluationScore).toBe(1.0);
      expect(result.recommendationList[0].priorityLevel).toBe('HIGHEST');
    }

    // Assert: スコア1.0の推奨が確実に適用可能と判定されていることを確認
    expect(result.isApplicable).toBe(true);
    expect(result.confidenceScore).toBe(1.0);

    // Assert: モックの呼び出しを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.any(Object),
      newDealData
    );
  });
});