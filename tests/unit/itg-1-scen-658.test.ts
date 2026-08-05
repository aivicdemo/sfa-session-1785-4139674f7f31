import { analyzeProposalAndCustomerResponsePatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-658
  test('提案内容と顧客対応パターンの標準プロセス比較分析 - 営業担当者の顧客対応記録が標準プロセスと一致する場合、異常パターンが検出されない', () => {
    // 標準プロセス定義：4段階
    const standard_process = [
      {
        stage_id: 'STAGE_001',
        stage_name: '初期接触',
        required_actions: ['顧客情報確認', '初期メール送信'],
        expected_duration_days: 1,
      },
      {
        stage_id: 'STAGE_002',
        stage_name: 'ニーズ確認',
        required_actions: ['電話ヒアリング', 'ニーズ記録'],
        expected_duration_days: 3,
      },
      {
        stage_id: 'STAGE_003',
        stage_name: '提案',
        required_actions: ['提案資料作成', '提案実施'],
        expected_duration_days: 5,
      },
      {
        stage_id: 'STAGE_004',
        stage_name: 'クロージング',
        required_actions: ['契約書確認', '最終合意'],
        expected_duration_days: 3,
      },
    ];

    // 営業担当者A（顧客ID：CUST-001）の対応記録
    // すべての段階で標準プロセスに準拠している
    const sales_rep_activity_records = [
      {
        activity_id: 'ACT_001',
        sales_rep_id: 'SR-A001',
        customer_id: 'CUST-001',
        stage_id: 'STAGE_001',
        stage_name: '初期接触',
        activity_date: new Date('2024-01-01T09:00:00Z'),
        actions_performed: ['顧客情報確認', '初期メール送信'],
        notes: '初期メール送付完了',
      },
      {
        activity_id: 'ACT_002',
        sales_rep_id: 'SR-A001',
        customer_id: 'CUST-001',
        stage_id: 'STAGE_002',
        stage_name: 'ニーズ確認',
        activity_date: new Date('2024-01-03T10:30:00Z'),
        actions_performed: ['電話ヒアリング', 'ニーズ記録'],
        notes: 'ヒアリング完了、ニーズを記録',
      },
      {
        activity_id: 'ACT_003',
        sales_rep_id: 'SR-A001',
        customer_id: 'CUST-001',
        stage_id: 'STAGE_003',
        stage_name: '提案',
        activity_date: new Date('2024-01-08T14:00:00Z'),
        actions_performed: ['提案資料作成', '提案実施'],
        notes: '提案資料作成・実施完了',
      },
      {
        activity_id: 'ACT_004',
        sales_rep_id: 'SR-A001',
        customer_id: 'CUST-001',
        stage_id: 'STAGE_004',
        stage_name: 'クロージング',
        activity_date: new Date('2024-01-11T11:00:00Z'),
        actions_performed: ['契約書確認', '最終合意'],
        notes: '契約書確認・最終合意取得',
      },
    ];

    // 期待される結果：
    // - 異常パターン：0件
    // - 準拠ステータス：準拠
    // - 準拠度スコア：100%
    const expected_result = {
      anomaly_count: 0,
      compliance_status: '準拠',
      compliance_score: 100,
      stage_compliance_details: [
        {
          stage_id: 'STAGE_001',
          stage_name: '初期接触',
          is_compliant: true,
          stage_compliance_score: 100,
        },
        {
          stage_id: 'STAGE_002',
          stage_name: 'ニーズ確認',
          is_compliant: true,
          stage_compliance_score: 100,
        },
        {
          stage_id: 'STAGE_003',
          stage_name: '提案',
          is_compliant: true,
          stage_compliance_score: 100,
        },
        {
          stage_id: 'STAGE_004',
          stage_name: 'クロージング',
          is_compliant: true,
          stage_compliance_score: 100,
        },
      ],
      detected_anomalies: [],
    };

    // 分析ロジックを実行
    const result = analyzeProposalAndCustomerResponsePatterns(
      standard_process,
      sales_rep_activity_records
    );

    // 検証：異常パターン検出結果
    expect(result.anomaly_count).toBe(expected_result.anomaly_count);
    expect(result.compliance_status).toBe(expected_result.compliance_status);
    expect(result.compliance_score).toBe(expected_result.compliance_score);

    // 検証：各段階の準拠度
    expect(result.stage_compliance_details).toEqual(
      expected_result.stage_compliance_details
    );

    // 検証：検出された異常パターンの一覧
    expect(result.detected_anomalies).toEqual(expected_result.detected_anomalies);
  });
});