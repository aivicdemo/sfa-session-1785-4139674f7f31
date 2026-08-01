import { analyzeSelectionIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-780
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書の提案成功率閾値がちょうど50%の場合、その値が指標選定に反映される', () => {
    const processStandardThreshold = 50;
    const selectedIndicators = analyzeSelectionIndicators({
      proposalSuccessRateThreshold: processStandardThreshold,
    });

    const proposalSuccessIndicator = selectedIndicators.find(
      (indicator) => indicator.name === 'proposalSuccessRate'
    );

    expect(proposalSuccessIndicator).toBeDefined();
    expect(proposalSuccessIndicator?.threshold).toBe(50);
    expect(selectedIndicators.length).toBeGreaterThan(0);
    expect(selectedIndicators.some((ind) => ind.name === 'proposalSuccessRate')).toBe(true);
  });
});