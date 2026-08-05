import { analyzeProposalAndSalesData } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-681
  test('提案内容に対応する営業案件IDが存在しないとき参照整合性エラーになる', async () => {
    const proposalInput = {
      proposal_id: 'P-001',
      sales_case_id: 'CASE-999',
      content: 'test proposal',
      timestamp: '2024-01-15T11:00:00Z',
    };

    try {
      await analyzeProposalAndSalesData(proposalInput);
      fail('Expected function to throw an error');
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error('Expected error to be an instance of Error');
      }

      expect(error.message).toMatch(/営業案件ID/);
      expect(error.message).toMatch(/CASE-999/);
      expect(error.message).toMatch(/営業案件マスタ/);

      const httpError = error as any;
      expect(httpError.statusCode).toBe(409);
      expect(httpError.errorCode).toBe('REFERENTIAL_INTEGRITY_ERROR');
    }
  });
});