import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-946
  test('提案内容検証機能 - 顧客IDが存在しないIDのとき検証エラーが返される', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const nonExistentCustomerId = 99999999;
    const proposalAmount = 1000000;
    const proposalContent = 'テスト提案';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        errorCode: 'CUST_NOT_FOUND',
        errorMessage: '指定された顧客IDは存在しません',
      }),
      { status: 400 }
    );

    try {
      await validateProposalContent({
        customerId: nonExistentCustomerId,
        proposalAmount: proposalAmount,
        proposalContent: proposalContent,
      });
      fail('Expected function to throw an error');
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.errorCode).toBe('CUST_NOT_FOUND');
      expect(error.errorMessage).toBe('指定された顧客IDは存在しません');
    }
  });
});