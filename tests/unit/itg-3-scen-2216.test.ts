import { analyzeProposalAndResponsePattern } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客対応パターン分析", () => {
  // SCEN-2216
  test("提案内容と顧客対応記録が標準プロセスと比較され、異常パターンが検出される", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        standardPattern: {
          industry: "manufacturing",
          companySize: "mid-market",
          challenge: "production_efficiency",
          followUpEmailDaysAfterInitialProposal: 3,
          detailedProposalPresentationDaysAfterFollowUp: 7,
          maxAllowedContactCount: 5,
        },
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
      }),
    };

    const currentResponsePattern = {
      customerId: "CUST-2024-001",
      industryType: "manufacturing",
      companySize: "mid-market",
      customerChallenge: "production_efficiency",
      proposalContent: {
        proposalDate: "2024-01-15T09:00:00Z",
        proposalApproach: "efficiency_improvement",
        productService: "manufacturing_automation_tool",
      },
      responsePattern: {
        initialContactDate: "2024-01-15T09:00:00Z",
        followUpEmailDate: "2024-02-04T14:30:00Z",
        detailedProposalDate: "2024-02-20T10:00:00Z",
        totalContactCount: 9,
        contactSequence: [
          { date: "2024-01-15T09:00:00Z", type: "initial_proposal", method: "in_person" },
          { date: "2024-02-04T14:30:00Z", type: "follow_up_email", method: "email" },
          { date: "2024-02-05T11:00:00Z", type: "reminder_call", method: "phone" },
          { date: "2024-02-06T15:00:00Z", type: "follow_up_call", method: "phone" },
          { date: "2024-02-07T09:30:00Z", type: "proposal_revision_discussion", method: "email" },
          { date: "2024-02-08T13:00:00Z", type: "follow_up_call", method: "phone" },
          { date: "2024-02-12T10:00:00Z", type: "negotiation", method: "in_person" },
          { date: "2024-02-15T14:00:00Z", type: "pricing_discussion", method: "email" },
          { date: "2024-02-20T10:00:00Z", type: "detailed_proposal", method: "email" },
        ],
      },
      proposalContentRelevance: {
        customerChallengeAlignmentScore: 45,
      },
    };

    const result = analyzeProposalAndResponsePattern(currentResponsePattern, mockAIEngine);

    expect(result).toEqual({
      analysisId: expect.any(String),
      customerId: "CUST-2024-001",
      hasAnomalies: true,
      anomalyCount: 3,
      anomalies: [
        {
          anomalyType: "follow_up_timing_delay",
          severity: "high",
          description: "フォローメール送付が標準比+17日遅延",
          standardValue: 3,
          actualValue: 20,
          deviationValue: 17,
          unit: "days",
        },
        {
          anomalyType: "excess_contact_count",
          severity: "high",
          description: "接触回数が標準比+4回超過",
          standardValue: 5,
          actualValue: 9,
          deviationValue: 4,
          unit: "count",
        },
        {
          anomalyType: "low_content_relevance",
          severity: "high",
          description: "提案内容が顧客課題：生産効率化と関連度が低い（スコア：45/100）",
          standardValue: 75,
          actualValue: 45,
          deviationValue: -30,
          unit: "score",
        },
      ],
      improvementRecommendations: [
        {
          anomalyType: "follow_up_timing_delay",
          recommendedAction: "初回提案後3日以内にフォローメールを送付するプロセスを遵守してください",
          priority: "high",
        },
        {
          anomalyType: "excess_contact_count",
          recommendedAction: "接触回数を5回以内に削減し、顧客の意思決定プロセスに合わせた段階的なアプローチに変更してください",
          priority: "high",
        },
        {
          anomalyType: "low_content_relevance",
          recommendedAction: "提案内容を顧客の生産効率化課題に直結した内容に修正し、関連度スコアを75以上に引き上げてください",
          priority: "high",
        },
      ],
      overallAssessment: {
        complianceWithStandardProcess: 22,
        successProbability: 35,
        requiresImmediateIntervention: true,
      },
    });

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith({
      industryType: "manufacturing",
      companySize: "mid-market",
      customerChallenge: "production_efficiency",
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      proposalContent: "manufacturing_automation_tool",
      customerChallenge: "production_efficiency",
    });
  });
});