import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-834
  test('プロセスステップが0件の場合、分析不可エラーを発生させる', () => {
    const analysisInput = {
      targetPeriodStart: '2024-01-01',
      targetPeriodEnd: '2024-01-31',
      processSteps: [],
      contractResults: [
        { contractId: 'C001', salesPersonId: 'SP001', contractAmount: 100000, contractDate: '2024-01-15' },
        { contractId: 'C002', salesPersonId: 'SP002', contractAmount: 150000, contractDate: '2024-01-20' },
        { contractId: 'C003', salesPersonId: 'SP001', contractAmount: 200000, contractDate: '2024-01-25' },
        { contractId: 'C004', salesPersonId: 'SP003', contractAmount: 120000, contractDate: '2024-01-10' },
        { contractId: 'C005', salesPersonId: 'SP002', contractAmount: 180000, contractDate: '2024-01-28' }
      ]
    };

    expect(() => analyzeProcessDeviationAndCorrelation(analysisInput)).toThrow(/プロセスステップ/);
  });
});