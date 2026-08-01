import { selectAnalysisMetrics } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-779
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書に記載される初回接触頻度の閾値が6回の場合、その値が指標選定に反映される', () => {
    const salesProcessStandardBook = {
      initial_contact_frequency_threshold: 6,
      proposal_success_rate_threshold: 0.5,
      followup_interval_days: 7,
      negotiation_days_max: 30,
    };

    const selected_metrics = selectAnalysisMetrics(salesProcessStandardBook);

    const initial_contact_metric = selected_metrics.find(
      (metric) => metric.indicator_name === 'initial_contact_frequency'
    );

    expect(initial_contact_metric).toBeDefined();
    expect(initial_contact_metric?.threshold_value).toBe(6);
    expect(initial_contact_metric?.unit).toBe('times');
    expect(selected_metrics.length).toBeGreaterThan(0);
  });
});