export function getCleanCssConfig() {
  return {
    keepSpecialComments: '*', // сохраняет все комментарии
    level: 0, // отключает оптимизацию, которая может удалять комментарии
    format: {
      breaks: {
        // controls where to insert breaks
        afterAtRule: false, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
        afterBlockBegins: true, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
        afterBlockEnds: true, // controls if a line break comes after a block ends, defaults to `false`
        afterComment: true, // controls if a line break comes after a comment; defaults to `false`
        afterProperty: false, // controls if a line break comes after a property; defaults to `false`
        afterRuleBegins: false, // controls if a line break comes after a rule begins; defaults to `false`
        afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
        beforeBlockEnds: true, // controls if a line break comes before a block ends; defaults to `false`
        betweenSelectors: false, // controls if a line break comes between selectors; defaults to `false`
      },
      breakWith: '\n', // controls the new line character, can be `'\r\n'` or `'\n'` (aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`); defaults to system one, so former on Windows and latter on Unix
      indentBy: 0, // controls number of characters to indent with; defaults to `0`
      indentWith: 'space', // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
      spaces: {
        aroundSelectorRelation: true,
        beforeBlockBegins: true,
        beforeValue: true,
      },
      wrapAt: false,
      semicolonAfterLastProperty: true,
    },
  };
}
