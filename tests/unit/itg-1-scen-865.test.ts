import { analyzeProcessComplianceAndContractCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-865: 分析期間が月末をまたぐ場合、正確に日付を認識して集計する', () => {
    // テストデータの準備：分析期間を2024年1月29日～2024年2月2日に設定
    const analysisStartDate = new Date('2024-01-29T00:00:00Z');
    const analysisEndDate = new Date('2024-02-02T23:59:59Z');

    // 営業データベースのスタブレコード
    // 1月29日に成約1件（金額100万円）
    // 1月31日に成約2件（各50万円）
    // 2月1日に成約1件（金額80万円）
    // 2月2日に成約1件（金額120万円）
    const contractRecords = [
      {
        contractDate: new Date('2024-01-29T09:00:00Z'),
        contractAmount: 1000000,
        contractCount: 1,
      },
      {
        contractDate: new Date('2024-01-31T10:30:00Z'),
        contractAmount: 500000,
        contractCount: 1,
      },
      {
        contractDate: new Date('2024-01-31T14:00:00Z'),
        contractAmount: 500000,
        contractCount: 1,
      },
      {
        contractDate: new Date('2024-02-01T11:15:00Z'),
        contractAmount: 800000,
        contractCount: 1,
      },
      {
        contractDate: new Date('2024-02-02T15:45:00Z'),
        contractAmount: 1200000,
        contractCount: 1,
      },
    ];

    // 営業プロセス標準書スタブ：月次での標準成約件数を4件、標準成約額を350万円
    const standardProcessDefinition = {
      monthlyStandardContractCount: 4,
      monthlyStandardContractAmount: 3500000,
    };

    // 分析エンジンに分析期間での集計を実行
    const analysisResult = analyzeProcessComplianceAndContractCorrelation({
      analysisStartDate,
      analysisEndDate,
      contractRecords,
      standardProcessDefinition,
    });

    // 期待結果の検証

    // 総成約件数が5件
    expect(analysisResult.totalContractCount).toBe(5);

    // 総成約額が400万円
    expect(analysisResult.totalContractAmount).toBe(4000000);

    // 月別内訳：1月分が3件300万円
    expect(analysisResult.monthlyBreakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: '2024-01',
          contractCount: 3,
          contractAmount: 2000000,
        }),
      ]),
    );

    // 月別内訳：2月分が2件200万円
    expect(analysisResult.monthlyBreakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: '2024-02',
          contractCount: 2,
          contractAmount: 2000000,
        }),
      ]),
    );

    // レポートメタデータに分析期間の開始日時が2024-01-29T00:00:00Z
    expect(analysisResult.metadata.analysisStartDateTime).toBe(
      '2024-01-29T00:00:00Z',
    );

    // レポートメタデータに分析期間の終了日時が2024-02-02T23:59:59Z
    expect(analysisResult.metadata.analysisEndDateTime).toBe(
      '2024-02-02T23:59:59Z',
    );
  });
});