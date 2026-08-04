import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件に推奨する", () => {
  // SCEN-1077
  test("同じ顧客・同じ商談条件で2回推奨実行した場合、同じ推奨内容が返却される", () => {
    const customer_id = "CUST-001";
    const deal_conditions = {
      industry: "製造業",
      budget: 5000000,
      implementation_timeframe: "3ヶ月以内"
    };

    const stub_recommendation_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "REC-20250801-001",
        proposal_approach: "段階的導入",
        reasoning: "過去成功パターン一致度95%",
        relevance_score: 95,
        timestamp: new Date("2025-08-01T10:30:00Z")
      })
    };

    const stub_recommendation_history_repository = {
      record: jest.fn().mockResolvedValue({
        recommendation_history_id: "HIST-001",
        customer_id: customer_id,
        deal_conditions: deal_conditions,
        recommendation_id: "REC-20250801-001",
        proposal_approach: "段階的導入",
        reasoning: "過去成功パターン一致度95%",
        relevance_score: 95,
        recorded_at: new Date("2025-08-01T10:30:00Z")
      }),
      find_by_customer_and_conditions: jest
        .fn()
        .mockResolvedValue(null)
    };

    return generateRecommendation(
      customer_id,
      deal_conditions,
      stub_recommendation_engine,
      stub_recommendation_history_repository
    ).then((first_result) => {
      expect(first_result.recommendation_id).toBe("REC-20250801-001");
      expect(first_result.proposal_approach).toBe("段階的導入");
      expect(first_result.reasoning).toBe("過去成功パターン一致度95%");
      expect(first_result.relevance_score).toBe(95);

      expect(stub_recommendation_history_repository.record).toHaveBeenCalledTimes(
        1
      );
      expect(stub_recommendation_history_repository.record).toHaveBeenCalledWith({
        customer_id: customer_id,
        deal_conditions: deal_conditions,
        recommendation_id: "REC-20250801-001",
        proposal_approach: "段階的導入",
        reasoning: "過去成功パターン一致度95%",
        relevance_score: 95
      });

      const stub_recommendation_engine_second = {
        generateRecommendation: jest.fn().mockResolvedValue({
          recommendation_id: "REC-20250801-001",
          proposal_approach: "段階的導入",
          reasoning: "過去成功パターン一致度95%",
          relevance_score: 95,
          timestamp: new Date("2025-08-01T11:00:00Z")
        })
      };

      const stub_recommendation_history_repository_second = {
        record: jest.fn().mockResolvedValue({
          recommendation_history_id: "HIST-002",
          customer_id: customer_id,
          deal_conditions: deal_conditions,
          recommendation_id: "REC-20250801-001",
          proposal_approach: "段階的導入",
          reasoning: "過去成功パターン一致度95%",
          relevance_score: 95,
          recorded_at: new Date("2025-08-01T11:00:00Z")
        }),
        find_by_customer_and_conditions: jest
          .fn()
          .mockResolvedValue(null)
      };

      return generateRecommendation(
        customer_id,
        deal_conditions,
        stub_recommendation_engine_second,
        stub_recommendation_history_repository_second
      ).then((second_result) => {
        expect(second_result.recommendation_id).toBe("REC-20250801-001");
        expect(second_result.proposal_approach).toBe("段階的導入");
        expect(second_result.reasoning).toBe("過去成功パターン一致度95%");
        expect(second_result.relevance_score).toBe(95);

        expect(
          stub_recommendation_history_repository_second.record
        ).toHaveBeenCalledTimes(1);
        expect(
          stub_recommendation_history_repository_second.record
        ).toHaveBeenCalledWith({
          customer_id: customer_id,
          deal_conditions: deal_conditions,
          recommendation_id: "REC-20250801-001",
          proposal_approach: "段階的導入",
          reasoning: "過去成功パターン一致度95%",
          relevance_score: 95
        });

        expect(second_result.recommendation_id).toBe(first_result.recommendation_id);
        expect(second_result.proposal_approach).toBe(first_result.proposal_approach);
        expect(second_result.reasoning).toBe(first_result.reasoning);
        expect(second_result.relevance_score).toBe(first_result.relevance_score);
      });
    });
  });
});