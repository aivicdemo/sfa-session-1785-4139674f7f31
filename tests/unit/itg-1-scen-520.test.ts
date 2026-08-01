import { classifyDetectionResultsByPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-520: 問題が0件検出された場合、空の分類結果が返される', () => {
    // Arrange
    const detectedIssues: any[] = [];

    // Act
    const result = classifyDetectionResultsByPriority(detectedIssues);

    // Assert
    expect(result).toEqual({
      criticalItems: [],
      highItems: [],
      mediumItems: [],
      lowItems: []
    });
    expect(result.criticalItems.length).toBe(0);
    expect(result.highItems.length).toBe(0);
    expect(result.mediumItems.length).toBe(0);
    expect(result.lowItems.length).toBe(0);
  });
});