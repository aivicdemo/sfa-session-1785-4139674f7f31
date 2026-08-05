import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeCustomerInteractionPatternMatchScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-599
  test('顧客対応パターンが成功パターンと完全に合致している場合、合致度が100として数値化される', () => {
    // 成功パターンの顧客対応フロー定義
    const success_pattern = {
      steps: [
        { step_name: '初回接触', expected_duration_days: 1, contact_type: '電話' },
        { step_name: 'ニーズ把握', expected_duration_days: 3, contact_type: 'ミーティング' },
        { step_name: '提案', expected_duration_days: 5, contact_type: 'メール' },
        { step_name: 'クロージング', expected_duration_days: 7, contact_type: '電話' },
      ],
      target_conversion_rate: 85,
    };

    // 営業担当者の実績データ：成功パターンと完全に合致した顧客対応履歴
    const sales_rep_record = {
      sales_rep_id: 'SR-001',
      customer_id: 'CUST-100',
      customer_interaction_history: [
        {
          interaction_date: '2024-01-15',
          step_name: '初回接触',
          contact_type: '電話',
          duration_days_from_previous: 1,
          notes: '顧客に初回接触',
        },
        {
          interaction_date: '2024-01-18',
          step_name: 'ニーズ把握',
          contact_type: 'ミーティング',
          duration_days_from_previous: 3,
          notes: '顧客のニーズを詳細にヒアリング',
        },
        {
          interaction_date: '2024-01-23',
          step_name: '提案',
          contact_type: 'メール',
          duration_days_from_previous: 5,
          notes: 'カスタマイズされた提案資料を送付',
        },
        {
          interaction_date: '2024-01-30',
          step_name: 'クロージング',
          contact_type: '電話',
          duration_days_from_previous: 7,
          notes: '成約締結',
        },
      ],
      conversion_result: true,
    };

    // 自動分析エンジンを実行し、マッチング処理を開始
    const match_score = analyzeCustomerInteractionPatternMatchScore({
      success_pattern_definition: success_pattern,
      sales_rep_interaction_record: sales_rep_record,
    });

    // マッチング結果の合致度を検証
    expect(match_score.pattern_match_score).toBe(100);
    expect(match_score.report).toContain('パターン合致度：100');
  });
});