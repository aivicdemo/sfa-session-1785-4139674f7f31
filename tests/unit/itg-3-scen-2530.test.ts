import { structureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  test('SCEN-2530: 成功要因リストが逆順で入力されるとき、正しい順序で構造化される', () => {
    // Setup: 逆順の成功要因リスト
    const reversed_factors = ['要因3', '要因2', '要因1'];

    // Execute: 構造化機能を実行
    const result = structureSuccessPatterns(reversed_factors);

    // Verify: 出力の順序が正しく並び替えられていることを検証
    expect(result.content).toEqual(['要因1', '要因2', '要因3']);
    expect(result.content[0]).toBe('要因1');
    expect(result.content[1]).toBe('要因2');
    expect(result.content[2]).toBe('要因3');

    // Verify: インデックスまたはorderフィールドが昇順であることを検証
    expect(result.factors).toEqual([
      { order: 0, factor: '要因1' },
      { order: 1, factor: '要因2' },
      { order: 2, factor: '要因3' }
    ]);

    // Verify: 正規化フラグが true であることを検証
    expect(result.isNormalized).toBe(true);

    // Verify: 要因数が保持されていることを検証
    expect(result.factors.length).toBe(3);
  });
});