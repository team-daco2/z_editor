<script lang="ts">
    import axios from 'axios';
    let files: FileList | null = null;
  
    async function handleUpload() {
        if (!files || files.length === 0) return;
  
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]); // images는 서버에서 사용하는 필드명
        }
        formData.append('convert', 'false');
        formData.append('uploadId', "12345678");
  
        try {
            const res = await axios.post('http://localhost:20001/api/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'apikey': "86ceaa9c7c187b00687b347e6e15e42ca56ed75c1c1743e93c20fc5852218dc5"
                }
            });
  
            console.log('업로드 결과:', res.data);
        } catch (err) { 
            console.error('업로드 실패:', err);
        }
    }
</script>
  
  <input
    type="file"
    accept="image/*"
    multiple
    on:change={(e: any) => { files = e.target.files}}
  />
  
  <button on:click={handleUpload}>업로드</button>
  