import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-784
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書のフォローアップ間隔閾値が2日の場合、その値が指標選定に反映される', () => {
    const process_standard_book = {
      process_id: 'PSB001',
      followup_interval_threshold_days: 2,
      initial_contact_required: true,
      proposal_required: true,
      negotiation_required: true,
      closing_required: true,
      created_at: new Date('2024-01-15T09:00:00Z'),
      updated_at: new Date('2024-01-15T09:00:00Z'),
    };

    const result = selectAnalysisIndicators(process_standard_book);

    expect(result).toBeDefined();
    expect(Array.isArray(result.selected_indicators)).toBe(true);
    expect(result.selected_indicators.length).toBeGreaterThan(0);

    const followup_interval_indicator = result.selected_indicators.find(
      (indicator: { indicator_name: string; threshold_days?: number }) =>
        indicator.indicator_name === 'followup_interval'
    );

    expect(followup_interval_indicator).toBeDefined();
    expect(followup_interval_indicator.threshold_days).toBe(2);
  });
});