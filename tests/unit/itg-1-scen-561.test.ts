import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateAiInferencePrecisionMonitoringData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-561
  test('推論精度監視データが必須フィールド欠落時にエラーになる', () => {
    const valid_inference_id = 'inf-20240115-001';
    const valid_model_version = 'v2.1.0';
    const valid_precision_score = 0.94;
    const valid_timestamp = '2024-01-15T11:00:00Z';
    const valid_inference_category = 'proposal_recommendation';

    const test_cases = [
      {
        scenario_name: '推論ID欠落',
        data: {
          model_version: valid_model_version,
          precision_score: valid_precision_score,
          timestamp: valid_timestamp,
          inference_category: valid_inference_category,
        },
        expected_error_keyword: '推論ID',
      },
      {
        scenario_name: 'モデルバージョン欠落',
        data: {
          inference_id: valid_inference_id,
          precision_score: valid_precision_score,
          timestamp: valid_timestamp,
          inference_category: valid_inference_category,
        },
        expected_error_keyword: 'モデルバージョン',
      },
      {
        scenario_name: '精度スコア欠落',
        data: {
          inference_id: valid_inference_id,
          model_version: valid_model_version,
          timestamp: valid_timestamp,
          inference_category: valid_inference_category,
        },
        expected_error_keyword: '精度スコア',
      },
      {
        scenario_name: 'タイムスタンプ欠落',
        data: {
          inference_id: valid_inference_id,
          model_version: valid_model_version,
          precision_score: valid_precision_score,
          inference_category: valid_inference_category,
        },
        expected_error_keyword: 'タイムスタンプ',
      },
      {
        scenario_name: '推論カテゴリ欠落',
        data: {
          inference_id: valid_inference_id,
          model_version: valid_model_version,
          precision_score: valid_precision_score,
          timestamp: valid_timestamp,
        },
        expected_error_keyword: '推論カテゴリ',
      },
    ];

    test_cases.forEach((test_case) => {
      expect(() => {
        validateAiInferencePrecisionMonitoringData(test_case.data as any);
      }).toThrow(new RegExp(test_case.expected_error_keyword));
    });
  });
});