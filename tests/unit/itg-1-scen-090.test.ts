import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-090: 営業担当者0人の分析レポートが正常に生成される', () => {
    // Arrange: 月次営業会議完了ステータスと営業担当者0人の状態をセットアップ
    const currentDate = new Date('2024-01-15T11:00:00Z');
    const targetYearMonth = '2024-01';
    const salesRepresentatives: any[] = [];

    // Act: 営業担当者行動パターン分析レポート生成機能を実行
    const report = generateSalesPerformanceAnalysisReport({
      targetPeriod: targetYearMonth,
      salesRepresentatives: salesRepresentatives,
      generatedAt: currentDate,
      conferenceStatus: 'completed',
    });

    // Assert: レポートオブジェクトが存在することを確認
    expect(report).toBeDefined();

    // レポートの分析対象期間が当月である（yyyy-mm形式）ことを確認
    expect(report.targetPeriod).toBe(targetYearMonth);

    // レポートの営業担当者分析セクションが空配列であることを確認
    expect(report.salesRepresentativeAnalysis).toEqual([]);

    // レポートのステータスが「completed」であることを確認
    expect(report.status).toBe('completed');

    // レポートの生成タイムスタンプが現在時刻の±1分以内であることを確認
    const reportTimestamp = new Date(report.generatedTimestamp).getTime();
    const expectedTimestamp = currentDate.getTime();
    const oneMinuteInMs = 60 * 1000;
    expect(Math.abs(reportTimestamp - expectedTimestamp)).toBeLessThanOrEqual(oneMinuteInMs);
  });
});