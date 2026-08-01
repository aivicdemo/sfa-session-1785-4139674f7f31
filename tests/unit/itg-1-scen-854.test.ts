import { analyzeProcessComplianceAndContractCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-854
  test('成約実績データが未入力の場合、エラーを発生させる', () => {
    const analysisMonth = '2024-01';
    const salesPersonList = [
      { id: 'SP001', name: '営業太郎' },
      { id: 'SP002', name: '営業花子' }
    ];
    const standardProcessDefinition = {
      steps: [
        { stepId: 'STEP001', name: '初回接触', sequence: 1 },
        { stepId: 'STEP002', name: '提案', sequence: 2 },
        { stepId: 'STEP003', name: '交渉', sequence: 3 },
        { stepId: 'STEP004', name: '成約', sequence: 4 }
      ],
      complianceThreshold: 0.8
    };
    const deviationAnalysisResult = {
      SP001: { complianceScore: 0.75, deviationPatterns: ['STEP002_SKIP'] },
      SP002: { complianceScore: 0.85, deviationPatterns: [] }
    };
    const contractResultData = null;

    expect(() =>
      analyzeProcessComplianceAndContractCorrelation(
        analysisMonth,
        salesPersonList,
        standardProcessDefinition,
        deviationAnalysisResult,
        contractResultData
      )
    ).toThrow(/成約実績データ/);
  });
});