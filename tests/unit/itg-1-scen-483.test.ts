import { analyzeSellingActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-483
  test('[normal] 営業担当者の営業活動ログのメール件数が分析される', () => {
    const salesRepresentativeId = 'A';
    const activityLogs = [
      { id: '1', type: 'email', timestamp: '2024-01-15T09:00:00Z', salesRepresentativeId },
      { id: '2', type: 'email', timestamp: '2024-01-15T10:00:00Z', salesRepresentativeId },
      { id: '3', type: 'email', timestamp: '2024-01-15T11:00:00Z', salesRepresentativeId },
      { id: '4', type: 'email', timestamp: '2024-01-15T12:00:00Z', salesRepresentativeId },
      { id: '5', type: 'email', timestamp: '2024-01-15T13:00:00Z', salesRepresentativeId },
      { id: '6', type: 'email', timestamp: '2024-01-15T14:00:00Z', salesRepresentativeId },
      { id: '7', type: 'email', timestamp: '2024-01-15T15:00:00Z', salesRepresentativeId },
      { id: '8', type: 'email', timestamp: '2024-01-15T16:00:00Z', salesRepresentativeId },
      { id: '9', type: 'email', timestamp: '2024-01-15T17:00:00Z', salesRepresentativeId },
      { id: '10', type: 'email', timestamp: '2024-01-15T18:00:00Z', salesRepresentativeId },
      { id: '11', type: 'phone', timestamp: '2024-01-16T09:00:00Z', salesRepresentativeId },
      { id: '12', type: 'phone', timestamp: '2024-01-16T10:00:00Z', salesRepresentativeId },
      { id: '13', type: 'phone', timestamp: '2024-01-16T11:00:00Z', salesRepresentativeId },
      { id: '14', type: 'phone', timestamp: '2024-01-16T12:00:00Z', salesRepresentativeId },
      { id: '15', type: 'phone', timestamp: '2024-01-16T13:00:00Z', salesRepresentativeId },
      { id: '16', type: 'visit', timestamp: '2024-01-17T09:00:00Z', salesRepresentativeId },
      { id: '17', type: 'visit', timestamp: '2024-01-17T10:00:00Z', salesRepresentativeId },
      { id: '18', type: 'visit', timestamp: '2024-01-17T11:00:00Z', salesRepresentativeId },
    ];

    const report = analyzeSellingActivityPatternReport(salesRepresentativeId, activityLogs);

    expect(report.emailCount).toBe(10);
    expect(report.phoneCount).toBe(5);
    expect(report.visitCount).toBe(3);
    expect(report.salesRepresentativeId).toBe('A');
    expect(report.totalActivityCount).toBe(18);
  });
});