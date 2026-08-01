import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-785
  test('営業プロセス標準書のフォローアップ間隔閾値が自動選定指標に反映される', () => {
    const standardProcessBook = {
      followupIntervalThresholdDays: 4,
      initialContactThresholdDays: 3,
      proposalSuccessRateThreshold: 0.6,
      customerResponseRateThreshold: 0.7,
    };

    const result = selectAnalysisIndicators(standardProcessBook);

    expect(result).toEqual({
      followupIntervalDays: 4,
      initialContactDays: 3,
      proposalSuccessRate: 0.6,
      customerResponseRate: 0.7,
      isAutoSelected: true,
    });
    expect(result.followupIntervalDays).toBe(4);
  });
});