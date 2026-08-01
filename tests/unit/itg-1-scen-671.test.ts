import { calculatePriorityScoreForMultiplePatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-671
  test('[normal] 改善優先度スコア算出機能 - 同じ優先度スコアの問題パターンが複数存在するとき並び順が安定している', () => {
    // Arrange: 同じスコア値（85）を持つ3つの問題パターンを定義
    const issuePatternA = {
      patternId: 'pattern_a',
      patternName: '提案内容不適切',
      frequency: 5,
      impactLevel: 3,
    };
    const issuePatternB = {
      patternId: 'pattern_b',
      patternName: '顧客対応遅延',
      frequency: 5,
      impactLevel: 3,
    };
    const issuePatternC = {
      patternId: 'pattern_c',
      patternName: 'フォローアップ不足',
      frequency: 5,
      impactLevel: 3,
    };

    // 1回目の算出実行
    const result1 = calculatePriorityScoreForMultiplePatterns([
      issuePatternA,
      issuePatternB,
      issuePatternC,
    ]);

    // 2回目の算出実行
    const result2 = calculatePriorityScoreForMultiplePatterns([
      issuePatternA,
      issuePatternB,
      issuePatternC,
    ]);

    // 3回目の算出実行
    const result3 = calculatePriorityScoreForMultiplePatterns([
      issuePatternA,
      issuePatternB,
      issuePatternC,
    ]);

    // 1回目の並び順を記録
    const order1 = result1.map((item) => item.patternId);

    // 2回目の並び順を記録
    const order2 = result2.map((item) => item.patternId);

    // 3回目の並び順を記録
    const order3 = result3.map((item) => item.patternId);

    // Assert: 3回すべての実行で同じ並び順が保持されていることを検証
    expect(order1).toEqual(order2);
    expect(order2).toEqual(order3);

    // さらに具体的に、すべての結果で同じスコア値（85）を持つことを検証
    expect(result1[0].priorityScore).toBe(85);
    expect(result1[1].priorityScore).toBe(85);
    expect(result1[2].priorityScore).toBe(85);

    expect(result2[0].priorityScore).toBe(85);
    expect(result2[1].priorityScore).toBe(85);
    expect(result2[2].priorityScore).toBe(85);

    expect(result3[0].priorityScore).toBe(85);
    expect(result3[1].priorityScore).toBe(85);
    expect(result3[2].priorityScore).toBe(85);
  });
});