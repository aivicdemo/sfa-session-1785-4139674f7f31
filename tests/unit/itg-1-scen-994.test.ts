import { determineApprovalCriteriaMet } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-994
  test('should return WORKSHOP_PARTICIPANTS_BELOW_THRESHOLD when participant count is below approval threshold', () => {
    const workshopParticipantCount = 9;
    const approvalThresholdMinParticipants = 10;

    const result = determineApprovalCriteriaMet({
      workshopParticipantCount,
      approvalThresholdMinParticipants,
    });

    expect(result.canProceed).toBe(false);
    expect(result.errorCode).toBe('WORKSHOP_PARTICIPANTS_BELOW_THRESHOLD');
  });
});