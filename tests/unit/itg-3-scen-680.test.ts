import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能', () => {
  test('SCEN-680: 同一の関連度スコアを持つ複数パターンがすべてランク付けして返される', async () => {
    const mockEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'P001', score: 0.85, rank: null },
        { patternId: 'P002', score: 0.85, rank: null },
        { patternId: 'P003', score: 0.85, rank: null },
      ]),
    };

    const dealConditions = {
      customerIndustry: 'IT',
      customerSize: 'large',
      dealAmount: 500000,
      dealStage: 'proposal',
    };

    const result = await findSimilarPatterns(dealConditions, mockEngine);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      patternId: 'P001',
      score: 0.85,
      rank: 1,
    });
    expect(result[1]).toEqual({
      patternId: 'P002',
      score: 0.85,
      rank: 2,
    });
    expect(result[2]).toEqual({
      patternId: 'P003',
      score: 0.85,
      rank: 3,
    });
    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledWith(dealConditions);
  });
});