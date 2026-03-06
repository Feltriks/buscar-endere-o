const form = document.getElementById('addressForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const logradouro = document.getElementById('logradouro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const uf = document.getElementById('uf').value.trim().toUpperCase();
    
    // Validação básica
    if (logradouro.length < 3 || cidade.length < 3 || uf.length !== 2) {
        resultDiv.innerHTML = '<p class="error">Preencha corretamente: rua e cidade com pelo menos 3 letras, estado com 2 letras (ex: PR, SP).</p>';
        return;
    }
    
    // Montagem da URL da API ViaCEP
    const url = `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`;
    
    resultDiv.innerHTML = '<p>Buscando...</p>';
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Falha na consulta à API');
        }
        
        const data = await response.json();
        resultDiv.innerHTML = '';
        
        if (Array.isArray(data) && data.length === 0) {
            resultDiv.innerHTML = '<p class="error">Nenhum endereço encontrado com esses dados.</p>';
            return;
        }
        
        if (data.erro) {
            resultDiv.innerHTML = '<p class="error">Erro na API ViaCEP</p>';
            return;
        }
        
        // Caso retorne array de resultados
        if (Array.isArray(data)) {
            const ul = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>CEP:</strong> ${item.cep || '—'}<br>
                    <strong>Logradouro:</strong> ${item.logradouro || '—'}<br>
                    <strong>Bairro:</strong> ${item.bairro || '—'}<br>
                    <strong>Cidade:</strong> ${item.localidade || cidade}<br>
                    <strong>Estado:</strong> ${item.uf || uf}
                `;
                ul.appendChild(li);
            });
            resultDiv.appendChild(ul);
        } 
        // Caso retorne objeto único (menos comum nesse endpoint)
        else {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>CEP:</strong> ${data.cep || '—'}<br>
                <strong>Logradouro:</strong> ${data.logradouro || '—'}<br>
                <strong>Bairro:</strong> ${data.bairro || '—'}<br>
                <strong>Cidade:</strong> ${data.localidade || cidade}<br>
                <strong>Estado:</strong> ${data.uf || uf}
            `;
            ul.appendChild(li);
            resultDiv.appendChild(ul);
        }
        
    } catch (error) {
        resultDiv.innerHTML = '<p class="error">Erro ao consultar o CEP. Verifique sua conexão ou tente novamente.</p>';
        console.error(error);
    }
});