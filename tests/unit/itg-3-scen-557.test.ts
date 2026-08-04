import { extractSuccessPatternsAndEvaluate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-557
  test('過去商談データが複数件のとき複数の成功パターンが抽出される', () => {
    // テスト用の過去商談データを3件以上準備（異なる成功パターン）
    const historicalDeals = [
      {
        dealId: 'deal_001',
        customerName: 'Corp A',
        employeeCount: 1000,
        industry: '製造業',
        budget: 10000,
        contractType: '長期契約型',
        successPattern: 'large_enterprise_long_term',
        outcome: 'success'
      },
      {
        dealId: 'deal_002',
        customerName: 'Corp B',
        employeeCount: 500,
        industry: '製造業',
        budget: 5000,
        contractType: '段階導入型',
        successPattern: 'mid_size_phased_adoption',
        outcome: 'success'
      },
      {
        dealId: 'deal_003',
        customerName: 'Corp C',
        employeeCount: 50,
        industry: '製造業',
        budget: 1000,
        contractType: 'プロダクト主導型',
        successPattern: 'startup_product_led',
        outcome: 'success'
      }
    ];

    // 新規案件の顧客条件
    const newDealCondition = {
      employeeCount: 500,
      industry: '製造業',
      budget: 5000
    };

    // AIRecommendationEngineのスタブを作成
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_A',
          approach: 'large_enterprise_long_term',
          description: '大企業向け・長期契約型アプローチ'
        },
        {
          patternId: 'pattern_B',
          approach: 'mid_size_phased_adoption',
          description: '中堅企業向け・段階導入型アプローチ'
        },
        {
          patternId: 'pattern_C',
          approach: 'startup_product_led',
          description: 'スタートアップ向け・プロダクト主導型アプローチ'
        }
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((patternId: string) => {
          const scoreMap: Record<string, number> = {
            pattern_A: 0.95,
            pattern_B: 0.92,
            pattern_C: 0.87
          };
          return scoreMap[patternId] || 0;
        })
    };

    // 成功パターン抽出・照合機能を実行
    const result = extractSuccessPatternsAndEvaluate(
      historicalDeals,
      newDealCondition,
      aiRecommendationEngineStub
    );

    // 抽出されたパターン数が3件であることを確認
    expect(result.patterns.length).toBe(3);

    // 各パターンが異なるアプローチを持つことを確認
    expect(result.patterns[0].approach).toBe('large_enterprise_long_term');
    expect(result.patterns[1].approach).toBe('mid_size_phased_adoption');
    expect(result.patterns[2].approach).toBe('startup_product_led');

    // 各パターンに対するrelevanceスコアが異なる値であることを確認
    expect(result.patterns[0].relevanceScore).toBe(0.95);
    expect(result.patterns[1].relevanceScore).toBe(0.92);
    expect(result.patterns[2].relevanceScore).toBe(0.87);

    // スコアの高い順（降順）にパターンがソートされていることを確認
    expect(result.patterns[0].relevanceScore).toBeGreaterThanOrEqual(
      result.patterns[1].relevanceScore
    );
    expect(result.patterns[1].relevanceScore).toBeGreaterThanOrEqual(
      result.patterns[2].relevanceScore
    );

    // AIRecommendationEngineの呼び出し確認
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      historicalDeals,
      newDealCondition
    );
  });
});