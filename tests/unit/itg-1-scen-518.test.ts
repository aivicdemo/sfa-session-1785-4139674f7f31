import { classifyDetectionResultsRisk } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-518
  test('問題検出結果の重要度・優先度分類機能 - 複数の問題が検出された場合、全ての問題が重要度で正しく分類される', () => {
    const detection_results = [
      {
        id: 'problem_1',
        violation_type: 'コンプライアンス違反',
        score: 95,
      },
      {
        id: 'problem_2',
        violation_type: 'プロセス逸脱',
        score: 45,
      },
      {
        id: 'problem_3',
        violation_type: '不正取引',
        score: 88,
      },
      {
        id: 'problem_4',
        violation_type: 'ドキュメント不備',
        score: 32,
      },
      {
        id: 'problem_5',
        violation_type: '利益相反',
        score: 72,
      },
    ];

    const result = classifyDetectionResultsRisk(detection_results);

    expect(result).toEqual({
      classified_results: [
        {
          id: 'problem_1',
          violation_type: 'コンプライアンス違反',
          score: 95,
          importance_level: '高',
        },
        {
          id: 'problem_2',
          violation_type: 'プロセス逸脱',
          score: 45,
          importance_level: '低',
        },
        {
          id: 'problem_3',
          violation_type: '不正取引',
          score: 88,
          importance_level: '高',
        },
        {
          id: 'problem_4',
          violation_type: 'ドキュメント不備',
          score: 32,
          importance_level: '低',
        },
        {
          id: 'problem_5',
          violation_type: '利益相反',
          score: 72,
          importance_level: '中',
        },
      ],
      total_count: 5,
      high_importance_count: 2,
      medium_importance_count: 1,
      low_importance_count: 2,
    });
  });
});