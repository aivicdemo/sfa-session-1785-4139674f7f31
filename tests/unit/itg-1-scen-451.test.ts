import { analyzeActivityPatternsAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-451
  test('顧客対応記録の時系列が逆順である場合も正しく分析される', () => {
    const salesRepId = 'A001';
    const customerId = 'CUST-X';

    const activityRecords = [
      {
        id: 'REC-3',
        salesRepId,
        customerId,
        activityType: '契約成立',
        timestamp: '2024-01-20T16:00:00Z',
        description: '成約'
      },
      {
        id: 'REC-2',
        salesRepId,
        customerId,
        activityType: 'ニーズ把握',
        timestamp: '2024-01-10T10:00:00Z',
        description: 'ニーズ把握'
      },
      {
        id: 'REC-1',
        salesRepId,
        customerId,
        activityType: '初回接触',
        timestamp: '2024-01-15T14:00:00Z',
        description: '初回接触'
      }
    ];

    const result = analyzeActivityPatternsAndGenerateReport({
      salesRepId,
      activityRecords,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31'
    });

    expect(result.contactFlowAnalysis).toBeDefined();
    expect(result.contactFlowAnalysis.length).toBe(3);

    expect(result.contactFlowAnalysis[0].timestamp).toBe('2024-01-10T10:00:00Z');
    expect(result.contactFlowAnalysis[0].activityType).toBe('ニーズ把握');
    expect(result.contactFlowAnalysis[0].sequence).toBe(1);

    expect(result.contactFlowAnalysis[1].timestamp).toBe('2024-01-15T14:00:00Z');
    expect(result.contactFlowAnalysis[1].activityType).toBe('初回接触');
    expect(result.contactFlowAnalysis[1].sequence).toBe(2);

    expect(result.contactFlowAnalysis[2].timestamp).toBe('2024-01-20T16:00:00Z');
    expect(result.contactFlowAnalysis[2].activityType).toBe('契約成立');
    expect(result.contactFlowAnalysis[2].sequence).toBe(3);

    expect(result.activityCycleDays).toBe(10);
    expect(result.reportGenerated).toBe(true);
  });
});