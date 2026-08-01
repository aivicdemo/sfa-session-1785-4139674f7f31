import { extractProblemsRequiringAction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-551
  test('対応すべき問題の抽出機能 - 問題の状態が対応中の場合、抽出結果に含まれるか正しく判定される', () => {
    const problems = [
      {
        id: 'P001',
        status: '対応中',
        priority: '高',
        detectionTimestamp: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 'P002',
        status: '未対応',
        priority: '中',
        detectionTimestamp: new Date('2024-01-15T10:05:00Z'),
      },
      {
        id: 'P003',
        status: '対応完了',
        priority: '高',
        detectionTimestamp: new Date('2024-01-15T09:55:00Z'),
      },
      {
        id: 'P004',
        status: '対応中止',
        priority: '低',
        detectionTimestamp: new Date('2024-01-15T10:10:00Z'),
      },
    ];

    const result = extractProblemsRequiringAction(problems);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'P001',
      status: '対応中',
      priority: '高',
      detectionTimestamp: new Date('2024-01-15T10:00:00Z'),
    });
  });
});