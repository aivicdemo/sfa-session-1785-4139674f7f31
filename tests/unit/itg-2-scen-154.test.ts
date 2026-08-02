import { detectDuplicateAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・統合判定機能', () => {
  // SCEN-154
  test('名寄せ基準の重み付けスコアが閾値直下のとき、重複ではないと判定される', () => {
    const threshold = 80;
    
    const customer_1 = {
      customer_id: 'CUST_001',
      name: 'Yamada Taro',
      address: '1-2-3 Chiyoda, Tokyo',
      phone: '09012345678',
    };

    const customer_2 = {
      customer_id: 'CUST_002',
      name: 'Yamada Tarou',
      address: '1-2-3 Chiyoda-ku, Tokyo',
      phone: '09012345678',
    };

    const nameMatch = 0.60;
    const addressMatch = 0.80;
    const phoneMatch = 0.95;
    
    const nameWeight = 0.4;
    const addressWeight = 0.3;
    const phoneWeight = 0.3;
    
    const weightedScore = (nameMatch * nameWeight) +
                          (addressMatch * addressWeight) +
                          (phoneMatch * phoneWeight);

    expect(weightedScore).toBe(79.9);

    const result = detectDuplicateAndJudgeIntegration(
      {
        customer_id: customer_1.customer_id,
        name: customer_1.name,
        address: customer_1.address,
        phone: customer_1.phone,
      },
      {
        customer_id: customer_2.customer_id,
        name: customer_2.name,
        address: customer_2.address,
        phone: customer_2.phone,
      },
      {
        threshold: threshold,
        name_weight: nameWeight,
        address_weight: addressWeight,
        phone_weight: phoneWeight,
      }
    );

    expect(result.is_duplicate).toBe(false);
    expect(result.merge_status).toBe('non_duplicate');
    expect(result.weighted_score).toBe(79.9);
  });
});