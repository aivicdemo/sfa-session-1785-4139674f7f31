import { matchSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1954
  test('新規案件の商談条件が欠落しているときにパターン照合がスキップされる', () => {
    const incompleteBusinessOpportunity = {
      businessOpportunityId: 'opp-20240115-001',
      customerId: 'cust-12345',
      customerIndustry: null,
      customerBudget: 500000,
      implementationSchedule: '2024-04',
      productCategory: 'クラウドERPシステム',
    };

    const result = matchSuccessPatterns(incompleteBusinessOpportunity);

    expect(result).toEqual([]);
  });
});