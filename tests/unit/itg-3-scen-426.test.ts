import { extractImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  // SCEN-426
  test('重複する不整合項目が含まれる場合、重複が排除されて返される', () => {
    const input_inconsistent_items = [
      '顧客ニーズ未把握',
      '提案根拠不足',
      '顧客ニーズ未把握',
      'フォローアップ遅延',
      '提案根拠不足',
    ];

    const result = extractImprovementTargets(input_inconsistent_items);

    const expected_sorted_unique_items = [
      'フォローアップ遅延',
      '提案根拠不足',
      '顧客ニーズ未把握',
    ];

    expect(result).toEqual(expected_sorted_unique_items);
    expect(result.length).toBe(3);
    expect(input_inconsistent_items.length).toBe(5);
    expect(result.length).toBeLessThan(input_inconsistent_items.length);

    const input_unique_set = new Set(input_inconsistent_items);
    expect(result.length).toBe(input_unique_set.size);

    const duplicated_items = ['顧客ニーズ未把握', '提案根拠不足'];
    duplicated_items.forEach((item) => {
      const count_in_input = input_inconsistent_items.filter(
        (x) => x === item
      ).length;
      expect(count_in_input).toBeGreaterThan(1);
      expect(result.filter((x) => x === item).length).toBe(1);
    });
  });
});