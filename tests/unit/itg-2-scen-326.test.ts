import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-326
  test('標準プロセスとの乖離度が改善指導対象の閾値未満の場合、改善指導対象と判定されない', () => {
    const improvementThreshold = 80;
    const deviationRate = 85;

    const salesData = {
      salesPersonId: 'SP001',
      customerId: 'CUST001',
      deviationRate: deviationRate,
      initialContactDate: '2024-01-10T09:00:00Z',
      proposalDate: '2024-01-15T14:30:00Z',
      negotiationDate: '2024-01-20T11:00:00Z',
      contractDate: '2024-01-25T16:00:00Z',
      processSteps: ['initial_contact', 'proposal', 'negotiation', 'contract']
    };

    const result = validateSalesDataQuality(salesData, improvementThreshold);

    expect(result.isImprovementTarget).toBe(false);
    expect(result.deviationRate).toBe(85);
    expect(result.threshold).toBe(80);
    expect(result.status).toBe('not_targeted');
    expect(result.reason).toContain('not_targeted');
  });
});