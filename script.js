const API_KEY = '49432348-83c67e3c60fcb4834fe3e443e'; // Substitua pela sua chave da API do Pixabay
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const searchTerm = document.getElementById('searchInput').value;
    const imageGallery = document.getElementById('imageGallery');
    
    // Limpa a galeria de imagens
    imageGallery.innerHTML = 'Carregando...';

    try {
        // Faz a requisição à API do Pixabay
        const response = await fetch(API_URL + encodeURIComponent(searchTerm));
        
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data); // Log da resposta

        // Exibe as imagens na galeria
        if (data.hits && data.hits.length > 0) {
            imageGallery.innerHTML = '';
            data.hits.forEach(photo => {
                // Cria um container para cada imagem
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';

                // Cria a imagem
                const imgElement = document.createElement('img');
                imgElement.src = photo.webformatURL; // Usa a versão pequena da imagem
                imgElement.alt = photo.tags || 'Imagem sem descrição';

                // Cria o botão de download
                const downloadButton = document.createElement('button');
                downloadButton.className = 'download-button';
                downloadButton.innerHTML = '<i class="fas fa-download"></i> Baixar'; // Ícone + texto
                downloadButton.addEventListener('click', () => {
                    downloadImage(photo.largeImageURL, `imagem_${photo.id}.jpg`);
                });

                // Adiciona a imagem e o botão ao container
                imageContainer.appendChild(imgElement);
                imageContainer.appendChild(downloadButton);

                // Adiciona o container à galeria
                imageGallery.appendChild(imageContainer);
            });
        } else {
            imageGallery.innerHTML = '<p>Nenhuma imagem encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        imageGallery.innerHTML = `<p>Erro ao buscar imagens: ${error.message}</p>`;
    }
});

// Função para baixar a imagem
function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href); // Libera o objeto URL da memória
        })
        .catch(error => console.error('Erro ao baixar a imagem:', error));
}