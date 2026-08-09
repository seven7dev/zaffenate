(() => {
  const menuBtn=document.querySelector('[data-menu]');
  const nav=document.querySelector('[data-nav]');
  if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const modal=document.querySelector('[data-gallery-modal]');
  if(!modal)return;
  const img=modal.querySelector('[data-gallery-image]'), title=modal.querySelector('[data-gallery-title]'), count=modal.querySelector('[data-gallery-count]');
  let items=[],index=0;
  const show=()=>{if(!items.length)return;img.src=items[index];img.alt=(title.textContent||'Galeria Zaffenate')+' — foto '+(index+1);count.textContent=`Imagem ${index+1} de ${items.length}`};
  document.querySelectorAll('[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>{items=JSON.parse(btn.dataset.gallery);index=0;title.textContent=btn.dataset.title||'Galeria';show();modal.classList.add('open');document.body.style.overflow='hidden'}));
  const close=()=>{modal.classList.remove('open');document.body.style.overflow=''};
  modal.querySelector('[data-close]').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});
  modal.querySelector('[data-prev]').addEventListener('click',()=>{index=(index-1+items.length)%items.length;show()});modal.querySelector('[data-next]').addEventListener('click',()=>{index=(index+1)%items.length;show()});
  addEventListener('keydown',e=>{if(!modal.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight'){index=(index+1)%items.length;show()}if(e.key==='ArrowLeft'){index=(index-1+items.length)%items.length;show()}})
})();
