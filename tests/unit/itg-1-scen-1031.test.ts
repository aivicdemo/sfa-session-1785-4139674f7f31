import { determineSalesPatternApplicationGuidanceCompleteness } from '../../src/logic/it-1-br-2-1-1';

describe('Sales Pattern Application Guidance Completion Determination', () => {
  // SCEN-1031
  test('should throw error when team training completion flag is missing for any team member', () => {
    const salesTeamData = {
      teamId: 'TEAM-001',
      teamName: 'Sales Team Alpha',
      members: [
        {
          salesPersonId: 'SP-001',
          name: 'John Doe',
          trainingCompletionFlag: true,
          trainingCompletionDate: new Date('2024-01-15T09:00:00Z'),
        },
        {
          salesPersonId: 'SP-002',
          name: 'Jane Smith',
          trainingCompletionFlag: true,
          trainingCompletionDate: new Date('2024-01-16T10:30:00Z'),
        },
        {
          salesPersonId: 'SP-003',
          name: 'Bob Johnson',
          trainingCompletionFlag: undefined,
          trainingCompletionDate: undefined,
        },
      ],
      guidelineDistributionDate: new Date('2024-01-10T08:00:00Z'),
    };

    expect(() =>
      determineSalesPatternApplicationGuidanceCompleteness(salesTeamData)
    ).toThrow(/チーム全体の研修完了フラグが欠落/);
  });
});