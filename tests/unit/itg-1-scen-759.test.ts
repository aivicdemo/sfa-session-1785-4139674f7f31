import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-759
  test('月次営業会議トリガーにより行動パターン分析対象指標が自動選定される', () => {
    const mockCurrentTime = new Date('2024-02-01T09:00:00Z');
    const monthlyMeetingTriggeredAt = new Date('2024-02-01T09:00:00Z');

    const result = selectAnalysisIndicators({
      triggerType: 'monthly_meeting',
      triggeredAt: monthlyMeetingTriggeredAt,
    });

    expect(result.selectedIndicators).toEqual([
      '商談成功率',
      '初回接触から成約までの日数',
      '顧客訪問回数',
    ]);
    expect(result.selectionTimestamp).toEqual(mockCurrentTime);
  });
});