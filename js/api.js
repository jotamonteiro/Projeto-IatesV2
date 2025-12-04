function obterMensagens() {

    var retorno = [];

    var consulta = $.ajax({
        url: 'https://app-p2-js-c88e9128234a.herokuapp.com/mensagens',
        method: 'GET',
        dataType: 'json',
        async: false
    }).fail(function () {
        return retorno;
    });

    consulta.done(function (data) {
        retorno = data;
    });

    return retorno;
}

function carregarMensagens() {
    let arraymsgLocal = JSON.parse(localStorage.getItem('arraymsg')) || [];

    if (arraymsgLocal.length === 0) {
        let arraymsg = obterMensagens();
        arraymsg = arraymsg.map(msg => ({ ...msg, lida: false }));
        localStorage.setItem('arraymsg', JSON.stringify(arraymsg));
        adicionarNaTabela(arraymsg);
    } else {
        adicionarNaTabela(arraymsgLocal);
    }

    console.log("Mensagens carregadas do localStorage");
}

function adicionarNaTabela(arraymsg) {
    let corpoTabela = document.getElementById("corpotabela")

    corpoTabela.innerText = "";
    

    for (let i = 0; i < arraymsg.length; i++) {

        var mensagem = arraymsg[i]

        let linha = document.createElement("tr")

        if (mensagem.lida) {
            linha.className = "lida";
        } else {
            linha.className = "nao-lida";
        }


        let celulaNome = document.createElement("td")
        celulaNome.innerText = mensagem.nome || '-';


        let celulaEmail = document.createElement("td")
        celulaEmail.innerText = mensagem.email || '-';

        let celulaMSG = document.createElement("td")
        celulaMSG.innerText = mensagem.mensagem || '-'

        let celulaAction = document.createElement("td")
        celulaAction.innerText = "APAGAR"
        celulaAction.className = "clickable"
        celulaAction.addEventListener("click", function (){
            apagarCelula(i)
        })

        let celulaVisualizar = document.createElement("td")
        celulaVisualizar.innerText = "VISUALIZAR"
        celulaVisualizar.className = "clickable"
        celulaVisualizar.addEventListener("click", function() {
            marcarLida(i)
        })
       


        linha.appendChild(celulaNome)
        linha.appendChild(celulaEmail)
        linha.appendChild(celulaMSG)
        linha.appendChild(celulaAction)
        linha.appendChild(celulaVisualizar)

        corpoTabela.appendChild(linha)


    }


}

    
function marcarLida(i) {
    let arraymsg = JSON.parse(localStorage.getItem("arraymsg")) || [];

    if (i >= 0 && i < arraymsg.length) {
        arraymsg[i].lida = true; 
        localStorage.setItem("arraymsg", JSON.stringify(arraymsg));

        adicionarNaTabela(arraymsg);
    }
}


function apagarCelula(i) {
    const r = confirm("Você Realmente Quer Apagar?")

    if (r) {
        let arraymsg = JSON.parse(localStorage.getItem('arraymsg')) || [];

        if (i >= 0 && i < arraymsg.length) {
            let mensagemApagada = arraymsg.splice(i, 1);

            localStorage.setItem('arraymsg', JSON.stringify(arraymsg));

            adicionarNaTabela(arraymsg);

            alert("Mensagem apagada com sucesso!");
            console.log("Mensagem apagada:", mensagemApagada);
        }
    }

}


function atualizarMensagens() {
    let novasMensagens = obterMensagens();
    let arraymsgLocal = JSON.parse(localStorage.getItem('arraymsg')) || [];


    novasMensagens = novasMensagens.map(novaMensagem => {
        let mensagemLocal = arraymsgLocal.find(msg => msg.id === novaMensagem.id);
        
        if (mensagemLocal) {
            return { ...novaMensagem, lida: mensagemLocal.lida };
        } else {
            return { ...novaMensagem, lida: false };
        }
    });

    localStorage.setItem('arraymsg', JSON.stringify(novasMensagens));
    adicionarNaTabela(novasMensagens);
    alert('Mensagens atualizadas!');
}

window.onload = function () {
    carregarMensagens();
};

function enviarFormulario() {
    var mensagem = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        mensagem: document.getElementById("msg").value
    };

    console.log("dados capturados:", mensagem)

    inserirMensagem(mensagem);
}

function inserirMensagem(mensagem) {

    var inserir = $.ajax({

        url: 'https://app-p2-js-c88e9128234a.herokuapp.com/mensagens',
        method: 'POST',
        data: JSON.stringify(mensagem),
        dataType: 'json',
        async: false,
        contentType: 'application/json',
    });
}

function fazerLogin() {
    var objLoginSenha = {
        email: document.getElementById("user").value,
        senha: document.getElementById("password").value
    }

    let resultado = validarUsuario(objLoginSenha)

    if (resultado) {
        console.log("Login realizado com Sucesso!!")
        window.location.href = "mensagens.html"
    } else {
        console.log("Error ao fazer Login!")

    }
}

function validarUsuario(objLoginSenha) {

    //email: admin@admin.com
    //senha: '1234'

    /*

    var objLoginSenha = {
            email: "email informado", 
            senha: "senha informada"} 

    */

    var retorno = false;

    var validacao = $.ajax({
        url: 'https://app-p2-js-c88e9128234a.herokuapp.com/usuarios/validar',
        method: 'POST',
        dataType: 'json',
        async: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        contentType: 'application/json',
        data: JSON.stringify(objLoginSenha)
    }).fail(function () {
        return retorno;
    });

    validacao.done(function (data) {
        retorno = data;
    });

    return retorno;
}
