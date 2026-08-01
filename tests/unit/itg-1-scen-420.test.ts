import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-420
  test('分析結果データが欠落している場合、エラーとして処理される', () => {
    const analysisData = {
      emp_id: 'EMP001',
      visit_count: null,
      avg_meeting_time: undefined,
      close_rate: null,
      proposal_count: 5,
      follow_up_frequency: 2.5,
    };

    expect(() => {
      generateSalesPersonBehaviorAnalysisReport(analysisData);
    }).toThrow(/DATA_MISSING_ERROR/);

    try {
      generateSalesPersonBehaviorAnalysisReport(analysisData);
    } catch (error: any) {
      expect(error.message).toContain('営業担当者EMP001の行動パターン分析に必要なデータが欠落しています');
      expect(error.missingFields).toContain('visit_count');
      expect(error.missingFields).toContain('avg_meeting_time');
      expect(error.missingFields).toContain('close_rate');
    }
  });
});