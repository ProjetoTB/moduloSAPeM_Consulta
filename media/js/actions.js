/**
 * Actions.js
 *
 * Author: Fernando.Ferreira@icsystems.com.br
 * Date:   March 15th, 2010
 *
 **/

//global functions
(function($){
	$.fn.writePortugueseDate = function(){
		var element = $(this[0]);
		var mydate=new Date();
		var year=mydate.getYear();
		if (year<2000)
		year += (year < 1900) ? 1900 : 0
		var day=mydate.getDay()
		var month=mydate.getMonth()
		var daym=mydate.getDate()
		if (daym<10)
		daym="0"+daym
		var dayarray=new Array(
			"Domingo",
			"Segunda-feira",
			"Terça-feira",
			"Quarta-feira",
			"Quinta-feira",
			"Sexta-feira",
			"Sábado"
		);
		var montharray=new Array(
			"de Janeiro de ",
			"de Fevereiro de ",
			"de Março de ",
			"de Abril de ",
			"de Maio de ",
			"de Junho de",
			"de Julho de ",
			"de Agosto de ",
			"de Setembro de ",
			"de Outubro de ",
			"de Novembro de ",
			"de Dezembro de "
		);
		var msg = dayarray[day]+", "+daym+" "+montharray[month]+year;
		element.val(msg);
	};
})(jQuery);

function getScrollXY() {
	var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		return [ myWidth, myHeight ];
}

