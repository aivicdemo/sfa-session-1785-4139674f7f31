import { judgeConsolidation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1137
  test('重複スコアが閾値ちょうどである場合、統合判定が合格する', () => {
    const customer_1 = {
      customer_id: 'C001',
      name: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phone: '09012345678',
    };

    const customer_2 = {
      customer_id: 'C002',
      name: '山田 太郎',
      address: '東京都渋谷区 1-1-1',
      phone: '090-123-45678',
    };

    const duplicate_score = 80.0;
    const threshold = 80.0;

    const result = judgeConsolidation({
      customer_1,
      customer_2,
      duplicate_score,
      threshold,
    });

    expect(result.status).toBe('PASS');
    expect(result.is_consolidation_target).toBe(true);
    expect(result.consolidated_record).toBeDefined();
    expect(result.consolidated_record.customer_id).toBeDefined();
    expect(result.consolidated_record.name).toBeDefined();
    expect(result.consolidated_record.address).toBeDefined();
    expect(result.consolidated_record.phone).toBeDefined();
  });
});