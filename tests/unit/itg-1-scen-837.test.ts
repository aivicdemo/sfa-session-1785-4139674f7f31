import { analyzeConversionCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-837
  test('成約実績が0件の場合、相関分析不可エラーを発生させる', () => {
    const analysisPeriod = {
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-01-31'),
    };

    const salesActivityData = [
      {
        activity_id: 'ACT001',
        salesperson_id: 'SP001',
        customer_id: 'CUST001',
        activity_type: '訪問',
        activity_date: new Date('2024-01-10'),
        process_step: '初回接触',
      },
      {
        activity_id: 'ACT002',
        salesperson_id: 'SP001',
        customer_id: 'CUST001',
        activity_type: '提案',
        activity_date: new Date('2024-01-15'),
        process_step: '提案',
      },
    ];

    const conversionRecords: any[] = [];

    const salesProcessDefinition = {
      process_id: 'PROC001',
      step_sequence: ['初回接触', '提案', '交渉', '成約'],
      required_days_between_steps: {
        '初回接触': 3,
        '提案': 5,
        '交渉': 7,
      },
    };

    const result = analyzeConversionCorrelation({
      period: analysisPeriod,
      activities: salesActivityData,
      conversions: conversionRecords,
      processDefinition: salesProcessDefinition,
    });

    expect(result.success).toBe(false);
    expect(result.error_code).toBe('CORRELATION_ANALYSIS_UNAVAILABLE');
    expect(result.error_message).toMatch(/成約実績.*0件/);
    expect(result.error_message).toMatch(/相関分析/);
    expect(result.log_entries).toContainEqual(
      expect.objectContaining({
        log_type: '成約件数',
        log_value: 0,
      })
    );
    expect(result.log_entries).toContainEqual(
      expect.objectContaining({
        log_type: '相関分析スキップ',
      })
    );
    expect(result.log_entries).toContainEqual(
      expect.objectContaining({
        log_type: '営業管理者への通知対象',
      })
    );
    expect(result.analysis_report).toBeNull();
  });
});