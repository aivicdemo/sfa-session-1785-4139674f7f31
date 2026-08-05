import { calculateInferencePrecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-353
  test('[error] AIエージェント推論精度自動監視機能 - 推論精度の計算結果が負数のとき、エラーが発生する', () => {
    const inference_result = {
      predicted_class: 'success_pattern',
      confidence_score: 0.85,
      inference_timestamp: new Date('2024-01-15T10:30:00Z'),
    };

    const reference_data = {
      actual_outcome: 'success_pattern',
      validation_timestamp: new Date('2024-01-15T10:30:00Z'),
    };

    const mock_precision_calculator = {
      compute: jest.fn().mockReturnValue(-0.15),
    };

    const execute_with_invalid_precision = () => {
      return calculateInferencePrecision(
        inference_result,
        reference_data,
        mock_precision_calculator
      );
    };

    expect(execute_with_invalid_precision).toThrow(/INVALID_PRECISION_VALUE/);

    try {
      execute_with_invalid_precision();
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/推論精度は0以上1以下の値である必要があります/);
        expect(error.message).toMatch(/-0.15/);
      }
    }
  });
});