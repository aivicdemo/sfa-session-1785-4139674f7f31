import { analyzeTeamSalesQualityStatistics } from "../../src/logic/it-1-br-2-1-1";

describe("Team Sales Quality Statistics Analysis - Data Source Mapping Validation", () => {
  // SCEN-893
  test("should throw MAPPING_MISMATCH_ERROR when sales rep IDs in win rate data do not match proposal accuracy data", () => {
    const winRateDataSource = [
      { salesRepId: "A001", winRate: 0.65 },
      { salesRepId: "A002", winRate: 0.72 },
      { salesRepId: "A003", winRate: 0.58 },
      { salesRepId: "A004", winRate: 0.81 },
      { salesRepId: "A005", winRate: 0.69 },
      { salesRepId: "A006", winRate: 0.75 },
      { salesRepId: "A007", winRate: 0.62 },
      { salesRepId: "A008", winRate: 0.78 },
      { salesRepId: "A009", winRate: 0.71 },
      { salesRepId: "A010", winRate: 0.66 },
    ];

    const proposalAccuracyDataSource = [
      { salesRepId: "A001", proposalAccuracy: 0.88 },
      { salesRepId: "A002", proposalAccuracy: 0.91 },
      { salesRepId: "A003", proposalAccuracy: 0.85 },
      { salesRepId: "A004", proposalAccuracy: 0.93 },
      { salesRepId: "A005", proposalAccuracy: 0.87 },
      { salesRepId: "A006", proposalAccuracy: 0.89 },
      { salesRepId: "A007", proposalAccuracy: 0.84 },
      { salesRepId: "A008", proposalAccuracy: 0.90 },
      { salesRepId: "A011", proposalAccuracy: 0.86 },
    ];

    expect(() =>
      analyzeTeamSalesQualityStatistics(winRateDataSource, proposalAccuracyDataSource)
    ).toThrow(/MAPPING_MISMATCH_ERROR/);
  });
});