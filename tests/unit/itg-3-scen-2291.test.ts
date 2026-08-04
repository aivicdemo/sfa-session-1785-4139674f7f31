import { detectAnomalyPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('異常パターン検出・可視化機能', () => {
  // SCEN-2291
  test('標準プロセスパターンの複数比較すべてが失敗する場合、エラーメッセージとログを返す', () => {
    const standardProcessPatterns = [
      {
        patternId: 'pattern_a',
        patternName: 'パターンA',
        processSteps: [
          { stepOrder: 1, stepName: 'ニーズ確認' },
          { stepOrder: 2, stepName: '提案作成' },
          { stepOrder: 3, stepName: '承認取得' }
        ]
      },
      {
        patternId: 'pattern_b',
        patternName: 'パターンB',
        processSteps: [
          { stepOrder: 1, stepName: 'ビジネスヒアリング' },
          { stepOrder: 2, stepName: 'ROI分析' },
          { stepOrder: 3, stepName: 'ボード提出' }
        ]
      },
      {
        patternId: 'pattern_c',
        patternName: 'パターンC',
        processSteps: [
          { stepOrder: 1, stepName: '顧客課題把握' },
          { stepOrder: 2, stepName: 'ソリューション検討' },
          { stepOrder: 3, stepName: '見積・契約' }
        ]
      }
    ];

    const newDealData = {
      dealId: 'deal_001',
      customerId: 'cust_123',
      customerIndustry: 'IT',
      customerScale: 'large',
      proposalContent: 'クラウドシステム導入',
      dealConditions: {
        budget: 5000000,
        timeline: '2024-12-31',
        requiredFeatures: ['セキュリティ', 'スケーラビリティ']
      }
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockImplementation(() => {
        throw new Error('Pattern evaluation failed');
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    const result = detectAnomalyPatterns(
      newDealData,
      standardProcessPatterns,
      mockAIEngine
    );

    expect(result.status).toBe('ERROR');
    expect(result.errorMessage).toBe('複数のプロセスパターン比較に失敗しました');
    expect(result.userMessage).toBe(
      '異常検出に一時的なエラーが発生しています。管理者にお問い合わせください'
    );
    expect(result.internalLog).toContain(
      'evaluatePatternRelevance呼び出し失敗：パターンA、パターンB、パターンC'
    );
    expect(result.cachedRecommendation).toBeUndefined();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});