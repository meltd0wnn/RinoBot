const { Client, Intents, MessageEmbed } = require("discord.js");
const config = require(process.cwd() + "/config.json");
const input = [];
var pont = 0;
var start = 0;
var currentdate = new Date();
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES] });

const embeddoburro = {
	author: {
		name: "RinoBot e CdA",
		icon_url: "https://cdnb.artstation.com/p/users/avatars/002/682/571/large/a6dbb3f9e8b766b045e4c50ffed055be.jpg?1614174544",
	},
	color: 0x034B7E,
	title: "REGRAS DO JOGO",
	fields: [
		{
			name: "Lê ai na moral",
			value: "Vocês enviam uma imagem REAL com o NOME DO ITEM baseado no TEMA do Rinotuna \n( Exemplos: Pokémon, bebidas, objetos, etc. )\nIrei sortear os nomes dos participantes e o que você receber, você transforma em HUMANO ( ou Furry pra quem curte essas coisas aí😔 )\nO tempo do desafio será dito quando o host da sessão der o **start** no jogo!\n\nBoa sorte e bons desenhos!\n\nOBS: Coloquem a foto de referência/falem o nome do que é pro pessoal comparar \nPodem fazer o desenho no TRADICIONAL, DIGITAL, PINTURA, FAÇAM COMO DER.\nE podem usar REFERÊNCIA PARA POSE, desde que use ainda a imagem que mandaram.",
		}
	],
}

const embedhelp = new MessageEmbed()
	.setTitle("AJUDAS")
	.setURL("https://www.artstation.com/rinotuna")
	.setAuthor("RinoBot", "https://cdnb.artstation.com/p/users/avatars/002/682/571/large/a6dbb3f9e8b766b045e4c50ffed055be.jpg?1614174544", "https://www.artstation.com/rinotuna")
	.setColor(0x00AE86)
	.setDescription("Olá! Sou um bot feito para o #RinotunaChallenge do servidor Comunidade dos Artistas!\n Rinotuna é um artista famoso pelos seus _gijinkas_, dê uma olhada no Artstation: https://www.artstation.com/rinotuna\n\n Você pode usar meus comandos no chat específico do desafio:\n\n **r!help** | Te mostra os comandos no qual eu respondo!\n\n **r!regras** | Assim eu invoco as regras no chat para que os ADMs não tenham que explicar de novo.\n\n **r!rino** _legenda da imagem_ | ENVIE O ANEXO JUNTO COM O COMANDO E A LEGENDA. Esse comando é utilizado para participar do desafio ou atualizar sua participação.\n\n **r!sair** | Retira sua participação do desafio atual.\n\n :arrow_down: PARA ADMS :arrow_down: \n\n**r!lista** | Mostra a lista dos participantes ou a lista dos sorteios (Caso tenha começado o jogo)\n\n**r!start** *OPCIONAL: tempo do desafio* | Faz o embaralhamento das submissões e começa o desafio. (Você só pode começar um novo jogo ao resetar o anterior)\n\n **r!remove** | Retira uma submissão.\n\n **r!reset** | Reseta o jogo.\n\n Espero que se divirtam!")
//.setImage("http://i.imgur.com/yVpymuV.png")

client.on("ready", () => {
	console.log("Rinobot está pronto para sortear!\nPara parar o bot, aperte Ctrl + C ou feche o Terminal!\nPara mais informações do Bot, digite " + config.prefix + "help")
	client.user.setActivity(`RinoChallenge | ${config.prefix}help`);
});

/*client.on("messageCreate", message => {
	console.log(message.content);
});*/
function shuffle(array) {
	let i = array.length;
	while (i--) {
		const ri = Math.floor(Math.random() * i);
		[array[i], array[ri]] = [array[ri], array[i]];
	}

	return array;
}

function startf(msg) {
	console.log(input);
	if (input.length > 1) {
		const array = new Array(input.length).fill().map((_, i) => i)
		while (array.some((v, i) => v === i)) {
			shuffle(array)
		}
		var lista2 = "**Esse foi o que cada um tirou:**\n\n"
		for (let i = 0; i < input.length; i++) {
			//console.log("0");
			lista2 += (i + 1) + " - **" + input[i].ply.username + "** : " + input[array[i]].args + "\n";
			input[i].ply.send("Seu objeto é: \"" + input[array[i]].args + "\"" + "\nE a sua imagem de referência é: " + input[array[i]].url).catch(error => {
				msg.channel.send("Não consigo enviar a mensagem para <@" + input[i].ply + "> então postarei aqui:\n" + "Seu objeto é: \"" + input[array[i]].args + "\"" + "\nE a sua imagem de referência é: " + input[array[i]].url);
			});
			//.then(console.log(input[i]));
		}
		pont = 0;
	}
	else {
		console.log("Não temos players o suficiente, tenha calma...");
		//msg.channel.send("Não temos players o suficiente, tenha calma...");
	}
}

