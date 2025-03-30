import { DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';

import { mimeTypeMap } from './mime-type-map';

describe('mimeTypeMap', () => {
  it('should have correct structure for each entry', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(mimeTypeMap).forEach(([_, value]) => {
      expect(value).toHaveProperty('label');
      expect(value).toHaveProperty('icon');
      expect(typeof value.label).toBe('string');
      expect(value.icon).toBeDefined();
    });
  });

  it('should have correct mapping for PDF files', () => {
    const pdfMapping = mimeTypeMap['application/pdf'];
    expect(pdfMapping.label).toBe('PDF Document');
    expect(pdfMapping.icon.type).toBe(DocumentTextIcon);
    expect(pdfMapping.icon.props.className).toContain('text-red-500');
  });

  it('should have correct mapping for CSV files', () => {
    const csvMapping = mimeTypeMap['text/csv'];
    expect(csvMapping.label).toBe('CSV File');
    expect(csvMapping.icon.type).toBe(TableCellsIcon);
    expect(csvMapping.icon.props.className).toContain('text-lime-600');
  });

  it('should use consistent icon classes', () => {
    Object.values(mimeTypeMap).forEach((value) => {
      expect(value.icon.props.className).toContain('size-4');
      expect(value.icon.props.className).toContain('inline-block');
      expect(value.icon.props.className).toContain('mr-1');
    });
  });
});
