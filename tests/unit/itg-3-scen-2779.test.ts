import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2779
  test('顧客業種が欠けている商談レコードが含まれるとき、エラーを返す', () => {
    const pastDealDataset = [
      {
        deal_id: 'DEAL001',
        customer_industry: 'IT',
        deal_amount: 5000000,
        deal_status: 'won',
        sales_approach: 'technical_presentation',
      },
      {
        deal_id: 'DEAL002',
        customer_industry: null,
        deal_amount: 3000000,
        deal_status: 'won',
        sales_approach: 'workshop',
      },
      {
        deal_id: 'DEAL003',
        customer_industry: 'manufacturing',
        deal_amount: 4000000,
        deal_status: 'won',
        sales_approach: 'executive_briefing',
      },
      {
        deal_id: 'DEAL004',
        customer_industry: '',
        deal_amount: 2500000,
        deal_status: 'won',
        sales_approach: 'poc',
      },
    ];

    expect(() => extractSuccessPatternsWithWeighting(pastDealDataset)).toThrow(/顧客業種/);
  });
});