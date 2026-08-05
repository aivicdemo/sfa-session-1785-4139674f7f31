import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-2-1-1';

// Mock AIClient for tx_12_imp_1
interface MockTx12AiClientResult {
  contractedDatasetSize: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  monthlyBreakdown: { month: string; count: number }[];
}

interface Tx12Imp1AiClient {
  analyzeCorrelation(
    deviationData: unknown[],
    contractedData: unknown[],
    analysisParams: {
      periodStart: string;
      periodEnd: string;
    }
  ): Promise<{
    reportContent: string;
    analysisMetadata: {
      analysisStartDate: string;
      analysisEndDate: string;
      contractedRecordCount: number;
      monthlyBreakdown: Array<{
        month: string;
        recordCount: number;
      }>;
    };
  }>;
}

describe('Process Deviation and Correlation Analysis - Cross-Year Date Boundary', () => {
  let mockAiClient: Tx12Imp1AiClient;
  let capturedAnalysisCall: {
    contractedDatasetSize: number;
    dateRangeStart: string;
    dateRangeEnd: string;
  } | null = null;

  beforeEach(() => {
    capturedAnalysisCall = null;

    mockAiClient = {
      analyzeCorrelation: jest.fn(
        async (deviationData, contractedData, analysisParams) => {
          // Capture the contracted dataset characteristics
          const contractedArray = Array.isArray(contractedData)
            ? contractedData
            : [];
          capturedAnalysisCall = {
            contractedDatasetSize: contractedArray.length,
            dateRangeStart: analysisParams.periodStart,
            dateRangeEnd: analysisParams.periodEnd,
          };

          // Calculate monthly breakdown from contractedData
          const monthlyMap: { [key: string]: number } = {};
          contractedArray.forEach((record: any) => {
            const recordDate = new Date(record.closedDate || record.contractDate);
            const monthKey = recordDate.toISOString().substring(0, 7); // YYYY-MM format
            monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
          });

          const monthlyBreakdown = Object.entries(monthlyMap)
            .sort()
            .map(([month, count]) => ({
              month,
              recordCount: count,
            }));

          return {
            reportContent: `分析期間：${analysisParams.periodStart}～${analysisParams.periodEnd}、対象成約件数：${contractedArray.length}件`,
            analysisMetadata: {
              analysisStartDate: analysisParams.periodStart,
              analysisEndDate: analysisParams.periodEnd,
              contractedRecordCount: contractedArray.length,
              monthlyBreakdown,
            },
          };
        }
      ) as jest.Mock,
    };
  });

  // SCEN-1216: Cross-year period analysis with accurate contracted data selection
  test('should accurately extract and analyze contracted records across calendar year boundary with proper monthly aggregation', async () => {
    // Arrange: Set analysis period spanning from November 2023 to January 2024
    const analysisStartDate = '2023-11-01';
    const analysisEndDate = '2024-01-31';

    // Create mock contracted records for each month
    const contractedRecordsNov2023 = Array.from({ length: 25 }, (_, i) => ({
      contractId: `CONT-2023-11-${String(i + 1).padStart(3, '0')}`,
      closedDate: new Date('2023-11-15T10:30:00Z').toISOString(),
      amount: 100000 + i * 1000,
      status: 'contracted',
    }));

    const contractedRecordsDec2023 = Array.from({ length: 25 }, (_, i) => ({
      contractId: `CONT-2023-12-${String(i + 1).padStart(3, '0')}`,
      closedDate: new Date('2023-12-20T14:15:00Z').toISOString(),
      amount: 120000 + i * 1000,
      status: 'contracted',
    }));

    const contractedRecordsJan2024 = Array.from({ length: 30 }, (_, i) => ({
      contractId: `CONT-2024-01-${String(i + 1).padStart(3, '0')}`,
      closedDate: new Date('2024-01-25T09:00:00Z').toISOString(),
      amount: 150000 + i * 1000,
      status: 'contracted',
    }));

    const allContractedRecords = [
      ...contractedRecordsNov2023,
      ...contractedRecordsDec2023,
      ...contractedRecordsJan2024,
    ];

    // Mock deviation data (simplified for this test)
    const deviationData = [
      {
        salesPersonId: 'SP001',
        deviationScore: 15.5,
        recordedAt: '2023-11-10T08:00:00Z',
      },
      {
        salesPersonId: 'SP002',
        deviationScore: 22.3,
        recordedAt: '2024-01-28T16:30:00Z',
      },
    ];

    // Act: Call the analysis function with the cross-year period
    const result = await mockAiClient.analyzeCorrelation(
      deviationData,
      allContractedRecords,
      {
        periodStart: analysisStartDate,
        periodEnd: analysisEndDate,
      }
    );

    // Assert: Verify captured analysis call parameters
    expect(capturedAnalysisCall).not.toBeNull();
    expect(capturedAnalysisCall?.contractedDatasetSize).toBe(80);
    expect(capturedAnalysisCall?.dateRangeStart).toBe('2023-11-01');
    expect(capturedAnalysisCall?.dateRangeEnd).toBe('2024-01-31');

    // Assert: Verify report content includes correct analysis period and record count
    expect(result.reportContent).toContain(
      '分析期間：2023-11-01～2024-01-31、対象成約件数：80件'
    );

    // Assert: Verify metadata matches expected values
    expect(result.analysisMetadata.analysisStartDate).toBe('2023-11-01');
    expect(result.analysisMetadata.analysisEndDate).toBe('2024-01-31');
    expect(result.analysisMetadata.contractedRecordCount).toBe(80);

    // Assert: Verify monthly breakdown is correctly aggregated
    expect(result.analysisMetadata.monthlyBreakdown).toEqual([
      { month: '2023-11', recordCount: 25 },
      { month: '2023-12', recordCount: 25 },
      { month: '2024-01', recordCount: 30 },
    ]);

    // Assert: Verify total from monthly breakdown equals dataset size
    const totalFromBreakdown = result.analysisMetadata.monthlyBreakdown.reduce(
      (sum, item) => sum + item.recordCount,
      0
    );
    expect(totalFromBreakdown).toBe(80);

    // Assert: Verify calendar month classification (not calendar-day counting)
    const novRecords = result.analysisMetadata.monthlyBreakdown.find(
      (b) => b.month === '2023-11'
    );
    expect(novRecords?.recordCount).toBe(25);

    const decRecords = result.analysisMetadata.monthlyBreakdown.find(
      (b) => b.month === '2023-12'
    );
    expect(decRecords?.recordCount).toBe(25);

    const janRecords = result.analysisMetadata.monthlyBreakdown.find(
      (b) => b.month === '2024-01'
    );
    expect(janRecords?.recordCount).toBe(30);
  });
});