import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesRepActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  let mockCurrentDate: Date;

  beforeEach(() => {
    mockCurrentDate = new Date('2024-01-15T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-656
  test('同一営業担当者の複数提案に同一の成功パターンが適用されるとき、すべてが正確に記録される', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '田中太郎';
    const success_pattern_id = 'SP001';
    const success_pattern = {
      customer_enterprise_size: '大企業',
      industry: '製造業',
      proposal_amount_threshold: 5000000,
    };

    const proposals = [
      {
        proposal_id: 'PROP001',
        sales_rep_id: sales_rep_id,
        customer_name: '株式会社A製造',
        customer_enterprise_size: '大企業',
        industry: '製造業',
        proposal_amount: 5500000,
        success_pattern_id: success_pattern_id,
        success_pattern_match_degree: 100,
        applied_at: '2024-01-15T10:00:00Z',
      },
      {
        proposal_id: 'PROP002',
        sales_rep_id: sales_rep_id,
        customer_name: '株式会社B製造',
        customer_enterprise_size: '大企業',
        industry: '製造業',
        proposal_amount: 6200000,
        success_pattern_id: success_pattern_id,
        success_pattern_match_degree: 100,
        applied_at: '2024-01-15T10:00:00Z',
      },
      {
        proposal_id: 'PROP003',
        sales_rep_id: sales_rep_id,
        customer_name: '株式会社C製造',
        customer_enterprise_size: '大企業',
        industry: '製造業',
        proposal_amount: 7100000,
        success_pattern_id: success_pattern_id,
        success_pattern_match_degree: 100,
        applied_at: '2024-01-15T10:00:00Z',
      },
    ];

    const report = generateSalesRepActionPatternAnalysisReport({
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      proposals: proposals,
      report_generated_at: mockCurrentDate,
    });

    expect(report.sales_rep_id).toBe(sales_rep_id);
    expect(report.sales_rep_name).toBe(sales_rep_name);
    expect(report.report_generated_at).toEqual(mockCurrentDate);

    expect(report.proposals).toHaveLength(3);

    const pattern_applied_proposals = report.proposals.filter(
      (p) => p.success_pattern_id === success_pattern_id
    );
    expect(pattern_applied_proposals).toHaveLength(3);

    for (const proposal of report.proposals) {
      expect(proposal.success_pattern_applied_flag).toBe(true);
      expect(proposal.success_pattern_applied_at).toBe('2024-01-15T10:00:00Z');
      expect(proposal.success_pattern_match_degree).toBe(100);
    }

    expect(report.success_pattern_application_count).toBe(3);
    expect(report.success_pattern_application_rate).toBe(100);
  });
});