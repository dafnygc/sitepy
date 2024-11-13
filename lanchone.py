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
        # Outros itens
    }

    @classmethod
    def mostrar_menu(cls):
        print("\nBem-vindo à lanchonete!")
        print("Escolha um dos itens abaixo:")
        for key, item in cls.ITENS.items():
            print(f"{key}. {item['nome']} - R$ {item['preco']:.2f}")

    @classmethod
    def cadastrar_produto(cls):
        nome = input("Digite o nome do novo produto: ").strip()
        try:
            preco = float(input("Digite o preço do produto: R$ "))
            novo_codigo = str(len(cls.ITENS) + 1)
            cls.ITENS[novo_codigo] = {"nome": nome, "preco": preco}
            print(f"Produto '{nome}' cadastrado com sucesso!")
        except ValueError:
            print("Preço inválido. Cadastro cancelado.")


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


# Classe para Pagamentos com diferentes métodos
class Pagamento:
    @staticmethod
    def processar_pagamento(total, usuario):
        print("\nFormas de pagamento disponíveis:")
        print("1. Saldo em conta")
        print("2. Cartão de Crédito")
        print("3. Dinheiro")
        escolha = input("Escolha uma forma de pagamento: ")

        if escolha == '1':
            if usuario.saldo >= total:
                usuario.saldo -= total
                print(f"Pagamento de R$ {total:.2f} realizado com sucesso usando saldo em conta!")
                return True
            else:
                print("Saldo insuficiente.")
                return False
        elif escolha == '2':
            # Simulação de pagamento com cartão de crédito
            numero_cartao = input("Digite o número do cartão: ")
            validade = input("Digite a validade do cartão (MM/AA): ")
            cvv = input("Digite o CVV do cartão: ")
            print(f"Pagamento de R$ {total:.2f} realizado com sucesso no cartão de crédito!")
            return True
        elif escolha == '3':
            valor_recebido = float(input("Digite o valor em dinheiro recebido: R$ "))
            if valor_recebido >= total:
                troco = valor_recebido - total
                print(f"Pagamento em dinheiro realizado com sucesso! Troco: R$ {troco:.2f}")
                return True
            else:
                print("Valor insuficiente. Pagamento cancelado.")
                return False
        else:
            print("Forma de pagamento inválida.")
            return False


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
                if Pagamento.processar_pagamento(total_pedido, self.usuario_atual):
                    self.usuario_atual.pedidos.append({
                        "itens": pedido.itens,
                        "total": total_pedido
                    })
                    self.salvar_usuarios()
                    print("Pedido realizado com sucesso!")
            else:
                print("Nenhum item foi selecionado.")

    def iniciar(self):
        while True:
            limpar_tela()
            print("1. Cadastrar novo usuário")
            print("2. Fazer login")
            print("3. Cadastrar produto")
            escolha = input("Escolha uma opção: ")
            if escolha == '1':
                self.cadastrar_usuario()
            elif escolha == '2':
                self.login_usuario()
                break
            elif escolha == '3':
                Menu.cadastrar_produto()
            else:
                print("Opção inválida.")

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
lanchonete = Lanchonete()
lanchonete.iniciar()
