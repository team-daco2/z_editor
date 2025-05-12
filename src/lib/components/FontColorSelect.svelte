<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ChevronDown, Slash } from "lucide-svelte";
    import Baseline from "./customSvg/Baseline.svelte";
	import Tooltip from "./toolbar/Tooltip.svelte";
    export let tooltip: string = '';
    export let selectedColor: string = '#000000';
    export let onColorSelect: (color: string) => void = () => {};

    let showTooltip = false;
    let tooltipTimer: ReturnType<typeof setTimeout>;
    let showPalette = false;
    let ref : HTMLElement;

    const colors: string[] = [
        '#81c784', '#e57373', '#ba68c8', '#64b5f6', '#4db6ac',
        '#f57c00', '#d32f2f', '#8e24aa', '#1976d2', '#eeeeee',
        '#cfd8dc', '#90a4ae', '#607d8b', '#37474f'
    ];

    function handleSelect(color: string) {
        selectedColor = color;
        onColorSelect(color);
        showPalette = false;
    }

    function handleClear() {
        selectedColor = '';
        onColorSelect('');
        showPalette = false;
    }

    function handleMouseEnter() {
        tooltipTimer = setTimeout(() => {
            showTooltip = true;
        }, 250); 
    }

    function handleMouseLeave() {
        clearTimeout(tooltipTimer);
        showTooltip = false;
    }

    let wrapper: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (!wrapper.contains(event.target as Node)) {
            showPalette = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<!-- 전체를 감싸는 div에 bind:this -->
<div 
    bind:this={ref}
    role="presentation"
    class="relative inline-block"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    bind:this={wrapper} 
>
    <div class="flex">
        <!-- Baseline 버튼 -->
        <button
            class="flex items-center justify-center hover:bg-gray-200 transition-colors rounded-l-sm px-1 min-h-[32px]"
        >
            <div class="flex flex-col items-center justify-center">
                <Baseline color="{selectedColor}" />
            </div>
        </button>

        <!-- 드롭다운 버튼 -->
        <button
            on:click={() => showPalette = !showPalette}
            class="flex items-center justify-center hover:bg-gray-200 transition-colors rounded-r-sm min-h-[32px]"
        >
            <ChevronDown class="w-4 h-4 text-gray-500" />
        </button>
    </div>

    {#if showPalette}
        <div class="absolute z-50 mt-1 left-0 w-[138px] p-2 bg-white border border-gray-200 rounded shadow-lg">
            <div class="flex flex-wrap">
                {#each colors as value}
                    <button
                        aria-label="Select color"
                        class="w-6 h-6 transition-all duration-150 hover:ring-2 hover:ring-inset hover:ring-blue-400 {selectedColor === value ? 'ring-inset ring-2 ring-blue-500' : ''}"
                        style="background-color: {value};"
                        on:click={() => handleSelect(value)}
                    >
                    </button>
                {/each}
                <button
                    aria-label="Clear color"
                    class="w-6 h-6 transition-all duration-150 hover:ring-2 hover:ring-inset hover:ring-blue-400"
                    on:click={handleClear}
                >
                    <Slash color="red" />
                </button>
            </div>
        </div>
    {/if}

    {#if tooltip && showTooltip}
        <Tooltip tooltip={tooltip} target={ref} />
    {/if}
</div>
