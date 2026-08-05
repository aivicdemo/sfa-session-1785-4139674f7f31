import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-215: 標準プロセス遵守度スコア計算機能 - 営業担当者の商談記録が標準プロセスの一部ステップのみを実行している場合、遵守度スコアが部分的に低下した値で計算される', () => {
    // Arrange: テスト用の営業担当者データと標準プロセス定義を準備
    const sales_rep_id = 'rep_001';
    const deal_id = 'deal_12345';
    
    // 標準プロセスの5ステップを定義（各ステップ20点配分、合計100点）
    const process_steps = [
      {
        step_id: 'step_1',
        step_name: '初期接触',
        weight_score: 20,
      },
      {
        step_id: 'step_2',
        step_name: 'ニーズ調査',
        weight_score: 20,
      },
      {
        step_id: 'step_3',
        step_name: '提案',
        weight_score: 20,
      },
      {
        step_id: 'step_4',
        step_name: '商談',
        weight_score: 20,
      },
      {
        step_id: 'step_5',
        step_name: 'クロージング',
        weight_score: 20,
      },
    ];
    
    // 商談記録データ：ステップ1,2,3は完了、ステップ4,5は未実行
    const deal_records = [
      {
        step_id: 'step_1',
        is_completed: true,
        completed_date: '2024-01-10T09:00:00Z',
      },
      {
        step_id: 'step_2',
        is_completed: true,
        completed_date: '2024-01-12T10:30:00Z',
      },
      {
        step_id: 'step_3',
        is_completed: true,
        completed_date: '2024-01-15T14:00:00Z',
      },
      {
        step_id: 'step_4',
        is_completed: false,
      },
      {
        step_id: 'step_5',
        is_completed: false,
      },
    ];
    
    // Act: スコア計算機能を実行
    const result = calculateProcessComplianceScore({
      sales_rep_id: sales_rep_id,
      deal_id: deal_id,
      process_steps: process_steps,
      deal_records: deal_records,
    });
    
    // Assert: 計算結果が60点であることを検証
    // 完了した3ステップ × 20点 = 60点
    // 未実行の2ステップ × 0点 = 0点
    // 合計 = 60点
    expect(result.compliance_score).toBe(60);
    expect(result.total_possible_score).toBe(100);
    expect(result.completed_steps_count).toBe(3);
    expect(result.total_steps_count).toBe(5);
    expect(result.sales_rep_id).toBe(sales_rep_id);
    expect(result.deal_id).toBe(deal_id);
  });
});