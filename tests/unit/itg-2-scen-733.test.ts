import { calculateProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-733
  test('提案資料IDが不正な形式のときエラーが発生する', async () => {
    const invalid_proposal_ids = [
      '',
      null,
      '!!!###@@@',
      'x'.repeat(33),
    ];

    for (const proposal_id of invalid_proposal_ids) {
      try {
        await calculateProposalNeedsCompatibilityScore({
          proposal_id: proposal_id as any,
          customer_needs: [],
          proposal_content: {},
        });
        fail(`Expected error for proposal_id: ${proposal_id}`);
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.errorCode).toBe('INVALID_PROPOSAL_ID_FORMAT');
        expect(error.message).toMatch(/提案資料ID/);
      }
    }
  });
});