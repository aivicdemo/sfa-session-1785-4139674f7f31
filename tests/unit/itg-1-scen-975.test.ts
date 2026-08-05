import { extractSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-975: ワークショップ参加者リストがnullのときエラーになる', () => {
    const workshopData = {
      workshopId: 'ws-2024-01-15',
      workshopDate: '2024-01-15T09:00:00Z',
      workshopParticipants: null,
      successCaseIds: ['case-001', 'case-002', 'case-003'],
      failureCaseIds: ['case-004', 'case-005']
    };

    expect(() => extractSuccessFailureFactors(workshopData)).toThrow(/WORKSHOP_PARTICIPANTS_NULL|ワークショップ参加者/);
  });
});