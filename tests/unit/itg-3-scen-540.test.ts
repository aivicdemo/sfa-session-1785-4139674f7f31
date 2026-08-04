import { extractImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-540: [edge] 改善対象項目抽出機能 - 改善優先度スコアが欠落しているときアイテムが抽出から除外される
  test('改善優先度スコアがnullのアイテムは抽出結果から除外される', () => {
    const input_items = [
      {
        item_id: 'item-001',
        improvement_priority_score: 8.5,
      },
      {
        item_id: 'item-002',
        improvement_priority_score: null,
      },
      {
        item_id: 'item-003',
        improvement_priority_score: 7.2,
      },
    ];

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn((item: any) => {
        if (item.item_id === 'item-001') return 0.85;
        if (item.item_id === 'item-002') return 0.0;
        if (item.item_id === 'item-003') return 0.72;
        return 0.0;
      }),
    };

    const result = extractImprovementItems(input_items, mock_ai_engine);

    expect(result).toHaveLength(2);
    expect(result.map((item: any) => item.item_id)).toEqual([
      'item-001',
      'item-003',
    ]);
    expect(result.map((item: any) => item.item_id)).not.toContain('item-002');
  });
});