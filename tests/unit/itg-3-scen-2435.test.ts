import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 成功パターン適用可能性スコアが0.1の場合', () => {
  test('SCEN-2435: 適用可能性スコア0.1の成功パターンがマッチ対象として組み込まれ推奨スコア計算に含まれること', () => {
    // スタブ化されたAIRecommendationEngine
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn((patternId: string): number => {
        if (patternId === 'pattern-low-relevance') {
          return 0.1;
        }
        return 0.8;
      })
    };

    // テスト入力パラメータ
    const newCaseId = 'case-2435-001';
    const customerIndustry = 'manufacturing';
    const dealAmount = 5000000;
    const successPatterns = [
      {
        patternId: 'pattern-high-relevance',
        name: '高適用可能性パターン',
        description: '適用可能性が高いパターン'
      },
      {
        patternId: 'pattern-medium-relevance',
        name: '中程度適用可能性パターン',
        description: '中程度の適用可能性'
      },
      {
        patternId: 'pattern-low-relevance',
        name: '低適用可能性パターン',
        description: '適用可能性スコア0.1のパターン'
      }
    ];

    // 推奨精度スコア算出機能を実行
    const result = evaluateRecommendationScore(
      {
        newCaseId,
        customerIndustry,
        dealAmount,
        successPatterns
      },
      aiEngineStub
    );

    // 適用可能性スコア0.1のパターンがマッチ対象として組み込まれているか確認
    const lowRelevancePattern = result.matchedPatterns.find(
      (p) => p.patternId === 'pattern-low-relevance'
    );

    expect(lowRelevancePattern).toBeDefined();
    expect(lowRelevancePattern?.isMatched).toBe(true);
    expect(lowRelevancePattern?.relevanceScore).toBe(0.1);
    expect(typeof lowRelevancePattern?.contributionScore).toBe('number');
    expect(lowRelevancePattern?.contributionScore).toBeGreaterThanOrEqual(0);

    // 最終推奨スコアが0以上の値として計算されているか確認
    expect(typeof result.finalRecommendationScore).toBe('number');
    expect(result.finalRecommendationScore).toBeGreaterThanOrEqual(0);
    expect(result.finalRecommendationScore).toBeLessThanOrEqual(100);

    // マッチ対象フラグが正しく設定されているか確認
    expect(lowRelevancePattern?.isMatched).toBe(true);
  });
});