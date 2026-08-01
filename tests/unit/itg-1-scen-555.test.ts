import { groupProblemsByResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-555: 対応時期別の問題グループ化機能 - 即座対応の問題が正しくグループ分けされる', () => {
    // Arrange
    const today = new Date('2024-01-15');
    const twoDaysLater = new Date('2024-01-17');

    const problem1 = {
      problem_id: 'P001',
      priority: '高',
      due_date: today,
      status: '未対応',
    };

    const problem2 = {
      problem_id: 'P002',
      priority: '中',
      due_date: twoDaysLater,
      status: '未対応',
    };

    const problem3 = {
      problem_id: 'P003',
      priority: '高',
      due_date: today,
      status: '未対応',
    };

    const problems = [problem1, problem2, problem3];

    // Act
    const groupedResult = groupProblemsByResponseTiming(problems, today);

    // Assert
    // 即座対応グループが1件存在する
    expect(groupedResult).toHaveProperty('immediate_response_group');
    
    // 即座対応グループに問題1と問題3の2件が分類される
    expect(groupedResult.immediate_response_group).toHaveLength(2);
    expect(groupedResult.immediate_response_group).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          problem_id: 'P001',
          priority: '高',
          due_date: today,
          status: '未対応',
        }),
        expect.objectContaining({
          problem_id: 'P003',
          priority: '高',
          due_date: today,
          status: '未対応',
        }),
      ])
    );

    // 問題2は即座対応グループに含まれない
    const problem2InImmediate = groupedResult.immediate_response_group.some(
      (p) => p.problem_id === 'P002'
    );
    expect(problem2InImmediate).toBe(false);

    // 問題2は他の対応時期グループに分類される
    expect(groupedResult).toHaveProperty('future_response_group');
    expect(groupedResult.future_response_group).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          problem_id: 'P002',
          priority: '中',
          due_date: twoDaysLater,
          status: '未対応',
        }),
      ])
    );
  });
});