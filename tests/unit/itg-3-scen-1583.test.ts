import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  // SCEN-1583
  test('過去成功パターンが0件のとき、エラーが発生する', () => {
    const mockPatternMaster: unknown[] = [];

    const stubFindSimilarPatterns = jest.fn().mockReturnValue([]);

    const engine = new AIRecommendationEngine(
      mockPatternMaster,
      stubFindSimilarPatterns
    );

    const newDealData = {
      customerName: 'テスト太郎',
      industry: 'IT',
      budgetScale: 5000000,
    };

    expect(() => {
      engine.generateRecommendation(newDealData);
    }).toThrow(/利用可能な過去成功パターンが見つかりません/);

    try {
      engine.generateRecommendation(newDealData);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain('営業担当者にお問い合わせください');
      }
      const errorWithCode = error as { code?: string };
      expect(errorWithCode.code).toBe('NO_PATTERNS_AVAILABLE');
    }
  });
});