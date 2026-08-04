import { extractImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  // SCEN-426
  test('重複する不整合項目が含まれる場合、重複が排除されて返される', () => {
    // Arrange: 重複を含む不整合項目リスト
    const duplicateInconsistencyItems = [
      '顧客ニーズ未把握',
      '提案根拠不足',
      '顧客ニーズ未把握',
      'フォローアップ遅延',
      '提案根拠不足',
    ];

    // Act: 改善対象項目抽出機能を実行
    const result = extractImprovementTargets(duplicateInconsistencyItems);

    // Assert: 期待結果の検証
    const expectedResult = [
      'フォローアップ遅延',
      '提案根拠不足',
      '顧客ニーズ未把握',
    ];

    // 戻り値が期待するソート済みの一意な項目リストと一致
    expect(result).toEqual(expectedResult);

    // 重複排除後の項目数が入力時より少ないことを確認
    expect(result.length).toBe(3);
    expect(duplicateInconsistencyItems.length).toBe(5);
    expect(result.length).toBeLessThan(duplicateInconsistencyItems.length);

    // 排除されたすべての重複項目が戻り値に存在しないことを確認
    // 入力に2回出現した項目は出力に1回だけ存在することを確認
    const countInInput = duplicateInconsistencyItems.filter(
      (item) => item === '顧客ニーズ未把握'
    ).length;
    const countInOutput = result.filter(
      (item) => item === '顧客ニーズ未把握'
    ).length;
    expect(countInInput).toBe(2);
    expect(countInOutput).toBe(1);

    // 提案根拠不足についても同様に検証
    const countProposalInInput = duplicateInconsistencyItems.filter(
      (item) => item === '提案根拠不足'
    ).length;
    const countProposalInOutput = result.filter(
      (item) => item === '提案根拠不足'
    ).length;
    expect(countProposalInInput).toBe(2);
    expect(countProposalInOutput).toBe(1);
  });
});