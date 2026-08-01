import { selectAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定', () => {
  // SCEN-756
  test('相関係数が負の値である指標は分析対象から除外される', () => {
    const standardMetrics = [
      { metricId: 'contact_count', name: '接触回数', standardValue: 8 },
      { metricId: 'proposal_count', name: '提案回数', standardValue: 3 },
      { metricId: 'followup_days', name: 'フォローアップ日数', standardValue: 5 },
      { metricId: 'meeting_duration', name: '面談時間', standardValue: 60 },
      { metricId: 'email_frequency', name: 'メール送信頻度', standardValue: 12 }
    ];

    const contractResults = [
      { metricId: 'contact_count', actualValue: 7, contractAmount: 100000 },
      { metricId: 'contact_count', actualValue: 9, contractAmount: 150000 },
      { metricId: 'contact_count', actualValue: 6, contractAmount: 80000 },
      { metricId: 'proposal_count', actualValue: 2, contractAmount: 120000 },
      { metricId: 'proposal_count', actualValue: 4, contractAmount: 160000 },
      { metricId: 'proposal_count', actualValue: 3, contractAmount: 140000 },
      { metricId: 'followup_days', actualValue: 4, contractAmount: 130000 },
      { metricId: 'followup_days', actualValue: 6, contractAmount: 170000 },
      { metricId: 'followup_days', actualValue: 5, contractAmount: 150000 },
      { metricId: 'meeting_duration', actualValue: 50, contractAmount: 90000 },
      { metricId: 'meeting_duration', actualValue: 70, contractAmount: 180000 },
      { metricId: 'meeting_duration', actualValue: 60, contractAmount: 160000 },
      { metricId: 'email_frequency', actualValue: 15, contractAmount: 70000 },
      { metricId: 'email_frequency', actualValue: 10, contractAmount: 110000 },
      { metricId: 'email_frequency', actualValue: 12, contractAmount: 85000 }
    ];

    const result = selectAnalysisMetrics(standardMetrics, contractResults);

    expect(result).toHaveLength(4);
    expect(result.map((m) => m.metricId)).toEqual(
      expect.arrayContaining(['proposal_count', 'followup_days', 'meeting_duration', 'email_frequency'])
    );
    expect(result.map((m) => m.metricId)).not.toContain('contact_count');

    const contactMetric = result.find((m) => m.metricId === 'contact_count');
    expect(contactMetric).toBeUndefined();

    const proposalMetric = result.find((m) => m.metricId === 'proposal_count');
    expect(proposalMetric).toBeDefined();
    expect(proposalMetric?.correlationCoefficient).toBeGreaterThanOrEqual(0);

    const followupMetric = result.find((m) => m.metricId === 'followup_days');
    expect(followupMetric).toBeDefined();
    expect(followupMetric?.correlationCoefficient).toBeGreaterThanOrEqual(0);

    const meetingMetric = result.find((m) => m.metricId === 'meeting_duration');
    expect(meetingMetric).toBeDefined();
    expect(meetingMetric?.correlationCoefficient).toBeGreaterThanOrEqual(0);

    const emailMetric = result.find((m) => m.metricId === 'email_frequency');
    expect(emailMetric).toBeDefined();
    expect(emailMetric?.correlationCoefficient).toBeGreaterThanOrEqual(0);

    result.forEach((metric) => {
      expect(metric.correlationCoefficient).toBeLessThanOrEqual(1);
      expect(metric.correlationCoefficient).toBeGreaterThanOrEqual(0);
    });
  });
});