let candidatos = JSON.parse(localStorage.getItem("candidatos")) || [];

function abrirModal(candidato) {
    if (candidato) {
        document.getElementById("id").value = candidato.id;
        document.getElementById("cpf").value = candidato.cpf;
        document.getElementById("nome").value = candidato.nome;
        document.getElementById("celular").value = candidato.celular;
        document.getElementById("email").value = candidato.email;
        if (candidato.sexo === 'Masculino') {
            document.getElementById("sexoMasculino").checked = true;
        } else {
            document.getElementById("sexoFeminino").checked = true;
        }
        document.getElementById("nascimento").value = candidato.nascimento.split('/').reverse().join('-');
        document.getElementById("skillHtml").checked = candidato.skills.html;
        document.getElementById("skillCss").checked = candidato.skills.css;
        document.getElementById("skillJs").checked = candidato.skills.js;
        document.getElementById("skillBootstrap").checked = candidato.skills.bootstrap;
    }

    $('#candidatoModal').modal('show');
}

function fecharModal() {
    $('#candidatoModal').modal('hide');
    $('body').removeClass('modal-open');
    $('body').removeAttr('style');
    $('.modal-backdrop').remove();

    document.getElementById("id").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("celular").value = "";
    document.getElementById("email").value = "";
    document.getElementById("sexoMasculino").checked = true;
    document.getElementById("nascimento").value = '';
    document.getElementById("skillHtml").checked = false;
    document.getElementById("skillCss").checked = false;
    document.getElementById("skillJs").checked = false;
    document.getElementById("skillBootstrap").checked = false;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function salvar() {
    let id = document.getElementById("id").value;
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let celular = document.getElementById("celular").value;
    let email = document.getElementById("email").value;
    let nascimento = document.getElementById("nascimento").value.split('-').reverse().join('/');
    let sexo = document.getElementById("sexoMasculino").checked;
    let skillHtml = document.getElementById("skillHtml").checked;
    let skillCss = document.getElementById("skillCss").checked;
    let skillJs = document.getElementById("skillJs").checked;
    let skillBootstrap = document.getElementById("skillBootstrap").checked;

    // Validações
    if (!cpf || !validarCPF(cpf) || (id === "" && candidatos.some(c => c.cpf === cpf))) {
        alert("CPF inválido ou já cadastrado.");
        return;
    }

    if (!nome || nome.split(" ").length < 2) {
        alert("Por favor, insira o nome completo (nome e sobrenome).");
        return;
    }

    let dataNascimento = new Date(document.getElementById("nascimento").value);
    let idade = new Date().getFullYear() - dataNascimento.getFullYear();
    let mes = new Date().getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && new Date().getDate() < dataNascimento.getDate())) {
        idade--;
    }
    if (idade < 16) {
        alert("O candidato deve ter no mínimo 16 anos.");
        return;
    }

    if (!(skillHtml || skillCss || skillJs || skillBootstrap)) {
        alert("O candidato deve possuir pelo menos uma habilidade.");
        return;
    }

    if (!celular || !email || !nascimento) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    let candidato = {
        id: id !== '' ? id : new Date().getTime(),
        cpf: cpf,
        nome: nome,
        celular: celular,
        email: email,
        sexo: sexo ? 'Masculino' : 'Feminino',
        nascimento: nascimento,
        skills: {
            html: skillHtml,
            css: skillCss,
            js: skillJs,
            bootstrap: skillBootstrap
        }
    };

    if (id !== '') {
        let checkCandidato = candidatos.find(e => e.id == candidato.id);
        checkCandidato.cpf = candidato.cpf;
        checkCandidato.nome = candidato.nome;
        checkCandidato.celular = candidato.celular;
        checkCandidato.email = candidato.email;
        checkCandidato.sexo = candidato.sexo;
        checkCandidato.nascimento = candidato.nascimento;
        checkCandidato.skills = candidato.skills;
    } else {
        candidatos.push(candidato);
    }

    localStorage.setItem("candidatos", JSON.stringify(candidatos));
    fecharModal();
    listarCandidatos();
}

function listarCandidatos() {
    let tabela = document.getElementById("table-body");
    tabela.innerHTML = '';

    for (let candidato of candidatos) {
        let linha = document.createElement("tr");

        let colunaCpf = document.createElement("td");
        let colunaNome = document.createElement("td");
        let colunaCelular = document.createElement("td");
        let colunaEmail = document.createElement("td");
        let colunaSexo = document.createElement("td");
        let colunaNascimento = document.createElement("td");
        let colunaSkills = document.createElement("td");
        let colunaEditar = document.createElement("td");
        let colunaRemover = document.createElement("td");

        let botaoEditar = document.createElement("button");
        botaoEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        botaoEditar.style.backgroundColor = '#3b91b9b7';
        botaoEditar.style.color = 'white';
        botaoEditar.style.padding = '5px 10px';
        botaoEditar.style.border = '0';
        botaoEditar.style.borderRadius = '7px';
        botaoEditar.onclick = function () {
            abrirModal(candidato);
        }

        let botaoRemover = document.createElement("button");
        botaoRemover.innerHTML = '<i class="fa-solid fa-trash"></i>';
        botaoRemover.style.backgroundColor = '#0E2530';
        botaoRemover.style.color = 'white';
        botaoRemover.style.padding = '5px 10px';
        botaoRemover.style.border = '0';
        botaoRemover.style.borderRadius = '7px';
        botaoRemover.onclick = function () {
            removerCandidato(candidato.id);
        }

        let arrSkills = [];
        if (candidato.skills.html) {
            arrSkills.push('HTML');
        }
        if (candidato.skills.css) {
            arrSkills.push('CSS');
        }
        if (candidato.skills.js) {
            arrSkills.push('JS');
        }
        if (candidato.skills.bootstrap) {
            arrSkills.push('BOOTSTRAP');
        }

        colunaCpf.appendChild(document.createTextNode(candidato.cpf));
        colunaNome.appendChild(document.createTextNode(candidato.nome));
        colunaCelular.appendChild(document.createTextNode(candidato.celular));
        colunaEmail.appendChild(document.createTextNode(candidato.email));
        colunaSexo.appendChild(document.createTextNode(candidato.sexo));
        colunaNascimento.appendChild(document.createTextNode(candidato.nascimento));
        colunaSkills.appendChild(document.createTextNode(arrSkills.join(', ')));
        colunaEditar.appendChild(botaoEditar);
        colunaRemover.appendChild(botaoRemover);

        linha.appendChild(colunaCpf);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaCelular);
        linha.appendChild(colunaEmail);
        linha.appendChild(colunaSexo);
        linha.appendChild(colunaNascimento);
        linha.appendChild(colunaSkills);
        linha.appendChild(colunaEditar);
        linha.appendChild(colunaRemover);

        tabela.appendChild(linha);
    }
}

function removerCandidato(id) {
    candidatos = candidatos.filter(candidato => candidato.id != id);
    localStorage.setItem("candidatos", JSON.stringify(candidatos));
    listarCandidatos();
}

listarCandidatos();

$(document).ready(function () {
    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#candidatos tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});
