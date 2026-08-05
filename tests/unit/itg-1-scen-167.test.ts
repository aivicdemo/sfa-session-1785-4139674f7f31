import { generateSystemRequirementsFromStandardBook } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-167
  test('データ項目の要件マッピング機能 - 標準書に0個のデータ項目が列挙されている場合、空のデータ項目リストが生成される', () => {
    const input = {
      standardBookDataItems: [],
    };

    const result = generateSystemRequirementsFromStandardBook(input);

    expect(result.dataItems).toEqual([]);
    expect(result.dataItems.length).toBe(0);
    expect(result.error).toBeUndefined();
  });
});