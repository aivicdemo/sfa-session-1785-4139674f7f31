import { selectBehaviorPatternAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-753
  test('フォローアップ間隔がプロセス標準書に定義されていない場合、分析対象指標に含まれない', () => {
    const processDefinitions = [
      {
        indicatorId: 'indicator_001',
        indicatorName: '初回接触頻度',
        followUpIntervalDays: 7,
        isActive: true,
      },
      {
        indicatorId: 'indicator_002',
        indicatorName: 'フォローアップ間隔',
        followUpIntervalDays: null,
        isActive: true,
      },
      {
        indicatorId: 'indicator_003',
        indicatorName: '提案成功率',
        followUpIntervalDays: 14,
        isActive: true,
      },
      {
        indicatorId: 'indicator_004',
        indicatorName: '顧客接触頻度',
        followUpIntervalDays: undefined,
        isActive: true,
      },
    ];

    const result = selectBehaviorPatternAnalysisIndicators(processDefinitions);

    expect(result).toEqual({
      selectedIndicators: [
        {
          indicatorId: 'indicator_001',
          indicatorName: '初回接触頻度',
          followUpIntervalDays: 7,
        },
        {
          indicatorId: 'indicator_003',
          indicatorName: '提案成功率',
          followUpIntervalDays: 14,
        },
      ],
      undefinedFollowUpIntervalCount: 2,
    });
    expect(result.selectedIndicators.length).toBe(2);
    expect(result.undefinedFollowUpIntervalCount).toBe(2);
  });
});