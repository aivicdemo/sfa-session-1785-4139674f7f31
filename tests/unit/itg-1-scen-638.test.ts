import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateCustomerPatternMatchDegree } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-638
  test('顧客対応パターンと成功パターンの合致度がちょうど閾値（80%）のとき、合致度として正確に計算される', () => {
    // テストデータ準備: 5項目の顧客対応パターン
    // 項目: 接触頻度、対応時間、提案内容、フォローアップ間隔、初回対応日時
    const salesperson_customer_pattern = {
      contact_frequency: 3,          // 月3回
      response_time_hours: 24,       // 24時間以内返答
      proposal_content_category: 'A', // カテゴリA
      followup_interval_days: 7,     // 7日間隔
      initial_contact_date: '2024-01-01T09:00:00Z'
    };

    // テストデータ準備: 成功パターン（過去の成約事例の対応パターン）
    // 同じ5項目で定義、4項目が一致、1項目が不一致となるように設定
    const success_pattern = {
      contact_frequency: 3,          // 一致
      response_time_hours: 24,       // 一致
      proposal_content_category: 'A', // 一致
      followup_interval_days: 14,    // 不一致（7日 vs 14日）
      initial_contact_date: '2024-01-01T09:00:00Z' // 一致
    };

    // 合致度計算: 5項目中4項目が一致 → 4/5 = 0.8 = 80%
    const expected_match_degree = 80.0;

    // 実行
    const result = calculateCustomerPatternMatchDegree(
      salesperson_customer_pattern,
      success_pattern
    );

    // 検証: 計算結果が80.0%として返される
    expect(result).toBe(expected_match_degree);
  });
});