import { extractSuccessPatternsForRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  test('SCEN-2061: 成功パターン抽出の対象期間の開始日と終了日が同一のとき、単日の成功パターンのみが抽出される', () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      extractHistoricalPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern-a',
          patternName: 'パターンA',
          dealDate: new Date('2026-01-15T09:00:00Z'),
          successIndicator: true,
          customerIndustry: '製造業',
          dealAmount: 5000000,
        },
        {
          patternId: 'pattern-b',
          patternName: 'パターンB',
          dealDate: new Date('2026-01-15T10:30:00Z'),
          successIndicator: true,
          customerIndustry: 'IT',
          dealAmount: 3000000,
        },
        {
          patternId: 'pattern-c',
          patternName: 'パターンC',
          dealDate: new Date('2026-01-15T14:00:00Z'),
          successIndicator: true,
          customerIndustry: '金融',
          dealAmount: 8000000,
        },
        {
          patternId: 'pattern-d',
          patternName: 'パターンD',
          dealDate: new Date('2026-01-14T11:00:00Z'),
          successIndicator: true,
          customerIndustry: '製造業',
          dealAmount: 4500000,
        },
        {
          patternId: 'pattern-e',
          patternName: 'パターンE',
          dealDate: new Date('2026-01-16T15:00:00Z'),
          successIndicator: true,
          customerIndustry: 'サービス',
          dealAmount: 2500000,
        },
      ]),
    };

    const extractCondition = {
      startDate: new Date('2026-01-15T00:00:00Z'),
      endDate: new Date('2026-01-15T23:59:59Z'),
      minSuccessIndicator: true,
    };

    // Act: 成功パターン抽出処理を実行
    const result = extractSuccessPatternsForRecommendation(
      extractCondition,
      mockAIEngine
    );

    // Assert: 抽出結果を検証
    expect(result).toBeDefined();
    expect(result.extractedPatterns).toHaveLength(3);

    const extractedPatternIds = result.extractedPatterns.map(
      (p: { patternId: string }) => p.patternId
    );
    expect(extractedPatternIds).toEqual(['pattern-a', 'pattern-b', 'pattern-c']);

    expect(result.extractedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ patternId: 'pattern-a' }),
        expect.objectContaining({ patternId: 'pattern-b' }),
        expect.objectContaining({ patternId: 'pattern-c' }),
      ])
    );

    result.extractedPatterns.forEach(
      (pattern: { dealDate: string | number | Date }) => {
        const patternDateString = new Date(pattern.dealDate)
          .toISOString()
          .split('T')[0];
        expect(patternDateString).toBe('2026-01-15');
      }
    );

    expect(result.extractedPatterns.every((p: { patternId: string }) =>
      ['pattern-a', 'pattern-b', 'pattern-c'].includes(p.patternId)
    )).toBe(true);
  });
});