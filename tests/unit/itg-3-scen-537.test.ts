import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-537
  test('改善優先度が閾値未満のときアイテムが抽出対象から除外される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ score: 0.85 })
        .mockResolvedValueOnce({ score: 0.70 })
        .mockResolvedValueOnce({ score: 0.68 })
        .mockResolvedValueOnce({ score: 0.75 }),
    };

    const improvementItems = [
      { id: 'A', name: '項目A' },
      { id: 'B', name: '項目B' },
      { id: 'C', name: '項目C' },
      { id: 'D', name: '項目D' },
    ];

    const threshold = 0.70;

    const result = await evaluatePatternRelevance(
      improvementItems,
      mockAIEngine,
      threshold
    );

    expect(result.extractedItems).toHaveLength(2);
    expect(result.extractedItems).toEqual([
      { id: 'A', name: '項目A', score: 0.85 },
      { id: 'D', name: '項目D', score: 0.75 },
    ]);
    expect(result.excludedItems).toHaveLength(2);
    expect(result.excludedItems).toEqual([
      { id: 'B', name: '項目B', score: 0.70 },
      { id: 'C', name: '項目C', score: 0.68 },
    ]);
  });
});