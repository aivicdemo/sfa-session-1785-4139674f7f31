import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-386
  test('成約実績の成約金額が業務上の最大規模のとき、正しく計算される', () => {
    const salesPersonId = 'SALES-001';
    const maxContractAmount = 999999999;
    const contractCount = 1;
    const expectedAverageAmount = 999999999;

    const input = {
      salesPersonId: salesPersonId,
      contractRecords: [
        {
          contractId: 'CONTRACT-MAX-001',
          amount: maxContractAmount,
          contractDate: '2024-01-15T10:00:00Z',
          customerId: 'CUST-001',
        },
      ],
      analysisStartDate: '2024-01-01T00:00:00Z',
      analysisEndDate: '2024-01-31T23:59:59Z',
    };

    const result = generateSalesPatternAnalysisReport(input);

    expect(result).toBeDefined();
    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.contractSummary.totalContractAmount).toBe(maxContractAmount);
    expect(result.contractSummary.contractCount).toBe(contractCount);
    expect(result.contractSummary.averageContractAmount).toBe(expectedAverageAmount);
    expect(Number.isFinite(result.contractSummary.totalContractAmount)).toBe(true);
    expect(Number.isFinite(result.contractSummary.averageContractAmount)).toBe(true);
  });
});