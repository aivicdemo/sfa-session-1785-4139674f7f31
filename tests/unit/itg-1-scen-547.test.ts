import { extractProblemsToAddress } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-547
  test('対応すべき問題が0件の場合、空の抽出結果が返される', () => {
    const empty_dataset = {
      items: [],
      count: 0,
    };

    const result = extractProblemsToAddress(empty_dataset);

    expect(result.items).toEqual([]);
    expect(result.count).toBe(0);
  });
});