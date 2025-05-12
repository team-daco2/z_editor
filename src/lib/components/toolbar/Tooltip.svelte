<script lang="ts">
    import { onMount, tick } from 'svelte';
    export let tooltip = '';
    export let target: HTMLElement;

    let tooltipEl: HTMLElement;

    async function adjust() {
        await tick(); // DOM 완전히 렌더링될 때까지 기다림

        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const margin = 8;

        let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

        // 좌우 화면 이탈 감지
        if (left < margin) {
            left = margin;
        } else if (left + tooltipRect.width > vw - margin) {
            left = vw - tooltipRect.width - margin;
        }

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${targetRect.bottom + 6}px`;
    }

    onMount(() => {
        adjust();
        window.addEventListener('resize', adjust);
        return () => window.removeEventListener('resize', adjust);
    });
</script>

<style>
    .tooltip {
        position: fixed;
        z-index: 9999;
        padding: 4px 8px;
        background-color: black;
        color: white;
        font-size: 12px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        pointer-events: none;
    }
</style>

<div bind:this={tooltipEl} class="tooltip">
    {tooltip}
</div>
