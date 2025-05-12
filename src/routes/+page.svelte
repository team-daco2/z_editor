<script lang="ts">
	import Editor from "$lib/Editor.svelte";

</script>

<Editor 
	imageUploader={async (files: FileList) => {
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}
		formData.append('convert', 'false');
		formData.append('uploadId', "12345678");
		const res = await fetch('http://localhost:20001/api/images', {
			method: 'POST',
			body: formData,
			headers: {
				'apikey': "86ceaa9c7c187b00687b347e6e15e42ca56ed75c1c1743e93c20fc5852218dc5"
			}
		});
		const data = await res.json();

		return data.map((item: {file: string}) => item.file);
	}}
/>