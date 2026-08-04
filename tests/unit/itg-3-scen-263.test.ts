import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-263
  test('過去商談データから成功パターンが複数件のとき、類似度スコアでランク付けされる', () => {
    const mockPatternA = {
      similarity_score: 0.95,
      pattern_id: 'pattern_001',
      pattern_name: '大規模製造業向け長期契約'
    };
    const mockPatternB = {
      similarity_score: 0.78,
      pattern_id: 'pattern_002',
      pattern_name: '中堅流通業向け段階導入'
    };
    const mockPatternC = {
      similarity_score: 0.62,
      pattern_id: 'pattern_003',
      pattern_name: 'スタートアップ向けライト契約'
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([mockPatternB, mockPatternC, mockPatternA])
    };

    const newDealData = {
      customer_industry: '製造業',
      contract_scale: '大規模',
      implementation_period: '短期'
    };

    return findSimilarPatterns(newDealData, mockAIRecommendationEngine).then((result) => {
      expect(result).toHaveLength(3);
      expect(result[0].similarity_score).toBe(0.95);
      expect(result[0].pattern_id).toBe('pattern_001');
      expect(result[0].pattern_name).toBe('大規模製造業向け長期契約');
      expect(result[1].similarity_score).toBe(0.78);
      expect(result[1].pattern_id).toBe('pattern_002');
      expect(result[1].pattern_name).toBe('中堅流通業向け段階導入');
      expect(result[2].similarity_score).toBe(0.62);
      expect(result[2].pattern_id).toBe('pattern_003');
      expect(result[2].pattern_name).toBe('スタートアップ向けライト契約');
    });
  });
});