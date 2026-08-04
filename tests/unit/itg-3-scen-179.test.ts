import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出フィルタリング機能', () => {
  // SCEN-179
  test('逆順に並んだ成功パターンを昇順に正規化する', () => {
    // 逆順に並んだ成功パターンデータセット（パターンID: 5, 4, 3, 2, 1）
    const reversedPatterns = [
      {
        pattern_id: 5,
        customer_industry: 'IT',
        deal_amount: 5000000,
        success_timestamp: new Date('2024-01-20T10:00:00Z'),
        match_score: 85,
        applicable_flag: true,
        extraction_date: new Date('2024-01-25T15:30:00Z'),
      },
      {
        pattern_id: 4,
        customer_industry: 'Finance',
        deal_amount: 4000000,
        success_timestamp: new Date('2024-01-15T09:00:00Z'),
        match_score: 80,
        applicable_flag: true,
        extraction_date: new Date('2024-01-24T14:20:00Z'),
      },
      {
        pattern_id: 3,
        customer_industry: 'Manufacturing',
        deal_amount: 3000000,
        success_timestamp: new Date('2024-01-10T08:00:00Z'),
        match_score: 75,
        applicable_flag: true,
        extraction_date: new Date('2024-01-23T13:10:00Z'),
      },
      {
        pattern_id: 2,
        customer_industry: 'Retail',
        deal_amount: 2000000,
        success_timestamp: new Date('2024-01-05T07:00:00Z'),
        match_score: 70,
        applicable_flag: true,
        extraction_date: new Date('2024-01-22T12:00:00Z'),
      },
      {
        pattern_id: 1,
        customer_industry: 'Healthcare',
        deal_amount: 1000000,
        success_timestamp: new Date('2024-01-01T06:00:00Z'),
        match_score: 65,
        applicable_flag: true,
        extraction_date: new Date('2024-01-21T11:00:00Z'),
      },
    ];

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(reversedPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 入力条件
    const queryCondition = {
      customer_industry: 'IT',
      deal_size_range: { min: 1000000, max: 10000000 },
      sales_stage: 'proposal',
    };

    // 成功パターン抽出フィルタリング機能を実行
    const normalizedPatterns = findSimilarPatterns(
      queryCondition,
      mockAIRecommendationEngine
    );

    // 検証1: 配列の長さが5件のまま変わらない
    expect(normalizedPatterns).toHaveLength(5);

    // 検証2: パターンIDが昇順（1, 2, 3, 4, 5）に並んでいること
    expect(normalizedPatterns[0].pattern_id).toBe(1);
    expect(normalizedPatterns[1].pattern_id).toBe(2);
    expect(normalizedPatterns[2].pattern_id).toBe(3);
    expect(normalizedPatterns[3].pattern_id).toBe(4);
    expect(normalizedPatterns[4].pattern_id).toBe(5);

    // 検証3: 各パターンのメタデータが正規化処理中に破損していないこと
    // パターンID=1の検証
    expect(normalizedPatterns[0]).toEqual({
      pattern_id: 1,
      customer_industry: 'Healthcare',
      deal_amount: 1000000,
      success_timestamp: new Date('2024-01-01T06:00:00Z'),
      match_score: 65,
      applicable_flag: true,
      extraction_date: new Date('2024-01-21T11:00:00Z'),
    });

    // パターンID=3の検証
    expect(normalizedPatterns[2]).toEqual({
      pattern_id: 3,
      customer_industry: 'Manufacturing',
      deal_amount: 3000000,
      success_timestamp: new Date('2024-01-10T08:00:00Z'),
      match_score: 75,
      applicable_flag: true,
      extraction_date: new Date('2024-01-23T13:10:00Z'),
    });

    // パターンID=5の検証
    expect(normalizedPatterns[4]).toEqual({
      pattern_id: 5,
      customer_industry: 'IT',
      deal_amount: 5000000,
      success_timestamp: new Date('2024-01-20T10:00:00Z'),
      match_score: 85,
      applicable_flag: true,
      extraction_date: new Date('2024-01-25T15:30:00Z'),
    });

    // 検証4: 昇順に並び替えられていること
    for (let i = 0; i < normalizedPatterns.length - 1; i++) {
      expect(normalizedPatterns[i].pattern_id).toBeLessThan(
        normalizedPatterns[i + 1].pattern_id
      );
    }
  });
});