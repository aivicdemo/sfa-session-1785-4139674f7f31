import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  generateSalesRepBehaviorAnalysisReport,
} from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-453
  it('[normal] 営業担当者ごとの行動パターン分析レポート生成機能 - 単一の営業担当者について、行動パターン分析結果と成約実績から行動パターンスコアが正常に算出される', async () => {
    const sales_rep_id = 'EMP-001';
    const sales_rep_name = '田中太郎';
    const visit_count = 45;
    const proposal_doc_count = 23;
    const followup_email_count = 67;
    const deal_closed_count = 8;
    const deal_amount_million_yen = 24;
    const deal_close_rate = 34.8;

    const behavior_pattern_data = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_period_months: 3,
      visit_count: visit_count,
      proposal_doc_count: proposal_doc_count,
      followup_email_count: followup_email_count,
    };

    const deal_performance_data = {
      sales_rep_id: sales_rep_id,
      analysis_period_months: 3,
      deal_closed_count: deal_closed_count,
      deal_amount_million_yen: deal_amount_million_yen,
      deal_close_rate: deal_close_rate,
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        data: behavior_pattern_data,
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        data: deal_performance_data,
      }),
      { status: 200 }
    );

    const report = await generateSalesRepBehaviorAnalysisReport(sales_rep_id);

    expect(report).toEqual(
      expect.objectContaining({
        sales_rep_id: sales_rep_id,
        sales_rep_name: sales_rep_name,
        analysis_period_months: 3,
        behavior_pattern_score: 72.5,
        score_breakdown: expect.objectContaining({
          visit_activity_score: 24,
          proposal_activity_score: 18,
          followup_activity_score: 20,
          deal_efficiency_score: 10.5,
        }),
      })
    );

    expect(report.behavior_pattern_score).toBe(72.5);
    expect(report.score_breakdown.visit_activity_score).toBe(24);
    expect(report.score_breakdown.proposal_activity_score).toBe(18);
    expect(report.score_breakdown.followup_activity_score).toBe(20);
    expect(report.score_breakdown.deal_efficiency_score).toBe(10.5);
  });
});