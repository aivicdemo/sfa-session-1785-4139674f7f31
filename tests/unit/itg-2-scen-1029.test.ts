import { validateProposalFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1029
  test('提案内容が1件だけ送信された場合に形式検証が成功する', () => {
    const payloadArray = [
      {
        proposalId: 'PROP-001',
        proposalTitle: '顧客A向けシステム導入',
        amount: 1500000,
        proposalDate: '2024-01-15'
      }
    ];

    const result = validateProposalFormat(payloadArray);

    expect(result.validationStatus).toBe('SUCCESS');
    expect(result.errorCount).toBe(0);
    expect(result.processedCount).toBe(1);
    expect(result.validationLog).toContain('1件の提案内容を処理完了');
  });
});