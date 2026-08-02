import { validateProposalFormats } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-1028: 複数件の提案内容が送信された場合に全件について形式検証が実行される', async () => {
    const proposals = [
      {
        proposalId: 'PROP-001',
        customerName: '',
        amount: 100000,
        email: 'customer1@example.com',
      },
      {
        proposalId: 'PROP-002',
        customerName: 'Customer B',
        amount: -50000,
        email: 'customer2@example.com',
      },
      {
        proposalId: 'PROP-003',
        customerName: 'Customer C',
        amount: 150000,
        email: 'invalid-email-format',
      },
    ];

    const startTime = Date.now();
    const validationResults = await validateProposalFormats(proposals);
    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;

    expect(validationResults).toHaveLength(3);

    expect(validationResults[0]).toEqual({
      proposalId: 'PROP-001',
      status: '不合格',
      errors: ['顧客名が必須項目です'],
    });

    expect(validationResults[1]).toEqual({
      proposalId: 'PROP-002',
      status: '不合格',
      errors: ['金額は0以上の値を入力してください'],
    });

    expect(validationResults[2]).toEqual({
      proposalId: 'PROP-003',
      status: '不合格',
      errors: ['メールアドレス形式が不正です'],
    });

    expect(validationResults.every((result) => result.completedAt)).toBe(true);

    expect(processingTimeMs).toBeLessThan(30000);
  });
});