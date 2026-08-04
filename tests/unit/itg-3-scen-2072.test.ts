import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2072
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 顧客対応パターンが成功パターンと合致した度合いを0～100のスコアで数値化できる', () => {
    // 第1案件: スコア85の顧客対応パターン
    const firstPatternInput = {
      customerIndustry: '製造業',
      dealSize: 10000000,
      proposalContent: '生産効率化ソリューション',
      responsePattern: '初期ヒアリング後、ROI試算シート提示→経営層説得→導入承認'
    };

    const firstPatternStub = {
      evaluatePatternRelevance: () => 85
    };

    const firstScore = evaluatePatternRelevance(firstPatternInput, firstPatternStub);
    expect(firstScore).toBe(85);
    expect(typeof firstScore).toBe('number');
    expect(firstScore).toBeGreaterThanOrEqual(0);
    expect(firstScore).toBeLessThanOrEqual(100);
    expect(Number.isInteger(firstScore)).toBe(true);

    // 第2案件: スコア32の顧客対応パターン
    const secondPatternInput = {
      customerIndustry: '製造業',
      dealSize: 10000000,
      proposalContent: '生産効率化ソリューション',
      responsePattern: '初期ヒアリング→提案書送付→フォローメール対応'
    };

    const secondPatternStub = {
      evaluatePatternRelevance: () => 32
    };

    const secondScore = evaluatePatternRelevance(secondPatternInput, secondPatternStub);
    expect(secondScore).toBe(32);
    expect(typeof secondScore).toBe('number');
    expect(secondScore).toBeGreaterThanOrEqual(0);
    expect(secondScore).toBeLessThanOrEqual(100);
    expect(Number.isInteger(secondScore)).toBe(true);

    // スコア比較: 第1案件（85）が第2案件（32）より高い
    expect(firstScore).toBeGreaterThan(secondScore);
    expect(firstScore - secondScore).toBe(53);
  });
});