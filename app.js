class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor

	}

	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}

// Recebe um parâmetro(d) que se remete a ação gravar()

class Bd{

	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') //null
		return parseInt(proximoId) + 1
 	}

	gravar(d){
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){

		// Array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		// Recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){

			// Recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			// existe a possibilidade de haver índices que foram pulados/removidos
			// nestes casos nós vamos pular esses índices
			if(despesa === null){
				continue
			}

			despesa.id = i
			despesas.push(despesa)
			
		}

		return despesas
	}

	pesquisar(despesa){
		
		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		
		console.log(despesa)
		console.log(despesasFiltradas)

		//ano
		if(despesa.ano != ''){
			console.log('filtro ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if(despesa.mes != ''){
			console.log('filtro mes')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia 
		if(despesa.dia != ''){
			console.log('filtro dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}	

		//tipo 
		if(despesa.tipo != ''){
			console.log('Filtro de tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log('filtro de descricao')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)

		}


		//valor
		if(despesa.valor != ''){
			console.log('filtro de valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}



		return despesasFiltradas
		
	}

	remover(id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd


// Cadastrando despesa

function cadastrarDespesa (){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	)

	
	if(despesa.validarDados()) {
		bd.gravar(despesa)

		// Configurando o modal - bootstrap

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		desricao.value = ''
		valor.value =''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Campos não preenchidos'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Despesas não foram cadastradas corretamente!'
		document.getElementById('modal_btn').innerHTML = 'voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}

}


function carregaListaDespesas(despesas = Array(), filtro = false){


	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}

	// Selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''


	//percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(function(d){


		// criando a linha (tr)
		let linha = listaDespesas.insertRow()

		// criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		// ajustando o tipo | como o retorno é ===(idêntico) e é uma string 
		// vamos ajustar para trocar pelo valor do tipo para receber o nome e nao um numero

		switch(d.tipo){
			case '1' : d.tipo = 'Alimentação'
				break
			case '2' : d.tipo = 'Despesas fixas'
				break
			case '3' : d.tipo = 'Cartao de Crédito'
				break
			case '4' : d.tipo = 'Lazer'
				break
			case '5' : d.tipo = 'Outros'
				break		
		}		

		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		// Criando Botao de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			//remover a despesa
			let id = this.id.replace('id_despesa_', '')

			bd.remover(id)

			window.location.reload()
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})

}

function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	this.carregaListaDespesas(despesas, true)
}

