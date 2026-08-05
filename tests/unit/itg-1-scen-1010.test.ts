import {
  calculateTeamComplianceJudgment,
  type SalesPersonComplianceStatus,
  type TeamComplianceJudgmentResult,
} from "../../src/logic/it-1-br-2-1-1";

describe("Team Guideline Dissemination Compliance Judgment", () => {
  // SCEN-1010
  test("should judge dissemination incomplete when some sales person has not submitted understanding confirmation test", () => {
    const sales_person_a: SalesPersonComplianceStatus = {
      sales_person_id: "SP001",
      sales_person_name: "Sales Person A",
      understanding_test_submission_status: "completed",
      practical_application_report_status: "completed",
    };

    const sales_person_b: SalesPersonComplianceStatus = {
      sales_person_id: "SP002",
      sales_person_name: "Sales Person B",
      understanding_test_submission_status: "completed",
      practical_application_report_status: "completed",
    };

    const sales_person_c: SalesPersonComplianceStatus = {
      sales_person_id: "SP003",
      sales_person_name: "Sales Person C",
      understanding_test_submission_status: "not_submitted",
      practical_application_report_status: "completed",
    };

    const team_members: SalesPersonComplianceStatus[] = [
      sales_person_a,
      sales_person_b,
      sales_person_c,
    ];

    const result: TeamComplianceJudgmentResult =
      calculateTeamComplianceJudgment(team_members);

    expect(result.dissemination_judgment_status).toBe("incomplete");
    expect(result.judgment_reason).toContain("Sales Person C");
    expect(result.judgment_reason).toContain("understanding confirmation test");
    expect(result.judgment_reason).toContain("not submitted");
  });
});