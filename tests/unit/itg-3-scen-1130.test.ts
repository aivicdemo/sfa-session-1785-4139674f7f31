import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターンマッチング評価機能', () => {
  test('SCEN-1130: 適用可能性スコア99点の成功パターンが推奨対象から除外される', () => {
    const customerCondition = {
      industry: '製造業',
      budgetScale: '中堅企業',
      dealStage: '要件定義',
    };

    const successPatterns = [
      {
        id: 'pattern_001',
        industry: '製造業',
        budgetScale: '中堅企業',
        dealStage: '要件定義',
      },
      {
        id: 'pattern_002',
        industry: '製造業',
        budgetScale: '中堅企業',
        dealStage: '提案段階',
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockImplementation((pattern) => {
          if (pattern.id === 'pattern_001') {
            return 99;
          }
          if (pattern.id === 'pattern_002') {
            return 100;
          }
          return 0;
        }),
    };

    const recommendedPatterns = evaluatePatternRelevance(
      customerCondition,
      successPatterns,
      mockAIEngine
    );

    const pattern_001_included = recommendedPatterns.some(
      (p) => p.id === 'pattern_001'
    );
    const pattern_002_included = recommendedPatterns.some(
      (p) => p.id === 'pattern_002'
    );

    expect(pattern_001_included).toBe(false);
    expect(pattern_002_included).toBe(true);
    expect(recommendedPatterns.length).toBe(1);
  });
});