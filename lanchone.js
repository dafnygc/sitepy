import json
import os

# Função para limpar a tela
def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

# Classe para Gerenciamento de Itens do Menu
class Menu:
    ITENS = {
        "1": {"nome": "Hambúrguer", "preco": 12.50},
        "2": {"nome": "Cachorro Quente", "preco": 8.00},
        "3": {"nome": "Batata Frita", "preco": 5.00},
        "4": {"nome": "Refrigerante", "preco": 4.00},
        "5": {"nome": "Suco Natural", "preco": 6.00},
        "6": {"nome": "Pizza pedaço", "preco": 9.00},
        "7": {"nome": "Sanduíche Natural", "preco": 15.00},
        "8": {"nome": "Milkshake", "preco": 10.00},
        "9": {"nome": "Água", "preco": 2.50},
        "10": {"nome": "Bolo ", "preco": 7.50},
        "11": {"nome": "Torta", "preco": 5.00},
        "12": {"nome": "Pão com Linguiça", "preco": 6.50},
        "13": {"nome": "Pastel", "preco": 8.00},
        "14": {"nome": "Caldo de Cana", "preco": 5.50},
        "15": {"nome": "Coxinha", "preco": 4.50},
        "16": {"nome": "Enroladinho de Vina", "preco": 4.50},
        "17": {"nome": "Quibe", "preco": 4.50},
        "18": {"nome": "Risoles", "preco": 4.50},
        "19": {"nome": "Empadão", "preco": 8.50},
        "20": {"nome": "Café", "preco": 3.50},
        "21": {"nome": "Café com leite", "preco": 4.50},
        "22": {"nome": "Leite", "preco": 2.50},
        "23": {"nome": "Pão de Queijo", "preco": 4.00},
        "24": {"nome": "Crepe", "preco": 9.00},
        "25": {"nome": "Calabresa frita e acebolada", "preco": 15.00},
        "26": {"nome": "Tapioca", "preco": 7.70},
        "27": {"nome": "Pudim", "preco": 9.50},
        "28": {"nome": "Açaí copo de 200ml", "preco": 8.00}
    }

    @classmethod
    def mostrar_menu(cls):
        print("\nBem-vindo à lanchonete!")
        print("Escolha um dos itens abaixo:")
        for key, item in cls.ITENS.items():
            print(f"{key}. {item['nome']} - R$ {item['preco']:.2f}")


# Classe para Usuários
class Usuario:
    def __init__(self, username, senha):
        self.username = username
        self.senha = senha
        self.saldo = 0.00
        self.pedidos = []

    def adicionar_saldo(self, valor):
        if valor > 0:
            self.saldo += valor
            print(f"Depósito de R$ {valor:.2f} realizado com sucesso! Saldo atual: R$ {self.saldo:.2f}")
        else:
            print("Valor inválido para depósito.")


# Classe para Gerenciamento de Pedidos
class Pedido:
    def __init__(self):
        self.itens = []

    def adicionar_item(self, codigo, quantidade):
        if codigo in Menu.ITENS:
            item = Menu.ITENS[codigo]
            total_item = item['preco'] * quantidade
            self.itens.append({
                "nome": item["nome"],
                "preco_unitario": item["preco"],
                "quantidade": quantidade,
                "total": total_item
            })
            print(f"{item['nome']} adicionado ao pedido com total parcial: R$ {total_item:.2f}")
        else:
            print("Código do item inválido.")

    def calcular_total(self):
        return sum(item['total'] for item in self.itens)

    def mostrar_itens(self):
        for item in self.itens:
            print(f"{item['nome']} x {item['quantidade']} - R$ {item['total']:.2f}")


# Classe para Gerenciar Usuários e Pedidos
class Lanchonete:
    def __init__(self):
        self.usuarios = self.carregar_usuarios()
        self.usuario_atual = None

    def carregar_usuarios(self):
        try:
            with open('usuarios.json', 'r') as file:
                data = json.load(file)
                return {u: Usuario(u, info['senha']) for u, info in data.items()}
        except FileNotFoundError:
            return {}

    def salvar_usuarios(self):
        data = {
            u: {"senha": user.senha, "saldo": user.saldo, "pedidos": user.pedidos} for u, user in self.usuarios.items()
        }
        with open('usuarios.json', 'w') as file:
            json.dump(data, file, indent=4)

    def cadastrar_usuario(self):
        username = input("Escolha um nome de usuário: ").strip()
        if username in self.usuarios:
            print("Usuário já existe. Tente outro nome.")
            return
        senha = input("Escolha uma senha: ").strip()
        novo_usuario = Usuario(username, senha)
        self.usuarios[username] = novo_usuario
        self.salvar_usuarios()
        print(f"Usuário {username} cadastrado com sucesso!")

    def login_usuario(self):
        username = input("Digite seu nome de usuário: ").strip()
        if username in self.usuarios:
            senha = input("Digite sua senha: ").strip()
            if self.usuarios[username].senha == senha:
                self.usuario_atual = self.usuarios[username]
                print(f"Login bem-sucedido! Saldo atual: R$ {self.usuario_atual.saldo:.2f}")
            else:
                print("Senha incorreta.")
        else:
            print("Usuário não encontrado.")

    def realizar_deposito(self):
        if self.usuario_atual:
            try:
                valor = float(input("Digite o valor a ser depositado: R$ "))
                self.usuario_atual.adicionar_saldo(valor)
                self.salvar_usuarios()
            except ValueError:
                print("Valor inválido.")
        else:
            print("Nenhum usuário logado.")

    def fazer_pedido(self):
        if self.usuario_atual:
            pedido = Pedido()
            while True:
                Menu.mostrar_menu()
                escolha = input("\nDigite o número do item que deseja (ou '0' para finalizar o pedido): ")
                if escolha == '0':
                    break
                try:
                    qtd = int(input(f"Quantas unidades? "))
                    pedido.adicionar_item(escolha, qtd)
                except ValueError:
                    print("Quantidade inválida.")

            if pedido.itens:
                total_pedido = pedido.calcular_total()
                print(f"\nTotal do pedido: R$ {total_pedido:.2f}")
                if self.processar_pagamento(total_pedido):
                    self.usuario_atual.saldo -= total_pedido
                    self.usuario_atual.pedidos.append({
                        "itens": pedido.itens,
                        "total": total_pedido
                    })
                    self.salvar_usuarios()
                    print("Pedido realizado com sucesso!")
            else:
                print("Nenhum item foi selecionado.")

    def processar_pagamento(self, total):
        if self.usuario_atual.saldo >= total:
            return True
        else:
            print("Saldo insuficiente.")
            return False

    def iniciar(self):
        while True:
            limpar_tela()
            print("1. Cadastrar novo usuário")
            print("2. Fazer login")
            escolha = input("Escolha uma opção: ")
            if escolha == '1':
                self.cadastrar_usuario()
            elif escolha == '2':
                self.login_usuario()
                break

        while True:
            limpar_tela()
            print("1. Fazer pedido")
            print("2. Realizar depósito")
            print("3. Sair")
            escolha = input("Escolha uma opção: ")

            if escolha == '1':
                self.fazer_pedido()
            elif escolha == '2':
                self.realizar_deposito()
            elif escolha == '3':
                print("Obrigado por comprar na lanchonete!")
                break


# Executa o sistema da lanchonete
lanchonete = Lanchonete
