import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-3-2-1";

describe("OpenAI API連携 - 想定外の応答形式への対応", () => {
  // SCEN-2916
  test("generateRecommendation呼び出しが想定外の応答形式を返した場合、代替動作として推奨パターンマスタから統計的に上位の成功パターンが返却される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(null),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_001",
          customerIndustry: "IT",
          dealStage: "proposal",
          successRate: 85,
          recommendationContent: "クラウド導入による業務効率化提案",
          proposalApproach: "段階的導入アプローチ",
          rankingScore: 92,
        },
        {
          patternId: "pattern_002",
          customerIndustry: "IT",
          dealStage: "proposal",
          successRate: 78,
          recommendationContent: "セキュリティ強化提案",
          proposalApproach: "リスク軽減アプローチ",
          rankingScore: 85,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_12345",
      dealStage: "proposal",
      budget: 500000,
      industry: "IT",
      companySize: "mid-market",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("バリデーション")
    );

    expect(result).toEqual({
      status: "fallback",
      userMessage:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      recommendation: {
        patternId: "pattern_001",
        customerIndustry: "IT",
        dealStage: "proposal",
        successRate: 85,
        recommendationContent: "クラウド導入による業務効率化提案",
        proposalApproach: "段階的導入アプローチ",
        rankingScore: 92,
      },
      fallbackApplied: true,
    });

    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.rankingScore).toBe(92);
    expect(result.recommendation.successRate).toBe(85);
  });

  test("generateRecommendation呼び出しが空オブジェクトを返した場合、バリデーションエラーが検出され代替動作が実行される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({}),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_003",
          customerIndustry: "Manufacturing",
          dealStage: "negotiation",
          successRate: 88,
          recommendationContent: "デジタル変革提案",
          proposalApproach: "組織変革アプローチ",
          rankingScore: 90,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_67890",
      dealStage: "negotiation",
      budget: 1000000,
      industry: "Manufacturing",
      companySize: "large",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(mockLogger.error).toHaveBeenCalled();
    expect(result.status).toBe("fallback");
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.recommendation.rankingScore).toBe(90);
    expect(result.fallbackApplied).toBe(true);
  });

  test("generateRecommendation呼び出しが文字列型を返した場合、型バリデーションエラーが検出される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue("invalid_string"),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_004",
          customerIndustry: "Finance",
          dealStage: "discovery",
          successRate: 82,
          recommendationContent: "コンプライアンス強化提案",
          proposalApproach: "規制準拠アプローチ",
          rankingScore: 88,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_11111",
      dealStage: "discovery",
      budget: 750000,
      industry: "Finance",
      companySize: "enterprise",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("型")
    );
    expect(result.fallbackApplied).toBe(true);
    expect(result.recommendation).toBeDefined();
  });

  test("generateRecommendation呼び出しが数値型を返した場合、代替動作として正常な推奨パターンが返却される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(12345),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_005",
          customerIndustry: "Retail",
          dealStage: "proposal",
          successRate: 80,
          recommendationContent: "顧客体験向上提案",
          proposalApproach: "ユーザーセントリックアプローチ",
          rankingScore: 87,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_22222",
      dealStage: "proposal",
      budget: 600000,
      industry: "Retail",
      companySize: "mid-market",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(result.status).toBe("fallback");
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.recommendation.patternId).toBe("pattern_005");
    expect(result.recommendation.rankingScore).toBe(87);
  });

  test("generateRecommendation呼び出しが配列型を返した場合、想定外の形式として検出され代替動作が適用される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        { invalid: "array_item" },
      ]),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_006",
          customerIndustry: "Healthcare",
          dealStage: "closing",
          successRate: 91,
          recommendationContent: "医療デジタル化提案",
          proposalApproach: "段階的システム導入アプローチ",
          rankingScore: 93,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_33333",
      dealStage: "closing",
      budget: 2000000,
      industry: "Healthcare",
      companySize: "enterprise",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(mockLogger.error).toHaveBeenCalled();
    expect(result.fallbackApplied).toBe(true);
    expect(result.recommendation.rankingScore).toBe(93);
    expect(result.recommendation.successRate).toBe(91);
  });

  test("想定外の応答データが業務結果として営業システムに通されないことを確認", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        malformedField: "unexpected",
        invalidStructure: true,
      }),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_007",
          customerIndustry: "Energy",
          dealStage: "proposal",
          successRate: 79,
          recommendationContent: "再生可能エネルギー導入提案",
          proposalApproach: "環境配慮アプローチ",
          rankingScore: 84,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_44444",
      dealStage: "proposal",
      budget: 1500000,
      industry: "Energy",
      companySize: "large",
    };

    const result = await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    // 想定外の応答が業務結果に含まれていないことを確認
    expect(result.recommendation).not.toHaveProperty("malformedField");
    expect(result.recommendation).not.toHaveProperty("invalidStructure");
    expect(result.recommendation).toHaveProperty("patternId");
    expect(result.recommendation).toHaveProperty("recommendationContent");
    expect(result.recommendation).toHaveProperty("proposalApproach");
    expect(result.recommendation).toHaveProperty("rankingScore");
    expect(result.recommendation.rankingScore).toBe(84);
  });

  test("バリデーション失敗時にエラーログが記録されることを確認", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(undefined),
    };

    const mockPatternRepository = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern_008",
          customerIndustry: "Transportation",
          dealStage: "proposal",
          successRate: 83,
          recommendationContent: "物流最適化提案",
          proposalApproach: "コスト削減アプローチ",
          rankingScore: 86,
        },
      ]),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const dealInput = {
      customerId: "cust_55555",
      dealStage: "proposal",
      budget: 800000,
      industry: "Transportation",
      companySize: "mid-market",
    };

    await generateRecommendationWithFallback(
      dealInput,
      mockRecommendationEngine,
      mockPatternRepository,
      mockLogger
    );

    expect(mockLogger.error).toHaveBeenCalledWith(expect.any(String));
    expect(mockLogger.error.mock.calls.length).toBeGreaterThan(0);
  });
});