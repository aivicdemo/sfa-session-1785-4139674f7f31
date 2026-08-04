import { validateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1212: 顧客ニーズが空配列のとき、エラーを返す', () => {
    const customerId = 'CUST-12345';
    const dealId = 'DEAL-67890';
    const proposalContent = {
      productName: 'Enterprise Solution',
      targetValue: 5000000,
      implementationPeriod: 6,
    };
    const customerNeeds: string[] = [];
    const budgetConstraint = 10000000;
    const scheduleConstraint = 12;

    const result = validateProposalAppropriateness(
      customerId,
      dealId,
      proposalContent,
      customerNeeds,
      budgetConstraint,
      scheduleConstraint
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_EMPTY_CUSTOMER_NEEDS',
      errorMessage: '顧客ニーズが指定されていません。提案妥当性の判定には最低1件以上のニーズ項目が必要です',
      httpStatusCode: 400,
    });
  });
});