if(typeof(String.prototype.trim) === "undefined")
{
	String.prototype.trim = function()
	{
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}

var not_tested = new Array();
not_tested[0]  = new Array();
not_tested[0]  = ['R', 'H','E', 'S', 'Z', 'Et', 'O', 'L', 'T', 'M'].sort();

var sensivel  = new Array();
var resistent = new Array();

(function($) {
/* jQuery object extension methods */
	$.fn.extend({
		appendText: function(e) {
			if ( typeof e == "string" )
				return this.append( document.createTextNode( e ) );
			return this;
		}
	});
})(jQuery);



//Document is ready, let's play
$(document).ready(function(){
	//Relation between forms
	//Diagnóstico - Consulta e FollowUp
	var urlString = $(location).attr('href');
	var urlArray = urlString.split('/');
	var indexToRunUrlString = 0; 
	var urlbase = '';
	for (indexToRunUrlString in urlArray)
		if (urlArray[indexToRunUrlString] == 'sapem')
			var indexToRecord = indexToRunUrlString;
	for (indexToRunUrlString in urlArray.slice(0,parseInt(indexToRecord,10) + 1))
		if (indexToRunUrlString == 0)
			urlbase += urlArray[indexToRunUrlString];
		else
			urlbase += '/' + urlArray[indexToRunUrlString];
	urlbase += '/';
	if (urlString.search("edit") != -1){
		var fichaId = urlArray[urlArray.length-2];
		var url = urlbase + 'ficha/' + fichaId + '/';
	}else{
		var numPaciente = urlArray[urlArray.length-2];
		var numForm = urlArray[urlArray.length-3] - 1;
		var url = urlbase + 'patientLastRegister/' + numForm + '/' + numPaciente + '/';
	}
	$.ajax({
		type: 'POST',
		url: url,
		dataType: "html",
		success: function(text){
			if (window.DOMParser)
			{
				parser=new DOMParser();
				xml=parser.parseFromString(text,"text/xml");
			}else{ // Internet Explorer
				xml=new ActiveXObject("Microsoft.XMLDOM");
				xml.async="false";
				xml.loadXML(text);
			}
			if (xml.getElementsByTagName('error')[0] == undefined){
				var elements = xml.getElementsByTagName('documento')[0].childNodes;
				if (urlString.search("edit") != -1){
				//Edit
					var elements = xml.getElementsByTagName('documento')[0].childNodes;
					$(elements).each(function(){
							var el = $(this).get(0);
							if($(el)[0].nodeType == xml.ELEMENT_NODE){
							var tagname = $(el)[0].tagName;
							idDiv = $('#'+tagname).parent().attr('id');
							//console.log(tagname + ' : ' + $(el).text());
							var hlcolor = '#FFF8C6';
							//Checkbox
							if (tagname == 'data_rx'){
								$('#rxRealizado').val('sim');
								$('#rxRealizado').change();
							}
							if (tagname == 'comorbidades')
							{
								$('input[name=comorbidades]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
										$(this).change();
									});
								if ($(el).text().search('nao') != -1)
								{
								$('input[name=comorbidades]').each(function(){
									if ($(this).val() != 'nao')
									$(this).attr('disabled',true);
									});
								}
							}
							if (tagname == 'comorbidadesOutros')
							{
								$('input[name=comorbidadesOutros]').removeAttr('disabled');
								$('input[name=comorbidadesOutros]').val($(this).text());
							}
							if (tagname == 'tratamentoPrescritoTBFarmacos')
							{
								$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
										if ($(el).text().localeCompare($(this).val()) == 0){
											$(this).attr('checked',true);
										}
									});
							}
							if (tagname == 'farmacosOutros')
							{
								$('#'+tagname).removeAttr('disabled');
								$('#'+tagname).val($(el).text());
								$('#tratamentoPrescritoTBFarmacos_13').attr('checked',true);
							}
							$('#'+tagname).val($(el).text());
							$('#'+tagname).change();
						}
					});
				}else{
				//Relation
					var elements = xml.getElementsByTagName('documento')[0].childNodes;
					$(elements).each(function(){
						var el = $(this).get(0);
						if($(el)[0].nodeType == xml.ELEMENT_NODE){
						var tagname = $(el)[0].tagName;
						idDiv = $('#'+tagname).parent().attr('id');
						//console.log(tagname + ' : ' + $(el).text());
						var hlcolor = '#FFF8C6';
						if (tagname == 'diagnostico')
						$('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTB')
						{
							if ($(el).text() == '')
								$('#' + tagname).val('ignorado');
							else
								$('#' + tagname).val($(el).text());
						}
						if (tagname == 'observacoes')
							$('#' + tagname).val($(el).text());
						if (tagname == 'data_inicio')
							$('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTBFarmacos')
						{
							$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
									$(this).attr('checked',true);
									});
						}
						if (tagname == 'farmacosOutros')
						{
							$('#tratamentoPrescritoTBFarmacos_13').attr('checked',true);
							$('#'+tagname).removeAttr('disabled');
							$('#' + tagname).val($(el).text());
						}
						$('#' + tagname).change();
						}
					});
				}
			}
		}
	});

	//$('#dataConsulta').writePortugueseDate();

	$.fn.showFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
				$(this).addClass('required');
				});
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
						});
		}
	}

	$.fn.hideFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).removeClass('required');
			});
			if($(dep[div]).css('display') != 'none')
				$(dep[div]).toggle();
		}
	}

	$.fn.showNotRequiredFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).removeAttr('disabled',false);
				});
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
					$(this).css('background-color', hlcolor);
					$(this).animate({backgroundColor : "white"}, 4000);
					});
		}
	}

	$('#form_consulta').keypress(function(e){
		if(e.which == 13)
			return false;
	});

	//Controle de caracteres estranhos
	$('.number').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57))
			return false;
	});

	var hlcolor = '#FFF8C6';
	var d = new Date();
	var cYear = d.getFullYear();


	//Checking aids exam date
	years = new Array();
	for (i=cYear-100; i <=cYear; i++)
			years.push(i.toString());


	$('#data_rx').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});

	$('#dataConsulta').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});	
	
	$('#rxRealizado').change(function(){
		var secFieldsReq = new Array;
		secFieldsReq[0] = '#divCavitacao';
		secFieldsReq[1] = '#divPadrao';
		secFieldsReq[2] = '#divFrasesAjuda';
		secFieldsReq[3] = '#divProbabilidadeTBAtivaAposEstudoRX';
		secFieldsReq[4] = '#divProbabilidadeTBClinicoRadiologica';

		var secFieldsNotReq = new Array();
		secFieldsNotReq[0] = '#divDataRX';

		if ($(this).val() == 'sim'){
			$().showFields(secFieldsReq);
			$().showNotRequiredFields(secFieldsNotReq);
		}
		else{
			$().hideFields(secFieldsReq);
			$().hideFields(secFieldsNotReq);
		}
	});
	
	$('#padrao').change(function(){
		var baixa = new Array();
		baixa[0] = '#divCasobaixaprobabilidade';

		//Definindo a probabilidade
		if ($(this).val() == 'padraoAtipico'){
			$('#probabilidadeTBAtivaAposEstudoRX').val('Baixa');
			$().showNotRequiredFields(baixa);
		}
		else{
			$().hideFields(baixa);
			$('#probabilidadeTBAtivaAposEstudoRX').val('');

			if ($(this).val() == 'padraoTipico')
				$('#probabilidadeTBAtivaAposEstudoRX').val('Alta');
			
			if ($(this).val() == 'padraoCompativel')
				$('#probabilidadeTBAtivaAposEstudoRX').val('Média')
		}
	});
	$('#data_inicio').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});

	//Foi prescrito TB?
	$('#tratamentoPrescritoTB').change(function(){
		var dep = new Array();
		dep[0] = '#divDataInicio';
		dep[1] = '#divTratamentoPrescritoTBFarmaco';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$().showFields(dep);
		}
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao'){
			$().hideFields(dep);
		}
	});
	$('#tratamentoPrescritoTBFarmacos_13').click(function(){
		if($(this).is(':checked'))
			$('input[name=farmacosOutros]').removeAttr('disabled');
		else{
			$('input[name=farmacosOutros]').val('');
			$('input[name=farmacosOutros]').attr('disabled', 'true');
		}
	});

	$('#comorbidades_outros').click(function(){
		if($(this).is(':checked')){
			$('input[name=comorbidadesOutros]').removeAttr('disabled');
			$('input[name=comorbidadesOutros]').addClass('required');
		}else{
			$('input[name=comorbidadesOutros]').val('');
			$('input[name=comorbidadesOutros]').attr('disabled', 'true');
			$('input[name=comorbidadesOutros]').removeClass('required');
		}
	});

	$('#nenhuma_comorbidade').click(function(){
		if($(this).is(':checked')){
			//Uncheck and disabled the checkboxes
			$('input[name=comorbidades]').each(function(){
				if ($(this).val() != 'nao')
				{
					$(this).removeAttr('checked');
					$(this).attr('disabled',true);
				}
			});
			//Clear the text field
			$('#comorbidadesOutros').attr('disabled',true);
			$('#comorbidadesOutros').val('');
		}else{
			$('input[name=comorbidades]').each(function(){
				$(this).removeAttr('disabled');
			});
		}
	});

	$('div.secondary').css('display', 'none');

	$('#form_consulta').validate({
		rules: {
			rxRealizado:{
				required: true
			},
			probabilidadeTBAtivaAposEstudo:{
				number: true,
				max: 100
			},
			probabilidadeTBClinicoRadiologica: {
				number: true,
				max: 100
			},
			diagnostico: {
				required: true
			},
			data_ultimo_tratamento:{
				min: 1910,
				minlength: 4,
				maxlength: 4
			},
			diagnostico: {
				required: true
			}
		}
	});

});
