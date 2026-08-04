import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-984: [error] 成功パターン抽出・照合機能 - 照合ルールが 0 件のとき、デフォルト照合ルールが適用される
  test('照合ルールが 0 件の場合、内部の推奨パターンマスタから統計的に上位の成功パターンがデフォルト照合ルールとして返却される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockMatchingRuleStore = {
      countMatchingRules: jest.fn().mockReturnValue(0),
      getTopSuccessPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_001',
          patternName: '大規模企業向け予算重視型',
          occurrenceCount: 45,
          successRate: 0.82,
          averageContractValue: 5200000,
        },
        {
          patternId: 'pattern_002',
          patternName: '中堅企業向け即導入型',
          occurrenceCount: 38,
          successRate: 0.78,
          averageContractValue: 2100000,
        },
        {
          patternId: 'pattern_003',
          patternName: 'スタートアップ向けトライアル型',
          occurrenceCount: 32,
          successRate: 0.71,
          averageContractValue: 580000,
        },
        {
          patternId: 'pattern_004',
          patternName: '製造業向けカスタマイズ型',
          occurrenceCount: 28,
          successRate: 0.75,
          averageContractValue: 3800000,
        },
        {
          patternId: 'pattern_005',
          patternName: 'IT企業向けAPI統合型',
          occurrenceCount: 25,
          successRate: 0.79,
          averageContractValue: 1900000,
        },
      ]),
    };

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const newDealData = {
      customerId: 'cust_999',
      customerIndustry: '製造業',
      customerScale: 'large',
      dealAmount: 4500000,
      dealStage: 'proposal',
      dealDurationMonths: 12,
    };

    const result = evaluatePatternRelevance(
      newDealData,
      mockAIEngine,
      mockMatchingRuleStore,
      mockLogger
    );

    expect(mockMatchingRuleStore.countMatchingRules).toHaveBeenCalled();
    expect(mockMatchingRuleStore.getTopSuccessPatterns).toHaveBeenCalledWith(5);
    expect(result).toEqual({
      appliedRuleType: 'default',
      recommendedPatterns: [
        {
          patternId: 'pattern_001',
          patternName: '大規模企業向け予算重視型',
          relevanceScore: 82,
          rationale: 'マスタ統計ランク: 1位',
        },
        {
          patternId: 'pattern_002',
          patternName: '中堅企業向け即導入型',
          relevanceScore: 78,
          rationale: 'マスタ統計ランク: 2位',
        },
        {
          patternId: 'pattern_003',
          patternName: 'スタートアップ向けトライアル型',
          relevanceScore: 71,
          rationale: 'マスタ統計ランク: 3位',
        },
        {
          patternId: 'pattern_004',
          patternName: '製造業向けカスタマイズ型',
          relevanceScore: 75,
          rationale: 'マスタ統計ランク: 4位',
        },
        {
          patternId: 'pattern_005',
          patternName: 'IT企業向けAPI統合型',
          relevanceScore: 79,
          rationale: 'マスタ統計ランク: 5位',
        },
      ],
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/照合ルール件数: 0、デフォルト照合ルール適用/)
    );
  });
});