import { describe, test, expect } from '@jest/globals';
import { calculateROI } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 投資対効果算出', () => {
  // SCEN-1368: [error] 投資対効果算出機能 - 提案に含まれる実装コストの明細がないとき投資対効果が計算できない
  test('実装コスト明細が空配列のとき投資対効果計算失敗例外をスロー', () => {
    const proposalWithEmptyImplementationCosts = {
      proposalId: 'PROP-2024-001',
      customerId: 'CUST-5678',
      customerName: '株式会社テスト',
      proposalContent: 'クラウド導入提案',
      businessEffectForecastValue: 5000000,
      implementationCostDetails: [],
      proposedRevenueForecast: 10000000,
      proposedImplementationPeriodMonths: 6,
    };

    expect(() => calculateROI(proposalWithEmptyImplementationCosts)).toThrow(/実装コスト明細/);
  });
});