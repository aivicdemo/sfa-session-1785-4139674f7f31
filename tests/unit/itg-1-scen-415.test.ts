import { calculateMatchingScoreWithRounding } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用判定機能 - 一致度スコア計算の端数処理', () => {
  // SCEN-415
  test('一致度スコア計算で端数が発生した場合、業務定義の丸め方式に従って丸められる', () => {
    // セットアップ: 端数が発生する計算ケース（7 ÷ 3 = 2.333...）
    const numerator = 7;
    const denominator = 3;
    const roundingMethod = 'round'; // 業務定義の丸め方式: 四捨五入

    // 実行
    const result = calculateMatchingScoreWithRounding(
      numerator,
      denominator,
      roundingMethod
    );

    // 期待結果: 2.333... を四捨五入して 2.33
    // (小数点第3位で四捨五入: 2.3333... → 2.33)
    const expectedValue = 2.33;

    // 検証
    expect(result).toBe(expectedValue);
  });
});