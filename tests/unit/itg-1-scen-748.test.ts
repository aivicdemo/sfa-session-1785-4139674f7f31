import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-748
  test('[normal] 行動パターン分析対象指標の自動選定機能 - 初回接触頻度がプロセス標準書に定義されている場合、分析対象指標に含まれる', () => {
    const processDefinitionId = 'proc_def_001';
    const processStandardData = {
      processDefinitionId: processDefinitionId,
      stageName: '初期段階',
      kpiDefinitions: [
        {
          indicatorId: 'initial_contact_frequency',
          indicatorName: '初回接触頻度',
          targetValue: 5,
          unit: '回/月'
        },
        {
          indicatorId: 'proposal_success_rate',
          indicatorName: '提案成功率',
          targetValue: 60,
          unit: '%'
        },
        {
          indicatorId: 'followup_interval',
          indicatorName: 'フォローアップ間隔',
          targetValue: 7,
          unit: '日'
        }
      ]
    };

    const result = selectAnalysisIndicators(processStandardData);

    expect(result).toBeDefined();
    expect(result.indicators).toBeDefined();
    expect(Array.isArray(result.indicators)).toBe(true);
    expect(result.indicators.length).toBe(3);

    const initialContactIndicator = result.indicators.find(
      (ind: { indicatorId: string; indicatorName: string }) =>
        ind.indicatorId === 'initial_contact_frequency'
    );

    expect(initialContactIndicator).toBeDefined();
    expect(initialContactIndicator.indicatorId).toBe('initial_contact_frequency');
    expect(initialContactIndicator.indicatorName).toBe('初回接触頻度');
  });
});