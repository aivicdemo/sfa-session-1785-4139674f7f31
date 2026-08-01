import { generateSalesRepAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-410
  test('複数の営業担当者の分析結果が含まれる場合、営業担当者ごとに分離されたレポートが生成される', () => {
    const input_analysis_data = [
      {
        sales_rep_id: 'A',
        sales_rep_name: '営業担当者A',
        visit_count: 15,
        proposal_doc_count: 8,
        deal_success_rate: 53.33,
      },
      {
        sales_rep_id: 'B',
        sales_rep_name: '営業担当者B',
        visit_count: 22,
        proposal_doc_count: 12,
        deal_success_rate: 63.64,
      },
      {
        sales_rep_id: 'C',
        sales_rep_name: '営業担当者C',
        visit_count: 18,
        proposal_doc_count: 10,
        deal_success_rate: 55.56,
      },
    ];

    const report = generateSalesRepAnalysisReport(input_analysis_data);

    // レポートのセクション数を確認
    expect(report.sections.length).toBe(3);

    // 営業担当者Aのセクション検証
    const section_a = report.sections[0];
    expect(section_a.sales_rep_id).toBe('A');
    expect(section_a.sales_rep_name).toBe('営業担当者A');
    expect(section_a.content).toContain('営業担当者ID: A');
    expect(section_a.content).toContain('訪問件数: 15件');
    expect(section_a.content).toContain('提案資料送付数: 8件');
    expect(section_a.content).toContain('商談成立率: 53.33%');
    expect(section_a.section_break).toBe(true);

    // 営業担当者Bのセクション検証
    const section_b = report.sections[1];
    expect(section_b.sales_rep_id).toBe('B');
    expect(section_b.sales_rep_name).toBe('営業担当者B');
    expect(section_b.content).toContain('営業担当者ID: B');
    expect(section_b.content).toContain('訪問件数: 22件');
    expect(section_b.content).toContain('提案資料送付数: 12件');
    expect(section_b.content).toContain('商談成立率: 63.64%');
    expect(section_b.section_break).toBe(true);

    // 営業担当者Cのセクション検証
    const section_c = report.sections[2];
    expect(section_c.sales_rep_id).toBe('C');
    expect(section_c.sales_rep_name).toBe('営業担当者C');
    expect(section_c.content).toContain('営業担当者ID: C');
    expect(section_c.content).toContain('訪問件数: 18件');
    expect(section_c.content).toContain('提案資料送付数: 10件');
    expect(section_c.content).toContain('商談成立率: 55.56%');
    expect(section_c.section_break).toBe(true);

    // セクション間に明確な区切りが存在することを確認
    expect(section_a.section_break).toBe(true);
    expect(section_b.section_break).toBe(true);
    expect(section_c.section_break).toBe(true);

    // 各営業担当者のデータが他のセクションに混在していないことを確認
    expect(section_a.content).not.toContain('営業担当者ID: B');
    expect(section_a.content).not.toContain('営業担当者ID: C');
    expect(section_a.content).not.toContain('訪問件数: 22件');
    expect(section_a.content).not.toContain('訪問件数: 18件');

    expect(section_b.content).not.toContain('営業担当者ID: A');
    expect(section_b.content).not.toContain('営業担当者ID: C');
    expect(section_b.content).not.toContain('訪問件数: 15件');
    expect(section_b.content).not.toContain('訪問件数: 18件');

    expect(section_c.content).not.toContain('営業担当者ID: A');
    expect(section_c.content).not.toContain('営業担当者ID: B');
    expect(section_c.content).not.toContain('訪問件数: 15件');
    expect(section_c.content).not.toContain('訪問件数: 22件');

    // レポート全体の構造確認
    expect(report.report_type).toBe('sales_rep_analysis');
    expect(report.total_sales_reps).toBe(3);
  });
});