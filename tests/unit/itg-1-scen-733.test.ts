import { aggregateSuccessPatternAwarenessCompletion } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-733
  test('成功パターン適用ガイドラインの周知完了判定機能 - 営業担当者IDが重複するレコードが存在するときそれぞれ独立に集計される', () => {
    const input_records = [
      {
        record_id: 'REC-001',
        sales_rep_id: 'EMP001',
        awareness_status: '完了',
        awareness_datetime: new Date('2024-01-15T10:00:00Z'),
      },
      {
        record_id: 'REC-002',
        sales_rep_id: 'EMP001',
        awareness_status: '完了',
        awareness_datetime: new Date('2024-01-20T14:30:00Z'),
      },
    ];

    const result = aggregateSuccessPatternAwarenessCompletion(input_records);

    const emp001_records = result.filter(
      (r) => r.sales_rep_id === 'EMP001'
    );

    expect(emp001_records).toHaveLength(2);

    const record_a = emp001_records.find((r) => r.record_id === 'REC-001');
    expect(record_a).toBeDefined();
    expect(record_a?.awareness_status).toBe('完了');
    expect(record_a?.awareness_datetime).toEqual(
      new Date('2024-01-15T10:00:00Z')
    );

    const record_b = emp001_records.find((r) => r.record_id === 'REC-002');
    expect(record_b).toBeDefined();
    expect(record_b?.awareness_status).toBe('完了');
    expect(record_b?.awareness_datetime).toEqual(
      new Date('2024-01-20T14:30:00Z')
    );

    const emp001_completion_count = result.filter(
      (r) => r.sales_rep_id === 'EMP001' && r.awareness_status === '完了'
    ).length;
    expect(emp001_completion_count).toBe(2);
  });
});