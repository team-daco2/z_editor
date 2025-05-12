<script lang="ts">
    import { Link, X } from 'lucide-svelte';
    import { onMount, onDestroy } from 'svelte';
    import Button from './Button.svelte';
    import Tooltip from './toolbar/Tooltip.svelte';

    export let active: boolean = false;
    export let editor: any;
    export let rounded: boolean = true;
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let tooltip: string = '';

    let showTooltip = false;
    let tooltipTimer: ReturnType<typeof setTimeout>;
    let showModal = false;

    let url = '';
    let displayText = '';

    function handleMouseEnter() {
        tooltipTimer = setTimeout(() => {
            showTooltip = true;
        }, 250);
    }

    function handleMouseLeave() {
        clearTimeout(tooltipTimer);
        showTooltip = false;
    }

    function handleSave() {
        if (!editor) return;

        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();

        if (!hasSelection && displayText) {
            editor.chain().insertContent(displayText).run();
        } 

        if(!url) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }



        showModal = false;
        url = '';
        displayText = '';
    }

    function handleCancel() {
        showModal = false;
    }

    let wrapper: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (showModal && !wrapper.contains(event.target as Node)) {
            showModal = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<div bind:this={wrapper} class="relative inline-block text-sm">
    <div
        class="relative"
        role="presentation"
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
    >
        <button
            on:click={() => {
                if (!editor) return;
        
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(from, to).trim();
                const attrs = editor.getAttributes('link');
        
                url = attrs?.href || '';
                displayText = selectedText || attrs?.href || '';
        
                showModal = true;
            }}
            class:active={active}
            class={`flex items-center justify-center transition-colors hover:bg-gray-200
                ${rounded ? 'rounded-sm' : ''}
                px-1 min-h-[32px] cursor-pointer
                ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'}`}
        >
            <Link />
        </button>

        {#if tooltip && showTooltip}
            <Tooltip tooltip={tooltip} target={wrapper}/>
        {/if}
    </div>

    {#if showModal}
        <div
            role="presentation"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white/75"
            on:click={() => (showModal = false)}
        >
            <div
                class="modal-content w-[420px] p-6 bg-white border border-gray-200 rounded shadow-lg relative"
                on:click|stopPropagation
            >
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">링크 삽입/수정</h2>
                    <Button icon="{X}" onClick={handleCancel} />
                </div>

                <div class="space-y-3 text-sm">
                    <div>
                        <label class="block font-medium mb-1">링크</label>
                        <input
                            bind:value={url}
                            class="w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">텍스트 (선택 안 한 경우)</label>
                        <input
                            bind:value={displayText}
                            class="w-full border border-gray-300 rounded px-2 py-1.5"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <button
                        on:click={handleCancel}
                        class="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        취소
                    </button>
                    <button
                        on:click={handleSave}
                        class="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
