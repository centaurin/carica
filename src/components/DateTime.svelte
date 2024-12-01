<script lang="ts" module>
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);
</script>
<script lang="ts">

	interface DateTimeProps {
		date: Date;
	}

	const { date }: DateTimeProps = $props();

  const day = $derived(dayjs(date));
</script>

<time datetime={day.format("YYYY-MM-DD HH:MM:ss")}>
  {day.fromNow()}
</time>
