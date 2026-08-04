import { generateRecommendationWithPatternMatching } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1548
  test('適合性スコアが推奨判定閾値より直上の場合、提案アプローチが推奨される', () => {
    const mockRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.51),
      generateRecommendation: jest.fn().mockReturnValue({
        approachName: '顧客の既存システムとの連携重視型提案',
        rationale: '過去同業種案件で連携提案の成約率が78%',
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockReturnValue('貴社の製造プロセスデータとの統合実績が豊富です'),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
    };

    const newDealData = {
      customerIndustry: '製造業',
      budgetScale: '5000万円',
      implementationUrgency: '3ヶ月以内',
    };

    const result = generateRecommendationWithPatternMatching(
      newDealData,
      mockRecommendationEngine
    );

    expect(result.recommended).toBe(true);
    expect(result.relevanceScore).toBe(0.51);
    expect(result.approachName).toBe(
      '顧客の既存システムとの連携重視型提案'
    );
    expect(result.rationale).toBe('過去同業種案件で連携提案の成約率が78%');
    expect(result.explanation).toBe(
      '貴社の製造プロセスデータとの統合実績が豊富です'
    );
  });
});