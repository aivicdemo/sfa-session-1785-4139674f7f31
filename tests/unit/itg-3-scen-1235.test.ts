import { validateProposalConfirmation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 提案妥当性確認判定機能', () => {
  // SCEN-1235
  test('確認日時が null のとき、エラーを返す', () => {
    const proposalId = 'PROP-20240115-001';
    const judgmentType = 'FEASIBILITY';
    const confirmationDateTime = null;
    const operatorId = 'USER-2024-001';
    const remarks = 'Test confirmation';

    const result = validateProposalConfirmation({
      proposalId,
      judgmentType,
      confirmationDateTime,
      operatorId,
      remarks,
    });

    expect(result.statusCode).toBe(400);
    expect(result.errorCode).toBe('INVALID_CONFIRMATION_DATETIME');
    expect(result.errorMessage).toMatch(/確認日時/);
    expect(result.errorMessage).toMatch(/必須/);
  });
});