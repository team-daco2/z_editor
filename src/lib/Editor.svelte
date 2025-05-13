<script lang="ts">
	import FontSizeStepper from './components/FontSizeStepper.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
    import { tooltips } from './tooltips';
	import { Underline as UnderlineExtension } from '@tiptap/extension-underline';
	import TextStyle from '@tiptap/extension-text-style';
	import {Color as ColorExtension} from '@tiptap/extension-color';
	import {TextAlign as TextAlignExtension} from '@tiptap/extension-text-align';
	import {Link as LinkExtension} from '@tiptap/extension-link';
	import {Image as ImageExtension} from '@tiptap/extension-image';
	import { ResizableImage } from './extensions/resizableImage'
	import { FontSize } from './extensions/fontSize';
    import { 
        Redo2,	
        Undo2,
        Pilcrow,
        Heading1,
        Heading2,
        Heading3,
        Heading4,
        Heading5,
        Heading6,
		Bold,
		Italic,
		Underline,
		AlignLeft,
		AlignCenter,
		AlignRight
    } from 'lucide-svelte';

	import Button from './components/Button.svelte';
	import CustomSelect from './components/CustomSelect.svelte';
	import FontColorSelect from './components/FontColorSelect.svelte';
	import LinkInsert from './components/LinkInsert.svelte';
	import ImageUpload from './components/imageUpload.svelte';

	export let imageUploader: (files: FileList) => Promise<string[]> = async () => [];
	let lang = 'kr';
    let platform: string = 'windows';

	let element: any = "";
	let editor: any = "";

    let selected = 'paragraph';

    const headingOptions = [
        { label: 'Paragraph', value: 'paragraph', icon: Pilcrow },
        { label: 'Heading 1', value: 'h1', icon: Heading1 },
        { label: 'Heading 2', value: 'h2', icon: Heading2 },
        { label: 'Heading 3', value: 'h3', icon: Heading3 },
        { label: 'Heading 4', value: 'h4', icon: Heading4 },
        { label: 'Heading 5', value: 'h5', icon: Heading5 },
        { label: 'Heading 6', value: 'h6', icon: Heading6 }
    ];
	
	onMount(() => {
		const raw = navigator.platform.toLowerCase();
        if (raw.includes('mac')) platform = 'mac';
        else if (raw.includes('win')) platform = 'windows';

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				UnderlineExtension,
				TextStyle,
				ColorExtension,
				FontSize,
				ImageExtension,
				ResizableImage,
				TextAlignExtension.configure({
					types: ['heading', 'paragraph', 'resizableImage'],
				}),
				LinkExtension.configure({
					openOnClick: false,
				})
			],
			content: '',
			onTransaction: () => {
				editor = editor;
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});


	$: if (editor) {
		selected =
			editor.isActive('heading', { level: 1 }) ? 'h1' :
			editor.isActive('heading', { level: 2 }) ? 'h2' :
			editor.isActive('heading', { level: 3 }) ? 'h3' :
			editor.isActive('heading', { level: 4 }) ? 'h4' :
			editor.isActive('heading', { level: 5 }) ? 'h5' :
			editor.isActive('heading', { level: 6 }) ? 'h6' :
			'paragraph';
	}

	$: console.log(123131,editor);

</script>

