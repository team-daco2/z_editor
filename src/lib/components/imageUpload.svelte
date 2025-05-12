<script lang="ts">
    import { ImageUp, X } from 'lucide-svelte';
    import { onMount, onDestroy } from 'svelte';
    import Button from './Button.svelte';
    import Tooltip from './toolbar/Tooltip.svelte';
	import { Editor } from '@tiptap/core';

    export let editor: Editor;
    export let rounded: boolean = true;
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let tooltip: string = '';
    let files: FileList | null = null;

    let showTooltip = false;
    let tooltipTimer: ReturnType<typeof setTimeout>;
    let showModal = false;
    export let imageUploader: (files: FileList) => Promise<string[]> = async () => [];

    let previewUrls: string[] = [];
    let wrapper: HTMLDivElement;

    function handleMouseEnter() {
        tooltipTimer = setTimeout(() => {
            showTooltip = true;
        }, 250);
    }

    function handleMouseLeave() {
        clearTimeout(tooltipTimer);
        showTooltip = false;
    }

    async function handleSave() {
        // files 로 전달
        if(!files || files.length === 0) {
            return;
        }
        
        const images = await imageUploader(files);

        const imageNodes = images.map((src) => ({
            type: 'resizableImage',
            attrs: {
                src,
                width: '400',
                height: 'auto'
            }
        }));

        editor.commands.insertContent(imageNodes);

        showModal = false;
        resetForm();
    }

    function handleCancel() {
        showModal = false;
        resetForm();
    }

    function handleClickOutside(event: MouseEvent) {
        if (showModal && !wrapper.contains(event.target as Node)) {
            showModal = false;
            resetForm();
        }
    }

    function handleFileSelect(event: any) {
        files = event.target.files;

        const previewFiles = (event.target as HTMLInputElement)?.files;
        if (!previewFiles || previewFiles.length === 0) return;

        const newPreviews: string[] = [];
        for (const file of Array.from(previewFiles)) {
            if (!file.type.startsWith('image/')) {
                continue;
            }
            newPreviews.push(URL.createObjectURL(file));
        }
        previewUrls = [...previewUrls, ...newPreviews];
    }

    function resetForm() {
        previewUrls = [];
    }

    function handleRemove(index: number) {
        previewUrls = previewUrls.filter((_, i) => i !== index);
    }


    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<div bind:this={wrapper} class="relative inline-block text-sm">
    <div class="relative" role="presentation" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <button
            on:click={() => setTimeout(() => (showModal = true), 0)}
            class={`flex items-center justify-center transition-colors hover:bg-gray-200
                ${rounded ? 'rounded-sm' : ''}
                px-1 min-h-[32px] cursor-pointer
                ${
                    size === 'sm'
                        ? 'text-sm'
                        : size === 'lg'
                        ? 'text-xl'
                        : 'text-base'
                }`}
        >
            <ImageUp />
        </button>

        {#if tooltip && showTooltip}
            <Tooltip tooltip={tooltip} target={wrapper}/>
        {/if}
    </div>

    {#if showModal}
    <div role="presentation" class="fixed inset-0 z-50 flex items-center justify-center bg-white/75" on:click={() => (showModal = false)}>
        <div role="presentation" class="modal-content w-[500px] p-6 relative bg-white border border-gray-200 rounded shadow-lg" on:click|stopPropagation>
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">이미지 업로드</h2>
                <Button icon="{X}" onClick={handleCancel} />
            </div>

            <div class="w-full border-2 border-dashed border-gray-300 rounded-md py-12 px-6 text-center">
                <p class="text-gray-500 mb-4">이미지를 여기에 드래그하세요</p>
                <label class="inline-block cursor-pointer bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-200">
                    이미지 파일 선택
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        class="hidden"
                        on:change={handleFileSelect}
                    />
                </label>
            </div>

            {#if previewUrls.length > 0}
            <div class="my-6">
                <p class="text-sm text-gray-500 mb-2">미리보기</p>
                <div class="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-1">
                    {#each previewUrls as src, i}
                        <div class="relative group">
                            <img src={src} alt={`미리보기 ${i}`} class="w-full h-auto rounded-md border max-h-40 object-cover" />
                            <button
                                on:click={() => handleRemove(i)}
                                class="absolute top-1 right-1 bg-white border rounded-full p-1 text-gray-600 hover:text-red-500 hover:border-red-400 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                                <X size="16" />
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
            {/if}

            <div class="flex justify-end gap-2 mt-6">
                <button on:click={handleCancel} class="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                    취소
                </button>
                <button on:click={handleSave} class="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    저장
                </button>
            </div>
        </div>
    </div>
    {/if}
</div>
