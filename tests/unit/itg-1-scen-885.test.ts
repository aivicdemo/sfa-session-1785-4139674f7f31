import { calculateTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('Team Sales Quality Statistics Analysis - Proposal Accuracy Validation', () => {
  // SCEN-885
  test('should throw error with INVALID_PROPOSAL_ACCURACY code when proposal accuracy exceeds 100%', () => {
    const salesPersonData = {
      salesPersonId: 'SP001',
      salesPersonName: 'Sales Rep A',
      proposalAccuracy: 100.5,
      followUpSuccessRate: 75.0,
      contractRate: 80.0,
    };

    const error = new Error();
    let thrownError: any = null;

    try {
      calculateTeamQualityStatistics([salesPersonData]);
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError.code).toBe('INVALID_PROPOSAL_ACCURACY');
    expect(thrownError.message).toMatch(/提案精度は0%以上100%以下である必要があります/);
    expect(thrownError.message).toMatch(/100\.5%/);
  });
});