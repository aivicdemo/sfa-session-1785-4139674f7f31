import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 提案資料生成依頼", () => {
  // SCEN-922
  test("すべての必須項目が満たされている場合、提案資料生成処理が正常に開始される", async () => {
    const customerInfo = {
      name: "テスト顧客A",
      industry: "製造業",
      employeeCount: 500,
    };

    const dealInfo = {
      theme: "デジタル変革支援",
      customerChallenge: "既存システムの老朽化",
      budgetRange: 5000000,
      decisionDate: "2024-03-31",
    };

    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: {
          outline: "DX支援プロジェクト提案骨子",
          content: "段階的なシステム刷新と人材育成プログラム",
        },
        evidenceData: {
          similarCases: [
            {
              caseId: "CASE-2023-001",
              industry: "製造業",
              employeeCount: 480,
              successRate: 0.92,
            },
          ],
          successPattern: {
            patternId: "PATTERN-DX-001",
            matchScore: 0.88,
          },
        },
      }),
    };

    const mockDatabase = {
      saveRecommendationRequest: jest
        .fn()
        .mockResolvedValue({
          jobId: "JOB-2024-001234",
          status: "PROCESSING",
          createdAt: "2024-01-15T11:00:00Z",
        }),
    };

    const result = await generateRecommendation(
      customerInfo,
      dealInfo,
      mockAiEngine,
      mockDatabase
    );

    expect(result.httpStatus).toBe(202);

    expect(mockAiEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAiEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealInfo
    );

    expect(result.proposalApproach).toEqual({
      outline: "DX支援プロジェクト提案骨子",
      content: "段階的なシステム刷新と人材育成プログラム",
    });

    expect(result.evidenceData).toEqual({
      similarCases: [
        {
          caseId: "CASE-2023-001",
          industry: "製造業",
          employeeCount: 480,
          successRate: 0.92,
        },
      ],
      successPattern: {
        patternId: "PATTERN-DX-001",
        matchScore: 0.88,
      },
    });

    expect(result.jobId).toBe("JOB-2024-001234");
    expect(result.processingStatus).toBe("PROCESSING");

    expect(mockDatabase.saveRecommendationRequest).toHaveBeenCalledTimes(1);
    expect(mockDatabase.saveRecommendationRequest).toHaveBeenCalledWith({
      customerInfo,
      dealInfo,
      jobId: "JOB-2024-001234",
      requestTimestamp: "2024-01-15T11:00:00Z",
    });

    expect(result.savedRecord).toEqual({
      jobId: "JOB-2024-001234",
      status: "PROCESSING",
      createdAt: "2024-01-15T11:00:00Z",
    });
  });
});