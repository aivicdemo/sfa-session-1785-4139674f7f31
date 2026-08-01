import { analyzeActionPatternsAndCorrelateWithClosingResults } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-863: [normal] 営業プロセス標準書との乖離分析と成約実績の相関分析 - 行動パターンデータの日付が分析期間の開始日と終了日の間に収まる場合、正確に集計する', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const actionPatternData = [
      {
        recordDate: new Date('2024-01-05T00:00:00Z'),
        salesPersonId: '001',
        actionType: '初回訪問',
        closingFlag: false,
      },
      {
        recordDate: new Date('2024-01-15T00:00:00Z'),
        salesPersonId: '001',
        actionType: '提案',
        closingFlag: false,
      },
      {
        recordDate: new Date('2024-01-25T00:00:00Z'),
        salesPersonId: '001',
        actionType: 'クロージング',
        closingFlag: true,
      },
      {
        recordDate: new Date('2024-01-31T00:00:00Z'),
        salesPersonId: '002',
        actionType: '初回訪問',
        closingFlag: false,
      },
    ];

    const result = analyzeActionPatternsAndCorrelateWithClosingResults(
      actionPatternData,
      analysisStartDate,
      analysisEndDate
    );

    expect(result).toBeDefined();
    expect(result.salesPerson001).toBeDefined();
    expect(result.salesPerson001.actionPatternCount).toBe(3);
    expect(result.salesPerson001.closingResultCount).toBe(1);
    expect(result.salesPerson002).toBeDefined();
    expect(result.salesPerson002.actionPatternCount).toBe(1);
    expect(result.salesPerson002.closingResultCount).toBe(0);
  });
});