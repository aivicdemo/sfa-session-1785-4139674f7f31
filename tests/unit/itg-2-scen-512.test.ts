import { detectDuplicateAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-512
  test('複数の重複基準を組み合わせたとき、全基準を満たす場合のみ統合対象と判定される', () => {
    const datasetA = {
      customer_id: 'A001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone_number: '09012345678',
    };

    const datasetB = {
      customer_id: 'B001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone_number: '09012345678',
    };

    const datasetC = {
      customer_id: 'C001',
      customer_name: '山田太郎',
      email: 'yamada.t@example.com',
      phone_number: '09012345678',
    };

    const duplicate_criteria = [
      { field: 'customer_name', match_type: 'exact' },
      { field: 'email', match_type: 'exact' },
      { field: 'phone_number', match_type: 'exact' },
    ];

    const resultAandB = detectDuplicateAndJudgeIntegration(
      datasetA,
      datasetB,
      duplicate_criteria
    );

    const resultAandC = detectDuplicateAndJudgeIntegration(
      datasetA,
      datasetC,
      duplicate_criteria
    );

    expect(resultAandB.is_integration_target).toBe(true);
    expect(resultAandC.is_integration_target).toBe(false);
  });
});