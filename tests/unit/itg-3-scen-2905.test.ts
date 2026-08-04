import { determinePeriodForRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2905
  test('推奨生成対象期間の判定 - 検証対象が月初日のときに前月末までのデータが正しく区切られる', () => {
    const targetDate = new Date('2024-02-01T00:00:00Z');
    
    const result = determinePeriodForRecommendation(targetDate);
    
    const expectedPeriodStart = new Date('2024-01-01T00:00:00Z');
    const expectedPeriodEnd = new Date('2024-01-31T23:59:59Z');
    
    expect(result.periodStart).toEqual(expectedPeriodStart);
    expect(result.periodEnd).toEqual(expectedPeriodEnd);
    
    expect(result.periodStart.getFullYear()).toBe(2024);
    expect(result.periodStart.getMonth()).toBe(0);
    expect(result.periodStart.getDate()).toBe(1);
    expect(result.periodStart.getHours()).toBe(0);
    expect(result.periodStart.getMinutes()).toBe(0);
    expect(result.periodStart.getSeconds()).toBe(0);
    
    expect(result.periodEnd.getFullYear()).toBe(2024);
    expect(result.periodEnd.getMonth()).toBe(0);
    expect(result.periodEnd.getDate()).toBe(31);
    expect(result.periodEnd.getHours()).toBe(23);
    expect(result.periodEnd.getMinutes()).toBe(59);
    expect(result.periodEnd.getSeconds()).toBe(59);
    
    const oneDayBeforePeriodStart = new Date('2023-12-31T23:59:59Z');
    expect(oneDayBeforePeriodStart.getTime()).toBeLessThan(result.periodStart.getTime());
    
    const oneDayAfterPeriodEnd = new Date('2024-02-01T00:00:00Z');
    expect(oneDayAfterPeriodEnd.getTime()).toBeGreaterThan(result.periodEnd.getTime());
  });
});