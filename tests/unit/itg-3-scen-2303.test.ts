import { compareProposalWithStandardProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2303
  test('標準プロセス定義データが欠落しているとき比較基準が不在になる', () => {
    const proposalInput = {
      proposalApproach: '顧客課題に基づいた段階的導入提案',
      targetCustomer: '製造業',
      dealAmount: 5000000,
    };

    const mockStandardProcessDefinitionFetch = jest.fn().mockResolvedValue([]);

    const result = compareProposalWithStandardProcess(
      proposalInput,
      mockStandardProcessDefinitionFetch
    );

    expect(result).toEqual({
      comparisonStatus: 'BENCHMARK_NOT_AVAILABLE',
      benchmarkDataMissing: true,
      comparisonScores: null,
      deviationAnalysis: null,
      errorMessage:
        '標準プロセス定義データが未設定のため、比較基準が存在しません。管理者に標準プロセス定義の登録を依頼してください。',
    });

    expect(mockStandardProcessDefinitionFetch).toHaveBeenCalled();
  });
});