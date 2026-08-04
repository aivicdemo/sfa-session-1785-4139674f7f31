import { getRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - AIエージェント推奨支援', () => {
  // SCEN-555
  test('過去商談データが0件のとき、推奨提案アプローチが代替リストから返される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(async () => {
        // API呼び出し失敗をシミュレート（タイムアウトを想定）
        throw new Error('API call timeout after 30 seconds');
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealInput = {
      customerIndustry: 'IT企業',
      dealAmount: 5000000,
      decisionMaker: '経営層',
      purchaseCycle: '3ヶ月',
    };

    const result = await getRecommendation(newDealInput, mockAIRecommendationEngine);

    // AIエージェントへの呼び出しが試行されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: 'IT企業',
        dealAmount: 5000000,
        decisionMaker: '経営層',
        purchaseCycle: '3ヶ月',
      })
    );

    // フォールバック時の戻り値構造を検証
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        approachName: expect.any(String),
        successRate: expect.any(Number),
        targetIndustry: expect.any(Array),
        recommendedActions: expect.any(Array),
        reasoning: expect.any(String),
      })
    );

    // 推奨内容が統計的に上位パターンであることを確認
    // successRate が 60 以上であることが高成功率パターンの条件
    expect(result.successRate).toBeGreaterThanOrEqual(60);

    // reasoning が簡略版説明（推奨パターンマスタ由来）であることを確認
    expect(result.reasoning).toMatch(/過去商談データから同一|類似条件|全体統計|高成功率パターン|参考に提案/);

    // reasoning に外部AI生成文の特徴（例：「以下は...です」「このパターンは...」）がないことを確認
    expect(result.reasoning).not.toMatch(/^このパターンは|^以下は|^AIが分析した|^根拠は/);

    // targetIndustry に入力顧客業種が含まれるか、または全業種対応パターンであること
    expect(
      result.targetIndustry.includes('IT企業') || result.targetIndustry.includes('全業種')
    ).toBe(true);

    // recommendedActions が配列で、かつ要素が存在すること
    expect(Array.isArray(result.recommendedActions)).toBe(true);
    expect(result.recommendedActions.length).toBeGreaterThan(0);

    // successRate が 0～100 の範囲内であること
    expect(result.successRate).toBeLessThanOrEqual(100);
    expect(result.successRate).toBeGreaterThanOrEqual(0);
  });
});