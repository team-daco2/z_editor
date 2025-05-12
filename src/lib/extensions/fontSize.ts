import { Mark, mergeAttributes } from '@tiptap/core';

export const FontSize = Mark.create({
    name: 'fontSize',

    addAttributes() {
        return {
            fontSize: {
                default: null,
                parseHTML: element => element.style.fontSize || null,
                renderHTML: attributes => {
                    if (!attributes.fontSize) return {};
                    return { style: `font-size: ${attributes.fontSize}` };
                },
            },
        };
    },

    parseHTML() {
        return [{ style: 'font-size' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands(): any {
        return {
            setFontSize:
                (fontSize: string) =>
                ({ commands }: any) =>
                    commands.setMark(this.name, { fontSize }),

            unsetFontSize:
                () =>
                ({ commands }: any) =>
                    commands.unsetMark(this.name),
        };
    },
});
