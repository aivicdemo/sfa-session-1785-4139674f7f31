import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  // SCEN-861
  test('分析対象期間が異なる複数の成約実績が存在する場合、期間別に相関を分別する', () => {
    const periodAContracts = [
      { contractDate: '2024-01-05', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-08', visitCount: 2, proposalCreated: true, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-01-12', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-15', visitCount: 2, proposalCreated: false, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-18', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-22', visitCount: 1, proposalCreated: true, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-01-25', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-26', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-01-28', visitCount: 3, proposalCreated: false, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-01-31', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true }
    ];

    const periodBContracts = [
      { contractDate: '2024-02-03', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-02-07', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-02-10', visitCount: 1, proposalCreated: false, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-02-14', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-02-18', visitCount: 3, proposalCreated: true, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-02-21', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-02-25', visitCount: 1, proposalCreated: false, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-02-28', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true }
    ];

    const periodCContracts = [
      { contractDate: '2024-03-02', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-05', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-08', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-12', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-15', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-18', visitCount: 3, proposalCreated: true, quotationSubmitted: false, contractSigned: true },
      { contractDate: '2024-03-22', visitCount: 2, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-25', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-28', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-30', visitCount: 2, proposalCreated: false, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-31', visitCount: 3, proposalCreated: true, quotationSubmitted: true, contractSigned: true },
      { contractDate: '2024-03-31', visitCount: 4, proposalCreated: true, quotationSubmitted: true, contractSigned: true }
    ];

    const standardProcess = {
      steps: [
        { stepName: '訪問回数', targetRate: 0.9 },
        { stepName: '提案資料作成', targetRate: 0.85 },
        { stepName: '見積提示', targetRate: 0.80 },
        { stepName: '契約締結', targetRate: 1.0 }
      ]
    };

    const contractData = [
      ...periodAContracts.map(c => ({ ...c, period: 'A' })),
      ...periodBContracts.map(c => ({ ...c, period: 'B' })),
      ...periodCContracts.map(c => ({ ...c, period: 'C' }))
    ];

    const result = analyzeProcessDeviationAndCorrelation({
      contractResults: contractData,
      standardProcess: standardProcess,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-03-31'
    });

    expect(result).toBeDefined();
    expect(result.report).toBeDefined();
    expect(result.report.periodAnalyses).toBeDefined();
    expect(Array.isArray(result.report.periodAnalyses)).toBe(true);
    expect(result.report.periodAnalyses.length).toBe(3);

    const periodAAnalysis = result.report.periodAnalyses.find((p: any) => p.period === 'A');
    const periodBAnalysis = result.report.periodAnalyses.find((p: any) => p.period === 'B');
    const periodCAnalysis = result.report.periodAnalyses.find((p: any) => p.period === 'C');

    expect(periodAAnalysis).toBeDefined();
    expect(periodBAnalysis).toBeDefined();
    expect(periodCAnalysis).toBeDefined();

    expect(typeof periodAAnalysis.correlationCoefficient).toBe('number');
    expect(typeof periodBAnalysis.correlationCoefficient).toBe('number');
    expect(typeof periodCAnalysis.correlationCoefficient).toBe('number');

    expect(periodAAnalysis.correlationCoefficient).toBeCloseTo(0.72, 1);
    expect(periodBAnalysis.correlationCoefficient).toBeCloseTo(0.65, 1);
    expect(periodCAnalysis.correlationCoefficient).toBeCloseTo(0.78, 1);

    expect(periodAAnalysis.correlationCoefficient).not.toBe(periodBAnalysis.correlationCoefficient);
    expect(periodBAnalysis.correlationCoefficient).not.toBe(periodCAnalysis.correlationCoefficient);
    expect(periodAAnalysis.correlationCoefficient).not.toBe(periodCAnalysis.correlationCoefficient);

    expect(periodAAnalysis.dataSet).toBeDefined();
    expect(periodAAnalysis.dataSet.contractCount).toBe(10);
    expect(Array.isArray(periodAAnalysis.dataSet.deviationDistribution)).toBe(true);

    expect(periodBAnalysis.dataSet).toBeDefined();
    expect(periodBAnalysis.dataSet.contractCount).toBe(8);
    expect(Array.isArray(periodBAnalysis.dataSet.deviationDistribution)).toBe(true);

    expect(periodCAnalysis.dataSet).toBeDefined();
    expect(periodCAnalysis.dataSet.contractCount).toBe(12);
    expect(Array.isArray(periodCAnalysis.dataSet.deviationDistribution)).toBe(true);

    expect(periodAAnalysis.calculationLogic).toBeDefined();
    expect(typeof periodAAnalysis.calculationLogic).toBe('string');
    expect(periodAAnalysis.calculationLogic.length).toBeGreaterThan(0);

    expect(periodBAnalysis.calculationLogic).toBeDefined();
    expect(typeof periodBAnalysis.calculationLogic).toBe('string');
    expect(periodBAnalysis.calculationLogic.length).toBeGreaterThan(0);

    expect(periodCAnalysis.calculationLogic).toBeDefined();
    expect(typeof periodCAnalysis.calculationLogic).toBe('string');
    expect(periodCAnalysis.calculationLogic.length).toBeGreaterThan(0);

    expect(result.report.generatedAt).toBeDefined();
    expect(result.report.analysisMethod).toBeDefined();
    expect(result.report.analysisMethod).toContain('correlation');
  });
});