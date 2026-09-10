export const LOCALES = ['zh', 'en'];
export const DEFAULT_LOCALE = 'zh';

export const dictionaries = {
  zh: {
    siteTitle: '物尽其分 · Matter, Sorted.',
    heroTitle: '技术为什么演化成现在这样，而不是别的样子',
    heroDesc: '固废分选的技术与产品笔记：从感知层的物理限制，到运营层的数据流问题。',
    notesHeading: '产品开发',
    emptyNotes: '还没有发布任何笔记。按 CONTENT_GUIDE.md 添加第一篇。',
    layerStackHeading: '研究笔记',
    backToList: '返回列表',
    translationMissing: '本文暂无中文版本，以下为英文原文。',
  },
  en: {
    siteTitle: 'Matter, Sorted. · 物尽其分',
    heroTitle: 'Why the technology evolved this way, and not another',
    heroDesc:
      'Technical and product notes on solid-waste sorting, from the physical limits of perception to data-flow problems in operations.',
    notesHeading: 'Product Development',
    emptyNotes: 'No notes published yet.',
    layerStackHeading: 'Research Notes',
    backToList: 'Back to list',
    translationMissing: 'No English version yet — showing the original.',
  },
};

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
