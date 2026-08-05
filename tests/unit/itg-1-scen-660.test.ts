import { analyzeSalesProcessDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス遵守状況の監視と改善 - 標準プロセス比較分析', () => {
  // SCEN-660: [normal] 提案内容と顧客対応パターンの標準プロセス比較分析 - 営業担当者の顧客対応記録が標準プロセスから逸脱する場合、異常パターンが検出される
  test('should detect process deviation when sales representative skips required process steps', () => {
    // 標準プロセス定義: 5段階
    const standardProcess = [
      { step_id: 1, step_name: '初期面談', sequence_order: 1 },
      { step_id: 2, step_name: 'ニーズヒアリング', sequence_order: 2 },
      { step_id: 3, step_name: '提案資料作成', sequence_order: 3 },
      { step_id: 4, step_name: '提案プレゼン', sequence_order: 4 },
      { step_id: 5, step_name: '契約', sequence_order: 5 },
    ];

    // 営業担当者Aの顧客対応記録: ニーズヒアリングと提案資料作成をスキップ
    const actual_contact_record = [
      { step_id: 1, step_name: '初期面談', executed_date: '2024-01-15T10:00:00Z' },
      { step_id: 4, step_name: '提案プレゼン', executed_date: '2024-01-20T14:30:00Z' },
      { step_id: 5, step_name: '契約', executed_date: '2024-01-25T16:00:00Z' },
    ];

    const input = {
      sales_representative_id: 'SR-001',
      standard_process_steps: standardProcess,
      actual_contact_records: actual_contact_record,
    };

    const result = analyzeSalesProcessDeviation(input);

    // 期待結果の検証
    expect(result.detection_category).toBe('プロセス逸脱');
    expect(result.missing_steps).toEqual(['ニーズヒアリング', '提案資料作成']);
    expect(result.deviation_score).toBe(85);
    expect(result.risk_level).toBe('高');
  });
});