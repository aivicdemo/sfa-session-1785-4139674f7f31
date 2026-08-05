import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1013
  test('[normal] 理解度スコアと実務適用状況から営業担当者ごとの分析レポートが正しく生成される', () => {
    const now = new Date('2024-01-15T11:00:00Z');
    const thirtyDaysAgo = new Date('2023-12-16T11:00:00Z');

    const salesPersonA = {
      sales_person_id: 'SP001',
      sales_person_name: '営業担当者A',
      understanding_score: 75,
      practical_application_status: '活用中',
      last_updated: now.toISOString(),
    };

    const salesPersonB = {
      sales_person_id: 'SP002',
      sales_person_name: '営業担当者B',
      understanding_score: 55,
      practical_application_status: '試行中',
      last_updated: now.toISOString(),
    };

    const salesPersonC = {
      sales_person_id: 'SP003',
      sales_person_name: '営業担当者C',
      understanding_score: 40,
      practical_application_status: '未実装',
      last_updated: now.toISOString(),
    };

    const input_sales_persons = [salesPersonA, salesPersonB, salesPersonC];
    const analysis_period_days = 30;
    const analysis_start_date = thirtyDaysAgo.toISOString();

    const result = generateSalesPersonAnalysisReport({
      sales_persons: input_sales_persons,
      period_days: analysis_period_days,
      period_start_date: analysis_start_date,
      current_timestamp: now.toISOString(),
    });

    expect(result).toBeDefined();
    expect(result.report_id).toBeDefined();
    expect(result.generated_at).toBeDefined();

    const report_generated_timestamp = new Date(result.generated_at);
    const time_diff_ms = Math.abs(report_generated_timestamp.getTime() - now.getTime());
    expect(time_diff_ms).toBeLessThanOrEqual(1000);

    expect(result.analysis_period_days).toBe(30);
    expect(result.analysis_start_date).toBe(analysis_start_date);

    expect(Array.isArray(result.person_analyses)).toBe(true);
    expect(result.person_analyses.length).toBe(3);

    const analysis_person_a = result.person_analyses.find(
      (p: any) => p.sales_person_id === 'SP001'
    );
    expect(analysis_person_a).toBeDefined();
    expect(analysis_person_a.sales_person_name).toBe('営業担当者A');
    expect(analysis_person_a.understanding_score).toBe(75);
    expect(analysis_person_a.practical_application_status).toBe('活用中');
    expect(analysis_person_a.performance_classification).toBe('高パフォーマンス');

    const analysis_person_b = result.person_analyses.find(
      (p: any) => p.sales_person_id === 'SP002'
    );
    expect(analysis_person_b).toBeDefined();
    expect(analysis_person_b.sales_person_name).toBe('営業担当者B');
    expect(analysis_person_b.understanding_score).toBe(55);
    expect(analysis_person_b.practical_application_status).toBe('試行中');
    expect(analysis_person_b.performance_classification).toBe('成長段階');

    const analysis_person_c = result.person_analyses.find(
      (p: any) => p.sales_person_id === 'SP003'
    );
    expect(analysis_person_c).toBeDefined();
    expect(analysis_person_c.sales_person_name).toBe('営業担当者C');
    expect(analysis_person_c.understanding_score).toBe(40);
    expect(analysis_person_c.practical_application_status).toBe('未実装');
    expect(analysis_person_c.performance_classification).toBe('支援対象');
  });
});