import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-777
  test('営業プロセス標準書に記載される初回接触頻度の閾値がちょうど5回の場合、その値が指標選定に反映される', () => {
    const processStandardData = {
      initialContactFrequencyThreshold: 5,
      proposalSuccessRateThreshold: 0.7,
      followUpIntervalThreshold: 3,
      contractRateThreshold: 0.5
    };

    const result = selectAnalysisIndicators(processStandardData);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    const initialContactIndicator = result.find(
      (indicator: { name: string; threshold: number; priority: string }) => 
        indicator.name === '初回接触頻度'
    );

    expect(initialContactIndicator).toBeDefined();
    expect(initialContactIndicator.threshold).toBe(5);
    expect(initialContactIndicator.priority).toBe('高');

    const indicatorsWithInitialContact = result.filter(
      (indicator: { name: string; threshold: number; priority: string }) => 
        indicator.name === '初回接触頻度'
    );
    expect(indicatorsWithInitialContact).toHaveLength(1);
  });
});