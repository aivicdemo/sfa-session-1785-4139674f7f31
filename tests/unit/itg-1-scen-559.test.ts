import { groupProblemsByResponseTime } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-559: 対応時期別の問題グループ化機能 - 対応時期別のグループに問題が0件の場合、空のグループが作成される', () => {
    const problemA = {
      problem_id: 'PROB-001',
      problem_name: '提案内容が顧客ニーズに不適合',
      response_time_category: '緊急',
      priority_score: 85,
      detected_timestamp: '2024-02-15T10:30:00Z',
    };

    const problemB = {
      problem_id: 'PROB-002',
      problem_name: 'フォローアップ頻度が標準プロセス下回る',
      response_time_category: '緊急',
      priority_score: 72,
      detected_timestamp: '2024-02-15T11:45:00Z',
    };

    const problems = [problemA, problemB];

    const defined_response_time_categories = [
      '緊急',
      '1週間以内',
      '1ヶ月以内',
      'それ以降',
    ];

    const result = groupProblemsByResponseTime(
      problems,
      defined_response_time_categories
    );

    expect(result).toHaveProperty('緊急');
    expect(result['緊急']).toHaveLength(2);
    expect(result['緊急']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ problem_id: 'PROB-001' }),
        expect.objectContaining({ problem_id: 'PROB-002' }),
      ])
    );

    expect(result).toHaveProperty('1週間以内');
    expect(result['1週間以内']).toEqual([]);

    expect(result).toHaveProperty('1ヶ月以内');
    expect(result['1ヶ月以内']).toEqual([]);

    expect(result).toHaveProperty('それ以降');
    expect(result['それ以降']).toEqual([]);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        '緊急',
        '1週間以内',
        '1ヶ月以内',
        'それ以降',
      ])
    );

    expect(Object.keys(result).length).toBe(4);
  });
});