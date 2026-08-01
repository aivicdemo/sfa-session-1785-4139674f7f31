import { determineSalesLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-061
  test('対象営業担当者が1人のとき抽出範囲にその担当者が含まれる', () => {
    const salesRepresentativeCandidates = [
      {
        sales_representative_id: 'SR001',
        name: '営業太郎',
      },
    ];

    const extractionRangeInput = {
      candidate_sales_representatives: salesRepresentativeCandidates,
      target_sales_representative_ids: ['SR001'],
    };

    const result = determineSalesLogExtractionRange(extractionRangeInput);

    expect(result.extraction_target_sales_representative_ids).toEqual(['SR001']);
    expect(result.extraction_target_sales_representative_ids.length).toBe(1);
    expect(
      result.extraction_target_sales_representative_ids.includes('SR001')
    ).toBe(true);
  });
});