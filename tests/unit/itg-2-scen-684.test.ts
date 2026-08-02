import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-684
  test('推奨内容根拠の可視化機能 - 過去事例が月末の日付のとき、正しく時系列ソートされる', () => {
    const past_examples = [
      {
        example_id: 'A',
        event_date: new Date('2024-01-15T00:00:00Z'),
        description: '事例A',
        success_factor: 'タイムリーな提案',
      },
      {
        example_id: 'B',
        event_date: new Date('2024-01-31T00:00:00Z'),
        description: '事例B',
        success_factor: '月末の成功事例',
      },
      {
        example_id: 'C',
        event_date: new Date('2024-01-20T00:00:00Z'),
        description: '事例C',
        success_factor: '中旬の提案',
      },
    ];

    const result = visualizeRecommendationBasis({
      past_examples: past_examples,
    });

    expect(result.sorted_examples).toHaveLength(3);
    expect(result.sorted_examples[0].example_id).toBe('A');
    expect(result.sorted_examples[1].example_id).toBe('C');
    expect(result.sorted_examples[2].example_id).toBe('B');
  });
});