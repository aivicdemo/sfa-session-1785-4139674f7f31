import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-556
  test('成約実績の成約金額が0未満の場合、エラーになる', () => {
    const salesRepId = 'sales_rep_001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';
    const contractAmountInvalid = -100;
    const contractCount = 5;
    const followUpSuccessRate = 0.8;
    const proposalAcceptanceRate = 0.75;

    const input = {
      salesRepId,
      analysisStartDate,
      analysisEndDate,
      contractAmount: contractAmountInvalid,
      contractCount,
      followUpSuccessRate,
      proposalAcceptanceRate,
    };

    const result = generateSalesActivityAnalysisReport(input);

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('INVALID_CONTRACT_AMOUNT');
    expect(result.error?.message).toBe('成約金額は0以上である必要があります');
    expect(result.report).toBeNull();
  });
});