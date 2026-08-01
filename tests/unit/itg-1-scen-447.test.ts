import { analyzeCustomerInteractionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-447: 顧客対応記録が複数件入力された場合、全件が標準プロセスと比較される', () => {
    // テストデータ: 同一顧客に対する3件の顧客対応記録
    const analysis_period_start = '2024-01-01T00:00:00Z';
    const analysis_period_end = '2024-01-31T23:59:59Z';
    const customer_id = 'CUST-001';
    
    const interaction_records = [
      {
        interaction_id: 'INT-001',
        customer_id: customer_id,
        interaction_date: '2024-01-05T09:00:00Z',
        interaction_type: 'visit',
        interaction_content: '初回訪問で顧客の基本情報ヒアリング',
        sales_person_id: 'SP-001'
      },
      {
        interaction_id: 'INT-002',
        customer_id: customer_id,
        interaction_date: '2024-01-12T14:00:00Z',
        interaction_type: 'phone',
        interaction_content: '予算確認と購入タイミングのヒアリング',
        sales_person_id: 'SP-002'
      },
      {
        interaction_id: 'INT-003',
        customer_id: customer_id,
        interaction_date: '2024-01-20T10:30:00Z',
        interaction_type: 'visit',
        interaction_content: '見積提示と提案資料による説明',
        sales_person_id: 'SP-001'
      }
    ];

    // 分析対象期間を指定して分析機能を実行
    const report = analyzeCustomerInteractionPatterns({
      customer_id: customer_id,
      period_start: analysis_period_start,
      period_end: analysis_period_end,
      interactions: interaction_records
    });

    // 期待結果1: レポートに入力した3件すべての顧客対応記録が表示される
    expect(report.total_interactions_analyzed).toBe(3);
    expect(report.interactions_in_report).toHaveLength(3);

    // 期待結果2: 各記録に対して標準プロセスの4フェーズのいずれか1つが割り当てられている
    const process_phases = ['initial_contact', 'requirements_gathering', 'proposal', 'closure'];
    
    report.interactions_in_report.forEach((interaction_report: any) => {
      expect(process_phases).toContain(interaction_report.assigned_phase);
      expect(typeof interaction_report.assigned_phase).toBe('string');
    });

    // 期待結果3: 各分類結果に対して対応内容のキーワードが判定根拠として明記される
    // INT-001: 初回訪問 → initial_contact フェーズ
    const report_int_001 = report.interactions_in_report.find((r: any) => r.interaction_id === 'INT-001');
    expect(report_int_001.assigned_phase).toBe('initial_contact');
    expect(report_int_001.classification_reason).toMatch(/初回訪問/);

    // INT-002: 予算確認・購入タイミング → requirements_gathering フェーズ
    const report_int_002 = report.interactions_in_report.find((r: any) => r.interaction_id === 'INT-002');
    expect(report_int_002.assigned_phase).toBe('requirements_gathering');
    expect(report_int_002.classification_reason).toMatch(/予算確認/);

    // INT-003: 見積提示 → proposal フェーズ
    const report_int_003 = report.interactions_in_report.find((r: any) => r.interaction_id === 'INT-003');
    expect(report_int_003.assigned_phase).toBe('proposal');
    expect(report_int_003.classification_reason).toMatch(/見積提示/);

    // 追加確認: レポートメタデータの検証
    expect(report.analysis_start_date).toBe(analysis_period_start);
    expect(report.analysis_end_date).toBe(analysis_period_end);
    expect(report.customer_id).toBe(customer_id);
    expect(report.phase_distribution).toEqual({
      initial_contact: 1,
      requirements_gathering: 1,
      proposal: 1,
      closure: 0
    });
  });
});