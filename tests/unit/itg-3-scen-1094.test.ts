import { visualizeReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1094
  test('推奨根拠のテキスト説明が空文字列のとき、根拠可視化処理がエラーになる', () => {
    const emptyReasoningExplanation = '';
    const recommendationId = 'REC-001';
    const customerInfo = {
      customerId: 'CUST-001',
      industryType: 'IT',
      companyScale: 'mid-market',
    };

    expect(() =>
      visualizeReasoning({
        recommendationId,
        reasoningExplanation: emptyReasoningExplanation,
        customerInfo,
      })
    ).toThrow(/推奨根拠/);
  });
});