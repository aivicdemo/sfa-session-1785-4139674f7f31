import { detectDuplicateAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定', () => {
  test('SCEN-624: 類似度スコアが閾値直上80.1%の場合、重複と判定される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      email: 'yamada.taro@example.com',
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      email: 'yamada.taro.bak@example.com',
    };

    const similarity_score = 80.1;
    const duplicate_threshold = 80.0;

    const result = detectDuplicateAndJudgeIntegration(
      customer_a,
      customer_b,
      similarity_score,
      duplicate_threshold
    );

    expect(result.is_duplicate).toBe(true);
    expect(result.similarity_score).toBe(80.1);
    expect(result.integration_status).toBe('重複の可能性あり・要確認');
    expect(result.duplicate_pair).toEqual({
      primary_customer_id: 'CUST001',
      secondary_customer_id: 'CUST002',
      primary_name: '山田太郎',
      secondary_name: '山田太郎',
      primary_email: 'yamada.taro@example.com',
      secondary_email: 'yamada.taro.bak@example.com',
    });
  });
});