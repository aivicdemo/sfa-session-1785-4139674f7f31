import { calculateFeature } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けロジック - 特徴量計算の丸め処理", () => {
  test("SCEN-2820: 除算で端数が発生したとき、丸め処理後の値が許容精度内に収まる", () => {
    const tolerance = 0.0005;
    const roundingPrecision = 0.001;

    // テストケース1: 10 ÷ 3 = 3.333...
    const numerator1 = 10;
    const denominator1 = 3;
    const result1 = calculateFeature(numerator1, denominator1);
    const expected1 = 3.333;

    expect(result1).toBe(expected1);

    // 許容精度範囲内か確認: expected1 ± tolerance
    const lowerBound1 = expected1 - tolerance;
    const upperBound1 = expected1 + tolerance;
    expect(result1).toBeGreaterThanOrEqual(lowerBound1);
    expect(result1).toBeLessThanOrEqual(upperBound1);

    // テストケース2: 1 ÷ 6 = 0.166...
    const numerator2 = 1;
    const denominator2 = 6;
    const result2 = calculateFeature(numerator2, denominator2);
    const expected2 = 0.167;

    expect(result2).toBe(expected2);

    // 許容精度範囲内か確認: expected2 ± tolerance
    const lowerBound2 = expected2 - tolerance;
    const upperBound2 = expected2 + tolerance;
    expect(result2).toBeGreaterThanOrEqual(lowerBound2);
    expect(result2).toBeLessThanOrEqual(upperBound2);

    // 複数回計算による一貫性確認
    const result1Again = calculateFeature(numerator1, denominator1);
    const result2Again = calculateFeature(numerator2, denominator2);

    expect(result1Again).toBe(result1);
    expect(result2Again).toBe(result2);
  });
});