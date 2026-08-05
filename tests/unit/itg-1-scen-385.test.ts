import { describe, test, expect } from '@jest/globals';
import { evaluateSuccessPatternMatrixApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-385: [error] 成功パターンマトリクス適用判定機能 - 営業担当者 ID が null のとき処理が中断される
  test('営業担当者IDがnullの場合、E_SALES_PERSON_ID_REQUIREDエラーが発生し処理は中断される', () => {
    const input = {
      salesPersonId: null,
      salesAmount: 500000,
      productCategory: 'software',
      contractPeriod: 12,
      customerIndustry: 'manufacturing',
      dealStage: 'negotiation',
    };

    expect(() => evaluateSuccessPatternMatrixApplicability(input)).toThrow(
      /E_SALES_PERSON_ID_REQUIRED/
    );
  });
});