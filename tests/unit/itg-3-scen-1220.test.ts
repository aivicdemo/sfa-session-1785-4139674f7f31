import { validateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1220: 提案が営業プロセス条件の制約に違反するとき、妥当性判定エラーを返す', () => {
    // テスト対象: 提案妥当性確認判定機能
    // 入力: 営業プロセス条件に違反する提案内容
    const proposal = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      industryType: 'finance',
      proposalAmount: 15000000,
      dealStage: 'initial_contact',
      productCategory: 'premium_service',
    };

    const processConstraints = {
      allowedIndustries: ['manufacturing', 'retail', 'healthcare'],
      allowedDealStages: ['negotiation', 'proposal', 'closing'],
      maxProposalAmount: 10000000,
      allowedProductCategories: ['standard_service', 'consulting'],
    };

    const processRuleReference = 'PROC-RULE-2024-001';

    // 実行: 提案妥当性確認判定機能を呼び出す
    let error: any;
    try {
      validateProposalAppropriateness(proposal, processConstraints, processRuleReference);
    } catch (err) {
      error = err;
    }

    // 期待結果の検証
    expect(error).toBeDefined();
    expect(error.errorCode).toBe('PROPOSAL_CONSTRAINT_VIOLATION');
    expect(error.statusCode).toBe(422);
    expect(error.message).toMatch(/営業プロセス条件に違反/);

    // 違反詳細の検証
    expect(error.details).toBeDefined();
    expect(Array.isArray(error.details.violations)).toBe(true);
    expect(error.details.violations.length).toBeGreaterThan(0);

    // 違反内容の詳細確認
    const violationItems = error.details.violations;
    expect(violationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          violatedField: 'industryType',
          expectedValue: ['manufacturing', 'retail', 'healthcare'],
          actualValue: 'finance',
        }),
        expect.objectContaining({
          violatedField: 'dealStage',
          expectedValue: ['negotiation', 'proposal', 'closing'],
          actualValue: 'initial_contact',
        }),
        expect.objectContaining({
          violatedField: 'proposalAmount',
          expectedValue: 10000000,
          actualValue: 15000000,
        }),
        expect.objectContaining({
          violatedField: 'productCategory',
          expectedValue: ['standard_service', 'consulting'],
          actualValue: 'premium_service',
        }),
      ])
    );

    // プロセスルール参照情報の検証
    expect(error.details.processRuleReference).toBe(processRuleReference);
  });
});