import { judgeSuccessPatternApplicationCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1021
  test('実務適用報告内容が空のとき処理がエラーになること', () => {
    const input = {
      salesRepresentativeId: 'rep_001',
      guidlineUnderstandingScore: 85,
      practicalApplicationReport: '',
      applicationReportSubmissionDate: '2024-01-15T09:00:00Z',
    };

    expect(() => judgeSuccessPatternApplicationCompletion(input)).toThrow(
      /実務適用報告内容/
    );
  });
});