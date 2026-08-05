import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-319
  test('行動パターン分析レポート生成機能 - 成約実績との相関が分析されてレポートに反映される', () => {
    // 営業担当者A: 過去3ヶ月の成約件数12件、成約率48%
    const sales_person_id = 'SP-001';
    const sales_person_name = '営業担当者A';
    const total_contracts_3months = 12;
    const contract_rate_percent = 48;

    // 行動ログデータ（過去3ヶ月）
    const activity_logs = [
      {
        month: 1,
        visit_frequency: 25,
        proposal_docs_sent: 12,
        followup_count: 18,
        month_contracts: 4,
        month_contract_rate: 40
      },
      {
        month: 2,
        visit_frequency: 28,
        proposal_docs_sent: 10,
        followup_count: 20,
        month_contracts: 5,
        month_contract_rate: 50
      },
      {
        month: 3,
        visit_frequency: 22,
        proposal_docs_sent: 8,
        followup_count: 16,
        month_contracts: 3,
        month_contract_rate: 43
      }
    ];

    // 成約実績データ
    const contract_records = [
      { contract_date: '2024-01-10', contract_amount: 500000, product_category: 'SaaS', visit_count_before_contract: 25, proposal_count_before_contract: 5, followup_count_before_contract: 3 },
      { contract_date: '2024-01-15', contract_amount: 750000, product_category: 'コンサル', visit_count_before_contract: 20, proposal_count_before_contract: 4, followup_count_before_contract: 4 },
      { contract_date: '2024-01-20', contract_amount: 300000, product_category: 'SaaS', visit_count_before_contract: 15, proposal_count_before_contract: 3, followup_count_before_contract: 2 },
      { contract_date: '2024-01-25', contract_amount: 600000, product_category: 'ハード', visit_count_before_contract: 30, proposal_count_before_contract: 6, followup_count_before_contract: 5 },
      { contract_date: '2024-02-05', contract_amount: 450000, product_category: 'SaaS', visit_count_before_contract: 28, proposal_count_before_contract: 5, followup_count_before_contract: 3 },
      { contract_date: '2024-02-12', contract_amount: 800000, product_category: 'コンサル', visit_count_before_contract: 32, proposal_count_before_contract: 7, followup_count_before_contract: 6 },
      { contract_date: '2024-02-18', contract_amount: 550000, product_category: 'SaaS', visit_count_before_contract: 25, proposal_count_before_contract: 5, followup_count_before_contract: 4 },
      { contract_date: '2024-02-25', contract_amount: 900000, product_category: 'ハード', visit_count_before_contract: 35, proposal_count_before_contract: 8, followup_count_before_contract: 5 },
      { contract_date: '2024-02-28', contract_amount: 420000, product_category: 'コンサル', visit_count_before_contract: 22, proposal_count_before_contract: 4, followup_count_before_contract: 2 },
      { contract_date: '2024-03-05', contract_amount: 380000, product_category: 'SaaS', visit_count_before_contract: 18, proposal_count_before_contract: 3, followup_count_before_contract: 2 },
      { contract_date: '2024-03-15', contract_amount: 670000, product_category: 'ハード', visit_count_before_contract: 28, proposal_count_before_contract: 6, followup_count_before_contract: 4 },
      { contract_date: '2024-03-20', contract_amount: 520000, product_category: 'コンサル', visit_count_before_contract: 20, proposal_count_before_contract: 5, followup_count_before_contract: 3 }
    ];

    // 失注案件データ（相関分析用）
    const non_contract_records = [
      { visit_count_before_no_contract: 10, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 12, proposal_count_before_no_contract: 3, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 8, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 0 },
      { visit_count_before_no_contract: 5, proposal_count_before_no_contract: 1, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 15, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 2 },
      { visit_count_before_no_contract: 10, proposal_count_before_no_contract: 3, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 7, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 11, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 0 },
      { visit_count_before_no_contract: 9, proposal_count_before_no_contract: 1, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 6, proposal_count_before_no_contract: 2, followup_count_before_no_contract: 0 },
      { visit_count_before_no_contract: 13, proposal_count_before_no_contract: 3, followup_count_before_no_contract: 2 },
      { visit_count_before_no_contract: 8, proposal_count_before_no_contract: 1, followup_count_before_no_contract: 1 },
      { visit_count_before_no_contract: 14, proposal_count_before_no_contract: 4, followup_count_before_no_contract: 1 }
    ];

    const input_payload = {
      sales_person_id,
      sales_person_name,
      total_contracts_3months,
      contract_rate_percent,
      activity_logs,
      contract_records,
      non_contract_records,
      analysis_period_months: 3
    };

    const report = generateSalesActivityAnalysisReport(input_payload);

    // (1) 訪問頻度と成約率の相関係数が0.75以上と表示される
    expect(report.correlation_analysis_section).toBeDefined();
    expect(report.correlation_analysis_section.visit_frequency_correlation).toBeGreaterThanOrEqual(0.75);
    expect(report.correlation_analysis_section.visit_frequency_correlation).toBeLessThanOrEqual(1.0);

    // (2) 提案資料送付数が月平均8件以上の月の成約率が50%以上と表示される
    const high_proposal_month_contract_rate = report.correlation_analysis_section
      .proposal_docs_high_activity_month_contract_rate;
    expect(high_proposal_month_contract_rate).toBeGreaterThanOrEqual(50);
    expect(high_proposal_month_contract_rate).toBeLessThanOrEqual(100);

    // (3) フォローアップ回数3回以上の案件の成約率が60%と表示される
    const followup_3plus_contract_rate = report.correlation_analysis_section
      .followup_3plus_contract_rate;
    expect(followup_3plus_contract_rate).toBe(60);

    // (4) 相関度ランキングで『訪問頻度』が最上位に表示される
    expect(report.correlation_analysis_section.correlation_rank).toBeDefined();
    expect(report.correlation_analysis_section.correlation_rank.length).toBeGreaterThan(0);
    expect(report.correlation_analysis_section.correlation_rank[0].factor_name).toBe('訪問頻度');
    expect(report.correlation_analysis_section.correlation_rank[0].correlation_coefficient).toBeGreaterThanOrEqual(0.75);

    // レポート全体の構造確認
    expect(report.report_id).toBeDefined();
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.sales_person_name).toBe(sales_person_name);
    expect(report.generated_at).toBeDefined();
    expect(report.analysis_period_months).toBe(3);
    expect(report.total_analyzed_contracts).toBe(12);
    expect(report.overall_contract_rate_percent).toBe(48);
  });
});