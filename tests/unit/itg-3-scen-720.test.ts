import { validateRecommendationDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-720
  test('[error] 推奨生成前データ完全性判定機能 - 企業規模（従業員数）が空のとき推奨生成不可と判定される', () => {
    const customerInfo = {
      company_name: 'テスト企業A',
      industry: 'IT',
      employee_count: '',
      annual_revenue: '1000万円以上5000万円未満',
      current_challenge: '営業効率化',
    };

    const result = validateRecommendationDataCompleteness(customerInfo);

    expect(result).toBe(false);
  });
});