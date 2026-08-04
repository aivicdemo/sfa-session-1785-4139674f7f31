import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-157
  test('[edge] 類似パターン検索ランク付け機能 - 類似度スコアが高い順に1件のパターンが返却される', async () => {
    const dealCondition = {
      customerSize: '中堅企業',
      industry: '製造業',
      challenge: 'DX推進',
    };

    const mockPatternA = {
      id: 'pattern_001',
      customerSize: '中堅企業',
      industry: '製造業',
      pastSuccessCase: '既存システムのクラウド化推進',
      similarityScore: 0.95,
    };

    const mockPatternB = {
      id: 'pattern_002',
      customerSize: '中堅企業',
      industry: '製造業',
      pastSuccessCase: 'デジタル化推進',
      similarityScore: 0.87,
    };

    const mockPatternC = {
      id: 'pattern_003',
      customerSize: '大企業',
      industry: '小売業',
      pastSuccessCase: 'オムニチャネル化',
      similarityScore: 0.72,
    };

    const mockSimilarPatterns = [mockPatternA, mockPatternB, mockPatternC];

    const mockEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
    };

    const result = await findSimilarPatterns(dealCondition, mockEngine);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('pattern_001');
    expect(result[0].similarityScore).toBe(0.95);
    expect(result[0].customerSize).toBe('中堅企業');
    expect(result[0].industry).toBe('製造業');
  });
});