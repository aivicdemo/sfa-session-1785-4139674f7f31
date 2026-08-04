import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2365
  test('[normal] 顧客対応パターンが複数件存在するとき、全パターンを考慮した推論精度スコアが算出される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce({
          patternId: 'pattern-a',
          patternName: '大規模企業向け提案型',
          relevanceScore: 0.85,
          dealConditions: {
            customerSegment: 'enterprise',
            dealType: 'proposal',
            estimatedValue: 5000000
          }
        })
        .mockReturnValueOnce({
          patternId: 'pattern-b',
          patternName: '中堅企業向けコンサル型',
          relevanceScore: 0.72,
          dealConditions: {
            customerSegment: 'midmarket',
            dealType: 'consulting',
            estimatedValue: 1500000
          }
        })
        .mockReturnValueOnce({
          patternId: 'pattern-c',
          patternName: 'スタートアップ向けトライアル型',
          relevanceScore: 0.58,
          dealConditions: {
            customerSegment: 'startup',
            dealType: 'trial',
            estimatedValue: 300000
          }
        })
    };

    const newDealInput = {
      customerId: 'cust-001',
      customerName: 'テスト顧客',
      customerSegment: 'midmarket',
      industry: 'technology',
      employeeCount: 250,
      annualRevenue: 2000000000,
      dealTitle: 'クラウド導入提案',
      dealStage: 'qualification',
      estimatedValue: 1800000
    };

    const result = calculateInferenceAccuracyScore(
      newDealInput,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      newDealInput,
      expect.objectContaining({ patternId: 'pattern-a' })
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      newDealInput,
      expect.objectContaining({ patternId: 'pattern-b' })
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      newDealInput,
      expect.objectContaining({ patternId: 'pattern-c' })
    );

    expect(result.overallAccuracyScore).toBe(0.7167);

    expect(result.patternScores).toEqual([
      {
        patternId: 'pattern-a',
        patternName: '大規模企業向け提案型',
        relevanceScore: 0.85,
        dealConditions: {
          customerSegment: 'enterprise',
          dealType: 'proposal',
          estimatedValue: 5000000
        }
      },
      {
        patternId: 'pattern-b',
        patternName: '中堅企業向けコンサル型',
        relevanceScore: 0.72,
        dealConditions: {
          customerSegment: 'midmarket',
          dealType: 'consulting',
          estimatedValue: 1500000
        }
      },
      {
        patternId: 'pattern-c',
        patternName: 'スタートアップ向けトライアル型',
        relevanceScore: 0.58,
        dealConditions: {
          customerSegment: 'startup',
          dealType: 'trial',
          estimatedValue: 300000
        }
      }
    ]);

    expect(result.patternScores).toHaveLength(3);
    expect(result.overallAccuracyScore).toBeGreaterThan(0.71);
    expect(result.overallAccuracyScore).toBeLessThan(0.72);
  });
});