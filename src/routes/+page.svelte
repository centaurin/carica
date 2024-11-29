<script lang="ts">
	import { enhance } from "$app/forms";

	const { data } = $props();

	const image = `https://avatars.githubusercontent.com/u/${data.user.githubId}`;
</script>

<h1>Hi, {data.user.username}!</h1>
<img src={image} class="h-25 w-25" alt="profile" />
<p>Email: {data.user.email}</p>
<form method="POST" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
