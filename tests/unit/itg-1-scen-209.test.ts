import { describe, test, expect } from '@jest/globals';
import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - 小数点丸め処理', () => {
  test('SCEN-209: 判定基準に小数点を含む計算値が発生するとき、指定の丸めルールで処理される', () => {
    // Arrange: 営業プロセス標準書のシステム要件変換機能を初期化し、
    // 小数点を含む計算値が発生する条件を設定
    const processStandardInput = {
      processStageName: 'sales_pipeline_stage_1',
      judgmentCriteria: {
        calculationExpression: 'revenue_target / 3',
        revenueTarget: 4,
        roundingRule: 'round_half_up',
        roundingDecimalPlaces: 2,
      },
      systemRequirementField: 'judgment_threshold_value',
    };

    // Act: 要件変換処理を実行
    const result = convertProcessStandardToSystemRequirement(processStandardInput);

    // Assert: 計算値 1.33333... が指定の丸めルール（四捨五入・小数点第2位）に従い
    // 1.33 に正確に丸められており、判定基準の要件として 1.33 が確定していることを確認
    expect(result).toEqual({
      systemRequirementField: 'judgment_threshold_value',
      convertedValue: 1.33,
      originalCalculationValue: 1.3333333333333333,
      roundingRule: 'round_half_up',
      roundingDecimalPlaces: 2,
      processStageName: 'sales_pipeline_stage_1',
      conversionStatus: 'success',
      timestamp: expect.any(String),
    });

    expect(result.convertedValue).toBe(1.33);
    expect(typeof result.convertedValue).toBe('number');
  });
});