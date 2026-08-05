import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1115
  test('開始日が終了日より後の日付のとき、処理がエラーになること', () => {
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');
    const sales_person_id = 'SP001';
    const report_format = 'pdf';

    expect(() =>
      generateBehaviorPatternAnalysisReport({
        start_date,
        end_date,
        sales_person_id,
        report_format,
      })
    ).toThrow(/開始日は終了日以前である必要があります/);
  });
});