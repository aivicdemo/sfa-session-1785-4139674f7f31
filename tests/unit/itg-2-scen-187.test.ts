import { describe, test, expect, beforeEach } from '@jest/globals';
import { applyNormalizationSequentially } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-187
  test('正規化ルールが0件のとき、順序立てた適用が実行されない', () => {
    const sample_business_data = {
      customer_name: '（株）テスト会社',
      address: '東京都渋谷区',
    };

    const normalization_rules: Array<{
      rule_id: string;
      priority: number;
      transformation: (data: any) => any;
    }> = [];

    const result = applyNormalizationSequentially({
      business_data: sample_business_data,
      normalization_rules: normalization_rules,
    });

    expect(result.normalized_data).toEqual({
      customer_name: '（株）テスト会社',
      address: '東京都渋谷区',
    });

    expect(result.execution_log).toEqual({
      applied_rules_count: 0,
      applied_rules: [],
    });
  });
});