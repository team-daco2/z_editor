<script lang="ts">
    import { onMount } from 'svelte';
    import { Check, ChevronDown } from 'lucide-svelte';
	import Tooltip from './toolbar/Tooltip.svelte';

    export let options: { label: string; value: string; icon: any }[] = [];
    export let selected: string = '';
    export let onChange: (value: string) => void = () => {};
    export let tooltip: string = '';

    let ref: HTMLElement;

    let showTooltip = false;
    let tooltipTimer: ReturnType<typeof setTimeout>;

    let open = false;

    function toggleDropdown() {
        open = !open;
    }

    function handleSelect(value: string) {
        onChange(value);
        open = false;
    }


    function handleClickOutside(e: MouseEvent) {
        if (!(e.target as HTMLElement)?.closest('.custom-select')) {
            open = false;
        }
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

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });
</script>

<div
    bind:this={ref}
    class="relative inline-block w-40 custom-select select-none text-sm"
    role="presentation"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}    
>
    <button
        type="button"
        class="w-full px-3 min-h-[32px] bg-white border border-gray-200 rounded text-left 
            flex items-center justify-between hover:bg-gray-50 hover:border-gray-400 transition-colors"
        on:click={toggleDropdown}
    >
        <div class="flex items-center gap-2">
            {#each options as opt}
                {#if opt.value === selected}
                    {#if opt.icon}
                        <svelte:component this={opt.icon} class="w-4 h-4 text-gray-700" />
                    {/if}
                    <span class="text-gray-800">{opt.label}</span>
                {/if}
            {/each}
        </div>
        <ChevronDown class="w-4 h-4 text-gray-400" />
    </button>

    {#if open}
        <div class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
            {#each options as opt}
                <div
                    role="presentation"
                    class={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors
                        ${selected === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 hover:text-blue-700'}
                    `}
                    on:click={() => handleSelect(opt.value)}
                >
                    <div class="flex items-center gap-2">
                        {#if opt.icon}
                            <svelte:component this={opt.icon} class="w-4 h-4" />
                        {/if}
                        <span>{opt.label}</span>
                    </div>
            
                    {#if selected === opt.value}
                        <Check class="w-4 h-4" />
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    {#if tooltip && showTooltip}
        <Tooltip tooltip={tooltip} target={ref} />
    {/if}
</div>
