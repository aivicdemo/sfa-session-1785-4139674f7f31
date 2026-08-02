import { validateProposalData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-897
  test('提案内容から提案IDフィールドが欠落しているとき不整合エラーを検出する', () => {
    const proposalData = {
      proposalId: null,
      proposalName: '提案A',
      customerId: 'CUST-001',
      amount: 1000000,
      createdAt: '2024-01-15T10:00:00Z',
    };

    const result = validateProposalData(proposalData);

    expect(result.errorCode).toBe('MISSING_PROPOSAL_ID');
    expect(result.errorLevel).toBe('ERROR');
    expect(result.errorMessage).toBe('提案IDフィールドが欠落しています');
    expect(result.fieldName).toBe('proposalId');
    expect(result.errorCategory).toBe('VALIDATION_ERROR');
  });
});