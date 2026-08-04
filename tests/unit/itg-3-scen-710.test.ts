import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-710
  test('顧客データ完全性・妥当性判定機能 - 過去に同一顧客との商談記録が1件のとき、推奨生成に必要なデータセットは妥当と判定される', () => {
    const customerId = 'CUST-001';
    const customerData = {
      customer_id: customerId,
      customer_name: 'テスト顧客A',
      industry: '製造業',
      company_size: '中堅企業',
    };

    const pastDealRecords = [
      {
        deal_id: 'DEAL-001',
        customer_id: customerId,
        deal_date: '2024-01-15T10:00:00Z',
        product_category: '機械設備',
        transaction_amount: 5000000,
        contract_flag: true,
      },
    ];

    const inputPayload = {
      customer_id: customerId,
      customer_data: customerData,
      past_deal_records: pastDealRecords,
    };

    const result = validateCustomerDataCompleteness(inputPayload);

    expect(result).toEqual({
      is_valid: true,
      completeness_score: 1.0,
      data_quality_judgment: true,
      required_fields_status: {
        customer_id_exists: true,
        customer_name_exists: true,
        industry_exists: true,
        company_size_exists: true,
        deal_records_count: 1,
        deal_date_exists: true,
        product_category_exists: true,
        transaction_amount_exists: true,
      },
      can_proceed_to_recommendation: true,
      message: 'データセット完全性スコア: 1.0、妥当性判定: true',
    });
  });
});