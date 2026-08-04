import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-560
  test('新規案件の顧客条件が複数個のときすべてを満たす成功パターンが推奨される', () => {
    // Arrange: 新規案件の顧客条件を設定
    const customerConditions = [
      { type: '業種', value: '製造業' },
      { type: '従業員数', value: '1000名以上' },
      { type: '年間予算', value: '5000万円以上' }
    ];

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedPatterns: [
          {
            patternId: 'SP-001',
            matchingConditions: ['業種：製造業', '従業員数：1000名以上', '年間予算：5000万円以上'],
            contractRate: 87,
            reasoningExplanation: '入力された3つすべての顧客条件を満たす成功パターンです。過去の類似案件で87%の成約率を実現しました。'
          },
          {
            patternId: 'SP-002',
            matchingConditions: ['業種：製造業', '従業員数：1000名以上'],
            contractRate: 62,
            reasoningExplanation: '入力された顧客条件のうち2つに合致するパターンです。成約率は62%です。'
          }
        ]
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: generateRecommendationメソッドを呼び出し
    const result = generateRecommendation(
      customerConditions,
      mockAIEngine
    );

    // Assert: 戻り値を確認
    expect(result).resolves.toBeDefined();

    result.then((recommendations) => {
      // 推奨パターンの1番目（最優先）がパターンID『SP-001』であることを確認
      expect(recommendations.recommendedPatterns[0].patternId).toBe('SP-001');

      // 『3つすべての顧客条件を満たす』ことが根拠説明に明記されていることを確認
      expect(recommendations.recommendedPatterns[0].reasoningExplanation).toMatch(/3つすべての顧客条件を満たす/);

      // 成約率87%が表示されることを確認
      expect(recommendations.recommendedPatterns[0].contractRate).toBe(87);

      // パターンID『SP-002』が2番目に位置づけられていることを確認
      const sp002Index = recommendations.recommendedPatterns.findIndex(
        (p: { patternId: string }) => p.patternId === 'SP-002'
      );
      expect(sp002Index).toBe(1);
    });
  });
});