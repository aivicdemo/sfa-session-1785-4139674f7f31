import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2366: [edge] AIエージェント推論精度スコア算出機能 - 推論精度スコアがちょうど0の場合、正確に0として算出される
  test('推論精度スコアが0の場合、型numberで値が正確に0として返される', () => {
    // 準備: 完全に不関連な商談パターン（推論精度スコアが0となるシナリオ）
    const unrelatedDealConditions = {
      customerIndustry: 'Manufacturing',
      customerSize: 'Large',
      dealStage: 'Initial Contact',
      dealAmount: 5000000,
      dealTimeline: 'Q4 2026',
      customerChallenges: ['Supply Chain Optimization'],
    };

    const successPatternTemplate = {
      applicableIndustries: ['Finance', 'Healthcare'],
      applicableSizes: ['Small', 'Medium'],
      recommendedStage: 'Proposal',
      recommendedAmountRange: { min: 500000, max: 2000000 },
      timelineConstraint: 'Q2-Q3',
      challengeKeywords: ['Digital Transformation', 'Cost Reduction'],
    };

    // 実行: 推論精度スコア算出関数を呼び出し
    const result = evaluatePatternRelevance(
      unrelatedDealConditions,
      successPatternTemplate
    );

    // 検証: 戻り値が型number、値0で正確に返されることを確認
    expect(typeof result).toBe('number');
    expect(result).toBe(0);
    expect(result).not.toBe(null);
    expect(result).not.toBe(undefined);
    expect(result).not.toBe(-0);
    expect(Number.isInteger(result)).toBe(true);
    expect(Object.is(result, 0)).toBe(true);
  });
});