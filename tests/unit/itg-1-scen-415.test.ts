import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

fetchMock.enableMocks();

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-415
  test('レポートに含まれる合致度の値が1.0の場合、正確に表示される', async () => {
    const sales_person_id = 'SP001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    const mock_analysis_result = {
      sales_person_id: sales_person_id,
      pattern_adherence_score: 0.95,
      matching_degree: 1.0,
      success_rate: 0.82,
      total_cases: 15,
      matched_cases: 15,
      contact_frequency: 4.5,
      proposal_precision: 0.88,
      followup_success_rate: 0.92,
      deviation_patterns: []
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_analysis_result), {
      status: 200
    });

    const report_params = {
      sales_person_id: sales_person_id,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
      analysis_service_url: 'https://analysis-engine.example.com/analyze'
    };

    const generated_report = await generateSalesPatternAnalysisReport(report_params);

    expect(generated_report).toBeDefined();
    expect(generated_report.matching_degree).toBe(1.0);
    expect(String(generated_report.matching_degree)).toMatch(/^1\.0$/);
    expect(generated_report.sales_person_id).toBe(sales_person_id);
    expect(generated_report.analysis_period_start).toBe(analysis_period_start);
    expect(generated_report.analysis_period_end).toBe(analysis_period_end);
    expect(generated_report.pattern_adherence_score).toBe(0.95);
    expect(generated_report.success_rate).toBe(0.82);
    expect(generated_report.total_cases).toBe(15);
    expect(generated_report.matched_cases).toBe(15);
  });
});