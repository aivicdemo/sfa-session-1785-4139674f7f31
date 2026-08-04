import { roundRelevancePercentage } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性判定の丸め処理', () => {
  test('SCEN-1273: 適合度パーセンテージが小数第1位で端数が出る場合に丸め処理が正確に行われる', () => {
    // ケース1：適合度スコア75.34 → 丸め対象（小数第1位の3を四捨五入、小数点以下切り捨て）
    const result_case1 = roundRelevancePercentage(75.34);
    expect(result_case1).toBe(75);

    // ケース2：適合度スコア82.67 → 丸め対象（小数第1位の6を四捨五入、小数点以下切り上げ）
    const result_case2 = roundRelevancePercentage(82.67);
    expect(result_case2).toBe(83);

    // ケース3：適合度スコア91.43 → 丸め対象（小数第1位の4を四捨五入、小数点以下切り捨て）
    const result_case3 = roundRelevancePercentage(91.43);
    expect(result_case3).toBe(91);

    // ケース4：適合度スコア80.00 → 丸め不要（小数点以下が0なため丸め不要）
    const result_case4 = roundRelevancePercentage(80.00);
    expect(result_case4).toBe(80);

    // すべてのテストケースで返却値が整数値（小数点なし）であることを確認
    expect(Number.isInteger(result_case1)).toBe(true);
    expect(Number.isInteger(result_case2)).toBe(true);
    expect(Number.isInteger(result_case3)).toBe(true);
    expect(Number.isInteger(result_case4)).toBe(true);
  });
});