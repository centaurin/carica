<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form method="POST" action="?/push" enctype="multipart/form-data" use:enhance>
	<input type="file" name="file" multiple />
	<button type="submit">submit</button>
</form>
