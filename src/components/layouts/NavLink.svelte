<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  import { clsx } from "$lib/clsx";

  interface NavLinkProps extends Omit<HTMLAnchorAttributes, "class"> {
    href: string;
    isActive?: boolean;
    textCenter?: boolean;
  }

  const { href, isActive = false, textCenter = true, children, ...props }: NavLinkProps = $props();
</script>

<span
  class={clsx(
    "transition-colors flex w-full cursor-pointer flex-row justify-between duration-100 rounded-md",
    isActive ? "bg-[#cececc]/80 dark:bg-[#41413F]/80" : "hover:bg-[#cececc]/80 dark:hover:bg-[#41413F]/80",
  )}
>
  <a
    {href}
    class={clsx(
      "h-full w-full gap-2 break-words px-3 py-2 font-medium text-base md:text-sm",
      textCenter && "text-center",
    )}
    aria-current={isActive}
    {...props}
  >
    {#if children}
      {@render children()}
    {/if}
  </a>
</span>
