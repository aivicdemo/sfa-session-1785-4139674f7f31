import { detectAndExcludeOutOfPeriodReferences } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-678
  test('推奨内容根拠の可視化機能 - 過去事例の日付が期間外のとき、その事例は根拠から除外される', () => {
    const past_examples = [
      {
        example_id: 'A',
        contract_date: '2024-01-15',
        customer_name: 'Customer A',
        industry: 'IT',
        deal_amount: 1000000,
      },
      {
        example_id: 'B',
        contract_date: '2023-06-20',
        customer_name: 'Customer B',
        industry: 'Finance',
        deal_amount: 2000000,
      },
      {
        example_id: 'C',
        contract_date: '2024-02-28',
        customer_name: 'Customer C',
        industry: 'Manufacturing',
        deal_amount: 1500000,
      },
    ];

    const period_start = '2024-01-01';
    const period_end = '2024-03-31';

    const visible_references = detectAndExcludeOutOfPeriodReferences(
      past_examples,
      period_start,
      period_end,
    );

    expect(visible_references).toEqual([
      {
        example_id: 'A',
        contract_date: '2024-01-15',
        customer_name: 'Customer A',
        industry: 'IT',
        deal_amount: 1000000,
      },
      {
        example_id: 'C',
        contract_date: '2024-02-28',
        customer_name: 'Customer C',
        industry: 'Manufacturing',
        deal_amount: 1500000,
      },
    ]);
    expect(visible_references.length).toBe(2);
    expect(visible_references.every((ref) => ref.example_id !== 'B')).toBe(
      true,
    );
  });
});