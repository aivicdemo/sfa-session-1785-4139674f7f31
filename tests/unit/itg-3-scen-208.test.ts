import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-208: 新規案件の顧客情報が入力されていないとき、顧客情報なしの条件で照合が実行される", () => {
    // Arrange: モック AIRecommendationEngine を初期化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    // 新規案件オブジェクトを作成（顧客情報は全て null または未設定）
    const newDealWithoutCustomer = {
      dealId: "DEAL-20240115-001",
      dealName: "新規案件A",
      productCategory: "クラウドサービス",
      dealPeriod: "2024-01-15T00:00:00Z",
      customerName: null,
      industry: null,
      companySize: null,
      budget: null,
      targetRevenue: null,
    };

    // モック応答を設定
    const expectedRecommendationResult = {
      recommendedApproach: "需要喚起型提案",
      reasoning:
        "商談条件（クラウドサービス、新規営業）に基づいて照合しました。顧客情報が入力されていないため、商談条件ベースで過去成功パターンから抽出されています。",
      similarPatterns: [
        {
          patternId: "PATTERN-001",
          approachName: "需要喚起型提案",
          successRate: 0.72,
          applicability: 0.68,
        },
        {
          patternId: "PATTERN-002",
          approachName: "課題解決型提案",
          successRate: 0.65,
          applicability: 0.52,
        },
      ],
      confidenceScore: 68,
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(
      expectedRecommendationResult
    );

    // Act: generateRecommendation メソッドを呼び出し
    return generateRecommendation(newDealWithoutCustomer, mockAIEngine).then(
      (result) => {
        // Assert
        // 1. モックが正確に呼び出されたことを検証
        expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
        expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
          newDealWithoutCustomer
        );

        // 2. 返却された推奨結果オブジェクトの構造を確認
        expect(result).toHaveProperty("recommendedApproach");
        expect(result).toHaveProperty("reasoning");
        expect(result).toHaveProperty("similarPatterns");
        expect(result).toHaveProperty("confidenceScore");

        // 3. 推奨結果の具体値を検証
        expect(result.recommendedApproach).toBe("需要喚起型提案");
        expect(result.confidenceScore).toBe(68);

        // 4. 根拠説明に「顧客情報が入力されていない」または「商談条件ベース」が示唆されているか確認
        expect(result.reasoning).toMatch(/顧客情報が入力されていない/);
        expect(result.reasoning).toMatch(/商談条件ベース/);

        // 5. similarPatterns 配列が存在し、適切なデータ構造を持っていることを確認
        expect(Array.isArray(result.similarPatterns)).toBe(true);
        expect(result.similarPatterns.length).toBeGreaterThan(0);

        result.similarPatterns.forEach((pattern) => {
          expect(pattern).toHaveProperty("patternId");
          expect(pattern).toHaveProperty("approachName");
          expect(pattern).toHaveProperty("successRate");
          expect(pattern).toHaveProperty("applicability");
          expect(typeof pattern.successRate).toBe("number");
          expect(typeof pattern.applicability).toBe("number");
          expect(pattern.successRate).toBeGreaterThanOrEqual(0);
          expect(pattern.successRate).toBeLessThanOrEqual(1);
          expect(pattern.applicability).toBeGreaterThanOrEqual(0);
          expect(pattern.applicability).toBeLessThanOrEqual(1);
        });

        // 6. 最初の推奨パターンが想定値と一致することを確認
        expect(result.similarPatterns[0].patternId).toBe("PATTERN-001");
        expect(result.similarPatterns[0].approachName).toBe("需要喚起型提案");
        expect(result.similarPatterns[0].successRate).toBe(0.72);
        expect(result.similarPatterns[0].applicability).toBe(0.68);
      }
    );
  });
});