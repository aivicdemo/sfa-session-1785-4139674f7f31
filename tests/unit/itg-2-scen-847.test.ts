import { extractSuccessPatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能 - 重複排除と成功パターン抽出', () => {
  // SCEN-847
  test('商談実績データに重複レコードが含まれるとき、重複を除外して成功パターンが抽出される', () => {
    const sales_representative_name_a = '営業太郎';
    const customer_name_a = 'ABC株式会社';
    const deal_datetime_a = '2024-01-15T10:30:00Z';
    const deal_amount_a = 500000;

    const duplicate_deal_record_1 = {
      sales_representative_name: sales_representative_name_a,
      customer_name: customer_name_a,
      deal_datetime: deal_datetime_a,
      deal_amount: deal_amount_a,
    };

    const duplicate_deal_record_2 = {
      sales_representative_name: sales_representative_name_a,
      customer_name: customer_name_a,
      deal_datetime: deal_datetime_a,
      deal_amount: deal_amount_a,
    };

    const deal_records_with_duplicates = [
      duplicate_deal_record_1,
      duplicate_deal_record_2,
    ];

    const result = extractSuccessPatterns(deal_records_with_duplicates);

    expect(result.success_patterns.length).toBe(1);
    expect(result.success_patterns[0].sales_representative_name).toBe(
      sales_representative_name_a
    );
    expect(result.success_patterns[0].customer_name).toBe(customer_name_a);
    expect(result.success_patterns[0].deal_datetime).toBe(deal_datetime_a);
    expect(result.success_patterns[0].deal_amount).toBe(deal_amount_a);
  });
});