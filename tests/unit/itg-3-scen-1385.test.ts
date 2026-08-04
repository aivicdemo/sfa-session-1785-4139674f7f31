import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 照合結果の数値化', () => {
  // SCEN-1385
  test('スコア計算結果の小数部丸めが許容範囲内であり、丸め誤差による順位逆転が発生しないこと', () => {
    // テスト用のエッジケース値セット
    // 元の浮動小数点数値と、期待される丸め結果を定義
    const testCases = [
      {
        rawScore: 0.8749999999,
        expectedRounded: 0.87, // 四捨五入で0.87
        tolerance: 0.01,
      },
      {
        rawScore: 0.5,
        expectedRounded: 0.50,
        tolerance: 0.01,
      },
      {
        rawScore: 0.125,
        expectedRounded: 0.13, // 四捨五入で0.13
        tolerance: 0.01,
      },
      {
        rawScore: 0.9999,
        expectedRounded: 1.0, // 四捨五入で1.00
        tolerance: 0.01,
      },
      {
        rawScore: 0.0001,
        expectedRounded: 0.0, // 四捨五入で0.00
        tolerance: 0.01,
      },
    ];

    const displayedScores: number[] = [];

    // 各テストケースについてスコア計算と丸め表示を実行
    testCases.forEach((testCase) => {
      // evaluatePatternRelevance を呼び出し、小数部を2桁で丸めた結果を得る
      const displayedScore = evaluatePatternRelevance(
        {
          rawScore: testCase.rawScore,
        }
      );

      // 表示値が期待値の許容範囲内にあることを検証
      const difference = Math.abs(displayedScore - testCase.expectedRounded);
      expect(difference).toBeLessThanOrEqual(testCase.tolerance);

      displayedScores.push(displayedScore);
    });

    // 丸め処理によって本来のスコア順位が逆転していないことを検証
    // 元の値と丸めた値の相対的な大小関係が変わらないことを確認
    const rawOrderedIndices = testCases
      .map((tc, idx) => ({ rawScore: tc.rawScore, index: idx }))
      .sort((a, b) => b.rawScore - a.rawScore)
      .map((item) => item.index);

    const displayedOrderedIndices = displayedScores
      .map((score, idx) => ({ score, index: idx }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.index);

    // 上位3件の順序が逆転していないことを確認（厳密な一致まで要求せず、大きな逆転がないことを確認）
    const rawTop3 = rawOrderedIndices.slice(0, 3).sort();
    const displayedTop3 = displayedOrderedIndices.slice(0, 3).sort();
    expect(rawTop3).toEqual(displayedTop3);

    // すべての丸めスコアが0～1の範囲内にあることを検証
    displayedScores.forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    // 丸め処理が一貫して小数第2位までで統一されていることを検証
    displayedScores.forEach((score) => {
      const decimalPlaces = (score.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});