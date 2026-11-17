(function(){
var ENDPOINT = window.LUAH_ENDPOINT || '';
var WHATS = '5571994035546';
var p = new URLSearchParams(location.search);
var tipo = (p.get('tipo')||'').toLowerCase().indexOf('mark')===0 ? 'marketing' : (p.get('tipo') ? 'show' : '');
var nome = (p.get('nome')||'').trim();
var f = document.getElementById('pq');
var Q = {
 show: [
  {id:'nota', t:'De 0 a 10, quanto você recomendaria o show do Bruno Luah a um amigo?', k:'nps'},
  {id:'destaque', t:'O que mais marcou o seu evento?', k:'txt'},
  {id:'extra', t:'O repertório combinou com o que vocês queriam?', k:'opt', o:['Sim','Em parte','Não']},
  {id:'atendimento', t:'Como foi o atendimento, do primeiro contato ao dia do show?', k:'stars'},
  {id:'melhorar', t:'Tem algo que poderíamos ter feito melhor?', k:'txt', opc:1},
  {id:'autoriza', t:'Podemos publicar o seu comentário e o seu primeiro nome no nosso site?', k:'opt', o:['Sim','Não']}
 ],
 marketing: [
  {id:'nota', t:'De 0 a 10, quanto você recomendaria a Luah Produção?', k:'nps'},
  {id:'destaque', t:'Que resultado do nosso trabalho você mais percebeu no seu negócio?', k:'txt'},
  {id:'atendimento', t:'A comunicação e os prazos atenderam o que você esperava?', k:'stars'},
  {id:'melhorar', t:'O que deveríamos melhorar ou passar a oferecer?', k:'txt', opc:1},
  {id:'autoriza', t:'Podemos publicar o seu comentário como depoimento no nosso site?', k:'opt', o:['Sim','Não']}
 ]
};
function el(h){var d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function render(){
 f.innerHTML='';
 var hi=document.getElementById('hi');
 if(hi) hi.textContent = nome ? ('Olá, '+nome.split(' ')[0]+'!') : 'Olá!';
 if(!nome) f.appendChild(el('<label class="q">Seu nome<input name="nome" required maxlength="60" autocomplete="name"></label>'));
 if(!tipo) f.appendChild(el('<fieldset class="q"><legend>Qual serviço você contratou?</legend><div class="opts"><label><input type="radio" name="tipo" value="show" required> Show ou música ao vivo</label><label><input type="radio" name="tipo" value="marketing"> Marketing, conteúdo ou cobertura</label></div></fieldset>'));
 var qs = Q[tipo||'show'];
 qs.forEach(function(q,i){
  var n=(i+1)+'. ', h;
  if(q.k==='nps'){h='<fieldset class="q"><legend>'+n+q.t+'</legend><div class="nps">';for(var v=0;v<=10;v++)h+='<label><input type="radio" name="nota" value="'+v+'" required><span>'+v+'</span></label>';h+='</div><div class="npsl"><span>Nada provável</span><span>Muito provável</span></div></fieldset>';}
  else if(q.k==='stars'){h='<fieldset class="q"><legend>'+n+q.t+'</legend><div class="stars">';for(var s=5;s>=1;s--)h+='<input type="radio" id="s'+s+'" name="atendimento" value="'+s+'" required><label for="s'+s+'" title="'+s+'">★</label>';h+='</div></fieldset>';}
  else if(q.k==='opt'){h='<fieldset class="q"><legend>'+n+q.t+'</legend><div class="opts">';q.o.forEach(function(o){h+='<label><input type="radio" name="'+q.id+'" value="'+o+'" required> '+o+'</label>';});h+='</div></fieldset>';}
  else h='<label class="q">'+n+q.t+(q.opc?' <small>(opcional)</small>':'')+'<textarea name="'+q.id+'" rows="3" maxlength="600"'+(q.opc?'':' required')+'></textarea></label>';
  f.appendChild(el(h));
 });
 f.appendChild(el('<button class="enviar" type="submit">Enviar respostas</button>'));
 if(!tipo) f.querySelectorAll('input[name=tipo]').forEach(function(r){r.addEventListener('change',function(){tipo=r.value;render();});});
}
f.addEventListener('submit',function(e){
 e.preventDefault();
 if(!f.reportValidity()) return;
 var d=new FormData(f), o={site:window.LUAH_SITE, tipo:tipo||d.get('tipo')||'show', nome:nome||d.get('nome')||''};
 ['nota','destaque','extra','atendimento','melhorar','autoriza'].forEach(function(k){o[k]=d.get(k)||'';});
 var b=f.querySelector('.enviar'); b.disabled=true; b.textContent='Enviando…';
 function done(){document.getElementById('box').innerHTML='<h2>Muito obrigado'+(o.nome?', '+esc(o.nome.split(' ')[0]):'')+'!</h2><p>Sua opinião ajuda a gente a fazer cada evento ainda melhor.</p><a class="enviar" href="'+window.LUAH_HOME+'">Voltar ao site</a>';window.scrollTo(0,0);}
 function zap(){var t='Pesquisa de satisfação ('+o.tipo+')\nNome: '+o.nome+'\nNota: '+o.nota+'\nDestaque: '+o.destaque+(o.extra?'\nRepertório: '+o.extra:'')+'\nAtendimento: '+o.atendimento+'/5\nMelhorar: '+o.melhorar+'\nAutoriza publicar: '+o.autoriza;location.href='https://wa.me/'+WHATS+'?text='+encodeURIComponent(t);}
 if(!ENDPOINT){zap();return;}
 fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o)}).then(done,function(){b.disabled=false;b.textContent='Enviar respostas';zap();});
});
render();
})();
