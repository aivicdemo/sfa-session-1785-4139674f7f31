import { analyzeCorrelationWithSalesResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1182: [normal] 成約実績との相関分析機能 - 同じ入力データで相関分析を2回実行しても同じ結果が得られる
  test('should return identical correlation analysis results when executed twice with same input data', () => {
    // テスト用の固定営業データセット
    const salesPersonId = 'salesperson-a-001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-06-30T23:59:59Z');
    const totalContactCount = 120;
    const totalProposalCount = 45;
    const totalContractCount = 15;

    // 分析入力パラメータ
    const analysisParams = {
      salesPersonId,
      startDate: analysisStartDate,
      endDate: analysisEndDate,
      contactCount: totalContactCount,
      proposalCount: totalProposalCount,
      contractCount: totalContractCount,
      analysisAlgorithm: 'pearson_correlation' as const,
    };

    // 1回目の分析実行
    const firstAnalysisResult = analyzeCorrelationWithSalesResults(analysisParams);

    // 1回目の結果から相関係数を記録
    const firstContactRateCorrelation = firstAnalysisResult.contactFrequencyCorrelation;
    const firstProposalCategoryDistribution = firstAnalysisResult.proposalCategoryDistribution;
    const firstFollowUpCorrelation = firstAnalysisResult.followUpIntervalCorrelation;
    const firstSuccessPatterns = firstAnalysisResult.successPatterns;

    // 分析処理が完全に終了し、結果がシステムに保存されたことを確認
    expect(firstAnalysisResult).toBeDefined();
    expect(firstAnalysisResult.analysisId).toBeDefined();
    expect(firstAnalysisResult.timestamp).toBeDefined();

    // 2回目の分析実行（同一のパラメータ）
    const secondAnalysisResult = analyzeCorrelationWithSalesResults(analysisParams);

    // 2回目の結果から相関係数を記録
    const secondContactRateCorrelation = secondAnalysisResult.contactFrequencyCorrelation;
    const secondProposalCategoryDistribution = secondAnalysisResult.proposalCategoryDistribution;
    const secondFollowUpCorrelation = secondAnalysisResult.followUpIntervalCorrelation;
    const secondSuccessPatterns = secondAnalysisResult.successPatterns;

    // 期待結果: 1回目と2回目の分析結果における値が完全に一致すること
    // (1) 接触頻度と成約率の相関係数の値を小数第5位まで比較
    expect(secondContactRateCorrelation).toBe(firstContactRateCorrelation);
    expect(Number(secondContactRateCorrelation.toFixed(5))).toBe(
      Number(firstContactRateCorrelation.toFixed(5))
    );

    // (2) 提案内容カテゴリ別成約率の分布が一致
    expect(secondProposalCategoryDistribution).toEqual(firstProposalCategoryDistribution);
    secondProposalCategoryDistribution.forEach((secondRate, index) => {
      const firstRate = firstProposalCategoryDistribution[index];
      expect(Number(secondRate.toFixed(5))).toBe(Number(firstRate.toFixed(5)));
    });

    // (3) フォローアップ間隔と成約達成率の関係が一致
    expect(secondFollowUpCorrelation).toBe(firstFollowUpCorrelation);
    expect(Number(secondFollowUpCorrelation.toFixed(5))).toBe(
      Number(firstFollowUpCorrelation.toFixed(5))
    );

    // (4) 成功パターンとして抽出された営業行動パターンの定義が一致
    expect(secondSuccessPatterns).toEqual(firstSuccessPatterns);
    expect(secondSuccessPatterns.length).toBe(firstSuccessPatterns.length);
    secondSuccessPatterns.forEach((secondPattern, index) => {
      const firstPattern = firstSuccessPatterns[index];
      expect(secondPattern.patternId).toBe(firstPattern.patternId);
      expect(secondPattern.description).toBe(firstPattern.description);
      expect(Number(secondPattern.successRate.toFixed(5))).toBe(
        Number(firstPattern.successRate.toFixed(5))
      );
      expect(secondPattern.occurrenceCount).toBe(firstPattern.occurrenceCount);
    });

    // すべての数値が小数第5位まで同一であり、分析ロジックが確定的に動作することを確認
    expect(Number(secondContactRateCorrelation.toFixed(5))).toBe(
      Number(firstContactRateCorrelation.toFixed(5))
    );
    expect(Number(secondFollowUpCorrelation.toFixed(5))).toBe(
      Number(firstFollowUpCorrelation.toFixed(5))
    );
  });
});