<div>
	{#if editor}
		<!-- Toolbar -->
		<div
			class="flex flex-wrap gap-x-5 gap-y-2 items-center px-2 py-2 border border-gray-300 rounded-t-md bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] relative z-10"
		>
			<div class="flex gap-1 items-center">
				<Button
					icon={Undo2} 
					tooltip="{tooltips[lang].undo[platform]}"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
				/>
				<Button 
					icon={Redo2}
					tooltip="{tooltips[lang].redo[platform]}"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
				/>
			</div>

			<div class="flex gap-1 items-center">
				<Button
					icon={Bold}
					tooltip="{tooltips[lang].bold[platform]}"
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive('bold')}
				/>
				<Button
					icon={Italic}
					tooltip="{tooltips[lang].italic[platform]}"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive('italic')}
				/>
				<Button
					icon={Underline}
					tooltip="{tooltips[lang].underline[platform]}"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					active={editor.isActive('underline')}
				/>
				<FontColorSelect
					tooltip="{tooltips[lang].fontColor[platform]}"
					onColorSelect={(color) => {
						if (color) {
							editor.chain().focus().setColor(color).run();
						} else {
							editor.chain().focus().unsetColor().run();
						}
					}}
					selectedColor={editor.getAttributes('textStyle').color}
				/>
			</div>

			<div class="flex gap-1 items-center">
				<FontSizeStepper
					value={editor.getAttributes('fontSize').fontSize || '16px'}
					onChange={(v: number) => {
						editor.chain().focus().setFontSize(`${v}px`).run();
					}}
					tooltip="{tooltips[lang].fontSize[platform]}"
				/>
				<CustomSelect
					options={headingOptions}
					bind:selected
					onChange={(v) => {
						selected = v;
						if (v === 'paragraph') {
							editor.chain().focus().setParagraph().run();
						} else {
							const level = parseInt(v.replace('h', ''));
							editor.chain().focus().toggleHeading({ level }).run();
						}
					}}
				/>
			</div>

			<div class="flex gap-1 items-center">
				<Button
					icon={AlignLeft}
					tooltip="{tooltips[lang].alignLeft[platform]}"
					onClick={() => editor.chain().focus().setTextAlign('left').run()}
					active={editor.isActive({ textAlign: 'left' })}
				/>
				<Button
					icon={AlignCenter}
					tooltip="{tooltips[lang].alignCenter[platform]}"
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					active={editor.isActive({ textAlign: 'center' })}
				/>
				
				<Button
					icon={AlignRight}
					tooltip="{tooltips[lang].alignRight[platform]}"
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					active={editor.isActive({ textAlign: 'right' })}
				/>
			</div>

			<div class="flex gap-1 items-center">
				<LinkInsert
					{editor}
					tooltip="{tooltips[lang].insertLink[platform]}"
					active={editor?.isActive('link')}
				/>
				<ImageUpload 
					editor={editor}
					tooltip="{tooltips[lang].imageUpload[platform]}"
					imageUploader={imageUploader}
				/>
			</div>
		</div>
	{/if}
	<!-- 에디터 영역 -->
	<div
		role="presentation"
		bind:this={element}
		class="prose prose-base leading-4 max-w-none border border-t-0 border-gray-300 rounded-b-md bg-white min-h-[300px] px-2 py-2 mt-px focus:outline-none focus:ring-0"
		on:click={() => editor?.commands.focus()}
	>
	</div>

</div>


<style>
	:global(.active) {
        background-color: #e5e7eb;
    }

    :global(.ProseMirror:focus) {
        outline: none;
    }

	:global(.drs-editor-resizable-wrapper) {
		text-align: center;
	}

	:global(.drs-editor-image-container) {
		display: inline-block;
		position: relative;
		border: 2px solid transparent;
		transition: border-color 0.2s ease;
	}

	:global(.drs-editor-resizable-wrapper:hover .drs-editor-image-container) {
		border-color: #3b82f6;
	}

	:global(.drs-editor-image-container img) {
		display: block;
		width: 100%;
		height: auto;
	}

	:global(.drs-editor-resize-handle) {
		position: absolute;
		right: -6px;
		bottom: -6px;
		width: 12px;
		height: 12px;
		background-color: #3b82f6;
		border-radius: 3px;
		cursor: nwse-resize;

		opacity: 0;
		transition: opacity 0.2s ease;
	}

	:global(.drs-editor-resizable-wrapper:hover .drs-editor-resize-handle) {
		opacity: 1;
	}

</style>