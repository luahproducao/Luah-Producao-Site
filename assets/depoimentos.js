(function(){
var ENDPOINT = window.LUAH_ENDPOINT || '';
var box=document.getElementById('lista');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function card(d){var tag=d.tipo==='marketing'?'Marketing e conteúdo':'Show ao vivo';return '<figure class="dep"><div class="st" aria-label="Nota '+esc(d.nota)+' de 10">★★★★★</div><blockquote>“'+esc(d.texto)+'”</blockquote><figcaption>'+esc(d.nome||'Cliente')+' <span>· '+tag+(d.data?' · '+esc(d.data):'')+'</span></figcaption></figure>';}
if(!ENDPOINT) return;
fetch(ENDPOINT+'?site='+encodeURIComponent(window.LUAH_SITE)).then(function(r){return r.json();}).then(function(a){
 if(!a||!a.length) return;
 var h=a.map(card).join('');
 box.innerHTML=h+box.innerHTML;var v=document.getElementById('vazio');if(v)v.hidden=true;
 var c=document.getElementById('cont'); if(c) c.textContent=a.length+(a.length>1?' avaliações de clientes':' avaliação de cliente');
}).catch(function(){});
})();
