import { selectBestPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-2190: 成功パターンが0件のとき、優先順位付けされたパターンは返されない', () => {
    const emptyPatterns: any[] = [];
    
    const result = selectBestPattern(emptyPatterns);
    
    expect(result).toBeNull();
  });
});