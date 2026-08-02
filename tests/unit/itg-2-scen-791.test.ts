import { analyzeOperationsProcess } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析エンジン', () => {
  test('SCEN-791: 分析対象期間の開始日と終了日が同日の場合、その日付の記録のみが抽出される', () => {
    const target_date = '2024-01-15';
    const start_date = target_date;
    const end_date = target_date;

    const operation_records = [
      {
        record_id: 'REC001',
        operation_date: '2024-01-14',
        sales_rep_id: 'SR001',
        customer_id: 'CUS001',
        action_type: 'initial_contact',
        process_step: 'step_1',
        created_at: new Date('2024-01-14T09:00:00Z'),
      },
      {
        record_id: 'REC002',
        operation_date: '2024-01-15',
        sales_rep_id: 'SR001',
        customer_id: 'CUS002',
        action_type: 'proposal',
        process_step: 'step_2',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        record_id: 'REC003',
        operation_date: '2024-01-15',
        sales_rep_id: 'SR002',
        customer_id: 'CUS003',
        action_type: 'negotiation',
        process_step: 'step_3',
        created_at: new Date('2024-01-15T11:30:00Z'),
      },
      {
        record_id: 'REC004',
        operation_date: '2024-01-15',
        sales_rep_id: 'SR003',
        customer_id: 'CUS004',
        action_type: 'follow_up',
        process_step: 'step_2',
        created_at: new Date('2024-01-15T14:00:00Z'),
      },
      {
        record_id: 'REC005',
        operation_date: '2024-01-16',
        sales_rep_id: 'SR001',
        customer_id: 'CUS005',
        action_type: 'contract',
        process_step: 'step_4',
        created_at: new Date('2024-01-16T09:30:00Z'),
      },
      {
        record_id: 'REC006',
        operation_date: '2024-01-16',
        sales_rep_id: 'SR002',
        customer_id: 'CUS006',
        action_type: 'proposal',
        process_step: 'step_2',
        created_at: new Date('2024-01-16T13:00:00Z'),
      },
    ];

    const analysis_result = analyzeOperationsProcess({
      start_date,
      end_date,
      records: operation_records,
    });

    expect(analysis_result.extracted_record_count).toBe(3);
    expect(analysis_result.extracted_records).toHaveLength(3);
    expect(analysis_result.extracted_records[0].record_id).toBe('REC002');
    expect(analysis_result.extracted_records[1].record_id).toBe('REC003');
    expect(analysis_result.extracted_records[2].record_id).toBe('REC004');
    expect(
      analysis_result.extracted_records.every(
        (r) => r.operation_date === '2024-01-15'
      )
    ).toBe(true);
  });
});