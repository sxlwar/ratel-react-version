import { highlightElement } from 'prismjs';
import React, { ElementType, useEffect, useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { ReactMarkdownProps } from 'react-markdown';

import { emojis } from './emojis';
import { CompressedEmojiData, Emoji, EmojiData, EmojiVariation } from './model';

const COLONS_REGEX = /^(?::([^:]+):)(?::skin-tone-(\d):)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

export const DEFAULT_BACKGROUND_FN = (set: string, sheetSize: number) =>
    `https://unpkg.com/emoji-datasource-${set}@4.0.4/img/${set}/sheets-256/${sheetSize}.png`;

export class EmojiService {
    names: { [key: string]: EmojiData } = {};
    emojis: EmojiData[] = [];

    constructor() {
        this.uncompress(emojis);
    }

    private uncompress(list: CompressedEmojiData[]) {
        this.emojis = list.map(emoji => {
            const data: any = { ...emoji };
            if (!data.shortNames) {
                data.shortNames = [];
            }
            data.shortNames.unshift(data.shortName);
            data.id = data.shortName;
            data.native = this.unifiedToNative(data.unified);

            if (!data.skinVariations) {
                data.skinVariations = [];
            }

            if (!data.keywords) {
                data.keywords = [];
            }

            if (!data.emoticons) {
                data.emoticons = [];
            }

            if (!data.hidden) {
                data.hidden = [];
            }

            if (!data.text) {
                data.text = '';
            }

            if (data.obsoletes) {
                // get keywords from emoji that it obsoletes since that is shared
                const f = list.find(x => x.unified === data.obsoletes);
                if (f) {
                    if (f.keywords) {
                        data.keywords = [...data.keywords, ...f.keywords, f.shortName];
                    } else {
                        data.keywords = [...data.keywords, f.shortName];
                    }
                }
            }

            this.names[data.unified] = data;
            for (const n of data.shortNames) {
                this.names[n] = data;
            }
            return data;
        });
    }

    private getData(emoji: EmojiData | string, skin?: Emoji['skin'], set?: Emoji['set']): EmojiData | null {
        let emojiData: any;

        if (typeof emoji === 'string') {
            const matches = emoji.match(COLONS_REGEX);

            if (matches) {
                emoji = matches[1];

                if (matches[2]) {
                    skin = parseInt(matches[2], 10) as Emoji['skin'];
                }
            }
            if (this.names.hasOwnProperty(emoji)) {
                emojiData = this.names[emoji];
            } else {
                return null;
            }
        } else if (emoji.id) {
            emojiData = this.names[emoji.id];
        } else if (emoji.unified) {
            emojiData = this.names[emoji.unified.toUpperCase()];
        }

        if (!emojiData) {
            emojiData = emoji;
            emojiData.custom = true;
        }

        const hasSkinVariations = emojiData.skinVariations && emojiData.skinVariations.length;
        if (hasSkinVariations && skin && skin > 1 && set) {
            emojiData = { ...emojiData };

            const skinKey = SKINS[skin - 1];
            const variationData = emojiData.skinVariations.find((n: EmojiVariation) => n.unified.includes(skinKey));

            if (!variationData.hidden || !variationData.hidden.includes(set)) {
                emojiData.skinTone = skin;
                emojiData = { ...emojiData, ...variationData };
            }
            emojiData.native = this.unifiedToNative(emojiData.unified);
        }

        emojiData.set = set || '';
        return emojiData as EmojiData;
    }

    private unifiedToNative(unified: string) {
        const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16));
        return String.fromCodePoint(...codePoints);
    }

    emojiSpriteStyles(
        sheet: EmojiData['sheet'],
        set: Emoji['set'] = 'apple',
        size: Emoji['size'] = 24,
        sheetSize: Emoji['sheetSize'] = 64,
        backgroundImageFn: Emoji['backgroundImageFn'] = DEFAULT_BACKGROUND_FN,
        sheetColumns = 52
    ) {
        return {
            width: `${size}px`,
            height: `${size}px`,
            display: 'inline-block',
            'background-image': `url(${backgroundImageFn(set, sheetSize)})`,
            'background-size': `${100 * sheetColumns}%`,
            'background-position': this.getSpritePosition(sheet, sheetColumns)
        };
    }

    private getSpritePosition(sheet: EmojiData['sheet'], sheetColumns: number) {
        const [sheet_x, sheet_y] = sheet;
        const multiply = 100 / (sheetColumns - 1);
        return `${multiply * sheet_x}% ${multiply * sheet_y}%`;
    }

    private sanitize(emoji: EmojiData | null): EmojiData | null {
        if (emoji === null) {
            return null;
        }
        const id = emoji.id || emoji.shortNames[0];
        let colons = `:${id}:`;
        if (emoji.skinTone) {
            colons += `:skin-tone-${emoji.skinTone}:`;
        }
        emoji.colons = colons;
        return { ...emoji };
    }

    private getSanitizedData(emoji: string | EmojiData, skin?: Emoji['skin'], set?: Emoji['set']) {
        return this.sanitize(this.getData(emoji, skin, set));
    }

    /**
     * @param emoji Emoji name
     * @returns Css value for emoji;
     */
    getStyle(emoji: string): string {
        const data = this.getData(emoji);
        if (!data) {
            return '';
        } else {
            const spriteStyle = this.emojiSpriteStyles(data.sheet, 'apple', 18, 64, DEFAULT_BACKGROUND_FN, 52);

            return Object.entries(spriteStyle).reduce(
                (pre, [key, value]) => `${pre}; ${key}: ${value}; `,
                'margin: 0 5px 0 0'
            );
        }
    }
}

/**
 * @description Generate renderer function for markdown configuration;
 */
const emojiRender = (wrap: string, emojiService: EmojiService, flexLayout = false) => (component: any) => {
    const regexp = /:\w+:/;
    const content = component.children[0].props.value; // ! 照着控制台的输出写的，what component?

    if (!!content && regexp.test(content)) {
        let result: any[];
        let str = content;
        const reg = /:\w+:/g;

        while ((result = reg.exec(content)) !== null) {
            str = str.replace(regexp, `<span style="${emojiService.getStyle(result[0])}"></span>`);
        }

        return (
            <>
                {ReactHtmlParser(
                    `<${wrap} style="${flexLayout ? 'display: flex; align-items: center;' : ''}">${str}</${wrap}>`
                )}
            </>
        );
    } else {
        return component.children;
    }
};

const CodeBlock: ElementType = (props: {language: string, value: string, children: any }) => {
    const ref = useRef(null);
    const { language, value } = props;

    useEffect(() => {
        highlightElement(ref.current);
    });

    return (
        <pre>
            <code ref={ref} className={`language-${language}`}>
                {value}
            </code>
        </pre>
    );
};

export function markdownDefaultOptions(): ReactMarkdownProps {
    const emojiService = new EmojiService();

    return {
        escapeHtml: false,
        renderers: {
            code: CodeBlock,
            paragraph: emojiRender('p', emojiService, true),
            tableCell: emojiRender('td', emojiService)
        }
    };
}
