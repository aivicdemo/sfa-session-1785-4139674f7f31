import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 修正済みデータ品質再検証', () => {
  test('SCEN-437: 入力データが空である場合、エラーが発生する', () => {
    // 空の文字列を入力
    expect(() => validateCorrectedDataQuality('')).toThrow(/EMPTY_INPUT_DATA/);

    // null を入力
    expect(() => validateCorrectedDataQuality(null as any)).toThrow(/EMPTY_INPUT_DATA/);

    // 空の配列を入力
    expect(() => validateCorrectedDataQuality([])).toThrow(/EMPTY_INPUT_DATA/);
  });
});