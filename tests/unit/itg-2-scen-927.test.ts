import { validateProposalDataCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-927
  test('提案金額が業務上の最大規模(999,999,999円)でもデータ完全性検証がエラーなく完了する', () => {
    const proposalData = {
      customerName: '株式会社テスト',
      proposalContent: 'クラウドサービス導入支援',
      proposalAmount: 999999999,
      proposalDeadline: '2024-12-31',
      proposalId: 'PROP-20240115-001',
      salesperson: '営業太郎',
      createdAt: '2024-01-15T10:00:00Z',
    };

    const result = validateProposalDataCompleteness(proposalData);

    expect(result.validationStatus).toBe('合格');
    expect(result.isComplete).toBe(true);
    expect(result.validatedFields).toEqual([
      'customerName',
      'proposalContent',
      'proposalAmount',
      'proposalDeadline',
      'proposalId',
      'salesperson',
      'createdAt',
    ]);
    expect(result.validatedFields).toContain('proposalAmount');
    expect(result.proposalAmount).toBe(999999999);
    expect(result.hasError).toBe(false);
  });
});