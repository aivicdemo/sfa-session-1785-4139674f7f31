import {
  calculateProcessDeviation,
  analyzeContractCorrelation,
  ProcessDeviationInput,
  ContractCorrelationInput,
  ProcessDeviationResult,
  ContractCorrelationReport,
} from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1166: [normal] 成約実績との相関分析機能 - 標準プロセスからの乖離度が0%（完全準拠）の場合、相関分析結果に反映される
  test('標準プロセス完全準拠（乖離度0%）の営業担当者について、成約相関分析結果に乖離度、成約実績、相関係数が明示される', () => {
    // 準備1: 営業担当者Aのプロセス乖離度計算用テストデータ
    const sales_representative_id = 'A001';
    const standard_process_steps = [
      { step_name: 'initial_contact', required: true },
      { step_name: 'needs_assessment', required: true },
      { step_name: 'proposal', required: true },
      { step_name: 'closing', required: true },
      { step_name: 'contract', required: true },
    ];

    const sales_activity_records = [
      {
        activity_id: 'act_001',
        sales_rep_id: sales_representative_id,
        customer_id: 'cust_001',
        step_name: 'initial_contact',
        conducted: true,
        execution_date: new Date('2024-01-10T09:00:00Z'),
      },
      {
        activity_id: 'act_002',
        sales_rep_id: sales_representative_id,
        customer_id: 'cust_001',
        step_name: 'needs_assessment',
        conducted: true,
        execution_date: new Date('2024-01-12T10:30:00Z'),
      },
      {
        activity_id: 'act_003',
        sales_rep_id: sales_representative_id,
        customer_id: 'cust_001',
        step_name: 'proposal',
        conducted: true,
        execution_date: new Date('2024-01-15T14:00:00Z'),
      },
      {
        activity_id: 'act_004',
        sales_rep_id: sales_representative_id,
        customer_id: 'cust_001',
        step_name: 'closing',
        conducted: true,
        execution_date: new Date('2024-01-18T11:00:00Z'),
      },
      {
        activity_id: 'act_005',
        sales_rep_id: sales_representative_id,
        customer_id: 'cust_001',
        step_name: 'contract',
        conducted: true,
        execution_date: new Date('2024-01-20T16:00:00Z'),
      },
    ];

    const deviation_input: ProcessDeviationInput = {
      sales_representative_id: sales_representative_id,
      standard_process_steps: standard_process_steps,
      sales_activity_records: sales_activity_records,
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    };

    // 準備2: プロセス乖離度を計算
    const deviation_result: ProcessDeviationResult = calculateProcessDeviation(deviation_input);

    // アサーション1: 乖離度が0%（完全準拠）であることを確認
    expect(deviation_result.deviation_percentage).toBe(0);
    expect(deviation_result.is_compliant).toBe(true);

    // 準備3: 営業担当者Aの成約実績データ
    const contract_records = [
      { contract_id: 'con_001', customer_id: 'cust_001', amount_yen: 500000, contract_date: new Date('2024-01-20T16:00:00Z') },
      { contract_id: 'con_002', customer_id: 'cust_002', amount_yen: 300000, contract_date: new Date('2024-01-22T10:00:00Z') },
      { contract_id: 'con_003', customer_id: 'cust_003', amount_yen: 400000, contract_date: new Date('2024-01-25T13:30:00Z') },
      { contract_id: 'con_004', customer_id: 'cust_004', amount_yen: 600000, contract_date: new Date('2024-01-27T09:00:00Z') },
      { contract_id: 'con_005', customer_id: 'cust_005', amount_yen: 550000, contract_date: new Date('2024-01-29T15:00:00Z') },
      { contract_id: 'con_006', customer_id: 'cust_006', amount_yen: 480000, contract_date: new Date('2024-02-01T11:00:00Z') },
      { contract_id: 'con_007', customer_id: 'cust_007', amount_yen: 520000, contract_date: new Date('2024-02-03T14:00:00Z') },
      { contract_id: 'con_008', customer_id: 'cust_008', amount_yen: 410000, contract_date: new Date('2024-02-05T10:30:00Z') },
      { contract_id: 'con_009', customer_id: 'cust_009', amount_yen: 470000, contract_date: new Date('2024-02-07T12:00:00Z') },
      { contract_id: 'con_010', customer_id: 'cust_010', amount_yen: 540000, contract_date: new Date('2024-02-09T16:00:00Z') },
      { contract_id: 'con_011', customer_id: 'cust_011', amount_yen: 380000, contract_date: new Date('2024-02-11T09:30:00Z') },
      { contract_id: 'con_012', customer_id: 'cust_012', amount_yen: 490000, contract_date: new Date('2024-02-13T13:00:00Z') },
      { contract_id: 'con_013', customer_id: 'cust_013', amount_yen: 510000, contract_date: new Date('2024-02-15T10:00:00Z') },
      { contract_id: 'con_014', customer_id: 'cust_014', amount_yen: 430000, contract_date: new Date('2024-02-17T14:30:00Z') },
      { contract_id: 'con_015', customer_id: 'cust_015', amount_yen: 560000, contract_date: new Date('2024-02-19T11:00:00Z') },
    ];

    const total_contract_amount = contract_records.reduce((sum, rec) => sum + rec.amount_yen, 0);
    const total_contract_count = contract_records.length;
    const total_opportunities = 20; // 仮の営業案件総数（成約率計算用）
    const contract_rate = (total_contract_count / total_opportunities) * 100;

    // 準備4: 相関分析用入力データ
    const correlation_input: ContractCorrelationInput = {
      sales_representative_id: sales_representative_id,
      process_deviation_percentage: deviation_result.deviation_percentage,
      contract_records: contract_records,
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-02-19T23:59:59Z'),
      total_opportunities: total_opportunities,
    };

    // 準備5: 相関分析を実行
    const correlation_report: ContractCorrelationReport = analyzeContractCorrelation(correlation_input);

    // アサーション2: レポートオブジェクトが生成されたことを確認
    expect(correlation_report).toBeDefined();
    expect(typeof correlation_report).toBe('object');

    // アサーション3: レポートに必須項目が含まれていることを確認
    expect(correlation_report.sales_representative_id).toBe(sales_representative_id);
    expect(correlation_report.process_deviation_percentage).toBe(0);
    expect(correlation_report.analysis_period_start).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(correlation_report.analysis_period_end).toEqual(new Date('2024-02-19T23:59:59Z'));
    expect(correlation_report.total_contract_count).toBe(15);
    expect(correlation_report.total_contract_amount_yen).toBe(total_contract_amount);
    expect(correlation_report.contract_rate_percentage).toBe(75);

    // アサーション4: 相関係数スコアが計算されていることを確認（乖離度0%の場合は高い相関が期待される）
    expect(correlation_report.correlation_coefficient_score).toBeGreaterThanOrEqual(0.85);
    expect(correlation_report.correlation_coefficient_score).toBeLessThanOrEqual(1.0);

    // アサーション5: 相関分析セクションの内容を確認
    expect(correlation_report.correlation_section).toBeDefined();
    expect(correlation_report.correlation_section.title).toContain('プロセス準拠と成約実績の相関');
    expect(correlation_report.correlation_section.description).toContain('乖離度0%');
    expect(correlation_report.correlation_section.description).toContain('成約率75%');
    expect(correlation_report.correlation_section.relationship_assessment).toBe('positive');

    // アサーション6: 計算ロジック記録（calculation_log）に全ての計算根拠が記録されていることを確認
    expect(correlation_report.calculation_log).toBeDefined();
    expect(correlation_report.calculation_log.used_contract_records).toEqual(contract_records);
    expect(correlation_report.calculation_log.used_contract_records.length).toBe(15);
    expect(correlation_report.calculation_log.calculation_formulas).toBeDefined();
    expect(Array.isArray(correlation_report.calculation_log.calculation_formulas)).toBe(true);
    expect(correlation_report.calculation_log.calculation_formulas.length).toBeGreaterThan(0);

    // アサーション7: 中間値が記録されていることを確認
    expect(correlation_report.calculation_log.intermediate_values).toBeDefined();
    expect(correlation_report.calculation_log.intermediate_values.total_contract_amount).toBe(total_contract_amount);
    expect(correlation_report.calculation_log.intermediate_values.total_contract_count).toBe(15);
    expect(correlation_report.calculation_log.intermediate_values.contract_rate_percentage).toBe(75);
    expect(correlation_report.calculation_log.intermediate_values.process_deviation_percentage).toBe(0);

    // アサーション8: レポートが営業管理者に提示可能な形式であることを確認
    expect(correlation_report.report_format).toBe('json');
    expect(correlation_report.generated_timestamp).toBeDefined();
    expect(typeof correlation_report.generated_timestamp).toBe('string');
    expect(correlation_report.data_integrity_verified).toBe(true);
    expect(correlation_report.audit_trail_reference).toBeDefined();
    expect(typeof correlation_report.audit_trail_reference).toBe('string');
  });
});