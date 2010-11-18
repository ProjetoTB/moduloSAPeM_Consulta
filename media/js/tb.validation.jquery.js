//Custom validation rules

function calculateIMC(peso, altura){
	imc = parseFloat(peso);
	imc = 10000 * (imc/ (parseFloat(altura)*parseFloat(altura)));
	return imc;
}

$.validator.addMethod("warningAge", function(value, element) {
		var retcode = parseInt(value) >= 1 && parseInt(value) <= 95;
		var msg = 'O paciente tem '+ value + ' anos. Estáorreto?';
		retcode = $(element).ConfirmUI(msg, function(element){
			return retcode;
			});
		return retcode;
		}, 'Por favor, confira a data de nascimento');

$.validator.addMethod("warningCT", function(value, element) {
		var age = $("#idade").val();
		var target = 3*(parseInt(age)-10);
		retcode = $(element).ConfirmUI('Tem certeza que a carga tabáca superior é '+ target +' maç/ano?', function(element){
			return $(element).val() <= target;
			});
		return retcode;
		}, 'Por favor, confira a quantidade de cigarros fumados e a quantos anos o paciente fuma.');

$.validator.addMethod("CantSmokeFor70Years", function(value, element) {
		retcode = $(element).ConfirmUI('Tem certeza que o paciente fuma a mais de 70 anos?', function(element){
			return parseInt($(element).val()) <= 70
			});
		return retcode;
		}, 'Por favor, confira a quantos anos o paciente fuma');

$.validator.addMethod("warningNumberOfCigarrettes", function(value, element) {
		retcode = $(element).ConfirmUI('Tem certeza que o paciente fuma mais do que 4 maç (80 cigarros) por dia?', function(element){
			return $(element).val() <= 80;
			});
		return retcode;
		}, 'Por favor, confira a quantos cigarros o paciente fuma por dia');

$.validator.addMethod("validIMC", function(value, element) {
		var weight = $('#pesoAtual').val();
		var height = $('#altura').val();
		retcode = true
		if(weight.length != 0 && height.length != 0){
		var imc = calculateIMC(weight, height);
		retcode = $(element).ConfirmUI('O IMC do paciente esta fora dos padrõ(entre 12 e 40). Estáorreto?', function(element){
			return imc >= 12 && imc <= 40;
			});
		}
		return retcode;
		}, 'Por favor, confira o peso e altura do paciente.');

$.validator.addMethod("warningWeight", function(value, element) {
		retcode = $(element).ConfirmUI('O paciente tem mais do que 150 kg. Estáorreto?', function(element){
			return parseInt($(element).val()) <= 150;
			});
		return retcode;
		}, 'Por favor, confira o peso do paciente');

$.validator.addMethod("warningHeight", function(value, element) {
		retcode = $(element).ConfirmUI('O paciente tem mais do que 200 cm. Estáorreto?', function(element){
			return parseInt($(element).val()) <= 200;
			});
		return retcode;
		}, 'Por favor, confira altura do paciente');

$.validator.addMethod("warningMaritalState", function(value, element) {
		var retcode = true;
		if($('#idade').val() != '' && $('#estado_civil').val() != '----'){
		var idade = parseInt($('#idade').val());
		var mstate = $(element).val();
		if(idade >= 75 && mstate == 'solteiro')
		retcode = false;
		if(idade <= 15 && mstate == 'casado')
		retcode = false;
		if(idade <= 19 && mstate == 'divorciado')
		retcode = false;
		if(idade <= 24 && mstate == 'viuvo')
		retcode = false;
		}

		var msg = 'O estado civil do paciente é ' + $(element).val() + ' e possui '+ $('#idade').val() +' anos. Estáorreto?';
		retcode = $(element).ConfirmUI(msg, function(element){
			return retcode;
			});
		return retcode;
		}, 'Por favor, confira o estado civil do paciente e/ou idade.');

$.validator.addMethod("warningYearsSmoking", function(value, element) {
		var age = $("#idade").val();
		retcode = parseInt($(element).val()) < parseInt(age) - 10;
		var msg ='O paciente começ a fumar com menos de 10 anos. Estáorreto?';
		retcode = $(element).ConfirmUI(msg, function(element){
			return retcode;
			});
		return retcode;
		}, "Por favor confira a idade e a quanto tempo o paciente fuma.");

$.validator.addMethod("warningSymptoms", function(value, element, params) {
		var retcode = true;
		t = $(element).val()
		if(t.search('menos') >= 0) return retcode;
		var n = parseInt(t);
		var n2 = parseInt(params);
		if(t.search('ano') >= 0) n=n*52;
		if(t.search('mes') >= 0) n=n*4;
		if(params[0].search('ano') >= 0 ) n2=n2*52;
		if(params[0].search('mes') >= 0 ) n2=n2*4;
		msg = 'O sintoma ' +$(element).attr('name').substr(5)+ ' possui mais do que ' +n2+ ' semanas.';
		retcode = $(element).ConfirmUI(msg, function(element){
			return n < n2;
			});
		return retcode;
		}, 'Por favor, confira a quantidade de tempo que o paciente apresenta o sintoma.');


$.validator.addMethod("yearsSmokingLowerThanAge", function(value, element) {
		var age = $("#idade").val();
		retcode = parseInt($(element).val()) < parseInt(age);
		if(retcode && !isNaN(parseInt($('#numeroCigarros').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroCigarros').val()) * parseFloat($(element).val()) / 20.
			);
		return retcode;
		}, "Esse campo deve ser menor do que a idade do paciente.");

$.validator.addMethod("numberOfCigarrettes", function(value, element) {
		var retcode = (parseInt($(element).val()) < 140 && parseInt($(element).val()) != 0) ;
		if(retcode && !isNaN(parseInt($('#numeroAnosFumante').val())))
		$('#cargaTabagistica').val(
			parseFloat($('#numeroAnosFumante').val()) * parseFloat($(element).val()) / 20.
			);
		return retcode;
		}, "N&atilde;o éermitido fumar 0 ou mais que 140 cigarros em um dia");

$.validator.addMethod("GreaterThanBirthYear", function(value, element) {
		var age = $("#idade").val();
		var d = new Date()
		var cYear = d.getFullYear();
		var retcode = parseInt($(element).val()) > parseInt(cYear) - parseInt(age);
		return retcode;
		}, "Ano anterior ao nascimento do paciente");

$.validator.addMethod("LowerThanCurrentYear", function(value, element) {
		var age = $("#idade").val();
		var d = new Date()
		var cYear = d.getFullYear();
		var retcode = parseInt($(element).val()) <= parseInt(cYear);
		return retcode;
		}, "Ano maior do que o ano atual.");

$.validator.addMethod("checkCT", function(value, element) {
		var age = $("#idade").val();
		var target = 5*(parseInt(age));
		return parseInt($(element).val()) < target
		}, 'Por favor, confira a quantidade de cigarros fumados e a quantos anos o paciente fuma.');

