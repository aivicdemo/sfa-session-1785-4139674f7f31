import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import * as logicModule from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-756
  test('信号検出根拠生成機能 - 購買周期が計算不可のとき、根拠に周期不明である旨が記載される', () => {
    const customerId = 'CUST-20240115-001';
    const productId = 'PROD-5000';
    const purchaseCycleError = {
      code: 'CYCLE_CALCULATION_FAILED',
      message: '購買周期計算に必要なデータが不足しています',
      reason: 'insufficient_purchase_history',
    };

    const testInput = {
      customerId,
      productId,
      purchaseCycleResult: null,
      purchaseCycleError,
      lastContactDate: '2024-01-15',
      responsePatternData: {
        lastResponseDate: '2024-01-10',
        responseCount: 3,
        averageResponseDays: null,
      },
    };

    const result = logicModule.generatePurchaseSignalReason(testInput);

    expect(result).toHaveProperty('reason');
    expect(result.reason).toMatch(/計算不可|不明|取得できませんでした|周期|cycle/i);
  });
});