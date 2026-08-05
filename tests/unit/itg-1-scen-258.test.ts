import { calculateProcessComplianceAndDeviation } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-258
  test('行動パターン分析と改善指導優先順位判定機能 - 営業担当者の乖離度計算と相関分析に基づいて改善指導対象判定', () => {
    // テストデータ準備: 営業担当者A（ID: EMP001）の過去6ヶ月間データ
    const salesPersonId = 'EMP001';
    const performanceData = {
      salesPersonId,
      discussionProgressAverage: 75, // 商談進捗度平均 75%
      proposalContentScore: 82, // 提案内容スコア 82点
      customerContactFrequency: 9.2, // 顧客接触頻度 9.2回/月
      contractResultsMonthlyAverage: 3, // 成約実績 月平均3件
    };

    // 業界平均標準値（スタブデータ）
    const industryStandardValues = {
      discussionProgressAverage: 68, // 商談進捗度 68%
      proposalContentScore: 78, // 提案内容スコア 78点
      customerContactFrequency: 8.5, // 顧客接触頻度 8.5回/月
      contractResultsMonthlyAverage: 2.8, // 成約実績 月平均 2.8件
    };

    // 乖離度計算実行
    const result = calculateProcessComplianceAndDeviation(performanceData, industryStandardValues);

    // 期待結果検証: 乖離度スコア計算
    // 商談進捗度乖離度: 75 - 68 = +7 (実際は計算ロジックにより調整される可能性)
    // 提案内容乖離度: 82 - 78 = +4
    // 顧客接触頻度乖離度: 9.2 - 8.5 = +0.7 (スコア換算で +8 と想定)
    // 合計乖離度スコア: 9 + 4 + 8 = 21

    expect(result.deviationScores).toBeDefined();
    expect(result.deviationScores.discussionProgressDeviation).toBe(9);
    expect(result.deviationScores.proposalContentDeviation).toBe(4);
    expect(result.deviationScores.customerContactFrequencyDeviation).toBe(8);

    const totalDeviationScore =
      result.deviationScores.discussionProgressDeviation +
      result.deviationScores.proposalContentDeviation +
      result.deviationScores.customerContactFrequencyDeviation;
    expect(totalDeviationScore).toBe(21);

    // 成約実績との相関係数検証
    // 相関係数が0.78（正の相関）として算出
    expect(result.correlationWithContractResults).toBe(0.78);

    // 改善指導対象者判定ルール適用
    // ルール: 乖離度スコア合計が基準値150以下かつ成約実績が同期平均以下
    // 結果: 乖離度スコア21 < 150 かつ 成約実績3件 > 2.8件（平均超過）
    // → 改善指導対象者リストに含まれず、指導内容は「対象外」
    expect(result.improvementInstructionRequired).toBe(false);
    expect(result.improvementInstructionStatus).toBe('対象外');
    expect(result.improvementTargets).toEqual([]);
  });
});