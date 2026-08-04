import { visualizeRecommendationReasons } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-285
  test('推奨根拠テーブルに記録された複数の根拠情報がすべて階層構造で可視化される', () => {
    const mockReasons = [
      {
        id: 'reason-1',
        type: '顧客業界の成功事例',
        confidence: 92,
        description: 'IT業界の類似企業10社で同様提案の成約率82%',
        parentReasonId: null,
        childReasonIds: ['reason-2', 'reason-3'],
      },
      {
        id: 'reason-2',
        type: '提案アプローチの過去実績',
        confidence: 88,
        description: '同じアプローチで過去24件中20件成約',
        parentReasonId: 'reason-1',
        childReasonIds: ['reason-4'],
      },
      {
        id: 'reason-3',
        type: '商談段階の類似パターン',
        confidence: 85,
        description: '現在の商談段階での推奨タイミング適合度85%',
        parentReasonId: 'reason-1',
        childReasonIds: [],
      },
      {
        id: 'reason-4',
        type: '顧客予算規模マッチング',
        confidence: 80,
        description: '提案額が顧客予算範囲内で実行可能',
        parentReasonId: 'reason-2',
        childReasonIds: [],
      },
    ];

    const result = visualizeRecommendationReasons(mockReasons);

    expect(result).toEqual({
      rootReasons: [
        {
          id: 'reason-1',
          type: '顧客業界の成功事例',
          confidence: 92,
          description: 'IT業界の類似企業10社で同様提案の成約率82%',
          level: 1,
          children: [
            {
              id: 'reason-2',
              type: '提案アプローチの過去実績',
              confidence: 88,
              description: '同じアプローチで過去24件中20件成約',
              level: 2,
              children: [
                {
                  id: 'reason-4',
                  type: '顧客予算規模マッチング',
                  confidence: 80,
                  description: '提案額が顧客予算範囲内で実行可能',
                  level: 3,
                  children: [],
                },
              ],
            },
            {
              id: 'reason-3',
              type: '商談段階の類似パターン',
              confidence: 85,
              description: '現在の商談段階での推奨タイミング適合度85%',
              level: 2,
              children: [],
            },
          ],
        },
      ],
      totalReasonsCount: 4,
      hierarchyDepth: 3,
    });

    const rootReasons = result.rootReasons;
    expect(rootReasons).toHaveLength(1);
    expect(rootReasons[0].id).toBe('reason-1');
    expect(rootReasons[0].parentReasonId).toBeUndefined();
    expect(rootReasons[0].level).toBe(1);

    expect(rootReasons[0].children).toHaveLength(2);
    const level2Children = rootReasons[0].children;
    expect(level2Children[0].id).toBe('reason-2');
    expect(level2Children[0].level).toBe(2);
    expect(level2Children[1].id).toBe('reason-3');
    expect(level2Children[1].level).toBe(2);

    expect(level2Children[0].children).toHaveLength(1);
    const level3Children = level2Children[0].children;
    expect(level3Children[0].id).toBe('reason-4');
    expect(level3Children[0].level).toBe(3);
    expect(level3Children[0].children).toHaveLength(0);

    expect(result.totalReasonsCount).toBe(4);
    expect(result.hierarchyDepth).toBe(3);

    result.rootReasons.forEach((reason) => {
      expect(reason.type).toBeDefined();
      expect(reason.type).not.toEqual('');
      expect(reason.confidence).toBeGreaterThanOrEqual(0);
      expect(reason.confidence).toBeLessThanOrEqual(100);
      expect(reason.description).toBeDefined();
      expect(reason.description).not.toEqual('');
    });

    const allReasonsInHierarchy = collectAllReasonsRecursively(
      result.rootReasons
    );
    expect(allReasonsInHierarchy).toHaveLength(4);
    const reasonIds = allReasonsInHierarchy.map((r) => r.id);
    expect(reasonIds).toContain('reason-1');
    expect(reasonIds).toContain('reason-2');
    expect(reasonIds).toContain('reason-3');
    expect(reasonIds).toContain('reason-4');
  });
});

function collectAllReasonsRecursively(
  reasons: Array<{
    id: string;
    children?: Array<{ id: string; children?: Array<any> }>;
  }>
): Array<{ id: string }> {
  const result: Array<{ id: string }> = [];
  const queue = [...reasons];

  while (queue.length > 0) {
    const reason = queue.shift();
    if (reason) {
      result.push({ id: reason.id });
      if (reason.children && reason.children.length > 0) {
        queue.push(...reason.children);
      }
    }
  }

  return result;
}