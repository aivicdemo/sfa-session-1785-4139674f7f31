import { searchDealByConditions } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 商談検索', () => {
  // SCEN-934
  test('営業担当者が商談内容を入力した場合、商談テーブルから対応する商談レコードが正常に検索される', async () => {
    const search_start_time = Date.now();

    const search_conditions = {
      customer_name: 'ABC株式会社',
      deal_stage: '提案段階',
      product_category: 'クラウドソリューション',
      amount_min: 5000000,
      amount_max: 10000000,
    };

    const result = await searchDealByConditions(search_conditions);

    const search_elapsed_ms = Date.now() - search_start_time;

    expect(result).toBeDefined();
    expect(Array.isArray(result.deals)).toBe(true);
    expect(result.deals.length).toBeGreaterThanOrEqual(1);

    const matched_deal = result.deals[0];
    expect(matched_deal.deal_id).toBeDefined();
    expect(typeof matched_deal.deal_id).toBe('string');
    expect(matched_deal.deal_id.length).toBeGreaterThan(0);

    expect(matched_deal.customer_name).toBe('ABC株式会社');
    expect(matched_deal.deal_stage).toBe('提案段階');
    expect(matched_deal.product_category).toBe('クラウドソリューション');
    expect(matched_deal.deal_amount).toBeGreaterThanOrEqual(5000000);
    expect(matched_deal.deal_amount).toBeLessThanOrEqual(10000000);

    expect(matched_deal.customer_info).toBeDefined();
    expect(typeof matched_deal.customer_info).toBe('object');

    expect(matched_deal.deal_datetime).toBeDefined();
    const deal_date = new Date(matched_deal.deal_datetime);
    expect(deal_date instanceof Date && !isNaN(deal_date.getTime())).toBe(true);

    expect(matched_deal.assigned_sales_person).toBeDefined();
    expect(typeof matched_deal.assigned_sales_person).toBe('string');
    expect(matched_deal.assigned_sales_person.length).toBeGreaterThan(0);

    expect(matched_deal.current_stage).toBe('提案段階');

    expect(search_elapsed_ms).toBeLessThanOrEqual(3000);
  });
});