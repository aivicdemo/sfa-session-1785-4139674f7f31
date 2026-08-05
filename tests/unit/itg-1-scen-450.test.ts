import { calculateSalesRepResponseRateScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析結果レコード', () => {
  // SCEN-450
  test('[edge] 反応分類データの反応率スコア計算時に端数が小数第2位で正確に四捨五入される', () => {
    // 営業担当者A: 正応答件数3件、総接触件数7件
    // 期待値: 3 ÷ 7 = 0.428571... → 小数第2位四捨五入 = 0.43
    const result_a = calculateSalesRepResponseRateScore({
      positiveResponseCount: 3,
      totalContactCount: 7,
    });
    expect(result_a).toBe(0.43);

    // 営業担当者B: 正応答件数5件、総接触件数11件
    // 期待値: 5 ÷ 11 = 0.454545... → 小数第2位四捨五入 = 0.45
    const result_b = calculateSalesRepResponseRateScore({
      positiveResponseCount: 5,
      totalContactCount: 11,
    });
    expect(result_b).toBe(0.45);

    // 営業担当者C: 正応答件数2件、総接触件数9件
    // 期待値: 2 ÷ 9 = 0.222222... → 小数第2位四捨五入 = 0.22
    const result_c = calculateSalesRepResponseRateScore({
      positiveResponseCount: 2,
      totalContactCount: 9,
    });
    expect(result_c).toBe(0.22);

    // 営業担当者D: 正応答件数4件、総接触件数13件
    // 期待値: 4 ÷ 13 = 0.307692... → 小数第2位四捨五入 = 0.31
    const result_d = calculateSalesRepResponseRateScore({
      positiveResponseCount: 4,
      totalContactCount: 13,
    });
    expect(result_d).toBe(0.31);

    // 営業担当者E: 正応答件数6件、総接触件数17件
    // 期待値: 6 ÷ 17 = 0.352941... → 小数第2位四捨五入 = 0.35
    const result_e = calculateSalesRepResponseRateScore({
      positiveResponseCount: 6,
      totalContactCount: 17,
    });
    expect(result_e).toBe(0.35);
  });
});