function liste(msg) {
	if (input.length >= 1) {
		let lista = "**Estes são os usuários que estão participando deste Rinotuna, por ordem de entrada:**\n\n";
		for (let i = 0; i < input.length; i++) {
			lista += (i + 1) + " - **" + input[i].ply.username + "** : " + input[i].args + "\n";
		}
		msg.channel.send(lista);
	}
	else {
		msg.reply("Não temos players o suficiente para ter uma lista.");
	}
}



client.on("messageCreate", msg => {
	//console.log(msg.content);
	const prefixo = msg.content.slice(0, 2);
	//console.log(prefixo);
	//if (msg.content == "save") msg.reply("Salvo com sucesso!");
	if (!prefixo.toLowerCase().startsWith(config.prefix)) {
		//console.log("PQ VC N VAI???????");
		return;
	}
	if (!config.canais.some(Id => msg.channelId == Id)) return;

	// const args = msg.content.slice(1).split(' ');
	const ply = msg.author;
	const gostosa = msg.attachments.first();
	const url = gostosa?.url;
	var tempo = 0;
	//if (!gostosa) return;
	var re = new RegExp(`^${prefixo}(\\w+)\\s?(.*)$`)
	const match = msg.content.match(re);
	if (!match) return;
	const cmd = match[1];
	const args = match[2];

	switch (cmd) {
		case 'rino':
			if (start) {
				msg.reply(`O jogo já começou! <a:PadoruCopter:659153472154894358>\nEspere o **${config.prefix}reset** para participar da próxima rodada.`);
			}
			else {
				if (url && args != '') {
					const anterior = input.find(x => x.ply.id == ply.id);
					if (anterior) {
						anterior.args = args;
						anterior.url = url;
						msg.reply("Sua submissão foi atualizada!")
					}
					else {
						input.push({ ply, args: args, url });
						msg.reply("Sua submissão foi aceita!");
					}
				}
				else if (args == '') {
					msg.reply("Você não pode submeter sem uma legenda!");
				}
				else {
					msg.reply("Você esqueceu sua imagem do desafio!");
				}
			}
			break;
		case 'start':
			if (start == 0) {
				if (!msg.member.roles.cache.some(Cargo => config.cargos.some(Id => Cargo.id == Id))) {
					pont++;
					if (pont >= 3) {
						msg.reply("FICA CALMO AI, JÁ QUE O JOGO COMEÇA");
					}
					else {
						msg.reply("Você não pode iniciar o #RinotunaChallenge!");
					}
					return;
				}
				var timere = /^(?:(\d+h))?(?:(\d+m)(?:in)?)?(?:(\d+s)?)?$/;
				const mete = args?.match(timere);
				if (!args) {
					if (input.length > 1) {
						startf(msg);
						msg.channel.send("Caros jogadores do <@&911278575976583198>, o jogo começou! Vocês tem até <t:" + Math.round(currentdate.getTime() / 1000 + 3600) + ":t>");
						start++;
					}
					else {
						msg.channel.send("Não temos players o suficiente, tenha calma...");
					}
				}
				else if (!mete) {
					msg.reply("Seu formato de hora é inválido. Aqui vai alguns exemplos:\n3h | 33m | 33min | 33s | 3h33m");
				}
				else {
					startf(msg);
					if (input.length > 1) {
						var tempo = currentdate.getTime() / 1000;
						for (let i = 1; i < mete.length; i++) {
							if (!mete[i]) continue;
							const p = mete[i].toLowerCase();
							const val = parseInt(p);
							if (p.endsWith('h')) {
								tempo += val * 3600;
							}
							else if (p.endsWith('m') || p.endsWith('min')) {
								tempo += val * 60;
							}
							else if (p.endsWith('s')) {
								tempo += val
							}
						}
						msg.channel.send("Caros jogadores do <@&911278575976583198>, o jogo começou! Vocês tem até <t:" + Math.round(tempo) + ":t>");
						start++;
					}
					else {
						msg.channel.send("Não temos players o suficiente, tenha calma...");
					}
				}
			}
			else {
				msg.channel.send(`O jogo já começou, espere um ADM usar o comando **${config.prefix}reset**.`);
			}
			break;
		case 'remove':
			var arrombado;
			if (!msg.member.roles.cache.some(Cargo => config.cargos.some(Id => Cargo.id == Id))) {
				if (pont >= 5) {
					msg.reply("TÁ DE TIRAÇÃO NÉ IRMÃO, VO TE MOSTRAR O SACO.");
				}
				else {
					msg.reply("Você não pode remover uma entrada do desafio! Caso queira desistir, use **" + config.prefix + "sair**");
					arrombado++;
				}
				return;
			}
			const deletado = msg.mentions.users.first();
			console.log(deletado);
			const ponteiro = input.find(x => x.ply.id == deletado.id);
			console.log(ponteiro);
			if (ponteiro) {
				for (let i = 0; i < input.length; i++) {
					if (input[i] == ponteiro) {
						input.splice(i, 1);
					}
				}
				msg.reply(`A entrada do usuário ${deletado.username} foi deletada por ${msg.author}`);
			}
			else {
				msg.reply(`Desculpe-me ${msg.author}, mas esse usuário não está participando ainda.`);
			}
			arrombado = 0;
			break;
		case 'reset':
			var arrombado2;
			if (!msg.member.roles.cache.some(Cargo => config.cargos.some(Id => Cargo.id == Id))) {
				if (pont >= 5) {
					msg.reply("EU VO PEGAR SEU ENDEREÇO COM A CORUJA DO DUOLINGO.");
				}
				else {
					msg.reply("Você não pode resetar o desafio! <a:PadoruCopter:659153472154894358>\nEspere para que os ADMs resetem!");
					arrombado2++;
				}
				return;
			}
			msg.channel.send(`O desafio atual foi resetado e vocês podem enviar novas submissões!`);
			start = 0;
			input.length = 0;
			arrombado2 = 0;
			pont = 0;
			break;
		case 'lista':
			if (!msg.member.roles.cache.some(Cargo => config.cargos.some(Id => Cargo.id == Id))) return;
			if (start > 0) {
				msg.channel.send(lista2);
			}
			else {
				//msg.channel.send("O jogo ainda não começou, não tenho como enviar uma lista de sorteados!")
				liste(msg);
			}
			break;
		case 'sair':
			const bonitao = msg.author;
			console.log(bonitao + "quer sair do jogo");
			const bonitin = input.find(x => x.ply.id == bonitao.id);
			console.log(bonitin);
			if (bonitin) {
				for (let i = 0; i < input.length; i++) {
					if (input[i] == bonitin) {
						input.splice(i, 1);
					}
				}
				msg.reply(`Você foi removido do desafio atual!`);
			}
			else {
				msg.reply(`Desculpe-me ${msg.author}, mas você não estava participando do desafio atual.`);
			}
			break;
	}
})

