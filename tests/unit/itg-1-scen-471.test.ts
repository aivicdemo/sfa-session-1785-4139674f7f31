import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-471
  it('分析対象期間の終了日が欠落している場合、エラーを返す', () => {
    const request_payload = {
      sales_rep_id: 'SR-20240115-001',
      analysis_type: 'monthly_activity_pattern',
      period_start_date: '2024-01-01',
      period_end_date: '',
    };

    expect(() => generateSalesActivityAnalysisReport(request_payload)).toThrow(/終了日/);
  });
});