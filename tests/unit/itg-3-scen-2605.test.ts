import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2605: 推奨パターンの根拠が複数の成功要因を含む場合、すべての要因が説明文に表示される', () => {
    // Arrange: 複数の成功要因を含む推奨パターンオブジェクト
    const recommendationPattern = {
      patternId: 'pattern-001',
      recommendedApproach: 'Case study approach',
      successFactors: [
        {
          factorId: 'factor-1',
          factorName: '顧客業界',
          factorValue: '製造業',
          weight: 0.25
        },
        {
          factorId: 'factor-2',
          factorName: '提案金額',
          factorValue: '500万円以上1000万円未満',
          weight: 0.25
        },
        {
          factorId: 'factor-3',
          factorName: '意思決定者',
          factorValue: '経営層',
          weight: 0.25
        },
        {
          factorId: 'factor-4',
          factorName: '導入期間',
          factorValue: '3ヶ月以内',
          weight: 0.25
        }
      ],
      relevanceScore: 92
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue(recommendationPattern),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '過去の成功パターンから、顧客業界が製造業という点、提案金額が500万円以上1000万円未満という条件、意思決定者が経営層であるという属性、導入期間が3ヶ月以内に設定されているという制約の4つの要因が揃った案件では、提案の採用率が95%に達しています。これらの要因すべてが満たされることで、営業プロセスの標準化と顧客ニーズの適合度が最大化されます。'
      ),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // Act: 推奨根拠の可視化機能を実行
    const explanationResult = explainRecommendationReasoning(
      recommendationPattern,
      aiRecommendationEngineStub
    );

    // Assert: すべての成功要因が説明文に含まれていることを検証
    expect(explanationResult).toContain('製造業');
    expect(explanationResult).toContain('500万円以上1000万円未満');
    expect(explanationResult).toContain('経営層');
    expect(explanationResult).toContain('3ヶ月以内');
    
    // 成功要因の個数が4つであることを確認
    expect(recommendationPattern.successFactors).toHaveLength(4);
    
    // 各成功要因の値が説明文に存在することを再確認
    recommendationPattern.successFactors.forEach((factor) => {
      expect(explanationResult).toContain(factor.factorValue);
    });
  });
});