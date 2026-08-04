import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2752
  test('推奨精度スコアが小数第3位以下で端数が出るとき、指定の丸めルールに従って基準値と比較される', () => {
    const raw_score = 0.8756;
    const threshold = 0.85;
    const expected_rounded_score = 0.88;

    const result = evaluatePatternRelevance({
      raw_score: raw_score,
      threshold: threshold,
    });

    expect(result.rounded_score).toBe(expected_rounded_score);
    expect(result.is_recommended).toBe(true);
    expect(result.meets_threshold).toBe(true);
  });
});