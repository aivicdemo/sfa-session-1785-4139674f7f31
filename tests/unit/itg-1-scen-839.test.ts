import { generateSalesProcessAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-839
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 成約実績が複数件の場合、全件を集約して相関を計算する', () => {
    const salesRepId = 'REP-001';
    const standardProcessStep = '提案';
    const standardContractRate = 70;
    
    // テストデータ: 同一営業担当者に紐付く成約実績3件
    const contractResults = [
      {
        id: 'CONTRACT-001',
        salesRepId: salesRepId,
        amount: 1000000, // 100万円
        processStep: standardProcessStep,
      },
      {
        id: 'CONTRACT-002',
        salesRepId: salesRepId,
        amount: 1500000, // 150万円
        processStep: standardProcessStep,
      },
      {
        id: 'CONTRACT-003',
        salesRepId: salesRepId,
        amount: 2000000, // 200万円
        processStep: standardProcessStep,
      },
    ];

    const targetPeriodProposalCount = 10; // 対象期間における提案数

    const input = {
      salesRepId: salesRepId,
      contractResults: contractResults,
      standardProcessStep: standardProcessStep,
      standardContractRate: standardContractRate,
      targetPeriodProposalCount: targetPeriodProposalCount,
    };

    const result = generateSalesProcessAnalysisReport(input);

    // 期待値の計算
    const expectedAggregatedContractAmount = 4500000; // 100万 + 150万 + 200万 = 450万円
    const expectedContractCount = 3;
    const expectedActualContractRate = (3 / 10) * 100; // 30%
    const expectedDeviationRate =
      ((expectedActualContractRate - standardContractRate) / standardContractRate) * 100;
    // (30 - 70) / 70 * 100 = -57.14%

    // 成約実績の集約値を検証
    expect(result.aggregatedContractAmount).toBe(expectedAggregatedContractAmount);
    expect(result.aggregatedContractCount).toBe(expectedContractCount);

    // 実績成約率を検証
    expect(result.actualContractRate).toBeCloseTo(expectedActualContractRate, 2);

    // 乖離度の計算を検証
    expect(result.deviationRate).toBeCloseTo(expectedDeviationRate, 2);

    // 分析結果に紐付いて、入力に使用した3件の成約実績IDが記録されていることを検証
    expect(result.sourceContractIds).toEqual([
      'CONTRACT-001',
      'CONTRACT-002',
      'CONTRACT-003',
    ]);

    // 集約計算の根拠データセット（各件の成約金額、ステップ分類、集約式）がレポート内に記録されていることを検証
    expect(result.aggregationBasis).toBeDefined();
    expect(result.aggregationBasis.contractBreakdown).toHaveLength(3);
    expect(result.aggregationBasis.contractBreakdown[0]).toEqual({
      id: 'CONTRACT-001',
      amount: 1000000,
      processStep: standardProcessStep,
    });
    expect(result.aggregationBasis.contractBreakdown[1]).toEqual({
      id: 'CONTRACT-002',
      amount: 1500000,
      processStep: standardProcessStep,
    });
    expect(result.aggregationBasis.contractBreakdown[2]).toEqual({
      id: 'CONTRACT-003',
      amount: 2000000,
      processStep: standardProcessStep,
    });

    // 集約式の記録を検証
    expect(result.aggregationBasis.formula).toBe(
      'sum(contract amounts) = 1000000 + 1500000 + 2000000'
    );

    // 乖離度計算式の記録を検証
    expect(result.deviationFormula).toBe(
      '(actualRate - standardRate) / standardRate * 100 = (30 - 70) / 70 * 100'
    );
  });
});