client.on("messageCreate", msg => {
	const prefixo = msg.content.slice(0, 2);
	if (!prefixo.toLowerCase().startsWith(config.prefix)) return;
	var reg = new RegExp(`^${prefixo}(\\w+)\\s?(.*)$`)
	const match1 = msg.content.match(reg);
	if (!match1) return;
	const cmd1 = match1[1];
	const args1 = match1[2];
	const burro = msg.mentions.users.first();
	switch (cmd1) {
		case 'help':
			msg.author.send({ embeds: [embedhelp] }).catch(error => {
				msg.channel.send("Infelizmente <@" + msg.author + "> não tem a DM aberta para mim, então não consigo enviar as ajudas para elx.");
			});
			break;
		case 'regras':
			//console.log("0");
			if (!msg.member.roles.cache.some(Cargo => config.cargos.some(Id => Cargo.id == Id))) {
				msg.reply("Você não pode sair enviando regras para os outros! Peça a algum ADM para enviar para a pessoa ou colocá-la no chat.");
				return;
			}
			if (!args1) {
				msg.reply("Você esqueceu de marcar o meliante! Tente novamente.\nCaso queira enviar no chat, digite o argumento _aqui_.");
			}
			else if (args1 == "aqui") {
				msg.channel.send({ embeds: [embeddoburro] });
			}
			else {
				burro.send({ embeds: [embeddoburro] }).catch(error => {
					msg.author.send("Infelizmente <@" + burro + "> não tem a DM aberta para mim, então não consigo enviar as regras para elx. Recomendo que use **" + config.prefix + "regras** para publicar no chat para o usuário.");
				});
			}
			//.then(console.log(input[i]));
			break;
	}
})

client.login(token);
