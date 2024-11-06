// Função para limpar a tela (funciona no navegador)
function limparTela() {
    console.clear();
  }
  
  // Função para exibir o menu de bebidas
  function mostrarMenu() {
    console.log("\nBem-vindo à lanchonete!");
    console.log("Escolha um dos itens abaixo:");
    const itens = {
      "1": { "nome": "Hambúrguer", "preco": 12.50 },
      "2": { "nome": "Cachorro Quente", "preco": 8.00 },
      "3": { "nome": "Batata Frita", "preco": 5.00 },
      "4": { "nome": "Refrigerante", "preco": 4.00 },
      "5": { "nome": "Suco Natural", "preco": 6.00 },
      "6": { "nome": "Pizza pedaço", "preco": 9.00 },
      "7": { "nome": "Sanduíche Natural", "preco": 15.00 },
      "8": { "nome": "Milkshake", "preco": 10.00 },
      "9": { "nome": "Água", "preco": 2.50 },
      "10": { "nome": "Bolo ", "preco": 7.50 },
      "11": { "nome": "Torta", "preco": 5.00 },
      "12": { "nome": "Pão com Linguiça", "preco": 6.50 },
      "13": { "nome": "Pastel", "preco": 8.00 },
      "14": { "nome": "Caldo de Cana", "preco": 5.50 },
      "15": { "nome": "Coxinha", "preco": 4.50 },
      "16": { "nome": "Enroladinho de Vina", "preco": 4.50 },
      "17": { "nome": "Quibe", "preco": 4.50 },
      "18": { "nome": "Risoles", "preco": 4.50 },
      "19": { "nome": "Empadão", "preco": 8.50 },
      "20": { "nome": "Café", "preco": 3.50 },
      "21": { "nome": "Café com leite", "preco": 4.50 },
      "22": { "nome": "Leite", "preco": 2.50 },
      "23": { "nome": "Pão de Queijo", "preco": 4.00 },
      "24": { "nome": "Crepe", "preco": 9.00 },
      "25": { "nome": "Calabresa frita e acebolada", "preco": 15.00 },
      "26": { "nome": "Tapioca", "preco": 7.70 },
      "27": { "nome": "Pudim", "preco": 9.50 },
      "28": { "nome": "Açaí copo de 200ml", "preco": 8.00 }
    };
    for (const key in itens) {
      console.log(`${key}. ${itens[key]['nome']} - R$ ${itens[key]['preco'].toFixed(2)}`);
    }
    return itens;
  }
  
  // Função para salvar usuários (não funciona no navegador)
  function salvarUsuarios(usuarios) {
    // Necessário implementar a lógica de salvar em um arquivo JSON
    // Exemplo usando localStorage (armazenamento no navegador):
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("Usuários salvos com sucesso!");
  }
  
  // Função para carregar usuários (não funciona no navegador)
  function carregarUsuarios() {
    // Necessário implementar a lógica de carregar de um arquivo JSON
    // Exemplo usando localStorage (armazenamento no navegador):
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : {};
  }
  
  // Função para cadastrar novo usuário com senha
  function cadastrarUsuario(usuarios) {
    const username = prompt("Escolha um nome de usuário: ").trim();
    if (username in usuarios) {
      alert("Usuário já existe. Tente outro nome.");
      return null;
    }
    const senha = prompt("Escolha uma senha: ").trim();
    usuarios[username] = { "senha": senha, "saldo": 0.00, "pedidos": [] };
    salvarUsuarios(usuarios);
    alert(`Usuário ${username} cadastrado com sucesso! Seu saldo inicial é de R$ 0,00.`);
    return username;
  }
  
  // Função para login de usuário com verificação de senha
  function loginUsuario(usuarios) {
    const username = prompt("Digite seu nome de usuário: ").trim();
    if (username in usuarios) {
      const senha = prompt("Digite sua senha: ").trim();
      if (usuarios[username]["senha"] === senha) {
        alert(`Login bem-sucedido! Seu saldo atual é de R$ ${usuarios[username]["saldo"].toFixed(2)}`);
        return username;
      } else {
        alert("Senha incorreta. Tente novamente.");
        return null;
      }
    } else {
      alert("Usuário não encontrado. Tente novamente ou cadastre-se.");
      return null;
    }
  }
  
  // Função para realizar um depósito
  function realizarDeposito(usuarios, username) {
    let valor = parseFloat(prompt("Digite o valor a ser depositado: R$ "));
    if (isNaN(valor) || valor <= 0) {
      alert("O valor do depósito deve ser positivo.");
      return;
    }
    usuarios[username]["saldo"] = valor;
    salvarUsuarios(usuarios);
    alert(`Depósito de R$ ${valor.toFixed(2)} realizado com sucesso. Seu saldo atual é R$ ${usuarios[username]["saldo"].toFixed(2)}`);
  }
  
  // Função para processar o pagamento
  function realizarPagamento(totalPedido, saldoUsuario) {
    console.log(`\nTotal do pedido: R$ ${totalPedido.toFixed(2)}`);
    console.log(`Seu saldo atual é R$ ${saldoUsuario.toFixed(2)}`);
  
    while (true) {
      const confirmar = prompt("Deseja confirmar o pagamento? (s/n): ").toLowerCase();
      if (confirmar === "s") {
        if (totalPedido > saldoUsuario) {
          alert("Saldo insuficiente para realizar o pagamento!");
          return false;
        } else {
          alert("Pagamento confirmado!");
          return true;
        }
      } else if (confirmar === "n") {
        alert("Pagamento cancelado.");
        return false;
      } else {
        alert("Opção inválida. Tente novamente.");
      }
    }
  }
  
  // Função para fazer um pedido
  function fazerPedido(usuarios, username) {
    let saldoUsuario = usuarios[username]["saldo"];
    while (true) {
      if (saldoUsuario <= 0) {
        alert("Você não tem saldo suficiente para fazer um pedido.");
        break;
      }
  
      const itens = mostrarMenu();
      const pedido = [];
  
      while (true) {
        const escolha = prompt("\nDigite o número do item que deseja (ou '0' para finalizar o pedido): ");
  
        if (escolha === "0") {
          break;
        } else if (escolha in itens) {
          let qtd = parseInt(prompt(`Quantas unidades de ${itens[escolha]["nome"]}? `));
          if (isNaN(qtd) || qtd <= 0) {
            alert("Quantidade inválida. Tente novamente.");
            continue;
          }
          const totalItem = itens[escolha]["preco"] * qtd;
          const itemEscolhido = {
            "nome": itens[escolha]["nome"],
            "preco_unitario": itens[escolha]["preco"],
            "quantidade": qtd,
            "total": totalItem
          };
          pedido.push(itemEscolhido);
          console.log(`${itens[escolha]["nome"]} adicionado ao pedido. Total parcial: R$ ${totalItem.toFixed(2)}`);
        } else {
          alert("Escolha inválida. Tente novamente.");
        }
      }
  
      if (pedido.length > 0) {
        const totalPedido = pedido.reduce((acc, item) => acc + item["total"], 0);
        if (realizarPagamento(totalPedido, saldoUsuario)) {
          saldoUsuario -= totalPedido;
          salvarPedido(username, pedido, saldoUsuario, usuarios);
          alert("\nPedido finalizado com sucesso!");
  
          // Opção de continuar comprando ou sair do sistema
          const continuar = prompt("\nDeseja continuar comprando? (s/n): ").toLowerCase();
          if (continuar === "s") {
            limparTela();
            continue;
          } else {
            alert("Obrigado por comprar na nossa lanchonete!");
            break;
          }
        } else {
          alert("\nO pedido foi cancelado.");
          break;
        }
      } else {
        alert("\nNenhuma bebida foi selecionada.");
      }
    }
  }
  
  // Função para salvar o pedido em um arquivo JSON e atualizar o saldo e os pedidos do usuário
  function salvarPedido(username, pedido, saldoUsuario, usuarios) {
    const totalPedido = pedido.reduce((acc, item) => acc + item["total"], 0);
    const pedidoCompleto = { "pedido": pedido, "total_pedido": totalPedido };
  
    // Atualiza o saldo do usuário
    usuarios[username]["saldo"] = saldoUsuario;
  
    // Adiciona o novo pedido ao histórico de pedidos do usuário
    usuarios[username]["pedidos"].push(pedidoCompleto);
  
    // Salva os dados atualizados no arquivo de usuários
    salvarUsuarios(usuarios);
  
    alert(`\nO pedido foi salvo com sucesso. Seu saldo agora é R$ ${saldoUsuario.toFixed(2)}`);
  }
  
  // Função principal para gerenciar cadastro, login e pedidos
  function distribuidora() {
    let usuarios = carregarUsuarios();
    let username = null;
  
    while (!username) {
      limparTela();
      console.log("Bem-vindo à lamchonete!");
      console.log("1. Cadastrar novo usuário");
      console.log("2. Fazer login");
      const escolha = prompt("Escolha uma opção: ");
  
      if (escolha === "1") {
        username = cadastrarUsuario(usuarios);
        // Após o cadastro, permite realizar depósito
        realizarDeposito(usuarios, username);
      } else if (escolha === "2") {
        username = loginUsuario(usuarios);
      } else {
        alert("Opção inválida. Tente novamente.");
      }
    }
  
    while (true) {
      limparTela();
      console.log("1. Fazer pedido");
      console.log("2. Realizar depósito");
      console.log("3. Sair");
      const escolha = prompt("Escolha uma opção: ");
  
      if (escolha === "1") {
        fazerPedido(usuarios, username);
      } else if (escolha === "2") {
        realizarDeposito(usuarios, username);
      } else if (escolha === "3") {
        alert("Obrigado por comprar na nossa distribuidora!");
        break;
      } else {
        alert("Opção inválida. Tente novamente.");
      }
    }
  }
  
  // Executa o sistema da distribuidora
  distribuidora();
