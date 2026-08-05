import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-634
  test('分析対象期間の日付フォーマットが不正のときエラーになる', async () => {
    const input = {
      sales_person_id: 'EMP001',
      sales_person_name: '田中太郎',
      start_date: '2024/13/45',
      end_date: '2024-12-31',
    };

    await expect(generateSalesPersonAnalysisReport(input)).rejects.toThrow(/日付フォーマット/);
  });
});