import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2062
  test('成功パターン抽出の対象期間が月をまたぐとき、複月の成功パターンが抽出される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          patternName: '既存顧客への提案',
          dealDate: new Date('2024-11-15T00:00:00Z'),
          dealId: 'deal_A',
          successScore: 95,
        },
        {
          patternId: 'pattern_002',
          patternName: '新規業種への営業',
          dealDate: new Date('2024-12-08T00:00:00Z'),
          dealId: 'deal_B',
          successScore: 88,
        },
        {
          patternId: 'pattern_003',
          patternName: '複数決裁者への提案',
          dealDate: new Date('2025-01-22T00:00:00Z'),
          dealId: 'deal_C',
          successScore: 92,
        },
      ]),
    };

    const startDate = new Date('2024-11-01T00:00:00Z');
    const endDate = new Date('2025-01-31T23:59:59Z');

    const result = findSimilarPatterns(
      {
        startDate,
        endDate,
      },
      mockAIRecommendationEngine
    );

    return result.then((patterns) => {
      expect(patterns).toHaveLength(3);
      expect(patterns[0]).toEqual({
        patternId: 'pattern_001',
        patternName: '既存顧客への提案',
        dealDate: new Date('2024-11-15T00:00:00Z'),
        dealId: 'deal_A',
        successScore: 95,
      });
      expect(patterns[1]).toEqual({
        patternId: 'pattern_002',
        patternName: '新規業種への営業',
        dealDate: new Date('2024-12-08T00:00:00Z'),
        dealId: 'deal_B',
        successScore: 88,
      });
      expect(patterns[2]).toEqual({
        patternId: 'pattern_003',
        patternName: '複数決裁者への提案',
        dealDate: new Date('2025-01-22T00:00:00Z'),
        dealId: 'deal_C',
        successScore: 92,
      });
      expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate,
          endDate,
        })
      );
    });
  });
});