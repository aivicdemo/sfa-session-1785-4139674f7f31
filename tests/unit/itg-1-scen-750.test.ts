import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-750
  test('行動パターン分析対象指標の自動選定機能 - 提案成功率がプロセス標準書に定義されている場合、分析対象指標に含まれる', () => {
    const processDefinitionIndicators = [
      {
        indicatorId: 'IND-001',
        indicatorName: '提案成功率',
        indicatorCategory: 'プロセス標準書定義指標',
        definition: '提案数に対する採用された提案数の比率',
      },
      {
        indicatorId: 'IND-002',
        indicatorName: '初回接触頻度',
        indicatorCategory: 'プロセス標準書定義指標',
        definition: '月次の新規顧客初回接触回数',
      },
      {
        indicatorId: 'IND-003',
        indicatorName: 'フォローアップ成功率',
        indicatorCategory: 'プロセス標準書定義指標',
        definition: 'フォローアップ実施数に対する応答取得率',
      },
    ];

    const contractResultsData = {
      totalContractsMonth: 12,
      totalProposalsMonth: 45,
    };

    const result = selectAnalysisIndicators(
      processDefinitionIndicators,
      contractResultsData
    );

    expect(result).toEqual({
      selectedIndicators: [
        {
          indicatorId: 'IND-001',
          indicatorName: '提案成功率',
          indicatorCategory: 'プロセス標準書定義指標',
        },
        {
          indicatorId: 'IND-002',
          indicatorName: '初回接触頻度',
          indicatorCategory: 'プロセス標準書定義指標',
        },
        {
          indicatorId: 'IND-003',
          indicatorName: 'フォローアップ成功率',
          indicatorCategory: 'プロセス標準書定義指標',
        },
      ],
      selectionTimestamp: '2024-01-15T11:00:00Z',
      selectionSource: 'プロセス標準書連携',
    });

    const proposalSuccessRateIndicator = result.selectedIndicators.find(
      (indicator) => indicator.indicatorName === '提案成功率'
    );

    expect(proposalSuccessRateIndicator).toBeDefined();
    expect(proposalSuccessRateIndicator?.indicatorName).toBe('提案成功率');
    expect(proposalSuccessRateIndicator?.indicatorCategory).toBe(
      'プロセス標準書定義指標'
    );
  });
});