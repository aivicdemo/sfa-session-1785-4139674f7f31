import { analyzeProcessExecutionStatus } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-790: 営業プロセス実行状況分析機能 - 同一営業担当者の同期実行において、2回目の分析結果が1回目と同じである', () => {
    const employeeId = 'EMP001';
    const analysisTimestamp1 = new Date('2024-01-15T11:00:00Z');
    const analysisTimestamp2 = new Date('2024-01-15T11:05:00Z');

    const firstResult = analyzeProcessExecutionStatus({
      employee_id: employeeId,
      analysis_date: '2024-01-15',
    });

    const secondResult = analyzeProcessExecutionStatus({
      employee_id: employeeId,
      analysis_date: '2024-01-15',
    });

    expect(firstResult.total_sales).toBe(secondResult.total_sales);
    expect(firstResult.deal_count).toBe(secondResult.deal_count);
    expect(firstResult.progress_rate).toBe(secondResult.progress_rate);
    expect(firstResult.status_breakdown).toEqual(secondResult.status_breakdown);
    expect(firstResult.period_sales_data).toEqual(secondResult.period_sales_data);
    expect(firstResult.process_compliance_score).toBe(secondResult.process_compliance_score);
    expect(firstResult.deviation_patterns).toEqual(secondResult.deviation_patterns);
    expect(firstResult.employee_id).toBe(secondResult.employee_id);
    expect(firstResult.analysis_date).toBe(secondResult.analysis_date);
  });
});