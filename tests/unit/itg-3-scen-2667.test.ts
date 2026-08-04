import { evaluateSuccessPattern } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-2667: [edge] 成功パターン自動判定機能 - 入力の商談条件が空オブジェクトのとき、判定不可として処理される', () => {
    const emptyDealCondition = {};
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluateSuccessPattern(emptyDealCondition, mockAIEngine);

    expect(result.status).toBe('UNDETERMINABLE');
    expect(result.message).toMatch(/推奨条件が不足しています/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});