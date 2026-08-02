import { extractFailurePatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-832
  test('行動ログデータが0件のとき、失敗パターン抽出が空結果で返される', () => {
    const behaviorLogs: any[] = [];

    const result = extractFailurePatterns(behaviorLogs);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});