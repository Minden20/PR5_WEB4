import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  private readonly cyrillicToLatinMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ye',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'yi',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ь: '',
    ю: 'yu',
    я: 'ya',
    '\'': '',
    '`': '',
    '’': '',
    'ʼ': '',
  };

  generateSlug(title: string): string {
    if (!title || typeof title !== 'string') {
      return '';
    }

    const lower = title.toLowerCase().trim();
    const transliterated = lower
      .split('')
      .map((char) => this.cyrillicToLatinMap[char] ?? char)
      .join('');

    return transliterated
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
