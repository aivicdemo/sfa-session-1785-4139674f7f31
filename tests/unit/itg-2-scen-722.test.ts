import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-722
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客予算制約が空のとき予算適合スコア計算が適切に処理される', () => {
    const customerNeeds = {
      customerId: 'CUST-001',
      budget: null,
      industry: 'manufacturing',
      employeeCount: 500,
      businessChallenge: 'cost_reduction',
      implementationTimeline: '2024-Q2',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const proposalDocument = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposedPrice: 5000000,
      productCategory: 'ERP_system',
      implementationDuration: 6,
      createdAt: new Date('2024-01-20T14:30:00Z'),
    };

    const result = calculateProposalNeedsAlignmentScore(
      customerNeeds,
      proposalDocument
    );

    expect(result.budgetAlignmentScore).toBe(0.0);
    expect(result.scoreCalculationStatus).toBe('NOT_APPLICABLE');
    expect(result.logs).toContain('Budget constraint not set');
  });
});