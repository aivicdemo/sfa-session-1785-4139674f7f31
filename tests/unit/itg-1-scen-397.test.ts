import { it, describe, beforeEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('SCEN-397: 成功パターンマトリクス参照サービスが停止状態のときエラー応答が返される', async () => {
    // Arrange
    const input_sales_process_data = {
      customer_id: 'CUST-20240115-001',
      customer_attribute: 'enterprise',
      product_category: 'consulting_service',
      sales_stage: 'proposal',
      contact_frequency_last_30days: 5,
      proposal_success_rate_historical: 0.68,
      follow_up_interval_days: 7,
      customer_need_type: 'cost_reduction'
    };

    const service_unavailable_response = {
      status_code: 503,
      error_code: 'SERVICE_UNAVAILABLE',
      error_message: '成功パターンマトリクス参照サービスは現在利用できません'
    };

    fetchMock.mockResponseOnce(
      JSON.stringify(service_unavailable_response),
      { status: 503 }
    );

    // Act & Assert
    const { determineSuccessPatternApplicability } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    try {
      const result = await determineSuccessPatternApplicability(
        input_sales_process_data
      );
      throw new Error('Expected error to be thrown, but function returned normally');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatch(/SERVICE_UNAVAILABLE/);
        expect(error.message).toMatch(/成功パターンマトリクス参照サービス/);
        expect(error.message).toMatch(/利用できません/);
      } else {
        throw error;
      }
    }

    expect(fetchMock).toHaveBeenCalled();
    const call_args = fetchMock.mock.calls[0];
    expect(call_args[1]?.method || 'GET').toMatch(/GET|POST/);
  });
});