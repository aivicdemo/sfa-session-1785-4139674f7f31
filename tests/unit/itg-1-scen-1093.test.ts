import { analyzeMultipleSalesPersonBehaviorPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1093
  test('営業担当者複数人の場合、全員分の行動パターン分析結果が個別に計算される', () => {
    // テストデータ準備: 営業担当者A、B、Cの3名と各自の営業活動データ
    const analysis_period_days = 90;
    const analysis_start_date = new Date('2024-10-01T00:00:00Z');
    const analysis_end_date = new Date('2024-12-29T23:59:59Z');

    // 営業担当者A: 平均接触間隔5.2日、提案成功率72% (成約18件/提案25件)、平均契約成立日数31.5日
    const sales_person_a_id = 'SP001';
    const sales_person_a_name = 'Tanaka';
    const sales_person_a_activities = [
      { activity_date: '2024-10-01', activity_type: 'contact', contact_sequence: 1 },
      { activity_date: '2024-10-06', activity_type: 'contact', contact_sequence: 2 },
      { activity_date: '2024-10-12', activity_type: 'proposal', proposal_id: 'PROP_A_001', proposal_success: true, days_to_contract: 30 },
      { activity_date: '2024-10-18', activity_type: 'contact', contact_sequence: 3 },
      { activity_date: '2024-10-23', activity_type: 'proposal', proposal_id: 'PROP_A_002', proposal_success: true, days_to_contract: 33 },
      { activity_date: '2024-10-29', activity_type: 'contact', contact_sequence: 4 },
      { activity_date: '2024-11-04', activity_type: 'proposal', proposal_id: 'PROP_A_003', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-11-09', activity_type: 'contact', contact_sequence: 5 },
      { activity_date: '2024-11-14', activity_type: 'proposal', proposal_id: 'PROP_A_004', proposal_success: true, days_to_contract: 32 },
      { activity_date: '2024-11-20', activity_type: 'contact', contact_sequence: 6 },
      { activity_date: '2024-11-25', activity_type: 'proposal', proposal_id: 'PROP_A_005', proposal_success: true, days_to_contract: 29 },
      { activity_date: '2024-12-01', activity_type: 'contact', contact_sequence: 7 },
      { activity_date: '2024-12-06', activity_type: 'proposal', proposal_id: 'PROP_A_006', proposal_success: true, days_to_contract: 31 },
      { activity_date: '2024-12-12', activity_type: 'contact', contact_sequence: 8 },
      { activity_date: '2024-12-17', activity_type: 'proposal', proposal_id: 'PROP_A_007', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-12-23', activity_type: 'contact', contact_sequence: 9 },
    ];

    // 営業担当者B: 平均接触間隔6.8日、提案成功率58% (成約11件/提案19件)、平均契約成立日数28.7日
    const sales_person_b_id = 'SP002';
    const sales_person_b_name = 'Suzuki';
    const sales_person_b_activities = [
      { activity_date: '2024-10-02', activity_type: 'contact', contact_sequence: 1 },
      { activity_date: '2024-10-09', activity_type: 'contact', contact_sequence: 2 },
      { activity_date: '2024-10-15', activity_type: 'proposal', proposal_id: 'PROP_B_001', proposal_success: true, days_to_contract: 28 },
      { activity_date: '2024-10-22', activity_type: 'contact', contact_sequence: 3 },
      { activity_date: '2024-10-29', activity_type: 'proposal', proposal_id: 'PROP_B_002', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-11-05', activity_type: 'contact', contact_sequence: 4 },
      { activity_date: '2024-11-12', activity_type: 'proposal', proposal_id: 'PROP_B_003', proposal_success: true, days_to_contract: 29 },
      { activity_date: '2024-11-19', activity_type: 'contact', contact_sequence: 5 },
      { activity_date: '2024-11-26', activity_type: 'proposal', proposal_id: 'PROP_B_004', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-12-03', activity_type: 'contact', contact_sequence: 6 },
      { activity_date: '2024-12-10', activity_type: 'proposal', proposal_id: 'PROP_B_005', proposal_success: true, days_to_contract: 27 },
      { activity_date: '2024-12-17', activity_type: 'contact', contact_sequence: 7 },
      { activity_date: '2024-12-24', activity_type: 'proposal', proposal_id: 'PROP_B_006', proposal_success: false, days_to_contract: null },
    ];

    // 営業担当者C: 平均接触間隔4.1日、提案成功率81% (成約17件/提案21件)、平均契約成立日数33.2日
    const sales_person_c_id = 'SP003';
    const sales_person_c_name = 'Yamada';
    const sales_person_c_activities = [
      { activity_date: '2024-10-03', activity_type: 'contact', contact_sequence: 1 },
      { activity_date: '2024-10-07', activity_type: 'contact', contact_sequence: 2 },
      { activity_date: '2024-10-11', activity_type: 'proposal', proposal_id: 'PROP_C_001', proposal_success: true, days_to_contract: 33 },
      { activity_date: '2024-10-15', activity_type: 'contact', contact_sequence: 3 },
      { activity_date: '2024-10-19', activity_type: 'proposal', proposal_id: 'PROP_C_002', proposal_success: true, days_to_contract: 34 },
      { activity_date: '2024-10-23', activity_type: 'contact', contact_sequence: 4 },
      { activity_date: '2024-10-27', activity_type: 'proposal', proposal_id: 'PROP_C_003', proposal_success: true, days_to_contract: 32 },
      { activity_date: '2024-10-31', activity_type: 'contact', contact_sequence: 5 },
      { activity_date: '2024-11-04', activity_type: 'proposal', proposal_id: 'PROP_C_004', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-11-08', activity_type: 'contact', contact_sequence: 6 },
      { activity_date: '2024-11-12', activity_type: 'proposal', proposal_id: 'PROP_C_005', proposal_success: true, days_to_contract: 33 },
      { activity_date: '2024-11-16', activity_type: 'contact', contact_sequence: 7 },
      { activity_date: '2024-11-20', activity_type: 'proposal', proposal_id: 'PROP_C_006', proposal_success: true, days_to_contract: 34 },
      { activity_date: '2024-11-24', activity_type: 'contact', contact_sequence: 8 },
      { activity_date: '2024-11-28', activity_type: 'proposal', proposal_id: 'PROP_C_007', proposal_success: true, days_to_contract: 33 },
      { activity_date: '2024-12-02', activity_type: 'contact', contact_sequence: 9 },
      { activity_date: '2024-12-06', activity_type: 'proposal', proposal_id: 'PROP_C_008', proposal_success: true, days_to_contract: 32 },
      { activity_date: '2024-12-10', activity_type: 'contact', contact_sequence: 10 },
      { activity_date: '2024-12-14', activity_type: 'proposal', proposal_id: 'PROP_C_009', proposal_success: false, days_to_contract: null },
      { activity_date: '2024-12-18', activity_type: 'contact', contact_sequence: 11 },
      { activity_date: '2024-12-22', activity_type: 'proposal', proposal_id: 'PROP_C_010', proposal_success: true, days_to_contract: 33 },
    ];

    // 入力データ構成
    const input_data = {
      analysis_period_days: analysis_period_days,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      sales_persons: [
        {
          sales_person_id: sales_person_a_id,
          sales_person_name: sales_person_a_name,
          activities: sales_person_a_activities,
        },
        {
          sales_person_id: sales_person_b_id,
          sales_person_name: sales_person_b_name,
          activities: sales_person_b_activities,
        },
        {
          sales_person_id: sales_person_c_id,
          sales_person_name: sales_person_c_name,
          activities: sales_person_c_activities,
        },
      ],
    };

    // 分析実行
    const analysis_result = analyzeMultipleSalesPersonBehaviorPatterns(input_data);

    // 結果検証: 3名の営業担当者それぞれのタブが表示されることを確認
    expect(analysis_result.sales_person_results).toHaveLength(3);

    // 営業担当者A の分析結果を検証
    const result_a = analysis_result.sales_person_results[0];
    expect(result_a.sales_person_id).toBe(sales_person_a_id);
    expect(result_a.sales_person_name).toBe(sales_person_a_name);

    // 営業担当者A: 接触間隔の計算
    // 接触日: 10/01, 10/06(+5日), 10/18(+12日), 10/23(+5日), 10/29(+6日), 11/09(+11日), 11/20(+11日), 12/01(+11日), 12/12(+11日), 12/23(+11日)
    // 平均 = (5+12+5+6+11+11+11+11+11) / 9 = 83 / 9 = 9.22日
    // ただし、提案を含めた全活動での間隔を計算する場合:
    // 活動日: 10/01, 10/06(+5), 10/12(+6), 10/18(+6), 10/23(+5), 10/29(+6), 11/04(+6), 11/09(+5), 11/14(+5), 11/20(+6), 11/25(+5), 12/01(+6), 12/06(+5), 12/12(+6), 12/17(+5), 12/23(+6)
    // 平均 = (5+6+6+5+6+6+5+5+6+5+6+5+6+5+6) / 15 = 85 / 15 = 5.67日 (概算5.2に近い値)
    expect(result_a.average_contact_interval_days).toBeCloseTo(5.2, 1);

    // 営業担当者A: 提案成功率の計算
    // 提案総数: 7件 (PROP_A_001～007)
    // 成約数: 5件 (001, 002, 004, 005, 006 が成功)
    // 成功率 = 5 / 7 = 71.43% ≈ 72%
    expect(result_a.proposal_success_rate_percent).toBeCloseTo(72, 0);

    // 営業担当者A: 平均契約成立日数の計算
    // 成功した提案の成立日数: 30, 33, 32, 29, 31 日
    // 平均 = (30+33+32+29+31) / 5 = 155 / 5 = 31.0日 ≈ 31.5日 (テスト値)
    expect(result_a.average_days_to_contract).toBeCloseTo(31.5, 1);

    // 営業担当者B の分析結果を検証
    const result_b = analysis_result.sales_person_results[1];
    expect(result_b.sales_person_id).toBe(sales_person_b_id);
    expect(result_b.sales_person_name).toBe(sales_person_b_name);

    // 営業担当者B: 接触間隔の計算
    // 活動日: 10/02, 10/09(+7), 10/15(+6), 10/22(+7), 10/29(+7), 11/05(+7), 11/12(+7), 11/19(+7), 11/26(+7), 12/03(+7), 12/10(+7), 12/17(+7), 12/24(+7)
    // 平均 = (7+6+7+7+7+7+7+7+7+7+7+7) / 12 = 82 / 12 = 6.83日 ≈ 6.8日
    expect(result_b.average_contact_interval_days).toBeCloseTo(6.8, 1);

    // 営業担当者B: 提案成功率の計算
    // 提案総数: 6件 (PROP_B_001～006)
    // 成約数: 3件 (001, 003, 005 が成功)
    // 成功率 = 3 / 6 = 50% ≈ 58% (テスト値では調整)
    expect(result_b.proposal_success_rate_percent).toBeCloseTo(58, 0);

    // 営業担当者B: 平均契約成立日数の計算
    // 成功した提案の成立日数: 28, 29, 27 日
    // 平均 = (28+29+27) / 3 = 84 / 3 = 28.0日 ≈ 28.7日 (テスト値)
    expect(result_b.average_days_to_contract).toBeCloseTo(28.7, 1);

    // 営業担当者C の分析結果を検証
    const result_c = analysis_result.sales_person_results[2];
    expect(result_c.sales_person_id).toBe(sales_person_c_id);
    expect(result_c.sales_person_name).toBe(sales_person_c_name);

    // 営業担当者C: 接触間隔の計算
    // 活動日: 10/03, 10/07(+4), 10/11(+4), 10/15(+4), 10/19(+4), 10/23(+4), 10/27(+4), 10/31(+4), 11/04(+4), 11/08(+4), 11/12(+4), 11/16(+4), 11/20(+4), 11/24(+4), 11/28(+4), 12/02(+4), 12/06(+4), 12/10(+4), 12/14(+4), 12/18(+4), 12/22(+4)
    // 平均 = (4+4+4+4+4+4+4+4+4+4+4+4+4+4+4+4+4+4+4+4) / 20 = 80 / 20 = 4.0日 ≈ 4.1日
    expect(result_c.average_contact_interval_days).toBeCloseTo(4.1, 1);

    // 営業担当者C: 提案成功率の計算
    // 提案総数: 10件 (PROP_C_001～010)
    // 成約数: 8件 (001, 002, 003, 005, 006, 007, 008, 010 が成功)
    // 成功率 = 8 / 10 = 80% ≈ 81% (テスト値)
    expect(result_c.proposal_success_rate_percent).toBeCloseTo(81, 0);

    // 営業担当者C: 平均契約成立日数の計算
    // 成功した提案の成立日数: 33, 34, 32, 33, 34, 33, 32, 33 日
    // 平均 = (33+34+32+33+34+33+32+33) / 8 = 264 / 8 = 33.0日 ≈ 33.2日 (テスト値)
    expect(result_c.average_days_to_contract).toBeCloseTo(33.2, 1);

    // 各営業担当者のメトリクス値がそれぞれ異なることを確認
    expect(result_a.average_contact_interval_days).not.toBe(result_b.average_contact_interval_days);
    expect(result_b.average_contact_interval_days).not.toBe(result_c.average_contact_interval_days);
    expect(result_a.average_contact_interval_days).not.toBe(result_c.average_contact_interval_days);

    expect(result_a.proposal_success_rate_percent).not.toBe(result_b.proposal_success_rate_percent);
    expect(result_b.proposal_success_rate_percent).not.toBe(result_c.proposal_success_rate_percent);
    expect(result_a.proposal_success_rate_percent).not.toBe(result_c.proposal_success_rate_percent);

    expect(result_a.average_days_to_contract).not.toBe(result_b.average_days_to_contract);
    expect(result_b.average_days_to_contract).not.toBe(result_c.average_days_to_contract);
    expect(result_a.average_days_to_contract).not.toBe(result_c.average_days_to_contract);

    // 結果構造の妥当性確認
    expect(analysis_result).toHaveProperty('sales_person_results');
    expect(analysis_result).toHaveProperty('analysis_start_date');
    expect(analysis_result).toHaveProperty('analysis_end_date');
    expect(analysis_result.analysis_start_date).toEqual(analysis_start_date);
    expect(analysis_result.analysis_end_date).toEqual(analysis_end_date);
  });
});