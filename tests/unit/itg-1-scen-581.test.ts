import { calculateConversionRate } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-581: 成約率計算時に分子と分母が完全に一致する場合、端数が発生しない', () => {
    // Arrange
    const totalDeals = 10;
    const closedDeals = 10;

    // Act
    const conversionRate = calculateConversionRate(totalDeals, closedDeals);

    // Assert
    expect(conversionRate).toBe(100);
  });
});