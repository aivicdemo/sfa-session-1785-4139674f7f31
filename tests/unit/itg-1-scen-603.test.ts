import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-603
  it('[normal] 営業担当者ごとの行動パターン分析レポート生成機能 - 単一の営業担当者の提案と顧客対応が分析されレポートが生成される', () => {
    const sales_person_id = 'SA001';
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');

    const input = {
      sales_person_id,
      analysis_start_date,
      analysis_end_date,
    };

    const report = generateSalesPersonBehaviorAnalysisReport(input);

    expect(report).toBeDefined();
    expect(report.sales_person_id).toBe('SA001');
    expect(report.analysis_period_start).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(report.analysis_period_end).toEqual(new Date('2024-01-31T23:59:59Z'));

    expect(report.proposal_count).toBe(15);
    expect(report.proposal_success_rate).toBe(60);
    expect(report.average_days_from_first_contact_to_proposal).toBe(3.2);
    expect(report.monthly_followup_count).toBe(42);
    expect(report.average_customer_response_time_hours).toBe(1.5);
    expect(report.behavior_pattern_classification).toBe('積極的フォローアップ型');

    expect(report.generated_at).toBeDefined();
    expect(typeof report.generated_at).toBe('object');
  });
});