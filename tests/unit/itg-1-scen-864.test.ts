import { calculateTeamAverageDeviationDegree } from '../../src/logic/it-1-br-2-1-1';

describe('Team average sales rate deviation analysis', () => {
  test('SCEN-864: Team average sales rate is correctly calculated', () => {
    const salesPersonA = {
      id: 'sales_person_a',
      name: 'Sales Person A',
      contractRate: 60.0,
    };

    const salesPersonB = {
      id: 'sales_person_b',
      name: 'Sales Person B',
      contractRate: 70.0,
    };

    const salesPersonC = {
      id: 'sales_person_c',
      name: 'Sales Person C',
      contractRate: 80.0,
    };

    const salesPersons = [salesPersonA, salesPersonB, salesPersonC];

    const result = calculateTeamAverageDeviationDegree(salesPersons);

    expect(result.teamAverageContractRate).toBe(70.0);
  });
});