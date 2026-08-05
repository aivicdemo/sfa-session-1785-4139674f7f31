import { it, describe, beforeEach, afterEach } from "@jest/globals";

// SCEN-400: [error] 成功パターンマトリクス適用判定機能 - 顧客の現在のステータスが不正値のとき判定ロジックが失敗する
describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw INVALID_CUSTOMER_STATUS error when customer status is null", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_001",
      customer_name: "Acme Corp",
      customer_status: null,
      industry: "Manufacturing",
      annual_revenue: 5000000,
      decision_maker_identified: true,
    };

    const invalid_business_context = {
      product_category: "Enterprise Software",
      deal_stage: "Proposal",
      engagement_duration_days: 30,
      proposal_value: 250000,
    };

    let error_thrown = false;
    let error_code = "";
    let error_message = "";

    try {
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      );
    } catch (err) {
      error_thrown = true;
      if (err instanceof Error) {
        error_message = err.message;
        const match = err.message.match(/INVALID_CUSTOMER_STATUS/);
        if (match) {
          error_code = "INVALID_CUSTOMER_STATUS";
        }
      }
    }

    expect(error_thrown).toBe(true);
    expect(error_code).toBe("INVALID_CUSTOMER_STATUS");
    expect(error_message).toMatch(/顧客ステータス/);
  });

  it("should throw INVALID_CUSTOMER_STATUS error when customer status is undefined", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_002",
      customer_name: "Beta Inc",
      customer_status: undefined,
      industry: "Finance",
      annual_revenue: 3000000,
      decision_maker_identified: true,
    };

    const invalid_business_context = {
      product_category: "Cloud Services",
      deal_stage: "Negotiation",
      engagement_duration_days: 45,
      proposal_value: 180000,
    };

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });

  it("should throw INVALID_CUSTOMER_STATUS error when customer status is empty string", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_003",
      customer_name: "Gamma Ltd",
      customer_status: "",
      industry: "Retail",
      annual_revenue: 2000000,
      decision_maker_identified: false,
    };

    const invalid_business_context = {
      product_category: "POS System",
      deal_stage: "Discovery",
      engagement_duration_days: 15,
      proposal_value: 120000,
    };

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });

  it("should throw INVALID_CUSTOMER_STATUS error when customer status is numeric type", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_004",
      customer_name: "Delta Corp",
      customer_status: 123,
      industry: "Healthcare",
      annual_revenue: 8000000,
      decision_maker_identified: true,
    };

    const invalid_business_context = {
      product_category: "Medical Device",
      deal_stage: "Proposal",
      engagement_duration_days: 60,
      proposal_value: 500000,
    };

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });

  it("should throw INVALID_CUSTOMER_STATUS error when customer status is unrecognized string", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_005",
      customer_name: "Epsilon Inc",
      customer_status: "UNKNOWN_STATUS",
      industry: "Technology",
      annual_revenue: 6000000,
      decision_maker_identified: true,
    };

    const invalid_business_context = {
      product_category: "AI Platform",
      deal_stage: "Evaluation",
      engagement_duration_days: 30,
      proposal_value: 350000,
    };

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });

  it("should return failure result with INVALID_CUSTOMER_STATUS when customer status is boolean", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_006",
      customer_name: "Zeta Ltd",
      customer_status: true,
      industry: "Consulting",
      annual_revenue: 4000000,
      decision_maker_identified: true,
    };

    const invalid_business_context = {
      product_category: "Consulting Services",
      deal_stage: "Initial Contact",
      engagement_duration_days: 7,
      proposal_value: 75000,
    };

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });

  it("should return failure result with INVALID_CUSTOMER_STATUS error code when evaluation fails", async () => {
    const { evaluateSuccessPatternMatrixApplicability } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_customer_data = {
      customer_id: "cust_007",
      customer_name: "Theta Corp",
      customer_status: { nested: "object" },
      industry: "Education",
      annual_revenue: 1500000,
      decision_maker_identified: false,
    };

    const invalid_business_context = {
      product_category: "Learning Platform",
      deal_stage: "Awareness",
      engagement_duration_days: 5,
      proposal_value: 50000,
    };

    let result = null;
    try {
      result = evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      );
    } catch (err) {
      // Expected to catch error
    }

    expect(() =>
      evaluateSuccessPatternMatrixApplicability(
        invalid_customer_data,
        invalid_business_context
      )
    ).toThrow(/顧客ステータス/);
  });
});