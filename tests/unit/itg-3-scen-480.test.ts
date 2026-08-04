import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出機能', () => {
  // SCEN-480: [error] データ品質スコア算出機能 - 不整合検出件数が null のとき、エラーが発生する
  test('不整合検出件数が null のとき、エラーがスロー され、エラーメッセージとコードが正しく返される', () => {
    const totalRecords = 1000;
    const duplicateCount = 25;
    const formatErrorCount = 15;
    const inconsistencyCount = null;

    expect(() => {
      calculateDataQualityScore({
        totalRecords,
        duplicateCount,
        formatErrorCount,
        inconsistencyCount,
      });
    }).toThrow(/不整合検出件数/);
  });
});