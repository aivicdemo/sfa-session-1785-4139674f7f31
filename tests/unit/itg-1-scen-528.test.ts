import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-528: 成功パターンのみ存在する場合、失敗パターンは空として正確に表現される', () => {
    // テストデータ: 営業担当者Aの成功パターン（契約成立に至った行動シーケンス）3件
    const success_patterns = [
      {
        sequence_id: 'seq_001',
        salesperson_id: 'A001',
        actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
        outcome: 'success',
        created_at: new Date('2024-01-05T09:00:00Z'),
      },
      {
        sequence_id: 'seq_002',
        salesperson_id: 'A001',
        actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
        outcome: 'success',
        created_at: new Date('2024-01-12T10:30:00Z'),
      },
      {
        sequence_id: 'seq_003',
        salesperson_id: 'A001',
        actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
        outcome: 'success',
        created_at: new Date('2024-01-20T14:15:00Z'),
      },
    ];

    // 失敗パターン: 0件
    const failure_patterns: typeof success_patterns = [];

    // 行動パターン分析レポート生成関数を呼び出し
    const report = generateSalesPatternAnalysisReport({
      salesperson_id: 'A001',
      analysis_start_date: new Date('2024-01-01T00:00:00Z'),
      analysis_end_date: new Date('2024-01-31T23:59:59Z'),
      success_patterns,
      failure_patterns,
    });

    // 成功パターンフィールドを確認: 3件の成功パターンが配列で格納
    expect(report.success_patterns).toHaveLength(3);
    expect(report.success_patterns[0]).toEqual({
      sequence_id: 'seq_001',
      salesperson_id: 'A001',
      actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
      outcome: 'success',
      created_at: new Date('2024-01-05T09:00:00Z'),
    });
    expect(report.success_patterns[1]).toEqual({
      sequence_id: 'seq_002',
      salesperson_id: 'A001',
      actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
      outcome: 'success',
      created_at: new Date('2024-01-12T10:30:00Z'),
    });
    expect(report.success_patterns[2]).toEqual({
      sequence_id: 'seq_003',
      salesperson_id: 'A001',
      actions: ['initial_contact', 'proposal', 'negotiation', 'contract_concluded'],
      outcome: 'success',
      created_at: new Date('2024-01-20T14:15:00Z'),
    });

    // 失敗パターンフィールドを確認: 空配列[]
    expect(report.failure_patterns).toEqual([]);
    expect(report.failure_patterns).toHaveLength(0);

    // 失敗件数を確認: 0
    expect(report.failure_count).toBe(0);

    // 失敗率を確認: 0%
    expect(report.failure_rate).toBe(0);

    // パターン集計結果を確認
    expect(report.pattern_aggregation_result).toEqual({
      success_pattern_count: 3,
      failure_pattern_count: 0,
      total_action_sequences: 3,
    });

    // レポート全体の整合性確認
    expect(report.salesperson_id).toBe('A001');
    expect(report.analysis_start_date).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(report.analysis_end_date).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(report.success_count).toBe(3);
    expect(report.success_rate).toBe(100);
  });
});