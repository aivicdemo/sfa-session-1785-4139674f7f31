import { analyzeBusinessMetricsAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1145
  test('メール送信件数が負の値のとき、エラーコード INVALID_METRIC_VALUE を返す', () => {
    const input = {
      salesRepId: 'SR001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      emailsSent: -5,
      callsMade: 10,
      visitsCompleted: 8,
      proposalsSubmitted: 3,
      closedDeals: 1,
    };

    expect(() => analyzeBusinessMetricsAndGenerateReport(input)).toThrow(
      /メール送信件数/
    );
  });
});