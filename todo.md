Lista de atividades pendentes no desenvolvimento

# Planejadas

## Frontend

- Implementar a Tela de loading
- Suporte às listas de dados
- Transformar a planilha em um componente
    A planilha no momento é escrita diretamente sobre o código, o que torna este muito mais extenso do que precisa ser. Uma vez transformada em planilha a leitura do código ficaria mais organizada, sem falar na remoção da chance de não conformidades

## Backend
- Os counters são criados antes do database, solicitar a criação do db antes de iniciar a preenchê-lo, evitando assim a sobrecarga de armazenamento de counters sem conteúdo, ou talvez a criação de counters temporários, talvez cadastrados no ID da pessoa ou no timestamp. Assim que o DB for salvo, converter as informações do counter temporário para o counter permanente, também podemos excluir o counter de timestamp após uma semana ou 24 horas, algo assim.


### Modules Page
### Yard Page
### Team Page
### Missions Page
Essas páginas seguem uma estrutura bem similar:
- Home page:
    - lista dos itens em formato planilha, com algumas informações relevantes a disposição
    - uma lista de botões permitindo a seleção de algumas opções: Criar, editar, ver e deletar
    - Ao selecionar alguma opção que depende de ter um item selecionado, como editar, ver e deletar, uma janela irá abrir para confirmar que o usuário pretende selecionar aquele ID, ele pode pesquisar por outro ID, nome, etc se quiser através dessa janela, o que irá mostrar uma lista menor na janela de itens que correspondem a pesquisa para assim conseguir acessar o formulário correspondente.
- Formulário:
    - Acessado o usuário aperta criar, editar e ver, dependendo do tipo de acesso alguns campos podem não ser editáveis
    - Diversas abas voltadas para o registro e edição de um desses itens que aparece na home

### Science Page
- Apesar de possuir uma estrutura individual bem parecida com a das páginas acima, home page é diferente
- Home Page:
    - Três botões para serem selecionados: Biomas, Astros e Experimentos
    - Uma lista de todas as combinações possíveis de experimentos, sendo os já realizados marcados de alguma forma, seja essa uma checklist, cor, etc, não importa.
- Biomas, Astros e Experimentos Pages: Seguem o padrão das páginas descritas acima

### Documents Page
- Home page:
    - Uma lista de documentos, uma lista de botões, uma janela para seleção..., similar a lista padrão das primeiras páginas
    - Formulário:
        - Mostra todas as versões já enviadas de documentos, eles possuem um nome e a lista de documentos. Não, nenhum documento pode ser deletado, todos eles são armazenados e apenas uma nova versão do mesmo é criada, sendo armazenada junta, marque a última versão de alguma forma

### Database Page
- Home Page:
    - Similar a página de ciência, com os botões para cada banco de dados inferior, são bancos de dados simples, com informações usadas para alimentar os demais bancos de dados, como por exemplo possíveis status de missões, a extrutura restante é o padrão das primeiras páginas.

### Profile Page
- Sem interface planejada ainda, deve ter as infos do perfil e o cargo, nada demais, usuarios é mais um banco de dados

### Home Page
A cara do sistema, apenas a versão, criador, algum link para patreon ou algo do tipo. 

## Backend

### Modules Page
### Yard Page
### Team Page
### Missions Page
### Science Page
### Documents Page
### Database Page
### Profile Page
- Integrar páginas usando orientação objeto