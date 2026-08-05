import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-511: 営業活動ログが逆順入力されても時系列で正しく分析される', () => {
    // Arrange
    const employeeId = 'EMP001';
    const analysisDate = '2024-01-15';
    
    // 逆順で3件の営業活動ログを作成
    // 入力順序: 15:00 → 14:00 → 13:00 (実際の時系列と逆)
    const salesActivityLogs = [
      {
        id: 'LOG001',
        employeeId: employeeId,
        activityType: 'deal_close',
        activityDatetime: '2024-01-15T15:00:00Z',
        dealAmount: 1000000,
        dealTitle: '契約成立',
        description: '案件クローズ',
      },
      {
        id: 'LOG002',
        employeeId: employeeId,
        activityType: 'proposal_sent',
        activityDatetime: '2024-01-15T14:00:00Z',
        dealAmount: 1000000,
        dealTitle: '提案書送付',
        description: '提案書を顧客に送付',
      },
      {
        id: 'LOG003',
        employeeId: employeeId,
        activityType: 'initial_contact',
        activityDatetime: '2024-01-15T13:00:00Z',
        dealAmount: 0,
        dealTitle: '初回接触',
        description: '顧客との初回接触',
      },
    ];

    // Act
    const report = generateSalesActivityPatternAnalysisReport({
      employeeId: employeeId,
      analysisDate: analysisDate,
      salesActivityLogs: salesActivityLogs,
    });

    // Assert
    // レポートの行動タイムラインが時系列の昇順で並び替えられていることを確認
    expect(report.actionTimeline).toBeDefined();
    expect(report.actionTimeline.length).toBe(3);

    // タイムラインが昇順で並んでいることを確認
    expect(report.actionTimeline[0].activityDatetime).toBe('2024-01-15T13:00:00Z');
    expect(report.actionTimeline[0].activityType).toBe('initial_contact');
    expect(report.actionTimeline[0].description).toBe('顧客との初回接触');

    expect(report.actionTimeline[1].activityDatetime).toBe('2024-01-15T14:00:00Z');
    expect(report.actionTimeline[1].activityType).toBe('proposal_sent');
    expect(report.actionTimeline[1].description).toBe('提案書を顧客に送付');

    expect(report.actionTimeline[2].activityDatetime).toBe('2024-01-15T15:00:00Z');
    expect(report.actionTimeline[2].activityType).toBe('deal_close');
    expect(report.actionTimeline[2].dealAmount).toBe(1000000);
    expect(report.actionTimeline[2].description).toBe('案件クローズ');

    // 営業プロセスの進行順序が正しいことを確認
    expect(report.processSequenceCorrect).toBe(true);
    
    // 各ステップの時刻が正しい順序で格納されていることを確認
    const timestamps = report.actionTimeline.map((log) => log.activityDatetime);
    expect(timestamps).toEqual([
      '2024-01-15T13:00:00Z',
      '2024-01-15T14:00:00Z',
      '2024-01-15T15:00:00Z',
    ]);
  });
});