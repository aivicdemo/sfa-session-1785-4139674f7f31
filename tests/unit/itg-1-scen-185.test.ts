import { analyzeAndJudgeSalesPersonImprovement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-185
  test('顧客接触頻度データが欠落している場合、計算がスキップされエラーが記録される', () => {
    const input = {
      salesPersonId: 'SP001',
      visitCount: 12,
      proposalCount: 8,
      contractRate: 0.45,
      customerContactFrequency: null,
      analysisMonth: '2024-01',
    };

    const result = analyzeAndJudgeSalesPersonImprovement(input);

    expect(result.errorCode).toBe('MISSING_CONTACT_FREQUENCY_DATA');
    expect(result.judgmentStatus).toBe('未判定');
    expect(result.errorMessage).toBe('顧客接触頻度データが不足しているため判定対象外');
    expect(result.isImprovementTarget).toBe(false);
  });
});