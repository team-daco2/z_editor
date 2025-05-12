// 커스텀 TipTap 이미지 노드: 디자인 가능한 리사이즈 이미지

import { Node, mergeAttributes } from '@tiptap/core';

export const ResizableImage = Node.create({
  name: 'resizableImage',

  group: 'block',
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 300 },
      height: { default: 'auto' },
      textAlign: {
        default: 'left',
        parseHTML: element => element.style.textAlign || 'left',
        renderHTML: attributes => {
          return { style: `text-align: ${attributes.textAlign}` };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="resizable-image"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'resizable-image' }),
      ['img', {
        src: HTMLAttributes.src,
        style: `width: ${HTMLAttributes.width}px; height: ${HTMLAttributes.height};`
      }]
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'drs-editor-resizable-wrapper';
      wrapper.contentEditable = 'false';
      wrapper.dataset.type = 'drs-editor-resizable-image';
      wrapper.style.textAlign = node.attrs.textAlign || 'left';

      const container = document.createElement('div');
      container.className = 'drs-editor-image-container';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.style.width = node.attrs.width + 'px';
      img.style.height = node.attrs.height;
      img.style.display = 'block';

      const handle = document.createElement('span');
      handle.className = 'drs-editor-resize-handle';

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = img.offsetWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          img.style.width = newWidth + 'px';
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs,
              width: img.offsetWidth,
            });
            return true;
          });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      container.appendChild(img);
      container.appendChild(handle);
      wrapper.appendChild(container);

      return {
        dom: wrapper
      };
    };
  },
});
