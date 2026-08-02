import { validateProposalsInBatch } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1032
  test('複数件の提案内容のうち1件が検証エラーの場合に全件が拒否される', () => {
    const proposals = [
      {
        id: 'proposal_1',
        customerName: 'A社',
        amount: 1000000,
        deadline: '2024-12-31',
      },
      {
        id: 'proposal_2',
        customerName: 'B社',
        amount: 500000,
        deadline: '2024-11-30',
      },
      {
        id: 'proposal_3',
        customerName: 'C社',
        amount: '',
        deadline: '2024-10-31',
      },
    ];

    const result = validateProposalsInBatch(proposals);

    expect(result.status).toBe('rejected');
    expect(result.proposals).toHaveLength(3);
    expect(result.proposals[0].status).toBe('rejected');
    expect(result.proposals[1].status).toBe('rejected');
    expect(result.proposals[2].status).toBe('rejected');
    expect(result.errorMessage).toContain('複数提案中に検証エラーが存在するため、全件の登録が拒否されました');
  });
});