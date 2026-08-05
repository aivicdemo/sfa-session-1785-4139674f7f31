import { determineExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-103
  test('データ蓄積量確認が未実施のときエラーになる', () => {
    const extractionRequest = {
      data_accumulation_checked: false,
      start_date: '2024-01-01',
      end_date: '2024-01-31',
    };

    expect(() => determineExtractionRange(extractionRequest)).toThrow(
      /データ蓄積量確認/
    );
  });
});