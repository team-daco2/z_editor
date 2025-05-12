<script lang="ts">
	import Tooltip from "./toolbar/Tooltip.svelte";

    export let icon: any; // lucide 아이콘
    export let onClick: () => void = () => {};
    export let active: boolean = false;
    export let rounded: boolean = true;
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let tooltip: string = '';
    export let disabled: boolean = false;
    $: iconColor = disabled ? '#a0aec0' : 'currentColor';

    let ref : HTMLElement;

    let showTooltip = false;
    let tooltipTimer: ReturnType<typeof setTimeout>;

    function handleMouseEnter() {
        tooltipTimer = setTimeout(() => {
            showTooltip = true;
        }, 250); 
    }

    function handleMouseLeave() {
        clearTimeout(tooltipTimer);
        showTooltip = false;
    }
</script>

<div
    class="relative inline-block"
    role="presentation"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
>
    <button
        bind:this={ref}
        on:click={onClick}
        disabled={disabled}
        class:active={active}
        class={`flex items-center justify-center transition-colors
            hover:bg-gray-200
            ${rounded ? 'rounded-sm' : ''}
            px-1 min-h-[32px] cursor-pointer
            ${
                size === 'sm'
                    ? 'text-sm'
                    : size === 'lg'
                    ? 'text-xl'
                    : 'text-base'
            }
        `}
    >
        <svelte:component this={icon} color='{iconColor}'/>
    </button>

    {#if tooltip && showTooltip}
        <Tooltip tooltip={tooltip} target={ref} />
    {/if}
</div>
