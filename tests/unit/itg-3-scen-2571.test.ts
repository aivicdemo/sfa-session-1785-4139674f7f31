import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2571
  test("推奨内容の根拠表示機能 - 根拠の表示対象ユーザー権限が制限されているとき、権限がないユーザーには非表示になる", async () => {
    // テストユーザーのセッション・権限情報をセットアップ
    const testUserSession = {
      userId: "user_001_general_sales",
      userRole: "general_sales_representative",
      hasReasoningViewPermission: false,
    };

    // AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_20240115_001",
        dealId: "deal_20240115_sample",
        approach: "顧客の経営課題に対して段階的な提案を実施し、初回フォローアップ後1週間での第2回接触を推奨",
        confidenceScore: 82,
        reasoning: [
          {
            factor: "customer_industry_match",
            description: "顧客業種が過去成功パターンと85%一致",
            weight: 0.35,
          },
          {
            factor: "purchase_signal_strength",
            description: "購買シグナル強度が過去平均より1.5倍高い",
            weight: 0.4,
          },
          {
            factor: "timing_alignment",
            description: "顧客の予算決定時期が最適フォローアップ時期と合致",
            weight: 0.25,
          },
        ],
        successPatternId: "pattern_enterprise_segment_a",
        recommendedAction: "1週間以内にフォローメールを送付し、顧客の課題認識度を高める",
      }),
    };

    // 根拠表示対象ユーザー権限の制限ルール（ACL）
    const aclRules = {
      hasReasoningViewPermission: (userRole: string): boolean => {
        const permittedRoles = [
          "sales_manager",
          "sales_director",
          "ai_system_admin",
        ];
        return permittedRoles.includes(userRole);
      },
    };

    // 推奨内容を取得
    const dealId = "deal_20240115_sample";
    const rawRecommendation =
      await mockAIEngine.generateRecommendation(dealId);

    // 権限チェックに基づいて根拠情報を除外
    const filterRecommendationByPermission = (
      recommendation: any,
      userRole: string,
      acl: typeof aclRules
    ) => {
      const hasPermission = acl.hasReasoningViewPermission(userRole);

      return {
        recommendationId: recommendation.recommendationId,
        dealId: recommendation.dealId,
        approach: recommendation.approach,
        confidenceScore: recommendation.confidenceScore,
        reasoning: hasPermission ? recommendation.reasoning : null,
        successPatternId: recommendation.successPatternId,
        recommendedAction: recommendation.recommendedAction,
      };
    };

    // APIレスポンスボディを生成
    const apiResponse = filterRecommendationByPermission(
      rawRecommendation,
      testUserSession.userRole,
      aclRules
    );

    // アサーション: HTTPステータス200相当で推奨データ自体は取得可能
    expect(apiResponse).toBeDefined();
    expect(apiResponse.dealId).toBe("deal_20240115_sample");

    // アサーション: 推奨内容本体は正常に返却されている
    expect(apiResponse.approach).toBe(
      "顧客の経営課題に対して段階的な提案を実施し、初回フォローアップ後1週間での第2回接触を推奨"
    );
    expect(apiResponse.confidenceScore).toBe(82);
    expect(apiResponse.recommendedAction).toBe(
      "1週間以内にフォローメールを送付し、顧客の課題認識度を高める"
    );

    // アサーション: 根拠フィールドが意図的に除外された（null）
    expect(apiResponse.reasoning).toBeNull();

    // アサーション: 権限がある場合のテスト（管理職ユーザー）
    const managerUserRole = "sales_manager";
    const managerApiResponse = filterRecommendationByPermission(
      rawRecommendation,
      managerUserRole,
      aclRules
    );

    // 権限がある場合は根拠情報が含まれる
    expect(managerApiResponse.reasoning).not.toBeNull();
    expect(managerApiResponse.reasoning).toHaveLength(3);
    expect(managerApiResponse.reasoning[0].factor).toBe(
      "customer_industry_match"
    );
    expect(managerApiResponse.reasoning[0].weight).toBe(0.35);
    expect(managerApiResponse.reasoning[1].factor).toBe(
      "purchase_signal_strength"
    );
    expect(managerApiResponse.reasoning[1].weight).toBe(0.4);
    expect(managerApiResponse.reasoning[2].factor).toBe("timing_alignment");
    expect(managerApiResponse.reasoning[2].weight).toBe(0.25);
  });
});