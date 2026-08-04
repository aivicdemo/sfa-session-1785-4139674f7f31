import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1072
  test('[normal] パターンマッチングと照合の実行 - 新規案件が過去の成功パターンと部分一致した場合、適用可能性スコアが計算される', () => {
    const newDealData = {
      customerIndustry: '製造業',
      productType: 'クラウドERP',
      dealSize: 5000000,
      implementationPeriodMonths: 3,
    };

    const pastSuccessPatterns = [
      {
        patternId: 'pattern_001',
        customerIndustry: '製造業',
        productType: 'クラウドERP',
        dealSize: 4500000,
        implementationPeriodMonths: 3,
      },
      {
        patternId: 'pattern_002',
        customerIndustry: '製造業',
        productType: 'クラウドERP',
        dealSize: 5500000,
        implementationPeriodMonths: 4,
      },
      {
        patternId: 'pattern_003',
        customerIndustry: '製造業',
        productType: 'クラウドERP',
        dealSize: 6000000,
        implementationPeriodMonths: 6,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(pastSuccessPatterns),
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce(0.78)
        .mockReturnValueOnce(0.65)
        .mockReturnValueOnce(0.52),
    };

    const result = evaluatePatternRelevance(
      newDealData,
      pastSuccessPatterns,
      mockAIEngine
    );

    expect(result).toEqual({
      patternMatches: [
        {
          patternId: 'pattern_001',
          applicabilityScore: 0.78,
        },
        {
          patternId: 'pattern_002',
          applicabilityScore: 0.65,
        },
        {
          patternId: 'pattern_003',
          applicabilityScore: 0.52,
        },
      ],
      highestApplicabilityScore: 0.78,
      recommendedPatternId: 'pattern_001',
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      newDealData,
      pastSuccessPatterns[0]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      newDealData,
      pastSuccessPatterns[1]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      newDealData,
      pastSuccessPatterns[2]
    );
  });
});