import { describe, test, expect } from '@jest/globals';
import { calculateProcessDeviationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-597: 提案内容が標準プロセスから部分的に乖離している場合、乖離度が0から100の間の数値として正確に計算される', () => {
    // 前提: 標準営業プロセスの定義
    // 初期接触 → ニーズ分析 → 提案 → クロージングの4ステップ
    // 各ステップに実施項目5項目を設定
    const standard_process_definition = {
      steps: [
        {
          step_id: 'step_1',
          step_name: '初期接触',
          required_items: 5,
        },
        {
          step_id: 'step_2',
          step_name: 'ニーズ分析',
          required_items: 5,
        },
        {
          step_id: 'step_3',
          step_name: '提案',
          required_items: 5,
        },
        {
          step_id: 'step_4',
          step_name: 'クロージング',
          required_items: 5,
        },
      ],
    };

    // 営業担当者の提案行動データ
    // 標準プロセスの60%を実施した状態（4ステップ中2.4ステップ相当を完了）
    // ステップ1: 5/5 完了 (100%)
    // ステップ2: 5/5 完了 (100%)
    // ステップ3: 2/5 完了 (40%)
    // ステップ4: 0/5 完了 (0%)
    // 合計: (5 + 5 + 2 + 0) / (5 + 5 + 5 + 5) = 12 / 20 = 0.6 = 60%
    const sales_person_activity_data = {
      sales_person_id: 'sp_001',
      contact_id: 'contact_001',
      steps_completed: [
        {
          step_id: 'step_1',
          items_completed: 5,
          total_items: 5,
        },
        {
          step_id: 'step_2',
          items_completed: 5,
          total_items: 5,
        },
        {
          step_id: 'step_3',
          items_completed: 2,
          total_items: 5,
        },
        {
          step_id: 'step_4',
          items_completed: 0,
          total_items: 5,
        },
      ],
    };

    // 乖離度計算機能を実行
    // 期待値計算:
    // - 実行度 = 60%
    // - 乖離度 = 100 - 60 = 40
    const deviation_score = calculateProcessDeviationScore(
      standard_process_definition,
      sales_person_activity_data
    );

    // 期待結果の検証
    // 1. 乖離度が40として計算される
    expect(deviation_score).toBe(40);

    // 2. 返却値が0以上100以下の整数値である
    expect(deviation_score).toBeGreaterThanOrEqual(0);
    expect(deviation_score).toBeLessThanOrEqual(100);
    expect(Number.isInteger(deviation_score)).toBe(true);
  });
});