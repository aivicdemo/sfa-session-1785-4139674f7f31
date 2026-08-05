import { describe, test, expect, beforeEach, jest } from '@jest/globals';

describe('システムヘルスチェック結果レポート生成機能', () => {
  test('SCEN-364: データ品質スコアの端数が発生する場合に適切に丸められてレポートに反映される', () => {
    // Import the logic function
    const { generateHealthCheckReport } = require('../../src/logic/it-1-br-2-1-1');

    // Test case 1: 85.3333333 should round to 85.33
    const input_1 = {
      data_quality_score_raw: 85.3333333,
      system_health_status: 'normal',
      ai_inference_accuracy: 94.5,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const report_1 = generateHealthCheckReport(input_1);

    expect(report_1.data_quality_score_display).toBe(85.33);
    expect(report_1.system_health_status).toBe('normal');
    expect(report_1.ai_inference_accuracy).toBe(94.5);

    // Test case 2: 85.3366666 should round to 85.34
    const input_2 = {
      data_quality_score_raw: 85.3366666,
      system_health_status: 'normal',
      ai_inference_accuracy: 94.5,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const report_2 = generateHealthCheckReport(input_2);

    expect(report_2.data_quality_score_display).toBe(85.34);

    // Test case 3: Edge case - exactly 2 decimal places should remain unchanged
    const input_3 = {
      data_quality_score_raw: 85.33,
      system_health_status: 'normal',
      ai_inference_accuracy: 94.5,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const report_3 = generateHealthCheckReport(input_3);

    expect(report_3.data_quality_score_display).toBe(85.33);

    // Test case 4: Rounding down case - 85.3322222 should round to 85.33
    const input_4 = {
      data_quality_score_raw: 85.3322222,
      system_health_status: 'normal',
      ai_inference_accuracy: 94.5,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const report_4 = generateHealthCheckReport(input_4);

    expect(report_4.data_quality_score_display).toBe(85.33);

    // Test case 5: Rounding up case - 85.3388888 should round to 85.34
    const input_5 = {
      data_quality_score_raw: 85.3388888,
      system_health_status: 'normal',
      ai_inference_accuracy: 94.5,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const report_5 = generateHealthCheckReport(input_5);

    expect(report_5.data_quality_score_display).toBe(85.34);

    // Verify the report structure is correct for all cases
    expect(report_1).toHaveProperty('data_quality_score_display');
    expect(report_1).toHaveProperty('system_health_status');
    expect(report_1).toHaveProperty('ai_inference_accuracy');
    expect(report_1).toHaveProperty('timestamp');

    // Verify that the raw score is preserved in the report for audit purposes
    expect(report_1).toHaveProperty('data_quality_score_raw');
    expect(report_1.data_quality_score_raw).toBe(85.3333333);
  });
});