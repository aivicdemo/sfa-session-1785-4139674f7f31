import { calculateSalesRepActionPatternScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-184
  test('提案内容データが欠落している場合、該当項目がNULLとして扱われる', () => {
    const proposalDataWithMissingAmount = {
      proposalAmount: null,
      proposalSummary: '顧客の経営課題に対応したIT化支援',
      customerNeedsUnderstandingLevel: 85,
      salesRepId: 'REP-001',
      customerId: 'CUST-001',
      proposalDate: '2024-01-15T10:00:00Z',
    };

    const result = calculateSalesRepActionPatternScore(proposalDataWithMissingAmount);

    expect(result.proposalAmount).toBeNull();
    expect(result.proposalSummary).toBe('顧客の経営課題に対応したIT化支援');
    expect(result.customerNeedsUnderstandingLevel).toBe(85);
    expect(result.improvementGuidanceRequired).toBe(true);
    expect(result.improvementReasonCode).toBe('提案内容不十分');
  });
});