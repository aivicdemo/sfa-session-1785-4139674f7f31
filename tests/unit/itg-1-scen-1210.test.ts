import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProcessComplianceCorrelation } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  let mockAiClient: any;

  beforeEach(() => {
    mockAiClient = {
      analyzeCorrelation: jest.fn(),
      recordCalculationDetails: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1210
  test('プロセス実行度99.5%でわずかに下回るときの相関係数が正確に計算される', () => {
    const processComplianceRate = 99.5;
    const salesRepId = 'rep-a-001';
    const analysisStartDate = new Date('2024-07-01T00:00:00Z');
    const analysisEndDate = new Date('2024-12-31T23:59:59Z');

    const contractResults = [
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-07-15T10:30:00Z'),
        contractAmount: 500000,
        isContracted: true,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-08-22T14:00:00Z'),
        contractAmount: 750000,
        isContracted: true,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-09-10T09:00:00Z'),
        contractAmount: 600000,
        isContracted: true,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-09-15T11:00:00Z'),
        contractAmount: 0,
        isContracted: false,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-10-05T13:30:00Z'),
        contractAmount: 800000,
        isContracted: true,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-10-20T15:00:00Z'),
        contractAmount: 0,
        isContracted: false,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-11-12T10:00:00Z'),
        contractAmount: 950000,
        isContracted: true,
      },
      {
        repId: 'rep-a-001',
        contractDate: new Date('2024-12-08T16:30:00Z'),
        contractAmount: 1200000,
        isContracted: true,
      },
    ];

    const processExecutionData = {
      repId: 'rep-a-001',
      complianceRate: 99.5,
      standardCompliancePercentage: 100,
      completedSteps: 199,
      totalSteps: 200,
      dataPoints: [
        { stepName: 'initial_contact', executed: true, plannedDate: '2024-07-01', actualDate: '2024-07-02' },
        { stepName: 'proposal', executed: true, plannedDate: '2024-07-10', actualDate: '2024-07-11' },
        { stepName: 'negotiation', executed: true, plannedDate: '2024-07-20', actualDate: '2024-07-19' },
        { stepName: 'contract', executed: false, plannedDate: '2024-08-01', actualDate: null },
      ],
    };

    const calculationRecordFlag = true;

    mockAiClient.recordCalculationDetails.mockReturnValue({
      calculationMethod: 'pearson_correlation',
      datasetSize: 8,
      analysisStartDate: '2024-07-01',
      analysisEndDate: '2024-12-31',
      amountRange: { min: 0, max: 1200000 },
      contractCount: 6,
      lostCount: 2,
      filteringApplied: false,
      excludedDataPoints: 0,
      intermediateValues: {
        contractRates: [1, 1, 1, 0, 1, 0, 1, 1],
        correlationNumerator: 1.875,
        correlationDenominator: 2.165,
      },
    });

    mockAiClient.analyzeCorrelation.mockReturnValue({
      correlationCoefficient: 0.8658,
      pValue: 0.0127,
      sampleSize: 8,
      significanceLevel: 0.05,
      isSignificant: true,
      interpretedTrend: 'positive_correlation',
    });

    const result = analyzeProcessComplianceCorrelation(
      {
        salesRepId,
        processComplianceRate,
        standardCompliancePercentage: 100,
        completedSteps: 199,
        totalSteps: 200,
        processExecutionData,
      },
      {
        contractResults,
        analysisStartDate,
        analysisEndDate,
      },
      mockAiClient,
      calculationRecordFlag
    );

    expect(result).toBeDefined();
    expect(result.correlationCoefficient).toBe(0.8658);
    expect(Math.abs(result.correlationCoefficient - 0.8658)).toBeLessThanOrEqual(0.0001);

    expect(mockAiClient.recordCalculationDetails).toHaveBeenCalled();
    const recordedDetails = mockAiClient.recordCalculationDetails.mock.results[0].value;
    expect(recordedDetails).toBeDefined();
    expect(recordedDetails.datasetSize).toBe(8);
    expect(recordedDetails.excludedDataPoints).toBe(0);
    expect(recordedDetails.filteringApplied).toBe(false);

    expect(recordedDetails.analysisStartDate).toBe('2024-07-01');
    expect(recordedDetails.analysisEndDate).toBe('2024-12-31');
    expect(recordedDetails.amountRange.min).toBe(0);
    expect(recordedDetails.amountRange.max).toBe(1200000);

    expect(result.calculationDetails).toBeDefined();
    expect(result.calculationDetails.calculationMethod).toBe('pearson_correlation');
    expect(result.calculationDetails.datasetSize).toBe(8);

    expect(result.complianceRateAtAnalysis).toBe(99.5);
    expect(result.complianceRateAtAnalysis).toBeLessThan(100);
    expect(result.complianceRateAtAnalysis).toBeGreaterThanOrEqual(99);

    expect(result.verificationReport).toBeDefined();
    expect(result.verificationReport).toHaveProperty('usedDataPoints');
    expect(result.verificationReport).toHaveProperty('calculationLogic');
    expect(result.verificationReport).toHaveProperty('intermediateCalculations');

    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledWith(
      expect.objectContaining({
        complianceRate: 99.5,
        standardCompliancePercentage: 100,
      }),
      expect.objectContaining({
        contractResults,
      })
    );
  });
});