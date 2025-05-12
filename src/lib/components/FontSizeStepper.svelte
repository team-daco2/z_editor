<script lang="ts">
    import { 
        Plus,
        Minus
    } from 'lucide-svelte';
	import Tooltip from './toolbar/Tooltip.svelte';

    export let value = "16px";
    export let onChange: (v: number) => void = () => {};
    export let tooltip: string = '';

    let ref: HTMLElement;

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

    let holdInterval: ReturnType<typeof setInterval> | null = null;

    function startHold(action: () => void) {
        action();
        holdInterval = setInterval(action, 100); // 반복 실행
    }

    function stopHold() {
        if (holdInterval) {
            clearInterval(holdInterval);
            holdInterval = null;
        }
    }

    function increment() {
        const newValue = parseInt(value) + 1;
        if (newValue > 50) {
            return;
        }
        value = `${newValue}px`;
        onChange(newValue);
    }

    function decrement() {
        const newValue = parseInt(value) - 1;
        if (newValue >= 0) {
            value = `${newValue}px`;
            onChange(newValue);
        }
    }
</script>

<div class="relative inline-block">
    <div 
        bind:this={ref}
        role="presentation"
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        class="h-[32px] inline-flex items-center rounded-sm border border-gray-200 overflow-hidden text-sm text-gray-800 relative"
    >
        <button
            on:mousedown={() => startHold(decrement)}
            on:mouseup={stopHold}
            on:mouseleave={stopHold}
            on:touchstart={() => startHold(decrement)}
            on:touchend={stopHold}
            class="w-8 h-[32px] flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
            <Minus size="14" />
        </button>

        <div class="relative w-12 h-[32px] flex items-center justify-center">
            <input
                type="text"
                class="w-full h-full text-center outline-none bg-white hover:bg-gray-200"
                bind:value
            />
        </div>

        <button
            on:mousedown={() => startHold(increment)}
            on:mouseup={stopHold}
            on:mouseleave={stopHold}
            on:touchstart={() => startHold(increment)}
            on:touchend={stopHold}
            class="w-8 h-[32px] flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
            <Plus size="14" />
        </button>
    </div>

    {#if tooltip && showTooltip}
        <Tooltip {tooltip} target={ref}/>
    {/if}
</div>
